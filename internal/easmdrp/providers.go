package easmdrp

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"
)

// IntelligenceProvider is the unified plugin interface for all 6 DRP channels.
type IntelligenceProvider interface {
	ID() string
	Name() string
	SourceType() string
	ChannelCategory() string
	FetchAlerts(ctx context.Context, cfg ConnectorRuntimeConfig, keywords []string, since time.Time) ([]RawLeakFinding, error)
	TestConnection(ctx context.Context, cfg ConnectorRuntimeConfig) error
}

// ConnectorMetadata describes a built-in provider's default configuration.
type ConnectorMetadata struct {
	ID              string
	Name            string
	ChannelGroup    string
	ProviderType    string
	DefaultEndpoint string
	DefaultCron     string
	CoverageNote    string
}

// DefaultConnectors returns the canonical 6-dimension connector matrix matching 1.3.2.5.
// Endpoints start empty until explicitly configured by an operator.
func DefaultConnectors() []ConnectorMetadata {
	return []ConnectorMetadata{
		{
			ID:           "conn_code_gitleaks",
			Name:         "Gitleaks + TruffleHog 代码库监测",
			ChannelGroup: ChannelCodeRepo,
			ProviderType: "gitleaks_trufflehog",
			DefaultCron:  "0 */4 * * *",
			CoverageNote: "GitHub / Gitee / GitLab 或本地 Git 仓库敏感凭据扫描",
		},
		{
			ID:           "conn_cloud_drive",
			Name:         "多云盘公开分享监测插件",
			ChannelGroup: ChannelCloudDrive,
			ProviderType: "cloud_drive_monitor",
			DefaultCron:  "0 */6 * * *",
			CoverageNote: "对接 SearXNG / OSINT 检索网关监测 >=9 类公开云盘分享",
		},
		{
			ID:           "conn_doc_metadata",
			Name:         "公开文库文档元数据监测插件",
			ChannelGroup: ChannelDocLibrary,
			ProviderType: "doc_library_meta",
			DefaultCron:  "0 */12 * * *",
			CoverageNote: "对接 SearXNG / OSINT 检索网关监测 >=6 类公开文库文档",
		},
		{
			ID:           "conn_cti_opencti",
			Name:         "OpenCTI STIX 2.1 外部威胁情报源",
			ChannelGroup: ChannelDarkwebCTI,
			ProviderType: "opencti_stix",
			DefaultCron:  "0 */6 * * *",
			CoverageNote: "通过 OpenCTI GraphQL API 订阅合规 STIX 2.1 外部威胁预警",
		},
		{
			ID:           "conn_cti_credential",
			Name:         "合规凭据暴露预警 CTI 网关",
			ChannelGroup: ChannelStealerCTI,
			ProviderType: "cti_credential_feed",
			DefaultCron:  "0 */6 * * *",
			CoverageNote: "对接合规第三方凭据泄露情报 API（强制脱敏入库）",
		},
		{
			ID:           "conn_platform_email",
			Name:         "互联网平台与企业邮箱泄露监测网关",
			ChannelGroup: ChannelPlatformEmail,
			ProviderType: "domain_breach_api",
			DefaultCron:  "0 0 * * *",
			CoverageNote: "对接 Have I Been Pwned v3 或自定义企业域名泄露 API",
		},
	}
}

// ConnectorRegistry manages pluggable DRP intelligence providers.
type ConnectorRegistry struct {
	mu        sync.RWMutex
	providers map[string]IntelligenceProvider
}

func NewConnectorRegistry() *ConnectorRegistry {
	return NewConnectorRegistryWithClient(&http.Client{Timeout: 15 * time.Second})
}

func NewConnectorRegistryWithClient(client *http.Client) *ConnectorRegistry {
	if client == nil {
		client = &http.Client{Timeout: 15 * time.Second}
	}
	r := &ConnectorRegistry{
		providers: make(map[string]IntelligenceProvider),
	}
	metas := map[string]ConnectorMetadata{}
	for _, m := range DefaultConnectors() {
		metas[m.ID] = m
	}
	r.Register(&codeRepoProvider{meta: metas["conn_code_gitleaks"], client: client, scanner: NewGitleaksTruffleHogAdapter()})
	r.Register(&osintSearchProvider{meta: metas["conn_cloud_drive"], client: client, mode: "cloud"})
	r.Register(&osintSearchProvider{meta: metas["conn_doc_metadata"], client: client, mode: "doc"})
	r.Register(&openCTIProvider{meta: metas["conn_cti_opencti"], client: client})
	r.Register(&credentialCTIProvider{meta: metas["conn_cti_credential"], client: client})
	r.Register(&domainBreachProvider{meta: metas["conn_platform_email"], client: client})
	return r
}

func (r *ConnectorRegistry) Register(p IntelligenceProvider) {
	if p == nil {
		return
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	r.providers[p.ID()] = p
}

func (r *ConnectorRegistry) Get(id string) (IntelligenceProvider, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	p, ok := r.providers[id]
	return p, ok
}

func (r *ConnectorRegistry) ByChannel(channelGroup string) []IntelligenceProvider {
	r.mu.RLock()
	defer r.mu.RUnlock()
	out := make([]IntelligenceProvider, 0)
	for _, p := range r.providers {
		if p.ChannelCategory() == channelGroup {
			out = append(out, p)
		}
	}
	return out
}

// ============================================================================
// 1. Code Repo Provider (Local Gitleaks / GitHub Code Search / Custom HTTP)
// ============================================================================

type codeRepoProvider struct {
	meta    ConnectorMetadata
	client  *http.Client
	scanner *GitleaksTruffleHogAdapter
}

func (p *codeRepoProvider) ID() string              { return p.meta.ID }
func (p *codeRepoProvider) Name() string            { return p.meta.Name }
func (p *codeRepoProvider) SourceType() string      { return p.meta.ProviderType }
func (p *codeRepoProvider) ChannelCategory() string { return p.meta.ChannelGroup }

func (p *codeRepoProvider) TestConnection(ctx context.Context, cfg ConnectorRuntimeConfig) error {
	ep := strings.TrimSpace(cfg.EndpointURL)
	secret := strings.TrimSpace(cfg.APIKeySecret)
	if localDir, ok := asLocalDir(ep); ok {
		info, err := os.Stat(localDir)
		if err != nil {
			return fmt.Errorf("本地目录不可访问: %w", err)
		}
		if !info.IsDir() {
			return fmt.Errorf("配置路径不是有效目录: %s", localDir)
		}
		return nil
	}
	if ep == "" && secret == "" {
		return fmt.Errorf("%w: 请配置 GitHub PAT（API Key）、本地代码目录路径或自定义监测网关 URL", ErrConnectorUnconfigured)
	}
	if ep == "" || isGitHubEndpoint(ep) {
		if secret == "" {
			return fmt.Errorf("%w: GitHub Code Search API 需要配置 Personal Access Token", ErrConnectorUnconfigured)
		}
		testURL := githubRateLimitURL(ep)
		status, body, err := doHTTPRequest(ctx, p.client, http.MethodGet, testURL, nil, map[string]string{
			"Authorization": "Bearer " + secret,
			"Accept":        "application/vnd.github+json",
			"User-Agent":    "StrixLens-DRP/1.0",
		})
		if err != nil {
			return err
		}
		if status >= 400 {
			return fmt.Errorf("GitHub API 返回 HTTP %d: %s", status, truncateErr(body))
		}
		return nil
	}
	status, body, err := doHTTPRequest(ctx, p.client, http.MethodGet, ep, nil, buildAuthHeaders(secret))
	if err != nil {
		return err
	}
	if status >= 400 && status != http.StatusNotFound {
		return fmt.Errorf("代码监测网关返回 HTTP %d: %s", status, truncateErr(body))
	}
	return nil
}

func (p *codeRepoProvider) FetchAlerts(ctx context.Context, cfg ConnectorRuntimeConfig, keywords []string, since time.Time) ([]RawLeakFinding, error) {
	ep := strings.TrimSpace(cfg.EndpointURL)
	secret := strings.TrimSpace(cfg.APIKeySecret)
	if localDir, ok := asLocalDir(ep); ok {
		return p.scanner.ScanLocalPath(ctx, localDir, keywords)
	}
	if ep == "" && secret == "" {
		return nil, fmt.Errorf("%w: 请配置 GitHub PAT（API Key）、本地代码目录路径或自定义监测网关 URL", ErrConnectorUnconfigured)
	}
	if len(keywords) == 0 {
		return nil, nil
	}

	if ep == "" || isGitHubEndpoint(ep) {
		if secret == "" {
			return nil, fmt.Errorf("%w: GitHub Code Search API 需要配置 Personal Access Token", ErrConnectorUnconfigured)
		}
		searchBase := githubSearchCodeURL(ep)
		all := make([]RawLeakFinding, 0)
		for _, kw := range keywords {
			k := strings.TrimSpace(kw)
			if k == "" {
				continue
			}
			u, err := appendQueryParams(searchBase, map[string]string{"q": k, "per_page": "20"})
			if err != nil {
				return nil, err
			}
			status, body, err := doHTTPRequest(ctx, p.client, http.MethodGet, u, nil, map[string]string{
				"Authorization": "Bearer " + secret,
				"Accept":        "application/vnd.github.text-match+json",
				"User-Agent":    "StrixLens-DRP/1.0",
			})
			if err != nil {
				return nil, err
			}
			if status >= 400 {
				return nil, fmt.Errorf("GitHub Code Search 返回 HTTP %d: %s", status, truncateErr(body))
			}
			parsed, err := p.parseGitHubCodeSearch(ctx, body, k, keywords)
			if err != nil {
				return nil, err
			}
			all = append(all, parsed...)
		}
		return all, nil
	}

	return fetchGenericJSONFeed(ctx, p.client, ep, secret, ChannelCodeRepo, "Code Repo Gateway", keywords, since)
}

func (p *codeRepoProvider) parseGitHubCodeSearch(ctx context.Context, body []byte, kw string, allKeywords []string) ([]RawLeakFinding, error) {
	var payload struct {
		Items []struct {
			Name       string `json:"name"`
			Path       string `json:"path"`
			HTMLURL    string `json:"html_url"`
			Repository struct {
				FullName string `json:"full_name"`
			} `json:"repository"`
			TextMatches []struct {
				Fragment string `json:"fragment"`
			} `json:"text_matches"`
		} `json:"items"`
	}
	if err := json.Unmarshal(body, &payload); err != nil {
		return nil, fmt.Errorf("解析 GitHub Search 响应失败: %w", err)
	}
	now := time.Now().UTC()
	out := make([]RawLeakFinding, 0, len(payload.Items))
	for _, it := range payload.Items {
		var fragParts []string
		for _, tm := range it.TextMatches {
			if s := strings.TrimSpace(tm.Fragment); s != "" {
				fragParts = append(fragParts, s)
			}
		}
		snippet := strings.Join(fragParts, "\n")
		if snippet == "" {
			snippet = fmt.Sprintf("仓库 %s 文件 %s 命中检索词 %s", it.Repository.FullName, it.Path, kw)
		}
		ref := firstNonEmptyStr(it.HTMLURL, it.Repository.FullName+"/"+it.Path)
		entity := firstNonEmptyStr(it.Repository.FullName, it.Path)

		secretMatches, _ := p.scanner.ScanText(ctx, ref, snippet, allKeywords)
		severity := "medium"
		leakType := "source_code"
		matchedRule := "github_code_search:" + kw
		title := fmt.Sprintf("GitHub 公开仓库 %s 命中「%s」", entity, kw)
		for _, m := range secretMatches {
			if m.LeakType == "api_key" || m.LeakType == "credential_alert" {
				severity = m.Severity
				leakType = m.LeakType
				matchedRule = m.MatchedRule
				title = fmt.Sprintf("GitHub 公开仓库 %s 疑似泄露凭据 (%s)", entity, m.MatchedRule)
				break
			}
		}

		out = append(out, RawLeakFinding{
			ChannelGroup:   ChannelCodeRepo,
			SourcePlatform: "GitHub",
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

// ============================================================================
// 2. OpenCTI STIX 2.1 GraphQL Provider (darkweb_cti)
// ============================================================================

type openCTIProvider struct {
	meta   ConnectorMetadata
	client *http.Client
}

func (p *openCTIProvider) ID() string              { return p.meta.ID }
func (p *openCTIProvider) Name() string            { return p.meta.Name }
func (p *openCTIProvider) SourceType() string      { return p.meta.ProviderType }
func (p *openCTIProvider) ChannelCategory() string { return p.meta.ChannelGroup }

func (p *openCTIProvider) TestConnection(ctx context.Context, cfg ConnectorRuntimeConfig) error {
	ep, secret, err := requireEndpointAndKey(cfg, "OpenCTI GraphQL URL 与 API Token")
	if err != nil {
		return err
	}
	gqlURL := normalizeOpenCTIURL(ep)
	body, _ := json.Marshal(map[string]interface{}{"query": "{ about { version } }"})
	status, respBody, err := doHTTPRequest(ctx, p.client, http.MethodPost, gqlURL, body, map[string]string{
		"Authorization": "Bearer " + secret,
		"Content-Type":  "application/json",
		"User-Agent":    "StrixLens-DRP/1.0",
	})
	if err != nil {
		return err
	}
	if status >= 400 {
		return fmt.Errorf("OpenCTI 返回 HTTP %d: %s", status, truncateErr(respBody))
	}
	var parsed struct {
		Errors []struct {
			Message string `json:"message"`
		} `json:"errors"`
	}
	if json.Unmarshal(respBody, &parsed) == nil && len(parsed.Errors) > 0 {
		return fmt.Errorf("OpenCTI GraphQL 错误: %s", parsed.Errors[0].Message)
	}
	return nil
}

func (p *openCTIProvider) FetchAlerts(ctx context.Context, cfg ConnectorRuntimeConfig, keywords []string, _ time.Time) ([]RawLeakFinding, error) {
	ep, secret, err := requireEndpointAndKey(cfg, "OpenCTI GraphQL URL 与 API Token")
	if err != nil {
		return nil, err
	}
	if len(keywords) == 0 {
		return nil, nil
	}
	gqlURL := normalizeOpenCTIURL(ep)
	const query = `query StrixDRPSearch($search: String) {
		stixCoreObjects(search: $search, first: 20) {
			edges {
				node {
					id
					entity_type
					created_at
					... on Indicator { name pattern x_opencti_score }
					... on Report { name description }
					... on Note { attribute_abstract content }
				}
			}
		}
	}`
	all := make([]RawLeakFinding, 0)
	for _, kw := range keywords {
		k := strings.TrimSpace(kw)
		if k == "" {
			continue
		}
		reqBody, _ := json.Marshal(map[string]interface{}{
			"query":     query,
			"variables": map[string]string{"search": k},
		})
		status, respBody, reqErr := doHTTPRequest(ctx, p.client, http.MethodPost, gqlURL, reqBody, map[string]string{
			"Authorization": "Bearer " + secret,
			"Content-Type":  "application/json",
			"User-Agent":    "StrixLens-DRP/1.0",
		})
		if reqErr != nil {
			return nil, reqErr
		}
		if status >= 400 {
			return nil, fmt.Errorf("OpenCTI 返回 HTTP %d: %s", status, truncateErr(respBody))
		}
		var gqlResp struct {
			Data struct {
				StixCoreObjects struct {
					Edges []struct {
						Node struct {
							ID                string `json:"id"`
							EntityType        string `json:"entity_type"`
							CreatedAt         string `json:"created_at"`
							Name              string `json:"name"`
							Pattern           string `json:"pattern"`
							Score             int    `json:"x_opencti_score"`
							Description       string `json:"description"`
							AttributeAbstract string `json:"attribute_abstract"`
							Content           string `json:"content"`
						} `json:"node"`
					} `json:"edges"`
				} `json:"stixCoreObjects"`
			} `json:"data"`
			Errors []struct {
				Message string `json:"message"`
			} `json:"errors"`
		}
		if err := json.Unmarshal(respBody, &gqlResp); err != nil {
			return nil, fmt.Errorf("解析 OpenCTI GraphQL 响应失败: %w", err)
		}
		if len(gqlResp.Errors) > 0 {
			return nil, fmt.Errorf("OpenCTI GraphQL 错误: %s", gqlResp.Errors[0].Message)
		}
		for _, edge := range gqlResp.Data.StixCoreObjects.Edges {
			n := edge.Node
			sev := "medium"
			if n.Score >= 85 {
				sev = "critical"
			} else if n.Score >= 60 {
				sev = "high"
			}
			title := firstNonEmptyStr(n.Name, n.AttributeAbstract, fmt.Sprintf("OpenCTI %s 命中「%s」", n.EntityType, k))
			snippet := firstNonEmptyStr(n.Pattern, n.Description, n.Content, title)
			detectedAt := parseTimeOrNow(n.CreatedAt)
			all = append(all, RawLeakFinding{
				ChannelGroup:   ChannelDarkwebCTI,
				SourcePlatform: "OpenCTI (STIX 2.1)",
				LeakType:       "credential_alert",
				Severity:       sev,
				Title:          title,
				SourceRef:      "stix://" + firstNonEmptyStr(n.ID, k),
				MatchedRule:    "opencti:" + strings.ToLower(firstNonEmptyStr(n.EntityType, "stix")),
				RawSnippet:     snippet,
				AffectedEntity: k,
				DetectedAt:     detectedAt,
			})
		}
	}
	return all, nil
}

// ============================================================================
// 3. Credential CTI Gateway Provider (stealer_cti)
// ============================================================================

type credentialCTIProvider struct {
	meta   ConnectorMetadata
	client *http.Client
}

func (p *credentialCTIProvider) ID() string              { return p.meta.ID }
func (p *credentialCTIProvider) Name() string            { return p.meta.Name }
func (p *credentialCTIProvider) SourceType() string      { return p.meta.ProviderType }
func (p *credentialCTIProvider) ChannelCategory() string { return p.meta.ChannelGroup }

func (p *credentialCTIProvider) TestConnection(ctx context.Context, cfg ConnectorRuntimeConfig) error {
	ep := strings.TrimSpace(cfg.EndpointURL)
	if ep == "" {
		return fmt.Errorf("%w: 请配置合规凭据泄露 CTI 网关 Endpoint URL", ErrConnectorUnconfigured)
	}
	status, body, err := doHTTPRequest(ctx, p.client, http.MethodGet, ep, nil, buildAuthHeaders(cfg.APIKeySecret))
	if err != nil {
		return err
	}
	if status >= 400 && status != http.StatusNotFound {
		return fmt.Errorf("CTI 网关返回 HTTP %d: %s", status, truncateErr(body))
	}
	return nil
}

func (p *credentialCTIProvider) FetchAlerts(ctx context.Context, cfg ConnectorRuntimeConfig, keywords []string, since time.Time) ([]RawLeakFinding, error) {
	ep := strings.TrimSpace(cfg.EndpointURL)
	if ep == "" {
		return nil, fmt.Errorf("%w: 请配置合规凭据泄露 CTI 网关 Endpoint URL", ErrConnectorUnconfigured)
	}
	return fetchGenericJSONFeed(ctx, p.client, ep, cfg.APIKeySecret, ChannelStealerCTI, "CTI Credential Feed", keywords, since)
}

// ============================================================================
// 4. Domain & Email Breach API Provider (HIBP v3 / Custom Breach Gateway)
// ============================================================================

type domainBreachProvider struct {
	meta   ConnectorMetadata
	client *http.Client
}

func (p *domainBreachProvider) ID() string              { return p.meta.ID }
func (p *domainBreachProvider) Name() string            { return p.meta.Name }
func (p *domainBreachProvider) SourceType() string      { return p.meta.ProviderType }
func (p *domainBreachProvider) ChannelCategory() string { return p.meta.ChannelGroup }

func (p *domainBreachProvider) TestConnection(ctx context.Context, cfg ConnectorRuntimeConfig) error {
	ep := strings.TrimSpace(cfg.EndpointURL)
	if ep == "" {
		return fmt.Errorf("%w: 请配置 HIBP v3 或企业邮箱泄露监测 API Endpoint URL", ErrConnectorUnconfigured)
	}
	if isHIBPEndpoint(ep) {
		if strings.TrimSpace(cfg.APIKeySecret) == "" {
			return fmt.Errorf("%w: Have I Been Pwned API 需要配置 hibp-api-key", ErrConnectorUnconfigured)
		}
		testURL := strings.TrimRight(ep, "/") + "/breacheddomain/example.com"
		status, body, err := doHTTPRequest(ctx, p.client, http.MethodGet, testURL, nil, map[string]string{
			"hibp-api-key": strings.TrimSpace(cfg.APIKeySecret),
			"User-Agent":   "StrixLens-DRP/1.0",
		})
		if err != nil {
			return err
		}
		if status == http.StatusUnauthorized || status == http.StatusForbidden {
			return fmt.Errorf("HIBP API 鉴权失败 HTTP %d: %s", status, truncateErr(body))
		}
		if status >= 400 && status != http.StatusNotFound {
			return fmt.Errorf("HIBP API 返回 HTTP %d: %s", status, truncateErr(body))
		}
		return nil
	}
	status, body, err := doHTTPRequest(ctx, p.client, http.MethodGet, ep, nil, buildAuthHeaders(cfg.APIKeySecret))
	if err != nil {
		return err
	}
	if status >= 400 && status != http.StatusNotFound {
		return fmt.Errorf("邮箱泄露监测 API 返回 HTTP %d: %s", status, truncateErr(body))
	}
	return nil
}

func (p *domainBreachProvider) FetchAlerts(ctx context.Context, cfg ConnectorRuntimeConfig, keywords []string, since time.Time) ([]RawLeakFinding, error) {
	ep := strings.TrimSpace(cfg.EndpointURL)
	if ep == "" {
		return nil, fmt.Errorf("%w: 请配置 HIBP v3 或企业邮箱泄露监测 API Endpoint URL", ErrConnectorUnconfigured)
	}
	if len(keywords) == 0 {
		return nil, nil
	}
	if isHIBPEndpoint(ep) || strings.HasSuffix(strings.TrimRight(strings.ToLower(ep), "/"), "/api/v3") {
		if strings.TrimSpace(cfg.APIKeySecret) == "" {
			return nil, fmt.Errorf("%w: Have I Been Pwned API 需要配置 hibp-api-key", ErrConnectorUnconfigured)
		}
		return p.fetchHIBP(ctx, strings.TrimRight(ep, "/"), strings.TrimSpace(cfg.APIKeySecret), keywords)
	}
	return fetchGenericJSONFeed(ctx, p.client, ep, cfg.APIKeySecret, ChannelPlatformEmail, "Domain Breach Gateway", keywords, since)
}

func (p *domainBreachProvider) fetchHIBP(ctx context.Context, base, apiKey string, keywords []string) ([]RawLeakFinding, error) {
	headers := map[string]string{
		"hibp-api-key": apiKey,
		"User-Agent":   "StrixLens-DRP/1.0",
	}
	now := time.Now().UTC()
	out := make([]RawLeakFinding, 0)
	for _, kw := range keywords {
		k := strings.TrimSpace(kw)
		if k == "" {
			continue
		}
		isAccount := strings.Contains(k, "@") && !strings.HasPrefix(k, "@")
		if isAccount {
			u := fmt.Sprintf("%s/breachedaccount/%s?truncateResponse=false", base, url.PathEscape(k))
			status, body, err := doHTTPRequest(ctx, p.client, http.MethodGet, u, nil, headers)
			if err != nil {
				return nil, err
			}
			if status == http.StatusNotFound {
				continue
			}
			if status >= 400 {
				return nil, fmt.Errorf("HIBP breachedaccount 返回 HTTP %d: %s", status, truncateErr(body))
			}
			var breaches []struct {
				Name        string   `json:"Name"`
				Title       string   `json:"Title"`
				Domain      string   `json:"Domain"`
				BreachDate  string   `json:"BreachDate"`
				DataClasses []string `json:"DataClasses"`
			}
			if err := json.Unmarshal(body, &breaches); err != nil {
				return nil, fmt.Errorf("解析 HIBP 响应失败: %w", err)
			}
			for _, b := range breaches {
				sev := "medium"
				for _, dc := range b.DataClasses {
					if strings.Contains(strings.ToLower(dc), "password") {
						sev = "high"
						break
					}
				}
				out = append(out, RawLeakFinding{
					ChannelGroup:   ChannelPlatformEmail,
					SourcePlatform: "Have I Been Pwned",
					LeakType:       "corp_email",
					Severity:       sev,
					Title:          fmt.Sprintf("企业邮箱 %s 命中第三方泄露事件 %s", k, firstNonEmptyStr(b.Title, b.Name)),
					SourceRef:      fmt.Sprintf("hibp://breach/%s#%s", b.Name, k),
					MatchedRule:    "hibp:breachedaccount",
					RawSnippet:     fmt.Sprintf("泄露平台：%s (%s) · 日期：%s · 涉及数据类型：%s", firstNonEmptyStr(b.Title, b.Name), b.Domain, b.BreachDate, strings.Join(b.DataClasses, ", ")),
					AffectedEntity: k,
					DetectedAt:     now,
				})
			}
			continue
		}

		domain := strings.TrimPrefix(k, "@")
		u := fmt.Sprintf("%s/breacheddomain/%s", base, url.PathEscape(domain))
		status, body, err := doHTTPRequest(ctx, p.client, http.MethodGet, u, nil, headers)
		if err != nil {
			return nil, err
		}
		if status == http.StatusNotFound {
			continue
		}
		if status >= 400 {
			return nil, fmt.Errorf("HIBP breacheddomain 返回 HTTP %d: %s", status, truncateErr(body))
		}
		var byAlias map[string][]string
		if err := json.Unmarshal(body, &byAlias); err != nil {
			return nil, fmt.Errorf("解析 HIBP breacheddomain 响应失败: %w", err)
		}
		for alias, breachNames := range byAlias {
			email := alias + "@" + domain
			out = append(out, RawLeakFinding{
				ChannelGroup:   ChannelPlatformEmail,
				SourcePlatform: "Have I Been Pwned",
				LeakType:       "corp_email",
				Severity:       "high",
				Title:          fmt.Sprintf("企业邮箱 %s 在 %d 个平台泄露库命中", email, len(breachNames)),
				SourceRef:      fmt.Sprintf("hibp://domain/%s#%s", domain, alias),
				MatchedRule:    "hibp:breacheddomain",
				RawSnippet:     fmt.Sprintf("受影响邮箱：%s · 命中泄露事件：%s", email, strings.Join(breachNames, ", ")),
				AffectedEntity: email,
				DetectedAt:     now,
			})
		}
	}
	return out, nil
}

// ============================================================================
// 5 & 6. OSINT Search Provider (SearXNG / SpiderFoot / Custom JSON)
// ============================================================================

type osintSearchProvider struct {
	meta   ConnectorMetadata
	client *http.Client
	mode   string // "cloud" | "doc"
}

func (p *osintSearchProvider) ID() string              { return p.meta.ID }
func (p *osintSearchProvider) Name() string            { return p.meta.Name }
func (p *osintSearchProvider) SourceType() string      { return p.meta.ProviderType }
func (p *osintSearchProvider) ChannelCategory() string { return p.meta.ChannelGroup }

func (p *osintSearchProvider) TestConnection(ctx context.Context, cfg ConnectorRuntimeConfig) error {
	ep := strings.TrimSpace(cfg.EndpointURL)
	if ep == "" {
		return fmt.Errorf("%w: 请配置 SearXNG 或 OSINT 检索网关 Endpoint URL", ErrConnectorUnconfigured)
	}
	testURL, err := appendQueryParams(ep, map[string]string{"q": "healthcheck", "format": "json"})
	if err != nil {
		return err
	}
	status, body, err := doHTTPRequest(ctx, p.client, http.MethodGet, testURL, nil, buildAuthHeaders(cfg.APIKeySecret))
	if err != nil {
		return err
	}
	if status >= 400 {
		return fmt.Errorf("OSINT 检索网关返回 HTTP %d: %s", status, truncateErr(body))
	}
	return nil
}

func (p *osintSearchProvider) FetchAlerts(ctx context.Context, cfg ConnectorRuntimeConfig, keywords []string, _ time.Time) ([]RawLeakFinding, error) {
	ep := strings.TrimSpace(cfg.EndpointURL)
	if ep == "" {
		return nil, fmt.Errorf("%w: 请配置 SearXNG 或 OSINT 检索网关 Endpoint URL", ErrConnectorUnconfigured)
	}
	if len(keywords) == 0 {
		return nil, nil
	}
	scopeExpr := "(site:pan.baidu.com OR site:aliyundrive.com OR site:alipan.com OR site:drive.google.com OR site:1drv.ms OR site:dropbox.com OR site:mega.nz OR site:weiyun.com OR site:box.com)"
	defaultPlatform := "OSINT 云盘监测"
	if p.mode == "doc" {
		scopeExpr = "(site:wenku.baidu.com OR site:docin.com OR site:doc88.com OR site:book118.com OR site:scribd.com OR site:slideshare.net)"
		defaultPlatform = "OSINT 文库监测"
	}
	now := time.Now().UTC()
	out := make([]RawLeakFinding, 0)
	for _, kw := range keywords {
		k := strings.TrimSpace(kw)
		if k == "" {
			continue
		}
		q := k + " " + scopeExpr
		reqURL, err := appendQueryParams(ep, map[string]string{"q": q, "format": "json"})
		if err != nil {
			return nil, err
		}
		status, body, err := doHTTPRequest(ctx, p.client, http.MethodGet, reqURL, nil, buildAuthHeaders(cfg.APIKeySecret))
		if err != nil {
			return nil, err
		}
		if status >= 400 {
			return nil, fmt.Errorf("OSINT 检索网关返回 HTTP %d: %s", status, truncateErr(body))
		}

		// Try SearXNG `{results: [...]}` shape first, then fallback to generic feed parser.
		var searx struct {
			Results []struct {
				Title   string `json:"title"`
				URL     string `json:"url"`
				Content string `json:"content"`
				Engine  string `json:"engine"`
			} `json:"results"`
		}
		if json.Unmarshal(body, &searx) == nil && len(searx.Results) > 0 {
			for _, r := range searx.Results {
				if strings.TrimSpace(r.URL) == "" && strings.TrimSpace(r.Title) == "" {
					continue
				}
				sev := "medium"
				if p.mode == "cloud" {
					sev = "high"
				}
				out = append(out, RawLeakFinding{
					ChannelGroup:   p.meta.ChannelGroup,
					SourcePlatform: firstNonEmptyStr(r.Engine, defaultPlatform),
					LeakType:       "internal_doc",
					Severity:       sev,
					Title:          firstNonEmptyStr(r.Title, fmt.Sprintf("命中公开检索关键词「%s」", k)),
					SourceRef:      r.URL,
					MatchedRule:    "osint:" + p.mode + ":" + k,
					RawSnippet:     firstNonEmptyStr(r.Content, r.Title, r.URL),
					AffectedEntity: k,
					DetectedAt:     now,
				})
			}
			continue
		}

		generic, err := parseGenericJSONFeed(body, p.meta.ChannelGroup, defaultPlatform, k)
		if err != nil {
			return nil, err
		}
		out = append(out, generic...)
	}
	return out, nil
}

// ============================================================================
// Shared HTTP & JSON Helpers
// ============================================================================

func requireEndpointAndKey(cfg ConnectorRuntimeConfig, label string) (string, string, error) {
	ep := strings.TrimSpace(cfg.EndpointURL)
	secret := strings.TrimSpace(cfg.APIKeySecret)
	if ep == "" || secret == "" {
		return "", "", fmt.Errorf("%w: 请配置 %s", ErrConnectorUnconfigured, label)
	}
	return ep, secret, nil
}

func asLocalDir(ep string) (string, bool) {
	if strings.HasPrefix(ep, "file://") {
		return strings.TrimPrefix(ep, "file://"), true
	}
	if strings.HasPrefix(ep, "/") {
		return ep, true
	}
	return "", false
}

func isGitHubEndpoint(ep string) bool {
	low := strings.ToLower(ep)
	return strings.Contains(low, "api.github.com") || strings.HasSuffix(strings.TrimRight(low, "/"), "/search/code")
}

func githubSearchCodeURL(ep string) string {
	trimmed := strings.TrimRight(strings.TrimSpace(ep), "/")
	if trimmed == "" {
		return "https://api.github.com/search/code"
	}
	if strings.HasSuffix(strings.ToLower(trimmed), "/search/code") {
		return trimmed
	}
	return trimmed + "/search/code"
}

func githubRateLimitURL(ep string) string {
	trimmed := strings.TrimRight(strings.TrimSpace(ep), "/")
	if trimmed == "" {
		return "https://api.github.com/rate_limit"
	}
	u, err := url.Parse(trimmed)
	if err != nil || u.Scheme == "" || u.Host == "" {
		return "https://api.github.com/rate_limit"
	}
	return u.Scheme + "://" + u.Host + "/rate_limit"
}

func normalizeOpenCTIURL(ep string) string {
	trimmed := strings.TrimRight(strings.TrimSpace(ep), "/")
	u, err := url.Parse(trimmed)
	if err == nil && (u.Path == "" || u.Path == "/") {
		return trimmed + "/graphql"
	}
	return trimmed
}

func isHIBPEndpoint(ep string) bool {
	return strings.Contains(strings.ToLower(ep), "haveibeenpwned.com")
}

func buildAuthHeaders(secret string) map[string]string {
	h := map[string]string{"User-Agent": "StrixLens-DRP/1.0"}
	s := strings.TrimSpace(secret)
	if s != "" {
		h["Authorization"] = "Bearer " + s
		h["X-API-Key"] = s
		h["hibp-api-key"] = s
	}
	return h
}

func appendQueryParams(rawURL string, params map[string]string) (string, error) {
	u, err := url.Parse(strings.TrimSpace(rawURL))
	if err != nil {
		return "", err
	}
	q := u.Query()
	for k, v := range params {
		q.Set(k, v)
	}
	u.RawQuery = q.Encode()
	return u.String(), nil
}

func doHTTPRequest(ctx context.Context, client *http.Client, method, targetURL string, body []byte, headers map[string]string) (int, []byte, error) {
	if client == nil {
		client = &http.Client{Timeout: 15 * time.Second}
	}
	var reader io.Reader
	if body != nil {
		reader = bytes.NewReader(body)
	}
	reqCtx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()
	req, err := http.NewRequestWithContext(reqCtx, method, targetURL, reader)
	if err != nil {
		return 0, nil, err
	}
	for k, v := range headers {
		req.Header.Set(k, v)
	}
	resp, err := client.Do(req)
	if err != nil {
		return 0, nil, err
	}
	defer resp.Body.Close()
	respBody, err := io.ReadAll(io.LimitReader(resp.Body, 2*1024*1024))
	return resp.StatusCode, respBody, err
}

func fetchGenericJSONFeed(ctx context.Context, client *http.Client, ep, secret, channelGroup, defaultPlatform string, keywords []string, since time.Time) ([]RawLeakFinding, error) {
	if len(keywords) == 0 {
		return nil, nil
	}
	headers := buildAuthHeaders(secret)
	out := make([]RawLeakFinding, 0)
	for _, kw := range keywords {
		k := strings.TrimSpace(kw)
		if k == "" {
			continue
		}
		params := map[string]string{"q": k}
		if !since.IsZero() {
			params["since"] = since.UTC().Format(time.RFC3339)
		}
		reqURL, err := appendQueryParams(ep, params)
		if err != nil {
			return nil, err
		}
		status, body, err := doHTTPRequest(ctx, client, http.MethodGet, reqURL, nil, headers)
		if err != nil {
			return nil, err
		}
		if status == http.StatusNotFound {
			continue
		}
		if status >= 400 {
			return nil, fmt.Errorf("网关返回 HTTP %d: %s", status, truncateErr(body))
		}
		items, err := parseGenericJSONFeed(body, channelGroup, defaultPlatform, k)
		if err != nil {
			return nil, err
		}
		out = append(out, items...)
	}
	return out, nil
}

type genericFindingItem struct {
	SourcePlatform string `json:"source_platform"`
	Platform       string `json:"platform"`
	LeakType       string `json:"leak_type"`
	Severity       string `json:"severity"`
	Title          string `json:"title"`
	Name           string `json:"name"`
	SourceRef      string `json:"source_ref"`
	URL            string `json:"url"`
	MatchedRule    string `json:"matched_rule"`
	RawSnippet     string `json:"raw_snippet"`
	Snippet        string `json:"snippet"`
	Content        string `json:"content"`
	AffectedEntity string `json:"affected_entity"`
	Entity         string `json:"entity"`
	Email          string `json:"email"`
	DetectedAt     string `json:"detected_at"`
}

func parseGenericJSONFeed(body []byte, channelGroup, defaultPlatform, kw string) ([]RawLeakFinding, error) {
	trimmed := bytes.TrimSpace(body)
	if len(trimmed) == 0 {
		return nil, nil
	}
	var items []genericFindingItem
	if trimmed[0] == '[' {
		if err := json.Unmarshal(trimmed, &items); err != nil {
			return nil, fmt.Errorf("解析 JSON 数组失败: %w", err)
		}
	} else {
		var envelope struct {
			Findings []genericFindingItem `json:"findings"`
			Alerts   []genericFindingItem `json:"alerts"`
			Items    []genericFindingItem `json:"items"`
			Breaches []genericFindingItem `json:"breaches"`
			Results  []genericFindingItem `json:"results"`
		}
		if err := json.Unmarshal(trimmed, &envelope); err != nil {
			return nil, fmt.Errorf("解析 JSON 响应失败: %w", err)
		}
		switch {
		case len(envelope.Findings) > 0:
			items = envelope.Findings
		case len(envelope.Alerts) > 0:
			items = envelope.Alerts
		case len(envelope.Items) > 0:
			items = envelope.Items
		case len(envelope.Breaches) > 0:
			items = envelope.Breaches
		case len(envelope.Results) > 0:
			items = envelope.Results
		}
	}

	out := make([]RawLeakFinding, 0, len(items))
	for _, it := range items {
		title := firstNonEmptyStr(it.Title, it.Name)
		snippet := firstNonEmptyStr(it.RawSnippet, it.Snippet, it.Content, title)
		if title == "" && snippet == "" {
			continue
		}
		out = append(out, RawLeakFinding{
			ChannelGroup:   channelGroup,
			SourcePlatform: firstNonEmptyStr(it.SourcePlatform, it.Platform, defaultPlatform),
			LeakType:       firstNonEmptyStr(it.LeakType, "credential_alert"),
			Severity:       firstNonEmptyStr(it.Severity, "medium"),
			Title:          firstNonEmptyStr(title, "命中风险情报: "+kw),
			SourceRef:      firstNonEmptyStr(it.SourceRef, it.URL, kw),
			MatchedRule:    firstNonEmptyStr(it.MatchedRule, "gateway:"+channelGroup),
			RawSnippet:     snippet,
			AffectedEntity: firstNonEmptyStr(it.AffectedEntity, it.Entity, it.Email, kw),
			DetectedAt:     parseTimeOrNow(it.DetectedAt),
		})
	}
	return out, nil
}

func parseTimeOrNow(raw string) time.Time {
	s := strings.TrimSpace(raw)
	if s != "" {
		if t, err := time.Parse(time.RFC3339, s); err == nil {
			return t.UTC()
		}
	}
	return time.Now().UTC()
}

func truncateErr(body []byte) string {
	s := strings.TrimSpace(string(body))
	if len(s) > 180 {
		return s[:180] + "..."
	}
	return s
}
