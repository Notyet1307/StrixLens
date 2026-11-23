package easmdrp

import (
	"context"
	"fmt"
	"net"
	"strconv"
	"strings"
	"time"
)

// VerifyConvergenceTicket executes real defensive network/TLS/baseline re-verification
// against the asset referenced by a convergence ticket.
func VerifyConvergenceTicket(
	ctx context.Context,
	changeType string,
	assetID int64,
	identifier, ipAddr string,
	port int,
	isShadow, inCMDB bool,
) RetestOutcome {
	now := time.Now().UTC()
	host, parsedPort := resolveEndpointTarget(identifier, ipAddr, port)
	probeTarget := host
	if parsedPort > 0 {
		probeTarget = net.JoinHostPort(host, strconv.Itoa(parsedPort))
	}

	outcome := RetestOutcome{
		VerifiedAt:  now,
		Engine:      "strixlens_real_prober",
		ProbeTarget: probeTarget,
		Observed:    map[string]interface{}{"asset_id": assetID, "change_type": changeType},
	}

	switch changeType {
	case ChangeNewPort, ChangeHighRiskExposure:
		if host == "" || parsedPort <= 0 {
			outcome.Passed = false
			outcome.Summary = "复测无法执行：资产缺少有效主机地址或端口"
			return outcome
		}
		probe := ProbeEndpoint(ctx, host, ipAddr, parsedPort, 3*time.Second)
		outcome.Observed["port_open"] = probe.Open
		if probe.Error != "" {
			outcome.Observed["dial_error"] = probe.Error
		}
		if probe.ServiceName != "" {
			outcome.Observed["service_name"] = probe.ServiceName
		}
		if !probe.Open {
			outcome.Passed = true
			outcome.Summary = fmt.Sprintf("真实复测通过：%s 已不可达或端口已关闭", probeTarget)
		} else {
			outcome.Passed = false
			outcome.Summary = fmt.Sprintf("复测未通过：目标 %s 仍处于开放暴露状态", probeTarget)
		}
		return outcome

	case ChangeCertExpired:
		if host == "" || parsedPort <= 0 {
			outcome.Passed = false
			outcome.Summary = "复测无法执行：资产缺少有效主机地址或 HTTPS 端口"
			return outcome
		}
		probe := ProbeEndpoint(ctx, host, ipAddr, parsedPort, 3*time.Second)
		outcome.Observed["port_open"] = probe.Open
		outcome.Observed["tls_enabled"] = probe.TLSEnabled
		for k, v := range probe.Fingerprint {
			outcome.Observed[k] = v
		}
		if !probe.Open {
			outcome.Passed = true
			outcome.Summary = fmt.Sprintf("真实复测通过：目标 %s 已关闭暴露端口", probeTarget)
		} else if probe.TLSEnabled && !probe.TLSExpired && probe.TLSDaysLeft != nil && *probe.TLSDaysLeft > 30 {
			outcome.Passed = true
			outcome.Summary = fmt.Sprintf("真实复测通过：TLS 证书已更新（剩余有效期 %d 天）", *probe.TLSDaysLeft)
		} else if probe.TLSEnabled {
			outcome.Passed = false
			outcome.Summary = fmt.Sprintf("复测未通过：目标 %s 证书仍已过期或临近到期", probeTarget)
		} else {
			outcome.Passed = false
			outcome.Summary = fmt.Sprintf("复测未通过：目标 %s TLS 握手失败或未提供有效证书", probeTarget)
		}
		return outcome

	case ChangeNewShadowAsset:
		outcome.Observed["is_shadow"] = isShadow
		outcome.Observed["in_cmdb"] = inCMDB
		if !isShadow || inCMDB {
			outcome.Passed = true
			outcome.Summary = "真实复测通过：影子资产已完成归属认领或纳入 CMDB 基线"
			return outcome
		}
		if host != "" && parsedPort > 0 {
			probe := ProbeEndpoint(ctx, host, ipAddr, parsedPort, 3*time.Second)
			outcome.Observed["port_open"] = probe.Open
			if !probe.Open {
				outcome.Passed = true
				outcome.Summary = fmt.Sprintf("真实复测通过：未登记影子资产 %s 已下线不可达", probeTarget)
				return outcome
			}
		}
		outcome.Passed = false
		outcome.Summary = "复测未通过：影子资产仍在线暴露且尚未认领归属或纳入 CMDB 基线"
		return outcome

	default:
		if host == "" || parsedPort <= 0 {
			outcome.Passed = false
			outcome.Summary = "复测无法执行：资产缺少有效网络端点"
			return outcome
		}
		probe := ProbeEndpoint(ctx, host, ipAddr, parsedPort, 3*time.Second)
		outcome.Observed["port_open"] = probe.Open
		outcome.Observed["service_name"] = probe.ServiceName
		for k, v := range probe.Fingerprint {
			outcome.Observed[k] = v
		}
		if !probe.Open {
			outcome.Passed = true
			outcome.Summary = fmt.Sprintf("真实复测通过：%s 暴露服务已下线", probeTarget)
		} else {
			outcome.Passed = false
			outcome.Summary = fmt.Sprintf("复测结果：服务 %s (%s) 仍在线，请确认已整改后再手动收敛或下线端口", probeTarget, probe.ServiceName)
		}
		return outcome
	}
}

func resolveEndpointTarget(identifier, ipAddr string, port int) (host string, outPort int) {
	outPort = port
	raw := strings.TrimSpace(identifier)
	if raw != "" {
		if h, pStr, err := net.SplitHostPort(raw); err == nil {
			host = strings.Trim(h, "[]")
			if outPort <= 0 {
				if p, convErr := strconv.Atoi(pStr); convErr == nil && p > 0 {
					outPort = p
				}
			}
		} else {
			host = strings.Trim(raw, "[]")
		}
	}
	if strings.TrimSpace(host) == "" {
		host = strings.TrimSpace(ipAddr)
	}
	return host, outPort
}
