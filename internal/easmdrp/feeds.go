package easmdrp

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"
)

func isGitLabEndpoint(ep string) bool {
	u, err := url.Parse(strings.TrimSpace(ep))
	if err != nil || u.Hostname() == "" {
		return false
	}
	host := strings.ToLower(u.Hostname())
	return host == "gitlab.com" || strings.Contains(host, "gitlab") || strings.Contains(strings.ToLower(u.Path), "/api/v4")
}

func isGiteeEndpoint(ep string) bool {
	u, err := url.Parse(strings.TrimSpace(ep))
	if err != nil || u.Hostname() == "" {
		return false
	}
	host := strings.ToLower(u.Hostname())
	return strings.Contains(host, "gitee") || strings.Contains(strings.ToLower(u.Path), "/api/v5")
}

func gitlabAPIBase(ep string) string {
	trimmed := strings.TrimRight(strings.TrimSpace(ep), "/")
	lower := strings.ToLower(trimmed)
	if idx := strings.Index(lower, "/api/v4"); idx >= 0 {
		return trimmed[:idx] + "/api/v4"
	}
	return trimmed + "/api/v4"
}

func giteeAPIBase(ep string) string {
	trimmed := strings.TrimRight(strings.TrimSpace(ep), "/")
	lower := strings.ToLower(trimmed)
	if idx := strings.Index(lower, "/api/v5"); idx >= 0 {
		return trimmed[:idx] + "/api/v5"
	}
	u, err := url.Parse(trimmed)
	if err != nil || u.Scheme == "" || u.Host == "" {
		return "https://gitee.com/api/v5"
	}
	return u.Scheme + "://" + u.Host + "/api/v5"
}

func isMISPEndpoint(ep string) bool {
	u, err := url.Parse(strings.TrimSpace(ep))
	if err != nil {
		return false
	}
	p := strings.ToLower(u.Path)
	return strings.Contains(p, "/events") || strings.Contains(p, "/attributes")
}

func useHTMLSearch(ep string) bool {
	u, err := url.Parse(strings.TrimSpace(ep))
	if err != nil || u.Hostname() == "" {
		return false
	}
	host := strings.ToLower(u.Hostname())
	if strings.Contains(host, "bing.com") || strings.Contains(host, "duckduckgo.com") || host == "baidu.com" || host == "www.baidu.com" {
		return true
	}
	return strings.HasSuffix(strings.ToLower(strings.TrimRight(u.Path, "/")), "/html") || u.Query().Get("format") == "html"
}

func htmlSearchParams(ep, q string) map[string]string {
	u, _ := url.Parse(ep)
	host := ""
	if u != nil {
		host = strings.ToLower(u.Hostname())
	}
	if strings.Contains(host, "baidu.com") {
		return map[string]string{"wd": q}
	}
	return map[string]string{"q": q}
}

// SourceQueries builds one public-index query per selected platform.
func SourceQueries(channel string, ids []string, keyword string) []string {
	k := strings.TrimSpace(keyword)
	if k == "" {
		return nil
	}
	sources := SelectedSources(channel, ids)
	if len(sources) == 0 {
		return []string{k}
	}
	out := make([]string, 0, len(sources))
	for _, s := range sources {
		if len(s.Domains) == 0 {
			out = append(out, k+" \""+s.Name+"\"")
			continue
		}
		sites := make([]string, 0, len(s.Domains))
		for _, d := range s.Domains {
			sites = append(sites, "site:"+d)
		}
		out = append(out, k+" ("+strings.Join(sites, " OR ")+")")
	}
	if len(out) > 12 {
		return out[:12]
	}
	return out
}

// ProviderCovers reports whether a connector should run for the rule's selected platforms.
// An empty selection or the channel id means every connector in that channel applies.
func ProviderCovers(providerID, channel string, sources []string) bool {
	if len(sources) == 0 {
		return true
	}
	for _, s := range sources {
		if s == channel {
			return true
		}
	}
	covered := providerSourceIDs(providerID)
	if len(covered) == 0 {
		return true
	}
	for _, s := range sources {
		for _, c := range covered {
			if s == c {
				return true
			}
		}
	}
	return false
}

func providerSourceIDs(providerID string) []string {
	switch providerID {
	case "conn_code_gitleaks":
		return []string{"github", "local_repo"}
	case "conn_code_gitlab":
		return []string{"gitlab"}
	case "conn_code_gitee":
		return []string{"gitee"}
	case "conn_platform_email":
		return []string{"corp_email"}
	case "conn_platform_public":
		return []string{"new_media", "mobile_app", "wechat", "weibo", "douyin", "tencent_myapp", "huawei_app", "apple_app"}
	default:
		return nil
	}
}

// LabelCatalogSource maps licensed-feed text onto a configured platform name.
func LabelCatalogSource(channel, text string) string {
	lower := strings.ToLower(text)
	for _, s := range SourceCatalog() {
		if s.ChannelGroup != channel {
			continue
		}
		if strings.Contains(lower, strings.ToLower(s.Name)) || strings.Contains(lower, strings.ToLower(s.ID)) {
			return s.Name
		}
	}
	return ""
}

func fetchMISPEvents(ctx context.Context, client *http.Client, cfg ConnectorRuntimeConfig, channel string, keywords []string) ([]RawLeakFinding, error) {
	ep := strings.TrimSpace(cfg.EndpointURL)
	secret := strings.TrimSpace(cfg.APIKeySecret)
	if ep == "" || secret == "" {
		return nil, fmt.Errorf("%w: 请配置已授权的 MISP 地址与 API Key", ErrConnectorUnconfigured)
	}
	if len(keywords) == 0 {
		return nil, nil
	}
	searchURL := ep
	if !strings.Contains(strings.ToLower(searchURL), "restsearch") {
		u, err := url.Parse(ep)
		if err != nil || u.Scheme == "" || u.Host == "" {
			return nil, fmt.Errorf("MISP 地址无效")
		}
		searchURL = u.Scheme + "://" + u.Host + "/events/restSearch"
	}
	defaultPlatform := "授权情报源"
	if channel == ChannelStealerCTI {
		defaultPlatform = "失窃数据预警"
	}
	out := make([]RawLeakFinding, 0)
	for _, kw := range keywords {
		k := strings.TrimSpace(kw)
		if k == "" {
			continue
		}
		body, _ := json.Marshal(map[string]interface{}{
			"returnFormat": "json",
			"limit":        20,
			"value":        k,
			"searchall":    k,
		})
		status, respBody, err := doHTTPRequest(ctx, client, http.MethodPost, searchURL, body, map[string]string{
			"Authorization": secret,
			"Accept":        "application/json",
			"Content-Type":  "application/json",
			"User-Agent":    "StrixLens-DRP/1.0",
		})
		if err != nil {
			return nil, err
		}
		if status >= 400 {
			return nil, fmt.Errorf("MISP 返回 HTTP %d: %s", status, truncateErr(respBody))
		}
		out = append(out, parseMISPEvents(respBody, channel, defaultPlatform, k)...)
	}
	return out, nil
}

func parseMISPEvents(body []byte, channel, defaultPlatform, kw string) []RawLeakFinding {
	var payload struct {
		Response []struct {
			Event struct {
				ID          string `json:"id"`
				Info        string `json:"info"`
				Date        string `json:"date"`
				ThreatLevel string `json:"threat_level_id"`
				Attribute   []struct {
					Type    string `json:"type"`
					Value   string `json:"value"`
					Comment string `json:"comment"`
				} `json:"Attribute"`
			} `json:"Event"`
		} `json:"response"`
	}
	if json.Unmarshal(body, &payload) != nil {
		return nil
	}
	out := make([]RawLeakFinding, 0)
	for _, item := range payload.Response {
		ev := item.Event
		text := ev.Info
		for _, attr := range ev.Attribute {
			text += " " + attr.Type + " " + attr.Comment
		}
		platform := firstNonEmptyStr(LabelCatalogSource(channel, text), defaultPlatform)
		sev := "medium"
		if ev.ThreatLevel == "1" {
			sev = "critical"
		} else if ev.ThreatLevel == "2" {
			sev = "high"
		}
		snippet := ev.Info
		if len(ev.Attribute) > 0 {
			attr := ev.Attribute[0]
			snippet = firstNonEmptyStr(attr.Comment, attr.Type+":"+attr.Value, ev.Info)
		}
		detected := parseTimeOrNow(ev.Date)
		if t, err := time.Parse("2006-01-02", strings.TrimSpace(ev.Date)); err == nil {
			detected = t.UTC()
		}
		out = append(out, RawLeakFinding{
			ChannelGroup:   channel,
			SourcePlatform: platform,
			LeakType:       "credential_alert",
			Severity:       sev,
			Title:          firstNonEmptyStr(ev.Info, "授权情报源命中「"+kw+"」"),
			SourceRef:      "misp://event/" + firstNonEmptyStr(ev.ID, kw),
			MatchedRule:    "misp:" + channel,
			RawSnippet:     snippet,
			AffectedEntity: kw,
			DetectedAt:     detected,
		})
	}
	return out
}

var reHTMLHref = regexp.MustCompile(`(?i)href=["'](https?://[^"'>\s]+)["']`)

func (p *codeRepoProvider) routeCodeHost(ctx context.Context, cfg ConnectorRuntimeConfig, ep, secret string, keywords []string) ([]RawLeakFinding, bool, error) {
	id := p.meta.ID
	switch {
	case isGitLabEndpoint(ep) || (id == "conn_code_gitlab" && ep == ""):
		if ep == "" || secret == "" {
			return nil, true, fmt.Errorf("%w: 请配置 GitLab 地址（如 https://gitlab.com）与 Private Token", ErrConnectorUnconfigured)
		}
		out, err := p.fetchGitLab(ctx, ep, secret, keywords)
		return out, true, err
	case isGiteeEndpoint(ep) || (id == "conn_code_gitee" && ep == ""):
		if ep == "" || secret == "" {
			return nil, true, fmt.Errorf("%w: 请配置 Gitee 地址（如 https://gitee.com）与私人令牌", ErrConnectorUnconfigured)
		}
		out, err := p.fetchGitee(ctx, ep, secret, keywords)
		return out, true, err
	default:
		return nil, false, nil
	}
}

func (p *codeRepoProvider) fetchGitLab(ctx context.Context, ep, secret string, keywords []string) ([]RawLeakFinding, error) {
	base := gitlabAPIBase(ep)
	all := make([]RawLeakFinding, 0)
	for _, kw := range keywords {
		k := strings.TrimSpace(kw)
		if k == "" {
			continue
		}
		u, err := appendQueryParams(base+"/search", map[string]string{"scope": "blobs", "search": k, "per_page": "20"})
		if err != nil {
			return nil, err
		}
		status, body, err := doHTTPRequest(ctx, p.client, http.MethodGet, u, nil, map[string]string{
			"PRIVATE-TOKEN": secret,
			"User-Agent":    "StrixLens-DRP/1.0",
		})
		if err != nil {
			return nil, err
		}
		if status >= 400 {
			return nil, fmt.Errorf("GitLab 代码检索返回 HTTP %d: %s", status, truncateErr(body))
		}
		parsed, err := p.parseGitLabBlobs(ctx, body, k, keywords)
		if err != nil {
			return nil, err
		}
		all = append(all, parsed...)
	}
	return all, nil
}

func (p *codeRepoProvider) parseGitLabBlobs(ctx context.Context, body []byte, kw string, allKeywords []string) ([]RawLeakFinding, error) {
	var items []struct {
		Basename  string `json:"basename"`
		Path      string `json:"path"`
		Data      string `json:"data"`
		ProjectID int64  `json:"project_id"`
		Ref       string `json:"ref"`
	}
	if err := json.Unmarshal(body, &items); err != nil {
		return nil, fmt.Errorf("解析 GitLab 代码检索响应失败: %w", err)
	}
	now := time.Now().UTC()
	out := make([]RawLeakFinding, 0, len(items))
	for _, it := range items {
		snippet := strings.TrimSpace(it.Data)
		if snippet == "" {
			snippet = fmt.Sprintf("GitLab 项目 %d 文件 %s 命中检索词 %s", it.ProjectID, it.Path, kw)
		}
		ref := fmt.Sprintf("gitlab://projects/%d/blob/%s/%s", it.ProjectID, firstNonEmptyStr(it.Ref, "HEAD"), it.Path)
		entity := firstNonEmptyStr(it.Path, it.Basename, fmt.Sprintf("project-%d", it.ProjectID))
		secretMatches, _ := p.scanner.ScanText(ctx, ref, snippet, allKeywords)
		severity, leakType, matchedRule := "medium", "source_code", "gitlab_code_search:"+kw
		title := fmt.Sprintf("GitLab 仓库 %s 命中「%s」", entity, kw)
		for _, m := range secretMatches {
			if m.LeakType == "api_key" || m.LeakType == "credential_alert" {
				severity, leakType, matchedRule = m.Severity, m.LeakType, m.MatchedRule
				title = fmt.Sprintf("GitLab 仓库 %s 疑似泄露凭据 (%s)", entity, m.MatchedRule)
				break
			}
		}
		out = append(out, RawLeakFinding{
			ChannelGroup:   ChannelCodeRepo,
			SourcePlatform: "GitLab",
			LeakType:       leakType,
			Severity:       severity,
			Title:          title,
			SourceRef:      ref,
			MatchedRule:    matchedRule,
			RawSnippet:     snippet,
			AffectedEntity: entity,
			DetectedAt:     now,
		})
	}
	return out, nil
}

func (p *codeRepoProvider) fetchGitee(ctx context.Context, ep, secret string, keywords []string) ([]RawLeakFinding, error) {
	base := giteeAPIBase(ep)
	all := make([]RawLeakFinding, 0)
	for _, kw := range keywords {
		k := strings.TrimSpace(kw)
		if k == "" {
			continue
		}
		u, err := appendQueryParams(base+"/search/repositories", map[string]string{
			"q":            k,
			"per_page":     "20",
			"access_token": secret,
		})
		if err != nil {
			return nil, err
		}
		status, body, err := doHTTPRequest(ctx, p.client, http.MethodGet, u, nil, map[string]string{
			"User-Agent": "StrixLens-DRP/1.0",
		})
		if err != nil {
			return nil, err
		}
		if status >= 400 {
			return nil, fmt.Errorf("Gitee 仓库检索返回 HTTP %d: %s", status, truncateErr(body))
		}
		var items []struct {
			FullName    string `json:"full_name"`
			HTMLURL     string `json:"html_url"`
			Description string `json:"description"`
			Name        string `json:"name"`
		}
		if err := json.Unmarshal(body, &items); err != nil {
			return nil, fmt.Errorf("解析 Gitee 响应失败: %w", err)
		}
		now := time.Now().UTC()
		for _, it := range items {
			snippet := firstNonEmptyStr(it.Description, it.FullName, k)
			ref := firstNonEmptyStr(it.HTMLURL, "gitee://"+it.FullName)
			entity := firstNonEmptyStr(it.FullName, it.Name)
			secretMatches, _ := p.scanner.ScanText(ctx, ref, snippet, keywords)
			severity, leakType, matchedRule := "medium", "source_code", "gitee_repo_search:"+k
			title := fmt.Sprintf("Gitee 公开仓库 %s 命中「%s」", entity, k)
			for _, m := range secretMatches {
				if m.LeakType == "api_key" || m.LeakType == "credential_alert" {
					severity, leakType, matchedRule = m.Severity, m.LeakType, m.MatchedRule
					title = fmt.Sprintf("Gitee 公开仓库 %s 疑似泄露凭据 (%s)", entity, m.MatchedRule)
					break
				}
			}
			all = append(all, RawLeakFinding{
				ChannelGroup:   ChannelCodeRepo,
				SourcePlatform: "Gitee",
				LeakType:       leakType,
				Severity:       severity,
				Title:          title,
				SourceRef:      ref,
				MatchedRule:    matchedRule,
				RawSnippet:     snippet,
				AffectedEntity: entity,
				DetectedAt:     now,
			})
		}
	}
	return all, nil
}

func (p *codeRepoProvider) testGitLab(ctx context.Context, ep, secret string) error {
	status, body, err := doHTTPRequest(ctx, p.client, http.MethodGet, gitlabAPIBase(ep)+"/version", nil, map[string]string{
		"PRIVATE-TOKEN": secret,
		"User-Agent":    "StrixLens-DRP/1.0",
	})
	if err != nil {
		return err
	}
	if status >= 400 {
		return fmt.Errorf("GitLab API 返回 HTTP %d: %s", status, truncateErr(body))
	}
	return nil
}

func (p *codeRepoProvider) testGitee(ctx context.Context, ep, secret string) error {
	u, err := appendQueryParams(giteeAPIBase(ep)+"/user", map[string]string{"access_token": secret})
	if err != nil {
		return err
	}
	status, body, err := doHTTPRequest(ctx, p.client, http.MethodGet, u, nil, map[string]string{
		"User-Agent": "StrixLens-DRP/1.0",
	})
	if err != nil {
		return err
	}
	if status >= 400 {
		return fmt.Errorf("Gitee API 返回 HTTP %d: %s", status, truncateErr(body))
	}
	return nil
}

func testMISPConnection(ctx context.Context, client *http.Client, cfg ConnectorRuntimeConfig) error {
	ep, secret, err := requireEndpointAndKey(cfg, "已授权 MISP 地址与 API Key")
	if err != nil {
		return err
	}
	u, err := url.Parse(ep)
	if err != nil || u.Scheme == "" || u.Host == "" {
		return fmt.Errorf("MISP 地址无效")
	}
	status, body, err := doHTTPRequest(ctx, client, http.MethodGet, u.Scheme+"://"+u.Host+"/servers/getVersion", nil, map[string]string{
		"Authorization": secret,
		"Accept":        "application/json",
		"User-Agent":    "StrixLens-DRP/1.0",
	})
	if err != nil {
		return err
	}
	if status >= 400 {
		return fmt.Errorf("MISP 返回 HTTP %d: %s", status, truncateErr(body))
	}
	return nil
}

func dedupeFindings(in []RawLeakFinding) []RawLeakFinding {
	seen := map[string]bool{}
	out := make([]RawLeakFinding, 0, len(in))
	for _, f := range in {
		key := strings.TrimSpace(f.SourceRef) + "|" + strings.TrimSpace(f.Title)
		if key == "|" || seen[key] {
			continue
		}
		seen[key] = true
		out = append(out, f)
	}
	return out
}

func attributePlatform(f RawLeakFinding, channel string, ids []string) RawLeakFinding {
	if s, ok := MatchMonitorSource(f, SelectedSources(channel, ids)); ok {
		f.SourcePlatform = s.Name
	}
	return f
}

func parseHTMLIndexLinks(body []byte, channel, kw string, sources []MonitorSource) []RawLeakFinding {
	now := time.Now().UTC()
	seen := map[string]bool{}
	out := make([]RawLeakFinding, 0)
	for _, match := range reHTMLHref.FindAllSubmatch(body, 80) {
		if len(match) < 2 {
			continue
		}
		link := string(match[1])
		if seen[link] {
			continue
		}
		finding := RawLeakFinding{
			ChannelGroup:   channel,
			SourcePlatform: "公开索引",
			LeakType:       "internal_doc",
			Severity:       "medium",
			Title:          fmt.Sprintf("公开索引命中「%s」", kw),
			SourceRef:      link,
			MatchedRule:    "public_index:" + kw,
			RawSnippet:     link,
			AffectedEntity: kw,
			DetectedAt:     now,
		}
		matched, ok := MatchMonitorSource(finding, sources)
		if !ok {
			continue
		}
		seen[link] = true
		finding.SourcePlatform = matched.Name
		finding.Title = fmt.Sprintf("%s 公开页面命中「%s」", matched.Name, kw)
		out = append(out, finding)
	}
	return out
}
