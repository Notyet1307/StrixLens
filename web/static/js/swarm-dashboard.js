/**
 * SI-Lens 多代理蜂群（Swarm）可视化看板
 * - 支持纯状态推导函数导出（Node CJS tests）与浏览器端实时渲染
 * - 入口 1：对话页顶部 Swarm 状态条 + 宽抽屉 (#swarm-dashboard-modal)
 * - 入口 2：独立页面「智能体 → 蜂群看板」(#page-agents-swarm)
 */
(function (root, factory) {
    const api = factory(root);
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
    'use strict';

    const NODE_W = 248;
    const NODE_H = 122;
    const GAP_X = 34;
    const GAP_Y = 72;
    const PAD_X = 28;
    const PAD_Y = 28;
    const MAX_PER_ROW = 3;
    const MAX_NODE_EVENTS = 120;
    const MAX_FEED_EVENTS = 160;

    function tr(key, fallback, params) {
        if (root && typeof root.t === 'function') {
            const val = root.t(key, params || {});
            if (val && val !== key) return val;
        }
        let s = String(fallback || key);
        if (params && typeof params === 'object') {
            Object.keys(params).forEach(function (k) {
                s = s.split('{{' + k + '}}').join(String(params[k]));
            });
        }
        return s;
    }

    function escapeHtml(text) {
        return String(text == null ? '' : text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function escapeXml(text) {
        return escapeHtml(text);
    }

    function truncateText(text, maxLen) {
        const clean = String(text == null ? '' : text).replace(/\s+/g, ' ').trim();
        if (!maxLen || clean.length <= maxLen) return clean;
        return clean.slice(0, maxLen) + '…';
    }

    function formatDurationMs(ms) {
        const n = Number(ms);
        if (!Number.isFinite(n) || n <= 0) return '0s';
        if (n < 1000) return Math.round(n) + 'ms';
        const sec = Math.floor(n / 1000);
        if (sec < 60) return sec + 's';
        const min = Math.floor(sec / 60);
        const remSec = sec % 60;
        if (min < 60) return min + 'm ' + remSec + 's';
        const hr = Math.floor(min / 60);
        return hr + 'h ' + (min % 60) + 'm';
    }

    function formatCompactTokens(n) {
        const v = Number(n);
        if (!Number.isFinite(v) || v <= 0) return '0';
        if (v >= 1000000) return (v / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (v >= 1000) return (v / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return String(Math.round(v));
    }

    function formatTimeShort(value) {
        if (!value) return '';
        const d = value instanceof Date ? value : new Date(value);
        if (isNaN(d.getTime())) return '';
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');
        return hh + ':' + mm + ':' + ss;
    }

    function normalizeStatus(status) {
        const s = String(status || '').trim().toLowerCase();
        if (s === 'completed' || s === 'done' || s === 'success') return 'completed';
        if (s === 'cancelled' || s === 'canceled') return 'cancelled';
        if (s === 'blocked') return 'blocked';
        if (s === 'running' || s === 'in_progress') return 'running';
        if (s === 'failed' || s === 'error' || s === 'timeout') return 'failed';
        return s || 'completed';
    }

    function statusLabel(status) {
        const norm = normalizeStatus(status);
        switch (norm) {
            case 'running': return tr('swarm.statusRunning', '执行中');
            case 'completed': return tr('swarm.statusCompleted', '已完成');
            case 'cancelled': return tr('swarm.statusCancelled', '已取消');
            case 'blocked': return tr('swarm.statusBlocked', '受阻');
            default: return tr('swarm.statusFailed', '失败');
        }
    }

    function normalizeEventType(t) {
        let s = String(t || '').trim();
        s = s.replace(/^eino_agent_reply/, 'agent_reply').replace(/^eino_/, 'agent_');
        return s;
    }

    function toMs(ts, fallbackMs) {
        if (!ts) return fallbackMs || Date.now();
        if (typeof ts === 'number' && Number.isFinite(ts)) return ts;
        const t = new Date(ts).getTime();
        return Number.isFinite(t) ? t : (fallbackMs || Date.now());
    }

    function summarizeToolArgs(args) {
        if (!args || typeof args !== 'object') {
            return typeof args === 'string' ? truncateText(args, 140) : '';
        }
        const preferred = ['description', 'command', 'cmd', 'url', 'target', 'path', 'query', 'subagent_type', 'agent_name'];
        for (let i = 0; i < preferred.length; i++) {
            const val = args[preferred[i]];
            if (typeof val === 'string' && val.trim()) {
                return truncateText(val, 140);
            }
        }
        try {
            return truncateText(JSON.stringify(args), 120);
        } catch (err) {
            return '';
        }
    }

    function parseToolArgsObj(data) {
        if (!data || typeof data !== 'object') return {};
        if (data.argumentsObj && typeof data.argumentsObj === 'object') return data.argumentsObj;
        if (data.arguments && typeof data.arguments === 'object') return data.arguments;
        if (typeof data.arguments === 'string' && data.arguments.trim()) {
            try {
                const parsed = JSON.parse(data.arguments);
                if (parsed && typeof parsed === 'object') return parsed;
            } catch (err) {
                return { raw: data.arguments };
            }
        }
        return {};
    }

    function createSwarmState(conversationId, initialMeta) {
        const meta = initialMeta || {};
        return {
            conversationId: String(conversationId || ''),
            title: String(meta.title || ''),
            orchestration: String(meta.orchestration || 'deep'),
            running: !!meta.running,
            startedAt: meta.startedAt || null,
            updatedAt: meta.updatedAt || null,
            nodes: [],
            edges: [],
            feed: [],
            summary: {
                totalNodes: 0,
                runningNodes: 0,
                completedNodes: 0,
                failedNodes: 0,
                cancelledNodes: 0,
                totalTools: 0,
                runningTools: 0,
                failedTools: 0,
                totalTokens: 0,
                promptTokens: 0,
                completionTokens: 0,
                cachedTokens: 0,
                reasoningTokens: 0,
                totalModelCalls: 0
            },
            _nodeMap: new Map(),
            _edgeMap: new Map(),
            _activeTools: new Map(),
            _pendingByToolCall: new Map(),
            _pendingByAgent: new Map(),
            _legacyRootId: '',
            _legacySubMap: new Map(),
            _seq: 0
        };
    }

    function recomputeSwarmSummary(state) {
        const summary = {
            totalNodes: state.nodes.length,
            runningNodes: 0,
            completedNodes: 0,
            failedNodes: 0,
            cancelledNodes: 0,
            totalTools: 0,
            runningTools: 0,
            failedTools: 0,
            totalTokens: 0,
            promptTokens: 0,
            completionTokens: 0,
            cachedTokens: 0,
            reasoningTokens: 0,
            totalModelCalls: 0
        };
        let earliest = null;
        for (let i = 0; i < state.nodes.length; i++) {
            const n = state.nodes[i];
            if (n.startedAt) {
                const ms = toMs(n.startedAt);
                if (earliest === null || ms < earliest) earliest = ms;
            }
            if (n.status === 'running') summary.runningNodes++;
            else if (n.status === 'completed') summary.completedNodes++;
            else if (n.status === 'cancelled') summary.cancelledNodes++;
            else summary.failedNodes++;

            summary.totalTools += Number(n.toolCount || 0);
            summary.runningTools += Number(n.runningToolCount || 0);
            summary.failedTools += Number(n.failedToolCount || 0);
            const tu = n.tokenUsage || {};
            summary.totalTokens += Number(tu.totalTokens || 0);
            summary.promptTokens += Number(tu.promptTokens || 0);
            summary.completionTokens += Number(tu.completionTokens || 0);
            summary.cachedTokens += Number(tu.cachedTokens || 0);
            summary.reasoningTokens += Number(tu.reasoningTokens || 0);
            summary.totalModelCalls += Number(tu.modelCalls || 0);
        }
        if (!state.startedAt && earliest !== null) {
            state.startedAt = new Date(earliest).toISOString();
        }
        state.summary = summary;
        return summary;
    }

    function ensureStateNode(state, spec) {
        const id = String(spec.id || '').trim();
        if (!id) return null;
        let node = state._nodeMap.get(id);
        if (node) {
            if (spec.parentId && !node.parentId) node.parentId = spec.parentId;
            if (spec.parentToolCallId && !node.parentToolCallId) node.parentToolCallId = spec.parentToolCallId;
            if (spec.displayName && (!node.displayName || node.displayName === node.agentName)) {
                node.displayName = spec.displayName;
            }
            if (spec.delegationTool && !node.delegationTool) node.delegationTool = spec.delegationTool;
            if (spec.taskBrief && !node.taskBrief) node.taskBrief = spec.taskBrief;
            if (spec.startedAt && !node.startedAt) node.startedAt = spec.startedAt;
            return node;
        }
        const role = spec.role === 'subagent' || spec.role === 'sub' ? 'subagent' : 'orchestrator';
        node = {
            id: id,
            parentId: spec.parentId || '',
            parentToolCallId: spec.parentToolCallId || '',
            agentName: spec.agentName || (role === 'orchestrator' ? 'main' : id),
            displayName: spec.displayName || spec.agentName || (role === 'orchestrator' ? tr('swarm.orchestratorDefault', '协调主代理') : id),
            role: role,
            delegationTool: spec.delegationTool || '',
            status: normalizeStatus(spec.status || 'running'),
            taskBrief: spec.taskBrief || '',
            resultPreview: spec.resultPreview || '',
            currentActivity: spec.currentActivity || '',
            currentTool: spec.currentTool || '',
            startedAt: spec.startedAt || new Date().toISOString(),
            endedAt: spec.endedAt || null,
            durationMs: Number(spec.durationMs || 0),
            toolCount: Number(spec.toolCount || 0),
            runningToolCount: Number(spec.runningToolCount || 0),
            failedToolCount: Number(spec.failedToolCount || 0),
            iterationCount: Number(spec.iterationCount || 0),
            tokenUsage: Object.assign({
                model: '',
                modelCalls: 0,
                promptTokens: 0,
                completionTokens: 0,
                totalTokens: 0,
                cachedTokens: 0,
                cacheWriteTokens: 0,
                reasoningTokens: 0
            }, spec.tokenUsage || {}),
            events: Array.isArray(spec.events) ? spec.events.slice(-MAX_NODE_EVENTS) : []
        };
        state._nodeMap.set(id, node);
        state.nodes.push(node);
        return node;
    }

    function ensureStateEdge(state, source, target, toolCallId, label, kind, status, durationMs) {
        if (!source || !target || source === target) return null;
        const key = source + '->' + target + (toolCallId ? ('::' + toolCallId) : '');
        let edge = state._edgeMap.get(key);
        if (edge) {
            if (status) edge.status = normalizeStatus(status);
            if (label && !edge.label) edge.label = label;
            if (durationMs && durationMs > 0) edge.durationMs = durationMs;
            return edge;
        }
        edge = {
            id: 'edge-' + (state.edges.length + 1),
            source: source,
            target: target,
            toolCallId: toolCallId || '',
            label: label || kind || 'task',
            kind: kind || label || 'task',
            status: normalizeStatus(status || 'running'),
            durationMs: Number(durationMs || 0)
        };
        state._edgeMap.set(key, edge);
        state.edges.push(edge);
        return edge;
    }

    function pushNodeEvent(node, ev) {
        node.events.push(ev);
        if (node.events.length > MAX_NODE_EVENTS) {
            node.events = node.events.slice(-MAX_NODE_EVENTS);
        }
    }

    function pushFeedEvent(state, ev) {
        state.feed.push(ev);
        if (state.feed.length > MAX_FEED_EVENTS) {
            state.feed = state.feed.slice(-MAX_FEED_EVENTS);
        }
    }

    function hydrateSwarmSnapshot(state, snapshot) {
        const snap = snapshot && typeof snapshot === 'object' ? snapshot : {};
        const next = createSwarmState(snap.conversationId || state.conversationId, {
            title: snap.title || state.title,
            orchestration: snap.orchestration || state.orchestration,
            running: !!snap.running,
            startedAt: snap.startedAt || null,
            updatedAt: snap.updatedAt || new Date().toISOString()
        });
        const snapNodes = Array.isArray(snap.nodes) ? snap.nodes : [];
        for (let i = 0; i < snapNodes.length; i++) {
            const rawNode = snapNodes[i] || {};
            const n = ensureStateNode(next, rawNode);
            if (n && n.role === 'orchestrator') {
                next._legacyRootId = n.id;
            }
        }
        const snapEdges = Array.isArray(snap.edges) ? snap.edges : [];
        for (let i = 0; i < snapEdges.length; i++) {
            const e = snapEdges[i] || {};
            ensureStateEdge(next, e.source, e.target, e.toolCallId, e.label, e.kind, e.status, e.durationMs);
        }
        const snapFeed = Array.isArray(snap.feed) ? snap.feed : [];
        for (let i = 0; i < snapFeed.length; i++) {
            pushFeedEvent(next, snapFeed[i]);
        }
        recomputeSwarmSummary(next);
        return next;
    }

    function settleSwarmNodes(state, terminalStatus) {
        const term = normalizeStatus(terminalStatus || 'completed');
        state.running = false;
        const nowIso = new Date().toISOString();
        for (let i = 0; i < state.nodes.length; i++) {
            const n = state.nodes[i];
            if (n.status === 'running') {
                n.status = n.resultPreview ? 'completed' : term;
                if (!n.endedAt) n.endedAt = nowIso;
                if (!n.durationMs && n.startedAt) {
                    n.durationMs = Math.max(0, Date.now() - toMs(n.startedAt));
                }
            }
            n.currentTool = '';
            n.runningToolCount = 0;
            for (let j = 0; j < n.events.length; j++) {
                if (n.events[j].status === 'running') {
                    n.events[j].status = n.status;
                }
            }
        }
        for (let i = 0; i < state.edges.length; i++) {
            if (state.edges[i].status === 'running') {
                const targetNode = state._nodeMap.get(state.edges[i].target);
                state.edges[i].status = targetNode ? targetNode.status : term;
            }
        }
    }

    function applySwarmStreamEvent(state, rawEvent, nowMs) {
        if (!state || !rawEvent || typeof rawEvent !== 'object') return false;
        const evType = normalizeEventType(rawEvent.type || rawEvent.eventType);
        const data = rawEvent.data && typeof rawEvent.data === 'object' ? rawEvent.data : {};
        const msg = rawEvent.message != null ? String(rawEvent.message) : '';
        const now = typeof nowMs === 'number' && Number.isFinite(nowMs) ? nowMs : Date.now();
        const nowIso = new Date(now).toISOString();

        if (!evType || evType === 'heartbeat' || evType === 'message_saved') {
            return false;
        }
        if (evType === 'conversation') {
            if (data.conversationId) {
                state.conversationId = String(data.conversationId);
            }
            return true;
        }
        if (data.orchestration) {
            state.orchestration = String(data.orchestration);
        }

        if (evType === 'cancelled' || evType === 'timeout' || evType === 'error') {
            settleSwarmNodes(state, evType === 'cancelled' ? 'cancelled' : 'failed');
            pushFeedEvent(state, {
                id: 'feed-' + (++state._seq),
                nodeId: state._legacyRootId || '',
                agentName: 'main',
                displayName: tr('swarm.orchestratorDefault', '协调主代理'),
                eventType: evType,
                title: msg || statusLabel(evType),
                summary: '',
                status: evType === 'cancelled' ? 'cancelled' : 'failed',
                createdAt: nowIso
            });
            recomputeSwarmSummary(state);
            state.updatedAt = nowIso;
            return true;
        }

        if (evType === 'done' || evType === 'response') {
            settleSwarmNodes(state, 'completed');
            recomputeSwarmSummary(state);
            state.updatedAt = nowIso;
            return true;
        }

        const roleRaw = String(data.agentRole || '').trim().toLowerCase();
        const agentName = String(data.agentName || '').trim();
        const displayName = String(data.agentDisplayName || '').trim();
        let runId = String(data.runId || data.childRunId || '').trim();
        let parentRunId = String(data.parentRunId || '').trim();
        let parentToolCallId = String(data.parentToolCallId || '').trim();
        const isSub = roleRaw === 'subagent' || roleRaw === 'sub' || !!parentRunId || !!parentToolCallId;

        if (evType === 'swarm_agent_start') {
            state.running = true;
            if (!runId) runId = 'live-' + (++state._seq);
            const role = isSub ? 'subagent' : 'orchestrator';
            if (!isSub) {
                state._legacyRootId = runId;
            } else {
                if (!parentRunId) parentRunId = state._legacyRootId;
                if (agentName) state._legacySubMap.set(agentName, runId);
            }
            const pd = parentToolCallId ? state._pendingByToolCall.get(parentToolCallId) : null;
            const node = ensureStateNode(state, {
                id: runId,
                parentId: parentRunId || (pd ? pd.parentNodeId : ''),
                parentToolCallId: parentToolCallId,
                agentName: agentName || (role === 'orchestrator' ? 'main' : runId),
                displayName: displayName || agentName || (role === 'orchestrator' ? tr('swarm.orchestratorDefault', '协调主代理') : runId),
                role: role,
                delegationTool: String(data.delegationTool || (pd ? pd.toolName : '') || ''),
                status: 'running',
                taskBrief: String(data.taskBrief || (pd ? pd.taskBrief : '') || ''),
                currentActivity: tr('swarm.activityStarted', '已启动任务…'),
                startedAt: nowIso
            });
            if (node && node.parentId) {
                const lbl = node.delegationTool || 'task';
                ensureStateEdge(state, node.parentId, node.id, node.parentToolCallId, lbl, lbl, 'running', 0);
            }
            if (node) {
                pushFeedEvent(state, {
                    id: 'feed-' + (++state._seq),
                    nodeId: node.id,
                    agentName: node.agentName,
                    displayName: node.displayName,
                    eventType: 'swarm_agent_start',
                    title: node.displayName + ' ' + tr('swarm.feedStarted', '启动执行'),
                    summary: truncateText(node.taskBrief, 160),
                    status: 'running',
                    createdAt: nowIso
                });
            }
            recomputeSwarmSummary(state);
            state.updatedAt = nowIso;
            return true;
        }

        if (evType === 'swarm_agent_end') {
            let targetId = runId;
            if (!targetId && isSub && agentName) targetId = state._legacySubMap.get(agentName) || '';
            if (!targetId) targetId = state._legacyRootId;
            if (!targetId) return false;
            const node = ensureStateNode(state, {
                id: targetId,
                parentId: parentRunId,
                parentToolCallId: parentToolCallId,
                agentName: agentName,
                displayName: displayName,
                role: isSub ? 'subagent' : 'orchestrator',
                delegationTool: String(data.delegationTool || ''),
                startedAt: nowIso
            });
            const endStatus = normalizeStatus(data.status || (data.error ? 'failed' : 'completed'));
            node.status = endStatus;
            node.endedAt = nowIso;
            node.currentTool = '';
            node.runningToolCount = 0;
            const dMs = Number(data.durationMs || 0);
            node.durationMs = dMs > 0 ? dMs : Math.max(0, now - toMs(node.startedAt, now));
            if (data.resultPreview) node.resultPreview = String(data.resultPreview);
            if (data.error) node.currentActivity = String(data.error);
            else if (node.resultPreview) node.currentActivity = truncateText(node.resultPreview, 120);
            if (node.parentId) {
                ensureStateEdge(state, node.parentId, node.id, node.parentToolCallId, node.delegationTool || 'task', node.delegationTool || 'task', endStatus, node.durationMs);
            }
            if (node.parentToolCallId) state._pendingByToolCall.delete(node.parentToolCallId);
            pushFeedEvent(state, {
                id: 'feed-' + (++state._seq),
                nodeId: node.id,
                agentName: node.agentName,
                displayName: node.displayName,
                eventType: 'swarm_agent_end',
                title: node.displayName + ' ' + statusLabel(endStatus),
                summary: truncateText(data.error || node.resultPreview || '', 160),
                status: endStatus,
                createdAt: nowIso
            });
            recomputeSwarmSummary(state);
            state.updatedAt = nowIso;
            return true;
        }

        // 只关注与蜂群节点直接相关的运行期事件
        const relevant = [
            'iteration', 'planning', 'response_start', 'response_delta',
            'thinking', 'thinking_stream_start', 'reasoning_chain', 'reasoning_chain_stream_start',
            'tool_call', 'tool_result', 'agent_usage_summary', 'agent_reply', 'agent_reply_stream_end'
        ].includes(evType);
        if (!relevant) return false;

        if (!runId) {
            if (!isSub) {
                runId = state._legacyRootId || 'live-main';
                state._legacyRootId = runId;
            } else {
                const known = agentName ? state._legacySubMap.get(agentName) : '';
                if (known) {
                    runId = known;
                } else {
                    runId = 'live-sub-' + (agentName || (++state._seq));
                    if (agentName) state._legacySubMap.set(agentName, runId);
                    const q = agentName ? state._pendingByAgent.get(agentName) : null;
                    if (q && q.length) {
                        const pd = q.shift();
                        parentRunId = pd.parentNodeId;
                        parentToolCallId = pd.toolCallId;
                    }
                }
                if (!parentRunId) parentRunId = state._legacyRootId;
            }
        } else if (!isSub && !state._legacyRootId) {
            state._legacyRootId = runId;
        }

        if (isSub && !parentRunId) {
            if (parentToolCallId && state._pendingByToolCall.has(parentToolCallId)) {
                parentRunId = state._pendingByToolCall.get(parentToolCallId).parentNodeId;
            } else {
                parentRunId = state._legacyRootId;
            }
        }

        const matchedPd = parentToolCallId ? state._pendingByToolCall.get(parentToolCallId) : null;
        const node = ensureStateNode(state, {
            id: runId,
            parentId: parentRunId,
            parentToolCallId: parentToolCallId,
            agentName: agentName || (isSub ? runId : 'main'),
            displayName: displayName || agentName || (isSub ? runId : tr('swarm.orchestratorDefault', '协调主代理')),
            role: isSub ? 'subagent' : 'orchestrator',
            delegationTool: matchedPd ? matchedPd.toolName : '',
            taskBrief: matchedPd ? matchedPd.taskBrief : '',
            status: 'running',
            startedAt: nowIso
        });
        if (!node) return false;
        state.running = true;
        if (isSub && node.parentId) {
            ensureStateEdge(state, node.parentId, node.id, node.parentToolCallId, node.delegationTool || 'task', node.delegationTool || 'task', node.status, 0);
        }

        if (evType === 'iteration') {
            const n = Number(data.iteration || 0);
            if (n > node.iterationCount) node.iterationCount = n;
            else if (n === 0) node.iterationCount++;
            node.currentActivity = tr('swarm.iterLabel', '第 {{n}} 轮推理', { n: node.iterationCount });
        } else if (evType === 'response_start' || evType === 'planning' || evType === 'response_delta') {
            const it = Number(data.iteration || 0);
            if (it > node.iterationCount) node.iterationCount = it;
            const preview = data.accumulated ? String(data.accumulated) : msg;
            if (preview && preview.trim()) {
                node.currentActivity = truncateText(preview, 110);
            } else if (!node.currentActivity) {
                node.currentActivity = tr('swarm.planningActivity', '规划决策中…');
            }
        } else if (evType === 'thinking' || evType === 'thinking_stream_start' || evType === 'reasoning_chain' || evType === 'reasoning_chain_stream_start') {
            const it = Number(data.iteration || 0);
            if (it > node.iterationCount) node.iterationCount = it;
            if (!node.currentTool) {
                node.currentActivity = tr('swarm.thinkingActivity', '深度推理分析中…');
            }
        } else if (evType === 'tool_call') {
            const toolName = String(data.toolName || 'tool');
            const toolCallId = String(data.toolCallId || ('tc-' + (++state._seq)));
            const args = parseToolArgsObj(data);
            const it = Number(data.iteration || 0);
            if (it > node.iterationCount) node.iterationCount = it;
            node.toolCount++;
            node.runningToolCount++;
            node.currentTool = toolName;
            const argSummary = summarizeToolArgs(args);
            node.currentActivity = toolName + (argSummary ? (': ' + truncateText(argSummary, 70)) : '');

            if (toolName === 'task' || toolName === 'transfer_to_agent') {
                const target = String(args.subagent_type || args.agent_name || args.agentName || '').trim();
                const brief = String(args.description || args.task || '').trim();
                const pd = {
                    parentNodeId: node.id,
                    toolCallId: toolCallId,
                    toolName: toolName,
                    targetAgent: target,
                    taskBrief: truncateText(brief, 600)
                };
                state._pendingByToolCall.set(toolCallId, pd);
                if (target) {
                    const list = state._pendingByAgent.get(target) || [];
                    list.push(pd);
                    state._pendingByAgent.set(target, list);
                }
            }

            const evObj = {
                id: 'ev-' + (++state._seq),
                processDetailId: String(data.processDetailId || ''),
                eventType: 'tool_call',
                title: toolName,
                summary: argSummary,
                toolName: toolName,
                toolCallId: toolCallId,
                executionId: String(data.executionId || ''),
                status: 'running',
                createdAt: nowIso
            };
            pushNodeEvent(node, evObj);
            state._activeTools.set(toolCallId, { nodeId: node.id, eventObj: evObj });

            if (toolName === 'task' || toolName === 'transfer_to_agent' || toolName === 'record_vulnerability') {
                pushFeedEvent(state, {
                    id: evObj.id,
                    nodeId: node.id,
                    agentName: node.agentName,
                    displayName: node.displayName,
                    eventType: 'tool_call',
                    title: node.displayName + ' · ' + toolName,
                    summary: argSummary,
                    status: 'running',
                    createdAt: nowIso
                });
            }
        } else if (evType === 'tool_result') {
            const toolName = String(data.toolName || 'tool');
            const toolCallId = String(data.toolCallId || '');
            const execId = String(data.executionId || '');
            const failed = data.isError === true || data.modelFacingIsError === true || data.success === false || String(data.status || '').toLowerCase() === 'blocked';
            const resStatus = failed ? 'failed' : 'completed';

            const active = toolCallId ? state._activeTools.get(toolCallId) : null;
            if (active && active.nodeId === node.id) {
                if (node.runningToolCount > 0) node.runningToolCount--;
                if (failed) node.failedToolCount++;
                if (active.eventObj) {
                    active.eventObj.status = resStatus;
                    if (execId) active.eventObj.executionId = execId;
                }
                state._activeTools.delete(toolCallId);
            } else if (failed) {
                node.failedToolCount++;
            }

            if (node.currentTool === toolName) node.currentTool = '';
            const preview = truncateText(data.resultPreview || data.result || msg || '', 160);
            if (preview) node.currentActivity = toolName + ': ' + preview;

            pushNodeEvent(node, {
                id: 'ev-' + (++state._seq),
                processDetailId: String(data.processDetailId || ''),
                eventType: 'tool_result',
                title: toolName,
                summary: preview,
                toolName: toolName,
                toolCallId: toolCallId,
                executionId: execId,
                status: resStatus,
                createdAt: nowIso
            });
        } else if (evType === 'agent_usage_summary') {
            const tu = node.tokenUsage;
            if (data.model) tu.model = String(data.model);
            tu.modelCalls += Number(data.modelCalls || 0);
            tu.promptTokens += Number(data.promptTokens || 0);
            tu.completionTokens += Number(data.completionTokens || 0);
            tu.totalTokens += Number(data.totalTokens || 0);
            tu.cachedTokens += Number(data.cachedTokens || 0);
            tu.cacheWriteTokens += Number(data.cacheWriteTokens || 0);
            tu.reasoningTokens += Number(data.reasoningTokens || 0);
            if (node.iterationCount < tu.modelCalls) node.iterationCount = tu.modelCalls;
        } else if (evType === 'agent_reply' || evType === 'agent_reply_stream_end') {
            node.resultPreview = truncateText(msg, 600);
            node.currentActivity = truncateText(msg, 120);
            if (node.status === 'running') {
                node.status = 'completed';
                node.endedAt = nowIso;
                node.durationMs = Math.max(0, now - toMs(node.startedAt, now));
            }
            pushNodeEvent(node, {
                id: 'ev-' + (++state._seq),
                processDetailId: String(data.processDetailId || ''),
                eventType: 'agent_reply',
                title: tr('swarm.agentReplyTitle', '子代理回报'),
                summary: truncateText(msg, 240),
                status: 'completed',
                createdAt: nowIso
            });
            pushFeedEvent(state, {
                id: 'feed-' + (++state._seq),
                nodeId: node.id,
                agentName: node.agentName,
                displayName: node.displayName,
                eventType: 'agent_reply',
                title: node.displayName + ' ' + tr('swarm.feedReplied', '返回分析结论'),
                summary: truncateText(msg, 160),
                status: node.status,
                createdAt: nowIso
            });
        }

        recomputeSwarmSummary(state);
        state.updatedAt = nowIso;
        return true;
    }

    function filterSwarmNodes(nodes, opts) {
        const list = Array.isArray(nodes) ? nodes : [];
        const statusFilter = (opts && opts.statusFilter) || 'all';
        const q = String((opts && opts.search) || '').trim().toLowerCase();
        return list.filter(function (n) {
            if (!n) return false;
            const st = normalizeStatus(n.status);
            if (statusFilter === 'running' && st !== 'running') return false;
            if (statusFilter === 'completed' && st !== 'completed') return false;
            if (statusFilter === 'failed' && st !== 'failed' && st !== 'cancelled' && st !== 'blocked') return false;
            if (!q) return true;
            const hay = [n.displayName, n.agentName, n.id, n.taskBrief, n.currentActivity, n.currentTool, n.resultPreview]
                .filter(Boolean).join(' ').toLowerCase();
            return hay.indexOf(q) !== -1;
        });
    }

    /**
     * 计算分层有向拓扑布局坐标：
     * - 支持多轮编排（多 Root 上下排布）、单 Root 多并行子代理（每行最多 3 个避免画布过宽）
     * - 当筛选隐藏了父节点时，孤立可见节点按独立行排布
     */
    function computeTopologyLayout(nodes, edges) {
        const list = Array.isArray(nodes) ? nodes : [];
        if (list.length === 0) {
            return { positions: new Map(), edges: [], width: 520, height: 320 };
        }
        const byId = new Map();
        const childrenOf = new Map();
        for (let i = 0; i < list.length; i++) {
            byId.set(list[i].id, list[i]);
            childrenOf.set(list[i].id, []);
        }
        const roots = [];
        for (let i = 0; i < list.length; i++) {
            const n = list[i];
            if (n.parentId && byId.has(n.parentId) && n.parentId !== n.id) {
                childrenOf.get(n.parentId).push(n);
            } else {
                roots.push(n);
            }
        }
        if (roots.length === 0) roots.push(list[0]);

        const positions = new Map();
        let cursorY = PAD_Y;
        let maxW = 640;

        function layoutSubtree(node, startY, depth) {
            const kids = childrenOf.get(node.id) || [];
            if (kids.length === 0) {
                return { width: NODE_W, height: NODE_H, blocks: [{ node: node, xOffset: 0, y: startY }] };
            }
            // 将直接子节点按每行最多 MAX_PER_ROW 排成多层网格，避免横向无限延伸
            const kidLayouts = [];
            const kidStartY = startY + NODE_H + GAP_Y;
            let rowX = 0;
            let rowCount = 0;
            let rowMaxH = 0;
            let accumY = kidStartY;
            let subtreeMaxW = 0;
            const placedBlocks = [];

            for (let i = 0; i < kids.length; i++) {
                const sub = layoutSubtree(kids[i], accumY, depth + 1);
                kidLayouts.push(sub);
                if (rowCount > 0 && rowCount >= MAX_PER_ROW) {
                    accumY += rowMaxH + 28;
                    subtreeMaxW = Math.max(subtreeMaxW, rowX - GAP_X);
                    rowX = 0;
                    rowCount = 0;
                    rowMaxH = 0;
                    // 重新以新的 accumY 计算该子节点 Y 偏移
                    const deltaY = accumY - sub.blocks[0].y;
                    for (let b = 0; b < sub.blocks.length; b++) {
                        sub.blocks[b].y += deltaY;
                    }
                }
                for (let b = 0; b < sub.blocks.length; b++) {
                    placedBlocks.push({
                        node: sub.blocks[b].node,
                        xOffset: rowX + sub.blocks[b].xOffset,
                        y: sub.blocks[b].y
                    });
                }
                rowX += sub.width + GAP_X;
                rowCount++;
                rowMaxH = Math.max(rowMaxH, sub.height);
                subtreeMaxW = Math.max(subtreeMaxW, rowX - GAP_X);
            }
            const totalW = Math.max(NODE_W, subtreeMaxW);
            const rootXOffset = Math.max(0, (totalW - NODE_W) / 2);
            const allBlocks = [{ node: node, xOffset: rootXOffset, y: startY }].concat(placedBlocks);
            let maxBottom = startY + NODE_H;
            for (let i = 0; i < allBlocks.length; i++) {
                maxBottom = Math.max(maxBottom, allBlocks[i].y + NODE_H);
            }
            return { width: totalW, height: maxBottom - startY, blocks: allBlocks };
        }

        for (let r = 0; r < roots.length; r++) {
            const tree = layoutSubtree(roots[r], cursorY, 0);
            const originX = PAD_X;
            for (let b = 0; b < tree.blocks.length; b++) {
                const blk = tree.blocks[b];
                positions.set(blk.node.id, {
                    x: originX + blk.xOffset,
                    y: blk.y,
                    w: NODE_W,
                    h: NODE_H
                });
            }
            maxW = Math.max(maxW, originX + tree.width + PAD_X);
            cursorY += tree.height + GAP_Y;
        }

        // 若存在未被 roots 覆盖到的极少数环引用节点，兜底追加到底部
        const orphanRow = [];
        for (let i = 0; i < list.length; i++) {
            if (!positions.has(list[i].id)) orphanRow.push(list[i]);
        }
        if (orphanRow.length > 0) {
            orphanRow.forEach(function (n, idx) {
                positions.set(n.id, {
                    x: PAD_X + idx * (NODE_W + GAP_X),
                    y: cursorY,
                    w: NODE_W,
                    h: NODE_H
                });
                maxW = Math.max(maxW, PAD_X + (idx + 1) * (NODE_W + GAP_X));
            });
            cursorY += NODE_H + PAD_Y;
        }

        const totalH = Math.max(360, cursorY - GAP_Y + PAD_Y);
        const edgeGeoms = [];
        const edgeList = Array.isArray(edges) ? edges : [];
        for (let i = 0; i < edgeList.length; i++) {
            const e = edgeList[i];
            const src = positions.get(e.source);
            const dst = positions.get(e.target);
            if (!src || !dst) continue;
            const sx = src.x + src.w / 2;
            const sy = src.y + src.h;
            const tx = dst.x + dst.w / 2;
            const ty = dst.y;
            const cy = sy + Math.max(28, (ty - sy) * 0.5);
            const d = 'M ' + sx + ' ' + sy + ' C ' + sx + ' ' + cy + ', ' + tx + ' ' + (ty - (cy - sy)) + ', ' + tx + ' ' + ty;
            edgeGeoms.push(Object.assign({}, e, {
                d: d,
                midX: (sx + tx) / 2,
                midY: (sy + ty) / 2
            }));
        }
        return { positions: positions, edges: edgeGeoms, width: maxW, height: totalH };
    }

    function computeTimelineBars(nodes, startedAtIso, nowMs) {
        const list = Array.isArray(nodes) ? nodes : [];
        const now = typeof nowMs === 'number' && Number.isFinite(nowMs) ? nowMs : Date.now();
        if (list.length === 0) {
            return { minStartMs: now, maxEndMs: now + 1000, totalDurationMs: 1000, bars: [] };
        }
        let minStart = startedAtIso ? toMs(startedAtIso, now) : Infinity;
        let maxEnd = 0;
        for (let i = 0; i < list.length; i++) {
            const n = list[i];
            const s = toMs(n.startedAt, now);
            let e = n.endedAt ? toMs(n.endedAt, now) : (n.status === 'running' ? now : (s + Number(n.durationMs || 0)));
            if (e < s) e = s;
            if (s < minStart) minStart = s;
            if (e > maxEnd) maxEnd = e;
        }
        if (!Number.isFinite(minStart)) minStart = now;
        const total = Math.max(1000, maxEnd - minStart);
        const bars = list.map(function (n) {
            const s = toMs(n.startedAt, minStart);
            let e = n.endedAt ? toMs(n.endedAt, now) : (n.status === 'running' ? now : (s + Number(n.durationMs || 0)));
            if (e < s) e = s;
            const dur = n.durationMs > 0 ? n.durationMs : Math.max(0, e - s);
            const leftPct = Math.max(0, Math.min(98, ((s - minStart) / total) * 100));
            const rawWidthPct = ((Math.max(dur, total * 0.015)) / total) * 100;
            const widthPct = Math.max(2.5, Math.min(100 - leftPct, rawWidthPct));
            return {
                node: n,
                leftPct: Number(leftPct.toFixed(2)),
                widthPct: Number(widthPct.toFixed(2)),
                durationMs: dur
            };
        });
        return { minStartMs: minStart, maxEndMs: maxEnd, totalDurationMs: total, bars: bars };
    }

    function buildSwarmExportSvg(snapshot, theme) {
        const snap = snapshot || {};
        const nodes = Array.isArray(snap.nodes) ? snap.nodes : [];
        const edges = Array.isArray(snap.edges) ? snap.edges : [];
        const layout = computeTopologyLayout(nodes, edges);
        const dark = theme === 'dark';
        const bg = dark ? '#0b1120' : '#f8fafc';
        const cardBg = dark ? '#111827' : '#ffffff';
        const border = dark ? '#263244' : '#e2e8f0';
        const text = dark ? '#e5e7eb' : '#0f172a';
        const subText = dark ? '#94a3b8' : '#64748b';

        function strokeForStatus(st) {
            const s = normalizeStatus(st);
            if (s === 'completed') return dark ? '#34d399' : '#16a34a';
            if (s === 'failed') return dark ? '#f87171' : '#dc2626';
            if (s === 'cancelled' || s === 'blocked') return dark ? '#fbbf24' : '#d97706';
            return dark ? '#60a5fa' : '#0066ff';
        }

        const headerH = 54;
        const svgW = Math.max(680, layout.width);
        const svgH = layout.height + headerH + 34;
        const parts = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<svg xmlns="http://www.w3.org/2000/svg" width="' + svgW + '" height="' + svgH + '" viewBox="0 0 ' + svgW + ' ' + svgH + '">',
            '<rect width="' + svgW + '" height="' + svgH + '" fill="' + bg + '" />',
            '<text x="24" y="34" font-family="sans-serif" font-size="16" font-weight="700" fill="' + text + '">SI-Lens Swarm Topology · ' + escapeXml(snap.title || snap.conversationId || 'Run') + '</text>'
        ];
        parts.push('<g transform="translate(0,' + headerH + ')">');
        layout.edges.forEach(function (e) {
            parts.push('<path d="' + escapeXml(e.d) + '" fill="none" stroke="' + strokeForStatus(e.status) + '" stroke-width="2" />');
            parts.push('<rect x="' + (e.midX - 28) + '" y="' + (e.midY - 9) + '" width="56" height="18" rx="9" fill="' + cardBg + '" stroke="' + border + '" />');
            parts.push('<text x="' + e.midX + '" y="' + (e.midY + 3) + '" text-anchor="middle" font-family="sans-serif" font-size="10" fill="' + subText + '">' + escapeXml(truncateText(e.label || 'task', 12)) + '</text>');
        });
        nodes.forEach(function (n) {
            const pos = layout.positions.get(n.id);
            if (!pos) return;
            const accent = n.role === 'orchestrator' ? '#7c3aed' : strokeForStatus(n.status);
            parts.push('<rect x="' + pos.x + '" y="' + pos.y + '" width="' + pos.w + '" height="' + pos.h + '" rx="12" fill="' + cardBg + '" stroke="' + border + '" />');
            parts.push('<rect x="' + pos.x + '" y="' + pos.y + '" width="4" height="' + pos.h + '" rx="2" fill="' + accent + '" />');
            parts.push('<circle cx="' + (pos.x + 18) + '" cy="' + (pos.y + 22) + '" r="4.5" fill="' + strokeForStatus(n.status) + '" />');
            parts.push('<text x="' + (pos.x + 30) + '" y="' + (pos.y + 26) + '" font-family="sans-serif" font-size="12.5" font-weight="700" fill="' + text + '">' + escapeXml(truncateText(n.displayName || n.agentName, 22)) + '</text>');
            parts.push('<text x="' + (pos.x + 16) + '" y="' + (pos.y + 52) + '" font-family="monospace" font-size="10.5" fill="' + subText + '">' + escapeXml(truncateText(n.currentActivity || n.taskBrief || statusLabel(n.status), 32)) + '</text>');
            const stats = tr('swarm.svgStatsLine', '工具 {{tools}} · 轮次 {{iter}} · {{tokens}} tok', {
                tools: n.toolCount || 0,
                iter: n.iterationCount || 0,
                tokens: formatCompactTokens((n.tokenUsage && n.tokenUsage.totalTokens) || 0)
            });
            parts.push('<text x="' + (pos.x + 16) + '" y="' + (pos.y + 104) + '" font-family="sans-serif" font-size="10.5" fill="' + subText + '">' + escapeXml(stats) + '</text>');
        });
        parts.push('</g>');
        parts.push('<text x="24" y="' + (svgH - 12) + '" font-family="sans-serif" font-size="11" fill="' + subText + '">SI-Lens · Multi-Agent Swarm Visualization</text>');
        parts.push('</svg>');
        return parts.join('\n');
    }

    /* =====================================================================
     * 浏览器端交互控制器（仅在 DOM 环境激活）
     * ===================================================================== */
    if (typeof root.document !== 'undefined' && typeof root.window !== 'undefined') {
        const ui = {
            conversationId: '',
            states: new Map(),           // conversationId -> swarm state
            view: 'topology',            // topology | grid | timeline
            statusFilter: 'all',         // all | running | completed | failed
            search: '',
            selectedNodeId: '',
            inspectorTab: 'trace',       // trace | brief | usage
            traceFilter: 'all',          // all | tool | reply | error
            feedCollapsed: false,
            zoom: 1,
            panX: 0,
            panY: 0,
            fetchSeq: 0,
            detailCache: new Map(),      // processDetailId -> detail JSON
            detailPending: new Set(),
            liveTimer: null,
            pollTimer: null,
            rafQueued: false,
            lastLiveStreamAt: 0
        };

        function currentState() {
            if (!ui.conversationId) return null;
            return ui.states.get(ui.conversationId) || null;
        }

        function ensureStateFor(convId) {
            const id = String(convId || '').trim();
            if (!id) return null;
            let st = ui.states.get(id);
            if (!st) {
                st = createSwarmState(id);
                ui.states.set(id, st);
            }
            return st;
        }

        function isDrawerOpen() {
            if (typeof root.isAppModalOpen === 'function') {
                return root.isAppModalOpen('swarm-dashboard-modal');
            }
            const el = root.document.getElementById('swarm-dashboard-modal');
            return !!(el && root.getComputedStyle(el).display !== 'none');
        }

        function isSwarmPageActive() {
            const page = root.document.getElementById('page-agents-swarm');
            return !!(page && page.classList.contains('active'));
        }

        function scheduleRender() {
            if (ui.rafQueued) return;
            ui.rafQueued = true;
            const run = function () {
                ui.rafQueued = false;
                renderChatStrip();
                if (isDrawerOpen()) {
                    renderBoardInto('swarm-drawer-root');
                }
                if (isSwarmPageActive()) {
                    renderBoardInto('swarm-page-root');
                }
                syncTimers();
            };
            if (typeof root.requestAnimationFrame === 'function') {
                root.requestAnimationFrame(run);
            } else {
                setTimeout(run, 16);
            }
        }

        function syncTimers() {
            const st = currentState();
            const hasRunning = !!(st && (st.running || st.summary.runningNodes > 0));
            const boardVisible = isDrawerOpen() || isSwarmPageActive();

            if (hasRunning && boardVisible) {
                if (!ui.liveTimer) {
                    ui.liveTimer = setInterval(function () {
                        if (!isDrawerOpen() && !isSwarmPageActive()) {
                            clearInterval(ui.liveTimer);
                            ui.liveTimer = null;
                            return;
                        }
                        if (isDrawerOpen()) renderBoardInto('swarm-drawer-root');
                        if (isSwarmPageActive()) renderBoardInto('swarm-page-root');
                    }, 1000);
                }
            } else if (ui.liveTimer) {
                clearInterval(ui.liveTimer);
                ui.liveTimer = null;
            }

            const streamStale = Date.now() - ui.lastLiveStreamAt > 3500;
            if (isSwarmPageActive() && hasRunning && streamStale && ui.conversationId) {
                if (!ui.pollTimer) {
                    ui.pollTimer = setInterval(function () {
                        if (!isSwarmPageActive()) {
                            clearInterval(ui.pollTimer);
                            ui.pollTimer = null;
                            return;
                        }
                        void fetchSwarmSnapshot(ui.conversationId, { silent: true });
                    }, 3000);
                }
            } else if (ui.pollTimer) {
                clearInterval(ui.pollTimer);
                ui.pollTimer = null;
            }
        }

        async function fetchSwarmSnapshot(conversationId, opts) {
            const cid = String(conversationId || '').trim();
            if (!cid || typeof root.apiFetch !== 'function') return null;
            const seq = ++ui.fetchSeq;
            const prevState = ensureStateFor(cid);
            try {
                const res = await root.apiFetch('/api/conversations/' + encodeURIComponent(cid) + '/swarm');
                if (!res || !res.ok) return null;
                const snap = await res.json();
                if (seq !== ui.fetchSeq && cid !== ui.conversationId) return null;
                const next = hydrateSwarmSnapshot(prevState, snap);
                ui.states.set(cid, next);
                if (cid === ui.conversationId) {
                    if (!ui.selectedNodeId || !next._nodeMap.has(ui.selectedNodeId)) {
                        ui.selectedNodeId = next.nodes.length ? next.nodes[0].id : '';
                    }
                    scheduleRender();
                }
                return next;
            } catch (err) {
                if (!opts || !opts.silent) {
                    console.warn('获取蜂群快照失败:', err);
                }
                return null;
            }
        }

        async function fetchProcessDetailPayload(processDetailId) {
            const id = String(processDetailId || '').trim();
            if (!id || ui.detailCache.has(id) || ui.detailPending.has(id) || typeof root.apiFetch !== 'function') {
                return;
            }
            ui.detailPending.add(id);
            scheduleRender();
            try {
                const res = await root.apiFetch('/api/process-details/' + encodeURIComponent(id));
                if (res && res.ok) {
                    const body = await res.json();
                    ui.detailCache.set(id, body.processDetail || body || {});
                } else {
                    ui.detailCache.set(id, { error: tr('swarm.detailLoadFailed', '加载完整参数失败') });
                }
            } catch (err) {
                ui.detailCache.set(id, { error: String(err && err.message ? err.message : err) });
            } finally {
                ui.detailPending.delete(id);
                scheduleRender();
            }
        }

        function shouldShowChatStrip(state) {
            if (!state || !state.nodes || state.nodes.length === 0) return false;
            if (state.nodes.length > 1) return true;
            if (state.nodes.some(function (n) { return n.role === 'subagent'; })) return true;
            return !!(state.running && state.orchestration && state.orchestration !== 'single');
        }

        function renderChatStrip() {
            const strip = root.document.getElementById('chat-swarm-strip');
            if (!strip) return;
            const st = currentState();
            if (!shouldShowChatStrip(st)) {
                strip.hidden = true;
                strip.innerHTML = '';
                return;
            }
            strip.hidden = false;
            const activeCount = st.summary.runningNodes || 0;
            const totalCount = st.summary.totalNodes || st.nodes.length;
            const dotCls = st.running && activeCount > 0 ? 'swarm-dot--running' : (st.summary.failedNodes > 0 ? 'swarm-dot--failed' : 'swarm-dot--completed');
            const leadText = activeCount > 0
                ? tr('swarm.stripRunning', '蜂群协作 · {{active}}/{{total}} 运行中', { active: activeCount, total: totalCount })
                : tr('swarm.stripDone', '蜂群协作 · 共 {{total}} 个智能体', { total: totalCount });

            const chipsHtml = st.nodes.slice(0, 8).map(function (n) {
                const ndCls = 'swarm-dot--' + normalizeStatus(n.status);
                return '<button type="button" class="chat-swarm-chip" data-swarm-focus="' + escapeHtml(n.id) + '" title="' + escapeHtml(n.currentActivity || n.displayName) + '">' +
                    '<span class="swarm-dot ' + ndCls + '"></span>' +
                    '<span>' + escapeHtml(truncateText(n.displayName || n.agentName, 18)) + '</span>' +
                    '<span class="chat-swarm-chip__count">' + (n.toolCount || 0) + '</span>' +
                    '</button>';
            }).join('');

            const metaText = tr('swarm.stripMeta', '{{tools}} 工具 · {{tokens}} tokens', {
                tools: st.summary.totalTools || 0,
                tokens: formatCompactTokens(st.summary.totalTokens || 0)
            });

            strip.innerHTML =
                '<span class="chat-swarm-strip__lead"><span class="swarm-dot ' + dotCls + '"></span><span>' + escapeHtml(leadText) + '</span></span>' +
                '<div class="chat-swarm-strip__chips">' + chipsHtml + '</div>' +
                '<div class="chat-swarm-strip__actions">' +
                    '<span class="chat-swarm-strip__meta">' + escapeHtml(metaText) + '</span>' +
                    '<button type="button" class="chat-swarm-open-btn" data-swarm-open="1">' + escapeHtml(tr('swarm.openBoard', '打开蜂群看板')) + '</button>' +
                '</div>';

            strip.querySelectorAll('[data-swarm-focus]').forEach(function (btn) {
                btn.onclick = function () {
                    void root.openSwarmDashboard(st.conversationId, btn.getAttribute('data-swarm-focus'));
                };
            });
            const openBtn = strip.querySelector('[data-swarm-open]');
            if (openBtn) {
                openBtn.onclick = function () {
                    void root.openSwarmDashboard(st.conversationId, '');
                };
            }
        }

        function nodeElapsedMs(node, now) {
            if (!node) return 0;
            if (node.status === 'running' && node.startedAt) {
                return Math.max(Number(node.durationMs || 0), now - toMs(node.startedAt, now));
            }
            if (node.durationMs > 0) return node.durationMs;
            if (node.startedAt && node.endedAt) {
                return Math.max(0, toMs(node.endedAt, now) - toMs(node.startedAt, now));
            }
            return 0;
        }

        function renderAgentCardHtml(n, isSelected, now, wrapPos) {
            const st = normalizeStatus(n.status);
            const roleClass = n.role === 'orchestrator' ? 'swarm-agent-card--orchestrator' : ('swarm-agent-card--' + st);
            const cls = ['swarm-agent-card', roleClass];
            if (isSelected) cls.push('is-selected');
            const roleLabel = n.role === 'orchestrator' ? tr('swarm.roleOrchestrator', '主编排') : tr('swarm.roleSubagent', '子代理');
            const ticker = n.currentTool
                ? ('⚙ ' + n.currentTool + (n.currentActivity ? (' · ' + n.currentActivity) : ''))
                : (n.currentActivity || n.resultPreview || statusLabel(st));
            const tokens = (n.tokenUsage && n.tokenUsage.totalTokens) || 0;
            const errBadge = n.failedToolCount > 0
                ? '<span class="swarm-pill swarm-pill--failed">' + n.failedToolCount + ' ⚠</span>'
                : '';
            const cardHtml =
                '<button type="button" class="' + cls.join(' ') + '" data-swarm-node="' + escapeHtml(n.id) + '">' +
                    '<div class="swarm-card-head">' +
                        '<span class="swarm-dot swarm-dot--' + st + '"></span>' +
                        '<span class="swarm-card-title" title="' + escapeHtml(n.displayName) + '">' + escapeHtml(n.displayName) + '</span>' +
                        '<span class="swarm-card-duration">' + escapeHtml(formatDurationMs(nodeElapsedMs(n, now))) + '</span>' +
                    '</div>' +
                    '<div class="swarm-card-subrow">' +
                        '<span class="swarm-pill">' + escapeHtml(roleLabel) + '</span>' +
                        '<span>' + escapeHtml(n.agentName || n.id) + '</span>' +
                        errBadge +
                    '</div>' +
                    '<div class="swarm-card-ticker" title="' + escapeHtml(ticker) + '">' + escapeHtml(truncateText(ticker, 52)) + '</div>' +
                    (n.taskBrief ? ('<div class="swarm-card-brief" title="' + escapeHtml(n.taskBrief) + '">' + escapeHtml(n.taskBrief) + '</div>') : '') +
                    '<div class="swarm-card-stats">' +
                        '<span>' + escapeHtml(tr('swarm.cardTools', '工具 {{n}}', { n: n.toolCount || 0 })) + '</span>' +
                        '<span>·</span>' +
                        '<span>' + escapeHtml(tr('swarm.cardIter', '轮次 {{n}}', { n: n.iterationCount || 0 })) + '</span>' +
                        '<span class="swarm-card-stats-right">' + escapeHtml(formatCompactTokens(tokens)) + ' tok</span>' +
                    '</div>' +
                '</button>';

            if (!wrapPos) return cardHtml;
            return '<div class="swarm-topo-node-wrap" style="left:' + wrapPos.x + 'px;top:' + wrapPos.y + 'px;width:' + wrapPos.w + 'px;height:' + wrapPos.h + 'px;">' + cardHtml + '</div>';
        }

        function renderInspectorHtml(state, selectedNode, now) {
            if (!selectedNode) {
                return '<div class="swarm-inspector"><div class="swarm-empty-state" style="border:0;height:100%"><p>' + escapeHtml(tr('swarm.selectNodeHint', '点击左侧任意节点查看执行轨迹与上下文')) + '</p></div></div>';
            }
            const st = normalizeStatus(selectedNode.status);
            const tu = selectedNode.tokenUsage || {};
            const events = Array.isArray(selectedNode.events) ? selectedNode.events : [];
            const filteredEvents = events.filter(function (ev) {
                if (ui.traceFilter === 'tool') return ev.eventType === 'tool_call' || ev.eventType === 'tool_result';
                if (ui.traceFilter === 'reply') return ev.eventType === 'agent_reply';
                if (ui.traceFilter === 'error') return ev.status === 'failed' || ev.eventType === 'error';
                return true;
            });

            let bodyHtml = '';
            if (ui.inspectorTab === 'brief') {
                bodyHtml =
                    '<div class="swarm-mini-stats">' +
                        '<div class="swarm-mini-stat"><div class="swarm-mini-stat-k">' + escapeHtml(tr('swarm.metricStatus', '状态')) + '</div><div class="swarm-mini-stat-v">' + escapeHtml(statusLabel(st)) + '</div></div>' +
                        '<div class="swarm-mini-stat"><div class="swarm-mini-stat-k">' + escapeHtml(tr('swarm.metricDuration', '耗时')) + '</div><div class="swarm-mini-stat-v">' + escapeHtml(formatDurationMs(nodeElapsedMs(selectedNode, now))) + '</div></div>' +
                        '<div class="swarm-mini-stat"><div class="swarm-mini-stat-k">' + escapeHtml(tr('swarm.metricDelegation', '委派方式')) + '</div><div class="swarm-mini-stat-v">' + escapeHtml(selectedNode.delegationTool || (selectedNode.role === 'orchestrator' ? 'root' : 'task')) + '</div></div>' +
                    '</div>' +
                    '<div style="font-size:12px;font-weight:600;color:var(--text-secondary)">' + escapeHtml(tr('swarm.taskBriefTitle', '委派任务目标（Brief）')) + '</div>' +
                    '<div class="swarm-brief-box">' + escapeHtml(selectedNode.taskBrief || tr('swarm.noTaskBrief', '暂无任务描述记录')) + '</div>' +
                    '<div style="font-size:12px;font-weight:600;color:var(--text-secondary)">' + escapeHtml(tr('swarm.resultPreviewTitle', '节点汇报与输出摘要')) + '</div>' +
                    '<div class="swarm-brief-box" style="border-left-color:var(--success-color)">' + escapeHtml(selectedNode.resultPreview || selectedNode.currentActivity || tr('swarm.noResultYet', '暂无输出摘要')) + '</div>';
            } else if (ui.inspectorTab === 'usage') {
                const promptUncached = Math.max(0, Number(tu.promptTokens || 0) - Number(tu.cachedTokens || 0));
                const cached = Number(tu.cachedTokens || 0);
                const completion = Number(tu.completionTokens || 0);
                const reasoning = Number(tu.reasoningTokens || 0);
                const denom = Math.max(1, promptUncached + cached + completion + reasoning);
                bodyHtml =
                    '<div class="swarm-mini-stats">' +
                        '<div class="swarm-mini-stat"><div class="swarm-mini-stat-k">' + escapeHtml(tr('swarm.metricModelCalls', '模型调用')) + '</div><div class="swarm-mini-stat-v">' + (tu.modelCalls || 0) + '</div></div>' +
                        '<div class="swarm-mini-stat"><div class="swarm-mini-stat-k">' + escapeHtml(tr('swarm.metricTotalTokens', '总 Token')) + '</div><div class="swarm-mini-stat-v">' + escapeHtml(formatCompactTokens(tu.totalTokens || 0)) + '</div></div>' +
                        '<div class="swarm-mini-stat"><div class="swarm-mini-stat-k">' + escapeHtml(tr('swarm.metricCached', '缓存命中')) + '</div><div class="swarm-mini-stat-v">' + escapeHtml(formatCompactTokens(cached)) + '</div></div>' +
                    '</div>' +
                    '<div class="swarm-usage-bar" title="Cached / Prompt / Completion / Reasoning">' +
                        '<div class="swarm-usage-seg-cached" style="width:' + ((cached / denom) * 100).toFixed(1) + '%"></div>' +
                        '<div class="swarm-usage-seg-prompt" style="width:' + ((promptUncached / denom) * 100).toFixed(1) + '%"></div>' +
                        '<div class="swarm-usage-seg-completion" style="width:' + ((completion / denom) * 100).toFixed(1) + '%"></div>' +
                        '<div class="swarm-usage-seg-reasoning" style="width:' + ((reasoning / denom) * 100).toFixed(1) + '%"></div>' +
                    '</div>' +
                    '<div class="swarm-ev-card">' +
                        '<div class="swarm-ev-top"><span>' + escapeHtml(tr('swarm.usageDetailTitle', '模型与 Token 明细')) + '</span></div>' +
                        '<div class="swarm-ev-summary">' +
                            escapeHtml(
                                'Model: ' + (tu.model || '-') + '\n' +
                                'Prompt: ' + (tu.promptTokens || 0).toLocaleString() + ' (Cached: ' + cached.toLocaleString() + ')\n' +
                                'Completion: ' + completion.toLocaleString() + ' (Reasoning: ' + reasoning.toLocaleString() + ')\n' +
                                'Total: ' + (tu.totalTokens || 0).toLocaleString()
                            ) +
                        '</div>' +
                    '</div>';
            } else {
                const traceFilterBtns = ['all', 'tool', 'reply', 'error'].map(function (fk) {
                    const labels = {
                        all: tr('swarm.filterAll', '全部'),
                        tool: tr('swarm.traceTools', '工具'),
                        reply: tr('swarm.traceReplies', '汇报'),
                        error: tr('swarm.traceErrors', '异常')
                    };
                    return '<button type="button" class="swarm-filter-btn ' + (ui.traceFilter === fk ? 'is-active' : '') + '" data-swarm-tfilter="' + fk + '">' + escapeHtml(labels[fk]) + '</button>';
                }).join('');

                const evListHtml = filteredEvents.length === 0
                    ? '<div class="swarm-empty-state" style="padding:24px"><p>' + escapeHtml(tr('swarm.noEventsMatch', '当前过滤条件下暂无执行事件')) + '</p></div>'
                    : filteredEvents.slice().reverse().map(function (ev) {
                        const pdId = ev.processDetailId || '';
                        const cachedDetail = pdId ? ui.detailCache.get(pdId) : null;
                        const pending = pdId && ui.detailPending.has(pdId);
                        let payloadHtml = '';
                        if (pdId && (ev.eventType === 'tool_call' || ev.eventType === 'tool_result')) {
                            if (cachedDetail) {
                                let formatted = '';
                                try {
                                    formatted = JSON.stringify(cachedDetail.data || cachedDetail, null, 2);
                                } catch (err) {
                                    formatted = String(cachedDetail);
                                }
                                payloadHtml = '<pre class="swarm-ev-payload-pre">' + escapeHtml(formatted) + '</pre>';
                            } else {
                                payloadHtml = '<button type="button" class="swarm-ev-payload-btn" data-swarm-detail="' + escapeHtml(pdId) + '">' +
                                    escapeHtml(pending ? tr('common.loading', '加载中…') : tr('swarm.expandPayload', '展开完整参数/结果')) +
                                    '</button>';
                            }
                        }
                        return '<div class="swarm-ev-card">' +
                            '<div class="swarm-ev-top">' +
                                '<span class="swarm-pill swarm-pill--' + normalizeStatus(ev.status || 'completed') + '">' + escapeHtml(ev.eventType) + '</span>' +
                                '<span>' + escapeHtml(ev.title || ev.toolName || '') + '</span>' +
                                '<span class="swarm-ev-time">' + escapeHtml(formatTimeShort(ev.createdAt)) + '</span>' +
                            '</div>' +
                            (ev.summary ? '<div class="swarm-ev-summary">' + escapeHtml(ev.summary) + '</div>' : '') +
                            payloadHtml +
                        '</div>';
                    }).join('');

                bodyHtml =
                    '<div class="swarm-mini-stats">' +
                        '<div class="swarm-mini-stat"><div class="swarm-mini-stat-k">' + escapeHtml(tr('swarm.metricTools', '工具调用')) + '</div><div class="swarm-mini-stat-v">' + (selectedNode.toolCount || 0) + '</div></div>' +
                        '<div class="swarm-mini-stat"><div class="swarm-mini-stat-k">' + escapeHtml(tr('swarm.metricIters', '推理轮次')) + '</div><div class="swarm-mini-stat-v">' + (selectedNode.iterationCount || 0) + '</div></div>' +
                        '<div class="swarm-mini-stat"><div class="swarm-mini-stat-k">' + escapeHtml(tr('swarm.metricDuration', '耗时')) + '</div><div class="swarm-mini-stat-v">' + escapeHtml(formatDurationMs(nodeElapsedMs(selectedNode, now))) + '</div></div>' +
                    '</div>' +
                    '<div class="swarm-trace-filters">' + traceFilterBtns + '</div>' +
                    evListHtml;
            }

            return '<aside class="swarm-inspector">' +
                '<div class="swarm-inspector-head">' +
                    '<div class="swarm-inspector-title-row">' +
                        '<span class="swarm-dot swarm-dot--' + st + '"></span>' +
                        '<div class="swarm-inspector-title" title="' + escapeHtml(selectedNode.displayName) + '">' + escapeHtml(selectedNode.displayName) + '</div>' +
                        '<span class="swarm-pill swarm-pill--' + st + '">' + escapeHtml(statusLabel(st)) + '</span>' +
                    '</div>' +
                    '<div class="swarm-inspector-sub">' +
                        '<span>ID: ' + escapeHtml(selectedNode.id) + '</span>' +
                        '<span>·</span>' +
                        '<span>Agent: ' + escapeHtml(selectedNode.agentName || '-') + '</span>' +
                    '</div>' +
                    '<div class="swarm-inspector-tabs">' +
                        '<button type="button" class="swarm-itab ' + (ui.inspectorTab === 'trace' ? 'is-active' : '') + '" data-swarm-dtab="trace">' + escapeHtml(tr('swarm.tabTrace', '执行轨迹')) + ' (' + events.length + ')</button>' +
                        '<button type="button" class="swarm-itab ' + (ui.inspectorTab === 'brief' ? 'is-active' : '') + '" data-swarm-dtab="brief">' + escapeHtml(tr('swarm.tabBrief', '任务与回报')) + '</button>' +
                        '<button type="button" class="swarm-itab ' + (ui.inspectorTab === 'usage' ? 'is-active' : '') + '" data-swarm-dtab="usage">' + escapeHtml(tr('swarm.tabUsage', '资源消耗')) + '</button>' +
                    '</div>' +
                '</div>' +
                '<div class="swarm-inspector-body">' + bodyHtml + '</div>' +
            '</aside>';
        }

        function renderBoardInto(containerId) {
            const container = root.document.getElementById(containerId);
            if (!container) return;
            const st = currentState();
            if (!st || st.nodes.length === 0) {
                container.innerHTML =
                    '<div class="swarm-empty-state">' +
                        '<h3>' + escapeHtml(tr('swarm.emptyTitle', '暂无多代理蜂群轨迹')) + '</h3>' +
                        '<p>' + escapeHtml(tr('swarm.emptyDesc', '请选择一次使用 Deep / Plan-Execute / Supervisor 编排的对话，或在对话页发起多代理任务以实时观察子代理协作。')) + '</p>' +
                    '</div>';
                return;
            }

            const now = Date.now();
            const filteredNodes = filterSwarmNodes(st.nodes, { statusFilter: ui.statusFilter, search: ui.search });
            const visibleSet = new Set(filteredNodes.map(function (n) { return n.id; }));
            const visibleEdges = st.edges.filter(function (e) { return visibleSet.has(e.source) && visibleSet.has(e.target); });
            const selectedNode = st._nodeMap.get(ui.selectedNodeId) || filteredNodes[0] || st.nodes[0] || null;
            if (selectedNode && ui.selectedNodeId !== selectedNode.id) {
                ui.selectedNodeId = selectedNode.id;
            }

            const s = st.summary || {};
            const cachePct = s.promptTokens > 0 ? Math.round((s.cachedTokens / s.promptTokens) * 100) : 0;

            const kpiHtml =
                '<div class="swarm-kpi-grid">' +
                    '<div class="swarm-kpi-card">' +
                        '<div class="swarm-kpi-head"><span>' + escapeHtml(tr('swarm.kpiAgents', '蜂群节点')) + '</span><span class="swarm-pill ' + (s.runningNodes > 0 ? 'swarm-pill--running' : 'swarm-pill--completed') + '">' + escapeHtml(s.runningNodes > 0 ? tr('swarm.liveBadge', '实时运行') : tr('swarm.doneBadge', '已收敛')) + '</span></div>' +
                        '<div class="swarm-kpi-value">' + (s.totalNodes || 0) + '<small>' + escapeHtml(tr('swarm.unitAgents', '个节点')) + '</small></div>' +
                        '<div class="swarm-kpi-sub">' + escapeHtml(tr('swarm.kpiAgentsSub', '{{run}} 运行 · {{done}} 完成 · {{fail}} 失败/取消', { run: s.runningNodes || 0, done: s.completedNodes || 0, fail: (s.failedNodes || 0) + (s.cancelledNodes || 0) })) + '</div>' +
                    '</div>' +
                    '<div class="swarm-kpi-card">' +
                        '<div class="swarm-kpi-head"><span>' + escapeHtml(tr('swarm.kpiTools', '工具执行')) + '</span><span class="swarm-pill">' + escapeHtml(st.orchestration || 'deep') + '</span></div>' +
                        '<div class="swarm-kpi-value">' + (s.totalTools || 0) + '<small>' + escapeHtml(tr('swarm.unitCalls', '次调用')) + '</small></div>' +
                        '<div class="swarm-kpi-sub">' + escapeHtml(tr('swarm.kpiToolsSub', '{{run}} 进行中 · {{fail}} 异常', { run: s.runningTools || 0, fail: s.failedTools || 0 })) + '</div>' +
                    '</div>' +
                    '<div class="swarm-kpi-card">' +
                        '<div class="swarm-kpi-head"><span>' + escapeHtml(tr('swarm.kpiTokens', 'Token 消耗')) + '</span><span class="swarm-pill swarm-pill--completed">' + cachePct + '% cache</span></div>' +
                        '<div class="swarm-kpi-value">' + escapeHtml(formatCompactTokens(s.totalTokens || 0)) + '</div>' +
                        '<div class="swarm-kpi-sub">' + escapeHtml(tr('swarm.kpiTokensSub', '{{calls}} 次模型请求 · 推理 {{r}}', { calls: s.totalModelCalls || 0, r: formatCompactTokens(s.reasoningTokens || 0) })) + '</div>' +
                    '</div>' +
                    '<div class="swarm-kpi-card">' +
                        '<div class="swarm-kpi-head"><span>' + escapeHtml(tr('swarm.kpiElapsed', '协作时长')) + '</span></div>' +
                        '<div class="swarm-kpi-value">' + escapeHtml(formatDurationMs(computeTimelineBars(st.nodes, st.startedAt, now).totalDurationMs)) + '</div>' +
                        '<div class="swarm-kpi-sub">' + escapeHtml(truncateText(st.title || st.conversationId, 28)) + '</div>' +
                    '</div>' +
                '</div>';

            const viewButtons = [
                { id: 'topology', label: tr('swarm.viewTopo', '蜂群拓扑') },
                { id: 'grid', label: tr('swarm.viewGrid', '并行卡片') },
                { id: 'timeline', label: tr('swarm.viewTimeline', '协作时间轴') }
            ].map(function (v) {
                return '<button type="button" class="swarm-seg-btn ' + (ui.view === v.id ? 'is-active' : '') + '" data-swarm-view="' + v.id + '">' + escapeHtml(v.label) + '</button>';
            }).join('');

            const filterButtons = [
                { id: 'all', label: tr('swarm.filterAll', '全部') },
                { id: 'running', label: tr('swarm.statusRunning', '执行中') },
                { id: 'completed', label: tr('swarm.statusCompleted', '已完成') },
                { id: 'failed', label: tr('swarm.filterFailed', '失败/受阻') }
            ].map(function (f) {
                return '<button type="button" class="swarm-filter-btn ' + (ui.statusFilter === f.id ? 'is-active' : '') + '" data-swarm-sfilter="' + f.id + '">' + escapeHtml(f.label) + '</button>';
            }).join('');

            const toolbarHtml =
                '<div class="swarm-toolbar">' +
                    '<div class="swarm-toolbar-left">' +
                        '<div class="swarm-segmented">' + viewButtons + '</div>' +
                        '<div class="swarm-filter-pills">' + filterButtons + '</div>' +
                    '</div>' +
                    '<div class="swarm-toolbar-right">' +
                        '<input type="search" class="swarm-search-input" data-swarm-search="1" value="' + escapeHtml(ui.search) + '" placeholder="' + escapeHtml(tr('swarm.searchPlaceholder', '筛选代理 / 工具 / 任务…')) + '" />' +
                        '<button type="button" class="swarm-icon-btn" data-swarm-export="svg">' + escapeHtml(tr('swarm.exportSvg', '导出 SVG')) + '</button>' +
                        '<button type="button" class="swarm-icon-btn" data-swarm-refresh="1">' + escapeHtml(tr('common.refresh', '刷新')) + '</button>' +
                    '</div>' +
                '</div>';

            let canvasBodyHtml = '';
            if (filteredNodes.length === 0) {
                canvasBodyHtml = '<div class="swarm-empty-state" style="border:0;margin:auto"><p>' + escapeHtml(tr('swarm.noNodesMatch', '没有匹配筛选条件的 Agent 节点')) + '</p></div>';
            } else if (ui.view === 'grid') {
                canvasBodyHtml = '<div class="swarm-grid-view">' +
                    filteredNodes.map(function (n) {
                        return renderAgentCardHtml(n, selectedNode && selectedNode.id === n.id, now, null);
                    }).join('') +
                '</div>';
            } else if (ui.view === 'timeline') {
                const tl = computeTimelineBars(filteredNodes, st.startedAt, now);
                const rowsHtml = tl.bars.map(function (b) {
                    const n = b.node;
                    const nst = normalizeStatus(n.status);
                    const isSel = selectedNode && selectedNode.id === n.id;
                    return '<button type="button" class="swarm-tl-row ' + (isSel ? 'is-selected' : '') + '" data-swarm-node="' + escapeHtml(n.id) + '">' +
                        '<div class="swarm-tl-label">' +
                            '<span class="swarm-dot swarm-dot--' + nst + '"></span>' +
                            '<span class="swarm-tl-name" title="' + escapeHtml(n.displayName) + '">' + escapeHtml(n.displayName) + '</span>' +
                        '</div>' +
                        '<div class="swarm-tl-track">' +
                            '<div class="swarm-tl-bar swarm-tl-bar--' + nst + '" style="left:' + b.leftPct + '%;width:' + b.widthPct + '%;">' +
                                escapeHtml(formatDurationMs(b.durationMs) + ' · ' + (n.toolCount || 0) + ' ' + tr('swarm.unitToolsShort', '工具')) +
                            '</div>' +
                        '</div>' +
                    '</button>';
                }).join('');
                canvasBodyHtml = '<div class="swarm-timeline-view">' +
                    '<div class="swarm-tl-axis"><span>' + escapeHtml(tr('swarm.tlAgentCol', '智能体节点')) + '</span>' +
                    '<div class="swarm-tl-ticks"><span>0s</span><span>' + escapeHtml(formatDurationMs(tl.totalDurationMs * 0.5)) + '</span><span>' + escapeHtml(formatDurationMs(tl.totalDurationMs)) + '</span></div></div>' +
                    rowsHtml +
                '</div>';
            } else {
                const layout = computeTopologyLayout(filteredNodes, visibleEdges);
                const edgesSvg = layout.edges.map(function (e) {
                    return '<path class="swarm-edge-path swarm-edge-path--' + normalizeStatus(e.status) + '" d="' + escapeXml(e.d) + '"></path>';
                }).join('');
                const edgeBadges = layout.edges.map(function (e) {
                    return '<span class="swarm-edge-badge" style="left:' + e.midX + 'px;top:' + e.midY + 'px;">' + escapeHtml(e.label || 'task') + '</span>';
                }).join('');
                const nodeWraps = filteredNodes.map(function (n) {
                    const pos = layout.positions.get(n.id);
                    return renderAgentCardHtml(n, selectedNode && selectedNode.id === n.id, now, pos);
                }).join('');
                canvasBodyHtml =
                    '<div class="swarm-topo-viewport" data-swarm-viewport="1">' +
                        '<div class="swarm-topo-stage" data-swarm-stage="1" style="width:' + layout.width + 'px;height:' + layout.height + 'px;transform:translate(' + ui.panX + 'px,' + ui.panY + 'px) scale(' + ui.zoom + ');">' +
                            '<svg class="swarm-topo-edges" width="' + layout.width + '" height="' + layout.height + '">' + edgesSvg + '</svg>' +
                            edgeBadges +
                            nodeWraps +
                        '</div>' +
                    '</div>';
            }

            const canvasBarHtml =
                '<div class="swarm-canvas-bar">' +
                    '<div class="swarm-canvas-legend">' +
                        '<span class="swarm-canvas-legend-item"><span class="swarm-dot swarm-dot--running"></span>' + escapeHtml(tr('swarm.statusRunning', '执行中')) + '</span>' +
                        '<span class="swarm-canvas-legend-item"><span class="swarm-dot swarm-dot--completed"></span>' + escapeHtml(tr('swarm.statusCompleted', '已完成')) + '</span>' +
                        '<span class="swarm-canvas-legend-item"><span class="swarm-dot swarm-dot--failed"></span>' + escapeHtml(tr('swarm.statusFailed', '失败')) + '</span>' +
                    '</div>' +
                    (ui.view === 'topology' ? (
                        '<div class="swarm-zoom-controls">' +
                            '<button type="button" class="swarm-icon-btn" data-swarm-zoom="out" aria-label="Zoom out">－</button>' +
                            '<span class="swarm-zoom-readout">' + Math.round(ui.zoom * 100) + '%</span>' +
                            '<button type="button" class="swarm-icon-btn" data-swarm-zoom="in" aria-label="Zoom in">＋</button>' +
                            '<button type="button" class="swarm-icon-btn" data-swarm-zoom="fit">' + escapeHtml(tr('swarm.fitView', '适应画布')) + '</button>' +
                        '</div>'
                    ) : '') +
                '</div>';

            const workspaceHtml =
                '<div class="swarm-workspace">' +
                    '<section class="swarm-canvas-panel">' + canvasBarHtml + canvasBodyHtml + '</section>' +
                    renderInspectorHtml(st, selectedNode, now) +
                '</div>';

            const feedItems = (st.feed || []).slice().reverse().slice(0, 40);
            const feedBody = ui.feedCollapsed ? '' : (
                '<div class="swarm-feed-body">' +
                    (feedItems.length === 0
                        ? '<div style="padding:12px;text-align:center;font-size:12px;color:var(--text-secondary)">' + escapeHtml(tr('swarm.feedEmpty', '暂无关键协作事件')) + '</div>'
                        : feedItems.map(function (f) {
                            const fst = normalizeStatus(f.status || 'completed');
                            return '<button type="button" class="swarm-feed-row" data-swarm-feed-node="' + escapeHtml(f.nodeId || '') + '">' +
                                '<span class="swarm-feed-ts">' + escapeHtml(formatTimeShort(f.createdAt)) + '</span>' +
                                '<span class="swarm-pill swarm-pill--' + fst + '">' + escapeHtml(f.displayName || f.agentName || 'Agent') + '</span>' +
                                '<span class="swarm-feed-text">' + escapeHtml((f.title || f.eventType) + (f.summary ? (' · ' + f.summary) : '')) + '</span>' +
                            '</button>';
                        }).join('')) +
                '</div>'
            );
            const feedHtml =
                '<section class="swarm-feed-panel">' +
                    '<div class="swarm-feed-head">' +
                        '<span>' + escapeHtml(tr('swarm.feedTitle', '全局蜂群脉冲流（点击定位节点）')) + '</span>' +
                        '<button type="button" class="swarm-icon-btn" data-swarm-feed-toggle="1">' + escapeHtml(ui.feedCollapsed ? tr('swarm.expand', '展开') : tr('swarm.collapse', '收起')) + '</button>' +
                    '</div>' +
                    feedBody +
                '</section>';

            // 保存搜索焦点状态，避免重绘打断输入
            const activeEl = root.document.activeElement;
            const searchFocused = !!(activeEl && activeEl.dataset && activeEl.dataset.swarmSearch && container.contains(activeEl));
            const selStart = searchFocused ? activeEl.selectionStart : null;

            container.innerHTML = '<div class="swarm-board">' + kpiHtml + toolbarHtml + workspaceHtml + feedHtml + '</div>';
            bindBoardInteractions(container, st);

            if (searchFocused) {
                const nextSearch = container.querySelector('[data-swarm-search]');
                if (nextSearch) {
                    nextSearch.focus();
                    if (selStart != null && typeof nextSearch.setSelectionRange === 'function') {
                        nextSearch.setSelectionRange(selStart, selStart);
                    }
                }
            }
        }

        function bindBoardInteractions(container, state) {
            container.querySelectorAll('[data-swarm-view]').forEach(function (btn) {
                btn.onclick = function () {
                    ui.view = btn.getAttribute('data-swarm-view') || 'topology';
                    scheduleRender();
                };
            });
            container.querySelectorAll('[data-swarm-sfilter]').forEach(function (btn) {
                btn.onclick = function () {
                    ui.statusFilter = btn.getAttribute('data-swarm-sfilter') || 'all';
                    scheduleRender();
                };
            });
            const searchEl = container.querySelector('[data-swarm-search]');
            if (searchEl) {
                searchEl.oninput = function () {
                    ui.search = searchEl.value || '';
                    scheduleRender();
                };
            }
            const refreshBtn = container.querySelector('[data-swarm-refresh]');
            if (refreshBtn) {
                refreshBtn.onclick = function () {
                    if (state && state.conversationId) {
                        void fetchSwarmSnapshot(state.conversationId);
                    }
                };
            }
            const exportBtn = container.querySelector('[data-swarm-export]');
            if (exportBtn) {
                exportBtn.onclick = function () {
                    const theme = root.document.documentElement.getAttribute('data-theme') || 'light';
                    const svg = buildSwarmExportSvg(state, theme);
                    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = root.document.createElement('a');
                    a.href = url;
                    a.download = 'si-lens-swarm-' + (state.conversationId || 'run') + '.svg';
                    root.document.body.appendChild(a);
                    a.click();
                    a.remove();
                    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
                };
            }
            container.querySelectorAll('[data-swarm-node]').forEach(function (el) {
                el.onclick = function () {
                    ui.selectedNodeId = el.getAttribute('data-swarm-node') || '';
                    scheduleRender();
                };
            });
            container.querySelectorAll('[data-swarm-feed-node]').forEach(function (el) {
                el.onclick = function () {
                    const nid = el.getAttribute('data-swarm-feed-node');
                    if (nid) {
                        ui.selectedNodeId = nid;
                        scheduleRender();
                    }
                };
            });
            container.querySelectorAll('[data-swarm-dtab]').forEach(function (btn) {
                btn.onclick = function () {
                    ui.inspectorTab = btn.getAttribute('data-swarm-dtab') || 'trace';
                    scheduleRender();
                };
            });
            container.querySelectorAll('[data-swarm-tfilter]').forEach(function (btn) {
                btn.onclick = function () {
                    ui.traceFilter = btn.getAttribute('data-swarm-tfilter') || 'all';
                    scheduleRender();
                };
            });
            container.querySelectorAll('[data-swarm-detail]').forEach(function (btn) {
                btn.onclick = function () {
                    const pdId = btn.getAttribute('data-swarm-detail');
                    if (pdId) void fetchProcessDetailPayload(pdId);
                };
            });
            const feedToggle = container.querySelector('[data-swarm-feed-toggle]');
            if (feedToggle) {
                feedToggle.onclick = function () {
                    ui.feedCollapsed = !ui.feedCollapsed;
                    scheduleRender();
                };
            }
            container.querySelectorAll('[data-swarm-zoom]').forEach(function (btn) {
                btn.onclick = function () {
                    const kind = btn.getAttribute('data-swarm-zoom');
                    if (kind === 'in') ui.zoom = Math.min(1.6, Number((ui.zoom + 0.15).toFixed(2)));
                    else if (kind === 'out') ui.zoom = Math.max(0.5, Number((ui.zoom - 0.15).toFixed(2)));
                    else {
                        ui.zoom = 1;
                        ui.panX = 0;
                        ui.panY = 0;
                    }
                    scheduleRender();
                };
            });

            // 拓扑画布鼠标拖拽平移
            const viewport = container.querySelector('[data-swarm-viewport]');
            const stage = container.querySelector('[data-swarm-stage]');
            if (viewport && stage) {
                let dragging = false;
                let startX = 0;
                let startY = 0;
                let basePanX = 0;
                let basePanY = 0;
                const onMove = function (e) {
                    if (!dragging) return;
                    ui.panX = Math.round(basePanX + (e.clientX - startX));
                    ui.panY = Math.round(basePanY + (e.clientY - startY));
                    stage.style.transform = 'translate(' + ui.panX + 'px,' + ui.panY + 'px) scale(' + ui.zoom + ')';
                };
                const onUp = function () {
                    if (!dragging) return;
                    dragging = false;
                    viewport.classList.remove('is-panning');
                    root.window.removeEventListener('mousemove', onMove);
                    root.window.removeEventListener('mouseup', onUp);
                };
                viewport.onmousedown = function (e) {
                    if (e.button !== 0 || (e.target && e.target.closest && e.target.closest('[data-swarm-node]'))) {
                        return;
                    }
                    dragging = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    basePanX = ui.panX;
                    basePanY = ui.panY;
                    viewport.classList.add('is-panning');
                    root.window.addEventListener('mousemove', onMove);
                    root.window.addEventListener('mouseup', onUp);
                };
            }
        }

        root.openSwarmDashboard = async function (conversationId, focusNodeId) {
            const cid = String(conversationId || ui.conversationId || root.currentConversationId || '').trim();
            if (!cid) return;
            ui.conversationId = cid;
            if (focusNodeId) ui.selectedNodeId = String(focusNodeId);
            ui.zoom = 1;
            ui.panX = 0;
            ui.panY = 0;
            const titleEl = root.document.getElementById('swarm-drawer-title');
            if (titleEl) titleEl.textContent = tr('swarm.drawerTitle', '多代理蜂群看板');
            if (typeof root.openAppModal === 'function') {
                root.openAppModal('swarm-dashboard-modal', { focus: false });
            }
            renderBoardInto('swarm-drawer-root');
            await fetchSwarmSnapshot(cid);
        };

        root.closeSwarmDashboardModal = function () {
            if (typeof root.closeAppModal === 'function') {
                root.closeAppModal('swarm-dashboard-modal');
            }
            syncTimers();
        };

        root.initAgentsSwarmPage = async function () {
            const select = root.document.getElementById('swarm-page-conversation-select');
            const backBtn = root.document.getElementById('swarm-page-back-chat-btn');
            if (backBtn) {
                backBtn.onclick = function () {
                    const cid = ui.conversationId || (select ? select.value : '');
                    if (cid && typeof root.navigateToConversation === 'function') {
                        root.navigateToConversation(cid);
                    } else if (typeof root.switchPage === 'function') {
                        root.switchPage('chat');
                    }
                };
            }
            if (select && typeof root.apiFetch === 'function') {
                try {
                    const res = await root.apiFetch('/api/conversations?limit=30&offset=0');
                    if (res && res.ok) {
                        const data = await res.json();
                        const list = Array.isArray(data.conversations) ? data.conversations : [];
                        const preferred = ui.conversationId || root.currentConversationId || (list[0] && list[0].id) || '';
                        select.innerHTML = list.length === 0
                            ? '<option value="">' + escapeHtml(tr('swarm.noConversations', '暂无对话')) + '</option>'
                            : list.map(function (c) {
                                return '<option value="' + escapeHtml(c.id) + '">' + escapeHtml(truncateText(c.title || c.id, 46)) + '</option>';
                            }).join('');
                        if (preferred && list.some(function (c) { return c.id === preferred; })) {
                            select.value = preferred;
                        }
                        if (select.value) ui.conversationId = select.value;
                    }
                } catch (err) {
                    console.warn('加载蜂群对话列表失败:', err);
                }
                select.onchange = function () {
                    ui.conversationId = select.value || '';
                    ui.selectedNodeId = '';
                    renderBoardInto('swarm-page-root');
                    if (ui.conversationId) void fetchSwarmSnapshot(ui.conversationId);
                };
            }
            renderBoardInto('swarm-page-root');
            if (ui.conversationId) {
                await fetchSwarmSnapshot(ui.conversationId);
            }
        };

        root.refreshAgentsSwarmPage = function () {
            if (ui.conversationId) {
                void fetchSwarmSnapshot(ui.conversationId);
            } else {
                void root.initAgentsSwarmPage();
            }
        };

        root.window.addEventListener('conversation-changed', function (e) {
            const cid = e && e.detail && e.detail.conversationId ? String(e.detail.conversationId).trim() : '';
            ui.conversationId = cid;
            ui.selectedNodeId = '';
            ui.zoom = 1;
            ui.panX = 0;
            ui.panY = 0;
            renderChatStrip();
            if (cid) {
                void fetchSwarmSnapshot(cid, { silent: true });
            } else {
                scheduleRender();
            }
        });

        root.window.addEventListener('si-lens-swarm-event', function (e) {
            const detail = e && e.detail ? e.detail : {};
            const ev = detail.event;
            const cid = String(detail.conversationId || (ev && ev.data && ev.data.conversationId) || ui.conversationId || root.currentConversationId || '').trim();
            if (!cid || !ev) return;
            ui.lastLiveStreamAt = Date.now();
            if (!ui.conversationId) ui.conversationId = cid;
            const st = ensureStateFor(cid);
            if (!st) return;
            if (applySwarmStreamEvent(st, ev, Date.now()) && cid === ui.conversationId) {
                if (!ui.selectedNodeId && st.nodes.length > 0) {
                    ui.selectedNodeId = st.nodes[0].id;
                }
                scheduleRender();
            }
        });

        root.window.addEventListener('languageChanged', function () {
            scheduleRender();
        });
    }

    return {
        createSwarmState: createSwarmState,
        hydrateSwarmSnapshot: hydrateSwarmSnapshot,
        applySwarmStreamEvent: applySwarmStreamEvent,
        filterSwarmNodes: filterSwarmNodes,
        computeTopologyLayout: computeTopologyLayout,
        computeTimelineBars: computeTimelineBars,
        buildSwarmExportSvg: buildSwarmExportSvg,
        formatDurationMs: formatDurationMs,
        formatCompactTokens: formatCompactTokens
    };
});
