package multiagent

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"cyberstrike-ai/internal/agentruntime"
	"cyberstrike-ai/internal/config"
	"go.uber.org/zap"
)

func swarmTestWorkerPath(t *testing.T) string {
	t.Helper()
	t.Chdir("../..")
	if path, err := agentruntime.ResolveWorker(""); err == nil {
		return path
	}
	return piTestWorkerPath(t)
}

func TestRunPiMultiEmitsSwarmCorrelationMetadata(t *testing.T) {
	worker := swarmTestWorkerPath(t)
	cfg := &config.Config{
		AgentRuntime: config.AgentRuntimeConfig{
			Engine:     "pi",
			WorkerPath: worker,
			SessionDir: t.TempDir(),
		},
		OpenAI: config.OpenAIConfig{
			Provider:            "openai",
			APIKey:              "fixture-key",
			Model:               "fixture",
			MaxTotalTokens:      32000,
			MaxCompletionTokens: 1024,
		},
	}
	cfg.Agent.MaxIterations = 8
	cfg.MultiAgent.Skills.Disable = true
	cfg.MultiAgent.SubAgents = []config.MultiAgentSubConfig{
		{
			ID:          "recon",
			Name:        "Recon Specialist",
			Description: "Inspect target surface",
			Instruction: "You are a recon specialist.",
		},
	}

	var calls atomic.Int32
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var body struct {
			Messages []map[string]any `json:"messages"`
		}
		if err := json.NewDecoder(reqBody(r)).Decode(&body); err != nil {
			t.Error(err)
			return
		}
		switch calls.Add(1) {
		case 1:
			piReply(w, "task", "task-call-1", map[string]any{
				"subagent_type": "recon",
				"description":   "Scan endpoints on example.com",
			}, "")
		case 2:
			piReply(w, "", "", nil, "found /api/health")
		case 3:
			piReply(w, "exit", "exit-call-1", map[string]any{
				"final_result": "recon done",
			}, "")
		default:
			piReply(w, "", "", nil, "unexpected")
		}
	}))
	defer server.Close()
	cfg.OpenAI.BaseURL = server.URL + "/v1"

	ag := piTestAgent(cfg, nil)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	type capturedEvent struct {
		kind    string
		message string
		data    map[string]any
	}
	var eventsMu sync.Mutex
	var events []capturedEvent
	res, err := RunMultiAgent(
		ctx,
		cfg,
		&cfg.MultiAgent,
		ag,
		nil,
		zap.NewNop(),
		"swarm-meta-conv",
		"",
		"Audit example.com",
		nil,
		nil,
		func(kind, message string, data interface{}) {
			m, _ := data.(map[string]any)
			cp := map[string]any{}
			for k, v := range m {
				cp[k] = v
			}
			eventsMu.Lock()
			events = append(events, capturedEvent{kind: kind, message: message, data: cp})
			eventsMu.Unlock()
		},
		"",
		"deep",
		nil,
		"",
	)
	if err != nil {
		t.Fatalf("RunMultiAgent failed: %v", err)
	}
	if res == nil || res.Response != "recon done" {
		t.Fatalf("unexpected result: %+v", res)
	}

	eventsMu.Lock()
	defer eventsMu.Unlock()

	var (
		childStart  map[string]any
		childEnd    map[string]any
		childReply  map[string]any
		mainTool    map[string]any
		orchStarts  int
		childStarts int
	)
	for _, ev := range events {
		switch ev.kind {
		case "swarm_agent_start":
			if ev.data["agentRole"] == "orchestrator" {
				orchStarts++
			} else if ev.data["agentRole"] == "subagent" && ev.data["agentName"] == "recon" {
				childStarts++
				childStart = ev.data
			}
		case "swarm_agent_end":
			if ev.data["agentRole"] == "subagent" && ev.data["agentName"] == "recon" {
				childEnd = ev.data
			}
		case "agent_reply":
			if ev.data["agentName"] == "recon" {
				childReply = ev.data
			}
		case "tool_call":
			if ev.data["toolName"] == "task" {
				mainTool = ev.data
			}
		}
	}

	if orchStarts != 1 || childStarts != 1 {
		t.Fatalf("expected 1 orchestrator start and 1 child start, got orch=%d child=%d", orchStarts, childStarts)
	}
	if childStart == nil || childEnd == nil || childReply == nil || mainTool == nil {
		t.Fatalf("missing expected swarm events: start=%v end=%v reply=%v tool=%v", childStart, childEnd, childReply, mainTool)
	}
	mainRunID, _ := mainTool["runId"].(string)
	mainToolCallID, _ := mainTool["toolCallId"].(string)
	childRunID, _ := childStart["runId"].(string)
	if mainRunID == "" || mainToolCallID == "" || childRunID == "" || mainRunID == childRunID {
		t.Fatalf("invalid IDs: mainRun=%q mainToolCall=%q childRun=%q", mainRunID, mainToolCallID, childRunID)
	}
	if childStart["parentRunId"] != mainRunID {
		t.Fatalf("child start parentRunId=%v, want %q", childStart["parentRunId"], mainRunID)
	}
	if childStart["parentToolCallId"] != mainToolCallID {
		t.Fatalf("child start parentToolCallId=%v, want %q", childStart["parentToolCallId"], mainToolCallID)
	}
	if childStart["agentDisplayName"] != "Recon Specialist" {
		t.Fatalf("child start agentDisplayName=%v, want Recon Specialist", childStart["agentDisplayName"])
	}
	if childStart["orchestration"] != "deep" {
		t.Fatalf("child start orchestration=%v, want deep", childStart["orchestration"])
	}
	if childReply["runId"] != childRunID || childReply["parentRunId"] != mainRunID || childReply["parentToolCallId"] != mainToolCallID {
		t.Fatalf("child reply missing swarm correlation: %v", childReply)
	}
	if childEnd["status"] != "completed" || childEnd["runId"] != childRunID {
		t.Fatalf("unexpected childEnd: %v", childEnd)
	}
}

func reqBody(r *http.Request) *httpReaderCloser {
	return &httpReaderCloser{r: r}
}

type httpReaderCloser struct {
	r *http.Request
}

func (h *httpReaderCloser) Read(p []byte) (int, error) {
	return h.r.Body.Read(p)
}
