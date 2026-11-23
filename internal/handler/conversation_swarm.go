package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"strings"
	"time"

	"cyberstrike-ai/internal/database"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

const (
	swarmMaxNodeEvents = 120
	swarmMaxFeedEvents = 160
)

// ConversationSwarmSnapshot 描述单次对话在多代理蜂群视图下的拓扑、时间轴与指标聚合。
type ConversationSwarmSnapshot struct {
	ConversationID string           `json:"conversationId"`
	Title          string           `json:"title"`
	Orchestration  string           `json:"orchestration"`
	Running        bool             `json:"running"`
	StartedAt      *time.Time       `json:"startedAt,omitempty"`
	UpdatedAt      time.Time        `json:"updatedAt"`
	Summary        SwarmSummary     `json:"summary"`
	Nodes          []SwarmNode      `json:"nodes"`
	Edges          []SwarmEdge      `json:"edges"`
	Feed           []SwarmFeedEvent `json:"feed"`
}

// SwarmSummary 汇总本次蜂群执行的全局统计指标。
type SwarmSummary struct {
	TotalNodes       int `json:"totalNodes"`
	RunningNodes     int `json:"runningNodes"`
	CompletedNodes   int `json:"completedNodes"`
	FailedNodes      int `json:"failedNodes"`
	CancelledNodes   int `json:"cancelledNodes"`
	TotalTools       int `json:"totalTools"`
	RunningTools     int `json:"runningTools"`
	FailedTools      int `json:"failedTools"`
	TotalTokens      int `json:"totalTokens"`
	PromptTokens     int `json:"promptTokens"`
	CompletionTokens int `json:"completionTokens"`
	CachedTokens     int `json:"cachedTokens"`
	ReasoningTokens  int `json:"reasoningTokens"`
	TotalModelCalls  int `json:"totalModelCalls"`
}

// SwarmTokenUsage 记录单个节点的模型调用与 Token 消耗。
type SwarmTokenUsage struct {
	Model            string `json:"model,omitempty"`
	ModelCalls       int    `json:"modelCalls"`
	PromptTokens     int    `json:"promptTokens"`
	CompletionTokens int    `json:"completionTokens"`
	TotalTokens      int    `json:"totalTokens"`
	CachedTokens     int    `json:"cachedTokens"`
	CacheWriteTokens int    `json:"cacheWriteTokens"`
	ReasoningTokens  int    `json:"reasoningTokens"`
}

// SwarmNodeEvent 为右侧检查器提供节点级的精简活动轨迹（附带 processDetailId 支持按需展开）。
type SwarmNodeEvent struct {
	ID              string    `json:"id"`
	ProcessDetailID string    `json:"processDetailId,omitempty"`
	EventType       string    `json:"eventType"`
	Title           string    `json:"title"`
	Summary         string    `json:"summary,omitempty"`
	ToolName        string    `json:"toolName,omitempty"`
	ToolCallID      string    `json:"toolCallId,omitempty"`
	ExecutionID     string    `json:"executionId,omitempty"`
	Status          string    `json:"status,omitempty"`
	CreatedAt       time.Time `json:"createdAt"`
}

// SwarmNode 代表蜂群中的一个主代理或子代理执行实例。
type SwarmNode struct {
	ID               string           `json:"id"`
	ParentID         string           `json:"parentId,omitempty"`
	ParentToolCallID string           `json:"parentToolCallId,omitempty"`
	AgentName        string           `json:"agentName"`
	DisplayName      string           `json:"displayName"`
	Role             string           `json:"role"`
	DelegationTool   string           `json:"delegationTool,omitempty"`
	Status           string           `json:"status"`
	TaskBrief        string           `json:"taskBrief,omitempty"`
	ResultPreview    string           `json:"resultPreview,omitempty"`
	CurrentActivity  string           `json:"currentActivity,omitempty"`
	CurrentTool      string           `json:"currentTool,omitempty"`
	StartedAt        time.Time        `json:"startedAt"`
	EndedAt          *time.Time       `json:"endedAt,omitempty"`
	DurationMs       int64            `json:"durationMs"`
	ToolCount        int              `json:"toolCount"`
	RunningToolCount int              `json:"runningToolCount"`
	FailedToolCount  int              `json:"failedToolCount"`
	IterationCount   int              `json:"iterationCount"`
	TokenUsage       SwarmTokenUsage  `json:"tokenUsage"`
	Events           []SwarmNodeEvent `json:"events"`
}

// SwarmEdge 表示主代理向子代理的委派/通信边。
type SwarmEdge struct {
	ID         string `json:"id"`
	Source     string `json:"source"`
	Target     string `json:"target"`
	ToolCallID string `json:"toolCallId,omitempty"`
	Label      string `json:"label"`
	Kind       string `json:"kind"`
	Status     string `json:"status"`
	DurationMs int64  `json:"durationMs,omitempty"`
}

// SwarmFeedEvent 表示底部蜂群实时脉冲流中的关键事件。
type SwarmFeedEvent struct {
	ID          string    `json:"id"`
	NodeID      string    `json:"nodeId"`
	AgentName   string    `json:"agentName"`
	DisplayName string    `json:"displayName"`
	EventType   string    `json:"eventType"`
	Title       string    `json:"title"`
	Summary     string    `json:"summary,omitempty"`
	Status      string    `json:"status,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
}

// GetConversationSwarm GET /api/conversations/:id/swarm 返回指定对话的多代理蜂群拓扑与实时遥测快照。
func (h *ConversationHandler) GetConversationSwarm(c *gin.Context) {
	conversationID := strings.TrimSpace(c.Param("id"))
	if conversationID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "conversation id required"})
		return
	}

	conv, err := h.db.GetConversationLite(conversationID)
	if err != nil {
		h.logger.Warn("获取蜂群快照失败：对话不存在", zap.String("conversationId", conversationID), zap.Error(err))
		c.JSON(http.StatusNotFound, gin.H{"error": "对话不存在"})
		return
	}

	byMsg, err := h.db.GetProcessDetailsByConversation(conversationID)
	if err != nil {
		h.logger.Error("查询蜂群过程详情失败", zap.String("conversationId", conversationID), zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	messageID := strings.TrimSpace(c.Query("messageId"))
	if messageID != "" {
		filtered := make(map[string][]database.ProcessDetail, 1)
		if rows, ok := byMsg[messageID]; ok {
			filtered[messageID] = rows
		}
		byMsg = filtered
	}

	running := false
	var startedAt time.Time
	if h.taskState != nil {
		running, startedAt = h.taskState.ConversationTaskRuntimeState(conversationID)
	}

	snapshot := buildConversationSwarmSnapshot(conv, byMsg, running, startedAt)
	c.JSON(http.StatusOK, snapshot)
}

type pendingDelegation struct {
	parentNodeID string
	toolCallID   string
	toolName     string
	targetAgent  string
	taskBrief    string
	startedAt    time.Time
}

type activeToolState struct {
	nodeID   string
	toolName string
	eventIdx int
}

type legacySubKey struct {
	msgID     string
	agentName string
}

func buildConversationSwarmSnapshot(
	conv *database.Conversation,
	byMsg map[string][]database.ProcessDetail,
	running bool,
	startedAt time.Time,
) ConversationSwarmSnapshot {
	out := ConversationSwarmSnapshot{
		UpdatedAt: time.Now(),
		Nodes:     []SwarmNode{},
		Edges:     []SwarmEdge{},
		Feed:      []SwarmFeedEvent{},
	}
	if conv != nil {
		out.ConversationID = conv.ID
		out.Title = conv.Title
		out.Orchestration = strings.TrimSpace(conv.AgentMode)
	}
	if out.Orchestration == "" {
		out.Orchestration = "deep"
	}
	out.Running = running
	if running && !startedAt.IsZero() {
		st := startedAt
		out.StartedAt = &st
	}

	// 按消息出现顺序整理过程详情，保证时间线与拓扑构造完全确定。
	seenMsg := make(map[string]bool, len(byMsg))
	orderedMsgs := make([]string, 0, len(byMsg))
	if conv != nil {
		for _, m := range conv.Messages {
			if len(byMsg[m.ID]) > 0 && !seenMsg[m.ID] {
				seenMsg[m.ID] = true
				orderedMsgs = append(orderedMsgs, m.ID)
			}
		}
	}
	extraMsgs := make([]string, 0)
	for msgID, rows := range byMsg {
		if len(rows) > 0 && !seenMsg[msgID] {
			extraMsgs = append(extraMsgs, msgID)
		}
	}
	sort.Strings(extraMsgs)
	orderedMsgs = append(orderedMsgs, extraMsgs...)

	nodeIdxByID := make(map[string]int)
	nodes := make([]*SwarmNode, 0)
	edgeIdxByKey := make(map[string]int)
	edges := make([]*SwarmEdge, 0)
	feed := make([]SwarmFeedEvent, 0)

	legacyRootByMsg := make(map[string]string)
	legacySubByKey := make(map[legacySubKey]string)
	pendingByToolCall := make(map[string]*pendingDelegation)
	pendingByAgent := make(map[string][]*pendingDelegation)
	activeTools := make(map[string]activeToolState)
	seenStreamIters := make(map[string]map[string]bool)
	turnTerminalStatus := make(map[string]string) // msgID -> cancelled | failed | completed
	var lastMsgID string

	ensureNode := func(id, parentID, parentToolCallID, agentName, displayName, role, delegationTool string, ts time.Time) *SwarmNode {
		if idx, exists := nodeIdxByID[id]; exists {
			n := nodes[idx]
			if parentID != "" && n.ParentID == "" {
				n.ParentID = parentID
			}
			if parentToolCallID != "" && n.ParentToolCallID == "" {
				n.ParentToolCallID = parentToolCallID
			}
			if displayName != "" && (n.DisplayName == "" || n.DisplayName == n.AgentName) {
				n.DisplayName = displayName
			}
			if delegationTool != "" && n.DelegationTool == "" {
				n.DelegationTool = delegationTool
			}
			if n.StartedAt.IsZero() && !ts.IsZero() {
				n.StartedAt = ts
			}
			return n
		}
		if displayName == "" {
			displayName = agentName
		}
		if displayName == "" {
			if role == "orchestrator" {
				displayName = "协调主代理"
			} else {
				displayName = id
			}
		}
		node := &SwarmNode{
			ID:               id,
			ParentID:         parentID,
			ParentToolCallID: parentToolCallID,
			AgentName:        agentName,
			DisplayName:      displayName,
			Role:             role,
			DelegationTool:   delegationTool,
			Status:           "running",
			StartedAt:        ts,
			Events:           []SwarmNodeEvent{},
		}
		nodeIdxByID[id] = len(nodes)
		nodes = append(nodes, node)
		return node
	}

	ensureEdge := func(source, target, toolCallID, label, kind, status string) *SwarmEdge {
		if source == "" || target == "" || source == target {
			return nil
		}
		key := source + "->" + target
		if toolCallID != "" {
			key += "::" + toolCallID
		}
		if idx, exists := edgeIdxByKey[key]; exists {
			e := edges[idx]
			if status != "" {
				e.Status = status
			}
			if label != "" && e.Label == "" {
				e.Label = label
			}
			return e
		}
		if label == "" {
			label = kind
		}
		edge := &SwarmEdge{
			ID:         fmt.Sprintf("edge-%d", len(edges)+1),
			Source:     source,
			Target:     target,
			ToolCallID: toolCallID,
			Label:      label,
			Kind:       kind,
			Status:     status,
		}
		edgeIdxByKey[key] = len(edges)
		edges = append(edges, edge)
		return edge
	}

	appendNodeEvent := func(n *SwarmNode, ev SwarmNodeEvent) {
		n.Events = append(n.Events, ev)
		if len(n.Events) > swarmMaxNodeEvents {
			n.Events = n.Events[len(n.Events)-swarmMaxNodeEvents:]
		}
	}

	appendFeed := func(ev SwarmFeedEvent) {
		feed = append(feed, ev)
		if len(feed) > swarmMaxFeedEvents {
			feed = feed[len(feed)-swarmMaxFeedEvents:]
		}
	}

	markIterationStream := func(nodeID, streamID string) bool {
		if nodeID == "" || streamID == "" {
			return false
		}
		set, ok := seenStreamIters[nodeID]
		if !ok {
			set = make(map[string]bool)
			seenStreamIters[nodeID] = set
		}
		if set[streamID] {
			return false
		}
		set[streamID] = true
		return true
	}

	for _, msgID := range orderedMsgs {
		lastMsgID = msgID
		details := database.DedupeConsecutiveProcessDetails(byMsg[msgID])
		for i, d := range details {
			data := parseProcessDetailDataMap(d.Data)
			ts := d.CreatedAt
			if ts.IsZero() && conv != nil {
				ts = conv.CreatedAt
			}

			if orch := swarmStr(data["orchestration"]); orch != "" {
				out.Orchestration = orch
			}

			eventType := normalizeSwarmEventType(d.EventType)
			roleRaw := strings.ToLower(swarmStr(data["agentRole"]))
			agentName := swarmStr(data["agentName"])
			displayName := swarmStr(data["agentDisplayName"])
			runID := swarmStr(data["runId"])
			childRunID := swarmStr(data["childRunId"])
			if runID == "" && childRunID != "" {
				runID = childRunID
			}
			parentRunID := swarmStr(data["parentRunId"])
			parentToolCallID := swarmStr(data["parentToolCallId"])
			isSubagent := roleRaw == "subagent" || roleRaw == "sub" || parentRunID != "" || parentToolCallID != ""

			// 终态控制事件：记录消息轮次结果，不新建独立节点。
			if eventType == "cancelled" || eventType == "timeout" || eventType == "error" {
				termStatus := "failed"
				if eventType == "cancelled" {
					termStatus = "cancelled"
				}
				turnTerminalStatus[msgID] = termStatus
				if targetID := legacyRootByMsg[msgID]; targetID != "" {
					if idx, ok := nodeIdxByID[targetID]; ok {
						nodes[idx].CurrentActivity = truncateSwarmText(d.Message, 140)
						appendNodeEvent(nodes[idx], SwarmNodeEvent{
							ID:              swarmEventID(d, msgID, i),
							ProcessDetailID: d.ID,
							EventType:       eventType,
							Title:           eventType,
							Summary:         truncateSwarmText(d.Message, 240),
							Status:          termStatus,
							CreatedAt:       ts,
						})
					}
				}
				appendFeed(SwarmFeedEvent{
					ID:          swarmEventID(d, msgID, i),
					NodeID:      legacyRootByMsg[msgID],
					AgentName:   "main",
					DisplayName: "协调主代理",
					EventType:   eventType,
					Title:       d.Message,
					Status:      termStatus,
					CreatedAt:   ts,
				})
				continue
			}

			if eventType == "swarm_agent_start" {
				if runID == "" {
					runID = fmt.Sprintf("swarm-%s-%d", msgID, i)
				}
				role := "subagent"
				if !isSubagent {
					role = "orchestrator"
					legacyRootByMsg[msgID] = runID
				} else {
					if parentRunID == "" {
						parentRunID = legacyRootByMsg[msgID]
					}
					if agentName != "" {
						legacySubByKey[legacySubKey{msgID: msgID, agentName: agentName}] = runID
					}
				}
				if agentName == "" && role == "orchestrator" {
					agentName = "main"
				}
				node := ensureNode(runID, parentRunID, parentToolCallID, agentName, displayName, role, swarmStr(data["delegationTool"]), ts)
				if brief := swarmStr(data["taskBrief"]); brief != "" {
					node.TaskBrief = brief
				}
				if node.CurrentActivity == "" {
					node.CurrentActivity = "已启动任务…"
				}
				if parentToolCallID != "" {
					if pd, ok := pendingByToolCall[parentToolCallID]; ok {
						if node.ParentID == "" {
							node.ParentID = pd.parentNodeID
						}
						if node.TaskBrief == "" {
							node.TaskBrief = pd.taskBrief
						}
						if node.DelegationTool == "" {
							node.DelegationTool = pd.toolName
						}
					}
				}
				if node.ParentID != "" {
					label := node.DelegationTool
					if label == "" {
						label = "task"
					}
					ensureEdge(node.ParentID, node.ID, node.ParentToolCallID, label, label, "running")
				}
				appendFeed(SwarmFeedEvent{
					ID:          swarmEventID(d, msgID, i),
					NodeID:      node.ID,
					AgentName:   node.AgentName,
					DisplayName: node.DisplayName,
					EventType:   "swarm_agent_start",
					Title:       fmt.Sprintf("%s 启动执行", node.DisplayName),
					Summary:     truncateSwarmText(node.TaskBrief, 180),
					Status:      "running",
					CreatedAt:   ts,
				})
				continue
			}

			if eventType == "swarm_agent_end" {
				nodeID := runID
				if nodeID == "" && isSubagent && agentName != "" {
					nodeID = legacySubByKey[legacySubKey{msgID: msgID, agentName: agentName}]
				}
				if nodeID == "" {
					nodeID = legacyRootByMsg[msgID]
				}
				if nodeID == "" {
					continue
				}
				role := "subagent"
				if !isSubagent {
					role = "orchestrator"
				}
				node := ensureNode(nodeID, parentRunID, parentToolCallID, agentName, displayName, role, swarmStr(data["delegationTool"]), ts)
				endStatus := normalizeSwarmStatus(swarmStr(data["status"]))
				node.Status = endStatus
				ended := ts
				node.EndedAt = &ended
				if dur := swarmInt64(data["durationMs"]); dur > 0 {
					node.DurationMs = dur
				} else if !node.StartedAt.IsZero() && ended.After(node.StartedAt) {
					node.DurationMs = ended.Sub(node.StartedAt).Milliseconds()
				}
				if prev := swarmStr(data["resultPreview"]); prev != "" {
					node.ResultPreview = prev
				}
				if errMsg := swarmStr(data["error"]); errMsg != "" {
					node.CurrentActivity = errMsg
				} else if node.ResultPreview != "" {
					node.CurrentActivity = truncateSwarmText(node.ResultPreview, 120)
				}
				node.CurrentTool = ""
				if node.ParentID != "" {
					if e := ensureEdge(node.ParentID, node.ID, node.ParentToolCallID, node.DelegationTool, node.DelegationTool, endStatus); e != nil {
						e.DurationMs = node.DurationMs
					}
				}
				if node.ParentToolCallID != "" {
					delete(pendingByToolCall, node.ParentToolCallID)
				}
				appendFeed(SwarmFeedEvent{
					ID:          swarmEventID(d, msgID, i),
					NodeID:      node.ID,
					AgentName:   node.AgentName,
					DisplayName: node.DisplayName,
					EventType:   "swarm_agent_end",
					Title:       fmt.Sprintf("%s %s", node.DisplayName, swarmStatusText(endStatus)),
					Summary:     truncateSwarmText(swarmFirstNonEmpty(swarmStr(data["error"]), node.ResultPreview), 180),
					Status:      endStatus,
					CreatedAt:   ts,
				})
				continue
			}

			// 确定其余事件归属节点（兼容有 runId 与历史无 runId 两种格式）。
			role := "orchestrator"
			if isSubagent {
				role = "subagent"
			}
			nodeID := runID
			resolvedParentID := parentRunID
			resolvedParentCallID := parentToolCallID
			var matchedPending *pendingDelegation

			if nodeID != "" {
				if role == "orchestrator" && legacyRootByMsg[msgID] == "" {
					legacyRootByMsg[msgID] = nodeID
				}
				if role == "subagent" && resolvedParentID == "" {
					if resolvedParentCallID != "" {
						if pd, ok := pendingByToolCall[resolvedParentCallID]; ok {
							matchedPending = pd
							resolvedParentID = pd.parentNodeID
						}
					}
					if resolvedParentID == "" {
						resolvedParentID = legacyRootByMsg[msgID]
					}
				}
			} else {
				if role == "orchestrator" {
					if existingRoot := legacyRootByMsg[msgID]; existingRoot != "" {
						nodeID = existingRoot
					} else {
						nodeID = "legacy-orch-" + msgID
						legacyRootByMsg[msgID] = nodeID
					}
					if agentName == "" {
						agentName = "main"
					}
				} else {
					key := legacySubKey{msgID: msgID, agentName: agentName}
					if existingSub := legacySubByKey[key]; existingSub != "" {
						nodeID = existingSub
					} else {
						nodeID = fmt.Sprintf("legacy-sub-%s-%s-%d", msgID, sanitizeSwarmID(agentName), len(nodes)+1)
						legacySubByKey[key] = nodeID
						if queue := pendingByAgent[agentName]; len(queue) > 0 {
							matchedPending = queue[0]
							pendingByAgent[agentName] = queue[1:]
							resolvedParentID = matchedPending.parentNodeID
							resolvedParentCallID = matchedPending.toolCallID
						}
					}
					if resolvedParentID == "" {
						resolvedParentID = legacyRootByMsg[msgID]
					}
				}
			}

			delegTool := ""
			if matchedPending != nil {
				delegTool = matchedPending.toolName
			}
			node := ensureNode(nodeID, resolvedParentID, resolvedParentCallID, agentName, displayName, role, delegTool, ts)
			if matchedPending != nil && node.TaskBrief == "" {
				node.TaskBrief = matchedPending.taskBrief
			}
			if role == "subagent" && node.ParentID != "" {
				lbl := node.DelegationTool
				if lbl == "" {
					lbl = "task"
				}
				ensureEdge(node.ParentID, node.ID, node.ParentToolCallID, lbl, lbl, node.Status)
			}

			switch eventType {
			case "iteration":
				it := swarmInt(data["iteration"])
				if it > node.IterationCount {
					node.IterationCount = it
				} else if it == 0 {
					node.IterationCount++
				}
				node.CurrentActivity = fmt.Sprintf("第 %d 轮推理", maxInt(it, node.IterationCount))

			case "planning":
				if sid := swarmStr(data["streamId"]); sid != "" && markIterationStream(node.ID, "plan:"+sid) {
					if it := swarmInt(data["iteration"]); it > node.IterationCount {
						node.IterationCount = it
					} else if node.IterationCount == 0 {
						node.IterationCount = 1
					}
				}
				node.CurrentActivity = truncateSwarmText(d.Message, 120)

			case "thinking", "reasoning_chain":
				if sid := swarmStr(data["streamId"]); sid != "" && markIterationStream(node.ID, "reason:"+sid) {
					if it := swarmInt(data["iteration"]); it > node.IterationCount {
						node.IterationCount = it
					} else if it == 0 {
						node.IterationCount++
					}
				}
				if node.CurrentActivity == "" {
					node.CurrentActivity = "深度推理分析中…"
				}

			case "tool_call":
				toolName := swarmStr(data["toolName"])
				toolCallID := swarmStr(data["toolCallId"])
				if it := swarmInt(data["iteration"]); it > node.IterationCount {
					node.IterationCount = it
				}
				args := parseSwarmToolArgs(data)
				node.ToolCount++
				node.RunningToolCount++
				node.CurrentTool = toolName
				node.CurrentActivity = fmt.Sprintf("正在执行 %s", toolName)

				if (toolName == "task" || toolName == "transfer_to_agent") && toolCallID != "" {
					target := swarmFirstNonEmpty(swarmStr(args["subagent_type"]), swarmStr(args["agent_name"]), swarmStr(args["agentName"]))
					brief := swarmFirstNonEmpty(swarmStr(args["description"]), swarmStr(args["task"]))
					pd := &pendingDelegation{
						parentNodeID: node.ID,
						toolCallID:   toolCallID,
						toolName:     toolName,
						targetAgent:  target,
						taskBrief:    truncateSwarmPreviewString(brief, 600),
						startedAt:    ts,
					}
					pendingByToolCall[toolCallID] = pd
					if target != "" {
						pendingByAgent[target] = append(pendingByAgent[target], pd)
					}
					node.CurrentActivity = fmt.Sprintf("委派 %s: %s", swarmFirstNonEmpty(target, "子代理"), truncateSwarmText(brief, 80))
				}

				ev := SwarmNodeEvent{
					ID:              swarmEventID(d, msgID, i),
					ProcessDetailID: d.ID,
					EventType:       "tool_call",
					Title:           toolName,
					Summary:         summarizeSwarmToolArgs(toolName, args),
					ToolName:        toolName,
					ToolCallID:      toolCallID,
					Status:          "running",
					CreatedAt:       ts,
				}
				appendNodeEvent(node, ev)
				if toolCallID != "" {
					activeTools[toolCallID] = activeToolState{
						nodeID:   node.ID,
						toolName: toolName,
						eventIdx: len(node.Events) - 1,
					}
				}
				if toolName == "task" || toolName == "transfer_to_agent" || toolName == "record_vulnerability" || toolName == "upsert_project_fact" || node.ToolCount == 1 || node.ToolCount%10 == 0 {
					appendFeed(SwarmFeedEvent{
						ID:          ev.ID,
						NodeID:      node.ID,
						AgentName:   node.AgentName,
						DisplayName: node.DisplayName,
						EventType:   "tool_call",
						Title:       fmt.Sprintf("%s · #%d %s", node.DisplayName, node.ToolCount, toolName),
						Summary:     ev.Summary,
						Status:      "running",
						CreatedAt:   ts,
					})
				}

			case "tool_result":
				toolName := swarmStr(data["toolName"])
				toolCallID := swarmStr(data["toolCallId"])
				execID := swarmStr(data["executionId"])
				isErr := swarmBool(data["isError"]) || swarmBool(data["modelFacingIsError"])
				if succ, hasSucc := data["success"].(bool); hasSucc && !succ {
					isErr = true
				}
				resStatus := "completed"
				if isErr {
					resStatus = "failed"
				}
				if st := strings.ToLower(swarmStr(data["status"])); st == "blocked" {
					resStatus = "failed"
				}

				if st, ok := activeTools[toolCallID]; ok && st.nodeID == node.ID {
					if node.RunningToolCount > 0 {
						node.RunningToolCount--
					}
					if resStatus == "failed" {
						node.FailedToolCount++
					}
					if st.eventIdx >= 0 && st.eventIdx < len(node.Events) && node.Events[st.eventIdx].ToolCallID == toolCallID {
						node.Events[st.eventIdx].Status = resStatus
						if execID != "" {
							node.Events[st.eventIdx].ExecutionID = execID
						}
					}
					delete(activeTools, toolCallID)
				} else if resStatus == "failed" {
					node.FailedToolCount++
				}

				if node.CurrentTool == toolName {
					node.CurrentTool = ""
				}
				preview := truncateSwarmText(swarmFirstNonEmpty(swarmStr(data["resultPreview"]), swarmStr(data["result"]), d.Message), 160)
				if preview != "" {
					node.CurrentActivity = fmt.Sprintf("%s %s: %s", toolName, swarmStatusText(resStatus), preview)
				}

				appendNodeEvent(node, SwarmNodeEvent{
					ID:              swarmEventID(d, msgID, i),
					ProcessDetailID: d.ID,
					EventType:       "tool_result",
					Title:           toolName,
					Summary:         preview,
					ToolName:        toolName,
					ToolCallID:      toolCallID,
					ExecutionID:     execID,
					Status:          resStatus,
					CreatedAt:       ts,
				})

				// 若为旧历史数据（没有 swarm_agent_end），当委派工具收到结果时补齐对应子代理与边状态。
				if pd, ok := pendingByToolCall[toolCallID]; ok && (toolName == "task" || toolName == "transfer_to_agent") {
					for _, cand := range nodes {
						if cand.ParentToolCallID == toolCallID && cand.Status == "running" {
							cand.Status = resStatus
							ended := ts
							cand.EndedAt = &ended
							if !cand.StartedAt.IsZero() && ended.After(cand.StartedAt) {
								cand.DurationMs = ended.Sub(cand.StartedAt).Milliseconds()
							}
							if cand.ResultPreview == "" {
								cand.ResultPreview = preview
							}
							if e := ensureEdge(pd.parentNodeID, cand.ID, toolCallID, toolName, toolName, resStatus); e != nil {
								e.DurationMs = cand.DurationMs
							}
						}
					}
					delete(pendingByToolCall, toolCallID)
				}

			case "agent_usage_summary":
				node.TokenUsage.Model = swarmFirstNonEmpty(swarmStr(data["model"]), node.TokenUsage.Model)
				node.TokenUsage.ModelCalls += swarmInt(data["modelCalls"])
				node.TokenUsage.PromptTokens += swarmInt(data["promptTokens"])
				node.TokenUsage.CompletionTokens += swarmInt(data["completionTokens"])
				node.TokenUsage.TotalTokens += swarmInt(data["totalTokens"])
				node.TokenUsage.CachedTokens += swarmInt(data["cachedTokens"])
				node.TokenUsage.CacheWriteTokens += swarmInt(data["cacheWriteTokens"])
				node.TokenUsage.ReasoningTokens += swarmInt(data["reasoningTokens"])
				if node.IterationCount < node.TokenUsage.ModelCalls {
					node.IterationCount = node.TokenUsage.ModelCalls
				}

			case "agent_reply":
				node.ResultPreview = truncateSwarmText(d.Message, 600)
				node.CurrentActivity = truncateSwarmText(d.Message, 140)
				ended := ts
				node.EndedAt = &ended
				if node.DurationMs == 0 && !node.StartedAt.IsZero() && ended.After(node.StartedAt) {
					node.DurationMs = ended.Sub(node.StartedAt).Milliseconds()
				}
				if node.Status == "running" {
					node.Status = "completed"
				}
				if node.ParentID != "" {
					if e := ensureEdge(node.ParentID, node.ID, node.ParentToolCallID, node.DelegationTool, node.DelegationTool, node.Status); e != nil && e.DurationMs == 0 {
						e.DurationMs = node.DurationMs
					}
				}
				appendNodeEvent(node, SwarmNodeEvent{
					ID:              swarmEventID(d, msgID, i),
					ProcessDetailID: d.ID,
					EventType:       "agent_reply",
					Title:           "子代理回报",
					Summary:         truncateSwarmText(d.Message, 240),
					Status:          "completed",
					CreatedAt:       ts,
				})
				appendFeed(SwarmFeedEvent{
					ID:          swarmEventID(d, msgID, i),
					NodeID:      node.ID,
					AgentName:   node.AgentName,
					DisplayName: node.DisplayName,
					EventType:   "agent_reply",
					Title:       fmt.Sprintf("%s 返回分析结论", node.DisplayName),
					Summary:     truncateSwarmText(d.Message, 180),
					Status:      node.Status,
					CreatedAt:   ts,
				})
			}
		}
	}

	// 若当前会话未处于实时运行中，则不允许任何节点或工具停留在 stale "running" 状态。
	now := time.Now()
	if !running {
		fallbackTerm := "completed"
		if lastMsgID != "" && turnTerminalStatus[lastMsgID] != "" {
			fallbackTerm = turnTerminalStatus[lastMsgID]
		}
		for _, n := range nodes {
			if n.Status == "running" {
				if n.ResultPreview != "" || n.FailedToolCount == 0 && fallbackTerm == "completed" {
					n.Status = "completed"
				} else {
					n.Status = fallbackTerm
				}
			}
			if n.EndedAt == nil && n.Status != "running" {
				endTs := n.StartedAt
				if len(n.Events) > 0 {
					lastTs := n.Events[len(n.Events)-1].CreatedAt
					if lastTs.After(endTs) {
						endTs = lastTs
					}
				} else if conv != nil && conv.UpdatedAt.After(endTs) {
					endTs = conv.UpdatedAt
				}
				if !endTs.IsZero() {
					n.EndedAt = &endTs
				}
			}
			if n.DurationMs == 0 && !n.StartedAt.IsZero() && n.EndedAt != nil && n.EndedAt.After(n.StartedAt) {
				n.DurationMs = n.EndedAt.Sub(n.StartedAt).Milliseconds()
			}
			n.CurrentTool = ""
			if n.RunningToolCount > 0 {
				n.RunningToolCount = 0
			}
			for j := range n.Events {
				if n.Events[j].Status == "running" {
					n.Events[j].Status = n.Status
				}
			}
		}
		for _, e := range edges {
			if e.Status == "running" {
				if idx, ok := nodeIdxByID[e.Target]; ok {
					e.Status = nodes[idx].Status
					if e.DurationMs == 0 {
						e.DurationMs = nodes[idx].DurationMs
					}
				} else {
					e.Status = fallbackTerm
				}
			}
		}
	} else {
		for _, n := range nodes {
			if n.Status == "running" && n.DurationMs == 0 && !n.StartedAt.IsZero() {
				n.DurationMs = now.Sub(n.StartedAt).Milliseconds()
			}
		}
	}

	// 计算全局起始时间和汇总指标。
	var earliest time.Time
	summary := SwarmSummary{TotalNodes: len(nodes)}
	out.Nodes = make([]SwarmNode, 0, len(nodes))
	for _, n := range nodes {
		if !n.StartedAt.IsZero() && (earliest.IsZero() || n.StartedAt.Before(earliest)) {
			earliest = n.StartedAt
		}
		switch n.Status {
		case "running":
			summary.RunningNodes++
		case "completed":
			summary.CompletedNodes++
		case "cancelled":
			summary.CancelledNodes++
		default:
			summary.FailedNodes++
		}
		summary.TotalTools += n.ToolCount
		summary.RunningTools += n.RunningToolCount
		summary.FailedTools += n.FailedToolCount
		summary.TotalTokens += n.TokenUsage.TotalTokens
		summary.PromptTokens += n.TokenUsage.PromptTokens
		summary.CompletionTokens += n.TokenUsage.CompletionTokens
		summary.CachedTokens += n.TokenUsage.CachedTokens
		summary.ReasoningTokens += n.TokenUsage.ReasoningTokens
		summary.TotalModelCalls += n.TokenUsage.ModelCalls
		out.Nodes = append(out.Nodes, *n)
	}
	if out.StartedAt == nil && !earliest.IsZero() {
		out.StartedAt = &earliest
	}

	out.Summary = summary
	out.Edges = make([]SwarmEdge, 0, len(edges))
	for _, e := range edges {
		out.Edges = append(out.Edges, *e)
	}
	out.Feed = feed
	return out
}

func parseProcessDetailDataMap(raw string) map[string]interface{} {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return map[string]interface{}{}
	}
	var m map[string]interface{}
	if err := json.Unmarshal([]byte(raw), &m); err != nil || m == nil {
		return map[string]interface{}{}
	}
	return m
}

func parseSwarmToolArgs(data map[string]interface{}) map[string]interface{} {
	if m, ok := data["argumentsObj"].(map[string]interface{}); ok && m != nil {
		return m
	}
	if m, ok := data["arguments"].(map[string]interface{}); ok && m != nil {
		return m
	}
	if raw, ok := data["arguments"].(string); ok && strings.TrimSpace(raw) != "" {
		var m map[string]interface{}
		if json.Unmarshal([]byte(raw), &m) == nil && m != nil {
			return m
		}
	}
	return map[string]interface{}{}
}

func summarizeSwarmToolArgs(toolName string, args map[string]interface{}) string {
	if len(args) == 0 {
		return ""
	}
	for _, key := range []string{"description", "command", "cmd", "url", "target", "path", "query", "subagent_type", "agent_name"} {
		if s := swarmStr(args[key]); s != "" {
			return truncateSwarmText(s, 140)
		}
	}
	b, err := json.Marshal(args)
	if err != nil {
		return ""
	}
	return truncateSwarmText(string(b), 120)
}

func normalizeSwarmEventType(t string) string {
	t = strings.TrimSpace(t)
	t = strings.ReplaceAll(t, "eino_agent_reply", "agent_reply")
	if strings.HasPrefix(t, "eino_") {
		t = "agent_" + strings.TrimPrefix(t, "eino_")
	}
	return t
}

func normalizeSwarmStatus(status string) string {
	s := strings.ToLower(strings.TrimSpace(status))
	switch s {
	case "completed", "done", "success":
		return "completed"
	case "cancelled", "canceled":
		return "cancelled"
	case "blocked":
		return "blocked"
	case "running", "in_progress":
		return "running"
	case "failed", "error", "timeout":
		return "failed"
	default:
		if s != "" {
			return s
		}
		return "completed"
	}
}

func swarmStatusText(status string) string {
	switch status {
	case "running":
		return "执行中"
	case "completed":
		return "已完成"
	case "cancelled":
		return "已取消"
	case "blocked":
		return "受阻"
	default:
		return "失败"
	}
}

func swarmStr(v interface{}) string {
	if v == nil {
		return ""
	}
	s, ok := v.(string)
	if ok {
		return strings.TrimSpace(s)
	}
	out := strings.TrimSpace(fmt.Sprint(v))
	if out == "<nil>" {
		return ""
	}
	return out
}

func swarmInt(v interface{}) int {
	switch x := v.(type) {
	case int:
		return x
	case int32:
		return int(x)
	case int64:
		return int(x)
	case float64:
		return int(x)
	case float32:
		return int(x)
	default:
		return 0
	}
}

func swarmInt64(v interface{}) int64 {
	switch x := v.(type) {
	case int:
		return int64(x)
	case int32:
		return int64(x)
	case int64:
		return x
	case float64:
		return int64(x)
	case float32:
		return int64(x)
	default:
		return 0
	}
}

func swarmBool(v interface{}) bool {
	b, ok := v.(bool)
	return ok && b
}

func swarmEventID(d database.ProcessDetail, msgID string, idx int) string {
	if strings.TrimSpace(d.ID) != "" {
		return d.ID
	}
	return fmt.Sprintf("swarm-ev-%s-%d", msgID, idx)
}

func sanitizeSwarmID(s string) string {
	s = strings.TrimSpace(s)
	if s == "" {
		return "agent"
	}
	var b strings.Builder
	for _, r := range s {
		if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == '-' || r == '_' {
			b.WriteRune(r)
		} else {
			b.WriteByte('_')
		}
	}
	return b.String()
}

func truncateSwarmText(s string, maxRunes int) string {
	s = strings.Join(strings.Fields(strings.TrimSpace(s)), " ")
	if maxRunes <= 0 || s == "" {
		return s
	}
	runes := []rune(s)
	if len(runes) <= maxRunes {
		return s
	}
	return string(runes[:maxRunes]) + "…"
}

func truncateSwarmPreviewString(s string, maxRunes int) string {
	s = strings.TrimSpace(s)
	if maxRunes <= 0 || s == "" {
		return s
	}
	runes := []rune(s)
	if len(runes) <= maxRunes {
		return s
	}
	return string(runes[:maxRunes]) + "…"
}

func swarmFirstNonEmpty(vals ...string) string {
	for _, v := range vals {
		if strings.TrimSpace(v) != "" {
			return strings.TrimSpace(v)
		}
	}
	return ""
}

func maxInt(a, b int) int {
	if a > b {
		return a
	}
	return b
}
