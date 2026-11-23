package database

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"math"
	"strings"
	"time"
)

// EASMAsset maps to easm_assets table (1.3.3.1_01).
type EASMAsset struct {
	ID          int64                  `json:"id"`
	AssetType   string                 `json:"asset_type"`
	Identifier  string                 `json:"identifier"`
	IPAddress   string                 `json:"ip_address"`
	Port        int                    `json:"port"`
	ServiceName string                 `json:"service_name"`
	Fingerprint map[string]interface{} `json:"fingerprint"`
	IsShadow    bool                   `json:"is_shadow"`
	OwnerDept   string                 `json:"owner_dept"`
	RiskLevel   string                 `json:"risk_level"`
	Status      string                 `json:"status"`
	FirstSeenAt time.Time              `json:"first_seen_at"`
	LastSeenAt  time.Time              `json:"last_seen_at"`
}

// EASMConvergence maps to easm_risk_convergence table (1.3.3.1_03).
type EASMConvergence struct {
	ID                int64                  `json:"id"`
	AssetID           int64                  `json:"asset_id"`
	AssetIdentifier   string                 `json:"asset_identifier,omitempty"`
	AssetType         string                 `json:"asset_type,omitempty"`
	AssetRiskLevel    string                 `json:"asset_risk_level,omitempty"`
	AssetIsShadow     bool                   `json:"asset_is_shadow,omitempty"`
	ChangeType        string                 `json:"change_type"`
	DiffDetail        map[string]interface{} `json:"diff_detail"`
	ConvergenceStatus string                 `json:"convergence_status"`
	Assignee          string                 `json:"assignee"`
	SLADeadline       *time.Time             `json:"sla_deadline,omitempty"`
	RetestResult      map[string]interface{} `json:"retest_result"`
	CreatedAt         time.Time              `json:"created_at"`
	ResolvedAt        *time.Time             `json:"resolved_at,omitempty"`
}

// DRPMonitorRule maps to drp_monitor_rules table (1.3.2.5).
type DRPMonitorRule struct {
	ID             int64     `json:"id"`
	RuleName       string    `json:"rule_name"`
	ChannelGroup   string    `json:"channel_group"`
	EnabledSources []string  `json:"enabled_sources"`
	Keywords       []string  `json:"keywords"`
	ExcludeRules   []string  `json:"exclude_rules"`
	ScheduleCron   string    `json:"schedule_cron"`
	IsEnabled      bool      `json:"is_enabled"`
	CreatedAt      time.Time `json:"created_at"`
}

// DRPLeakEvent maps to drp_leak_events table (1.3.2.5).
type DRPLeakEvent struct {
	ID              int64     `json:"id"`
	RuleID          *int64    `json:"rule_id,omitempty"`
	EventHash       string    `json:"event_hash"`
	ChannelGroup    string    `json:"channel_group"`
	SourcePlatform  string    `json:"source_platform"`
	LeakType        string    `json:"leak_type"`
	Severity        string    `json:"severity"`
	Title           string    `json:"title"`
	SourceRef       string    `json:"source_ref"`
	MaskedSnippet   string    `json:"masked_snippet"`
	AffectedEntity  string    `json:"affected_entity"`
	TriageStatus    string    `json:"triage_status"`
	RemediationNote string    `json:"remediation_note"`
	DetectedAt      time.Time `json:"detected_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// DRPConnector maps to drp_connectors table.
type DRPConnector struct {
	ID                string     `json:"id"`
	Name              string     `json:"name"`
	ChannelGroup      string     `json:"channel_group"`
	ProviderType      string     `json:"provider_type"`
	EndpointURL       string     `json:"endpoint_url"`
	APIKeyMasked      string     `json:"api_key_masked"`
	ScheduleCron      string     `json:"schedule_cron"`
	IsEnabled         bool       `json:"is_enabled"`
	HealthStatus      string     `json:"health_status"`
	LastSyncAt        *time.Time `json:"last_sync_at,omitempty"`
	LastError         string     `json:"last_error"`
	SyncedEventsCount int        `json:"synced_events_count"`
	UpdatedAt         time.Time  `json:"updated_at"`
}

// DRPConnectorWithSecret includes the raw secret for internal backend execution only.
type DRPConnectorWithSecret struct {
	DRPConnector
	APIKeySecret string `json:"-"`
}

// EASMDashboardStats holds aggregated KPIs and charts for /api/v1/easm/dashboard.
type EASMDashboardStats struct {
	TotalAssets       int               `json:"total_assets"`
	ActiveAssets      int               `json:"active_assets"`
	ShadowAssets      int               `json:"shadow_assets"`
	WeeklyChanges     int               `json:"weekly_changes"`
	OpenConvergence   int               `json:"open_convergence"`
	ClosedConvergence int               `json:"closed_convergence"`
	ConvergenceRate   float64           `json:"convergence_rate"`
	MTTRHours         float64           `json:"mttr_hours"`
	Trend30d          []EASMTrendPoint  `json:"trend_30d"`
	TopExposedPorts   []EASMTopPortItem `json:"top_exposed_ports"`
	RecentTimeline    []EASMConvergence `json:"recent_timeline"`
	Engines           []interface{}     `json:"engines,omitempty"`
	ScheduledJobs     int               `json:"scheduled_jobs"`
}

type EASMTrendPoint struct {
	Date          string `json:"date"`
	NewExposures  int    `json:"new_exposures"`
	ConvergedRisk int    `json:"converged_risk"`
}

type EASMTopPortItem struct {
	Port        int    `json:"port"`
	ServiceName string `json:"service_name"`
	Count       int    `json:"count"`
	HighRisk    bool   `json:"high_risk"`
}

// DRPOverviewStats holds channel distributions and connector health for /api/v1/drp/overview.
type DRPOverviewStats struct {
	TotalEvents       int              `json:"total_events"`
	NewEvents         int              `json:"new_events"`
	ConfirmedEvents   int              `json:"confirmed_events"`
	RemediatedEvents  int              `json:"remediated_events"`
	ChannelStats      []DRPChannelStat `json:"channel_stats"`
	SeverityBreakdown map[string]int   `json:"severity_breakdown"`
	Connectors        []DRPConnector   `json:"connectors"`
}

type DRPChannelStat struct {
	ChannelGroup string `json:"channel_group"`
	Total        int    `json:"total"`
	NewCount     int    `json:"new_count"`
	CriticalHigh int    `json:"critical_high"`
}

// EASMAssetFilter defines query filters for listing EASM assets.
type EASMAssetFilter struct {
	IsShadow  *bool
	RiskLevel string
	Status    string
	AssetType string
	Query     string
	Page      int
	PageSize  int
}

// EASMConvergenceFilter defines query filters for listing convergence tickets.
type EASMConvergenceFilter struct {
	Status     string
	ChangeType string
	Assignee   string
	Query      string
	Page       int
	PageSize   int
}

// DRPEventFilter defines query filters for listing DRP leak events.
type DRPEventFilter struct {
	ChannelGroup string
	TriageStatus string
	Severity     string
	Query        string
	Page         int
	PageSize     int
}

func marshalJSONString(v interface{}, fallback string) string {
	if v == nil {
		return fallback
	}
	b, err := json.Marshal(v)
	if err != nil {
		return fallback
	}
	return string(b)
}

func unmarshalJSONMap(raw string) map[string]interface{} {
	out := map[string]interface{}{}
	if strings.TrimSpace(raw) == "" {
		return out
	}
	_ = json.Unmarshal([]byte(raw), &out)
	return out
}

func unmarshalJSONSlice(raw string) []string {
	out := []string{}
	if strings.TrimSpace(raw) == "" {
		return out
	}
	_ = json.Unmarshal([]byte(raw), &out)
	return out
}

// IsInCMDBBaseline checks whether an identifier (host/domain/ip) is already registered in StrixLens's assets table.
func (db *DB) IsInCMDBBaseline(identifier, ipAddress string) bool {
	if db == nil || db.DB == nil {
		return false
	}
	hostOnly := strings.Split(strings.TrimSpace(identifier), ":")[0]
	var cnt int
	err := db.QueryRow(`
		SELECT COUNT(1) FROM assets
		WHERE LOWER(host) = LOWER(?) OR LOWER(domain) = LOWER(?) OR (ip != '' AND ip = ?)
	`, identifier, hostOnly, ipAddress).Scan(&cnt)
	return err == nil && cnt > 0
}

// GetEASMAssetByKey retrieves an EASM asset by its unique (asset_type, identifier).
func (db *DB) GetEASMAssetByKey(assetType, identifier string) (*EASMAsset, error) {
	row := db.QueryRow(`
		SELECT id, asset_type, identifier, ip_address, port, service_name, fingerprint,
		       is_shadow, owner_dept, risk_level, status, first_seen_at, last_seen_at
		FROM easm_assets WHERE asset_type = ? AND identifier = ?
	`, assetType, identifier)
	return scanEASMAsset(row)
}

// GetEASMAssetByID retrieves an EASM asset by ID.
func (db *DB) GetEASMAssetByID(id int64) (*EASMAsset, error) {
	row := db.QueryRow(`
		SELECT id, asset_type, identifier, ip_address, port, service_name, fingerprint,
		       is_shadow, owner_dept, risk_level, status, first_seen_at, last_seen_at
		FROM easm_assets WHERE id = ?
	`, id)
	return scanEASMAsset(row)
}

func scanEASMAsset(scanner interface{ Scan(...interface{}) error }) (*EASMAsset, error) {
	var a EASMAsset
	var fpRaw string
	var isShadow int
	err := scanner.Scan(
		&a.ID, &a.AssetType, &a.Identifier, &a.IPAddress, &a.Port, &a.ServiceName,
		&fpRaw, &isShadow, &a.OwnerDept, &a.RiskLevel, &a.Status, &a.FirstSeenAt, &a.LastSeenAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	a.IsShadow = isShadow != 0
	a.Fingerprint = unmarshalJSONMap(fpRaw)
	return &a, nil
}

// UpsertEASMAsset inserts or updates an EASM asset and returns the persisted record and whether it was newly created.
func (db *DB) UpsertEASMAsset(a *EASMAsset) (bool, error) {
	now := time.Now().UTC()
	if a.Status == "" {
		a.Status = "active"
	}
	if a.RiskLevel == "" {
		a.RiskLevel = "low"
	}
	fpJSON := marshalJSONString(a.Fingerprint, "{}")
	shadowInt := 0
	if a.IsShadow {
		shadowInt = 1
	}

	existing, err := db.GetEASMAssetByKey(a.AssetType, a.Identifier)
	if err != nil {
		return false, err
	}
	if existing == nil {
		res, err := db.Exec(`
			INSERT INTO easm_assets
				(asset_type, identifier, ip_address, port, service_name, fingerprint, is_shadow, owner_dept, risk_level, status, first_seen_at, last_seen_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`, a.AssetType, a.Identifier, a.IPAddress, a.Port, a.ServiceName, fpJSON, shadowInt, a.OwnerDept, a.RiskLevel, a.Status, now, now)
		if err != nil {
			return false, err
		}
		id, _ := res.LastInsertId()
		a.ID = id
		a.FirstSeenAt = now
		a.LastSeenAt = now
		return true, nil
	}

	ownerDept := a.OwnerDept
	if ownerDept == "" {
		ownerDept = existing.OwnerDept
	}
	_, err = db.Exec(`
		UPDATE easm_assets
		SET ip_address = ?, port = ?, service_name = ?, fingerprint = ?, is_shadow = ?,
		    owner_dept = ?, risk_level = ?, status = ?, last_seen_at = ?
		WHERE id = ?
	`, a.IPAddress, a.Port, a.ServiceName, fpJSON, shadowInt, ownerDept, a.RiskLevel, a.Status, now, existing.ID)
	if err != nil {
		return false, err
	}
	a.ID = existing.ID
	a.FirstSeenAt = existing.FirstSeenAt
	a.LastSeenAt = now
	return false, nil
}

// UpdateEASMAssetFields updates owner_dept, is_shadow, risk_level, or status for an EASM asset.
func (db *DB) UpdateEASMAssetFields(id int64, ownerDept *string, isShadow *bool, riskLevel *string, status *string) (*EASMAsset, error) {
	existing, err := db.GetEASMAssetByID(id)
	if err != nil || existing == nil {
		return nil, err
	}
	if ownerDept != nil {
		existing.OwnerDept = strings.TrimSpace(*ownerDept)
	}
	if isShadow != nil {
		existing.IsShadow = *isShadow
	}
	if riskLevel != nil && strings.TrimSpace(*riskLevel) != "" {
		existing.RiskLevel = strings.ToLower(strings.TrimSpace(*riskLevel))
	}
	if status != nil && strings.TrimSpace(*status) != "" {
		existing.Status = strings.ToLower(strings.TrimSpace(*status))
	}
	shadowInt := 0
	if existing.IsShadow {
		shadowInt = 1
	}
	_, err = db.Exec(`
		UPDATE easm_assets SET owner_dept = ?, is_shadow = ?, risk_level = ?, status = ?, last_seen_at = ?
		WHERE id = ?
	`, existing.OwnerDept, shadowInt, existing.RiskLevel, existing.Status, time.Now().UTC(), id)
	if err != nil {
		return nil, err
	}
	return existing, nil
}

// ListEASMAssets returns paginated EASM assets matching the filter.
func (db *DB) ListEASMAssets(f EASMAssetFilter) ([]EASMAsset, int, error) {
	where := []string{"1=1"}
	args := []interface{}{}
	if f.IsShadow != nil {
		if *f.IsShadow {
			where = append(where, "is_shadow = 1")
		} else {
			where = append(where, "is_shadow = 0")
		}
	}
	if strings.TrimSpace(f.RiskLevel) != "" {
		where = append(where, "risk_level = ?")
		args = append(args, strings.ToLower(strings.TrimSpace(f.RiskLevel)))
	}
	if strings.TrimSpace(f.Status) != "" {
		where = append(where, "status = ?")
		args = append(args, strings.ToLower(strings.TrimSpace(f.Status)))
	}
	if strings.TrimSpace(f.AssetType) != "" {
		where = append(where, "asset_type = ?")
		args = append(args, strings.ToLower(strings.TrimSpace(f.AssetType)))
	}
	if q := strings.TrimSpace(f.Query); q != "" {
		like := "%" + q + "%"
		where = append(where, "(identifier LIKE ? OR ip_address LIKE ? OR service_name LIKE ? OR owner_dept LIKE ?)")
		args = append(args, like, like, like, like)
	}

	whereSQL := strings.Join(where, " AND ")
	var total int
	if err := db.QueryRow("SELECT COUNT(1) FROM easm_assets WHERE "+whereSQL, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	page := f.Page
	if page < 1 {
		page = 1
	}
	pageSize := f.PageSize
	if pageSize <= 0 || pageSize > 200 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	queryArgs := append(append([]interface{}{}, args...), pageSize, offset)
	rows, err := db.Query(`
		SELECT id, asset_type, identifier, ip_address, port, service_name, fingerprint,
		       is_shadow, owner_dept, risk_level, status, first_seen_at, last_seen_at
		FROM easm_assets
		WHERE `+whereSQL+`
		ORDER BY is_shadow DESC, last_seen_at DESC, id DESC
		LIMIT ? OFFSET ?
	`, queryArgs...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	items := make([]EASMAsset, 0)
	for rows.Next() {
		a, err := scanEASMAsset(rows)
		if err != nil {
			return nil, 0, err
		}
		if a != nil {
			items = append(items, *a)
		}
	}
	return items, total, nil
}

// ListActiveEASMAssets returns active EASM assets up to limit for periodic drift re-probing.
func (db *DB) ListActiveEASMAssets(limit int) ([]EASMAsset, error) {
	if limit <= 0 {
		limit = 50
	}
	rows, err := db.Query(`
		SELECT id, asset_type, identifier, ip_address, port, service_name, fingerprint,
		       is_shadow, owner_dept, risk_level, status, first_seen_at, last_seen_at
		FROM easm_assets
		WHERE status = 'active' AND port > 0
		ORDER BY last_seen_at ASC
		LIMIT ?
	`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := make([]EASMAsset, 0)
	for rows.Next() {
		a, err := scanEASMAsset(rows)
		if err != nil {
			return nil, err
		}
		if a != nil {
			items = append(items, *a)
		}
	}
	return items, nil
}

// CreateEASMConvergence inserts a new risk convergence ticket.
func (db *DB) CreateEASMConvergence(c *EASMConvergence) error {
	now := time.Now().UTC()
	if c.ConvergenceStatus == "" {
		c.ConvergenceStatus = "open"
	}
	if c.SLADeadline == nil {
		sla := now.Add(72 * time.Hour)
		c.SLADeadline = &sla
	}
	res, err := db.Exec(`
		INSERT INTO easm_risk_convergence
			(asset_id, change_type, diff_detail, convergence_status, assignee, sla_deadline, retest_result, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`, c.AssetID, c.ChangeType, marshalJSONString(c.DiffDetail, "{}"), c.ConvergenceStatus, c.Assignee, c.SLADeadline, marshalJSONString(c.RetestResult, "{}"), now)
	if err != nil {
		return err
	}
	id, _ := res.LastInsertId()
	c.ID = id
	c.CreatedAt = now
	return nil
}

// ListEASMConvergence lists risk convergence tickets joined with asset metadata.
func (db *DB) ListEASMConvergence(f EASMConvergenceFilter) ([]EASMConvergence, int, error) {
	where := []string{"1=1"}
	args := []interface{}{}
	if strings.TrimSpace(f.Status) != "" {
		where = append(where, "c.convergence_status = ?")
		args = append(args, strings.ToLower(strings.TrimSpace(f.Status)))
	}
	if strings.TrimSpace(f.ChangeType) != "" {
		where = append(where, "c.change_type = ?")
		args = append(args, strings.ToUpper(strings.TrimSpace(f.ChangeType)))
	}
	if strings.TrimSpace(f.Assignee) != "" {
		where = append(where, "c.assignee LIKE ?")
		args = append(args, "%"+strings.TrimSpace(f.Assignee)+"%")
	}
	if q := strings.TrimSpace(f.Query); q != "" {
		like := "%" + q + "%"
		where = append(where, "(a.identifier LIKE ? OR c.change_type LIKE ? OR c.assignee LIKE ? OR c.diff_detail LIKE ?)")
		args = append(args, like, like, like, like)
	}

	whereSQL := strings.Join(where, " AND ")
	var total int
	if err := db.QueryRow(`
		SELECT COUNT(1) FROM easm_risk_convergence c
		JOIN easm_assets a ON a.id = c.asset_id
		WHERE `+whereSQL, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	page := f.Page
	if page < 1 {
		page = 1
	}
	pageSize := f.PageSize
	if pageSize <= 0 || pageSize > 200 {
		pageSize = 50
	}
	offset := (page - 1) * pageSize

	queryArgs := append(append([]interface{}{}, args...), pageSize, offset)
	rows, err := db.Query(`
		SELECT c.id, c.asset_id, a.identifier, a.asset_type, a.risk_level, a.is_shadow,
		       c.change_type, c.diff_detail, c.convergence_status, c.assignee,
		       c.sla_deadline, c.retest_result, c.created_at, c.resolved_at
		FROM easm_risk_convergence c
		JOIN easm_assets a ON a.id = c.asset_id
		WHERE `+whereSQL+`
		ORDER BY c.created_at DESC, c.id DESC
		LIMIT ? OFFSET ?
	`, queryArgs...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	items := make([]EASMConvergence, 0)
	for rows.Next() {
		item, err := scanEASMConvergence(rows)
		if err != nil {
			return nil, 0, err
		}
		if item != nil {
			items = append(items, *item)
		}
	}
	return items, total, nil
}

// GetEASMConvergenceByID fetches a single convergence ticket by ID.
func (db *DB) GetEASMConvergenceByID(id int64) (*EASMConvergence, error) {
	row := db.QueryRow(`
		SELECT c.id, c.asset_id, a.identifier, a.asset_type, a.risk_level, a.is_shadow,
		       c.change_type, c.diff_detail, c.convergence_status, c.assignee,
		       c.sla_deadline, c.retest_result, c.created_at, c.resolved_at
		FROM easm_risk_convergence c
		JOIN easm_assets a ON a.id = c.asset_id
		WHERE c.id = ?
	`, id)
	return scanEASMConvergence(row)
}

func scanEASMConvergence(scanner interface{ Scan(...interface{}) error }) (*EASMConvergence, error) {
	var item EASMConvergence
	var isShadow int
	var diffRaw, retestRaw string
	var sla, resolved sql.NullTime
	err := scanner.Scan(
		&item.ID, &item.AssetID, &item.AssetIdentifier, &item.AssetType, &item.AssetRiskLevel, &isShadow,
		&item.ChangeType, &diffRaw, &item.ConvergenceStatus, &item.Assignee,
		&sla, &retestRaw, &item.CreatedAt, &resolved,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	item.AssetIsShadow = isShadow != 0
	item.DiffDetail = unmarshalJSONMap(diffRaw)
	item.RetestResult = unmarshalJSONMap(retestRaw)
	if sla.Valid {
		t := sla.Time
		item.SLADeadline = &t
	}
	if resolved.Valid {
		t := resolved.Time
		item.ResolvedAt = &t
	}
	return &item, nil
}

// UpdateEASMConvergence updates workflow status, assignee, SLA, or retest results.
func (db *DB) UpdateEASMConvergence(id int64, status *string, assignee *string, retest map[string]interface{}) (*EASMConvergence, error) {
	existing, err := db.GetEASMConvergenceByID(id)
	if err != nil || existing == nil {
		return nil, err
	}
	if status != nil && strings.TrimSpace(*status) != "" {
		existing.ConvergenceStatus = strings.ToLower(strings.TrimSpace(*status))
	}
	if assignee != nil {
		existing.Assignee = strings.TrimSpace(*assignee)
	}
	if retest != nil {
		existing.RetestResult = retest
	}
	if existing.ConvergenceStatus == "closed" || existing.ConvergenceStatus == "false_positive" {
		if existing.ResolvedAt == nil {
			now := time.Now().UTC()
			existing.ResolvedAt = &now
		}
	} else {
		existing.ResolvedAt = nil
	}

	_, err = db.Exec(`
		UPDATE easm_risk_convergence
		SET convergence_status = ?, assignee = ?, retest_result = ?, resolved_at = ?
		WHERE id = ?
	`, existing.ConvergenceStatus, existing.Assignee, marshalJSONString(existing.RetestResult, "{}"), existing.ResolvedAt, id)
	if err != nil {
		return nil, err
	}
	return existing, nil
}

// GetEASMDashboardStats aggregates KPIs, 30-day trends, top exposed ports, and recent drift timeline.
func (db *DB) GetEASMDashboardStats() (*EASMDashboardStats, error) {
	stats := &EASMDashboardStats{
		Trend30d:        make([]EASMTrendPoint, 0, 30),
		TopExposedPorts: make([]EASMTopPortItem, 0),
		RecentTimeline:  make([]EASMConvergence, 0),
	}

	_ = db.QueryRow(`SELECT COUNT(1) FROM easm_assets`).Scan(&stats.TotalAssets)
	_ = db.QueryRow(`SELECT COUNT(1) FROM easm_assets WHERE status = 'active'`).Scan(&stats.ActiveAssets)
	_ = db.QueryRow(`SELECT COUNT(1) FROM easm_assets WHERE is_shadow = 1 AND status = 'active'`).Scan(&stats.ShadowAssets)

	weekAgo := time.Now().UTC().AddDate(0, 0, -7)
	_ = db.QueryRow(`SELECT COUNT(1) FROM easm_risk_convergence WHERE created_at >= ?`, weekAgo).Scan(&stats.WeeklyChanges)

	var totalConv int
	_ = db.QueryRow(`SELECT COUNT(1) FROM easm_risk_convergence`).Scan(&totalConv)
	_ = db.QueryRow(`SELECT COUNT(1) FROM easm_risk_convergence WHERE convergence_status IN ('closed','false_positive')`).Scan(&stats.ClosedConvergence)
	stats.OpenConvergence = totalConv - stats.ClosedConvergence
	if totalConv > 0 {
		stats.ConvergenceRate = math.Round(float64(stats.ClosedConvergence)/float64(totalConv)*1000) / 10
	}

	// MTTR (hours) across resolved tickets.
	var avgSeconds sql.NullFloat64
	_ = db.QueryRow(`
		SELECT AVG((julianday(resolved_at) - julianday(created_at)) * 86400.0)
		FROM easm_risk_convergence
		WHERE resolved_at IS NOT NULL
	`).Scan(&avgSeconds)
	if avgSeconds.Valid && avgSeconds.Float64 > 0 {
		stats.MTTRHours = math.Round((avgSeconds.Float64/3600.0)*10) / 10
	}

	// 30-day trend: new exposures vs converged risks.
	newByDay := map[string]int{}
	closedByDay := map[string]int{}
	since30 := time.Now().UTC().AddDate(0, 0, -29).Format("2006-01-02")

	if rows, err := db.Query(`SELECT substr(created_at, 1, 10) AS d, COUNT(1) FROM easm_risk_convergence WHERE substr(created_at, 1, 10) >= ? GROUP BY d`, since30); err == nil {
		for rows.Next() {
			var d string
			var c int
			if rows.Scan(&d, &c) == nil {
				newByDay[d] = c
			}
		}
		rows.Close()
	}
	if rows, err := db.Query(`SELECT substr(resolved_at, 1, 10) AS d, COUNT(1) FROM easm_risk_convergence WHERE resolved_at IS NOT NULL AND substr(resolved_at, 1, 10) >= ? GROUP BY d`, since30); err == nil {
		for rows.Next() {
			var d string
			var c int
			if rows.Scan(&d, &c) == nil {
				closedByDay[d] = c
			}
		}
		rows.Close()
	}

	now := time.Now().UTC()
	for i := 29; i >= 0; i-- {
		day := now.AddDate(0, 0, -i).Format("2006-01-02")
		stats.Trend30d = append(stats.Trend30d, EASMTrendPoint{
			Date:          day,
			NewExposures:  newByDay[day],
			ConvergedRisk: closedByDay[day],
		})
	}

	// Top 10 exposed ports / services.
	highRiskPorts := map[int]bool{22: true, 23: true, 445: true, 1433: true, 3306: true, 3389: true, 5432: true, 6379: true, 9200: true, 27017: true}
	if rows, err := db.Query(`
		SELECT port, COALESCE(NULLIF(service_name, ''), 'unknown') AS svc, COUNT(1) AS cnt
		FROM easm_assets
		WHERE status = 'active' AND port > 0
		GROUP BY port, svc
		ORDER BY cnt DESC, port ASC
		LIMIT 10
	`); err == nil {
		for rows.Next() {
			var item EASMTopPortItem
			if rows.Scan(&item.Port, &item.ServiceName, &item.Count) == nil {
				item.HighRisk = highRiskPorts[item.Port]
				stats.TopExposedPorts = append(stats.TopExposedPorts, item)
			}
		}
		rows.Close()
	}

	// Recent drift timeline (latest 10).
	timeline, _, _ := db.ListEASMConvergence(EASMConvergenceFilter{Page: 1, PageSize: 10})
	stats.RecentTimeline = timeline

	return stats, nil
}

// ============================================================================
// DRP Rules, Events & Connectors
// ============================================================================

// EnsureDefaultDRPConnectors seeds the 6 canonical DRP connectors if missing.
func (db *DB) EnsureDefaultDRPConnectors(defaults []DRPConnector) error {
	now := time.Now().UTC()
	for _, c := range defaults {
		enabled := 0
		if c.IsEnabled {
			enabled = 1
		}
		_, err := db.Exec(`
			INSERT OR IGNORE INTO drp_connectors
				(id, name, channel_group, provider_type, endpoint_url, api_key_masked, schedule_cron, is_enabled, health_status, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`, c.ID, c.Name, c.ChannelGroup, c.ProviderType, c.EndpointURL, c.APIKeyMasked, c.ScheduleCron, enabled, c.HealthStatus, now)
		if err != nil {
			return err
		}
	}
	return nil
}

// ListDRPConnectors returns all configured DRP connectors.
func (db *DB) ListDRPConnectors() ([]DRPConnector, error) {
	rows, err := db.Query(`
		SELECT id, name, channel_group, provider_type, endpoint_url, api_key_masked,
		       schedule_cron, is_enabled, health_status, last_sync_at, last_error, synced_events_count, updated_at
		FROM drp_connectors
		ORDER BY id ASC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]DRPConnector, 0)
	for rows.Next() {
		var c DRPConnector
		var enabled int
		var lastSync sql.NullTime
		if err := rows.Scan(
			&c.ID, &c.Name, &c.ChannelGroup, &c.ProviderType, &c.EndpointURL, &c.APIKeyMasked,
			&c.ScheduleCron, &enabled, &c.HealthStatus, &lastSync, &c.LastError, &c.SyncedEventsCount, &c.UpdatedAt,
		); err != nil {
			return nil, err
		}
		c.IsEnabled = enabled != 0
		if lastSync.Valid {
			t := lastSync.Time
			c.LastSyncAt = &t
		}
		out = append(out, c)
	}
	return out, nil
}

// NormalizeUnconfiguredConnectors fixes untouched default rows whose health_status was seeded as 'healthy'.
func (db *DB) NormalizeUnconfiguredConnectors() error {
	_, err := db.Exec(`
		UPDATE drp_connectors
		SET health_status = 'unconfigured'
		WHERE last_sync_at IS NULL
		  AND COALESCE(endpoint_url, '') = ''
		  AND COALESCE(api_key_masked, '') = ''
		  AND health_status = 'healthy'
	`)
	return err
}

// ListDRPConnectorsWithSecrets returns all connectors along with their stored API secrets for backend sync.
func (db *DB) ListDRPConnectorsWithSecrets() ([]DRPConnectorWithSecret, error) {
	rows, err := db.Query(`
		SELECT id, name, channel_group, provider_type, endpoint_url, api_key_masked, api_key_secret,
		       schedule_cron, is_enabled, health_status, last_sync_at, last_error, synced_events_count, updated_at
		FROM drp_connectors
		ORDER BY id ASC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]DRPConnectorWithSecret, 0)
	for rows.Next() {
		var c DRPConnectorWithSecret
		var enabled int
		var lastSync sql.NullTime
		if err := rows.Scan(
			&c.ID, &c.Name, &c.ChannelGroup, &c.ProviderType, &c.EndpointURL, &c.APIKeyMasked, &c.APIKeySecret,
			&c.ScheduleCron, &enabled, &c.HealthStatus, &lastSync, &c.LastError, &c.SyncedEventsCount, &c.UpdatedAt,
		); err != nil {
			return nil, err
		}
		c.IsEnabled = enabled != 0
		if lastSync.Valid {
			t := lastSync.Time
			c.LastSyncAt = &t
		}
		out = append(out, c)
	}
	return out, nil
}

// GetDRPConnectorWithSecret returns a single connector including its stored API secret.
func (db *DB) GetDRPConnectorWithSecret(id string) (*DRPConnectorWithSecret, error) {
	var c DRPConnectorWithSecret
	var enabled int
	var lastSync sql.NullTime
	err := db.QueryRow(`
		SELECT id, name, channel_group, provider_type, endpoint_url, api_key_masked, api_key_secret,
		       schedule_cron, is_enabled, health_status, last_sync_at, last_error, synced_events_count, updated_at
		FROM drp_connectors WHERE id = ?
	`, id).Scan(
		&c.ID, &c.Name, &c.ChannelGroup, &c.ProviderType, &c.EndpointURL, &c.APIKeyMasked, &c.APIKeySecret,
		&c.ScheduleCron, &enabled, &c.HealthStatus, &lastSync, &c.LastError, &c.SyncedEventsCount, &c.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	c.IsEnabled = enabled != 0
	if lastSync.Valid {
		t := lastSync.Time
		c.LastSyncAt = &t
	}
	return &c, nil
}

// UpdateDRPConnector updates a connector's endpoint, masked/secret API key, cron, and enabled flag.
func (db *DB) UpdateDRPConnector(id string, endpointURL, apiKeyMasked, apiKeySecret, scheduleCron *string, isEnabled *bool) (*DRPConnector, error) {
	var existing DRPConnector
	var enabled int
	var lastSync sql.NullTime
	var currentSecret string
	err := db.QueryRow(`
		SELECT id, name, channel_group, provider_type, endpoint_url, api_key_masked, api_key_secret,
		       schedule_cron, is_enabled, health_status, last_sync_at, last_error, synced_events_count, updated_at
		FROM drp_connectors WHERE id = ?
	`, id).Scan(
		&existing.ID, &existing.Name, &existing.ChannelGroup, &existing.ProviderType, &existing.EndpointURL,
		&existing.APIKeyMasked, &currentSecret, &existing.ScheduleCron, &enabled, &existing.HealthStatus,
		&lastSync, &existing.LastError, &existing.SyncedEventsCount, &existing.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	existing.IsEnabled = enabled != 0
	if lastSync.Valid {
		t := lastSync.Time
		existing.LastSyncAt = &t
	}
	if endpointURL != nil {
		existing.EndpointURL = strings.TrimSpace(*endpointURL)
	}
	if apiKeyMasked != nil {
		existing.APIKeyMasked = strings.TrimSpace(*apiKeyMasked)
	}
	if apiKeySecret != nil {
		currentSecret = strings.TrimSpace(*apiKeySecret)
	}
	if scheduleCron != nil && strings.TrimSpace(*scheduleCron) != "" {
		existing.ScheduleCron = strings.TrimSpace(*scheduleCron)
	}
	if isEnabled != nil {
		existing.IsEnabled = *isEnabled
	}
	newEnabled := 0
	if existing.IsEnabled {
		newEnabled = 1
	}
	now := time.Now().UTC()
	_, err = db.Exec(`
		UPDATE drp_connectors
		SET endpoint_url = ?, api_key_masked = ?, api_key_secret = ?, schedule_cron = ?, is_enabled = ?, updated_at = ?
		WHERE id = ?
	`, existing.EndpointURL, existing.APIKeyMasked, currentSecret, existing.ScheduleCron, newEnabled, now, id)
	if err != nil {
		return nil, err
	}
	existing.UpdatedAt = now
	return &existing, nil
}

// RecordDRPConnectorSync updates last_sync_at, health_status, and synced_events_count.
func (db *DB) RecordDRPConnectorSync(id, healthStatus, lastError string, addedEvents int) error {
	now := time.Now().UTC()
	_, err := db.Exec(`
		UPDATE drp_connectors
		SET health_status = ?, last_error = ?, last_sync_at = ?, synced_events_count = synced_events_count + ?, updated_at = ?
		WHERE id = ?
	`, healthStatus, lastError, now, addedEvents, now, id)
	return err
}

// CreateDRPMonitorRule inserts a new monitoring rule.
func (db *DB) CreateDRPMonitorRule(r *DRPMonitorRule) error {
	now := time.Now().UTC()
	if r.ScheduleCron == "" {
		r.ScheduleCron = "0 */6 * * *"
	}
	enabled := 0
	if r.IsEnabled {
		enabled = 1
	}
	res, err := db.Exec(`
		INSERT INTO drp_monitor_rules (rule_name, channel_group, enabled_sources, keywords, exclude_rules, schedule_cron, is_enabled, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`, r.RuleName, r.ChannelGroup, marshalJSONString(r.EnabledSources, "[]"), marshalJSONString(r.Keywords, "[]"), marshalJSONString(r.ExcludeRules, "[]"), r.ScheduleCron, enabled, now)
	if err != nil {
		return err
	}
	id, _ := res.LastInsertId()
	r.ID = id
	r.CreatedAt = now
	return nil
}

// UpdateDRPMonitorRule updates an existing DRP rule.
func (db *DB) UpdateDRPMonitorRule(r *DRPMonitorRule) error {
	enabled := 0
	if r.IsEnabled {
		enabled = 1
	}
	res, err := db.Exec(`
		UPDATE drp_monitor_rules
		SET rule_name = ?, channel_group = ?, enabled_sources = ?, keywords = ?, exclude_rules = ?, schedule_cron = ?, is_enabled = ?
		WHERE id = ?
	`, r.RuleName, r.ChannelGroup, marshalJSONString(r.EnabledSources, "[]"), marshalJSONString(r.Keywords, "[]"), marshalJSONString(r.ExcludeRules, "[]"), r.ScheduleCron, enabled, r.ID)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return fmt.Errorf("rule not found")
	}
	return nil
}

// DeleteDRPMonitorRule deletes a DRP rule by ID.
func (db *DB) DeleteDRPMonitorRule(id int64) error {
	_, err := db.Exec(`DELETE FROM drp_monitor_rules WHERE id = ?`, id)
	return err
}

// ListDRPMonitorRules lists all configured DRP monitoring rules.
func (db *DB) ListDRPMonitorRules() ([]DRPMonitorRule, error) {
	rows, err := db.Query(`
		SELECT id, rule_name, channel_group, enabled_sources, keywords, exclude_rules, schedule_cron, is_enabled, created_at
		FROM drp_monitor_rules
		ORDER BY id DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]DRPMonitorRule, 0)
	for rows.Next() {
		var r DRPMonitorRule
		var sourcesRaw, kwRaw, exclRaw string
		var enabled int
		if err := rows.Scan(&r.ID, &r.RuleName, &r.ChannelGroup, &sourcesRaw, &kwRaw, &exclRaw, &r.ScheduleCron, &enabled, &r.CreatedAt); err != nil {
			return nil, err
		}
		r.EnabledSources = unmarshalJSONSlice(sourcesRaw)
		r.Keywords = unmarshalJSONSlice(kwRaw)
		r.ExcludeRules = unmarshalJSONSlice(exclRaw)
		r.IsEnabled = enabled != 0
		out = append(out, r)
	}
	return out, nil
}

// AppendDRPRuleExclude adds a false-positive whitelist pattern to a DRP rule.
func (db *DB) AppendDRPRuleExclude(ruleID int64, pattern string) error {
	pattern = strings.TrimSpace(pattern)
	if ruleID <= 0 || pattern == "" {
		return nil
	}
	var exclRaw string
	if err := db.QueryRow(`SELECT exclude_rules FROM drp_monitor_rules WHERE id = ?`, ruleID).Scan(&exclRaw); err != nil {
		return err
	}
	list := unmarshalJSONSlice(exclRaw)
	for _, existing := range list {
		if strings.EqualFold(strings.TrimSpace(existing), pattern) {
			return nil
		}
	}
	list = append(list, pattern)
	_, err := db.Exec(`UPDATE drp_monitor_rules SET exclude_rules = ? WHERE id = ?`, marshalJSONString(list, "[]"), ruleID)
	return err
}

// InsertDRPLeakEventDedup inserts a masked leak event, silently skipping duplicates by event_hash.
func (db *DB) InsertDRPLeakEventDedup(e *DRPLeakEvent) (bool, error) {
	now := time.Now().UTC()
	if e.DetectedAt.IsZero() {
		e.DetectedAt = now
	}
	if e.TriageStatus == "" {
		e.TriageStatus = "new"
	}
	res, err := db.Exec(`
		INSERT OR IGNORE INTO drp_leak_events
			(rule_id, event_hash, channel_group, source_platform, leak_type, severity, title, source_ref, masked_snippet, affected_entity, triage_status, remediation_note, detected_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, e.RuleID, e.EventHash, e.ChannelGroup, e.SourcePlatform, e.LeakType, e.Severity, e.Title, e.SourceRef, e.MaskedSnippet, e.AffectedEntity, e.TriageStatus, e.RemediationNote, e.DetectedAt, now)
	if err != nil {
		return false, err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return false, nil
	}
	id, _ := res.LastInsertId()
	e.ID = id
	e.UpdatedAt = now
	return true, nil
}

// ListDRPLeakEvents returns paginated DRP leak events matching the filter.
func (db *DB) ListDRPLeakEvents(f DRPEventFilter) ([]DRPLeakEvent, int, error) {
	where := []string{"1=1"}
	args := []interface{}{}
	if strings.TrimSpace(f.ChannelGroup) != "" && f.ChannelGroup != "all" {
		where = append(where, "channel_group = ?")
		args = append(args, strings.TrimSpace(f.ChannelGroup))
	}
	if strings.TrimSpace(f.TriageStatus) != "" && f.TriageStatus != "all" {
		where = append(where, "triage_status = ?")
		args = append(args, strings.TrimSpace(f.TriageStatus))
	}
	if strings.TrimSpace(f.Severity) != "" && f.Severity != "all" {
		where = append(where, "severity = ?")
		args = append(args, strings.ToLower(strings.TrimSpace(f.Severity)))
	}
	if q := strings.TrimSpace(f.Query); q != "" {
		like := "%" + q + "%"
		where = append(where, "(title LIKE ? OR affected_entity LIKE ? OR source_platform LIKE ? OR masked_snippet LIKE ?)")
		args = append(args, like, like, like, like)
	}

	whereSQL := strings.Join(where, " AND ")
	var total int
	if err := db.QueryRow("SELECT COUNT(1) FROM drp_leak_events WHERE "+whereSQL, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	page := f.Page
	if page < 1 {
		page = 1
	}
	pageSize := f.PageSize
	if pageSize <= 0 || pageSize > 200 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	queryArgs := append(append([]interface{}{}, args...), pageSize, offset)
	rows, err := db.Query(`
		SELECT id, rule_id, event_hash, channel_group, source_platform, leak_type, severity,
		       title, source_ref, masked_snippet, affected_entity, triage_status, remediation_note, detected_at, updated_at
		FROM drp_leak_events
		WHERE `+whereSQL+`
		ORDER BY detected_at DESC, id DESC
		LIMIT ? OFFSET ?
	`, queryArgs...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	items := make([]DRPLeakEvent, 0)
	for rows.Next() {
		item, err := scanDRPLeakEvent(rows)
		if err != nil {
			return nil, 0, err
		}
		if item != nil {
			items = append(items, *item)
		}
	}
	return items, total, nil
}

// GetDRPLeakEventByID retrieves a single DRP leak event by ID.
func (db *DB) GetDRPLeakEventByID(id int64) (*DRPLeakEvent, error) {
	row := db.QueryRow(`
		SELECT id, rule_id, event_hash, channel_group, source_platform, leak_type, severity,
		       title, source_ref, masked_snippet, affected_entity, triage_status, remediation_note, detected_at, updated_at
		FROM drp_leak_events WHERE id = ?
	`, id)
	return scanDRPLeakEvent(row)
}

func scanDRPLeakEvent(scanner interface{ Scan(...interface{}) error }) (*DRPLeakEvent, error) {
	var e DRPLeakEvent
	var ruleID sql.NullInt64
	err := scanner.Scan(
		&e.ID, &ruleID, &e.EventHash, &e.ChannelGroup, &e.SourcePlatform, &e.LeakType, &e.Severity,
		&e.Title, &e.SourceRef, &e.MaskedSnippet, &e.AffectedEntity, &e.TriageStatus, &e.RemediationNote, &e.DetectedAt, &e.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	if ruleID.Valid {
		v := ruleID.Int64
		e.RuleID = &v
	}
	return &e, nil
}

// UpdateDRPLeakEventTriage updates triage_status and remediation_note for a DRP event.
func (db *DB) UpdateDRPLeakEventTriage(id int64, triageStatus, note string) (*DRPLeakEvent, error) {
	existing, err := db.GetDRPLeakEventByID(id)
	if err != nil || existing == nil {
		return nil, err
	}
	now := time.Now().UTC()
	existing.TriageStatus = strings.ToLower(strings.TrimSpace(triageStatus))
	if strings.TrimSpace(note) != "" {
		existing.RemediationNote = strings.TrimSpace(note)
	}
	existing.UpdatedAt = now
	_, err = db.Exec(`
		UPDATE drp_leak_events SET triage_status = ?, remediation_note = ?, updated_at = ?
		WHERE id = ?
	`, existing.TriageStatus, existing.RemediationNote, now, id)
	if err != nil {
		return nil, err
	}
	return existing, nil
}

// GetDRPOverviewStats computes the 6-channel breakdown, severity distribution, and connector matrix.
func (db *DB) GetDRPOverviewStats(channelOrder []string) (*DRPOverviewStats, error) {
	stats := &DRPOverviewStats{
		ChannelStats:      make([]DRPChannelStat, 0, len(channelOrder)),
		SeverityBreakdown: map[string]int{"critical": 0, "high": 0, "medium": 0, "low": 0},
	}

	_ = db.QueryRow(`SELECT COUNT(1) FROM drp_leak_events`).Scan(&stats.TotalEvents)
	_ = db.QueryRow(`SELECT COUNT(1) FROM drp_leak_events WHERE triage_status = 'new'`).Scan(&stats.NewEvents)
	_ = db.QueryRow(`SELECT COUNT(1) FROM drp_leak_events WHERE triage_status = 'confirmed'`).Scan(&stats.ConfirmedEvents)
	_ = db.QueryRow(`SELECT COUNT(1) FROM drp_leak_events WHERE triage_status = 'remediated'`).Scan(&stats.RemediatedEvents)

	if rows, err := db.Query(`SELECT severity, COUNT(1) FROM drp_leak_events GROUP BY severity`); err == nil {
		for rows.Next() {
			var sev string
			var cnt int
			if rows.Scan(&sev, &cnt) == nil {
				stats.SeverityBreakdown[sev] = cnt
			}
		}
		rows.Close()
	}

	byChannel := map[string]*DRPChannelStat{}
	for _, ch := range channelOrder {
		byChannel[ch] = &DRPChannelStat{ChannelGroup: ch}
	}
	if rows, err := db.Query(`
		SELECT channel_group,
		       COUNT(1) AS total,
		       SUM(CASE WHEN triage_status = 'new' THEN 1 ELSE 0 END) AS new_cnt,
		       SUM(CASE WHEN severity IN ('critical','high') THEN 1 ELSE 0 END) AS ch_cnt
		FROM drp_leak_events
		GROUP BY channel_group
	`); err == nil {
		for rows.Next() {
			var ch string
			var total, newCnt, chCnt int
			if rows.Scan(&ch, &total, &newCnt, &chCnt) == nil {
				if st, ok := byChannel[ch]; ok {
					st.Total = total
					st.NewCount = newCnt
					st.CriticalHigh = chCnt
				}
			}
		}
		rows.Close()
	}
	for _, ch := range channelOrder {
		stats.ChannelStats = append(stats.ChannelStats, *byChannel[ch])
	}

	connectors, err := db.ListDRPConnectors()
	if err == nil {
		stats.Connectors = connectors
	}
	return stats, nil
}
