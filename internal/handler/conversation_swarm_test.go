package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"
	"time"

	"cyberstrike-ai/internal/database"
	"cyberstrike-ai/internal/security"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func TestBuildConversationSwarmSnapshotParallelSameTypeSubagents(t *testing.T) {
	t0 := time.Date(2026, 11, 22, 12, 0, 0, 0, time.UTC)
	conv := &database.Conversation{
		ID:        "conv-swarm-1",
		Title:     "Target Pentest",
		AgentMode: "deep",
		CreatedAt: t0,
		UpdatedAt: t0.Add(2 * time.Minute),
		Messages: []database.Message{
			{ID: "msg-user-1", Role: "user", Content: "Scan example.com"},
			{ID: "msg-asst-1", Role: "assistant", Content: "Report"},
		},
	}

	details := []database.ProcessDetail{
		{
			ID: "pd-0", MessageID: "msg-asst-1", ConversationID: conv.ID, EventType: "swarm_agent_start",
			Message: "协调主代理", CreatedAt: t0,
			Data: `{"runId":"run-main","agentName":"main","agentDisplayName":"协调主代理","agentRole":"orchestrator","orchestration":"deep","taskBrief":"Scan example.com"}`,
		},
		{
			ID: "pd-1", MessageID: "msg-asst-1", ConversationID: conv.ID, EventType: "tool_call",
			Message: "", CreatedAt: t0.Add(2 * time.Second),
			Data: `{"runId":"run-main","agentName":"main","agentRole":"orchestrator","toolName":"task","toolCallId":"tc-recon-a","arguments":{"subagent_type":"recon","description":"Enumerate web endpoints"}}`,
		},
		{
			ID: "pd-2", MessageID: "msg-asst-1", ConversationID: conv.ID, EventType: "tool_call",
			Message: "", CreatedAt: t0.Add(2 * time.Second),
			Data: `{"runId":"run-main","agentName":"main","agentRole":"orchestrator","toolName":"task","toolCallId":"tc-recon-b","arguments":{"subagent_type":"recon","description":"Inspect auth endpoints"}}`,
		},
		{
			ID: "pd-3", MessageID: "msg-asst-1", ConversationID: conv.ID, EventType: "swarm_agent_start",
			Message: "侦察专员", CreatedAt: t0.Add(3 * time.Second),
			Data: `{"runId":"run-recon-1","parentRunId":"run-main","parentToolCallId":"tc-recon-a","agentName":"recon","agentDisplayName":"侦察专员","agentRole":"subagent","orchestration":"deep","delegationTool":"task","taskBrief":"Enumerate web endpoints"}`,
		},
		{
			ID: "pd-4", MessageID: "msg-asst-1", ConversationID: conv.ID, EventType: "swarm_agent_start",
			Message: "侦察专员", CreatedAt: t0.Add(3 * time.Second),
			Data: `{"runId":"run-recon-2","parentRunId":"run-main","parentToolCallId":"tc-recon-b","agentName":"recon","agentDisplayName":"侦察专员","agentRole":"subagent","orchestration":"deep","delegationTool":"task","taskBrief":"Inspect auth endpoints"}`,
		},
		{
			ID: "pd-5", MessageID: "msg-asst-1", ConversationID: conv.ID, EventType: "tool_call",
			Message: "", CreatedAt: t0.Add(5 * time.Second),
			Data: `{"runId":"run-recon-1","parentRunId":"run-main","parentToolCallId":"tc-recon-a","agentName":"recon","agentRole":"subagent","toolName":"httpx","toolCallId":"tc-httpx-1","arguments":{"url":"https://example.com"}}`,
		},
		{
			ID: "pd-6", MessageID: "msg-asst-1", ConversationID: conv.ID, EventType: "tool_result",
			Message: "200 OK", CreatedAt: t0.Add(8 * time.Second),
			Data: `{"runId":"run-recon-1","parentRunId":"run-main","parentToolCallId":"tc-recon-a","agentName":"recon","agentRole":"subagent","toolName":"httpx","toolCallId":"tc-httpx-1","executionId":"exec-1","success":true,"resultPreview":"200 OK"}`,
		},
		{
			ID: "pd-7", MessageID: "msg-asst-1", ConversationID: conv.ID, EventType: "agent_usage_summary",
			Message: "usage", CreatedAt: t0.Add(10 * time.Second),
			Data: `{"runId":"run-recon-1","agentName":"recon","agentRole":"subagent","model":"deepseek-flash","modelCalls":2,"promptTokens":1000,"completionTokens":200,"totalTokens":1200,"cachedTokens":600}`,
		},
		{
			ID: "pd-8", MessageID: "msg-asst-1", ConversationID: conv.ID, EventType: "swarm_agent_end",
			Message: "侦察专员", CreatedAt: t0.Add(12 * time.Second),
			Data: `{"runId":"run-recon-1","parentRunId":"run-main","parentToolCallId":"tc-recon-a","agentName":"recon","agentDisplayName":"侦察专员","agentRole":"subagent","delegationTool":"task","status":"completed","durationMs":9000,"resultPreview":"web endpoints mapped"}`,
		},
	}

	snap := buildConversationSwarmSnapshot(conv, map[string][]database.ProcessDetail{"msg-asst-1": details}, true, t0)
	if snap.Summary.TotalNodes != 3 {
		t.Fatalf("TotalNodes = %d, want 3 (1 root + 2 parallel recon subagents)", snap.Summary.TotalNodes)
	}
	if snap.Summary.RunningNodes != 2 || snap.Summary.CompletedNodes != 1 {
		t.Fatalf("unexpected running/completed counts: %+v", snap.Summary)
	}
	if len(snap.Edges) != 2 {
		t.Fatalf("Edges = %d, want 2", len(snap.Edges))
	}

	byID := map[string]SwarmNode{}
	for _, n := range snap.Nodes {
		byID[n.ID] = n
	}
	r1 := byID["run-recon-1"]
	r2 := byID["run-recon-2"]
	if r1.Status != "completed" || r1.ToolCount != 1 || r1.TokenUsage.TotalTokens != 1200 || r1.ParentToolCallID != "tc-recon-a" {
		t.Fatalf("unexpected r1: %+v", r1)
	}
	if r2.Status != "running" || r2.ParentToolCallID != "tc-recon-b" || r2.TaskBrief != "Inspect auth endpoints" {
		t.Fatalf("unexpected r2: %+v", r2)
	}
	if snap.Summary.TotalTokens != 1200 || snap.Summary.CachedTokens != 600 {
		t.Fatalf("unexpected token summary: %+v", snap.Summary)
	}
}

func TestBuildConversationSwarmSnapshotLegacyAndHTTP(t *testing.T) {
	gin.SetMode(gin.TestMode)
	tmp := t.TempDir()
	db, err := database.NewDB(filepath.Join(tmp, "swarm.db"), zap.NewNop())
	if err != nil {
		t.Fatalf("NewDB: %v", err)
	}
	t.Cleanup(func() { _ = db.Close() })

	conv, err := db.CreateConversation("Legacy Swarm", database.ConversationCreateMeta{})
	if err != nil {
		t.Fatalf("CreateConversation: %v", err)
	}
	if _, err := db.AddMessage(conv.ID, "user", "test", nil); err != nil {
		t.Fatalf("AddMessage user: %v", err)
	}
	asst, err := db.AddMessage(conv.ID, "assistant", "done", nil)
	if err != nil {
		t.Fatalf("AddMessage assistant: %v", err)
	}

	// Legacy process_details without swarm_agent_start/runId
	if err := db.AddProcessDetail(asst.ID, conv.ID, "tool_call", "", map[string]any{
		"agentName": "main", "agentRole": "orchestrator", "toolName": "task", "toolCallId": "legacy-tc-1",
		"arguments": map[string]any{"subagent_type": "penetration", "description": "Verify auth boundary"},
	}); err != nil {
		t.Fatal(err)
	}
	if err := db.AddProcessDetail(asst.ID, conv.ID, "tool_call", "", map[string]any{
		"agentName": "penetration", "agentRole": "sub", "toolName": "curl", "toolCallId": "legacy-tc-2",
		"arguments": map[string]any{"url": "https://example.com/login"},
	}); err != nil {
		t.Fatal(err)
	}
	if err := db.AddProcessDetail(asst.ID, conv.ID, "agent_reply", "Auth check passed", map[string]any{
		"agentName": "penetration", "agentRole": "subagent",
	}); err != nil {
		t.Fatal(err)
	}

	h := NewConversationHandler(db, zap.NewNop())
	h.SetTaskStateProvider(staticConversationTaskState{running: false})

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequest(http.MethodGet, "/api/conversations/"+conv.ID+"/swarm", nil)
	c.Params = gin.Params{{Key: "id", Value: conv.ID}}
	c.Set(security.ContextSessionKey, security.Session{UserID: "admin", Scope: database.RBACScopeAll})
	h.GetConversationSwarm(c)
	if w.Code != http.StatusOK {
		t.Fatalf("status = %d: %s", w.Code, w.Body.String())
	}

	var snap ConversationSwarmSnapshot
	if err := json.Unmarshal(w.Body.Bytes(), &snap); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if snap.Running {
		t.Fatalf("expected settled non-running snapshot")
	}
	if snap.Summary.TotalNodes != 2 || snap.Summary.RunningNodes != 0 || snap.Summary.CompletedNodes != 2 {
		t.Fatalf("legacy nodes should settle to 2 completed nodes: %+v", snap.Summary)
	}
	if len(snap.Edges) != 1 || snap.Edges[0].Status != "completed" {
		t.Fatalf("unexpected legacy edge: %+v", snap.Edges)
	}

	// Unknown conversation returns 404
	w404 := httptest.NewRecorder()
	c404, _ := gin.CreateTestContext(w404)
	c404.Request = httptest.NewRequest(http.MethodGet, "/api/conversations/missing/swarm", nil)
	c404.Params = gin.Params{{Key: "id", Value: "missing"}}
	h.GetConversationSwarm(c404)
	if w404.Code != http.StatusNotFound {
		t.Fatalf("missing conv status = %d, want 404", w404.Code)
	}
}
