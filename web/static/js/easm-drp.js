/* EASM (Attack Surface Management) & DRP (Digital Risk & Leak Monitor) Frontend Controller */
(function (global) {
    'use strict';

    const EASM_CHANGE_LABELS = {
        NEW_SHADOW_ASSET: '新增影子资产',
        NEW_PORT: '新增暴露端口',
        SERVICE_CHANGED: '服务指纹漂移',
        HIGH_RISK_EXPOSURE: '高危暴露风险',
        CERT_EXPIRED: 'TLS 证书异常',
        EXPOSURE_ASSESSED: '暴露面安全验证'
    };

    const EASM_STATUS_LABELS = {
        open: '待研判',
        assigned: '已认领',
        fixing: '整改中',
        verifying: '待复测',
        closed: '已收敛',
        false_positive: '误报'
    };

    const DRP_CHANNEL_META = {
        code_repo: { label: '代码仓库', desc: 'GitHub / Gitee / GitLab' },
        cloud_drive: { label: '云盘监测', desc: '≥9 类公开云盘分享' },
        doc_library: { label: '文库监测', desc: '≥6 类公开文库文档' },
        darkweb_cti: { label: '暗网论坛', desc: '授权情报源映射茶马古道 / BreachedForums 等' },
        stealer_cti: { label: '失窃数据', desc: '授权凭据情报，入库前强制脱敏' },
        platform_email: { label: '平台与邮箱', desc: '新媒体、应用市场与企业邮箱' }
    };

    const DRP_TRIAGE_LABELS = {
        new: '待核实',
        confirmed: '确认泄露',
        remediated: '已处置',
        ignored: '误报已忽略'
    };

    const SEVERITY_LABELS = {
        critical: '严重',
        high: '高危',
        medium: '中危',
        low: '低危',
        info: '提示'
    };

    const state = {
        easmDashboard: null,
        easmAssets: [],
        easmAssetFilter: { isShadow: '', riskLevel: '', q: '' },
        convergenceItems: [],
        convergenceView: 'kanban',
        activeTicket: null,
        drpOverview: null,
        drpEvents: [],
        drpEventFilter: { channelGroup: 'all', triageStatus: 'all', severity: 'all', q: '' },
        activeDrpEvent: null,
        drpRules: [],
        drpConnectors: [],
        drpSources: []
    };

    function esc(value) {
        if (typeof global.escapeHtml === 'function') {
            return global.escapeHtml(value == null ? '' : String(value));
        }
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function fmtTime(ts) {
        if (!ts) return '尚未同步';
        const d = new Date(ts);
        if (Number.isNaN(d.getTime())) return String(ts);
        return d.toLocaleString();
    }

    function toast(msg) {
        if (typeof global.showInlineToast === 'function') {
            global.showInlineToast(msg, { duration: 4000 });
        }
    }

    async function fetchJSON(url, options) {
        const fetcher = typeof global.apiFetch === 'function' ? global.apiFetch : fetch;
        const resp = await fetcher(url, options);
        const text = await resp.text();
        let data = {};
        try {
            data = text ? JSON.parse(text) : {};
        } catch (err) {
            data = { error: text };
        }
        if (!resp.ok) {
            throw new Error(data.error || text || ('HTTP ' + resp.status));
        }
        return data;
    }

    // =========================================================================
    // EASM Overview Dashboard
    // =========================================================================

    async function loadEASMOverview() {
        try {
            const [dash, assetsResp] = await Promise.all([
                fetchJSON('/api/v1/easm/dashboard'),
                fetchJSON(buildEASMAssetQueryURL())
            ]);
            state.easmDashboard = dash;
            state.easmAssets = assetsResp.assets || [];
            renderEASMDashboard(dash);
            renderEASMAssetTable(state.easmAssets);
        } catch (err) {
            console.error('加载暴露面治理大盘失败:', err);
            toast('加载暴露面数据失败: ' + err.message);
        }
    }

    function buildEASMAssetQueryURL() {
        const params = new URLSearchParams();
        if (state.easmAssetFilter.isShadow !== '') params.set('is_shadow', state.easmAssetFilter.isShadow);
        if (state.easmAssetFilter.riskLevel) params.set('risk_level', state.easmAssetFilter.riskLevel);
        if (state.easmAssetFilter.q) params.set('q', state.easmAssetFilter.q);
        params.set('page_size', '50');
        return '/api/v1/easm/assets?' + params.toString();
    }

    function renderEASMDashboard(dash) {
        const setText = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        setText('easm-kpi-active', Number(dash.active_assets || 0).toLocaleString());
        setText('easm-kpi-total-sub', `累计纳管 ${Number(dash.total_assets || 0)} 项资产`);
        setText('easm-kpi-shadow', Number(dash.shadow_assets || 0).toLocaleString());
        setText('easm-kpi-weekly', Number(dash.weekly_changes || 0).toLocaleString());
        setText('easm-kpi-open-sub', `待收敛工单 ${Number(dash.open_convergence || 0)} 条`);

        const rate = Math.max(0, Math.min(100, Number(dash.convergence_rate || 0)));
        setText('easm-kpi-rate-text', rate.toFixed(0) + '%');
        setText('easm-kpi-mttr', `平均收敛时长 MTTR：${Number(dash.mttr_hours || 0).toFixed(1)}h`);
        const ring = document.getElementById('easm-kpi-ring-fg');
        if (ring) {
            const r = 27;
            const c = 2 * Math.PI * r;
            ring.setAttribute('stroke-dasharray', c.toFixed(2));
            ring.setAttribute('stroke-dashoffset', (c * (1 - rate / 100)).toFixed(2));
        }

        renderEASMTrendChart(dash.trend_30d || []);
        renderEASMTopPorts(dash.top_exposed_ports || []);
        renderEASMTimeline(dash.recent_timeline || []);
    }

    function renderEASMTrendChart(points) {
        const root = document.getElementById('easm-trend-chart');
        if (!root) return;
        if (!points.length) {
            root.innerHTML = '<div class="muted">暂无近 30 天趋势数据</div>';
            return;
        }
        const width = 640, height = 210, left = 34, right = 14, top = 16, bottom = 26;
        const pw = width - left - right;
        const ph = height - top - bottom;
        const maxVal = Math.max(1, ...points.flatMap(p => [Number(p.new_exposures || 0), Number(p.converged_risk || 0)]));
        const x = i => left + (points.length === 1 ? pw / 2 : (i / (points.length - 1)) * pw);
        const y = v => top + ph - (Number(v || 0) / maxVal) * ph;

        const grid = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const gy = top + ph * ratio;
            const val = Math.round(maxVal * (1 - ratio));
            return `<line x1="${left}" y1="${gy}" x2="${width - right}" y2="${gy}"/><text x="${left - 8}" y="${gy + 4}" text-anchor="end">${val}</text>`;
        }).join('');

        const newCoords = points.map((p, i) => `${x(i).toFixed(1)},${y(p.new_exposures).toFixed(1)}`);
        const closedCoords = points.map((p, i) => `${x(i).toFixed(1)},${y(p.converged_risk).toFixed(1)}`);
        const newArea = `M ${x(0).toFixed(1)} ${top + ph} L ${newCoords.join(' L ')} L ${x(points.length - 1).toFixed(1)} ${top + ph} Z`;

        const labelIdx = [...new Set([0, Math.floor((points.length - 1) / 2), points.length - 1])];
        const xLabels = labelIdx.map(i => `<text x="${x(i)}" y="${height - 6}" text-anchor="${i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}">${esc(String(points[i].date || '').slice(5))}</text>`).join('');

        root.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="近30天新增暴露与已收敛风险趋势">
            <g class="easm-chart-grid">${grid}${xLabels}</g>
            <path d="${newArea}" fill="rgba(245,158,11,0.12)"/>
            <polyline points="${newCoords.join(' ')}" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="${closedCoords.join(' ')}" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    }

    function renderEASMTopPorts(items) {
        const root = document.getElementById('easm-top-ports');
        if (!root) return;
        if (!items.length) {
            root.innerHTML = '<div class="muted">暂无暴露端口统计，点击右上角「触发增量测绘」开始发现。</div>';
            return;
        }
        const max = Math.max(1, ...items.map(i => Number(i.count || 0)));
        root.innerHTML = items.map(item => {
            const pct = Math.max(6, Math.round((Number(item.count || 0) / max) * 100));
            const label = `${item.port}/${item.service_name || 'unknown'}`;
            return `<div class="easm-port-bar-row">
                <span class="easm-port-bar-label" title="${esc(label)}">${esc(label)}</span>
                <div class="easm-port-bar-track"><div class="easm-port-bar-fill ${item.high_risk ? 'is-high-risk' : ''}" style="width:${pct}%"></div></div>
                <span class="easm-port-bar-count">${Number(item.count || 0)}</span>
            </div>`;
        }).join('');
    }

    function renderEASMTimeline(items) {
        const root = document.getElementById('easm-drift-timeline');
        if (!root) return;
        if (!items.length) {
            root.innerHTML = '<div class="muted">暂无暴露面变更动态。</div>';
            return;
        }
        root.innerHTML = items.map(item => {
            const summary = item.diff_detail?.summary || `${EASM_CHANGE_LABELS[item.change_type] || item.change_type}：${item.asset_identifier}`;
            return `<div class="easm-timeline-item" onclick="openEASMConvergenceDrawer(${item.id})">
                <div class="easm-timeline-main">
                    <div class="easm-timeline-title">
                        <span class="easm-badge easm-badge--${esc(item.asset_risk_level || 'medium')}">${esc(EASM_CHANGE_LABELS[item.change_type] || item.change_type)}</span>
                        <span>${esc(summary)}</span>
                    </div>
                    <div class="easm-timeline-meta">${esc(fmtTime(item.created_at))} · 资产：${esc(item.asset_identifier || '-')} · 责任人：${esc(item.assignee || '未指派')}</div>
                </div>
                <span class="easm-badge easm-badge--${esc(item.convergence_status)}">${esc(EASM_STATUS_LABELS[item.convergence_status] || item.convergence_status)}</span>
            </div>`;
        }).join('');
    }

    function renderEASMAssetTable(assets) {
        const body = document.getElementById('easm-assets-tbody');
        if (!body) return;
        if (!assets.length) {
            body.innerHTML = '<tr><td colspan="7" class="muted">暂无暴露面资产，点击右上角「触发增量测绘」发现资产。</td></tr>';
            return;
        }
        body.innerHTML = assets.map(a => {
            const shadowTag = a.is_shadow ? '<span class="easm-badge easm-badge--shadow">影子资产</span>' : '<span class="easm-badge easm-badge--closed">基线已登记</span>';
            const claimBtn = a.is_shadow
                ? `<button type="button" class="btn-link" onclick="claimShadowAsset(${a.id})">认领归属</button>`
                : '<span class="muted">已纳管</span>';
            return `<tr>
                <td><code>${esc(a.identifier)}</code></td>
                <td>${esc(a.ip_address || '-')}</td>
                <td>${esc(a.service_name || '-')}${a.port ? ':' + Number(a.port) : ''}</td>
                <td>${shadowTag}</td>
                <td><span class="easm-badge easm-badge--${esc(a.risk_level)}">${esc(SEVERITY_LABELS[a.risk_level] || a.risk_level)}</span></td>
                <td>${esc(a.owner_dept || '未分配')}</td>
                <td>${claimBtn}</td>
            </tr>`;
        }).join('');
    }

    async function triggerEASMExposureAssess() {
        const input = document.getElementById('easm-scan-domain');
        const targetDomain = (input?.value || '').trim();
        const btn = document.getElementById('easm-assess-btn');
        const originalText = btn ? btn.textContent : '';
        if (btn) {
            btn.disabled = true;
            btn.textContent = '安全验证中...';
        }
        try {
            const path = targetDomain ? '/api/v1/easm/scans/trigger' : '/api/v1/easm/assess';
            const body = targetDomain ? { target_domain: targetDomain, assess: true } : {};
            const res = await fetchJSON(path, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const engines = (res.engines_used || []).join(', ') || 'builtin';
            let msg = `暴露面安全验证完成（${engines}）：复核 ${res.discovered_count || 0} 项资产，新建收敛工单 ${res.convergence_created || 0} 条`;
            if (Array.isArray(res.warnings) && res.warnings.length) {
                msg += `；提示：${res.warnings.join('；')}`;
            }
            toast(msg);
            await loadEASMOverview();
        } catch (err) {
            toast('暴露面安全验证失败: ' + err.message);
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        }
    }

    async function triggerEASMIncrementalScan() {
        const input = document.getElementById('easm-scan-domain');
        const targetDomain = (input?.value || '').trim();
        if (!targetDomain) {
            toast('请输入要测绘的真实域名、主机名或 IP 地址');
            return;
        }
        const btn = document.getElementById('easm-trigger-scan-btn');
        const originalText = btn ? btn.textContent : '';
        if (btn) {
            btn.disabled = true;
            btn.textContent = '测绘探测中...';
        }
        try {
            const res = await fetchJSON('/api/v1/easm/scans/trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_domain: targetDomain })
            });
            let msg = `测绘完成（${res.execution_mode || 'probe'}）：发现 ${res.discovered_count || 0} 项资产，影子资产 ${res.shadow_assets_count || 0} 项，新建收敛工单 ${res.convergence_created || 0} 条`;
            if (Array.isArray(res.warnings) && res.warnings.length) {
                msg += `；提示：${res.warnings.join('；')}`;
            }
            toast(msg);
            await loadEASMOverview();
        } catch (err) {
            toast('触发资产测绘失败: ' + err.message);
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        }
    }

    async function claimShadowAsset(assetId) {
        const dept = global.prompt ? global.prompt('请输入资产归属部门 / 业务系统名称：', '核心业务研发部') : '核心业务研发部';
        if (dept == null) return;
        try {
            await fetchJSON(`/api/v1/easm/assets/${assetId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_shadow: false, owner_dept: dept.trim() || '已认领部门' })
            });
            toast('已认领影子资产并更新基线归属');
            await loadEASMOverview();
        } catch (err) {
            toast('认领失败: ' + err.message);
        }
    }

    function applyEASMAssetFilters() {
        state.easmAssetFilter.isShadow = document.getElementById('easm-filter-shadow')?.value || '';
        state.easmAssetFilter.riskLevel = document.getElementById('easm-filter-risk')?.value || '';
        state.easmAssetFilter.q = (document.getElementById('easm-filter-q')?.value || '').trim();
        loadEASMOverview();
    }

    // =========================================================================
    // EASM Risk Convergence Workbench (Kanban & Table + Diff Drawer)
    // =========================================================================

    async function loadEASMConvergence() {
        try {
            const status = document.getElementById('easm-conv-status-filter')?.value || '';
            const q = (document.getElementById('easm-conv-search')?.value || '').trim();
            const params = new URLSearchParams({ page_size: '100' });
            if (status) params.set('status', status);
            if (q) params.set('q', q);
            const data = await fetchJSON('/api/v1/easm/convergence?' + params.toString());
            state.convergenceItems = data.items || [];
            renderEASMConvergence();
        } catch (err) {
            console.error('加载风险收敛工作台失败:', err);
            toast('加载收敛工单失败: ' + err.message);
        }
    }

    function switchEASMConvergenceView(mode) {
        state.convergenceView = mode === 'list' ? 'list' : 'kanban';
        document.querySelectorAll('#easm-conv-view-switch button').forEach(btn => {
            btn.classList.toggle('is-active', btn.dataset.view === state.convergenceView);
        });
        renderEASMConvergence();
    }

    function renderEASMConvergence() {
        const kanbanEl = document.getElementById('easm-convergence-kanban');
        const listEl = document.getElementById('easm-convergence-list-wrap');
        if (!kanbanEl || !listEl) return;

        if (state.convergenceView === 'kanban') {
            kanbanEl.hidden = false;
            listEl.hidden = true;
            renderEASMKanban(kanbanEl, state.convergenceItems);
        } else {
            kanbanEl.hidden = true;
            listEl.hidden = false;
            renderEASMConvergenceTable(state.convergenceItems);
        }
    }

    function renderEASMKanban(root, items) {
        const columns = [
            { key: 'open', title: '待研判' },
            { key: 'fixing', title: '整改中 / 已认领', matches: ['assigned', 'fixing'] },
            { key: 'verifying', title: '待复测' },
            { key: 'closed', title: '已收敛 / 误报', matches: ['closed', 'false_positive'] }
        ];
        root.innerHTML = columns.map(col => {
            const matched = items.filter(it => (col.matches ? col.matches.includes(it.convergence_status) : it.convergence_status === col.key));
            const cards = matched.map(it => {
                const summary = it.diff_detail?.summary || it.change_type;
                return `<article class="easm-kanban-card" draggable="true" data-ticket-id="${it.id}"
                    ondragstart="onEASMCardDragStart(event, ${it.id})"
                    onclick="openEASMConvergenceDrawer(${it.id})">
                    <div class="easm-kanban-card-title">${esc(it.asset_identifier || ('#' + it.asset_id))}</div>
                    <div class="easm-kanban-card-desc">${esc(summary)}</div>
                    <div class="easm-kanban-card-foot">
                        <span class="easm-badge easm-badge--${esc(it.asset_risk_level || 'medium')}">${esc(EASM_CHANGE_LABELS[it.change_type] || it.change_type)}</span>
                        <span>${esc(it.assignee || '未指派')}</span>
                    </div>
                </article>`;
            }).join('') || '<div class="muted" style="font-size:12px;padding:8px;">暂无工单</div>';
            return `<section class="easm-kanban-col" data-target-status="${col.key}"
                ondragover="event.preventDefault();this.classList.add('is-drag-over')"
                ondragleave="this.classList.remove('is-drag-over')"
                ondrop="onEASMColumnDrop(event, '${col.key}')">
                <div class="easm-kanban-col-head"><span>${esc(col.title)}</span><span class="easm-kanban-count">${matched.length}</span></div>
                ${cards}
            </section>`;
        }).join('');
    }

    function renderEASMConvergenceTable(items) {
        const tbody = document.getElementById('easm-convergence-tbody');
        if (!tbody) return;
        if (!items.length) {
            tbody.innerHTML = '<tr><td colspan="6" class="muted">暂无暴露面变更工单。</td></tr>';
            return;
        }
        tbody.innerHTML = items.map(it => `<tr>
            <td><code>${esc(it.asset_identifier || ('#' + it.asset_id))}</code></td>
            <td><span class="easm-badge easm-badge--${esc(it.asset_risk_level || 'medium')}">${esc(EASM_CHANGE_LABELS[it.change_type] || it.change_type)}</span></td>
            <td>${esc(it.diff_detail?.summary || '-')}</td>
            <td>${esc(it.assignee || '未指派')}</td>
            <td><span class="easm-badge easm-badge--${esc(it.convergence_status)}">${esc(EASM_STATUS_LABELS[it.convergence_status] || it.convergence_status)}</span></td>
            <td><button type="button" class="btn-link" onclick="openEASMConvergenceDrawer(${it.id})">查看 Diff / 处置</button></td>
        </tr>`).join('');
    }

    function onEASMCardDragStart(event, ticketId) {
        if (event.dataTransfer) {
            event.dataTransfer.setData('text/plain', String(ticketId));
        }
    }

    async function onEASMColumnDrop(event, targetStatus) {
        event.preventDefault();
        event.currentTarget?.classList.remove('is-drag-over');
        const id = Number(event.dataTransfer?.getData('text/plain'));
        if (!id) return;
        try {
            await fetchJSON(`/api/v1/easm/convergence/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ convergence_status: targetStatus })
            });
            toast(`工单 #${id} 状态已更新为「${EASM_STATUS_LABELS[targetStatus] || targetStatus}」`);
            await loadEASMConvergence();
        } catch (err) {
            toast('流转状态失败: ' + err.message);
        }
    }

    async function openEASMConvergenceDrawer(ticketId) {
        let ticket = state.convergenceItems.find(i => i.id === ticketId) ||
            (state.easmDashboard?.recent_timeline || []).find(i => i.id === ticketId);
        if (!ticket) {
            const data = await fetchJSON('/api/v1/easm/convergence?page_size=100');
            state.convergenceItems = data.items || [];
            ticket = state.convergenceItems.find(i => i.id === ticketId);
        }
        if (!ticket) return;
        state.activeTicket = ticket;

        const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
        setText('easm-drawer-title', `${ticket.asset_identifier || ('工单 #' + ticket.id)}`);
        setText('easm-drawer-subtitle', `${EASM_CHANGE_LABELS[ticket.change_type] || ticket.change_type} · 创建于 ${fmtTime(ticket.created_at)}`);
        setText('easm-diff-before', JSON.stringify(ticket.diff_detail?.before || {}, null, 2));
        setText('easm-diff-after', JSON.stringify(ticket.diff_detail?.after || {}, null, 2));

        const assigneeInput = document.getElementById('easm-drawer-assignee');
        if (assigneeInput) assigneeInput.value = ticket.assignee || '';
        const statusSelect = document.getElementById('easm-drawer-status');
        if (statusSelect) statusSelect.value = ticket.convergence_status || 'open';

        const retestEl = document.getElementById('easm-drawer-retest-result');
        if (retestEl) {
            retestEl.textContent = ticket.retest_result && Object.keys(ticket.retest_result).length
                ? JSON.stringify(ticket.retest_result, null, 2)
                : '尚未发起自动化复测验证';
        }

        if (typeof global.openAppModal === 'function') global.openAppModal('easm-convergence-drawer');
        else document.getElementById('easm-convergence-drawer').style.display = 'flex';
    }

    function closeEASMConvergenceDrawer() {
        if (typeof global.closeAppModal === 'function') global.closeAppModal('easm-convergence-drawer');
        else document.getElementById('easm-convergence-drawer').style.display = 'none';
    }

    async function saveEASMConvergenceDrawer(triggerRetest) {
        if (!state.activeTicket) return;
        const assignee = (document.getElementById('easm-drawer-assignee')?.value || '').trim();
        const status = document.getElementById('easm-drawer-status')?.value || state.activeTicket.convergence_status;
        const payload = triggerRetest ? { assignee, trigger_retest: true } : { assignee, convergence_status: status };
        try {
            const resp = await fetchJSON(`/api/v1/easm/convergence/${state.activeTicket.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            state.activeTicket = resp.item;

            const refreshActiveView = async () => {
                if (typeof document !== 'undefined' && document.getElementById('page-easm-overview')?.classList.contains('active')) {
                    await loadEASMOverview();
                } else {
                    await loadEASMConvergence();
                }
            };

            if (triggerRetest && resp.item?.retest_result && resp.item.retest_result.passed === false) {
                const retestEl = document.getElementById('easm-drawer-retest-result');
                if (retestEl) retestEl.textContent = JSON.stringify(resp.item.retest_result, null, 2);
                const statusSelect = document.getElementById('easm-drawer-status');
                if (statusSelect && resp.item.convergence_status) statusSelect.value = resp.item.convergence_status;
                toast('复测未通过：' + (resp.item.retest_result.summary || '暴露风险仍存在'));
                await refreshActiveView();
                return;
            }

            toast(triggerRetest ? '真实复测通过，风险已收敛闭环' : '收敛工单已更新');
            closeEASMConvergenceDrawer();
            await refreshActiveView();
        } catch (err) {
            toast('保存失败: ' + err.message);
        }
    }

    // =========================================================================
    // DRP Overview & Multi-Channel Leak Alert Center
    // =========================================================================

    async function loadDRPMonitor() {
        try {
            const [overview, eventsResp] = await Promise.all([
                fetchJSON('/api/v1/drp/overview'),
                fetchJSON(buildDRPEventQueryURL())
            ]);
            state.drpOverview = overview;
            state.drpEvents = eventsResp.events || [];
            renderDRPChannelMatrix(overview);
            renderDRPEventsTable(state.drpEvents);
        } catch (err) {
            console.error('加载数字风险监测失败:', err);
            toast('加载数字风险数据失败: ' + err.message);
        }
    }

    function buildDRPEventQueryURL() {
        const params = new URLSearchParams({ page_size: '50' });
        if (state.drpEventFilter.channelGroup && state.drpEventFilter.channelGroup !== 'all') {
            params.set('channel_group', state.drpEventFilter.channelGroup);
        }
        if (state.drpEventFilter.triageStatus && state.drpEventFilter.triageStatus !== 'all') {
            params.set('triage_status', state.drpEventFilter.triageStatus);
        }
        if (state.drpEventFilter.severity && state.drpEventFilter.severity !== 'all') {
            params.set('severity', state.drpEventFilter.severity);
        }
        if (state.drpEventFilter.q) params.set('q', state.drpEventFilter.q);
        return '/api/v1/drp/events?' + params.toString();
    }

    function renderDRPChannelMatrix(overview) {
        const root = document.getElementById('drp-channel-matrix');
        if (!root) return;
        const connectorsByGroup = {};
        (overview.connectors || []).forEach(c => { connectorsByGroup[c.channel_group] = c; });

        root.innerHTML = (overview.channel_stats || []).map(st => {
            const meta = DRP_CHANNEL_META[st.channel_group] || { label: st.channel_group, desc: '' };
            const conn = connectorsByGroup[st.channel_group];
            let dotClass = '';
            let statusTitle = '正常';
            if (!conn || !conn.is_enabled) {
                dotClass = 'is-disabled';
                statusTitle = '已停用';
            } else if (conn.health_status === 'unconfigured') {
                dotClass = 'is-unconfigured';
                statusTitle = '未配置';
            } else if (conn.health_status === 'error') {
                dotClass = 'is-error';
                statusTitle = '异常';
            } else if (conn.health_status === 'degraded') {
                dotClass = 'is-degraded';
                statusTitle = '降级';
            }
            const activeClass = state.drpEventFilter.channelGroup === st.channel_group ? 'is-active' : '';
            const syncHint = conn && conn.last_sync_at ? fmtTime(conn.last_sync_at) : '待首次同步';
            return `<div class="drp-channel-capsule ${activeClass}" onclick="selectDRPChannelTab('${esc(st.channel_group)}')">
                <div class="drp-channel-capsule-head">
                    <span class="drp-channel-name">${esc(meta.label)}</span>
                    <span class="drp-status-dot ${dotClass}" title="${esc(statusTitle)}"></span>
                </div>
                <div class="drp-channel-count">${Number(st.total || 0)}</div>
                <div class="drp-channel-meta">待核实 ${Number(st.new_count || 0)} · 高危 ${Number(st.critical_high || 0)}</div>
                <div class="drp-channel-meta">${esc(syncHint)}</div>
            </div>`;
        }).join('');
    }

    function selectDRPChannelTab(channelGroup) {
        state.drpEventFilter.channelGroup = channelGroup || 'all';
        document.querySelectorAll('#drp-channel-tabs .drp-tab').forEach(btn => {
            btn.classList.toggle('is-active', btn.dataset.channel === state.drpEventFilter.channelGroup);
        });
        loadDRPMonitor();
    }

    function applyDRPEventFilters() {
        state.drpEventFilter.triageStatus = document.getElementById('drp-filter-status')?.value || 'all';
        state.drpEventFilter.severity = document.getElementById('drp-filter-severity')?.value || 'all';
        state.drpEventFilter.q = (document.getElementById('drp-filter-q')?.value || '').trim();
        loadDRPMonitor();
    }

    function renderDRPEventsTable(events) {
        const tbody = document.getElementById('drp-events-tbody');
        if (!tbody) return;
        if (!events.length) {
            tbody.innerHTML = '<tr><td colspan="8" class="muted">暂无敏感泄露告警，点击「立即同步情报源」执行多渠道巡检。</td></tr>';
            return;
        }
        tbody.innerHTML = events.map(ev => {
            const meta = DRP_CHANNEL_META[ev.channel_group] || { label: ev.channel_group };
            return `<tr>
                <td><span class="drp-badge drp-badge--${esc(ev.severity)}">${esc(SEVERITY_LABELS[ev.severity] || ev.severity)}</span></td>
                <td>${esc(meta.label)} · <small class="muted">${esc(ev.source_platform)}</small></td>
                <td><code>${esc(ev.leak_type)}</code></td>
                <td>${esc(ev.affected_entity || '-')}</td>
                <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(ev.masked_snippet)}">${esc(ev.masked_snippet || ev.title)}</td>
                <td>${esc(fmtTime(ev.detected_at))}</td>
                <td><span class="drp-badge drp-badge--${esc(ev.triage_status)}">${esc(DRP_TRIAGE_LABELS[ev.triage_status] || ev.triage_status)}</span></td>
                <td><button type="button" class="btn-link" onclick="openDRPEventDrawer(${ev.id})">研判处置</button></td>
            </tr>`;
        }).join('');
    }

    function remediationChecklistFor(ev) {
        switch (ev.channel_group) {
            case 'code_repo':
                return ['立即吊销并轮换命中的 API Key / 访问令牌', '核查 Git 历史提交与 Fork 扩散范围，必要时联系平台下架', '检查对应凭据近期审计日志是否存在异常调用'];
            case 'cloud_drive':
            case 'doc_library':
                return ['立即联系分享方取消公开链接或提交平台侵权/涉密下架申诉', '排查内部文件外发链路与水印归属责任人', '评估文档内架构与接口信息是否需变更访问策略'];
            default:
                return ['强制通知受影响企业邮箱重置密码并吊销所有活跃会话', '核查该账号是否已启用 MFA 多因素认证', '排查近期 VPN / SSO 登录日志中是否存在异地异常登录'];
        }
    }

    function openDRPEventDrawer(eventId) {
        const ev = state.drpEvents.find(e => e.id === eventId);
        if (!ev) return;
        state.activeDrpEvent = ev;

        const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
        setText('drp-drawer-title', ev.title || '泄露事件详情');
        setText('drp-drawer-subtitle', `${ev.source_platform} · 受影响实体：${ev.affected_entity || '-'} · ${fmtTime(ev.detected_at)}`);
        setText('drp-drawer-snippet', ev.masked_snippet || '（无摘要）');
        setText('drp-drawer-ref', ev.source_ref || '-');

        const noteEl = document.getElementById('drp-drawer-note');
        if (noteEl) noteEl.value = ev.remediation_note || '';

        const listEl = document.getElementById('drp-drawer-checklist');
        if (listEl) {
            listEl.innerHTML = remediationChecklistFor(ev).map(step => `<li>${esc(step)}</li>`).join('');
        }

        if (typeof global.openAppModal === 'function') global.openAppModal('drp-event-drawer');
        else document.getElementById('drp-event-drawer').style.display = 'flex';
    }

    function closeDRPEventDrawer() {
        if (typeof global.closeAppModal === 'function') global.closeAppModal('drp-event-drawer');
        else document.getElementById('drp-event-drawer').style.display = 'none';
    }

    async function triageActiveDRPEvent(status, addToWhitelist) {
        if (!state.activeDrpEvent) return;
        const note = (document.getElementById('drp-drawer-note')?.value || '').trim();
        try {
            const resp = await fetchJSON(`/api/v1/drp/events/${state.activeDrpEvent.id}/triage`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    triage_status: status,
                    remediation_note: note,
                    add_to_whitelist: Boolean(addToWhitelist)
                })
            });
            toast(resp.whitelist_added ? '已标记误报并自动加入规则白名单降噪' : `已更新告警状态为「${DRP_TRIAGE_LABELS[status] || status}」`);
            closeDRPEventDrawer();
            await loadDRPMonitor();
        } catch (err) {
            toast('处置失败: ' + err.message);
        }
    }

    async function triggerDRPScan() {
        const btn = document.getElementById('drp-trigger-scan-btn');
        if (btn) btn.disabled = true;
        try {
            const res = await fetchJSON('/api/v1/drp/scans/trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            let msg = `多渠道同步完成：评估 ${res.rules_evaluated || 0} 条策略，新增去重脱敏告警 ${res.deduped_created || 0} 条（白名单排除 ${res.excluded_count || 0} 条）`;
            if (Array.isArray(res.warnings) && res.warnings.length) {
                msg += `；提示：${res.warnings.join('；')}`;
            }
            toast(msg);
            await loadDRPMonitor();
        } catch (err) {
            toast('触发同步失败: ' + err.message);
        } finally {
            if (btn) btn.disabled = false;
        }
    }

    // =========================================================================
    // DRP Rules & CTI Connector Configuration Page
    // =========================================================================

    async function loadDRPConfig() {
        try {
            const [rulesResp, connResp] = await Promise.all([
                fetchJSON('/api/v1/drp/rules'),
                fetchJSON('/api/v1/drp/connectors')
            ]);
            state.drpRules = rulesResp.rules || [];
            state.drpConnectors = connResp.connectors || [];
            state.drpSources = connResp.sources || [];
            renderDRPSourceOptions();
            renderDRPRules(state.drpRules);
            renderDRPConnectors(state.drpConnectors);
        } catch (err) {
            console.error('加载 DRP 策略与连接器配置失败:', err);
            toast('加载配置失败: ' + err.message);
        }
    }

    function renderDRPSourceOptions() {
        const container = document.getElementById('drp-rule-sources');
        if (!container) return;
        const channel = document.getElementById('drp-rule-channel')?.value || 'code_repo';
        const modes = {
            api_or_gateway: 'API',
            authorized_gateway: '授权网关',
            local: '本地目录',
            public_index: '公开索引',
            licensed_intelligence: '授权情报',
            hibp_or_gateway: '邮箱泄露'
        };
        const sources = state.drpSources.filter(s => s.channel_group === channel);
        if (!sources.length) {
            container.innerHTML = '<span class="muted">暂无可用平台，请检查数据源目录接口。</span>';
            return;
        }
        container.innerHTML = `<div class="drp-source-toolbar">
            <span id="drp-source-count">已选 ${sources.length} / ${sources.length}</span>
            <button type="button" class="btn-link" onclick="setDRPSourceSelection(true)">全选</button>
            <button type="button" class="btn-link" onclick="setDRPSourceSelection(false)">清空</button>
        </div>
        <div class="drp-source-grid">${sources.map(s => `<label class="drp-source-card">
            <input type="checkbox" value="${esc(s.id)}" checked onchange="updateDRPSourceCount()">
            <span class="drp-source-mark" aria-hidden="true"></span>
            <span class="drp-source-copy">
                <strong>${esc(s.name)}</strong>
                <em>${esc(modes[s.access_mode] || s.access_mode)}</em>
            </span>
        </label>`).join('')}</div>`;
    }

    function setDRPSourceSelection(checked) {
        document.querySelectorAll('#drp-rule-sources input[type="checkbox"]').forEach(el => {
            el.checked = Boolean(checked);
        });
        updateDRPSourceCount();
    }

    function updateDRPSourceCount() {
        const boxes = Array.from(document.querySelectorAll('#drp-rule-sources input[type="checkbox"]'));
        const count = document.getElementById('drp-source-count');
        if (count) count.textContent = `已选 ${boxes.filter(el => el.checked).length} / ${boxes.length}`;
    }

    function renderDRPRules(rules) {
        const root = document.getElementById('drp-rules-list');
        if (!root) return;
        if (!rules.length) {
            root.innerHTML = '<div class="muted">暂无自定义监测规则，请在上方添加企业域名、邮箱后缀或敏感特征词。</div>';
            return;
        }
        root.innerHTML = rules.map(r => {
            const meta = DRP_CHANNEL_META[r.channel_group] || { label: r.channel_group };
            return `<div class="drp-rule-card">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                    <strong>${esc(r.rule_name)}</strong>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span class="drp-badge drp-badge--confirmed">${esc(meta.label)}</span>
                        <button type="button" class="btn-link" onclick="deleteDRPRule(${r.id})">删除</button>
                    </div>
                </div>
                <div style="font-size:12px;color:var(--text-secondary);">关键词：<code>${esc((r.keywords || []).join(', '))}</code></div>
                <div style="font-size:12px;color:var(--text-secondary);">白名单排除：${esc((r.exclude_rules || []).join(', ') || '无')} · Cron：<code>${esc(r.schedule_cron)}</code></div>
            </div>`;
        }).join('');
    }

    async function createDRPRuleFromForm() {
        const ruleName = (document.getElementById('drp-rule-name')?.value || '').trim();
        const channelGroup = document.getElementById('drp-rule-channel')?.value || 'code_repo';
        const keywordsRaw = (document.getElementById('drp-rule-keywords')?.value || '').trim();
        const excludeRaw = (document.getElementById('drp-rule-exclude')?.value || '').trim();
        const cron = (document.getElementById('drp-rule-cron')?.value || '').trim() || '0 */6 * * *';

        const keywords = keywordsRaw.split(/[,，\n]/).map(s => s.trim()).filter(Boolean);
        const excludeRules = excludeRaw.split(/[,，\n]/).map(s => s.trim()).filter(Boolean);
        const enabledSources = Array.from(document.querySelectorAll('#drp-rule-sources input:checked')).map(el => el.value);
        if (!enabledSources.length) { toast('请至少选择一个监测平台'); return; }
        if (!ruleName || !keywords.length) {
            toast('请填写规则名称与至少一个监测关键词');
            return;
        }
        try {
            await fetchJSON('/api/v1/drp/rules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rule_name: ruleName,
                    channel_group: channelGroup,
                    enabled_sources: enabledSources,
                    keywords,
                    exclude_rules: excludeRules,
                    schedule_cron: cron,
                    is_enabled: true
                })
            });
            document.getElementById('drp-rule-name').value = '';
            document.getElementById('drp-rule-keywords').value = '';
            document.getElementById('drp-rule-exclude').value = '';
            toast('监测规则已保存');
            await loadDRPConfig();
        } catch (err) {
            toast('创建规则失败: ' + err.message);
        }
    }

    async function deleteDRPRule(id) {
        if (typeof global.confirm === 'function' && !global.confirm('确定删除该监测规则吗？')) return;
        try {
            await fetchJSON(`/api/v1/drp/rules/${id}`, { method: 'DELETE' });
            toast('规则已删除');
            await loadDRPConfig();
        } catch (err) {
            toast('删除规则失败: ' + err.message);
        }
    }

    const DRP_CONNECTOR_URL_PLACEHOLDERS = {
        gitleaks_trufflehog: 'https://api.github.com/search/code 或本地仓库路径',
        gitlab_api: 'https://gitlab.com 或 https://git.example.com/api/v4',
        gitee_api: 'https://gitee.com',
        platform_public_index: 'https://cn.bing.com/search 或 SearXNG /search',
        opencti_stix: 'https://opencti.yourcorp.com/graphql',
        cti_credential_feed: 'https://cti-gateway.yourcorp.com/api/credentials',
        domain_breach_api: 'https://haveibeenpwned.com/api/v3',
        cloud_drive_monitor: 'https://searx.yourcorp.com/search 或 OSINT 网关 URL',
        doc_library_meta: 'https://searx.yourcorp.com/search 或文库检索网关 URL'
    };

    const DRP_CONNECTOR_HEALTH_LABELS = {
        unconfigured: '未配置',
        healthy: '在线',
        degraded: '降级',
        error: '异常'
    };

    function renderDRPConnectors(connectors) {
        const root = document.getElementById('drp-connectors-grid');
        if (!root) return;
        root.innerHTML = connectors.map(c => {
            const urlPlaceholder = DRP_CONNECTOR_URL_PLACEHOLDERS[c.provider_type] || 'https://...';
            const healthLabel = DRP_CONNECTOR_HEALTH_LABELS[c.health_status || 'healthy'] || c.health_status || 'healthy';
            const healthClass = DRP_CONNECTOR_HEALTH_LABELS[c.health_status] ? c.health_status : 'healthy';
            const meta = DRP_CHANNEL_META[c.channel_group] || { label: c.channel_group };
            return `<div class="drp-connector-card" data-connector-id="${esc(c.id)}">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                    <div>
                        <strong style="font-size:13px;">${esc(c.name)}</strong>
                        <div style="font-size:11px;color:var(--text-secondary);">${esc(meta.label)} · ${esc(c.provider_type)}</div>
                    </div>
                    <label style="display:inline-flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;">
                        <input type="checkbox" id="drp-conn-enabled-${esc(c.id)}" ${c.is_enabled ? 'checked' : ''}>
                        <span>启用</span>
                    </label>
                </div>
                <label class="drp-form-field"><span>Endpoint URL</span><input type="text" id="drp-conn-url-${esc(c.id)}" value="${esc(c.endpoint_url || '')}" placeholder="${esc(urlPlaceholder)}"></label>
                <label class="drp-form-field"><span>API Key（当前：${esc(c.api_key_masked || '未配置')}）</span><input type="password" id="drp-conn-key-${esc(c.id)}" placeholder="留空保持不变"></label>
                <label class="drp-form-field"><span>同步周期 (Cron)</span><input type="text" id="drp-conn-cron-${esc(c.id)}" value="${esc(c.schedule_cron || '0 */6 * * *')}"></label>
                ${c.last_error ? `<div class="drp-conn-error">${esc(c.last_error)}</div>` : ''}
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;">
                    <span class="drp-badge drp-badge--${esc(healthClass)}">${esc(healthLabel)}</span>
                    <div style="display:flex;gap:6px;">
                        <button type="button" class="btn-secondary btn-small" onclick="testDRPConnector('${esc(c.id)}')">测试连通性</button>
                        <button type="button" class="btn-secondary btn-small" onclick="saveDRPConnector('${esc(c.id)}')">保存配置</button>
                    </div>
                </div>
            </div>`;
        }).join('');
    }

    async function testDRPConnector(id) {
        try {
            const resp = await fetchJSON(`/api/v1/drp/connectors/${encodeURIComponent(id)}/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            toast(resp.message || (resp.ok ? '连接测试成功' : '连接测试未通过'));
            await loadDRPConfig();
        } catch (err) {
            toast('连接测试失败: ' + err.message);
            await loadDRPConfig();
        }
    }

    async function saveDRPConnector(id) {
        const endpoint_url = (document.getElementById('drp-conn-url-' + id)?.value || '').trim();
        const api_key = (document.getElementById('drp-conn-key-' + id)?.value || '').trim();
        const schedule_cron = (document.getElementById('drp-conn-cron-' + id)?.value || '').trim();
        const is_enabled = Boolean(document.getElementById('drp-conn-enabled-' + id)?.checked);
        const payload = { endpoint_url, schedule_cron, is_enabled };
        if (api_key) payload.api_key = api_key;
        try {
            await fetchJSON(`/api/v1/drp/connectors/${encodeURIComponent(id)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            toast('连接器配置已保存');
            await loadDRPConfig();
        } catch (err) {
            toast('保存连接器失败: ' + err.message);
        }
    }

    // Export public handlers to window and CommonJS for Node tests
    const api = {
        loadEASMOverview,
        triggerEASMIncrementalScan,
        triggerEASMExposureAssess,
        claimShadowAsset,
        applyEASMAssetFilters,
        loadEASMConvergence,
        switchEASMConvergenceView,
        onEASMCardDragStart,
        onEASMColumnDrop,
        openEASMConvergenceDrawer,
        closeEASMConvergenceDrawer,
        saveEASMConvergenceDrawer,
        loadDRPMonitor,
        selectDRPChannelTab,
        applyDRPEventFilters,
        openDRPEventDrawer,
        closeDRPEventDrawer,
        triageActiveDRPEvent,
        triggerDRPScan,
        loadDRPConfig,
        createDRPRuleFromForm,
        renderDRPSourceOptions,
        setDRPSourceSelection,
        updateDRPSourceCount,
        deleteDRPRule,
        saveDRPConnector,
        testDRPConnector,
        remediationChecklistFor
    };

    Object.keys(api).forEach(k => { global[k] = api[k]; });
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
})(typeof window !== 'undefined' ? window : globalThis);
