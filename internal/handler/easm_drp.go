package handler

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"cyberstrike-ai/internal/database"
	"cyberstrike-ai/internal/easmdrp"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// EASMDRPHandler exposes RESTful APIs for Attack Surface Management (/api/v1/easm)
// and Digital Risk & Leak Monitoring (/api/v1/drp).
type EASMDRPHandler struct {
	db        *database.DB
	logger    *zap.Logger
	discovery easmdrp.AssetDiscoveryAdapter
	registry  *easmdrp.ConnectorRegistry
	scheduler *easmdrp.Scheduler
}

// NewEASMDRPHandler constructs the handler, initializes unconfigured DRP connectors,
// and prepares the background cron scheduler.
func NewEASMDRPHandler(db *database.DB, logger *zap.Logger) *EASMDRPHandler {
	h := &EASMDRPHandler{
		db:        db,
		logger:    logger,
		discovery: easmdrp.NewCompositeDiscoveryAdapter(),
		registry:  easmdrp.NewConnectorRegistry(),
		scheduler: easmdrp.NewScheduler(),
	}
	if db != nil {
		defaults := make([]database.DRPConnector, 0)
		for _, meta := range easmdrp.DefaultConnectors() {
			defaults = append(defaults, database.DRPConnector{
				ID:           meta.ID,
				Name:         meta.Name,
				ChannelGroup: meta.ChannelGroup,
				ProviderType: meta.ProviderType,
				EndpointURL:  meta.DefaultEndpoint,
				ScheduleCron: meta.DefaultCron,
				IsEnabled:    true,
				HealthStatus: "unconfigured",
			})
		}
		if err := db.EnsureDefaultDRPConnectors(defaults); err != nil && logger != nil {
			logger.Warn("初始化默认 DRP 情报源连接器失败", zap.Error(err))
		}
		if err := db.NormalizeUnconfiguredConnectors(); err != nil && logger != nil {
			logger.Warn("规范化未配置 DRP 连接器状态失败", zap.Error(err))
		}
	}
	return h
}

// StartScheduler loads persisted cron schedules and starts background EASM/DRP jobs.
func (h *EASMDRPHandler) StartScheduler() {
	if h == nil || h.scheduler == nil {
		return
	}
	h.ReloadScheduler()
	h.scheduler.Start()
}

// StopScheduler gracefully stops background EASM/DRP cron jobs.
func (h *EASMDRPHandler) StopScheduler() {
	if h == nil || h.scheduler == nil {
		return
	}
	h.scheduler.Stop()
}

// ReloadScheduler rebuilds active cron entries from persisted DRP rules + EASM drift probe.
func (h *EASMDRPHandler) ReloadScheduler() {
	if h == nil || h.scheduler == nil || h.db == nil {
		return
	}
	jobs := []easmdrp.ScheduledJob{
		{
			Name: "easm_active_drift_reprobe",
			Spec: "0 */6 * * *",
			Run: func() {
				ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
				defer cancel()
				h.reprobeActiveAssets(ctx)
			},
		},
	}

	rules, err := h.db.ListDRPMonitorRules()
	if err == nil {
		for _, rule := range rules {
			if !rule.IsEnabled || strings.TrimSpace(rule.ScheduleCron) == "" {
				continue
			}
			rID := rule.ID
			rName := rule.RuleName
			rSpec := rule.ScheduleCron
			jobs = append(jobs, easmdrp.ScheduledJob{
				Name: fmt.Sprintf("drp_rule_%d_%s", rID, rName),
				Spec: rSpec,
				Run: func() {
					ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
					defer cancel()
					_, _ = h.executeDRPScan(ctx, "", rID)
				},
			})
		}
	}

	count, reloadErr := h.scheduler.Reload(jobs)
	if reloadErr != nil && h.logger != nil {
		h.logger.Warn("重载 EASM/DRP 定时任务部分失败", zap.Error(reloadErr))
	} else if h.logger != nil {
		h.logger.Info("EASM/DRP 定时调度器已就绪", zap.Int("scheduled_jobs", count))
	}
}

func (h *EASMDRPHandler) reprobeActiveAssets(ctx context.Context) {
	assets, err := h.db.ListActiveEASMAssets(50)
	if err != nil || len(assets) == 0 {
		return
	}
	for _, a := range assets {
		if ctx.Err() != nil {
			return
		}
		host := strings.Split(a.Identifier, ":")[0]
		probe := easmdrp.ProbeEndpoint(ctx, host, a.IPAddress, a.Port, 2*time.Second)
		if !probe.Open {
			continue
		}
		discovered := easmdrp.DiscoveredAsset{
			AssetType:   a.AssetType,
			Identifier:  a.Identifier,
			IPAddress:   a.IPAddress,
			Port:        a.Port,
			ServiceName: firstNonEmpty(probe.ServiceName, a.ServiceName),
			Fingerprint: probe.Fingerprint,
			OwnerDept:   a.OwnerDept,
			Source:      "scheduled_reprobe",
		}
		prevSnap := &easmdrp.ExistingAssetSnapshot{
			ID:          a.ID,
			AssetType:   a.AssetType,
			Identifier:  a.Identifier,
			IPAddress:   a.IPAddress,
			Port:        a.Port,
			ServiceName: a.ServiceName,
			Fingerprint: a.Fingerprint,
			IsShadow:    a.IsShadow,
			RiskLevel:   a.RiskLevel,
			Status:      a.Status,
		}
		inCMDB := h.db.IsInCMDBBaseline(a.Identifier, a.IPAddress)
		isShadow, diffs := easmdrp.ComputeAssetDiffs(discovered, prevSnap, inCMDB)
		updatedAsset := &database.EASMAsset{
			AssetType:   discovered.AssetType,
			Identifier:  discovered.Identifier,
			IPAddress:   discovered.IPAddress,
			Port:        discovered.Port,
			ServiceName: discovered.ServiceName,
			Fingerprint: discovered.Fingerprint,
			IsShadow:    isShadow,
			OwnerDept:   a.OwnerDept,
			RiskLevel:   easmdrp.EvaluateRiskLevel(discovered, isShadow),
			Status:      "active",
		}
		_, _ = h.db.UpsertEASMAsset(updatedAsset)
		for _, d := range diffs {
			_ = h.db.CreateEASMConvergence(&database.EASMConvergence{
				AssetID:    a.ID,
				ChangeType: d.ChangeType,
				DiffDetail: map[string]interface{}{
					"summary":     d.Summary,
					"before":      d.Before,
					"after":       d.After,
					"detected_at": d.DetectedAt.Format(time.RFC3339),
				},
				ConvergenceStatus: easmdrp.ConvergenceOpen,
			})
		}
	}
}

// ============================================================================
// EASM Endpoints (/api/v1/easm)
// ============================================================================

// GetEASMDashboard handles GET /api/v1/easm/dashboard
func (h *EASMDRPHandler) GetEASMDashboard(c *gin.Context) {
	stats, err := h.db.GetEASMDashboardStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "加载暴露面大盘失败: " + err.Error()})
		return
	}
	caps := easmdrp.DetectAvailableEngines()
	engines := make([]interface{}, 0, len(caps))
	for _, capItem := range caps {
		engines = append(engines, capItem)
	}
	stats.Engines = engines
	if h.scheduler != nil {
		stats.ScheduledJobs = h.scheduler.ActiveJobCount()
	}
	c.JSON(http.StatusOK, stats)
}

// ListEASMAssets handles GET /api/v1/easm/assets
func (h *EASMDRPHandler) ListEASMAssets(c *gin.Context) {
	filter := database.EASMAssetFilter{
		RiskLevel: c.Query("risk_level"),
		Status:    c.Query("status"),
		AssetType: c.Query("asset_type"),
		Query:     c.Query("q"),
		Page:      parsePositiveInt(c.Query("page"), 1),
		PageSize:  parsePositiveInt(c.Query("page_size"), 20),
	}
	if raw := strings.TrimSpace(c.Query("is_shadow")); raw != "" {
		b := raw == "true" || raw == "1"
		filter.IsShadow = &b
	}
	items, total, err := h.db.ListEASMAssets(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询暴露面资产失败: " + err.Error()})
		return
	}
	totalPages := (total + filter.PageSize - 1) / filter.PageSize
	if totalPages < 1 {
		totalPages = 1
	}
	c.JSON(http.StatusOK, gin.H{
		"assets":      items,
		"total":       total,
		"page":        filter.Page,
		"page_size":   filter.PageSize,
		"total_pages": totalPages,
	})
}

// CreateEASMAsset handles POST /api/v1/easm/assets
func (h *EASMDRPHandler) CreateEASMAsset(c *gin.Context) {
	var req struct {
		AssetType   string                 `json:"asset_type"`
		Identifier  string                 `json:"identifier"`
		IPAddress   string                 `json:"ip_address"`
		Port        int                    `json:"port"`
		ServiceName string                 `json:"service_name"`
		Fingerprint map[string]interface{} `json:"fingerprint"`
		IsShadow    *bool                  `json:"is_shadow"`
		OwnerDept   string                 `json:"owner_dept"`
		RiskLevel   string                 `json:"risk_level"`
		Status      string                 `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求参数无效: " + err.Error()})
		return
	}
	req.AssetType = strings.TrimSpace(req.AssetType)
	req.Identifier = strings.TrimSpace(req.Identifier)
	if req.AssetType == "" {
		req.AssetType = "web_service"
	}
	if req.Identifier == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "identifier 不能为空"})
		return
	}

	discovered := easmdrp.DiscoveredAsset{
		AssetType:   req.AssetType,
		Identifier:  req.Identifier,
		IPAddress:   strings.TrimSpace(req.IPAddress),
		Port:        req.Port,
		ServiceName: strings.TrimSpace(req.ServiceName),
		Fingerprint: req.Fingerprint,
		RiskLevel:   req.RiskLevel,
		OwnerDept:   strings.TrimSpace(req.OwnerDept),
		Source:      "manual",
	}

	prev, _ := h.db.GetEASMAssetByKey(discovered.AssetType, discovered.Identifier)
	var prevSnap *easmdrp.ExistingAssetSnapshot
	if prev != nil {
		prevSnap = &easmdrp.ExistingAssetSnapshot{
			ID:          prev.ID,
			AssetType:   prev.AssetType,
			Identifier:  prev.Identifier,
			IPAddress:   prev.IPAddress,
			Port:        prev.Port,
			ServiceName: prev.ServiceName,
			Fingerprint: prev.Fingerprint,
			IsShadow:    prev.IsShadow,
			RiskLevel:   prev.RiskLevel,
			Status:      prev.Status,
		}
	}
	inCMDB := h.db.IsInCMDBBaseline(discovered.Identifier, discovered.IPAddress)
	isShadow, diffs := easmdrp.ComputeAssetDiffs(discovered, prevSnap, inCMDB)
	if req.IsShadow != nil {
		isShadow = *req.IsShadow
	}

	asset := &database.EASMAsset{
		AssetType:   discovered.AssetType,
		Identifier:  discovered.Identifier,
		IPAddress:   discovered.IPAddress,
		Port:        discovered.Port,
		ServiceName: discovered.ServiceName,
		Fingerprint: discovered.Fingerprint,
		IsShadow:    isShadow,
		OwnerDept:   discovered.OwnerDept,
		RiskLevel:   easmdrp.EvaluateRiskLevel(discovered, isShadow),
		Status:      req.Status,
	}
	created, err := h.db.UpsertEASMAsset(asset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "保存暴露面资产失败: " + err.Error()})
		return
	}

	ticketsCreated := 0
	for _, d := range diffs {
		ticket := &database.EASMConvergence{
			AssetID:           asset.ID,
			ChangeType:        d.ChangeType,
			DiffDetail:        map[string]interface{}{"summary": d.Summary, "before": d.Before, "after": d.After},
			ConvergenceStatus: easmdrp.ConvergenceOpen,
		}
		if err := h.db.CreateEASMConvergence(ticket); err == nil {
			ticketsCreated++
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"asset":               asset,
		"created":             created,
		"convergence_created": ticketsCreated,
	})
}

// UpdateEASMAsset handles PATCH /api/v1/easm/assets/:id
func (h *EASMDRPHandler) UpdateEASMAsset(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的资产 ID"})
		return
	}
	var req struct {
		OwnerDept *string `json:"owner_dept"`
		IsShadow  *bool   `json:"is_shadow"`
		RiskLevel *string `json:"risk_level"`
		Status    *string `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求参数无效: " + err.Error()})
		return
	}
	updated, err := h.db.UpdateEASMAssetFields(id, req.OwnerDept, req.IsShadow, req.RiskLevel, req.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新资产失败: " + err.Error()})
		return
	}
	if updated == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "资产不存在"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"asset": updated})
}

// TriggerEASMScan handles POST /api/v1/easm/scans/trigger
func (h *EASMDRPHandler) TriggerEASMScan(c *gin.Context) {
	var req struct {
		TargetDomain string                    `json:"target_domain"`
		Ports        []int                     `json:"ports"`
		Assets       []easmdrp.DiscoveredAsset `json:"assets"` // Optional direct snapshot injection for OpenAPI / worker callbacks
		Assess       bool                      `json:"assess"`
	}
	if c.Request.ContentLength > 0 {
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "请求参数无效: " + err.Error()})
			return
		}
	}

	started := time.Now().UTC()
	discovered := req.Assets
	execMode := "worker_callback"
	engineName := "custom_snapshot"
	var enginesUsed []string
	var warnings []string

	if len(discovered) == 0 {
		if strings.TrimSpace(req.TargetDomain) == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "请提供有效的 target_domain（域名或 IP）或提交 assets 快照"})
			return
		}
		batch, err := h.discovery.DiscoverWithOptions(c.Request.Context(), req.TargetDomain, req.Ports)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "资产测绘执行失败: " + err.Error()})
			return
		}
		discovered = batch.Assets
		execMode = batch.ExecutionMode
		enginesUsed = batch.EnginesUsed
		warnings = batch.Warnings
		engineName = h.discovery.Name()
	}
	if req.Assess && len(discovered) > 0 {
		assessed := easmdrp.AssessExposedAssets(c.Request.Context(), discovered, 12)
		discovered = assessed.Assets
		enginesUsed = append(enginesUsed, assessed.Engines...)
		warnings = append(warnings, assessed.Notes...)
	}

	res := easmdrp.ScanResult{
		Engine:          engineName,
		ExecutionMode:   execMode,
		Target:          strings.TrimSpace(req.TargetDomain),
		EnginesUsed:     enginesUsed,
		Warnings:        warnings,
		DiscoveredCount: len(discovered),
		StartedAt:       started,
	}

	for _, item := range discovered {
		if strings.TrimSpace(item.Identifier) == "" {
			continue
		}
		if strings.TrimSpace(item.AssetType) == "" {
			item.AssetType = "web_service"
		}
		prev, _ := h.db.GetEASMAssetByKey(item.AssetType, item.Identifier)
		var prevSnap *easmdrp.ExistingAssetSnapshot
		if prev != nil {
			prevSnap = &easmdrp.ExistingAssetSnapshot{
				ID:          prev.ID,
				AssetType:   prev.AssetType,
				Identifier:  prev.Identifier,
				IPAddress:   prev.IPAddress,
				Port:        prev.Port,
				ServiceName: prev.ServiceName,
				Fingerprint: prev.Fingerprint,
				IsShadow:    prev.IsShadow,
				RiskLevel:   prev.RiskLevel,
				Status:      prev.Status,
			}
		}
		inCMDB := h.db.IsInCMDBBaseline(item.Identifier, item.IPAddress)
		isShadow, diffs := easmdrp.ComputeAssetDiffs(item, prevSnap, inCMDB)
		if isShadow {
			res.ShadowAssetsCount++
		}

		asset := &database.EASMAsset{
			AssetType:   item.AssetType,
			Identifier:  item.Identifier,
			IPAddress:   item.IPAddress,
			Port:        item.Port,
			ServiceName: item.ServiceName,
			Fingerprint: item.Fingerprint,
			IsShadow:    isShadow,
			OwnerDept:   item.OwnerDept,
			RiskLevel:   easmdrp.EvaluateRiskLevel(item, isShadow),
			Status:      "active",
		}
		created, err := h.db.UpsertEASMAsset(asset)
		if err != nil {
			continue
		}
		if created {
			res.NewAssetsCount++
		}
		for _, d := range diffs {
			ticket := &database.EASMConvergence{
				AssetID:    asset.ID,
				ChangeType: d.ChangeType,
				DiffDetail: map[string]interface{}{
					"summary":     d.Summary,
					"before":      d.Before,
					"after":       d.After,
					"detected_at": d.DetectedAt.Format(time.RFC3339),
				},
				ConvergenceStatus: easmdrp.ConvergenceOpen,
			}
			if err := h.db.CreateEASMConvergence(ticket); err == nil {
				res.ConvergenceCreated++
			}
		}
	}

	res.CompletedAt = time.Now().UTC()
	c.JSON(http.StatusOK, res)
}

// AssessEASMAssets handles POST /api/v1/easm/assess.
// It reviews stored or newly discovered assets with built-in probing and optional nmap/httpx.
// Exploit scripts are not executed.
func (h *EASMDRPHandler) AssessEASMAssets(c *gin.Context) {
	var req struct {
		TargetDomain string `json:"target_domain"`
		Limit        int    `json:"limit"`
	}
	if c.Request.ContentLength > 0 {
		_ = c.ShouldBindJSON(&req)
	}
	started := time.Now().UTC()
	limit := req.Limit
	if limit <= 0 || limit > 20 {
		limit = 12
	}
	discovered := make([]easmdrp.DiscoveredAsset, 0)
	execMode := "exposure_assess"
	engineName := "strixlens_exposure_review"
	var warnings []string
	if strings.TrimSpace(req.TargetDomain) != "" {
		batch, err := h.discovery.DiscoverWithOptions(c.Request.Context(), req.TargetDomain, nil)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "资产测绘执行失败: " + err.Error()})
			return
		}
		discovered = batch.Assets
		warnings = append(warnings, batch.Warnings...)
		execMode = batch.ExecutionMode
		engineName = h.discovery.Name()
	} else {
		items, _, err := h.db.ListEASMAssets(database.EASMAssetFilter{Status: "active", Page: 1, PageSize: limit})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "读取暴露面资产失败: " + err.Error()})
			return
		}
		for _, item := range items {
			discovered = append(discovered, easmdrp.DiscoveredAsset{
				AssetType:   item.AssetType,
				Identifier:  item.Identifier,
				IPAddress:   item.IPAddress,
				Port:        item.Port,
				ServiceName: item.ServiceName,
				Fingerprint: item.Fingerprint,
				RiskLevel:   item.RiskLevel,
				OwnerDept:   item.OwnerDept,
				Source:      "exposure_assess",
			})
		}
	}
	if len(discovered) == 0 {
		c.JSON(http.StatusOK, easmdrp.ScanResult{
			Engine:        engineName,
			ExecutionMode: execMode,
			Target:        strings.TrimSpace(req.TargetDomain),
			Warnings:      []string{"没有可验证的暴露面资产"},
			StartedAt:     started,
			CompletedAt:   time.Now().UTC(),
		})
		return
	}
	assessed := easmdrp.AssessExposedAssets(c.Request.Context(), discovered, limit)
	warnings = append(warnings, assessed.Notes...)
	res := easmdrp.ScanResult{
		Engine:          engineName,
		ExecutionMode:   execMode,
		Target:          strings.TrimSpace(req.TargetDomain),
		EnginesUsed:     assessed.Engines,
		Warnings:        warnings,
		DiscoveredCount: len(assessed.Assets),
		StartedAt:       started,
	}
	for _, item := range assessed.Assets {
		if strings.TrimSpace(item.Identifier) == "" {
			continue
		}
		prev, _ := h.db.GetEASMAssetByKey(item.AssetType, item.Identifier)
		var prevSnap *easmdrp.ExistingAssetSnapshot
		if prev != nil {
			prevSnap = &easmdrp.ExistingAssetSnapshot{
				ID: prev.ID, AssetType: prev.AssetType, Identifier: prev.Identifier,
				IPAddress: prev.IPAddress, Port: prev.Port, ServiceName: prev.ServiceName,
				Fingerprint: prev.Fingerprint, IsShadow: prev.IsShadow, RiskLevel: prev.RiskLevel, Status: prev.Status,
			}
		}
		inCMDB := h.db.IsInCMDBBaseline(item.Identifier, item.IPAddress)
		isShadow, diffs := easmdrp.ComputeAssetDiffs(item, prevSnap, inCMDB)
		if isShadow {
			res.ShadowAssetsCount++
		}
		asset := &database.EASMAsset{
			AssetType: item.AssetType, Identifier: item.Identifier, IPAddress: item.IPAddress,
			Port: item.Port, ServiceName: item.ServiceName, Fingerprint: item.Fingerprint,
			IsShadow: isShadow, OwnerDept: item.OwnerDept, RiskLevel: easmdrp.EvaluateRiskLevel(item, isShadow), Status: "active",
		}
		created, err := h.db.UpsertEASMAsset(asset)
		if err != nil {
			continue
		}
		if created {
			res.NewAssetsCount++
		}
		for _, d := range diffs {
			ticket := &database.EASMConvergence{
				AssetID: asset.ID, ChangeType: d.ChangeType,
				DiffDetail: map[string]interface{}{
					"summary": d.Summary, "before": d.Before, "after": d.After, "detected_at": d.DetectedAt.Format(time.RFC3339),
				},
				ConvergenceStatus: easmdrp.ConvergenceOpen,
			}
			if err := h.db.CreateEASMConvergence(ticket); err == nil {
				res.ConvergenceCreated++
			}
		}
	}
	res.CompletedAt = time.Now().UTC()
	c.JSON(http.StatusOK, res)
}

// ListEASMConvergence handles GET /api/v1/easm/convergence
func (h *EASMDRPHandler) ListEASMConvergence(c *gin.Context) {
	filter := database.EASMConvergenceFilter{
		Status:     c.Query("status"),
		ChangeType: c.Query("change_type"),
		Assignee:   c.Query("assignee"),
		Query:      c.Query("q"),
		Page:       parsePositiveInt(c.Query("page"), 1),
		PageSize:   parsePositiveInt(c.Query("page_size"), 50),
	}
	items, total, err := h.db.ListEASMConvergence(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询风险收敛工单失败: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"items":     items,
		"total":     total,
		"page":      filter.Page,
		"page_size": filter.PageSize,
	})
}

// UpdateEASMConvergence handles PATCH /api/v1/easm/convergence/:id
func (h *EASMDRPHandler) UpdateEASMConvergence(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的工单 ID"})
		return
	}
	var req struct {
		ConvergenceStatus *string `json:"convergence_status"`
		Assignee          *string `json:"assignee"`
		TriggerRetest     bool    `json:"trigger_retest"`
		RetestNote        string  `json:"retest_note"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求参数无效: " + err.Error()})
		return
	}
	if req.ConvergenceStatus != nil && !easmdrp.ValidateConvergenceTransition(*req.ConvergenceStatus) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "非法的收敛状态值"})
		return
	}

	var retest map[string]interface{}
	if req.TriggerRetest {
		ticket, err := h.db.GetEASMConvergenceByID(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "查询工单失败: " + err.Error()})
			return
		}
		if ticket == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "收敛工单不存在"})
			return
		}
		asset, err := h.db.GetEASMAssetByID(ticket.AssetID)
		if err != nil || asset == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "关联暴露面资产不存在"})
			return
		}
		inCMDB := h.db.IsInCMDBBaseline(asset.Identifier, asset.IPAddress)
		outcome := easmdrp.VerifyConvergenceTicket(
			c.Request.Context(),
			ticket.ChangeType,
			asset.ID,
			asset.Identifier,
			asset.IPAddress,
			asset.Port,
			asset.IsShadow,
			inCMDB,
		)
		summary := outcome.Summary
		if strings.TrimSpace(req.RetestNote) != "" {
			summary = strings.TrimSpace(req.RetestNote) + " | " + outcome.Summary
		}
		retest = map[string]interface{}{
			"verified_at":  outcome.VerifiedAt.Format(time.RFC3339),
			"passed":       outcome.Passed,
			"engine":       outcome.Engine,
			"probe_target": outcome.ProbeTarget,
			"observed":     outcome.Observed,
			"summary":      summary,
		}
		if outcome.Passed {
			if req.ConvergenceStatus == nil {
				closed := easmdrp.ConvergenceClosed
				req.ConvergenceStatus = &closed
			}
		} else {
			verifying := easmdrp.ConvergenceVerifying
			req.ConvergenceStatus = &verifying
		}
	}

	updated, err := h.db.UpdateEASMConvergence(id, req.ConvergenceStatus, req.Assignee, retest)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新收敛工单失败: " + err.Error()})
		return
	}
	if updated == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "收敛工单不存在"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"item": updated})
}

// ============================================================================
// DRP Endpoints (/api/v1/drp)
// ============================================================================

// GetDRPOverview handles GET /api/v1/drp/overview
func (h *EASMDRPHandler) GetDRPOverview(c *gin.Context) {
	stats, err := h.db.GetDRPOverviewStats(easmdrp.AllChannelGroups)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "加载数字风险全景失败: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, stats)
}

// ListDRPEvents handles GET /api/v1/drp/events
func (h *EASMDRPHandler) ListDRPEvents(c *gin.Context) {
	filter := database.DRPEventFilter{
		ChannelGroup: c.Query("channel_group"),
		TriageStatus: c.Query("triage_status"),
		Severity:     c.Query("severity"),
		Query:        c.Query("q"),
		Page:         parsePositiveInt(c.Query("page"), 1),
		PageSize:     parsePositiveInt(c.Query("page_size"), 20),
	}
	items, total, err := h.db.ListDRPLeakEvents(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询泄露告警失败: " + err.Error()})
		return
	}
	totalPages := (total + filter.PageSize - 1) / filter.PageSize
	if totalPages < 1 {
		totalPages = 1
	}
	c.JSON(http.StatusOK, gin.H{
		"events":      items,
		"total":       total,
		"page":        filter.Page,
		"page_size":   filter.PageSize,
		"total_pages": totalPages,
	})
}

// TriageDRPEvent handles PATCH /api/v1/drp/events/:id/triage
func (h *EASMDRPHandler) TriageDRPEvent(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的告警 ID"})
		return
	}
	var req struct {
		TriageStatus     string `json:"triage_status"`
		RemediationNote  string `json:"remediation_note"`
		AddToWhitelist   bool   `json:"add_to_whitelist"`
		WhitelistPattern string `json:"whitelist_pattern"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求参数无效: " + err.Error()})
		return
	}
	status := strings.ToLower(strings.TrimSpace(req.TriageStatus))
	switch status {
	case easmdrp.TriageNew, easmdrp.TriageConfirmed, easmdrp.TriageRemediated, easmdrp.TriageIgnored:
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的处置状态，仅支持 new / confirmed / remediated / ignored"})
		return
	}

	updated, err := h.db.UpdateDRPLeakEventTriage(id, status, req.RemediationNote)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新处置状态失败: " + err.Error()})
		return
	}
	if updated == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "泄露告警不存在"})
		return
	}

	whitelistAdded := false
	if req.AddToWhitelist && updated.RuleID != nil && *updated.RuleID > 0 {
		pattern := firstNonEmpty(req.WhitelistPattern, updated.AffectedEntity, updated.SourceRef)
		if pattern != "" {
			if err := h.db.AppendDRPRuleExclude(*updated.RuleID, pattern); err == nil {
				whitelistAdded = true
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"event":           updated,
		"whitelist_added": whitelistAdded,
	})
}

// ListDRPRules handles GET /api/v1/drp/rules
func (h *EASMDRPHandler) ListDRPRules(c *gin.Context) {
	rules, err := h.db.ListDRPMonitorRules()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询监测规则失败: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"rules": rules})
}

// CreateDRPRule handles POST /api/v1/drp/rules
func (h *EASMDRPHandler) CreateDRPRule(c *gin.Context) {
	var req database.DRPMonitorRule
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "规则参数无效: " + err.Error()})
		return
	}
	req.RuleName = strings.TrimSpace(req.RuleName)
	req.ChannelGroup = strings.TrimSpace(req.ChannelGroup)
	if req.RuleName == "" || req.ChannelGroup == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "rule_name 与 channel_group 均为必填"})
		return
	}
	if len(req.Keywords) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请至少配置一个监测关键词或企业邮箱后缀"})
		return
	}
	if req.ScheduleCron == "" {
		req.ScheduleCron = "0 */6 * * *"
	}
	if err := easmdrp.ValidateMonitorRule(req.ChannelGroup, req.EnabledSources, req.Keywords); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := easmdrp.ValidateCron(req.ScheduleCron); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.db.CreateDRPMonitorRule(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建监测规则失败: " + err.Error()})
		return
	}
	h.ReloadScheduler()
	c.JSON(http.StatusCreated, gin.H{"rule": req})
}

// UpdateDRPRule handles PUT /api/v1/drp/rules/:id
func (h *EASMDRPHandler) UpdateDRPRule(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的规则 ID"})
		return
	}
	var req database.DRPMonitorRule
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "规则参数无效: " + err.Error()})
		return
	}
	if strings.TrimSpace(req.ScheduleCron) != "" {
		if err := easmdrp.ValidateCron(req.ScheduleCron); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}
	req.ID = id
	if strings.TrimSpace(req.RuleName) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "规则名称不能为空"})
		return
	}
	if err := easmdrp.ValidateMonitorRule(req.ChannelGroup, req.EnabledSources, req.Keywords); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.db.UpdateDRPMonitorRule(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新监测规则失败: " + err.Error()})
		return
	}
	h.ReloadScheduler()
	c.JSON(http.StatusOK, gin.H{"rule": req})
}

// DeleteDRPRule handles DELETE /api/v1/drp/rules/:id
func (h *EASMDRPHandler) DeleteDRPRule(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的规则 ID"})
		return
	}
	if err := h.db.DeleteDRPMonitorRule(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除规则失败: " + err.Error()})
		return
	}
	h.ReloadScheduler()
	c.JSON(http.StatusOK, gin.H{"deleted": true})
}

// ListDRPConnectors handles GET /api/v1/drp/connectors
func (h *EASMDRPHandler) ListDRPConnectors(c *gin.Context) {
	items, err := h.db.ListDRPConnectors()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询情报源连接器失败: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"connectors": items, "sources": easmdrp.SourceCatalog()})
}

// UpdateDRPConnector handles PUT /api/v1/drp/connectors/:id
func (h *EASMDRPHandler) UpdateDRPConnector(c *gin.Context) {
	id := strings.TrimSpace(c.Param("id"))
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "连接器 ID 不能为空"})
		return
	}
	var req struct {
		EndpointURL  *string `json:"endpoint_url"`
		APIKey       *string `json:"api_key"`
		ScheduleCron *string `json:"schedule_cron"`
		IsEnabled    *bool   `json:"is_enabled"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "连接器参数无效: " + err.Error()})
		return
	}
	if req.ScheduleCron != nil && strings.TrimSpace(*req.ScheduleCron) != "" {
		if err := easmdrp.ValidateCron(*req.ScheduleCron); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}
	var maskedPtr *string
	if req.APIKey != nil && strings.TrimSpace(*req.APIKey) != "" {
		masked := easmdrp.MaskToken(*req.APIKey)
		maskedPtr = &masked
	}
	updated, err := h.db.UpdateDRPConnector(id, req.EndpointURL, maskedPtr, req.APIKey, req.ScheduleCron, req.IsEnabled)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新连接器失败: " + err.Error()})
		return
	}
	if updated == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "连接器不存在"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"connector": updated})
}

// TestDRPConnector handles POST /api/v1/drp/connectors/:id/test
func (h *EASMDRPHandler) TestDRPConnector(c *gin.Context) {
	id := strings.TrimSpace(c.Param("id"))
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "连接器 ID 不能为空"})
		return
	}
	conn, err := h.db.GetDRPConnectorWithSecret(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "读取连接器配置失败: " + err.Error()})
		return
	}
	if conn == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "连接器不存在"})
		return
	}
	provider, ok := h.registry.Get(id)
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "未找到对应的情报源插件"})
		return
	}

	cfg := easmdrp.ConnectorRuntimeConfig{
		ID:           conn.ID,
		Name:         conn.Name,
		ChannelGroup: conn.ChannelGroup,
		ProviderType: conn.ProviderType,
		EndpointURL:  conn.EndpointURL,
		APIKeySecret: conn.APIKeySecret,
		ScheduleCron: conn.ScheduleCron,
		IsEnabled:    conn.IsEnabled,
	}

	testErr := provider.TestConnection(c.Request.Context(), cfg)
	health := "healthy"
	msg := "连接测试通过"
	okFlag := true
	errText := ""

	if testErr != nil {
		okFlag = false
		msg = testErr.Error()
		errText = testErr.Error()
		if errors.Is(testErr, easmdrp.ErrConnectorUnconfigured) {
			health = "unconfigured"
		} else {
			health = "error"
		}
	}

	_ = h.db.RecordDRPConnectorSync(id, health, errText, 0)
	refreshed, _ := h.db.GetDRPConnectorWithSecret(id)
	var outConn interface{} = conn.DRPConnector
	if refreshed != nil {
		outConn = refreshed.DRPConnector
	}
	c.JSON(http.StatusOK, gin.H{
		"ok":            okFlag,
		"health_status": health,
		"message":       msg,
		"connector":     outConn,
	})
}

// TriggerDRPScan handles POST /api/v1/drp/scans/trigger
func (h *EASMDRPHandler) TriggerDRPScan(c *gin.Context) {
	var req struct {
		ChannelGroup string                   `json:"channel_group"`
		Findings     []easmdrp.RawLeakFinding `json:"findings"` // Optional direct ingestion through masking + dedup pipeline
	}
	if c.Request.ContentLength > 0 {
		_ = c.ShouldBindJSON(&req)
	}

	started := time.Now().UTC()
	if len(req.Findings) > 0 {
		res := easmdrp.DRPScanResult{
			StartedAt:   started,
			RawFindings: len(req.Findings),
		}
		for _, f := range req.Findings {
			norm := easmdrp.NormalizeLeakFinding(f)
			ev := &database.DRPLeakEvent{
				EventHash:      norm.EventHash,
				ChannelGroup:   norm.ChannelGroup,
				SourcePlatform: norm.SourcePlatform,
				LeakType:       norm.LeakType,
				Severity:       norm.Severity,
				Title:          norm.Title,
				SourceRef:      norm.SourceRef,
				MaskedSnippet:  norm.MaskedSnippet,
				AffectedEntity: norm.AffectedEntity,
				TriageStatus:   norm.TriageStatus,
				DetectedAt:     norm.DetectedAt,
			}
			if f.RuleID > 0 {
				rid := f.RuleID
				ev.RuleID = &rid
			}
			if inserted, err := h.db.InsertDRPLeakEventDedup(ev); err == nil && inserted {
				res.DedupedCreated++
			}
		}
		res.CompletedAt = time.Now().UTC()
		c.JSON(http.StatusOK, res)
		return
	}

	res, err := h.executeDRPScan(c.Request.Context(), req.ChannelGroup, 0)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "执行 DRP 扫描失败: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, res)
}

func (h *EASMDRPHandler) executeDRPScan(ctx context.Context, channelGroup string, onlyRuleID int64) (easmdrp.DRPScanResult, error) {
	started := time.Now().UTC()
	res := easmdrp.DRPScanResult{StartedAt: started}

	rules, err := h.db.ListDRPMonitorRules()
	if err != nil {
		return res, err
	}

	matchingRules := make([]database.DRPMonitorRule, 0, len(rules))
	for _, rule := range rules {
		if !rule.IsEnabled {
			continue
		}
		if onlyRuleID > 0 && rule.ID != onlyRuleID {
			continue
		}
		if channelGroup != "" && rule.ChannelGroup != channelGroup {
			continue
		}
		matchingRules = append(matchingRules, rule)
	}

	if len(matchingRules) == 0 {
		res.Warnings = append(res.Warnings, "尚未配置任何启用的 DRP 监测规则，请先在「策略与情报源配置」中添加规则")
		res.CompletedAt = time.Now().UTC()
		return res, nil
	}

	connectors, err := h.db.ListDRPConnectorsWithSecrets()
	if err != nil {
		return res, err
	}
	connByID := make(map[string]database.DRPConnectorWithSecret, len(connectors))
	for _, conn := range connectors {
		connByID[conn.ID] = conn
	}

	since := time.Now().UTC().Add(-24 * time.Hour)
	syncedProviders := map[string]bool{}
	unconfiguredSeen := map[string]bool{}
	warnSeen := map[string]bool{}
	addWarn := func(w string) {
		if !warnSeen[w] {
			warnSeen[w] = true
			res.Warnings = append(res.Warnings, w)
		}
	}

	for _, rule := range matchingRules {
		res.RulesEvaluated++
		providers := h.registry.ByChannel(rule.ChannelGroup)
		for _, p := range providers {
			conn, exists := connByID[p.ID()]
			if exists && !conn.IsEnabled {
				continue
			}
			cfg := easmdrp.ConnectorRuntimeConfig{
				ID:           p.ID(),
				Name:         p.Name(),
				ChannelGroup: p.ChannelCategory(),
				ProviderType: p.SourceType(),
			}
			if exists {
				cfg.EndpointURL = conn.EndpointURL
				cfg.APIKeySecret = conn.APIKeySecret
				cfg.ScheduleCron = conn.ScheduleCron
				cfg.IsEnabled = conn.IsEnabled
			}

			if !easmdrp.ProviderCovers(p.ID(), rule.ChannelGroup, rule.EnabledSources) {
				continue
			}
			cfg.EnabledSources = rule.EnabledSources
			findings, fetchErr := p.FetchAlerts(ctx, cfg, rule.Keywords, since)
			if fetchErr != nil {
				if errors.Is(fetchErr, easmdrp.ErrConnectorUnconfigured) {
					if !unconfiguredSeen[p.ID()] {
						unconfiguredSeen[p.ID()] = true
						res.SkippedUnconfigured++
					}
					_ = h.db.RecordDRPConnectorSync(p.ID(), "unconfigured", fetchErr.Error(), 0)
					addWarn(fmt.Sprintf("%s 未配置：%s", p.Name(), strings.TrimPrefix(fetchErr.Error(), easmdrp.ErrConnectorUnconfigured.Error()+": ")))
				} else {
					_ = h.db.RecordDRPConnectorSync(p.ID(), "error", fetchErr.Error(), 0)
					addWarn(fmt.Sprintf("%s 同步失败：%s", p.Name(), fetchErr.Error()))
				}
				continue
			}

			syncedProviders[p.ID()] = true
			findings = easmdrp.FilterSourceFindings(findings, rule.ChannelGroup, rule.EnabledSources)
			addedForProvider := 0
			for _, f := range findings {
				res.RawFindings++
				if easmdrp.MatchesExcludeRules(f, rule.ExcludeRules) {
					res.ExcludedCount++
					continue
				}
				f.RuleID = rule.ID
				norm := easmdrp.NormalizeLeakFinding(f)
				rid := rule.ID
				ev := &database.DRPLeakEvent{
					RuleID:         &rid,
					EventHash:      norm.EventHash,
					ChannelGroup:   norm.ChannelGroup,
					SourcePlatform: norm.SourcePlatform,
					LeakType:       norm.LeakType,
					Severity:       norm.Severity,
					Title:          norm.Title,
					SourceRef:      norm.SourceRef,
					MaskedSnippet:  norm.MaskedSnippet,
					AffectedEntity: norm.AffectedEntity,
					TriageStatus:   norm.TriageStatus,
					DetectedAt:     norm.DetectedAt,
				}
				if inserted, insErr := h.db.InsertDRPLeakEventDedup(ev); insErr == nil && inserted {
					res.DedupedCreated++
					addedForProvider++
				}
			}
			_ = h.db.RecordDRPConnectorSync(p.ID(), "healthy", "", addedForProvider)
		}
	}

	res.ProvidersSynced = len(syncedProviders)
	res.CompletedAt = time.Now().UTC()
	return res, nil
}

func parsePositiveInt(raw string, fallback int) int {
	v, err := strconv.Atoi(strings.TrimSpace(raw))
	if err != nil || v <= 0 {
		return fallback
	}
	return v
}
