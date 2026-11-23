/**
 * SI-Lens UI/UX 打磨层前端契约测试
 * 覆盖：命令面板纯函数、光学设计令牌、暗色/RTL/移动端/减弱动效保护、
 *       Dashboard KPI 彩虹渐变移除、模板挂载点顺序、路由事件与四语言文案完整性。
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const JS_DIR = __dirname;
const WEB_DIR = path.resolve(JS_DIR, '..', '..');
const CSS_PATH = path.join(WEB_DIR, 'static', 'css', 'si-lens-polish.css');
const TEMPLATE_PATH = path.join(WEB_DIR, 'templates', 'index.html');
const ROUTER_PATH = path.join(JS_DIR, 'router.js');
const PALETTE_SOURCE = fs.readFileSync(path.join(JS_DIR, 'command-palette.js'), 'utf8');
const CSS = fs.readFileSync(CSS_PATH, 'utf8');
const TEMPLATE = fs.readFileSync(TEMPLATE_PATH, 'utf8');
const ROUTER = fs.readFileSync(ROUTER_PATH, 'utf8');

const {
    filterCommandItems,
    groupCommandItems,
    getPageBreadcrumbLabel
} = require('./command-palette.js');

/* ------------------------------------------------------------------ */
/* 1. filterCommandItems                                              */
/* ------------------------------------------------------------------ */

test('filterCommandItems：空查询返回全部条目且不共享原数组引用', () => {
    const items = [
        { id: 'page:dashboard', title: '仪表盘' },
        { id: 'page:chat', title: '对话' }
    ];
    for (const query of ['', '   ', null, undefined]) {
        const result = filterCommandItems(items, query);
        assert.deepEqual(result, items);
        assert.notEqual(result, items, '应返回新数组');
    }
    assert.deepEqual(filterCommandItems(null, ''), []);
});

test('filterCommandItems：标题前缀命中优先于标题包含命中', () => {
    const items = [
        { id: 'page:asset-overview', title: '资产概览' },
        { id: 'page:asset-library', title: '资产库' },
        { id: 'page:projects', title: '项目资产' }
    ];
    const result = filterCommandItems(items, '资产');
    assert.deepEqual(result.map(i => i.id), [
        'page:asset-overview',
        'page:asset-library',
        'page:projects'
    ], '前缀命中应排在前，仅包含命中排在后');
});

test('filterCommandItems：标题前缀命中排第一，且同级别保持原始顺序', () => {
    const items = [
        { id: 'a', title: 'skills management' },
        { id: 'b', title: 'agent skills monitor' },
        { id: 'c', title: 'skills monitor' }
    ];
    const result = filterCommandItems(items, 'skills');
    assert.deepEqual(result.map(i => i.id), ['a', 'c', 'b']);
});

test('filterCommandItems：副标题与 id 命中排在标题命中之后', () => {
    const items = [
        { id: 'action:toggle-theme', title: '切换界面主题', subtitle: '在浅色 / 暗色之间循环' },
        { id: 'page:theme-note', title: '系统设置', subtitle: '主题与外观' },
        { id: 'action:toggle-sidebar', title: '折叠 / 展开侧边栏', subtitle: '调整工作区空间' }
    ];
    const result = filterCommandItems(items, '主题');
    assert.deepEqual(result.map(i => i.id), ['action:toggle-theme', 'page:theme-note']);
});

test('filterCommandItems：关键词命中兜底（数组与字符串两种形态）', () => {
    const items = [
        { id: 'page:chat', title: '对话', keywords: ['agent', 'pentest', '渗透'] },
        { id: 'page:agents-swarm', title: '蜂群看板', keywords: 'swarm multiagent topology 拓扑' },
        { id: 'page:dashboard', title: '仪表盘', keywords: 'home overview 首页' }
    ];
    assert.deepEqual(filterCommandItems(items, 'pentest').map(i => i.id), ['page:chat']);
    assert.deepEqual(filterCommandItems(items, 'topology').map(i => i.id), ['page:agents-swarm']);
    assert.deepEqual(filterCommandItems(items, '首页').map(i => i.id), ['page:dashboard']);
});

test('filterCommandItems：查询大小写不敏感且跳过空条目', () => {
    const items = [null, { id: 'page:mcp', title: 'MCP 监控' }, undefined];
    assert.deepEqual(filterCommandItems(items, 'mcp').map(i => i.id), ['page:mcp']);
    assert.equal(filterCommandItems(items, 'zzz-not-found').length, 0);
    assert.deepEqual(filterCommandItems('not-an-array', 'a'), []);
});

/* ------------------------------------------------------------------ */
/* 2. groupCommandItems                                               */
/* ------------------------------------------------------------------ */

test('groupCommandItems：按出现顺序分组并保留组内顺序', () => {
    const items = [
        { id: 'a1', group: 'actions', groupLabel: '快捷操作', title: '新建任务' },
        { id: 'n1', group: 'navigation', groupLabel: '页面导航', title: '仪表盘' },
        { id: 'a2', group: 'actions', groupLabel: '快捷操作', title: '切换主题' },
        { id: 'c1', group: 'conversations', groupLabel: '最近对话', title: '未命名对话' },
        { id: 'n2', group: 'navigation', groupLabel: '页面导航', title: '对话' }
    ];
    const groups = groupCommandItems(items);
    assert.deepEqual(groups.map(g => g.key), ['actions', 'navigation', 'conversations']);
    assert.deepEqual(groups.map(g => g.label), ['快捷操作', '页面导航', '最近对话']);
    assert.deepEqual(groups[0].items.map(i => i.id), ['a1', 'a2']);
    assert.deepEqual(groups[1].items.map(i => i.id), ['n1', 'n2']);
    assert.deepEqual(groups[2].items.map(i => i.id), ['c1']);
});

test('groupCommandItems：缺失分组落到 other，缺失标签回退为组键', () => {
    const groups = groupCommandItems([{ id: 'x', title: '无分组' }, null]);
    assert.equal(groups.length, 1);
    assert.equal(groups[0].key, 'other');
    assert.equal(groups[0].label, 'other');
    assert.deepEqual(groups[0].items.map(i => i.id), ['x']);
    assert.deepEqual(groupCommandItems(null), []);
});

test('groupCommandItems：过滤后分组与过滤结果一致（不产生空分组）', () => {
    const items = [
        { id: 'a1', group: 'actions', groupLabel: '操作', title: '新建任务' },
        { id: 'n1', group: 'navigation', groupLabel: '页面', title: '仪表盘' }
    ];
    const groups = groupCommandItems(filterCommandItems(items, '仪表盘'));
    assert.equal(groups.length, 1);
    assert.equal(groups[0].key, 'navigation');
    assert.equal(groups[0].items.length, 1);
});

/* ------------------------------------------------------------------ */
/* 3. getPageBreadcrumbLabel                                          */
/* ------------------------------------------------------------------ */

test('getPageBreadcrumbLabel：已知页面 ID 走翻译函数', () => {
    const calls = [];
    const translateFn = (key) => {
        calls.push(key);
        return { 'nav.dashboard': 'Dashboard', 'nav.chat': 'Chat' }[key];
    };
    assert.equal(getPageBreadcrumbLabel('dashboard', translateFn), 'Dashboard');
    assert.equal(getPageBreadcrumbLabel('chat', translateFn), 'Chat');
    assert.deepEqual(calls, ['nav.dashboard', 'nav.chat']);
});

test('getPageBreadcrumbLabel：翻译缺失时回退内置中文文案', () => {
    const noop = (key) => key;
    assert.equal(getPageBreadcrumbLabel('vulnerabilities', noop), '漏洞管理');
    assert.equal(getPageBreadcrumbLabel('settings', noop), '系统设置');
});

test('getPageBreadcrumbLabel：空值与未知 ID 的处理', () => {
    const noop = (key) => key;
    assert.equal(getPageBreadcrumbLabel('', noop), '仪表盘');
    assert.equal(getPageBreadcrumbLabel(null, noop), '仪表盘');
    assert.equal(getPageBreadcrumbLabel('   ', noop), '仪表盘');
    assert.equal(getPageBreadcrumbLabel('unknown-page', noop), 'unknown-page');
    assert.equal(getPageBreadcrumbLabel('  chat  ', noop), '对话');
});

/* ------------------------------------------------------------------ */
/* 4. si-lens-polish.css 光学设计契约                                 */
/* ------------------------------------------------------------------ */

test('CSS：光学设计令牌齐备', () => {
    for (const token of ['--sl-canvas:', '--sl-surface:', '--sl-accent:']) {
        assert.ok(CSS.includes(token), `缺少设计令牌 ${token}`);
    }
    assert.match(CSS, /font-variant-numeric:\s*tabular-nums/, '数值需使用等宽数字');
});

test('CSS：暗色主题令牌覆盖存在于 html[data-theme="dark"]', () => {
    const darkStart = CSS.indexOf('html[data-theme="dark"] {');
    assert.ok(darkStart !== -1, '缺少暗色主题选择器');
    const darkBlock = CSS.slice(darkStart, CSS.indexOf('}', darkStart));
    for (const token of ['--sl-canvas:', '--sl-surface:', '--sl-accent:', '--sl-border:', '--sl-ink:']) {
        assert.ok(darkBlock.includes(token), `暗色主题缺少令牌覆盖 ${token}`);
    }
});

test('CSS：RTL 与减弱动效保护', () => {
    assert.match(CSS, /html\[dir="rtl"\]\s+\.sl-topbar-context/, 'RTL 下需修正顶栏上下文间距');
    assert.match(CSS, /html\[dir="rtl"\]\s+\.sl-cmdk-trigger > span/, 'RTL 下命令面板触发按钮需右对齐');
    assert.match(CSS, /@media \(prefers-reduced-motion: reduce\)/, '缺少减弱动效媒体查询');
    const reduceStart = CSS.indexOf('@media (prefers-reduced-motion: reduce)');
    const reduceBlock = CSS.slice(reduceStart);
    assert.match(reduceBlock, /transition-duration:\s*0\.01ms\s*!important/);
    assert.match(reduceBlock, /animation-duration:\s*0\.01ms\s*!important/);
});

test('CSS：移动端守护隐藏顶栏上下文', () => {
    const mobileStart = CSS.indexOf('@media (max-width: 767.98px)');
    assert.ok(mobileStart !== -1, '缺少移动端媒体查询');
    const mobileEnd = CSS.indexOf('@media', mobileStart + 10);
    const mobileBlock = CSS.slice(mobileStart, mobileEnd === -1 ? undefined : mobileEnd);
    assert.match(mobileBlock, /\.sl-topbar-context\s*\{[^}]*display:\s*none\s*!important/, '移动端应隐藏 .sl-topbar-context');
    assert.match(mobileBlock, /padding:\s*12px 16px/, '移动端页面头内边距应压缩');
});

test('CSS：Dashboard KPI 彩虹渐变已移除，统一为光学表面', () => {
    assert.match(CSS, /\.dashboard-kpi-card:nth-child\(n\)/, '需显式覆盖 nth-child 渐变规则');
    const nthStart = CSS.indexOf('.dashboard-kpi-card:nth-child(n)');
    const nthBlock = CSS.slice(nthStart, CSS.indexOf('}', nthStart));
    assert.match(nthBlock, /background:\s*var\(--sl-surface-elevated\)/, 'KPI 卡片应使用统一表面色');
    assert.match(nthBlock, /border:\s*1px solid var\(--sl-border\)/);
    // 不允许再出现按序号分配的彩虹渐变
    assert.doesNotMatch(CSS, /\.dashboard-kpi-card:nth-child\(\d+\)/, '不应保留序号化 KPI 样式');
});

/* ------------------------------------------------------------------ */
/* 5. index.html 挂载契约                                             */
/* ------------------------------------------------------------------ */

test('模板：design-system.css 先于 si-lens-polish.css 加载', () => {
    const designIdx = TEMPLATE.indexOf('/static/css/design-system.css');
    const polishIdx = TEMPLATE.indexOf('/static/css/si-lens-polish.css');
    assert.ok(designIdx !== -1, '模板缺少 design-system.css');
    assert.ok(polishIdx !== -1, '模板缺少 si-lens-polish.css');
    assert.ok(designIdx < polishIdx, 'si-lens-polish.css 必须在 design-system.css 之后加载');
});

test('模板：命令面板与品牌挂载点存在', () => {
    assert.match(TEMPLATE, /id="sl-cmdk-trigger-btn"/);
    assert.match(TEMPLATE, /id="sl-cmdk-overlay"/, '缺少命令面板遮罩层');
    assert.match(TEMPLATE, /id="sl-cmdk-input"/, '缺少命令面板输入框');
    assert.match(TEMPLATE, /class="[^"]*login-brand-logo[^"]*"/, '缺少登录页品牌图标类名');
    assert.match(TEMPLATE, /command-palette\.js/, '模板未引入 command-palette.js');
    assert.match(TEMPLATE, /data-i18n="header\.commandSearch"/, '命令入口缺少 i18n 绑定');
    assert.match(TEMPLATE, /data-i18n="commandPalette\.placeholder"/, '命令面板输入框缺少 i18n 绑定');
});

test('模板：#chat-return-latest 之后紧跟 agent-plan-progress 容器', () => {
    const returnIdx = TEMPLATE.indexOf('id="chat-return-latest"');
    assert.ok(returnIdx !== -1, '缺少 #chat-return-latest');
    const planIdx = TEMPLATE.indexOf('<div id="agent-plan-progress"');
    assert.ok(planIdx !== -1, '缺少 #agent-plan-progress');
    assert.ok(returnIdx < planIdx, '#chat-return-latest 应位于 #agent-plan-progress 之前');
    const between = TEMPLATE.slice(returnIdx, planIdx);
    assert.ok(!/<button[\s\S]*?<\/button>[\s\S]*<button/.test(between), '两者之间不应再插入其他按钮');
    assert.equal((between.match(/<\/button>/g) || []).length, 1, '两者之间应只结束一个按钮');
    assert.match(between, /<\/button>\s*$/, '两者之间不应夹带其他结构');
});

/* ------------------------------------------------------------------ */
/* 6. router.js 页面切换事件                                          */
/* ------------------------------------------------------------------ */

test('router.js：switchPage 派发 si-lens-page-changed 事件', () => {
    const start = ROUTER.indexOf('function switchPage(pageId) {');
    assert.ok(start !== -1, '缺少 switchPage 实现');
    const end = ROUTER.indexOf('\nwindow.switchPage', start);
    assert.ok(end !== -1, '未找到 switchPage 结尾');
    const body = ROUTER.slice(start, end);
    assert.match(body, /dispatchEvent/, 'switchPage 需派发事件');
    assert.match(body, /CustomEvent\('si-lens-page-changed',\s*\{\s*detail:\s*\{\s*pageId:\s*pageId\s*\}\s*\}\)/, '事件需携带 pageId 明细');
});

/* ------------------------------------------------------------------ */
/* 7. 四语言文案完整性                                                */
/* ------------------------------------------------------------------ */

const LOCALES = ['zh-CN', 'en-US', 'ru-RU', 'ar-SA'];
const commandPalette = {};
const headerSearch = {};

function collectReferencedPaletteKeys() {
    const keys = new Set();
    const re = /commandPalette\.([A-Za-z0-9_]+)/g;
    for (const src of [PALETTE_SOURCE, TEMPLATE]) {
        let m;
        while ((m = re.exec(src)) !== null) {
            keys.add(m[1]);
        }
        re.lastIndex = 0;
    }
    return [...keys].sort();
}

test('语言包：四语言均可解析且使用 2 空格缩进', () => {
    for (const locale of LOCALES) {
        const file = path.join(WEB_DIR, 'static', 'i18n', `${locale}.json`);
        const raw = fs.readFileSync(file, 'utf8');
        const data = JSON.parse(raw);
        assert.equal(JSON.stringify(data, null, 2) + '\n', raw, `${locale} 需保持 2 空格格式化`);
        commandPalette[locale] = data.commandPalette;
        headerSearch[locale] = data.header && data.header.commandSearch;
        assert.equal(typeof commandPalette[locale], 'object', `${locale} 缺少 commandPalette 对象`);
    }
});

test('语言包：commandPalette 键集合在四语言间完全一致', () => {
    const reference = Object.keys(commandPalette['zh-CN']).sort();
    assert.ok(reference.length > 0);
    for (const locale of LOCALES) {
        assert.deepEqual(Object.keys(commandPalette[locale]).sort(), reference, `${locale} 的 commandPalette 键集合不一致`);
    }
});

test('语言包：header.commandSearch 与全部被引用的 commandPalette 键均为非空本地化文案', () => {
    const referenced = collectReferencedPaletteKeys();
    assert.ok(referenced.length >= 20, `引用的 commandPalette 键过少：${referenced.length}`);
    for (const locale of LOCALES) {
        const search = headerSearch[locale];
        assert.equal(typeof search, 'string', `${locale} 缺少 header.commandSearch`);
        assert.ok(search.trim().length > 0, `${locale} 的 header.commandSearch 为空`);
        for (const key of referenced) {
            const value = commandPalette[locale][key];
            assert.equal(typeof value, 'string', `${locale} 缺少 commandPalette.${key}`);
            assert.ok(value.trim().length > 0, `${locale} 的 commandPalette.${key} 为空`);
        }
    }
});

test('语言包：各语言文案互不相同（确实完成本地化而非占位）', () => {
    const brandOnly = new Set(['brandFoot']);
    for (const key of Object.keys(commandPalette['zh-CN'])) {
        if (brandOnly.has(key)) continue;
        const values = LOCALES.map(locale => commandPalette[locale][key]);
        const unique = new Set(values);
        assert.ok(unique.size >= 2, `commandPalette.${key} 未本地化：${values.join(' | ')}`);
    }
    assert.equal(new Set(LOCALES.map(locale => headerSearch[locale])).size, LOCALES.length, 'header.commandSearch 需四语言各不相同');
});

/* ------------------------------------------------------------------ */
/* 8. 阶段四：品牌、图标管线与移动端几何契约                          */
/* ------------------------------------------------------------------ */

const LOGO_SOURCE = fs.readFileSync(path.join(WEB_DIR, 'static', 'si-lens-logo.svg'), 'utf8');
const ROLES_SOURCE = fs.readFileSync(path.join(JS_DIR, 'roles.js'), 'utf8');

/** 从 source 中截取 [needle, 其后首个 endNeedle] 片段，缺失即失败 */
function sliceThrough(source, needle, endNeedle) {
    const start = source.indexOf(needle);
    assert.ok(start !== -1, `源码中缺少 ${needle}`);
    const end = source.indexOf(endNeedle, start);
    assert.ok(end !== -1, `${needle} 缺少结束标记 ${endNeedle}`);
    return source.slice(start, end + endNeedle.length);
}

/** 返回 CSS 中首个匹配选择器之后的花括号规则体 */
function cssRuleBody(selector) {
    const start = CSS.indexOf(selector);
    assert.ok(start !== -1, `CSS 缺少选择器 ${selector}`);
    const open = CSS.indexOf('{', start);
    const close = CSS.indexOf('}', open);
    assert.ok(open !== -1 && close !== -1, `${selector} 规则体不完整`);
    return CSS.slice(open + 1, close);
}

/** 返回 roles.js 中具名函数的完整函数体 */
function rolesFunctionBody(name) {
    const start = ROLES_SOURCE.indexOf(`function ${name}(`);
    assert.ok(start !== -1, `roles.js 缺少函数 ${name}`);
    const end = ROLES_SOURCE.indexOf('\nfunction ', start);
    return ROLES_SOURCE.slice(start, end === -1 ? undefined : end);
}

test('阶段四：品牌图标使用 coss.com/ui 中性炭黑，不再使用蓝紫渐变', () => {
    assert.match(LOGO_SOURCE, /#171717/i, '品牌图标需包含 coss.com/ui 中性炭黑 #171717');
    assert.match(LOGO_SOURCE, /#FAFAFA/i, '品牌图标前景需使用中性白 #FAFAFA');
    assert.doesNotMatch(LOGO_SOURCE, /#2563EB/i, '品牌图标不应保留钴蓝 #2563EB');
    assert.doesNotMatch(LOGO_SOURCE, /#7C3AED/i, '品牌图标不应保留紫色 #7C3AED');
});

test('模板：语言切换与角色图标为线性 SVG，不含表情符号', () => {
    const langBtn = sliceThrough(TEMPLATE, 'class="btn-secondary lang-switcher-btn"', '</button>');
    assert.match(langBtn, /<svg class="lang-switcher-svg"/, '语言切换按钮需内联 SVG 图标');

    const langIcon = sliceThrough(TEMPLATE, 'class="lang-switcher-icon"', '</span>');
    assert.doesNotMatch(langIcon, /🌐/, '语言切换图标不应再使用 🌐 表情');

    const roleIcon = sliceThrough(TEMPLATE, 'id="role-selector-icon"', '</span>');
    assert.match(roleIcon, /<svg class="sl-role-default-svg"/, '角色选择器需内联默认角色 SVG');
    assert.doesNotMatch(roleIcon, /🔵/, '角色选择器不应再使用 🔵 表情');
});

test('模板：搜索按钮与攻击链导出按钮使用 SVG 图标', () => {
    for (const handler of ['searchTools()', 'searchKnowledgeItems()']) {
        const btn = sliceThrough(TEMPLATE, `onclick="${handler}"`, '</button>');
        assert.match(btn, /<svg/, `${handler} 搜索按钮需内联 SVG 图标`);
        assert.doesNotMatch(btn, />🔍</, `${handler} 搜索按钮不应使用 🔍 表情`);
    }
    for (const format of ['png', 'svg']) {
        const btn = sliceThrough(TEMPLATE, `exportAttackChain('${format}')`, '</button>');
        assert.match(btn, /<svg/, `导出 ${format.toUpperCase()} 按钮需内联 SVG 图标`);
        assert.doesNotMatch(btn, /📥/, `导出 ${format.toUpperCase()} 按钮不应使用 📥 表情`);
    }
});

test('roles.js：默认角色图标走统一 SVG 渲染管线', () => {
    assert.match(ROLES_SOURCE, /const DEFAULT_ROLE_ICON_SVG\s*=/, '缺少 DEFAULT_ROLE_ICON_SVG 常量');
    assert.match(ROLES_SOURCE, /function isDefaultSymbolRoleIcon\(/, '缺少 isDefaultSymbolRoleIcon');
    assert.match(ROLES_SOURCE, /function renderRoleIconMarkup\(/, '缺少 renderRoleIconMarkup');

    const renderBody = rolesFunctionBody('renderRoleIconMarkup');
    assert.match(renderBody, /return DEFAULT_ROLE_ICON_SVG/, 'renderRoleIconMarkup 应对默认图标返回 SVG');

    const updateBody = rolesFunctionBody('updateRoleSelectorDisplay');
    assert.match(updateBody, /innerHTML\s*=\s*DEFAULT_ROLE_ICON_SVG/, 'updateRoleSelectorDisplay 应赋值 DEFAULT_ROLE_ICON_SVG');
    assert.doesNotMatch(updateBody, /'🔵'/, 'updateRoleSelectorDisplay 不应再赋值 🔵 表情');
});

test('CSS：图标色板令牌在浅色与暗色主题齐备', () => {
    for (const [label, selector] of [['浅色', ':root'], ['暗色', 'html[data-theme="dark"] {']]) {
        const block = cssRuleBody(selector);
        for (const token of ['--sl-icon-fg:', '--sl-icon-bg:']) {
            assert.ok(block.includes(token), `${label}主题缺少图标令牌 ${token}`);
        }
    }
});

test('CSS：仪表盘 KPI / 资源 / 严重度图标统一为光学图标底色', () => {
    for (const selector of ['.dashboard-kpi-icon-tasks', '.dashboard-resource-icon-mcp']) {
        assert.match(cssRuleBody(selector), /background:\s*var\(--sl-icon-bg\)/, `${selector} 应使用 --sl-icon-bg`);
    }
    assert.match(
        cssRuleBody('.dashboard-severity-status-cell'),
        /background:\s*var\(--sl-surface-muted\)/,
        '.dashboard-severity-status-cell 应使用 --sl-surface-muted'
    );
});

test('CSS：C2 模块令牌在浅色与暗色下均重映射到光学变量', () => {
    for (const [label, selector] of [['浅色', ':root'], ['暗色', 'html[data-theme="dark"] {']]) {
        const block = cssRuleBody(selector);
        assert.match(block, /--c2-surface:\s*var\(--sl-[\w-]+\)/, `${label}主题 --c2-surface 未重映射`);
        assert.match(block, /--c2-accent:\s*var\(--sl-accent\)/, `${label}主题 --c2-accent 未重映射`);
    }
});

test('CSS：设置导航与项目列表去除左侧竖条', () => {
    assert.match(cssRuleBody('html body .settings-nav-item'), /border-left:\s*0/, '.settings-nav-item 需清除左边框');
    assert.match(
        cssRuleBody('html body #page-projects .projects-list-item::before'),
        /display:\s*none/,
        '#page-projects .projects-list-item::before 需隐藏'
    );
});

test('CSS：移动端几何令牌、抽屉与标签栏统一为光学样式', () => {
    const mobileStart = CSS.indexOf('@media (max-width: 767.98px)');
    assert.ok(mobileStart !== -1, '缺少移动端媒体查询');
    const mobileEnd = CSS.indexOf('@media', mobileStart + 10);
    const mobileBlock = CSS.slice(mobileStart, mobileEnd === -1 ? undefined : mobileEnd);

    assert.match(mobileBlock, /--m-r-btn:\s*10px/, '移动端按钮圆角应覆盖为 10px');
    assert.match(mobileBlock, /#m-tabbar[\s\S]{0,120}?background:\s*var\(--sl-surface\)/, '#m-tabbar 需使用光学表面色');
    assert.match(mobileBlock, /\.main-sidebar,[\s\S]{0,240}?backdrop-filter:\s*none\s*!important/, '.main-sidebar 需不透明');
    assert.match(mobileBlock, /#m-sheet[\s\S]{0,160}?border-top:\s*1px solid var\(--sl-border-strong\)/, '#m-sheet 需统一顶部描边');
    assert.match(
        mobileBlock,
        /\.m-tab\.m-active svg\s*\{[^}]*background:\s*transparent\s*!important[^}]*border-radius:\s*0\s*!important/,
        '.m-tab.m-active svg 需移除圆形底面'
    );
});

/* ------------------------------------------------------------------ */
/* 9. 阶段五：@coss/ui 与 @coss/chat 替换、Lucide 图标与微动效契约      */
/* ------------------------------------------------------------------ */

const COSS_SRC_DIR = path.join(WEB_DIR, 'coss-ui', 'src');
const COSS_DIST_DIR = path.join(WEB_DIR, 'static', 'coss');
const COSS_CSS = fs.readFileSync(path.join(COSS_DIST_DIR, 'coss-ui.css'), 'utf8');
const MOBILE_UI = fs.readFileSync(path.join(JS_DIR, 'mobile-ui.js'), 'utf8');
const MOTION = require('./coss-motion.js');

test('阶段五：@coss/ui 与 @coss/chat 源组件齐备', () => {
    const expected = [
        'components/ui/command.tsx',
        'components/ui/toast.tsx',
        'components/ui/button.tsx',
        'components/ui/badge.tsx',
        'components/ui/card.tsx',
        'components/ui/frame.tsx',
        'components/ui/kbd.tsx',
        'components/ui/tabs.tsx',
        'components/ui/tooltip.tsx',
        'components/chat/chat-bubble.tsx',
        'components/chat/chat-typing-indicator.tsx',
        'components/chat/chat-jump-to-latest-button.tsx',
        'components/chat/chat-date-pill.tsx',
        'components/chat/chat-delivery-indicator.tsx',
        'islands/CossCommandPaletteIsland.tsx',
        'islands/CossToastIsland.tsx',
        'islands/CossChatExperienceIsland.tsx',
        'islands/CossSwarmControlsIsland.tsx'
    ];
    for (const relative of expected) {
        const full = path.join(COSS_SRC_DIR, relative);
        assert.ok(fs.existsSync(full), `缺少 coss 源组件 ${relative}`);
        assert.ok(fs.statSync(full).size > 0, `coss 源组件 ${relative} 为空文件`);
    }
});

test('阶段五：Vite 产物非空且 @layer base 已作用域化，不注入全局 preflight', () => {
    for (const name of ['coss-ui.js', 'coss-ui.css']) {
        const full = path.join(COSS_DIST_DIR, name);
        assert.ok(fs.existsSync(full), `缺少 Vite 产物 static/coss/${name}`);
        assert.ok(fs.statSync(full).size > 1024, `Vite 产物 ${name} 体积异常，疑似未构建`);
    }

    const layerIndex = COSS_CSS.indexOf('@layer base{');
    assert.ok(layerIndex !== -1, 'coss-ui.css 缺少 @layer base');
    const body = COSS_CSS.slice(layerIndex + '@layer base{'.length);
    const firstSelector = body.slice(0, body.indexOf('{'));
    assert.match(firstSelector, /\.coss-island|\[data-slot\]/, '@layer base 首个选择器需作用域到 .coss-island / [data-slot]');
    assert.doesNotMatch(
        firstSelector,
        /(^|,)\s*(\*|html|body|h1|p|a|ul)(\s*,|\s*$)/,
        '@layer base 不应向全局元素注入 preflight'
    );
});

test('阶段五：模板挂载点、样式顺序与脚本加载', () => {
    const cssIndex = TEMPLATE.indexOf('/static/coss/coss-ui.css');
    const polishIndex = TEMPLATE.indexOf('/static/css/si-lens-polish.css');
    assert.ok(cssIndex !== -1 && polishIndex !== -1, '模板缺少 coss-ui.css 或 si-lens-polish.css');
    assert.ok(cssIndex < polishIndex, 'coss-ui.css 需先于 si-lens-polish.css 加载，供覆盖层生效');

    for (const id of ['sl-coss-chat-typing-root', 'sl-coss-swarm-status-root', 'sl-coss-cmdk-root', 'sl-coss-toast-root']) {
        assert.ok(TEMPLATE.includes(`id="${id}"`), `模板缺少挂载点 #${id}`);
    }

    const returnLatest = TEMPLATE.indexOf('id="chat-return-latest"');
    const planProgress = TEMPLATE.indexOf('id="agent-plan-progress"');
    const typingRoot = TEMPLATE.indexOf('id="sl-coss-chat-typing-root"');
    assert.ok(returnLatest !== -1 && planProgress !== -1, '模板缺少 #chat-return-latest 或 #agent-plan-progress');
    assert.ok(returnLatest < typingRoot, '#chat-return-latest 需在 #sl-coss-chat-typing-root 之前');
    assert.ok(planProgress < typingRoot, '#agent-plan-progress 需在 #sl-coss-chat-typing-root 之前');

    assert.match(TEMPLATE, /src="\/static\/js\/coss-motion\.js/, '模板需加载 /static/js/coss-motion.js');
    assert.match(TEMPLATE, /type="module"\s+src="\/static\/coss\/coss-ui\.js/, '模板需以 module 方式加载 coss-ui.js');
});

test('阶段五：coss-motion.js 导出纯函数与滑块的几何计算', () => {
    for (const name of ['TAB_CONTAINER_CONFIGS', 'computeGliderRect', 'syncAllGliders', 'initCossMotion']) {
        assert.ok(name in MOTION, `coss-motion.js 缺少导出 ${name}`);
    }
    assert.ok(Array.isArray(MOTION.TAB_CONTAINER_CONFIGS), 'TAB_CONTAINER_CONFIGS 需为数组');
    assert.ok(MOTION.TAB_CONTAINER_CONFIGS.length > 0, 'TAB_CONTAINER_CONFIGS 不应为空');

    assert.equal(MOTION.computeGliderRect(null, null), null, '容器或激活项缺失时应返回 null');
    assert.equal(MOTION.computeGliderRect({}, { offsetWidth: 0, offsetHeight: 0 }), null, '隐藏元素应返回 null');
    assert.deepEqual(
        MOTION.computeGliderRect({}, { offsetLeft: 12, offsetTop: 4, offsetWidth: 80, offsetHeight: 32 }),
        { x: 12, y: 4, width: 80, height: 32 },
        '可见元素应返回其偏移与尺寸'
    );
});

test('阶段五：CSS 覆盖层重映射 coss.com/ui 中性色板与聊天/滑块/层级', () => {
    for (const token of [
        '--sl-canvas: #fafafa',
        '--sl-accent: #262626',
        '--sl-canvas: #141414',
        '--sl-chat-user-bg'
    ]) {
        assert.ok(CSS.includes(token), `覆盖层缺少 ${token}`);
    }
    for (const selector of ['#chat-send-btn', '.coss-tab-glider']) {
        assert.ok(CSS.includes(selector), `覆盖层缺少选择器 ${selector}`);
    }
    assert.match(
        CSS,
        /\[data-slot="command-dialog-backdrop"\][\s\S]{0,400}?z-index:\s*12060\s*!important/,
        '命令面板遮罩需抬升到 z-index: 12060 !important'
    );

    const reducedStart = CSS.lastIndexOf('@media (prefers-reduced-motion: reduce)');
    assert.ok(reducedStart !== -1, '缺少 prefers-reduced-motion 保护块');
    assert.ok(CSS.slice(reducedStart).includes('.coss-page-in'), '.coss-page-in 需在减弱动效块内禁用');
});

test('阶段五：移动端图标走 Lucide 1.75 描边管线，无硬编码中文', () => {
    const start = MOBILE_UI.indexOf('var ICON = {');
    assert.ok(start !== -1, 'mobile-ui.js 缺少 ICON 图标表');
    const end = MOBILE_UI.indexOf('};', start);
    const block = MOBILE_UI.slice(start, end === -1 ? undefined : end);

    const svgCount = (block.match(/<svg/g) || []).length;
    const stroked = (block.match(/stroke-width="1\.75"/g) || []).length;
    assert.ok(svgCount > 0, 'ICON 图标表不应为空');
    assert.equal(stroked, svgCount, `ICON 图标需全部使用 1.75 描边（${stroked}/${svgCount}）`);
    assert.doesNotMatch(block, /[\u4e00-\u9fff]/, 'ICON 图标表不应出现硬编码中文');
});


/* ------------------------------------------------------------------ */
/* 10. 阶段六：角色统一 Lucide 图标、Favicon、精简顶栏、5组导航与离线包更新 */
/* ------------------------------------------------------------------ */

test('阶段六：内置角色 YAML 均使用统一 Lucide 语义图标标识', () => {
    const rolesDir = path.join(path.dirname(WEB_DIR), 'roles');
    const files = fs.readdirSync(rolesDir).filter((f) => f.endsWith('.yaml'));
    assert.ok(files.length >= 13, '内置角色 YAML 数量应不少于 13 个');
    for (const file of files) {
        const body = fs.readFileSync(path.join(rolesDir, file), 'utf8');
        const m = body.match(/^icon:\s*"?([^"\n]+)"?/m);
        assert.ok(m && m[1], `${file} 缺少 icon 字段`);
        assert.match(m[1].trim(), /^[a-z][a-z0-9-]+$/, `${file} icon 应为语义化 Lucide key，实际为 ${m[1]}`);
    }
});

test('阶段六：roles.js 统一映射 SVG 图标并提供选择器 #role-icon-picker', () => {
    assert.match(ROLES_SOURCE, /const ROLE_ICON_CATALOG\s*=/);
    assert.match(ROLES_SOURCE, /const LEGACY_EMOJI_TO_ROLE_ICON\s*=/);
    assert.match(ROLES_SOURCE, /function renderRoleIconPicker\(/);
    assert.ok(TEMPLATE.includes('id="role-icon-picker"'), '模板应包含 #role-icon-picker');
});

test('阶段六：多尺寸 Favicon 资源就位且模板隐藏 API 文档 / GitHub 按钮', () => {
    for (const asset of ['favicon.ico', 'favicon-32x32.png', 'apple-touch-icon.png', 'logo.png', 'si-lens-logo.svg']) {
        const full = path.join(WEB_DIR, 'static', asset);
        assert.ok(fs.existsSync(full), `缺少图标资源 static/${asset}`);
        assert.ok(fs.statSync(full).size > 200, `图标资源 static/${asset} 体积异常`);
    }
    assert.match(TEMPLATE, /href="\/static\/si-lens-logo\.svg\?v=/);
    assert.match(TEMPLATE, /href="\/static\/favicon-32x32\.png\?v=/);
    assert.match(TEMPLATE, /href="\/static\/favicon\.ico\?v=/);
    assert.match(TEMPLATE, /href="\/static\/apple-touch-icon\.png\?v=/);

    assert.doesNotMatch(TEMPLATE, /class="openapi-doc-btn"/, '右上角 API 文档与 GitHub 按钮应已移除');
    assert.doesNotMatch(MOBILE_UI, /buildSheetItem\('header\.(apiDocs|github)'/, '移动端更多面板应已移除 API 文档与 GitHub');
});

test('阶段六：左侧导航按工作流合理拆分为 5 个分组', () => {
    const groups = ['workbench', 'assessment', 'operations', 'capabilities', 'administration'];
    let prev = -1;
    for (const g of groups) {
        const idx = TEMPLATE.indexOf(`data-i18n="navGroups.${g}"`);
        assert.ok(idx !== -1, `模板缺少导航分组 navGroups.${g}`);
        assert.ok(idx > prev, `导航分组 navGroups.${g} 顺序异常`);
        prev = idx;
    }
});

test('阶段六：系统更新仅保留离线上传安装包能力', () => {
    const updateJs = fs.readFileSync(path.join(JS_DIR, 'update.js'), 'utf8');
    assert.ok(updateJs.includes('/api/system/update/package'), 'update.js 应通过 /api/system/update/package 上传包');
    for (const legacyEndpoint of ['/api/system/update/check', '/api/system/update/source', '/api/system/update/rollback', '/api/system/update/adopt']) {
        assert.equal(updateJs.includes(legacyEndpoint), false, `update.js 不应保留旧接口 ${legacyEndpoint}`);
    }
});
