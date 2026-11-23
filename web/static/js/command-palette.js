/**
 * SI-Lens 全局 ⌘K / Ctrl+K 命令面板与顶部上下文同步
 * - 支持纯函数导出供 Node 单元测试
 * - 浏览器端提供快捷键唤起、键盘导航、权限感知页面跳转、快捷操作与最近对话直达
 */
(function (root, factory) {
    const api = factory(root);
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
    'use strict';

    const PAGE_META = [
        { id: 'dashboard', i18nKey: 'nav.dashboard', fallback: '仪表盘', keywords: 'home overview metrics kpi 首页 概览' },
        { id: 'chat', i18nKey: 'nav.chat', fallback: '对话', keywords: 'agent task pentest ai 对话 渗透 测试' },
        { id: 'agents-swarm', i18nKey: 'nav.agentsSwarm', fallback: '蜂群看板', keywords: 'swarm multiagent topology graph 蜂群 拓扑 多代理' },
        { id: 'agents-management', i18nKey: 'nav.agentsManagement', fallback: '智能体管理', keywords: 'agents markdown subagent 智能体 子代理' },
        { id: 'vulnerabilities', i18nKey: 'nav.vulnerabilities', fallback: '漏洞管理', keywords: 'vuln finding cve severity 漏洞 风险' },
        { id: 'projects', i18nKey: 'nav.projects', fallback: '项目管理', keywords: 'project workspace fact 项目 工作区' },
        { id: 'asset-overview', i18nKey: 'nav.assetOverview', fallback: '资产概览', keywords: 'assets dashboard 资产 概览' },
        { id: 'asset-library', i18nKey: 'nav.assetLibrary', fallback: '资产库', keywords: 'assets host domain port ip 资产库 主机 域名' },
        { id: 'info-collect', i18nKey: 'nav.infoCollect', fallback: '信息收集', keywords: 'fofa recon subdomain 信息收集 侦察' },
        { id: 'tasks', i18nKey: 'nav.tasks', fallback: '任务管理', keywords: 'batch queue jobs 任务 队列' },
        { id: 'workflows', i18nKey: 'nav.workflows', fallback: '工作流', keywords: 'workflow dag automation 工作流' },
        { id: 'hitl', i18nKey: 'nav.hitl', fallback: '人机协同', keywords: 'hitl approval review 审批 人机协同' },
        { id: 'tool-guard', i18nKey: 'nav.toolGuard', fallback: '调用拦截', keywords: 'guard policy security 拦截 规则' },
        { id: 'mcp-monitor', i18nKey: 'nav.mcpMonitor', fallback: 'MCP监控', keywords: 'mcp monitor calls 监控' },
        { id: 'mcp-management', i18nKey: 'nav.mcpManagement', fallback: 'MCP管理', keywords: 'mcp tools server 工具' },
        { id: 'skills-monitor', i18nKey: 'nav.skillsMonitor', fallback: '技能状态', keywords: 'skills status 技能 状态' },
        { id: 'skills-management', i18nKey: 'nav.skillsManagement', fallback: '技能管理', keywords: 'skills package 技能 管理' },
        { id: 'knowledge-management', i18nKey: 'nav.knowledgeManagement', fallback: '知识管理', keywords: 'rag kb docs 知识库' },
        { id: 'knowledge-retrieval-logs', i18nKey: 'nav.knowledgeRetrievalLogs', fallback: '检索历史', keywords: 'rag logs retrieval 检索 历史' },
        { id: 'webshell', i18nKey: 'nav.webshell', fallback: 'WebShell管理', keywords: 'shell terminal webshell' },
        { id: 'chat-files', i18nKey: 'nav.chatFiles', fallback: '文件管理', keywords: 'files artifacts 文件' },
        { id: 'c2-listeners', i18nKey: 'nav.c2Listeners', fallback: 'C2 · 监听器', keywords: 'c2 listeners 监听' },
        { id: 'c2-sessions', i18nKey: 'nav.c2Sessions', fallback: 'C2 · 会话', keywords: 'c2 sessions 会话' },
        { id: 'c2-tasks', i18nKey: 'nav.c2Tasks', fallback: 'C2 · 任务', keywords: 'c2 tasks 任务' },
        { id: 'c2-payloads', i18nKey: 'nav.c2Payloads', fallback: 'C2 · Payload', keywords: 'c2 payloads 载荷' },
        { id: 'c2-events', i18nKey: 'nav.c2Events', fallback: 'C2 · 事件', keywords: 'c2 events 事件' },
        { id: 'c2-profiles', i18nKey: 'nav.c2Profiles', fallback: 'C2 · 流量伪装', keywords: 'c2 profiles 伪装' },
        { id: 'roles-management', i18nKey: 'nav.rolesManagement', fallback: '角色管理', keywords: 'roles prompt 角色' },
        { id: 'platform-rbac', i18nKey: 'nav.platformRbac', fallback: '平台权限', keywords: 'rbac users auth 权限 用户' },
        { id: 'settings', i18nKey: 'nav.settings', fallback: '系统设置', keywords: 'settings config model ai 设置 模型 配置' }
    ];

    const PAGE_BY_ID = new Map(PAGE_META.map(function (p) { return [p.id, p]; }));

    function tr(key, fallback, params, translateFn) {
        const fn = typeof translateFn === 'function' ? translateFn : (root && typeof root.t === 'function' ? root.t : null);
        if (fn) {
            const val = fn(key, params || {});
            if (val && val !== key) return String(val);
        }
        let text = String(fallback || key);
        if (params && typeof params === 'object') {
            Object.keys(params).forEach(function (k) {
                text = text.split('{{' + k + '}}').join(String(params[k]));
            });
        }
        return text;
    }

    function escapeHtml(text) {
        return String(text == null ? '' : text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getPageBreadcrumbLabel(pageId, translateFn) {
        const cleanId = String(pageId || 'dashboard').trim() || 'dashboard';
        const meta = PAGE_BY_ID.get(cleanId);
        if (meta) {
            return tr(meta.i18nKey, meta.fallback, null, translateFn);
        }
        return cleanId;
    }

    function filterCommandItems(items, query) {
        const list = Array.isArray(items) ? items : [];
        const q = String(query || '').trim().toLowerCase();
        if (!q) return list.slice();

        const scored = [];
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (!item) continue;
            const title = String(item.title || '').toLowerCase();
            const subtitle = String(item.subtitle || '').toLowerCase();
            const keywords = Array.isArray(item.keywords)
                ? item.keywords.join(' ').toLowerCase()
                : String(item.keywords || '').toLowerCase();
            const id = String(item.id || '').toLowerCase();

            let rank = -1;
            if (title.indexOf(q) === 0) rank = 0;
            else if (title.indexOf(q) !== -1) rank = 1;
            else if (subtitle.indexOf(q) !== -1 || id.indexOf(q) !== -1) rank = 2;
            else if (keywords.indexOf(q) !== -1) rank = 3;

            if (rank !== -1) {
                scored.push({ item: item, rank: rank, index: i });
            }
        }
        scored.sort(function (a, b) {
            if (a.rank !== b.rank) return a.rank - b.rank;
            return a.index - b.index;
        });
        return scored.map(function (entry) { return entry.item; });
    }

    function groupCommandItems(items) {
        const list = Array.isArray(items) ? items : [];
        const groups = [];
        const byKey = new Map();
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (!item) continue;
            const key = String(item.group || 'other');
            let bucket = byKey.get(key);
            if (!bucket) {
                bucket = {
                    key: key,
                    label: String(item.groupLabel || key),
                    items: []
                };
                byKey.set(key, bucket);
                groups.push(bucket);
            }
            bucket.items.push(item);
        }
        return groups;
    }

    /* =====================================================================
     * Browser Controller
     * ===================================================================== */
    if (typeof root.document !== 'undefined' && typeof root.window !== 'undefined') {
        const state = {
            open: false,
            query: '',
            activeIndex: 0,
            renderedItems: [],
            conversations: [],
            lastConvFetchAt: 0,
            currentPageId: 'dashboard',
            lastFocusedEl: null
        };

        function resolveCurrentPageId() {
            const activePage = root.document.querySelector('.page.active[id^="page-"]');
            if (activePage && activePage.id) {
                return activePage.id.replace(/^page-/, '');
            }
            const rawHash = String((root.window.location && root.window.location.hash) || '').replace(/^#\/?/, '');
            if (rawHash) {
                return rawHash.split('/')[0].split('?')[0] || 'dashboard';
            }
            return state.currentPageId || 'dashboard';
        }

        function syncTopbarContext(pageId) {
            const pid = pageId ? String(pageId) : resolveCurrentPageId();
            state.currentPageId = pid;
            const labelEl = root.document.getElementById('sl-topbar-page-label');
            if (labelEl) {
                labelEl.textContent = getPageBreadcrumbLabel(pid);
            }
        }

        function isPageAccessible(pageId) {
            if (typeof root.canAccessPage === 'function' && !root.canAccessPage(pageId)) {
                return false;
            }
            const navEl = root.document.querySelector('.nav-item[data-page="' + pageId + '"], .nav-submenu-item[data-page="' + pageId + '"]');
            if (navEl && (navEl.hidden || navEl.style.display === 'none')) {
                return false;
            }
            return true;
        }

        function buildItems() {
            const items = [];
            const pageGroupLabel = tr('commandPalette.groupPages', '页面导航');
            const actionGroupLabel = tr('commandPalette.groupActions', '快捷操作');
            const convGroupLabel = tr('commandPalette.groupConversations', '最近对话');

            items.push({
                id: 'action:new-chat',
                group: 'actions',
                groupLabel: actionGroupLabel,
                title: tr('commandPalette.actionNewChat', '新建安全测试任务'),
                subtitle: tr('commandPalette.actionNewChatDesc', '切换到对话工作台并开启新会话'),
                badge: tr('commandPalette.badgeAction', '操作'),
                keywords: 'new chat task pentest 新建 任务 对话',
                run: function () {
                    if (typeof root.switchPage === 'function') root.switchPage('chat');
                    if (typeof root.startNewConversation === 'function') root.startNewConversation();
                }
            });

            items.push({
                id: 'action:open-swarm',
                group: 'actions',
                groupLabel: actionGroupLabel,
                title: tr('commandPalette.actionOpenSwarm', '打开多代理蜂群看板'),
                subtitle: tr('commandPalette.actionOpenSwarmDesc', '查看当前或最近一次对话的拓扑与协作轨迹'),
                badge: tr('commandPalette.badgeSwarm', 'Swarm'),
                keywords: 'swarm topology agent graph 蜂群 看板 拓扑',
                run: function () {
                    const cid = typeof root.currentConversationId === 'string' ? root.currentConversationId.trim() : '';
                    if (cid && typeof root.openSwarmDashboard === 'function') {
                        void root.openSwarmDashboard(cid, '');
                    } else if (typeof root.switchPage === 'function') {
                        root.switchPage('agents-swarm');
                    }
                }
            });

            items.push({
                id: 'action:toggle-theme',
                group: 'actions',
                groupLabel: actionGroupLabel,
                title: tr('commandPalette.actionToggleTheme', '切换界面主题'),
                subtitle: tr('commandPalette.actionToggleThemeDesc', '在浅色 / 暗色 / 跟随系统之间循环切换'),
                badge: tr('commandPalette.badgeTheme', '主题'),
                keywords: 'theme light dark mode 主题 浅色 深色 暗色',
                run: function () {
                    if (typeof root.cycleThemePreference === 'function') root.cycleThemePreference();
                }
            });

            items.push({
                id: 'action:toggle-sidebar',
                group: 'actions',
                groupLabel: actionGroupLabel,
                title: tr('commandPalette.actionToggleSidebar', '折叠 / 展开侧边栏'),
                subtitle: tr('commandPalette.actionToggleSidebarDesc', '调整主工作区可视空间'),
                badge: tr('commandPalette.badgeLayout', '布局'),
                keywords: 'sidebar collapse expand 侧边栏 折叠',
                run: function () {
                    if (typeof root.toggleSidebar === 'function') root.toggleSidebar();
                }
            });

            for (let i = 0; i < PAGE_META.length; i++) {
                const p = PAGE_META[i];
                if (!isPageAccessible(p.id)) continue;
                items.push({
                    id: 'page:' + p.id,
                    group: 'navigation',
                    groupLabel: pageGroupLabel,
                    title: tr(p.i18nKey, p.fallback),
                    subtitle: '#' + p.id,
                    badge: tr('commandPalette.badgePage', '页面'),
                    keywords: p.keywords + ' ' + p.id,
                    run: function () {
                        if (typeof root.switchPage === 'function') root.switchPage(p.id);
                    }
                });
            }

            for (let i = 0; i < state.conversations.length; i++) {
                const c = state.conversations[i];
                if (!c || !c.id) continue;
                items.push({
                    id: 'conv:' + c.id,
                    group: 'conversations',
                    groupLabel: convGroupLabel,
                    title: c.title || tr('chat.unnamedConversation', '未命名对话'),
                    subtitle: (c.agent_mode || 'single') + ' · ' + String(c.id).slice(0, 8),
                    badge: tr('commandPalette.badgeConversation', '对话'),
                    keywords: (c.title || '') + ' ' + c.id + ' ' + (c.agent_mode || ''),
                    run: function () {
                        if (typeof root.navigateToConversation === 'function') {
                            root.navigateToConversation(c.id);
                        } else {
                            if (typeof root.switchPage === 'function') root.switchPage('chat');
                            if (typeof root.loadConversation === 'function') void root.loadConversation(c.id);
                        }
                    }
                });
            }

            return items;
        }

        function renderList() {
            const listEl = root.document.getElementById('sl-cmdk-list');
            if (!listEl) return;

            const filtered = filterCommandItems(buildItems(), state.query);
            state.renderedItems = filtered;
            if (state.activeIndex >= filtered.length) {
                state.activeIndex = Math.max(0, filtered.length - 1);
            }

            if (filtered.length === 0) {
                listEl.innerHTML = '<div class="sl-cmdk-empty">' + escapeHtml(tr('commandPalette.empty', '没有匹配的页面、命令或对话')) + '</div>';
                return;
            }

            const groups = groupCommandItems(filtered);
            let idx = 0;
            const htmlParts = [];
            for (let g = 0; g < groups.length; g++) {
                const grp = groups[g];
                htmlParts.push('<div class="sl-cmdk-group-title">' + escapeHtml(grp.label) + '</div>');
                for (let j = 0; j < grp.items.length; j++) {
                    const item = grp.items[j];
                    const itemIndex = idx++;
                    const activeCls = itemIndex === state.activeIndex ? ' is-active' : '';
                    htmlParts.push(
                        '<button type="button" class="sl-cmdk-item' + activeCls + '" role="option" aria-selected="' + (itemIndex === state.activeIndex ? 'true' : 'false') + '" data-cmdk-idx="' + itemIndex + '">' +
                            '<span class="sl-cmdk-item-main">' +
                                '<span class="sl-cmdk-item-title">' + escapeHtml(item.title) + '</span>' +
                                (item.subtitle ? '<span class="sl-cmdk-item-sub">' + escapeHtml(item.subtitle) + '</span>' : '') +
                            '</span>' +
                            (item.badge ? '<span class="sl-cmdk-item-badge">' + escapeHtml(item.badge) + '</span>' : '') +
                        '</button>'
                    );
                }
            }
            listEl.innerHTML = htmlParts.join('');
            listEl.querySelectorAll('[data-cmdk-idx]').forEach(function (btn) {
                btn.onclick = function () {
                    const chosen = state.renderedItems[Number(btn.getAttribute('data-cmdk-idx'))];
                    executeItem(chosen);
                };
            });
            const activeEl = listEl.querySelector('.sl-cmdk-item.is-active');
            if (activeEl && typeof activeEl.scrollIntoView === 'function') {
                activeEl.scrollIntoView({ block: 'nearest' });
            }
        }

        function executeItem(item) {
            if (!item || typeof item.run !== 'function') return;
            root.closeCommandPalette();
            try {
                item.run();
            } catch (err) {
                console.warn('执行命令面板动作失败:', err);
            }
        }

        async function refreshRecentConversationsIfNeeded() {
            if (typeof root.apiFetch !== 'function') return;
            if (Date.now() - state.lastConvFetchAt < 5000 && state.conversations.length > 0) return;
            try {
                const res = await root.apiFetch('/api/conversations?limit=8&offset=0');
                if (res && res.ok) {
                    const data = await res.json();
                    state.conversations = Array.isArray(data.conversations) ? data.conversations : [];
                    state.lastConvFetchAt = Date.now();
                    if (state.open) renderList();
                }
            } catch (err) {
                // ignore transient network errors when offline/unauthenticated
            }
        }

        root.openCommandPalette = function () {
            const overlay = root.document.getElementById('sl-cmdk-overlay');
            const input = root.document.getElementById('sl-cmdk-input');
            if (!overlay) return;
            state.lastFocusedEl = root.document.activeElement || null;
            state.open = true;
            state.query = '';
            state.activeIndex = 0;
            overlay.hidden = false;
            if (input) {
                input.value = '';
                input.focus();
            }
            renderList();
            void refreshRecentConversationsIfNeeded();
        };

        root.closeCommandPalette = function () {
            const overlay = root.document.getElementById('sl-cmdk-overlay');
            state.open = false;
            if (overlay) overlay.hidden = true;
            if (state.lastFocusedEl && typeof state.lastFocusedEl.focus === 'function') {
                try {
                    state.lastFocusedEl.focus();
                } catch (err) {
                    // ignore
                }
            }
            state.lastFocusedEl = null;
        };

        function bindEvents() {
            const overlay = root.document.getElementById('sl-cmdk-overlay');
            const input = root.document.getElementById('sl-cmdk-input');

            if (overlay) {
                overlay.addEventListener('click', function (e) {
                    if (e.target === overlay) {
                        root.closeCommandPalette();
                    }
                });
            }
            if (input) {
                input.addEventListener('input', function () {
                    state.query = input.value || '';
                    state.activeIndex = 0;
                    renderList();
                });
                input.addEventListener('keydown', function (e) {
                    if (e.isComposing) return;
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (state.renderedItems.length > 0) {
                            state.activeIndex = (state.activeIndex + 1) % state.renderedItems.length;
                            renderList();
                        }
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (state.renderedItems.length > 0) {
                            state.activeIndex = (state.activeIndex - 1 + state.renderedItems.length) % state.renderedItems.length;
                            renderList();
                        }
                    } else if (e.key === 'Enter') {
                        e.preventDefault();
                        executeItem(state.renderedItems[state.activeIndex]);
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        root.closeCommandPalette();
                    }
                });
            }

            root.document.addEventListener('keydown', function (e) {
                if (e.isComposing) return;
                if ((e.metaKey || e.ctrlKey) && String(e.key || '').toLowerCase() === 'k') {
                    e.preventDefault();
                    if (state.open) root.closeCommandPalette();
                    else root.openCommandPalette();
                    return;
                }
                if (state.open && e.key === 'Escape') {
                    e.preventDefault();
                    root.closeCommandPalette();
                }
            });

            root.window.addEventListener('si-lens-page-changed', function (e) {
                syncTopbarContext(e && e.detail && e.detail.pageId);
            });
            root.window.addEventListener('hashchange', function () {
                syncTopbarContext();
            });
            root.window.addEventListener('languageChanged', function () {
                syncTopbarContext();
                if (state.open) renderList();
            });

            syncTopbarContext();
        }

        if (root.document.readyState === 'loading') {
            root.document.addEventListener('DOMContentLoaded', bindEvents);
        } else {
            bindEvents();
        }
    }

    return {
        filterCommandItems: filterCommandItems,
        groupCommandItems: groupCommandItems,
        getPageBreadcrumbLabel: getPageBreadcrumbLabel
    };
});
