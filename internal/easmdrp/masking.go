package easmdrp

import (
	"crypto/sha256"
	"encoding/hex"
	"regexp"
	"strings"
	"time"
)

var (
	// Matches common high-risk secrets: AWS AK, GitHub/GitLab tokens, Slack tokens, JWTs, private key blocks.
	reAWSKey      = regexp.MustCompile(`\b(AKIA|ASIA)[0-9A-Z]{16}\b`)
	reGitHubToken = regexp.MustCompile(`\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b`)
	reGitHubPAT   = regexp.MustCompile(`\bgithub_pat_[A-Za-z0-9_]{20,}\b`)
	reJWT         = regexp.MustCompile(`\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b`)
	reBearer      = regexp.MustCompile(`(?i)(bearer\s+)([A-Za-z0-9._\-+/=]{12,})`)
	reKVSecret    = regexp.MustCompile(`(?i)\b(password|passwd|pwd|secret|api_key|apikey|access_key|secret_key|token|private_key|auth_token)(\s*[:=]\s*["']?)([^\s"',;}{]{6,})(["']?)`)
)

// MaskToken keeps only the first 2 and last 2 characters of a secret string,
// replacing the middle with **** so real credentials are never stored in plain text.
func MaskToken(secret string) string {
	s := strings.TrimSpace(secret)
	n := len(s)
	if n == 0 {
		return ""
	}
	if n <= 4 {
		return "****"
	}
	return s[:2] + "****" + s[n-2:]
}

// MaskSensitiveText enforces mandatory credential masking before database persistence.
func MaskSensitiveText(raw string) string {
	if strings.TrimSpace(raw) == "" {
		return ""
	}
	out := raw
	out = reAWSKey.ReplaceAllStringFunc(out, MaskToken)
	out = reGitHubToken.ReplaceAllStringFunc(out, MaskToken)
	out = reGitHubPAT.ReplaceAllStringFunc(out, MaskToken)
	out = reJWT.ReplaceAllStringFunc(out, MaskToken)
	out = reBearer.ReplaceAllStringFunc(out, func(m string) string {
		sub := reBearer.FindStringSubmatch(m)
		if len(sub) < 3 {
			return m
		}
		return sub[1] + MaskToken(sub[2])
	})
	out = reKVSecret.ReplaceAllStringFunc(out, func(m string) string {
		sub := reKVSecret.FindStringSubmatch(m)
		if len(sub) < 5 {
			return m
		}
		return sub[1] + sub[2] + MaskToken(sub[3]) + sub[4]
	})
	return out
}

// ComputeEventHash produces a stable SHA-256 deduplication fingerprint based on
// (channel_group, source_ref, matched_rule, affected_entity, fingerprint_hash).
func ComputeEventHash(channelGroup, sourceRef, matchedRule, affectedEntity, rawSnippet string) string {
	contentHash := sha256.Sum256([]byte(strings.TrimSpace(rawSnippet)))
	payload := strings.Join([]string{
		strings.ToLower(strings.TrimSpace(channelGroup)),
		strings.TrimSpace(sourceRef),
		strings.ToLower(strings.TrimSpace(matchedRule)),
		strings.ToLower(strings.TrimSpace(affectedEntity)),
		hex.EncodeToString(contentHash[:8]),
	}, "|")
	sum := sha256.Sum256([]byte(payload))
	return hex.EncodeToString(sum[:])
}

// MatchesExcludeRules returns true if the finding matches any configured whitelist / exclusion pattern.
func MatchesExcludeRules(finding RawLeakFinding, excludeRules []string) bool {
	if len(excludeRules) == 0 {
		return false
	}
	haystack := strings.ToLower(strings.Join([]string{
		finding.Title,
		finding.SourceRef,
		finding.AffectedEntity,
		finding.RawSnippet,
	}, " "))
	for _, rule := range excludeRules {
		r := strings.ToLower(strings.TrimSpace(rule))
		if r == "" {
			continue
		}
		if strings.Contains(haystack, r) {
			return true
		}
	}
	return false
}

// NormalizeLeakFinding runs a RawLeakFinding through the mandatory masking and
// deduplication pipeline, producing a storage-safe NormalizedLeakEvent.
func NormalizeLeakFinding(f RawLeakFinding) NormalizedLeakEvent {
	detected := f.DetectedAt
	if detected.IsZero() {
		detected = time.Now().UTC()
	}
	sev := strings.ToLower(strings.TrimSpace(f.Severity))
	switch sev {
	case "critical", "high", "medium", "low":
	default:
		sev = "medium"
	}
	ruleTag := strings.TrimSpace(f.MatchedRule)
	if ruleTag == "" {
		ruleTag = f.LeakType
	}
	return NormalizedLeakEvent{
		RuleID:         f.RuleID,
		EventHash:      ComputeEventHash(f.ChannelGroup, f.SourceRef, ruleTag, f.AffectedEntity, f.RawSnippet),
		ChannelGroup:   strings.TrimSpace(f.ChannelGroup),
		SourcePlatform: strings.TrimSpace(f.SourcePlatform),
		LeakType:       strings.TrimSpace(f.LeakType),
		Severity:       sev,
		Title:          strings.TrimSpace(f.Title),
		SourceRef:      strings.TrimSpace(f.SourceRef),
		MaskedSnippet:  MaskSensitiveText(f.RawSnippet),
		AffectedEntity: strings.TrimSpace(f.AffectedEntity),
		TriageStatus:   TriageNew,
		DetectedAt:     detected,
	}
}
