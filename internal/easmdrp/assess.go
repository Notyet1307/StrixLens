package easmdrp

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/url"
	"os/exec"
	"strconv"
	"strings"
	"time"
)

// AssessmentBatch is the result of an authorized exposure review.
// It records service fingerprints and risky public consoles. It does not run exploit scripts.
type AssessmentBatch struct {
	Engines []string
	Notes   []string
	Assets  []DiscoveredAsset
}

// ClassifyExposure returns a risk level and operator-facing notes for an already observed asset.
func ClassifyExposure(asset DiscoveredAsset) (string, []string) {
	title := fingerprintString(asset.Fingerprint, "title")
	version := fingerprintString(asset.Fingerprint, "service_version")
	tech := fingerprintString(asset.Fingerprint, "technologies")
	haystack := strings.ToLower(strings.Join([]string{title, asset.ServiceName, version, tech}, " "))
	notes := make([]string, 0, 3)
	for _, hint := range []string{"phpmyadmin", "adminer", "jenkins", "grafana", "kibana", "nacos", "swagger", "druid", "minio", "rabbitmq", "solr"} {
		if strings.Contains(haystack, hint) {
			notes = append(notes, "疑似管理入口或敏感控制台："+hint)
			break
		}
	}
	if strings.Contains(strings.ToLower(title), "index of") {
		notes = append(notes, "Web 目录列表可被公开访问")
	}
	if version != "" && !strings.Contains(strings.Join(notes, " "), version) {
		notes = append(notes, "识别到服务版本："+version)
	}
	level := "info"
	if len(notes) > 0 {
		level = "high"
	}
	if _, risky := HighRiskPorts[asset.Port]; risky && (asset.Port == 23 || asset.Port == 445 || asset.Port == 6379 || asset.Port == 9200 || asset.Port == 27017) {
		level = "critical"
	}
	return level, notes
}

// AssessExposedAssets refreshes fingerprints with the built-in probe and, when installed,
// nmap service detection and httpx technology detection. NSE exploit scripts are never enabled.
func AssessExposedAssets(ctx context.Context, assets []DiscoveredAsset, limit int) AssessmentBatch {
	if limit <= 0 || limit > 20 {
		limit = 12
	}
	if len(assets) > limit {
		assets = append([]DiscoveredAsset(nil), assets[:limit]...)
	} else {
		assets = append([]DiscoveredAsset(nil), assets...)
	}
	batch := AssessmentBatch{
		Engines: []string{"builtin_exposure_review"},
		Assets:  make([]DiscoveredAsset, 0, len(assets)),
	}
	nmapPath, _ := exec.LookPath("nmap")
	httpxPath, _ := exec.LookPath("httpx")
	if nmapPath != "" {
		batch.Engines = append(batch.Engines, "nmap")
	} else {
		batch.Notes = append(batch.Notes, "未检测到 nmap，已跳过服务版本识别")
	}
	if httpxPath != "" {
		batch.Engines = append(batch.Engines, "httpx")
	} else {
		batch.Notes = append(batch.Notes, "未检测到 httpx，已使用内置 HTTP 复核")
	}

	targets := make([]assessTarget, 0, len(assets))
	for i := range assets {
		host, port := resolveEndpointTarget(assets[i].Identifier, assets[i].IPAddress, assets[i].Port)
		if host == "" || port <= 0 || strings.ContainsAny(host, " \t;|&$`\\") {
			continue
		}
		targets = append(targets, assessTarget{idx: i, host: host, port: port})
		probe := ProbeEndpoint(ctx, host, assets[i].IPAddress, port, 2*time.Second)
		fp := cloneFingerprint(assets[i].Fingerprint)
		if probe.Open {
			if probe.ServiceName != "" {
				assets[i].ServiceName = probe.ServiceName
			}
			for k, v := range probe.Fingerprint {
				fp[k] = v
			}
			fp["assessed_port_open"] = true
		} else {
			fp["assessed_port_open"] = false
		}
		assets[i].Fingerprint = fp
	}

	if nmapPath != "" {
		applyNmapVersions(ctx, nmapPath, assets, targets)
	}
	if httpxPath != "" {
		applyHttpxTech(ctx, httpxPath, assets, targets)
	}

	for i := range assets {
		level, notes := ClassifyExposure(assets[i])
		if len(notes) > 0 {
			fp := cloneFingerprint(assets[i].Fingerprint)
			fp["exposure_findings"] = notes
			assets[i].Fingerprint = fp
			if assets[i].RiskLevel == "" || assets[i].RiskLevel == "low" || assets[i].RiskLevel == "info" || level == "critical" {
				assets[i].RiskLevel = level
			}
		}
		assets[i].Source = firstNonEmptyStr(assets[i].Source, "exposure_assess")
		batch.Assets = append(batch.Assets, assets[i])
	}
	return batch
}

type assessTarget struct {
	idx  int
	host string
	port int
}

func applyNmapVersions(ctx context.Context, nmapPath string, assets []DiscoveredAsset, targets []assessTarget) {
	byHost := map[string][]assessTarget{}
	for _, t := range targets {
		byHost[t.host] = append(byHost[t.host], t)
	}
	hostsDone := 0
	for host, group := range byHost {
		if hostsDone >= 5 {
			break
		}
		hostsDone++
		ports := make([]string, 0, len(group))
		for _, t := range group {
			ports = append(ports, strconv.Itoa(t.port))
		}
		runCtx, cancel := context.WithTimeout(ctx, 20*time.Second)
		cmd := exec.CommandContext(runCtx, nmapPath, "-sT", "-sV", "--version-light", "-Pn", "-n", "--open", "-p", strings.Join(ports, ","), host)
		var stdout, stderr bytes.Buffer
		cmd.Stdout = &stdout
		cmd.Stderr = &stderr
		err := cmd.Run()
		cancel()
		if err != nil && stdout.Len() == 0 {
			continue
		}
		found := ParseNmapServices(stdout.String())
		for _, t := range group {
			svc, ok := found[t.port]
			if !ok {
				continue
			}
			fp := cloneFingerprint(assets[t.idx].Fingerprint)
			if svc.Name != "" {
				assets[t.idx].ServiceName = svc.Name
				fp["nmap_service"] = svc.Name
			}
			if svc.Version != "" {
				fp["service_version"] = svc.Version
			}
			assets[t.idx].Fingerprint = fp
		}
	}
}

// NmapService is a parsed open-service line from nmap -sV output.
type NmapService struct {
	Name    string
	Version string
}

// ParseNmapServices extracts open TCP services from nmap normal output.
func ParseNmapServices(output string) map[int]NmapService {
	out := map[int]NmapService{}
	sc := bufio.NewScanner(strings.NewReader(output))
	for sc.Scan() {
		fields := strings.Fields(sc.Text())
		if len(fields) < 3 || !strings.Contains(fields[0], "/tcp") || fields[1] != "open" {
			continue
		}
		port, err := strconv.Atoi(strings.Split(fields[0], "/")[0])
		if err != nil || port <= 0 {
			continue
		}
		version := ""
		if len(fields) > 3 {
			version = strings.Join(fields[3:], " ")
		}
		out[port] = NmapService{Name: fields[2], Version: version}
	}
	return out
}

func applyHttpxTech(ctx context.Context, httpxPath string, assets []DiscoveredAsset, targets []assessTarget) {
	args := []string{"-silent", "-json", "-title", "-status-code", "-tech-detect", "-timeout", "5", "-no-color"}
	added := 0
	for _, t := range targets {
		if added >= 12 {
			break
		}
		scheme := "http"
		if t.port == 443 || t.port == 8443 || strings.Contains(strings.ToLower(assets[t.idx].ServiceName), "https") {
			scheme = "https"
		}
		args = append(args, "-u", fmt.Sprintf("%s://%s/", scheme, joinHostPort(t.host, t.port)))
		added++
	}
	if added == 0 {
		return
	}
	runCtx, cancel := context.WithTimeout(ctx, 25*time.Second)
	defer cancel()
	cmd := exec.CommandContext(runCtx, httpxPath, args...)
	var stdout bytes.Buffer
	cmd.Stdout = &stdout
	if err := cmd.Run(); err != nil && stdout.Len() == 0 {
		return
	}
	techByPort := ParseHttpxJSONLines(stdout.Bytes())
	for _, t := range targets {
		info, ok := techByPort[joinHostPort(t.host, t.port)]
		if !ok {
			continue
		}
		fp := cloneFingerprint(assets[t.idx].Fingerprint)
		if info.Title != "" {
			fp["title"] = info.Title
		}
		if info.Status > 0 {
			fp["http_status"] = info.Status
		}
		if len(info.Tech) > 0 {
			fp["technologies"] = strings.Join(info.Tech, ", ")
		}
		assets[t.idx].Fingerprint = fp
	}
}

type httpxInfo struct {
	Title  string
	Status int
	Tech   []string
}

// ParseHttpxJSONLines reads httpx -json output and keys results by host:port.
func ParseHttpxJSONLines(raw []byte) map[string]httpxInfo {
	out := map[string]httpxInfo{}
	for _, line := range bytes.Split(raw, []byte("\n")) {
		line = bytes.TrimSpace(line)
		if len(line) == 0 || line[0] != '{' {
			continue
		}
		var row struct {
			URL        string   `json:"url"`
			Title      string   `json:"title"`
			StatusCode int      `json:"status_code"`
			Tech       []string `json:"tech"`
		}
		if json.Unmarshal(line, &row) != nil || row.URL == "" {
			continue
		}
		host, port := hostPortFromURL(row.URL)
		if host == "" {
			continue
		}
		if port <= 0 {
			port = 80
		}
		out[joinHostPort(host, port)] = httpxInfo{Title: row.Title, Status: row.StatusCode, Tech: row.Tech}
	}
	return out
}

func joinHostPort(host string, port int) string {
	return fmt.Sprintf("%s:%d", host, port)
}

func hostPortFromURL(raw string) (string, int) {
	u, err := url.Parse(strings.TrimSpace(raw))
	if err != nil || u.Host == "" {
		return resolveEndpointTarget(raw, "", 0)
	}
	return resolveEndpointTarget(u.Host, "", 0)
}

func cloneFingerprint(in map[string]interface{}) map[string]interface{} {
	out := map[string]interface{}{}
	for k, v := range in {
		out[k] = v
	}
	return out
}

func fingerprintString(fp map[string]interface{}, key string) string {
	if len(fp) == 0 {
		return ""
	}
	switch v := fp[key].(type) {
	case string:
		return strings.TrimSpace(v)
	default:
		return ""
	}
}
