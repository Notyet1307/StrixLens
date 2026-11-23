package handler

import (
	"bytes"
	"encoding/json"
	"net"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strconv"
	"strings"
	"testing"

	"cyberstrike-ai/internal/database"
	"cyberstrike-ai/internal/easmdrp"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func setupEASMDRPTestRouter(t *testing.T) (*gin.Engine, *database.DB, *EASMDRPHandler) {
	t.Helper()
	gin.SetMode(gin.TestMode)
	dbPath := t.TempDir() + "/easm_drp_test.db"
	db, err := database.NewDB(dbPath, zap.NewNop())
	if err != nil {
		t.Fatalf("NewDB failed: %v", err)
	}
	t.Cleanup(func() { _ = db.Close() })

	h := NewEASMDRPHandler(db, zap.NewNop())
	t.Cleanup(func() { h.StopScheduler() })

	r := gin.New()
	easm := r.Group("/api/v1/easm")
	{
		easm.GET("/dashboard", h.GetEASMDashboard)
		easm.GET("/assets", h.ListEASMAssets)
		easm.POST("/assets", h.CreateEASMAsset)
		easm.PATCH("/assets/:id", h.UpdateEASMAsset)
		easm.POST("/scans/trigger", h.TriggerEASMScan)
		easm.POST("/assess", h.AssessEASMAssets)
		easm.GET("/convergence", h.ListEASMConvergence)
		easm.PATCH("/convergence/:id", h.UpdateEASMConvergence)
	}
	drp := r.Group("/api/v1/drp")
	{
		drp.GET("/overview", h.GetDRPOverview)
		drp.GET("/events", h.ListDRPEvents)
		drp.PATCH("/events/:id/triage", h.TriageDRPEvent)
		drp.GET("/rules", h.ListDRPRules)
		drp.POST("/rules", h.CreateDRPRule)
		drp.PUT("/rules/:id", h.UpdateDRPRule)
		drp.DELETE("/rules/:id", h.DeleteDRPRule)
		drp.GET("/connectors", h.ListDRPConnectors)
		drp.PUT("/connectors/:id", h.UpdateDRPConnector)
		drp.POST("/connectors/:id/test", h.TestDRPConnector)
		drp.POST("/scans/trigger", h.TriggerDRPScan)
	}
	return r, db, h
}

func doJSONRequest(t *testing.T, r *gin.Engine, method, path string, body interface{}) *httptest.ResponseRecorder {
	t.Helper()
	var buf bytes.Buffer
	if body != nil {
		if err := json.NewEncoder(&buf).Encode(body); err != nil {
			t.Fatalf("encode body: %v", err)
		}
	}
	req := httptest.NewRequest(method, path, &buf)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestEASMFullLifecycleAPI(t *testing.T) {
	r, _, h := setupEASMDRPTestRouter(t)
	h.StartScheduler()

	// 0. Empty target_domain without snapshot must return 400 (no mock fallback)
	wEmpty := doJSONRequest(t, r, http.MethodPost, "/api/v1/easm/scans/trigger", map[string]interface{}{})
	if wEmpty.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for empty EASM target, got %d body=%s", wEmpty.Code, wEmpty.Body.String())
	}

	// 1. Spin up a real local HTTP server to scan with real prober
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Server", "RealProbeTarget/2.0")
		_, _ = w.Write([]byte("<html><head><title>EASM Target</title></head></html>"))
	}))
	u, _ := url.Parse(srv.URL)
	_, portStr, _ := net.SplitHostPort(u.Host)
	openPort, _ := strconv.Atoi(portStr)

	w := doJSONRequest(t, r, http.MethodPost, "/api/v1/easm/scans/trigger", map[string]interface{}{
		"target_domain": "127.0.0.1",
		"ports":         []int{openPort},
	})
	if w.Code != http.StatusOK {
		t.Fatalf("trigger scan status=%d body=%s", w.Code, w.Body.String())
	}
	var scanRes map[string]interface{}
	_ = json.Unmarshal(w.Body.Bytes(), &scanRes)
	if scanRes["discovered_count"].(float64) != 1 {
		t.Fatalf("expected 1 discovered real asset, got %v", scanRes)
	}
	if scanRes["convergence_created"].(float64) < 1 {
		t.Fatalf("expected shadow convergence ticket created, got %v", scanRes)
	}

	// 2. Dashboard reflects real assets & engine capabilities
	wDash := doJSONRequest(t, r, http.MethodGet, "/api/v1/easm/dashboard", nil)
	if wDash.Code != http.StatusOK {
		t.Fatalf("dashboard status=%d body=%s", wDash.Code, wDash.Body.String())
	}
	var dash map[string]interface{}
	_ = json.Unmarshal(wDash.Body.Bytes(), &dash)
	if dash["total_assets"].(float64) < 1 {
		t.Fatalf("expected total_assets >= 1, got %v", dash["total_assets"])
	}
	if dash["scheduled_jobs"].(float64) < 1 {
		t.Fatalf("expected scheduled_jobs >= 1, got %v", dash["scheduled_jobs"])
	}

	// 3. List convergence tickets & verify real retest behavior:
	//    openPort is STILL open and asset is still shadow -> retest MUST fail (status=verifying)!
	wConv := doJSONRequest(t, r, http.MethodGet, "/api/v1/easm/convergence", nil)
	if wConv.Code != http.StatusOK {
		t.Fatalf("list convergence status=%d", wConv.Code)
	}
	var convList struct {
		Items []database.EASMConvergence `json:"items"`
	}
	_ = json.Unmarshal(wConv.Body.Bytes(), &convList)
	if len(convList.Items) == 0 {
		t.Fatalf("expected convergence items")
	}

	ticketID := convList.Items[0].ID
	wFailRetest := doJSONRequest(t, r, http.MethodPatch, "/api/v1/easm/convergence/"+strconv.FormatInt(ticketID, 10), map[string]interface{}{
		"assignee":       "secops-alice",
		"trigger_retest": true,
	})
	if wFailRetest.Code != http.StatusOK {
		t.Fatalf("patch convergence status=%d body=%s", wFailRetest.Code, wFailRetest.Body.String())
	}
	if !strings.Contains(wFailRetest.Body.String(), `"convergence_status":"verifying"`) {
		t.Fatalf("expected open shadow target to stay in verifying when retest fails, got: %s", wFailRetest.Body.String())
	}

	// 4. Close the local server so the endpoint is truly offline, then re-run retest -> MUST pass & close!
	srv.Close()
	wPassRetest := doJSONRequest(t, r, http.MethodPatch, "/api/v1/easm/convergence/"+strconv.FormatInt(ticketID, 10), map[string]interface{}{
		"assignee":       "secops-alice",
		"trigger_retest": true,
	})
	if wPassRetest.Code != http.StatusOK {
		t.Fatalf("patch convergence after close status=%d body=%s", wPassRetest.Code, wPassRetest.Body.String())
	}
	if !strings.Contains(wPassRetest.Body.String(), `"convergence_status":"closed"`) {
		t.Fatalf("expected retest after taking endpoint offline to close ticket, got: %s", wPassRetest.Body.String())
	}
}

func TestDRPFullLifecycleMaskingDedupAndWhitelistAPI(t *testing.T) {
	r, _, _ := setupEASMDRPTestRouter(t)

	// 1. Verify default connectors are initialized as 'unconfigured' (no fake healthy status)
	wConn := doJSONRequest(t, r, http.MethodGet, "/api/v1/drp/connectors", nil)
	if wConn.Code != http.StatusOK {
		t.Fatalf("connectors status=%d", wConn.Code)
	}
	var connRes struct {
		Connectors []database.DRPConnector `json:"connectors"`
	}
	_ = json.Unmarshal(wConn.Body.Bytes(), &connRes)
	if len(connRes.Connectors) != 9 {
		t.Fatalf("expected 9 default connectors, got %d", len(connRes.Connectors))
	}
	for _, c := range connRes.Connectors {
		if c.HealthStatus != "unconfigured" {
			t.Fatalf("expected connector %s to start unconfigured, got %s", c.ID, c.HealthStatus)
		}
	}

	// 2. Triggering scan with zero rules must return 0 events + warnings (no fake rules created)
	wNoRules := doJSONRequest(t, r, http.MethodPost, "/api/v1/drp/scans/trigger", map[string]interface{}{})
	if wNoRules.Code != http.StatusOK {
		t.Fatalf("no-rules scan status=%d", wNoRules.Code)
	}
	var noRuleRes easmdrp.DRPScanResult
	_ = json.Unmarshal(wNoRules.Body.Bytes(), &noRuleRes)
	if noRuleRes.RulesEvaluated != 0 || noRuleRes.DedupedCreated != 0 || len(noRuleRes.Warnings) == 0 {
		t.Fatalf("expected 0 rules/events and warning when unconfigured, got: %+v", noRuleRes)
	}

	// 3. Configure conn_code_gitleaks against a real local httptest GitHub Search endpoint & test connectivity
	ghSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Authorization") != "Bearer gh-secret-token" {
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
						"name":       "config.env",
						"path":       "config.env",
						"html_url":   "https://github.com/acme/app/blob/main/config.env",
						"repository": map[string]string{"full_name": "acme/app"},
						"text_matches": []map[string]string{
							{"fragment": "token=SuperSecretValue9988"},
						},
					},
				},
			})
			return
		}
		w.WriteHeader(http.StatusNotFound)
	}))
	defer ghSrv.Close()

	wPut := doJSONRequest(t, r, http.MethodPut, "/api/v1/drp/connectors/conn_code_gitleaks", map[string]interface{}{
		"endpoint_url": ghSrv.URL + "/search/code",
		"api_key":      "gh-secret-token",
		"is_enabled":   true,
	})
	if wPut.Code != http.StatusOK {
		t.Fatalf("update connector failed: %d %s", wPut.Code, wPut.Body.String())
	}

	wTestConn := doJSONRequest(t, r, http.MethodPost, "/api/v1/drp/connectors/conn_code_gitleaks/test", nil)
	if wTestConn.Code != http.StatusOK || !strings.Contains(wTestConn.Body.String(), `"ok":true`) {
		t.Fatalf("expected connector test ok=true, got %d %s", wTestConn.Code, wTestConn.Body.String())
	}

	// 4. Create a rule & trigger DRP scan twice to verify real fetch + masking + deduplication
	wRule := doJSONRequest(t, r, http.MethodPost, "/api/v1/drp/rules", map[string]interface{}{
		"rule_name":       "企业代码仓库凭据监测",
		"channel_group":   "code_repo",
		"enabled_sources": []string{"code_repo"},
		"keywords":        []string{"acme.com"},
		"is_enabled":      true,
	})
	if wRule.Code != http.StatusCreated {
		t.Fatalf("create rule status=%d body=%s", wRule.Code, wRule.Body.String())
	}

	wScan1 := doJSONRequest(t, r, http.MethodPost, "/api/v1/drp/scans/trigger", map[string]interface{}{"channel_group": "code_repo"})
	if wScan1.Code != http.StatusOK {
		t.Fatalf("drp scan1 status=%d body=%s", wScan1.Code, wScan1.Body.String())
	}
	var s1 easmdrp.DRPScanResult
	_ = json.Unmarshal(wScan1.Body.Bytes(), &s1)
	if s1.DedupedCreated != 1 {
		t.Fatalf("expected 1 created event on first scan, got %+v", s1)
	}

	// Second identical scan must dedup to 0 new events
	wScan2 := doJSONRequest(t, r, http.MethodPost, "/api/v1/drp/scans/trigger", map[string]interface{}{"channel_group": "code_repo"})
	var s2 easmdrp.DRPScanResult
	_ = json.Unmarshal(wScan2.Body.Bytes(), &s2)
	if s2.DedupedCreated != 0 {
		t.Fatalf("expected 0 new events on duplicate scan, got %+v", s2)
	}

	// Verify sensitive secret was masked before storage
	wEvents := doJSONRequest(t, r, http.MethodGet, "/api/v1/drp/events?channel_group=code_repo", nil)
	if strings.Contains(wEvents.Body.String(), "SuperSecretValue9988") {
		t.Fatalf("plain secret leaked into API response: %s", wEvents.Body.String())
	}
	if !strings.Contains(wEvents.Body.String(), "Su****88") {
		t.Fatalf("expected masked token Su****88 in events response: %s", wEvents.Body.String())
	}

	// 5. Triage event as ignored + add_to_whitelist
	var evList struct {
		Events []database.DRPLeakEvent `json:"events"`
	}
	_ = json.Unmarshal(wEvents.Body.Bytes(), &evList)
	if len(evList.Events) == 0 {
		t.Fatalf("expected stored events")
	}
	wTriage := doJSONRequest(t, r, http.MethodPatch, "/api/v1/drp/events/"+strconv.FormatInt(evList.Events[0].ID, 10)+"/triage", map[string]interface{}{
		"triage_status":    "ignored",
		"remediation_note": "测试仓库误报，已加白",
		"add_to_whitelist": true,
	})
	if wTriage.Code != http.StatusOK {
		t.Fatalf("triage status=%d body=%s", wTriage.Code, wTriage.Body.String())
	}
	if !strings.Contains(wTriage.Body.String(), `"whitelist_added":true`) {
		t.Fatalf("expected whitelist_added=true, got: %s", wTriage.Body.String())
	}
}
