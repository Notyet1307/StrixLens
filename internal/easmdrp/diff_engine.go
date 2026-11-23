package easmdrp

import (
	"fmt"
	"strings"
	"time"
)

// ExistingAssetSnapshot represents the last known state of an EASM asset for diff comparison.
type ExistingAssetSnapshot struct {
	ID          int64
	AssetType   string
	Identifier  string
	IPAddress   string
	Port        int
	ServiceName string
	Fingerprint map[string]interface{}
	IsShadow    bool
	RiskLevel   string
	Status      string
}

// HighRiskPorts lists ports commonly flagged for immediate exposure review.
var HighRiskPorts = map[int]string{
	22:    "SSH",
	23:    "Telnet",
	445:   "SMB",
	1433:  "MSSQL",
	3306:  "MySQL",
	3389:  "RDP",
	5432:  "PostgreSQL",
	6379:  "Redis",
	9200:  "Elasticsearch",
	27017: "MongoDB",
}

// EvaluateRiskLevel computes a defensive exposure risk level for a discovered asset.
func EvaluateRiskLevel(asset DiscoveredAsset, isShadow bool) string {
	if r := strings.ToLower(strings.TrimSpace(asset.RiskLevel)); r == "critical" || r == "high" || r == "medium" || r == "low" || r == "info" {
		if isShadow && (r == "low" || r == "info") {
			return "medium"
		}
		return r
	}
	if _, risky := HighRiskPorts[asset.Port]; risky {
		if asset.Port == 6379 || asset.Port == 27017 || asset.Port == 9200 || asset.Port == 445 || asset.Port == 23 {
			return "critical"
		}
		return "high"
	}
	if isCertExpiring(asset.Fingerprint) {
		return "medium"
	}
	if isShadow {
		return "medium"
	}
	return "low"
}

// ComputeAssetDiffs compares a discovered asset against its prior EASM snapshot
// (if any) and the CMDB known-asset baseline, emitting structured drift events.
func ComputeAssetDiffs(discovered DiscoveredAsset, prev *ExistingAssetSnapshot, inCMDBBaseline bool) (isShadow bool, diffs []AssetSnapshotDiff) {
	now := time.Now().UTC()
	afterMap := map[string]interface{}{
		"asset_type":   discovered.AssetType,
		"identifier":   discovered.Identifier,
		"ip_address":   discovered.IPAddress,
		"port":         discovered.Port,
		"service_name": discovered.ServiceName,
		"fingerprint":  discovered.Fingerprint,
	}

	if prev == nil {
		isShadow = !inCMDBBaseline
		if isShadow {
			diffs = append(diffs, AssetSnapshotDiff{
				ChangeType: ChangeNewShadowAsset,
				Summary:    fmt.Sprintf("发现未登记影子资产 %s (%s)", discovered.Identifier, discovered.ServiceName),
				Before:     map[string]interface{}{"registered": false},
				After:      afterMap,
				DetectedAt: now,
			})
		}
		if _, risky := HighRiskPorts[discovered.Port]; risky {
			diffs = append(diffs, AssetSnapshotDiff{
				ChangeType: ChangeHighRiskExposure,
				Summary:    fmt.Sprintf("检测到高危端口暴露 %s (port %d / %s)", discovered.Identifier, discovered.Port, HighRiskPorts[discovered.Port]),
				Before:     map[string]interface{}{"port": 0},
				After:      afterMap,
				DetectedAt: now,
			})
		}
		if isCertExpiring(discovered.Fingerprint) {
			diffs = append(diffs, AssetSnapshotDiff{
				ChangeType: ChangeCertExpired,
				Summary:    fmt.Sprintf("资产 %s 的 TLS 证书已过期或即将到期", discovered.Identifier),
				Before:     map[string]interface{}{"tls_status": "unknown"},
				After:      afterMap,
				DetectedAt: now,
			})
		}
		return isShadow, diffs
	}

	isShadow = prev.IsShadow && !inCMDBBaseline
	beforeMap := map[string]interface{}{
		"asset_type":   prev.AssetType,
		"identifier":   prev.Identifier,
		"ip_address":   prev.IPAddress,
		"port":         prev.Port,
		"service_name": prev.ServiceName,
		"fingerprint":  prev.Fingerprint,
	}

	if discovered.Port > 0 && discovered.Port != prev.Port {
		diffs = append(diffs, AssetSnapshotDiff{
			ChangeType: ChangeNewPort,
			Summary:    fmt.Sprintf("资产 %s 新增暴露端口 %d (原端口 %d)", discovered.Identifier, discovered.Port, prev.Port),
			Before:     beforeMap,
			After:      afterMap,
			DetectedAt: now,
		})
	}

	if discovered.ServiceName != "" && prev.ServiceName != "" && !strings.EqualFold(discovered.ServiceName, prev.ServiceName) {
		diffs = append(diffs, AssetSnapshotDiff{
			ChangeType: ChangeServiceChanged,
			Summary:    fmt.Sprintf("资产 %s 服务指纹漂移：%s → %s", discovered.Identifier, prev.ServiceName, discovered.ServiceName),
			Before:     beforeMap,
			After:      afterMap,
			DetectedAt: now,
		})
	}

	if isCertExpiring(discovered.Fingerprint) && !isCertExpiring(prev.Fingerprint) {
		diffs = append(diffs, AssetSnapshotDiff{
			ChangeType: ChangeCertExpired,
			Summary:    fmt.Sprintf("资产 %s TLS 证书状态异常或临近过期", discovered.Identifier),
			Before:     beforeMap,
			After:      afterMap,
			DetectedAt: now,
		})
	}

	return isShadow, diffs
}

// ValidateConvergenceTransition verifies that a convergence status value is valid.
func ValidateConvergenceTransition(next string) bool {
	switch strings.ToLower(strings.TrimSpace(next)) {
	case ConvergenceOpen, ConvergenceAssigned, ConvergenceFixing, ConvergenceVerifying, ConvergenceClosed, ConvergenceFalsePositive:
		return true
	default:
		return false
	}
}

func isCertExpiring(fp map[string]interface{}) bool {
	if len(fp) == 0 {
		return false
	}
	if v, ok := fp["tls_days_remaining"]; ok {
		switch n := v.(type) {
		case int:
			return n <= 30
		case int64:
			return n <= 30
		case float64:
			return n <= 30
		}
	}
	if v, ok := fp["tls_expired"].(bool); ok && v {
		return true
	}
	return false
}
