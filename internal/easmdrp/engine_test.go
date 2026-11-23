package easmdrp

import (
	"context"
	"encoding/json"
	"errors"
	"net"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"testing"
	"time"
)

func TestMaskSensitiveTextPreservesFirstAndLastTwo(t *testing.T) {
	raw := "config token=abcdefgh12345678 and Bearer xyz9876543210wvu"
	masked := MaskSensitiveText(raw)
	if strings.Contains(masked, "abcdefgh12345678") {
		t.Fatalf("expected token to be masked, got: %s", masked)
	}
	if !strings.Contains(masked, "ab****78") {
		t.Fatalf("expected ab****78 in masked output, got: %s", masked)
	}
	if strings.Contains(masked, "xyz9876543210wvu") {
		t.Fatalf("expected bearer token to be masked, got: %s", masked)
	}
	if !strings.Contains(masked, "xy****vu") {
		t.Fatalf("expected xy****vu in masked output, got: %s", masked)
	}
}

func TestComputeEventHashDeterministic(t *testing.T) {
	h1 := ComputeEventHash("code_repo", "repo://a/b", "rule-1", "ops@example.com", "snippet-1")
	h2 := ComputeEventHash("CODE_REPO", "repo://a/b", "RULE-1", "OPS@EXAMPLE.COM", "snippet-1")
	if h1 != h2 {
		t.Fatalf("expected deterministic hash, got %s vs %s", h1, h2)
	}
	h3 := ComputeEventHash("code_repo", "repo://a/b", "rule-1", "ops@example.com", "snippet-2")
	if h1 == h3 {
		t.Fatalf("expected different snippet to yield different hash")
	}
}

func TestComputeAssetDiffsDetectsShadowAndPortDrift(t *testing.T) {
	discovered := DiscoveredAsset{
		AssetType:   "web_service",
		Identifier:  "shadow-redis.corp.local:6379",
		IPAddress:   "10.0.0.5",
		Port:        6379,
		ServiceName: "redis",
		Fingerprint: map[string]interface{}{"tls_days_remaining": 5},
	}
	isShadow, diffs := ComputeAssetDiffs(discovered, nil, false)
	if !isShadow {
		t.Fatalf("expected unregistered asset to be flagged as shadow")
	}
	if len(diffs) < 3 {
		t.Fatalf("expected NEW_SHADOW_ASSET + HIGH_RISK_EXPOSURE + CERT_EXPIRED, got %d diffs", len(diffs))
	}

	prev := &ExistingAssetSnapshot{
		ID:          1,
		AssetType:   "web_service",
		Identifier:  "api.corp.local:443",
		Port:        443,
		ServiceName: "nginx",
		IsShadow:    false,
	}
	updated := DiscoveredAsset{
		AssetType:   "web_service",
		Identifier:  "api.corp.local:443",
		Port:        8443,
		ServiceName: "envoy",
	}
	isShadow2, diffs2 := ComputeAssetDiffs(updated, prev, true)
	if isShadow2 {
		t.Fatalf("expected CMDB baseline asset not to be shadow")
	}
	if len(diffs2) != 2 {
		t.Fatalf("expected NEW_PORT + SERVICE_CHANGED, got %d diffs", len(diffs2))
	}
}

func TestAllSixDRPProvidersReturnUnconfiguredWithoutConfig(t *testing.T) {
	reg := NewConnectorRegistry()
	for _, ch := range AllChannelGroups {
		providers := reg.ByChannel(ch)
		if len(providers) == 0 {
			t.Fatalf("expected provider registered for %s", ch)
		}
		cfg := ConnectorRuntimeConfig{
			ID:           providers[0].ID(),
			ChannelGroup: ch,
			ProviderType: providers[0].SourceType(),
			IsEnabled:    true,
		}
		findings, err := providers[0].FetchAlerts(context.Background(), cfg, []string{"acme.com"}, time.Now().Add(-time.Hour))
		if !errors.Is(err, ErrConnectorUnconfigured) {
			t.Fatalf("expected ErrConnectorUnconfigured for %s when unconfigured, got err=%v findings=%d", ch, err, len(findings))
		}
		if len(findings) != 0 {
			t.Fatalf("expected 0 mock findings for %s, got %d", ch, len(findings))
		}
		if err := providers[0].TestConnection(context.Background(), cfg); !errors.Is(err, ErrConnectorUnconfigured) {
			t.Fatalf("expected TestConnection ErrConnectorUnconfigured for %s, got %v", ch, err)
		}
	}
}

func TestDRPProvidersRealHTTPAndLocalIntegration(t *testing.T) {
	// 1. Local directory scan for code_repo (Gitleaks/regex scanner)
	tmpRepo := t.TempDir()
	if err := os.WriteFile(filepath.Join(tmpRepo, ".env"), []byte("api_key=SuperSecretGitToken99\n"), 0o600); err != nil {
		t.Fatal(err)
	}

	// 2. Real GitHub Code Search HTTP server
	ghSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Authorization") != "Bearer gh-test-token" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		if r.URL.Path == "/rate_limit" {
			_, _ = w.Write([]byte(`{"rate":{"limit":30}}`))
			return
		}
		if r.URL.Path == "/search/code" {
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"items": []map[string]interface{}{
					{
						"name":       ".env",
						"path":       ".env",
						"html_url":   "https://github.com/org/repo/blob/main/.env",
						"repository": map[string]string{"full_name": "org/repo"},
						"text_matches": []map[string]string{
							{"fragment": "secret=GitLeakToken123456"},
						},
					},
				},
			})
			return
		}
		w.WriteHeader(http.StatusNotFound)
	}))
	defer ghSrv.Close()

	// 3. Real OpenCTI GraphQL HTTP server
	openctiSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Authorization") != "Bearer opencti-secret" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		var body struct {
			Query string `json:"query"`
		}
		_ = json.NewDecoder(r.Body).Decode(&body)
		if strings.Contains(body.Query, "about") {
			_, _ = w.Write([]byte(`{"data":{"about":{"version":"6.2.0"}}}`))
			return
		}
		_, _ = w.Write([]byte(`{"data":{"stixCoreObjects":{"edges":[{"node":{"id":"ind-1","entity_type":"Indicator","name":"VPN Credential Mention","pattern":"[domain-name:value = 'acme.com']","x_opencti_score":90}}]}}}`))
	}))
	defer openctiSrv.Close()

	// 4. Real HIBP v3 HTTP server
	hibpSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("hibp-api-key") != "hibp-key-1" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		if strings.HasSuffix(r.URL.Path, "/breacheddomain/acme.com") {
			_, _ = w.Write([]byte(`{"alice":["Adobe","LinkedIn"]}`))
			return
		}
		w.WriteHeader(http.StatusNotFound)
	}))
	defer hibpSrv.Close()

	// 5. Real SearXNG JSON server
	searxSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"results": []map[string]string{
				{
					"title":   "内部架构备份.zip - 百度网盘",
					"url":     "https://pan.baidu.com/s/1abc",
					"content": "包含 acme.com 内部系统清单",
					"engine":  "baidu",
				},
			},
		})
	}))
	defer searxSrv.Close()

	// 6. Real Credential CTI JSON gateway
	ctiCredSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"findings": []map[string]string{
				{
					"source_platform": "SpyCloud CTI",
					"leak_type":       "credential_alert",
					"severity":        "critical",
					"title":           "Stealer log match for ops@acme.com",
					"source_ref":      "cti://record/101",
					"raw_snippet":     "password=MyStealerPass99",
					"affected_entity": "ops@acme.com",
				},
			},
		})
	}))
	defer ctiCredSrv.Close()

	reg := NewConnectorRegistry()
	ctx := context.Background()

	// Verify local directory Gitleaks/regex scan
	codeProv, _ := reg.Get("conn_code_gitleaks")
	localFindings, err := codeProv.FetchAlerts(ctx, ConnectorRuntimeConfig{ID: "conn_code_gitleaks", EndpointURL: tmpRepo}, []string{"api_key"}, time.Time{})
	if err != nil || len(localFindings) == 0 {
		t.Fatalf("expected local repo findings, got err=%v len=%d", err, len(localFindings))
	}

	// Verify GitHub Code Search integration
	ghCfg := ConnectorRuntimeConfig{ID: "conn_code_gitleaks", EndpointURL: ghSrv.URL + "/search/code", APIKeySecret: "gh-test-token"}
	if err := codeProv.TestConnection(ctx, ghCfg); err != nil {
		t.Fatalf("github TestConnection failed: %v", err)
	}
	ghFindings, err := codeProv.FetchAlerts(ctx, ghCfg, []string{"acme.com"}, time.Time{})
	if err != nil || len(ghFindings) != 1 || ghFindings[0].Severity != "high" {
		t.Fatalf("unexpected github findings: err=%v items=%+v", err, ghFindings)
	}

	// Verify OpenCTI GraphQL integration
	octiProv, _ := reg.Get("conn_cti_opencti")
	octiCfg := ConnectorRuntimeConfig{ID: "conn_cti_opencti", EndpointURL: openctiSrv.URL + "/graphql", APIKeySecret: "opencti-secret"}
	if err := octiProv.TestConnection(ctx, octiCfg); err != nil {
		t.Fatalf("opencti TestConnection failed: %v", err)
	}
	octiFindings, err := octiProv.FetchAlerts(ctx, octiCfg, []string{"acme.com"}, time.Time{})
	if err != nil || len(octiFindings) != 1 || octiFindings[0].Severity != "critical" {
		t.Fatalf("unexpected opencti findings: err=%v items=%+v", err, octiFindings)
	}

	// Verify HIBP v3 integration (both hit & 404 clean)
	hibpProv, _ := reg.Get("conn_platform_email")
	hibpCfg := ConnectorRuntimeConfig{ID: "conn_platform_email", EndpointURL: hibpSrv.URL + "/api/v3", APIKeySecret: "hibp-key-1"}
	if err := hibpProv.TestConnection(ctx, hibpCfg); err != nil {
		t.Fatalf("hibp TestConnection failed: %v", err)
	}
	hibpFindings, err := hibpProv.FetchAlerts(ctx, hibpCfg, []string{"@acme.com"}, time.Time{})
	if err != nil || len(hibpFindings) != 1 || hibpFindings[0].AffectedEntity != "alice@acme.com" {
		t.Fatalf("unexpected hibp findings: err=%v items=%+v", err, hibpFindings)
	}

	// Verify SearXNG OSINT integration
	cloudProv, _ := reg.Get("conn_cloud_drive")
	cloudFindings, err := cloudProv.FetchAlerts(ctx, ConnectorRuntimeConfig{ID: "conn_cloud_drive", EndpointURL: searxSrv.URL + "/search"}, []string{"acme.com"}, time.Time{})
	if err != nil || len(cloudFindings) != 1 || cloudFindings[0].SourceRef != "https://pan.baidu.com/s/1abc" {
		t.Fatalf("unexpected cloud findings: err=%v items=%+v", err, cloudFindings)
	}

	// Verify Credential CTI integration
	credProv, _ := reg.Get("conn_cti_credential")
	credFindings, err := credProv.FetchAlerts(ctx, ConnectorRuntimeConfig{ID: "conn_cti_credential", EndpointURL: ctiCredSrv.URL}, []string{"acme.com"}, time.Time{})
	if err != nil || len(credFindings) != 1 || credFindings[0].AffectedEntity != "ops@acme.com" {
		t.Fatalf("unexpected cred findings: err=%v items=%+v", err, credFindings)
	}
}

func TestCompositeDiscoveryRealLocalProbe(t *testing.T) {
	// Spin up a real local HTTP server on an ephemeral port.
	webSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Server", "StrixTest/1.0")
		w.Header().Set("Content-Type", "text/html")
		_, _ = w.Write([]byte(`<html><head><title>Local EASM Probe Target</title></head><body>ok</body></html>`))
	}))
	defer webSrv.Close()

	u, err := url.Parse(webSrv.URL)
	if err != nil {
		t.Fatal(err)
	}
	_, portStr, err := net.SplitHostPort(u.Host)
	if err != nil {
		t.Fatal(err)
	}
	openPort, _ := strconv.Atoi(portStr)

	// Find a guaranteed closed local port.
	tmpLn, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	closedPort := tmpLn.Addr().(*net.TCPAddr).Port
	_ = tmpLn.Close()

	adapter := &CompositeDiscoveryAdapter{
		ProbeTimeout: 1500 * time.Millisecond,
		DefaultPorts: []int{openPort, closedPort},
	}

	batch, err := adapter.DiscoverWithOptions(context.Background(), "127.0.0.1", nil)
	if err != nil {
		t.Fatalf("DiscoverWithOptions failed: %v", err)
	}
	if len(batch.Assets) != 1 {
		t.Fatalf("expected exactly 1 open asset (no mock fallback), got %d: %+v", len(batch.Assets), batch.Assets)
	}
	asset := batch.Assets[0]
	if asset.Port != openPort || asset.Fingerprint["server"] != "StrixTest/1.0" || asset.Fingerprint["title"] != "Local EASM Probe Target" {
		t.Fatalf("unexpected real probe fingerprint: %+v", asset)
	}

	// Probing only closed port must yield 0 assets (ZERO mock data).
	emptyBatch, err := adapter.DiscoverWithOptions(context.Background(), "127.0.0.1", []int{closedPort})
	if err != nil {
		t.Fatalf("DiscoverWithOptions closed port failed: %v", err)
	}
	if len(emptyBatch.Assets) != 0 || len(emptyBatch.Warnings) == 0 {
		t.Fatalf("expected 0 assets and warning for closed port, got assets=%d warnings=%v", len(emptyBatch.Assets), emptyBatch.Warnings)
	}
}

func TestVerifyConvergenceTicketRealTCP(t *testing.T) {
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	port := ln.Addr().(*net.TCPAddr).Port
	ident := net.JoinHostPort("127.0.0.1", strconv.Itoa(port))

	// While port is open, retest MUST fail.
	resOpen := VerifyConvergenceTicket(context.Background(), ChangeHighRiskExposure, 1, ident, "127.0.0.1", port, false, true)
	if resOpen.Passed {
		t.Fatalf("expected retest to fail while port %d is open: %+v", port, resOpen)
	}

	// After closing listener, retest MUST pass.
	_ = ln.Close()
	resClosed := VerifyConvergenceTicket(context.Background(), ChangeHighRiskExposure, 1, ident, "127.0.0.1", port, false, true)
	if !resClosed.Passed {
		t.Fatalf("expected retest to pass after closing port %d: %+v", port, resClosed)
	}
}

func TestSchedulerReloadAndValidateCron(t *testing.T) {
	if err := ValidateCron("0 */6 * * *"); err != nil {
		t.Fatalf("expected valid cron, got %v", err)
	}
	if err := ValidateCron("not-a-cron"); err == nil {
		t.Fatalf("expected error for invalid cron")
	}

	sched := NewScheduler()
	sched.Start()
	defer sched.Stop()

	count, err := sched.Reload([]ScheduledJob{
		{Name: "job1", Spec: "0 */6 * * *", Run: func() {}},
		{Name: "job2", Spec: "*/30 * * * *", Run: func() {}},
	})
	if err != nil || count != 2 || sched.ActiveJobCount() != 2 {
		t.Fatalf("expected 2 scheduled jobs, got count=%d active=%d err=%v", count, sched.ActiveJobCount(), err)
	}

	count2, err := sched.Reload([]ScheduledJob{
		{Name: "job1", Spec: "0 0 * * *", Run: func() {}},
	})
	if err != nil || count2 != 1 || sched.ActiveJobCount() != 1 {
		t.Fatalf("expected 1 scheduled job after reload, got count=%d active=%d err=%v", count2, sched.ActiveJobCount(), err)
	}
}

func TestGitLabGiteeMISPAndPublicIndex(t *testing.T) {
	gitlabSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("PRIVATE-TOKEN") != "gl-token" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		if strings.HasSuffix(r.URL.Path, "/version") {
			_, _ = w.Write([]byte(`{"version":"16.0.0"}`))
			return
		}
		_, _ = w.Write([]byte(`[{"basename":".env","path":".env","data":"password=GitLabSecret99","project_id":7,"ref":"main"}]`))
	}))
	defer gitlabSrv.Close()

	giteeSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Get("access_token") != "gitee-token" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		if strings.HasSuffix(r.URL.Path, "/user") {
			_, _ = w.Write([]byte(`{"login":"ops"}`))
			return
		}
		_, _ = w.Write([]byte(`[{"full_name":"acme/config","html_url":"https://gitee.com/acme/config","description":"password=GiteeSecret99"}]`))
	}))
	defer giteeSrv.Close()

	htmlSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte(`<a href="https://pan.baidu.com/s/1abc">内部备份</a>`))
	}))
	defer htmlSrv.Close()

	mispSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Authorization") != "misp-key" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		if strings.HasSuffix(r.URL.Path, "/getVersion") {
			_, _ = w.Write([]byte(`{"version":"2.4"}`))
			return
		}
		_, _ = w.Write([]byte(`{"response":[{"Event":{"id":"9","info":"茶马古道 提及 acme.com","date":"2026-01-02","threat_level_id":"1","Attribute":[{"type":"text","value":"acme.com","comment":"forum mention"}]}}]}`))
	}))
	defer mispSrv.Close()

	reg := NewConnectorRegistry()
	ctx := context.Background()
	gitlab, ok := reg.Get("conn_code_gitlab")
	if !ok {
		t.Fatal("missing gitlab connector")
	}
	glCfg := ConnectorRuntimeConfig{EndpointURL: gitlabSrv.URL + "/api/v4", APIKeySecret: "gl-token"}
	if err := gitlab.TestConnection(ctx, glCfg); err != nil {
		t.Fatalf("gitlab test: %v", err)
	}
	glFindings, err := gitlab.FetchAlerts(ctx, glCfg, []string{"acme"}, time.Time{})
	if err != nil || len(glFindings) != 1 || glFindings[0].SourcePlatform != "GitLab" || glFindings[0].Severity != "high" {
		t.Fatalf("gitlab findings: err=%v items=%+v", err, glFindings)
	}

	gitee, _ := reg.Get("conn_code_gitee")
	geCfg := ConnectorRuntimeConfig{EndpointURL: giteeSrv.URL + "/api/v5", APIKeySecret: "gitee-token"}
	if err := gitee.TestConnection(ctx, geCfg); err != nil {
		t.Fatalf("gitee test: %v", err)
	}
	geFindings, err := gitee.FetchAlerts(ctx, geCfg, []string{"acme"}, time.Time{})
	if err != nil || len(geFindings) != 1 || geFindings[0].SourcePlatform != "Gitee" {
		t.Fatalf("gitee findings: err=%v items=%+v", err, geFindings)
	}

	cloud, _ := reg.Get("conn_cloud_drive")
	htmlFindings, err := cloud.FetchAlerts(ctx, ConnectorRuntimeConfig{EndpointURL: htmlSrv.URL + "/html"}, []string{"acme"}, time.Time{})
	if err != nil || len(htmlFindings) != 1 || htmlFindings[0].SourcePlatform != "百度网盘" {
		t.Fatalf("html index findings: err=%v items=%+v", err, htmlFindings)
	}

	octi, _ := reg.Get("conn_cti_opencti")
	mispCfg := ConnectorRuntimeConfig{EndpointURL: mispSrv.URL + "/events/restSearch", APIKeySecret: "misp-key"}
	if err := octi.TestConnection(ctx, mispCfg); err != nil {
		t.Fatalf("misp test: %v", err)
	}
	mispFindings, err := octi.FetchAlerts(ctx, mispCfg, []string{"acme.com"}, time.Time{})
	if err != nil || len(mispFindings) != 1 || mispFindings[0].SourcePlatform != "茶马古道" || mispFindings[0].Severity != "critical" {
		t.Fatalf("misp findings: err=%v items=%+v", err, mispFindings)
	}
	if ProviderCovers("conn_code_gitlab", ChannelCodeRepo, []string{"github"}) {
		t.Fatal("gitlab connector should not cover github-only rules")
	}
	if !ProviderCovers("conn_code_gitlab", ChannelCodeRepo, []string{"gitlab"}) {
		t.Fatal("gitlab connector should cover gitlab rules")
	}
}

func TestExposureAssessmentParsers(t *testing.T) {
	services := ParseNmapServices("80/tcp open http nginx 1.18\n6379/tcp open redis Redis key-value store\n")
	if services[80].Name != "http" || services[6379].Version == "" {
		t.Fatalf("unexpected nmap parse: %+v", services)
	}
	httpx := ParseHttpxJSONLines([]byte("{\"url\":\"https://app.example:8443/\",\"title\":\"Jenkins\",\"status_code\":200,\"tech\":[\"Jenkins\"]}\n"))
	info, ok := httpx["app.example:8443"]
	if !ok || info.Title != "Jenkins" || len(info.Tech) != 1 {
		t.Fatalf("unexpected httpx parse: %+v", httpx)
	}
	level, notes := ClassifyExposure(DiscoveredAsset{
		Identifier:  "app.example:8443",
		Port:        8443,
		ServiceName: "https",
		Fingerprint: map[string]interface{}{"title": "Jenkins", "service_version": "2.426"},
	})
	if level != "high" || len(notes) == 0 {
		t.Fatalf("expected admin console note, level=%s notes=%v", level, notes)
	}
	_, diffs := ComputeAssetDiffs(DiscoveredAsset{
		Identifier:  "app.example:8443",
		Port:        8443,
		Fingerprint: map[string]interface{}{"exposure_findings": []string{"疑似管理入口或敏感控制台：jenkins"}},
	}, nil, true)
	found := false
	for _, d := range diffs {
		if d.ChangeType == ChangeExposureAssessed {
			found = true
		}
	}
	if !found {
		t.Fatalf("expected exposure ticket, got %+v", diffs)
	}
}
