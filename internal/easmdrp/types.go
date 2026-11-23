package easmdrp

import (
	"errors"
	"time"
)

// ErrConnectorUnconfigured indicates a DRP provider lacks required endpoint/credentials.
var ErrConnectorUnconfigured = errors.New("connector not configured")

// Channel groups covering all 6 DRP monitoring dimensions (1.3.2.5_01 ~ _06).
const (
	ChannelCodeRepo      = "code_repo"
	ChannelCloudDrive    = "cloud_drive"
	ChannelDocLibrary    = "doc_library"
	ChannelDarkwebCTI    = "darkweb_cti"
	ChannelStealerCTI    = "stealer_cti"
	ChannelPlatformEmail = "platform_email"
)

// AllChannelGroups returns the canonical ordered list of the 6 DRP channel groups.
var AllChannelGroups = []string{
	ChannelCodeRepo,
	ChannelCloudDrive,
	ChannelDocLibrary,
	ChannelDarkwebCTI,
	ChannelStealerCTI,
	ChannelPlatformEmail,
}

// Convergence change types (1.3.3.1_03).
const (
	ChangeNewShadowAsset   = "NEW_SHADOW_ASSET"
	ChangeNewPort          = "NEW_PORT"
	ChangeServiceChanged   = "SERVICE_CHANGED"
	ChangeHighRiskExposure = "HIGH_RISK_EXPOSURE"
	ChangeCertExpired      = "CERT_EXPIRED"
)

// Convergence workflow statuses.
const (
	ConvergenceOpen          = "open"
	ConvergenceAssigned      = "assigned"
	ConvergenceFixing        = "fixing"
	ConvergenceVerifying     = "verifying"
	ConvergenceClosed        = "closed"
	ConvergenceFalsePositive = "false_positive"
)

// Triage statuses for DRP leak events.
const (
	TriageNew        = "new"
	TriageConfirmed  = "confirmed"
	TriageRemediated = "remediated"
	TriageIgnored    = "ignored"
)

// DiscoveredAsset is the normalized asset record produced by any EASM discovery adapter.
type DiscoveredAsset struct {
	AssetType   string                 `json:"asset_type"` // domain / subdomain / ip / web_service / api
	Identifier  string                 `json:"identifier"` // e.g. sub.example.com:443
	IPAddress   string                 `json:"ip_address"`
	Port        int                    `json:"port"`
	ServiceName string                 `json:"service_name"`
	Fingerprint map[string]interface{} `json:"fingerprint"`
	RiskLevel   string                 `json:"risk_level"` // critical / high / medium / low / info
	OwnerDept   string                 `json:"owner_dept"`
	Source      string                 `json:"source"` // amass / passive_probe / cmdb_sync / manual
}

// AssetSnapshotDiff captures a structured Before/After diff for an exposure drift event.
type AssetSnapshotDiff struct {
	ChangeType string                 `json:"change_type"`
	Summary    string                 `json:"summary"`
	Before     map[string]interface{} `json:"before"`
	After      map[string]interface{} `json:"after"`
	DetectedAt time.Time              `json:"detected_at"`
}

// RawLeakFinding is the unmasked finding returned by an adapter or CTI connector
// before passing through the mandatory masking & deduplication pipeline.
type RawLeakFinding struct {
	RuleID         int64     `json:"rule_id"`
	ChannelGroup   string    `json:"channel_group"`
	SourcePlatform string    `json:"source_platform"`
	LeakType       string    `json:"leak_type"`
	Severity       string    `json:"severity"`
	Title          string    `json:"title"`
	SourceRef      string    `json:"source_ref"`
	MatchedRule    string    `json:"matched_rule"`
	RawSnippet     string    `json:"raw_snippet"`
	AffectedEntity string    `json:"affected_entity"`
	DetectedAt     time.Time `json:"detected_at"`
}

// NormalizedLeakEvent is the safe, deduplicated, credential-masked event ready for storage.
type NormalizedLeakEvent struct {
	RuleID         int64     `json:"rule_id"`
	EventHash      string    `json:"event_hash"`
	ChannelGroup   string    `json:"channel_group"`
	SourcePlatform string    `json:"source_platform"`
	LeakType       string    `json:"leak_type"`
	Severity       string    `json:"severity"`
	Title          string    `json:"title"`
	SourceRef      string    `json:"source_ref"`
	MaskedSnippet  string    `json:"masked_snippet"`
	AffectedEntity string    `json:"affected_entity"`
	TriageStatus   string    `json:"triage_status"`
	DetectedAt     time.Time `json:"detected_at"`
}

// ScanResult summarizes an EASM discovery + diff run.
type ScanResult struct {
	Engine             string    `json:"engine"`
	ExecutionMode      string    `json:"execution_mode"` // real_probe / cli+probe / worker_callback
	Target             string    `json:"target"`
	EnginesUsed        []string  `json:"engines_used,omitempty"`
	Warnings           []string  `json:"warnings,omitempty"`
	DiscoveredCount    int       `json:"discovered_count"`
	NewAssetsCount     int       `json:"new_assets_count"`
	ShadowAssetsCount  int       `json:"shadow_assets_count"`
	ConvergenceCreated int       `json:"convergence_created"`
	StartedAt          time.Time `json:"started_at"`
	CompletedAt        time.Time `json:"completed_at"`
}

// DRPScanResult summarizes a DRP multi-channel sync run.
type DRPScanResult struct {
	RulesEvaluated      int       `json:"rules_evaluated"`
	ProvidersSynced     int       `json:"providers_synced"`
	SkippedUnconfigured int       `json:"skipped_unconfigured"`
	RawFindings         int       `json:"raw_findings"`
	DedupedCreated      int       `json:"deduped_created"`
	ExcludedCount       int       `json:"excluded_count"`
	Warnings            []string  `json:"warnings,omitempty"`
	StartedAt           time.Time `json:"started_at"`
	CompletedAt         time.Time `json:"completed_at"`
}

// EngineCapability describes a local CLI tool or built-in defensive engine.
type EngineCapability struct {
	Name      string `json:"name"`
	Available bool   `json:"available"`
	Path      string `json:"path,omitempty"`
	Kind      string `json:"kind"` // cli | builtin
}

// ConnectorRuntimeConfig holds decrypted runtime parameters for a DRP provider.
type ConnectorRuntimeConfig struct {
	ID           string
	Name         string
	ChannelGroup string
	ProviderType string
	EndpointURL  string
	APIKeySecret string
	ScheduleCron string
	IsEnabled    bool
}

// RetestOutcome records the real-time verification result of a convergence ticket.
type RetestOutcome struct {
	VerifiedAt  time.Time              `json:"verified_at"`
	Passed      bool                   `json:"passed"`
	Engine      string                 `json:"engine"`
	ProbeTarget string                 `json:"probe_target"`
	Observed    map[string]interface{} `json:"observed,omitempty"`
	Summary     string                 `json:"summary"`
}
