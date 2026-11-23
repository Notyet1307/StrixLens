package easmdrp

import (
	"bufio"
	"bytes"
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"net"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
)

var (
	reHTMLTitle    = regexp.MustCompile(`(?is)<title[^>]*>(.*?)</title>`)
	reWhitespace   = regexp.MustCompile(`\s+`)
	defaultPorts   = []int{80, 443, 8080, 8443, 21, 22, 23, 445, 1433, 3306, 3389, 5432, 6379, 9200, 27017}
	knownSvcByPort = map[int]string{
		21: "ftp", 22: "ssh", 23: "telnet", 80: "http", 443: "https",
		445: "smb", 1433: "mssql", 3306: "mysql", 3389: "rdp",
		5432: "postgresql", 6379: "redis", 8080: "http-alt", 8443: "https-alt",
		9200: "elasticsearch", 27017: "mongodb",
	}
	nonHTTPPorts = map[int]bool{
		21: true, 22: true, 23: true, 445: true, 1433: true,
		3306: true, 3389: true, 5432: true, 6379: true, 9200: true, 27017: true,
	}
)

// DetectAvailableEngines inspects local CLI tools and built-in defensive engines.
func DetectAvailableEngines() []EngineCapability {
	cliTools := []string{"amass", "subfinder", "httpx", "nmap", "gitleaks", "trufflehog"}
	caps := make([]EngineCapability, 0, len(cliTools)+4)
	for _, name := range cliTools {
		path, err := exec.LookPath(name)
		caps = append(caps, EngineCapability{
			Name:      name,
			Available: err == nil && strings.TrimSpace(path) != "",
			Path:      path,
			Kind:      "cli",
		})
	}
	builtins := []string{"ct_crtsh", "dns_resolver", "tcp_tls_http_probe", "cron_scheduler"}
	for _, name := range builtins {
		caps = append(caps, EngineCapability{
			Name:      name,
			Available: true,
			Kind:      "builtin",
		})
	}
	return caps
}

// DiscoveryBatch captures real assets discovered alongside engine telemetry and warnings.
type DiscoveryBatch struct {
	Assets        []DiscoveredAsset
	ExecutionMode string
	EnginesUsed   []string
	Warnings      []string
}

// AssetDiscoveryAdapter abstracts EASM discovery engines.
type AssetDiscoveryAdapter interface {
	Name() string
	Available() bool
	Discover(ctx context.Context, targetDomain string) ([]DiscoveredAsset, string, error)
	DiscoverWithOptions(ctx context.Context, target string, ports []int) (*DiscoveryBatch, error)
}

// CompositeDiscoveryAdapter runs real passive enumeration (subfinder/amass/crt.sh),
// real DNS resolution, and real defensive TCP/TLS/HTTP/banner probing.
type CompositeDiscoveryAdapter struct {
	SubfinderPath string
	AmassPath     string
	HTTPClient    *http.Client
	CTBaseURL     string
	LookupIP      func(ctx context.Context, host string) ([]net.IPAddr, error)
	ProbeTimeout  time.Duration
	MaxHosts      int
	DefaultPorts  []int
}

// NewCompositeDiscoveryAdapter constructs a real discovery engine using host binaries + built-in probers.
func NewCompositeDiscoveryAdapter() *CompositeDiscoveryAdapter {
	subfinder, _ := exec.LookPath("subfinder")
	amass, _ := exec.LookPath("amass")
	return &CompositeDiscoveryAdapter{
		SubfinderPath: subfinder,
		AmassPath:     amass,
		HTTPClient:    &http.Client{Timeout: 10 * time.Second},
		CTBaseURL:     "https://crt.sh",
		LookupIP:      net.DefaultResolver.LookupIPAddr,
		ProbeTimeout:  1500 * time.Millisecond,
		MaxHosts:      40,
		DefaultPorts:  append([]int(nil), defaultPorts...),
	}
}

// NewAmassAdapter returns the real composite discovery adapter for backward compatibility.
func NewAmassAdapter() *CompositeDiscoveryAdapter {
	return NewCompositeDiscoveryAdapter()
}

func (a *CompositeDiscoveryAdapter) Name() string {
	return "composite_easm_engine"
}

func (a *CompositeDiscoveryAdapter) Available() bool {
	return true
}

func (a *CompositeDiscoveryAdapter) Discover(ctx context.Context, targetDomain string) ([]DiscoveredAsset, string, error) {
	batch, err := a.DiscoverWithOptions(ctx, targetDomain, nil)
	if err != nil {
		return nil, "", err
	}
	return batch.Assets, batch.ExecutionMode, nil
}

// DiscoverWithOptions performs real discovery and active defensive probing with zero mock data.
func (a *CompositeDiscoveryAdapter) DiscoverWithOptions(ctx context.Context, rawTarget string, customPorts []int) (*DiscoveryBatch, error) {
	host, explicitPort, isIP, err := parseScanTarget(rawTarget)
	if err != nil {
		return nil, err
	}

	batch := &DiscoveryBatch{
		Assets:      make([]DiscoveredAsset, 0),
		EnginesUsed: make([]string, 0),
		Warnings:    make([]string, 0),
	}

	hosts := []string{host}
	seenHosts := map[string]bool{host: true}
	addHost := func(candidate string) {
		h := strings.TrimSpace(strings.ToLower(strings.TrimSuffix(candidate, ".")))
		h = strings.TrimPrefix(h, "*.")
		if h == "" || strings.ContainsAny(h, " \t\r\n/\\*") {
			return
		}
		if h != host && !strings.HasSuffix(h, "."+host) {
			return
		}
		if !seenHosts[h] {
			seenHosts[h] = true
			hosts = append(hosts, h)
		}
	}

	cliUsed := false
	if !isIP && !strings.EqualFold(host, "localhost") {
		if a.SubfinderPath != "" {
			if subs, err := runDomainCLI(ctx, 25*time.Second, a.SubfinderPath, "-silent", "-d", host); err == nil {
				cliUsed = true
				batch.EnginesUsed = append(batch.EnginesUsed, "subfinder")
				for _, s := range subs {
					addHost(s)
				}
			} else {
				batch.Warnings = append(batch.Warnings, "subfinder 执行失败: "+err.Error())
			}
		}
		if a.AmassPath != "" {
			if subs, err := runDomainCLI(ctx, 35*time.Second, a.AmassPath, "enum", "-passive", "-d", host, "-nocolor"); err == nil {
				cliUsed = true
				batch.EnginesUsed = append(batch.EnginesUsed, "amass")
				for _, s := range subs {
					addHost(s)
				}
			} else {
				batch.Warnings = append(batch.Warnings, "amass 执行失败: "+err.Error())
			}
		}
		if strings.TrimSpace(a.CTBaseURL) != "" {
			if subs, ctErr := a.queryCTLogs(ctx, host); ctErr == nil {
				batch.EnginesUsed = append(batch.EnginesUsed, "ct_crtsh")
				for _, s := range subs {
					addHost(s)
				}
			} else {
				batch.Warnings = append(batch.Warnings, "CT 日志(crt.sh)查询降级跳过: "+ctErr.Error())
			}
		}
	}

	maxHosts := a.MaxHosts
	if maxHosts <= 0 {
		maxHosts = 40
	}
	if len(hosts) > maxHosts {
		hosts = hosts[:maxHosts]
	}

	// Stage 2: Real DNS resolution.
	type resolvedHost struct {
		host string
		ip   string
	}
	resolved := make([]resolvedHost, 0, len(hosts))
	if isIP {
		resolved = append(resolved, resolvedHost{host: host, ip: host})
	} else {
		batch.EnginesUsed = append(batch.EnginesUsed, "dns_resolver")
		lookupFn := a.LookupIP
		if lookupFn == nil {
			lookupFn = net.DefaultResolver.LookupIPAddr
		}
		var mu sync.Mutex
		var wg sync.WaitGroup
		sem := make(chan struct{}, 8)
		for _, h := range hosts {
			wg.Add(1)
			go func(hostname string) {
				defer wg.Done()
				sem <- struct{}{}
				defer func() { <-sem }()
				dCtx, cancel := context.WithTimeout(ctx, 3*time.Second)
				defer cancel()
				addrs, lookupErr := lookupFn(dCtx, hostname)
				if lookupErr != nil || len(addrs) == 0 {
					return
				}
				chosen := pickPreferredIP(addrs)
				if chosen == "" {
					return
				}
				mu.Lock()
				resolved = append(resolved, resolvedHost{host: hostname, ip: chosen})
				mu.Unlock()
			}(h)
		}
		wg.Wait()
	}

	if len(resolved) == 0 {
		batch.ExecutionMode = "real_probe"
		batch.Warnings = append(batch.Warnings, fmt.Sprintf("目标 %s 未能解析到有效 IP 地址", host))
		return batch, nil
	}

	// Stage 3: Real TCP + TLS + HTTP + Banner probing.
	ports := a.effectivePorts(customPorts, explicitPort)
	batch.EnginesUsed = append(batch.EnginesUsed, "tcp_tls_http_probe")
	if cliUsed {
		batch.ExecutionMode = "cli+probe"
	} else {
		batch.ExecutionMode = "real_probe"
	}

	timeout := a.ProbeTimeout
	if timeout <= 0 {
		timeout = 1500 * time.Millisecond
	}

	var mu sync.Mutex
	var wg sync.WaitGroup
	sem := make(chan struct{}, 32)
	for _, rh := range resolved {
		for _, port := range ports {
			wg.Add(1)
			go func(target resolvedHost, p int) {
				defer wg.Done()
				sem <- struct{}{}
				defer func() { <-sem }()

				probe := ProbeEndpoint(ctx, target.host, target.ip, p, timeout)
				if !probe.Open {
					return
				}

				assetType := "subdomain"
				if isIP && target.host == target.ip {
					assetType = "ip"
				} else if probe.HTTPStatus > 0 {
					assetType = "web_service"
				} else if target.host == host && !isIP {
					assetType = "domain"
				}

				asset := DiscoveredAsset{
					AssetType:   assetType,
					Identifier:  fmt.Sprintf("%s:%d", target.host, p),
					IPAddress:   target.ip,
					Port:        p,
					ServiceName: probe.ServiceName,
					Fingerprint: probe.Fingerprint,
					Source:      batch.ExecutionMode,
				}
				mu.Lock()
				batch.Assets = append(batch.Assets, asset)
				mu.Unlock()
			}(rh, port)
		}
	}
	wg.Wait()

	sort.Slice(batch.Assets, func(i, j int) bool {
		if batch.Assets[i].Identifier == batch.Assets[j].Identifier {
			return batch.Assets[i].Port < batch.Assets[j].Port
		}
		return batch.Assets[i].Identifier < batch.Assets[j].Identifier
	})

	if len(batch.Assets) == 0 {
		batch.Warnings = append(batch.Warnings, fmt.Sprintf("已完成 %d 个主机 DNS 解析，但探测端口均未开放或超时", len(resolved)))
	}
	return batch, nil
}

func (a *CompositeDiscoveryAdapter) effectivePorts(custom []int, explicitPort int) []int {
	base := custom
	if len(base) == 0 {
		base = a.DefaultPorts
	}
	if len(base) == 0 {
		base = defaultPorts
	}
	seen := make(map[int]bool, len(base)+1)
	out := make([]int, 0, len(base)+1)
	if explicitPort > 0 && explicitPort <= 65535 {
		seen[explicitPort] = true
		out = append(out, explicitPort)
	}
	for _, p := range base {
		if p > 0 && p <= 65535 && !seen[p] {
			seen[p] = true
			out = append(out, p)
		}
	}
	return out
}

func (a *CompositeDiscoveryAdapter) queryCTLogs(ctx context.Context, domain string) ([]string, error) {
	base := strings.TrimRight(strings.TrimSpace(a.CTBaseURL), "/")
	reqURL := fmt.Sprintf("%s/?q=%s&output=json", base, url.QueryEscape("%."+domain))
	qCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	req, err := http.NewRequestWithContext(qCtx, http.MethodGet, reqURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "StrixLens-EASM/1.0")
	client := a.HTTPClient
	if client == nil {
		client = &http.Client{Timeout: 10 * time.Second}
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HTTP %d", resp.StatusCode)
	}
	body, err := io.ReadAll(io.LimitReader(resp.Body, 2*1024*1024))
	if err != nil {
		return nil, err
	}
	var rows []struct {
		NameValue string `json:"name_value"`
	}
	if err := json.Unmarshal(body, &rows); err != nil {
		return nil, err
	}
	out := make([]string, 0, len(rows))
	for _, r := range rows {
		for _, line := range strings.Split(r.NameValue, "\n") {
			if s := strings.TrimSpace(line); s != "" {
				out = append(out, s)
			}
		}
	}
	return out, nil
}

// EndpointProbeResult describes live observations from a defensive TCP/TLS/HTTP probe.
type EndpointProbeResult struct {
	Target      string
	Open        bool
	Error       string
	ServiceName string
	HTTPStatus  int
	TLSEnabled  bool
	TLSDaysLeft *int
	TLSExpired  bool
	Fingerprint map[string]interface{}
}

// ProbeEndpoint executes a real defensive TCP connect + TLS cert check + HTTP/banner read.
func ProbeEndpoint(ctx context.Context, host, ip string, port int, timeout time.Duration) EndpointProbeResult {
	if timeout <= 0 {
		timeout = 1500 * time.Millisecond
	}
	dialHost := strings.TrimSpace(ip)
	if dialHost == "" {
		dialHost = strings.TrimSpace(host)
	}
	addr := net.JoinHostPort(dialHost, strconv.Itoa(port))
	res := EndpointProbeResult{
		Target:      addr,
		ServiceName: knownSvcByPort[port],
		Fingerprint: map[string]interface{}{"probe": "tcp_connect"},
	}

	dialer := &net.Dialer{Timeout: timeout}
	conn, err := dialer.DialContext(ctx, "tcp", addr)
	if err != nil {
		res.Error = err.Error()
		return res
	}
	res.Open = true

	if nonHTTPPorts[port] {
		// Passive read-only banner grab without sending any active exploit payload.
		_ = conn.SetReadDeadline(time.Now().Add(700 * time.Millisecond))
		buf := make([]byte, 256)
		n, _ := conn.Read(buf)
		_ = conn.Close()
		if n > 0 {
			res.Fingerprint["banner"] = sanitizePrintable(buf[:n])
		}
		if res.ServiceName == "" {
			res.ServiceName = "tcp"
		}
		return res
	}
	_ = conn.Close()

	tryHTTPS := port == 443 || port == 8443 || port == 9443
	if tryHTTPS {
		probeTLSDetails(ctx, dialHost, host, port, timeout, &res)
		if probeHTTPDetails(ctx, "https", host, dialHost, port, timeout, &res) {
			return res
		}
	}

	if probeHTTPDetails(ctx, "http", host, dialHost, port, timeout, &res) {
		return res
	}

	if !tryHTTPS {
		if probeTLSDetails(ctx, dialHost, host, port, timeout, &res) {
			_ = probeHTTPDetails(ctx, "https", host, dialHost, port, timeout, &res)
		}
	}

	if res.ServiceName == "" {
		res.ServiceName = "tcp"
	}
	return res
}

func probeTLSDetails(ctx context.Context, dialHost, serverName string, port int, timeout time.Duration, res *EndpointProbeResult) bool {
	addr := net.JoinHostPort(dialHost, strconv.Itoa(port))
	tlsCfg := &tls.Config{
		InsecureSkipVerify: true, // Defensive certificate metadata inspection only.
	}
	if net.ParseIP(serverName) == nil && serverName != "" {
		tlsCfg.ServerName = serverName
	}
	tDialer := &tls.Dialer{
		NetDialer: &net.Dialer{Timeout: timeout},
		Config:    tlsCfg,
	}
	tCtx, cancel := context.WithTimeout(ctx, timeout+500*time.Millisecond)
	defer cancel()
	c, err := tDialer.DialContext(tCtx, "tcp", addr)
	if err != nil {
		return false
	}
	defer c.Close()
	tlsConn, ok := c.(*tls.Conn)
	if !ok {
		return false
	}
	state := tlsConn.ConnectionState()
	res.TLSEnabled = true
	if res.ServiceName == "" {
		res.ServiceName = "https"
	}
	if len(state.PeerCertificates) > 0 {
		cert := state.PeerCertificates[0]
		days := int(time.Until(cert.NotAfter).Hours() / 24)
		expired := time.Now().After(cert.NotAfter)
		res.TLSDaysLeft = &days
		res.TLSExpired = expired
		res.Fingerprint["tls_subject"] = cert.Subject.CommonName
		res.Fingerprint["tls_issuer"] = cert.Issuer.CommonName
		res.Fingerprint["tls_not_after"] = cert.NotAfter.UTC().Format(time.RFC3339)
		res.Fingerprint["tls_days_remaining"] = days
		res.Fingerprint["tls_expired"] = expired
	}
	return true
}

func probeHTTPDetails(ctx context.Context, scheme, hostHeader, dialHost string, port int, timeout time.Duration, res *EndpointProbeResult) bool {
	reqURL := fmt.Sprintf("%s://%s/", scheme, net.JoinHostPort(dialHost, strconv.Itoa(port)))
	hCtx, cancel := context.WithTimeout(ctx, timeout+1000*time.Millisecond)
	defer cancel()
	req, err := http.NewRequestWithContext(hCtx, http.MethodGet, reqURL, nil)
	if err != nil {
		return false
	}
	if hostHeader != "" && hostHeader != dialHost {
		req.Host = net.JoinHostPort(hostHeader, strconv.Itoa(port))
	}
	req.Header.Set("User-Agent", "StrixLens-EASM-Probe/1.0")

	transport := &http.Transport{
		TLSClientConfig: &tls.Config{
			InsecureSkipVerify: true, // Inspect target service response regardless of self-signed cert.
			ServerName:         hostHeader,
		},
		DisableKeepAlives: true,
	}
	client := &http.Client{
		Transport: transport,
		Timeout:   timeout + 1000*time.Millisecond,
		CheckRedirect: func(_ *http.Request, via []*http.Request) error {
			if len(via) >= 2 {
				return http.ErrUseLastResponse
			}
			return nil
		},
	}
	resp, err := client.Do(req)
	if err != nil {
		return false
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(io.LimitReader(resp.Body, 32*1024))
	res.HTTPStatus = resp.StatusCode
	if res.ServiceName == "" || res.ServiceName == "tcp" {
		res.ServiceName = scheme
	}
	res.Fingerprint["http_status"] = resp.StatusCode
	if srv := strings.TrimSpace(resp.Header.Get("Server")); srv != "" {
		res.Fingerprint["server"] = srv
	}
	if xp := strings.TrimSpace(resp.Header.Get("X-Powered-By")); xp != "" {
		res.Fingerprint["powered_by"] = xp
	}
	if m := reHTMLTitle.FindSubmatch(bodyBytes); len(m) > 1 {
		title := strings.TrimSpace(reWhitespace.ReplaceAllString(string(m[1]), " "))
		if len(title) > 120 {
			title = title[:120]
		}
		if title != "" {
			res.Fingerprint["title"] = title
		}
	}
	return true
}

func parseScanTarget(raw string) (host string, port int, isIP bool, err error) {
	s := strings.TrimSpace(raw)
	if s == "" {
		return "", 0, false, fmt.Errorf("target_domain 不能为空")
	}
	if strings.Contains(s, "://") {
		u, parseErr := url.Parse(s)
		if parseErr != nil || strings.TrimSpace(u.Host) == "" {
			return "", 0, false, fmt.Errorf("目标 URL 格式无效")
		}
		s = u.Host
	} else if idx := strings.IndexAny(s, "/?#"); idx >= 0 {
		s = s[:idx]
	}

	if h, pStr, splitErr := net.SplitHostPort(s); splitErr == nil && pStr != "" {
		if p, convErr := strconv.Atoi(pStr); convErr == nil && p > 0 && p <= 65535 {
			s = h
			port = p
		}
	}
	s = strings.Trim(strings.ToLower(strings.TrimSpace(s)), "[]")
	s = strings.TrimSuffix(s, ".")
	if s == "" || strings.ContainsAny(s, " \t\r\n/\\") {
		return "", 0, false, fmt.Errorf("无效的目标主机名或 IP")
	}
	return s, port, net.ParseIP(s) != nil, nil
}

func runDomainCLI(ctx context.Context, timeout time.Duration, bin string, args ...string) ([]string, error) {
	runCtx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()
	cmd := exec.CommandContext(runCtx, bin, args...)
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	if err := cmd.Run(); err != nil {
		msg := strings.TrimSpace(stderr.String())
		if msg == "" {
			msg = err.Error()
		}
		return nil, fmt.Errorf("%s", msg)
	}
	lines := strings.Split(stdout.String(), "\n")
	out := make([]string, 0, len(lines))
	for _, line := range lines {
		fields := strings.Fields(strings.TrimSpace(line))
		if len(fields) > 0 {
			out = append(out, fields[0])
		}
	}
	return out, nil
}

func pickPreferredIP(addrs []net.IPAddr) string {
	for _, a := range addrs {
		if v4 := a.IP.To4(); v4 != nil {
			return v4.String()
		}
	}
	if len(addrs) > 0 && addrs[0].IP != nil {
		return addrs[0].IP.String()
	}
	return ""
}

func sanitizePrintable(raw []byte) string {
	var b strings.Builder
	for _, ch := range raw {
		if ch >= 32 && ch <= 126 {
			b.WriteByte(ch)
		} else if ch == '\n' || ch == '\r' || ch == '\t' {
			b.WriteByte(' ')
		}
	}
	return strings.TrimSpace(reWhitespace.ReplaceAllString(b.String(), " "))
}

// SecretScanAdapter abstracts Gitleaks / TruffleHog CLI or defensive regex/entropy scanners.
type SecretScanAdapter interface {
	Name() string
	Available() bool
	ScanText(ctx context.Context, targetRef, content string, keywords []string) ([]RawLeakFinding, error)
}

// GitleaksTruffleHogAdapter combines Gitleaks (fast rule/regex) and TruffleHog (deep history/verification).
type GitleaksTruffleHogAdapter struct {
	GitleaksPath   string
	TruffleHogPath string
}

func NewGitleaksTruffleHogAdapter() *GitleaksTruffleHogAdapter {
	gl, _ := exec.LookPath("gitleaks")
	th, _ := exec.LookPath("trufflehog")
	return &GitleaksTruffleHogAdapter{
		GitleaksPath:   gl,
		TruffleHogPath: th,
	}
}

func (g *GitleaksTruffleHogAdapter) Name() string {
	return "gitleaks_trufflehog"
}

func (g *GitleaksTruffleHogAdapter) Available() bool {
	return g.GitleaksPath != "" || g.TruffleHogPath != ""
}

// ParseGitleaksJSON normalizes raw Gitleaks JSON output into RawLeakFinding records.
func ParseGitleaksJSON(raw []byte, ruleID int64) ([]RawLeakFinding, error) {
	var items []struct {
		Description string `json:"Description"`
		RuleID      string `json:"RuleID"`
		File        string `json:"File"`
		Commit      string `json:"Commit"`
		Author      string `json:"Author"`
		Email       string `json:"Email"`
		Match       string `json:"Match"`
		Secret      string `json:"Secret"`
	}
	if err := json.Unmarshal(raw, &items); err != nil {
		return nil, err
	}
	out := make([]RawLeakFinding, 0, len(items))
	for _, it := range items {
		snippet := it.Match
		if snippet == "" {
			snippet = it.Secret
		}
		out = append(out, RawLeakFinding{
			RuleID:         ruleID,
			ChannelGroup:   ChannelCodeRepo,
			SourcePlatform: "Git (Gitleaks)",
			LeakType:       "api_key",
			Severity:       "high",
			Title:          fmt.Sprintf("Gitleaks 命中规则 %s：%s", it.RuleID, it.File),
			SourceRef:      fmt.Sprintf("%s@%s", it.File, it.Commit),
			MatchedRule:    it.RuleID,
			RawSnippet:     snippet,
			AffectedEntity: firstNonEmptyStr(it.Email, it.File),
			DetectedAt:     time.Now().UTC(),
		})
	}
	return out, nil
}

// ParseTruffleHogJSON parses NDJSON output from `trufflehog --json`.
func ParseTruffleHogJSON(raw []byte, ruleID int64) ([]RawLeakFinding, error) {
	out := make([]RawLeakFinding, 0)
	scanner := bufio.NewScanner(bytes.NewReader(raw))
	scanner.Buffer(make([]byte, 4096), 1024*1024)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" {
			continue
		}
		var item struct {
			DetectorName string `json:"DetectorName"`
			Raw          string `json:"Raw"`
			Verified     bool   `json:"Verified"`
			SourceName   string `json:"SourceName"`
		}
		if err := json.Unmarshal([]byte(line), &item); err != nil || item.DetectorName == "" {
			continue
		}
		sev := "high"
		if item.Verified {
			sev = "critical"
		}
		out = append(out, RawLeakFinding{
			RuleID:         ruleID,
			ChannelGroup:   ChannelCodeRepo,
			SourcePlatform: "Git (TruffleHog)",
			LeakType:       "api_key",
			Severity:       sev,
			Title:          fmt.Sprintf("TruffleHog 检测到 %s 凭据", item.DetectorName),
			SourceRef:      firstNonEmptyStr(item.SourceName, "trufflehog"),
			MatchedRule:    "trufflehog:" + item.DetectorName,
			RawSnippet:     item.Raw,
			AffectedEntity: firstNonEmptyStr(item.SourceName, item.DetectorName),
			DetectedAt:     time.Now().UTC(),
		})
	}
	return out, scanner.Err()
}

// ScanLocalPath runs gitleaks CLI if installed on rootPath, or falls back to bounded real regex scanning.
func (g *GitleaksTruffleHogAdapter) ScanLocalPath(ctx context.Context, rootPath string, keywords []string) ([]RawLeakFinding, error) {
	info, err := os.Stat(rootPath)
	if err != nil {
		return nil, fmt.Errorf("本地路径不可访问: %w", err)
	}
	if !info.IsDir() {
		return nil, fmt.Errorf("目标路径不是目录: %s", rootPath)
	}

	if g.GitleaksPath != "" {
		runCtx, cancel := context.WithTimeout(ctx, 45*time.Second)
		defer cancel()
		cmd := exec.CommandContext(runCtx, g.GitleaksPath, "detect", "--source", rootPath, "--report-format", "json", "--report-path", "-", "--no-banner", "--exit-code", "0")
		var stdout, stderr bytes.Buffer
		cmd.Stdout = &stdout
		cmd.Stderr = &stderr
		if runErr := cmd.Run(); runErr == nil && len(bytes.TrimSpace(stdout.Bytes())) > 0 {
			if parsed, parseErr := ParseGitleaksJSON(stdout.Bytes(), 0); parseErr == nil {
				return parsed, nil
			}
		}
	}

	findings := make([]RawLeakFinding, 0)
	scanned := 0
	walkErr := filepath.WalkDir(rootPath, func(p string, d fs.DirEntry, wErr error) error {
		if wErr != nil {
			return nil
		}
		if d.IsDir() {
			name := d.Name()
			if name == ".git" || name == "node_modules" || name == "vendor" || name == ".builds" {
				return filepath.SkipDir
			}
			return nil
		}
		if scanned >= 200 {
			return fs.SkipAll
		}
		fi, statErr := d.Info()
		if statErr != nil || fi.Size() <= 0 || fi.Size() > 256*1024 {
			return nil
		}
		data, readErr := os.ReadFile(p)
		if readErr != nil || bytes.IndexByte(data, 0) >= 0 {
			return nil
		}
		scanned++
		rel, _ := filepath.Rel(rootPath, p)
		matches, _ := g.ScanText(ctx, "file://"+filepath.ToSlash(rel), string(data), keywords)
		findings = append(findings, matches...)
		return nil
	})
	if walkErr != nil && walkErr != fs.SkipAll {
		return findings, walkErr
	}
	return findings, nil
}

// ScanText performs real pattern matching (compatible with Gitleaks rule semantics) on text snippets.
func (g *GitleaksTruffleHogAdapter) ScanText(_ context.Context, targetRef, content string, keywords []string) ([]RawLeakFinding, error) {
	findings := make([]RawLeakFinding, 0)
	now := time.Now().UTC()

	type detector struct {
		name     string
		leakType string
		severity string
		match    func(string) string
	}
	detectors := []detector{
		{name: "aws-access-key", leakType: "api_key", severity: "critical", match: reAWSKey.FindString},
		{name: "github-token", leakType: "api_key", severity: "critical", match: reGitHubToken.FindString},
		{name: "github-pat", leakType: "api_key", severity: "critical", match: reGitHubPAT.FindString},
		{name: "jwt-secret", leakType: "credential_alert", severity: "high", match: reJWT.FindString},
		{name: "kv-secret", leakType: "credential_alert", severity: "high", match: reKVSecret.FindString},
	}

	for _, d := range detectors {
		if m := d.match(content); m != "" {
			findings = append(findings, RawLeakFinding{
				ChannelGroup:   ChannelCodeRepo,
				SourcePlatform: "Code Scanner",
				LeakType:       d.leakType,
				Severity:       d.severity,
				Title:          fmt.Sprintf("代码仓库敏感凭据泄露（%s）", d.name),
				SourceRef:      targetRef,
				MatchedRule:    d.name,
				RawSnippet:     m,
				AffectedEntity: targetRef,
				DetectedAt:     now,
			})
		}
	}

	lowerContent := strings.ToLower(content)
	for _, kw := range keywords {
		k := strings.TrimSpace(kw)
		if k != "" && strings.Contains(lowerContent, strings.ToLower(k)) && len(findings) == 0 {
			findings = append(findings, RawLeakFinding{
				ChannelGroup:   ChannelCodeRepo,
				SourcePlatform: "Code Scanner",
				LeakType:       "source_code",
				Severity:       "medium",
				Title:          fmt.Sprintf("代码内容命中监测关键词「%s」", k),
				SourceRef:      targetRef,
				MatchedRule:    "keyword:" + k,
				RawSnippet:     excerptAround(content, k, 160),
				AffectedEntity: targetRef,
				DetectedAt:     now,
			})
		}
	}
	return findings, nil
}

func excerptAround(text, kw string, maxLen int) string {
	idx := strings.Index(strings.ToLower(text), strings.ToLower(kw))
	if idx < 0 {
		if len(text) > maxLen {
			return text[:maxLen]
		}
		return text
	}
	start := idx - 40
	if start < 0 {
		start = 0
	}
	end := idx + len(kw) + 80
	if end > len(text) {
		end = len(text)
	}
	return strings.TrimSpace(text[start:end])
}

func firstNonEmptyStr(vals ...string) string {
	for _, v := range vals {
		if s := strings.TrimSpace(v); s != "" {
			return s
		}
	}
	return ""
}
