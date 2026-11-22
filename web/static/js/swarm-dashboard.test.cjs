const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const {
    createSwarmState,
    hydrateSwarmSnapshot,
    applySwarmStreamEvent,
    filterSwarmNodes,
    computeTopologyLayout,
    computeTimelineBars,
    buildSwarmExportSvg,
    formatDurationMs,
    formatCompactTokens
} = require('./swarm-dashboard.js');

test('hydrateSwarmSnapshot 正确填充节点、连线、脉冲流与汇总统', () => {
    const state = hydrateSwarmSnapshot(createSwarmState('conv-1'), {
        conversationId: 'conv-1',
        title: 'API 授权绕过测试',
        orchestration: 'plan_execute',
        running: false,
        startedAt: '2026-11-22T10:00:00Z',
        updatedAt: '2026-11-22T10:02:00Z',
        nodes: [
            {
                id: 'run-main',
                agentName: 'main',
                displayName: '协调主代理',
                role: 'orchestrator',
                status: 'completed',
                toolCount: 2,
                tokenUsage: { totalTokens: 1200, promptTokens: 800, completionTokens: 400, modelCalls: 2 }
            },
            {
                id: 'run-sub-a',
                parentId: 'run-main',
                parentToolCallId: 'tc-1',
                agentName: 'recon',
                displayName: '资产测绘',
                role: 'subagent',
                status: 'completed',
                taskBrief: '扫描目标端口与接口路径',
                resultPreview: '发现 /api/v1/admin 未鉴权接口',
                toolCount: 3,
                tokenUsage: { totalTokens: 850, promptTokens: 500, completionTokens: 350, modelCalls: 1 }
            }
        ],
        edges: [
            { id: 'e1', source: 'run-main', target: 'run-sub-a', toolCallId: 'tc-1', label: 'task', kind: 'task', status: 'completed', durationMs: 4200 }
        ],
        feed: [
            { id: 'f1', nodeId: 'run-sub-a', displayName: '资产测绘', title: '完成测绘', status: 'completed', createdAt: '2026-11-22T10:01:00Z' }
        ]
    });

    assert.equal(state.title, 'API 授权绕过测试');
    assert.equal(state.orchestration, 'plan_execute');
    assert.equal(state.nodes.length, 2);
    assert.equal(state.edges.length, 1);
    assert.equal(state.feed.length, 1);
    assert.equal(state.summary.totalNodes, 2);
    assert.equal(state.summary.completedNodes, 2);
    assert.equal(state.summary.totalTools, 5);
    assert.equal(state.summary.totalTokens, 2050);
});

test('applySwarmStreamEvent 精确关联并行同名子代理且不互相覆盖', () => {
    const state = createSwarmState('conv-parallel', { running: true });
    const t0 = Date.parse('2026-11-22T12:00:00Z');

    assert.equal(applySwarmStreamEvent(state, {
        type: 'swarm_agent_start',
        data: { runId: 'main-1', agentName: 'main', agentDisplayName: '主编排代理' }
    }, t0), true);

    assert.equal(applySwarmStreamEvent(state, {
        type: 'tool_call',
        data: {
            runId: 'main-1',
            toolCallId: 'tc-scan-1',
            toolName: 'task',
            arguments: JSON.stringify({ agent: 'scanner', task: '扫描 8080 端口服务' })
        }
    }, t0 + 100), true);

    assert.equal(applySwarmStreamEvent(state, {
        type: 'tool_call',
        data: {
            runId: 'main-1',
            toolCallId: 'tc-scan-2',
            toolName: 'task',
            arguments: JSON.stringify({ agent: 'scanner', task: '检测 /graphql 内省泄露' })
        }
    }, t0 + 150), true);

    // 两个同名 scanner 子代理按不同 runId + parentToolCallId 并发启动
    applySwarmStreamEvent(state, {
        type: 'swarm_agent_start',
        data: {
            runId: 'sub-run-1',
            parentRunId: 'main-1',
            parentToolCallId: 'tc-scan-1',
            isSubagent: true,
            agentName: 'scanner',
            agentDisplayName: '扫描子代理 #1',
            delegationTool: 'task'
        }
    }, t0 + 200);

    applySwarmStreamEvent(state, {
        type: 'swarm_agent_start',
        data: {
            runId: 'sub-run-2',
            parentRunId: 'main-1',
            parentToolCallId: 'tc-scan-2',
            isSubagent: true,
            agentName: 'scanner',
            agentDisplayName: '扫描子代理 #2',
            delegationTool: 'task'
        }
    }, t0 + 220);

    applySwarmStreamEvent(state, {
        type: 'tool_call',
        data: { runId: 'sub-run-1', isSubagent: true, agentName: 'scanner', toolCallId: 'sub1-tc-1', toolName: 'nmap_scan' }
    }, t0 + 500);

    applySwarmStreamEvent(state, {
        type: 'agent_usage_summary',
        data: {
            runId: 'sub-run-2',
            isSubagent: true,
            agentName: 'scanner',
            model: 'deepseek-flash',
            modelCalls: 1,
            promptTokens: 300,
            completionTokens: 120,
            totalTokens: 420
        }
    }, t0 + 900);

    applySwarmStreamEvent(state, {
        type: 'swarm_agent_end',
        data: {
            runId: 'sub-run-1',
            parentRunId: 'main-1',
            parentToolCallId: 'tc-scan-1',
            isSubagent: true,
            agentName: 'scanner',
            status: 'completed',
            durationMs: 1800,
            resultPreview: '8080 开放 HTTP 服务'
        }
    }, t0 + 2000);

    applySwarmStreamEvent(state, {
        type: 'swarm_agent_end',
        data: {
            runId: 'sub-run-2',
            parentRunId: 'main-1',
            parentToolCallId: 'tc-scan-2',
            isSubagent: true,
            agentName: 'scanner',
            status: 'failed',
            durationMs: 1200,
            error: 'connection refused'
        }
    }, t0 + 1420);

    assert.equal(state.nodes.length, 3);
    assert.equal(state.edges.length, 2);

    const sub1 = state._nodeMap.get('sub-run-1');
    const sub2 = state._nodeMap.get('sub-run-2');
    assert.ok(sub1 && sub2);
    assert.equal(sub1.taskBrief, '扫描 8080 端口服务');
    assert.equal(sub2.taskBrief, '检测 /graphql 内省泄露');
    assert.equal(sub1.toolCount, 1);
    assert.equal(sub2.tokenUsage.totalTokens, 420);
    assert.equal(sub1.status, 'completed');
    assert.equal(sub2.status, 'failed');
    assert.equal(state.summary.completedNodes, 1);
    assert.equal(state.summary.failedNodes, 1);
    assert.equal(state.summary.runningNodes, 1);
});

test('filterSwarmNodes 支持状态与关键字联合筛选', () => {
    const nodes = [
        { id: '1', displayName: '主编排', agentName: 'main', status: 'running', currentTool: 'task' },
        { id: '2', displayName: 'SQL注入验证', agentName: 'sqli', status: 'completed', resultPreview: '确认存在盲注' },
        { id: '3', displayName: '越权检测', agentName: 'idor', status: 'cancelled', taskBrief: '测试 /users/2' },
        { id: '4', displayName: '漏洞利用', agentName: 'exploit', status: 'failed', currentActivity: 'timeout' }
    ];

    assert.equal(filterSwarmNodes(nodes, { statusFilter: 'all', search: '' }).length, 4);
    assert.deepEqual(filterSwarmNodes(nodes, { statusFilter: 'failed' }).map((n) => n.id), ['3', '4']);
    assert.deepEqual(filterSwarmNodes(nodes, { statusFilter: 'completed', search: '盲注' }).map((n) => n.id), ['2']);
    assert.deepEqual(filterSwarmNodes(nodes, { search: 'idor' }).map((n) => n.id), ['3']);
});

test('computeTopologyLayout 超过 3 个子节点自动换行且生成有效连线', () => {
    const nodes = [
        { id: 'root', parentId: '', displayName: 'Root' },
        { id: 'c1', parentId: 'root', displayName: 'C1' },
        { id: 'c2', parentId: 'root', displayName: 'C2' },
        { id: 'c3', parentId: 'root', displayName: 'C3' },
        { id: 'c4', parentId: 'root', displayName: 'C4' }
    ];
    const edges = [
        { id: 'e1', source: 'root', target: 'c1', status: 'completed' },
        { id: 'e4', source: 'root', target: 'c4', status: 'running' }
    ];

    const layout = computeTopologyLayout(nodes, edges);
    assert.equal(layout.positions.size, 5);
    assert.equal(layout.edges.length, 2);
    assert.ok(layout.edges[0].d.startsWith('M '));

    const pos1 = layout.positions.get('c1');
    const pos4 = layout.positions.get('c4');
    assert.ok(pos4.y > pos1.y, '第 4 个子节点应换行到第二行');
});

test('computeTimelineBars 计算百分比区间与持续时间', () => {
    const t0 = Date.parse('2026-11-22T12:00:00Z');
    const res = computeTimelineBars([
        { id: 'n1', status: 'completed', startedAt: '2026-11-22T12:00:00Z', endedAt: '2026-11-22T12:00:10Z', durationMs: 10000 },
        { id: 'n2', status: 'running', startedAt: '2026-11-22T12:00:05Z', endedAt: null, durationMs: 0 }
    ], '2026-11-22T12:00:00Z', t0 + 20000);

    assert.equal(res.bars.length, 2);
    assert.equal(res.bars[0].leftPct, 0);
    assert.ok(res.bars[1].leftPct >= 24 && res.bars[1].leftPct <= 26);
    assert.equal(res.bars[1].durationMs, 15000);
});

test('buildSwarmExportSvg 正确转义 XML 特殊字符并保留布局结构', () => {
    const svg = buildSwarmExportSvg({
        conversationId: 'conv-xss',
        title: '测试 <script>alert(1)</script> & "引号"',
        nodes: [
            {
                id: 'n1',
                agentName: 'main',
                displayName: '主代理 <tag>',
                status: 'running',
                toolCount: 1,
                iterationCount: 2,
                tokenUsage: { totalTokens: 500 },
                currentActivity: 'run "nmap" & grep'
            }
        ],
        edges: []
    }, 'light');

    assert.match(svg, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    assert.doesNotMatch(svg, /<script>/);
    assert.match(svg, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
    assert.match(svg, /&amp; &quot;引号&quot;/);
});

test('时间与 Token 紧凑格式化输出正确', () => {
    assert.equal(formatDurationMs(450), '450ms');
    assert.equal(formatDurationMs(3240), '3s');
    assert.equal(formatDurationMs(65000), '1m 5s');
    assert.equal(formatDurationMs(7380000), '2h 3m');
    assert.equal(formatCompactTokens(850), '850');
    assert.equal(formatCompactTokens(1250), '1.3k');
    assert.equal(formatCompactTokens(1500000), '1.5M');
});

test('前端页面、路由、权限、监控与 i18n 接入完整一致', () => {
    const html = fs.readFileSync('web/templates/index.html', 'utf8');
    const modalJs = fs.readFileSync('web/static/js/modal.js', 'utf8');
    const routerJs = fs.readFileSync('web/static/js/router.js', 'utf8');
    const authJs = fs.readFileSync('web/static/js/auth.js', 'utf8');
    const monitorJs = fs.readFileSync('web/static/js/monitor.js', 'utf8');
    const chatJs = fs.readFileSync('web/static/js/chat.js', 'utf8');
    const swarmJs = fs.readFileSync('web/static/js/swarm-dashboard.js', 'utf8');
    const swarmCss = fs.readFileSync('web/static/css/swarm-dashboard.css', 'utf8');

    assert.match(html, /swarm-dashboard\.css/);
    assert.match(html, /swarm-dashboard\.js/);
    assert.match(html, /id="chat-swarm-strip"/);
    assert.match(html, /id="page-agents-swarm"/);
    assert.match(html, /id="swarm-dashboard-modal"/);
    assert.match(html, /id="swarm-dashboard-menu-item"/);
    assert.match(html, /data-page="agents-swarm"/);
    assert.match(html, /<button[^>]+id="chat-return-latest"[\s\S]*?<\/button>\s*<div id="agent-plan-progress"/);

    assert.match(modalJs, /'swarm-dashboard-modal'/);
    assert.equal((routerJs.match(/'agents-swarm'/g) || []).length >= 4, true);
    assert.match(routerJs, /initAgentsSwarmPage/);
    assert.match(authJs, /'agents-swarm':\s*'agents:read'/);
    assert.match(monitorJs, /si-lens-swarm-event/);
    assert.match(monitorJs, /case 'swarm_agent_start':/);
    assert.match(chatJs, /swarm_agent_start/);
    assert.match(chatJs, /swarm-dashboard-menu-item/);
    assert.match(chatJs, /window\.showSwarmFromContext\s*=/);
    assert.match(swarmCss, /\.chat-swarm-chip__count/);
    assert.match(swarmJs, /class="chat-swarm-chip__count"/);

    const usedKeys = new Set();
    for (const m of swarmJs.matchAll(/tr\('(swarm\.[^']+)'/g)) {
        usedKeys.add(m[1]);
    }
    for (const m of html.matchAll(/data-i18n="((?:swarm|nav\.agentsSwarm|contextMenu\.viewSwarm)[^"]*)"/g)) {
        usedKeys.add(m[1]);
    }

    for (const locale of ['zh-CN', 'en-US', 'ru-RU', 'ar-SA']) {
        const json = JSON.parse(fs.readFileSync(`web/static/i18n/${locale}.json`, 'utf8'));
        for (const key of usedKeys) {
            const parts = key.split('.');
            let cur = json;
            for (const p of parts) {
                cur = cur && typeof cur === 'object' ? cur[p] : undefined;
            }
            assert.equal(typeof cur, 'string', `${locale}.json 缺少翻译键: ${key}`);
            assert.ok(cur.length > 0, `${locale}.json 翻译键为空: ${key}`);
        }
    }
});
