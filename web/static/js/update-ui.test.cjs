const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

const source = fs.readFileSync('web/static/js/update.js', 'utf8');
const template = fs.readFileSync('web/templates/index.html', 'utf8');
const zh = JSON.parse(fs.readFileSync('web/static/i18n/zh-CN.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('web/static/i18n/en-US.json', 'utf8'));
const ru = JSON.parse(fs.readFileSync('web/static/i18n/ru-RU.json', 'utf8'));
const ar = JSON.parse(fs.readFileSync('web/static/i18n/ar-SA.json', 'utf8'));

function resolve(dict, dotted) {
    let node = dict;
    for (const part of dotted.split('.')) {
        if (!node || typeof node !== 'object') return undefined;
        node = node[part];
    }
    return typeof node === 'string' ? node : undefined;
}

const baseStatus = {
    root: '/srv/csai',
    hasBinary: true,
};

function envelope(statusPatch, job, canRestart, flags) {
    return {
        status: Object.assign({}, baseStatus, statusPatch || {}),
        job: job === undefined ? null : job,
        canRestart: canRestart !== false,
        bootID: (flags && flags.bootID) || 'boot-1',
        buildRevision: (flags && flags.buildRevision) || 'abc123456789',
        activationTracking: !!(flags && flags.activationTracking),
        needsRestart: !!(flags && flags.needsRestart),
        binaryBuiltAt: (flags && flags.binaryBuiltAt) || '',
    };
}

class MockFormData {
    constructor() {
        this._fields = new Map();
    }
    append(k, v) {
        this._fields.set(k, v);
    }
    get(k) {
        return this._fields.get(k);
    }
}

async function harness(options) {
    const opts = options || {};
    const nodes = new Map();
    const calls = [];
    const toasts = [];
    const confirms = [];
    const timers = new Map();
    const location = {
        pathname: '/',
        search: opts.search || '',
        replaced: [],
        reloaded: 0,
        replace(u) { this.replaced.push(u); },
        reload() { this.reloaded++; },
    };
    let nextTimerId = 1;
    let probeIdx = 0;

    function makeEl(id) {
        let seeded = ['page'];
        if (id === 'page-settings') seeded = ['page', 'active'];
        if (id === 'settings-section-update') seeded = ['settings-section-content', 'active'];
        const clsSet = new Set(seeded);
        return {
            id,
            value: '',
            innerHTML: '',
            classList: {
                contains: (c) => clsSet.has(c),
                toggle: (c, force) => { if (force) clsSet.add(c); else clsSet.delete(c); },
                add: (c) => clsSet.add(c),
                remove: (c) => clsSet.delete(c),
            },
        };
    }

    ['page-settings', 'settings-section-update', 'update-console', 'update-dropzone', 'update-package-file-input'].forEach((id) => {
        nodes.set(id, makeEl(id));
    });

    const responses = Object.assign({
        'GET /api/system/update': [envelope(opts.status, opts.job, opts.canRestart, opts.flags)],
    }, opts.responses || {});

    const ctx = {
        console,
        Date,
        URLSearchParams,
        FormData: MockFormData,
        authToken: 'test-session',
        location,
        document: {
            getElementById(id) {
                return nodes.get(id) || null;
            },
        },
        window: {
            t(key, params) {
                let s = resolve(zh, key) || key;
                if (params && typeof params === 'object') {
                    Object.keys(params).forEach((p) => {
                        s = s.replace(new RegExp('\\{\\{' + p + '\\}\\}', 'g'), String(params[p]));
                    });
                }
                return s;
            },
            confirm(msg) {
                confirms.push(msg);
                return opts.confirm !== false;
            },
            applyRBACToUI() {},
        },
        showNotification(message, type) {
            toasts.push({ message, type });
        },
        escapeHtml(s) {
            return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        },
        escapeAttr(s) {
            return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
        },
        async apiFetch(url, init) {
            const method = (init && init.method) || 'GET';
            const key = `${method} ${url}`;
            calls.push({ method, url, body: init && init.body });
            const queue = responses[key] || [];
            const item = queue.length > 1 ? queue.shift() : queue[0];
            if (!item) {
                return { ok: true, status: 200, json: async () => ({}) };
            }
            const hasEnvelopeShape = item && typeof item.status === 'number' && Object.prototype.hasOwnProperty.call(item, 'body');
            const status = hasEnvelopeShape ? item.status : (typeof item.status === 'number' ? item.status : 200);
            const body = hasEnvelopeShape ? item.body : item;
            return {
                ok: status >= 200 && status < 300,
                status,
                json: async () => body,
            };
        },
        async fetch(url, init) {
            if (url === '/api/auth/validate') {
                const probe = (opts.probes || [])[probeIdx++] || { status: 200, bootID: 'boot-1' };
                if (probe === 'down') throw new Error('ECONNREFUSED');
                return {
                    status: probe.status || 200,
                    ok: (probe.status || 200) < 400,
                    headers: {
                        get(name) {
                            const lower = name.toLowerCase();
                            if (lower === 'x-cyberstrike-boot-id') return probe.bootID || '';
                            if (lower === 'x-cyberstrike-activation-id') return probe.activationID || '';
                            if (lower === 'x-cyberstrike-build-revision') return probe.revision || '';
                            return null;
                        },
                    },
                    json: async () => ({}),
                };
            }
            return ctx.apiFetch(url, init);
        },
        setInterval(fn, ms) {
            const id = nextTimerId++;
            timers.set(id, { fn, ms });
            return id;
        },
        clearInterval(id) {
            timers.delete(id);
        },
        setTimeout,
        clearTimeout,
    };

    vm.runInNewContext(source, ctx);
    await ctx.window.loadUpdateConsole();
    return {
        api: ctx.window,
        html: () => nodes.get('update-console').innerHTML,
        calls,
        toasts,
        confirms,
        location,
        async tick() {
            const list = Array.from(timers.values());
            for (const t of list) {
                await t.fn();
            }
            await new Promise(resolve => setImmediate(resolve));
        },
        liveTimers: () => Array.from(timers.keys()),
    };
}

test('upload-only update console omits git/remote/source/rollback UI and exposes package dropzone', async () => {
    const h = await harness();
    const html = h.html();

    assert.match(html, /update-dropzone/);
    assert.match(html, /update-package-file-input/);
    assert.match(html, /update-package-upload-btn" disabled data-state-disabled="true" data-require-permission="update:apply"/);
    assert.match(html, /abc123456789/);

    // Must not call remote check or render legacy git source / rollback buttons
    assert.equal(h.calls.some(c => c.url.includes('/check') || c.url.includes('/source') || c.url.includes('/adopt') || c.url.includes('/rollback')), false);
    assert.doesNotMatch(html, /update-apply-btn|update-check-btn|update-rollback-btn|update-source-url|update-adopt-/);
    assert.match(template, /id="settings-section-update"[\s\S]*?data-require-permission="update:read"/);
});

test('selecting invalid archive extension shows error and keeps upload button disabled', async () => {
    const h = await harness();
    h.api.selectUpdatePackageFile({ name: 'readme.txt', size: 120 });
    assert.match(h.html(), /仅支持|安装包格式不支持/);
    assert.match(h.html(), /update-package-upload-btn" disabled/);
    assert.equal(h.toasts.some(t => t.type === 'error'), true);
});

test('selecting valid zip enables upload, posts FormData to /api/system/update/package, and polls job', async () => {
    const jobRunning = { id: 'upd-pkg-1', kind: 'package', state: 'running', started: '2026-11-23T09:30:00+08:00', steps: [{ phase: 'extract', message: '正在安全解压安装包 strixlens-v2.tar.gz', at: '09:30:01' }] };
    const jobDone = {
        id: 'upd-pkg-1',
        kind: 'package',
        state: 'succeeded',
        started: '2026-11-23T09:30:00+08:00',
        finished: '2026-11-23T09:30:04+08:00',
        steps: jobRunning.steps.concat([{ phase: 'done', message: '离线更新包安装完成', at: '09:30:04' }]),
        result: { filesTouched: 12, keptContent: ['config.yaml', 'roles/渗透测试.yaml'], binaryBuilt: true, needsRestart: true, backupDir: '.update-backup/pkg-1', duration: '4s' },
        restartRequested: false,
    };

    const h = await harness({
        canRestart: true,
        responses: {
            'POST /api/system/update/package': [{ status: 202, body: { job_id: 'upd-pkg-1', state: 'running', bootID: 'boot-1' } }],
            'GET /api/system/update/job': [{ status: 200, body: { job: jobRunning } }, { status: 200, body: { job: jobDone } }],
            'GET /api/system/update': [envelope(), envelope(null, jobDone, true, { needsRestart: true, binaryBuiltAt: '2026-11-23T09:30:04Z' })],
        },
    });

    h.api.selectUpdatePackageFile({ name: 'strixlens-v2.tar.gz', size: 2048 * 1024 });
    assert.match(h.html(), /strixlens-v2\.tar\.gz/);
    assert.match(h.html(), /2\.00 MB/);
    assert.doesNotMatch(h.html(), /update-package-upload-btn" disabled/);

    await h.api.startPackageUpload();
    const uploadCall = h.calls.find(c => c.url === '/api/system/update/package');
    assert.ok(uploadCall, 'expected POST /api/system/update/package');
    assert.equal(uploadCall.body.get('restart'), 'true');
    assert.equal(uploadCall.body.get('file').name, 'strixlens-v2.tar.gz');

    await h.tick();
    assert.match(h.html(), /离线更新包安装完成/);
    assert.match(h.html(), /config\.yaml/);
    assert.match(h.html(), /update-restart-btn/);
});

test('restart banner triggers POST /api/system/update/restart and watchdog reloads on new bootID', async () => {
    const h = await harness({
        flags: { needsRestart: true, binaryBuiltAt: '2026-11-23T09:30:00Z', bootID: 'boot-old', activationTracking: true },
        responses: {
            'POST /api/system/update/restart': [{ status: 202, body: { restarting: true, activation_id: 'act-9', bootID: 'boot-old' } }],
        },
        probes: ['down', { status: 200, bootID: 'boot-new', activationID: 'act-9' }],
    });

    assert.match(h.html(), /update-restart-btn/);
    await h.api.startRestartNow();
    assert.equal(h.confirms.length, 1);
    assert.match(h.html(), /正在重启服务/);

    await h.tick();
    assert.equal(h.location.replaced.length, 0);
    await h.tick();
    assert.equal(h.location.replaced.length, 1);
    assert.match(h.location.replaced[0], /#system-update$/);
});

test('XSS payloads in package filename and failure message are escaped', async () => {
    const evilJob = {
        id: 'upd-xss',
        kind: 'package',
        state: 'failed',
        steps: [],
        failure: { reason: '<img src=x onerror=alert(1)>', message: '<script>alert(2)</script>' },
    };
    const h = await harness({ job: evilJob });
    h.api.selectUpdatePackageFile({ name: '<svg onload=alert(3)>.zip', size: 512 });
    const html = h.html();
    assert.doesNotMatch(html, /<script>|<svg onload=|<img src=x/);
    assert.match(html, /&lt;svg onload=alert\(3\)&gt;\.zip/);
});

test('all 4 locale files contain required navGroups, roleModal, and update package keys', () => {
    const requiredKeys = [
        'navGroups.workbench', 'navGroups.assessment', 'navGroups.operations', 'navGroups.capabilities', 'navGroups.administration',
        'roleModal.roleIcon', 'roleModal.roleIconPlaceholder', 'roleModal.roleIconHint',
        'update.title', 'update.intro', 'update.packageTitle', 'update.packageDropHint',
        'update.packageSelectBtn', 'update.packageUploadBtn', 'update.packageProtectedHint',
        'update.restartNowBtn', 'update.jobTitle', 'update.installTitle',
    ];
    for (const [name, dict] of [['zh-CN', zh], ['en-US', en], ['ru-RU', ru], ['ar-SA', ar]]) {
        for (const k of requiredKeys) {
            const val = resolve(dict, k);
            assert.ok(val && val.trim().length > 0, `${name} missing or empty key: ${k}`);
        }
    }
});
