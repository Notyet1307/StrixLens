// 控制台「一键更新」：仅支持通过上传离线安装包（.zip / .tar.gz / .tgz）更新安装树。
const UPDATE_POLL_INTERVAL_MS = 1500;
const UPDATE_WATCHDOG_INTERVAL_MS = 2000;
const UPDATE_WATCHDOG_TIMEOUT_MS = 90000;

const UPDATE_FAILURE_KEYS = {
    load: 'loadFailed',
    package: 'packageUploadFailed',
    restart: 'restartFailed',
};

const UPDATE_ALLOWED_ARCHIVE_RE = /\.(zip|tar\.gz|tgz)$/i;

let updateConsoleState = null;
let updateBusy = false;
let updatePollTimer = null;
let updatePollInFlight = null;
let updateActivation = null;
let updateRestartPending = false;
let updateWatchdogTimer = null;
let updateWatchdogDeadline = 0;
let updateWatchdogSlow = null;
let updateActionError = '';
let selectedUpdatePackageFile = null;

function updateT(key, opts) {
    const k = 'update.' + key;
    if (typeof window.t !== 'function') return k;
    const merged = Object.assign({ interpolation: { escapeValue: false } }, opts || {});
    const val = window.t(k, merged);
    if (val && val !== k) return val;
    const fallbacks = {
        packageTitle: '上传安装包更新',
        packageDropHint: '拖拽或点击选择离线更新包（支持 .zip / .tar.gz / .tgz）',
        packageSelectBtn: '选择安装包',
        packageSelectedLabel: '已选择安装包',
        packageClearBtn: '清除',
        packageUploadBtn: '上传并安装更新',
        packageUploadingBtn: '正在上传并安装…',
        packageInvalidFormat: '安装包格式不支持，请上传 .zip、.tar.gz 或 .tgz 文件',
        packageNoFile: '请先选择要安装的离线更新包',
        packageProtectedHint: '本机维护的 config.yaml、data/、roles/、skills/、tools/、agents/ 与 knowledge_base/ 会自动保留，不被安装包覆盖。',
        packageUploadAccepted: '安装包已上传并开始安装，进度每 1.5 秒自动刷新。',
        packageUploadFailed: '上传或安装更新包失败：{{reason}}',
        packageFilesUpdated: '更新文件数',
        packageJobKind: '离线安装包更新',
    };
    let fb = fallbacks[key] || k;
    if (opts && typeof opts === 'object') {
        Object.keys(opts).forEach((p) => {
            fb = fb.replace(new RegExp('\\{\\{' + p + '\\}\\}', 'g'), String(opts[p]));
        });
    }
    return fb;
}

function isAllowedPackageFile(name) {
    return UPDATE_ALLOWED_ARCHIVE_RE.test(String(name || '').trim());
}

function formatPackageSize(bytes) {
    const n = Number(bytes) || 0;
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / (1024 * 1024)).toFixed(2) + ' MB';
}

function isUpdateConsoleActive() {
    const page = document.getElementById('page-settings');
    const section = document.getElementById('settings-section-update');
    return !!(page && page.classList.contains('active') &&
        section && section.classList.contains('active'));
}

function updateStatusOf() {
    return (updateConsoleState && updateConsoleState.status) || {};
}

function updateJobOf() {
    const job = updateConsoleState && updateConsoleState.job;
    return job && typeof job === 'object' ? job : null;
}

function updateCanRestart() {
    return !!(updateConsoleState && updateConsoleState.canRestart);
}

function isUpdateJobRunning() {
    const job = updateJobOf();
    return !!(job && job.state === 'running');
}

// ---------------------------------------------------------------------------
// 请求层
// ---------------------------------------------------------------------------

async function runUpdateRequest(method, url, body, request = apiFetch) {
    const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
    const headers = isForm ? {} : { 'Content-Type': 'application/json' };
    const payload = body === undefined ? undefined : (isForm ? body : JSON.stringify(body));
    const resp = await request(url, {
        method: method,
        headers: headers,
        body: payload,
    });
    const data = await resp.json().catch(() => ({}));
    const refused = !!(data && typeof data.error === 'string' && data.error);
    return {
        ok: !!resp.ok && !refused,
        status: resp.status,
        data: data || {},
        error: refused ? data.error : ('HTTP ' + resp.status),
    };
}

function fetchDuringUpdate(url, options = {}) {
    const headers = { Accept: 'application/json', ...options.headers };
    if (typeof authToken === 'string' && authToken) headers.Authorization = 'Bearer ' + authToken;
    return fetch(url, {
        ...options,
        credentials: 'same-origin',
        cache: 'no-store',
        redirect: 'error',
        headers,
        signal: typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined,
    });
}

async function fetchUpdateStatus() {
    const r = await runUpdateRequest('GET', '/api/system/update');
    if (!r.ok) throw new Error(r.error);
    updateConsoleState = {
        status: r.data.status || {},
        job: r.data.job || null,
        canRestart: !!r.data.canRestart,
        bootID: r.data.bootID || '',
        buildRevision: r.data.buildRevision || '',
        activationTracking: !!r.data.activationTracking,
        needsRestart: !!r.data.needsRestart,
        binaryBuiltAt: r.data.binaryBuiltAt || '',
    };
    return updateConsoleState;
}

function notify(message, type) {
    if (typeof showNotification === 'function') {
        try {
            showNotification(message, type);
        } catch (e) {
            console.warn('notify', e);
        }
    }
}

async function withUpdateBusy(fn, label) {
    if (updateBusy) return;
    updateBusy = true;
    updateActionError = '';
    if (!updateRestartPending) renderUpdateConsole();
    try {
        await fn();
    } catch (err) {
        const reason = err && err.message ? err.message : String(err);
        updateActionError = updateT(UPDATE_FAILURE_KEYS[label] || 'loadFailed', { reason: reason });
        if (!updateRestartPending) renderUpdateConsole();
        notify(updateActionError, 'error');
    } finally {
        updateBusy = false;
        if (!updateRestartPending) renderUpdateConsole();
    }
}

// ---------------------------------------------------------------------------
// 入口与轮询
// ---------------------------------------------------------------------------

async function loadUpdateConsole() {
    stopUpdatePolling();
    if (updateActivation) {
        startUpdateWatchdog();
        if (updateRestartPending) renderUpdateWatchdog();
        if (!updateActivation.scheduled) startUpdatePolling();
        return;
    }
    updateActionError = '';
    const el = document.getElementById('update-console');
    if (!el) return;
    el.innerHTML = '<div class="empty-state">' + escapeHtml(updateT('loading')) + '</div>';
    try {
        await fetchUpdateStatus();
    } catch (err) {
        el.innerHTML = '<div class="empty-state">' +
            escapeHtml(updateT(UPDATE_FAILURE_KEYS.load, { reason: err.message })) + '</div>';
        return;
    }
    renderUpdateConsole();
    const job = updateJobOf();
    if (job?.restartRequested) {
        watchUpdateActivation(job.id);
        if (job.state === 'succeeded' && job.result?.binaryBuilt) {
            waitForUpdateRestart(job.result.toCommit);
            return;
        }
    }
    if (isUpdateJobRunning()) startUpdatePolling();
}

function startUpdatePolling() {
    stopUpdatePolling();
    updatePollTimer = setInterval(pollUpdateJob, UPDATE_POLL_INTERVAL_MS);
}

function stopUpdatePolling() {
    if (updatePollTimer) clearInterval(updatePollTimer);
    updatePollTimer = null;
}

// ---------------------------------------------------------------------------
// 重启守候
// ---------------------------------------------------------------------------

let updateWatchdogInFlight = null;

function watchUpdateActivation(id, bootID = updateConsoleState?.bootID) {
    updateActivation = {
        id,
        bootID,
        tracked: !!(id && updateConsoleState?.activationTracking),
        scheduled: false,
        targetCommit: '',
    };
    updateWatchdogSlow = null;
    updateWatchdogDeadline = Date.now() + UPDATE_WATCHDOG_TIMEOUT_MS;
    startUpdateWatchdog();
}

function waitForUpdateRestart(targetCommit = '') {
    stopUpdatePolling();
    updateActivation.scheduled = true;
    updateActivation.targetCommit = targetCommit;
    updateWatchdogSlow = null;
    updateWatchdogDeadline = Date.now() + UPDATE_WATCHDOG_TIMEOUT_MS;
    updateRestartPending = true;
    renderUpdateWatchdog();
}

async function watchdogProbe() {
    if (!isUpdateConsoleActive()) {
        stopUpdateWatchdog();
        return;
    }
    const timer = updateWatchdogTimer;
    if (!timer || updateWatchdogInFlight === timer) return;
    const activation = updateActivation;
    updateWatchdogInFlight = timer;
    let status = 0;
    let bootID = '';
    let activationID = '';
    let revision = '';
    let legacyUnauthorized = false;
    try {
        const resp = await fetchDuringUpdate('/api/auth/validate');
        status = resp.status;
        bootID = resp.headers?.get('X-CyberStrike-Boot-ID') || '';
        activationID = resp.headers?.get('X-CyberStrike-Activation-ID') || '';
        revision = resp.headers?.get('X-CyberStrike-Build-Revision') || '';
        if ((!activation.tracked || activation.scheduled) && status === 401 && !bootID && !activationID) {
            const data = await resp.json().catch(() => null);
            legacyUnauthorized = data?.error === '未授权访问，请先登录';
        }
    } catch {
        status = 0;
    } finally {
        if (updateWatchdogInFlight === timer) updateWatchdogInFlight = null;
    }
    if (!isUpdateConsoleActive() || timer !== updateWatchdogTimer || activation !== updateActivation) return;

    const answering = status === 200 || status === 401;
    const newBoot = answering && bootID && bootID !== activation.bootID;
    const targetMatches = !activation.targetCommit || !revision || revision.startsWith(activation.targetCommit);
    const matchesActivation = !activation.tracked || activationID === activation.id ||
        (activation.scheduled && !activationID);
    if ((newBoot && targetMatches && matchesActivation) || legacyUnauthorized) {
        stopUpdatePolling();
        stopUpdateWatchdog();
        const params = new URLSearchParams(location.search);
        params.set('restarted', Date.now());
        location.replace(location.pathname + '?' + params + '#system-update');
        return;
    }
    const timedOut = Date.now() > updateWatchdogDeadline;
    if (!updateRestartPending && (newBoot || timedOut)) {
        updateRestartPending = true;
        renderUpdateWatchdog();
    }
    if (updateRestartPending && updateWatchdogSlow === null && timedOut) {
        updateWatchdogSlow = newBoot ? 'unexpected' : bootID || status === 200 ? 'running' : 'down';
        renderUpdateWatchdog();
    }
}

function startUpdateWatchdog() {
    if (updateWatchdogTimer || !isUpdateConsoleActive()) return;
    updateWatchdogTimer = setInterval(watchdogProbe, UPDATE_WATCHDOG_INTERVAL_MS);
}

function stopUpdateWatchdog() {
    if (updateWatchdogTimer) clearInterval(updateWatchdogTimer);
    updateWatchdogTimer = null;
}

async function pollUpdateJob() {
    if (!isUpdateConsoleActive()) {
        stopUpdatePolling();
        stopUpdateWatchdog();
        return;
    }
    const timer = updatePollTimer;
    if (!timer || updatePollInFlight === timer) return;
    updatePollInFlight = timer;
    let r;
    try {
        r = await runUpdateRequest('GET', '/api/system/update/job', undefined,
            updateActivation ? fetchDuringUpdate : apiFetch);
    } catch (err) {
        r = { ok: false, error: err && err.message ? err.message : String(err) };
    } finally {
        if (updatePollInFlight === timer) updatePollInFlight = null;
    }
    if (timer !== updatePollTimer || !isUpdateConsoleActive()) return;
    if (!r.ok) {
        if (updateActivation) {
            if (!updateRestartPending) {
                updateRestartPending = true;
                updateWatchdogDeadline = Date.now() + UPDATE_WATCHDOG_TIMEOUT_MS;
                renderUpdateWatchdog();
            }
            return;
        }
        stopUpdatePolling();
        notify(updateT('jobPollFailed', { reason: r.error }), 'error');
        return;
    }

    const job = r.data?.job;
    if (updateActivation?.tracked && job?.id !== updateActivation.id) return;
    if (!job) {
        if (!updateActivation) stopUpdatePolling();
        return;
    }
    if (updateConsoleState) updateConsoleState.job = job;
    if (job.state === 'running') {
        updateRestartPending = false;
        updateWatchdogSlow = null;
        updateWatchdogDeadline = Date.now() + UPDATE_WATCHDOG_TIMEOUT_MS;
        renderUpdateConsole();
        return;
    }

    if (job.state === 'succeeded' && job.restartRequested && job.result?.binaryBuilt) {
        if (!updateActivation) watchUpdateActivation(job.id);
        waitForUpdateRestart(job.result.toCommit);
        return;
    }
    stopUpdatePolling();
    stopUpdateWatchdog();
    updateActivation = null;
    updateRestartPending = false;
    renderUpdateConsole();
    reportFinishedJob(job);
}

function reportFinishedJob(job) {
    const result = job.result || null;
    if (job.state === 'succeeded') {
        notify(updateT('jobDoneToast'), 'success');
        if (job.restartError) {
            updateActionError = updateT('restartFailed', { reason: job.restartError });
            notify(updateActionError, 'error');
        } else if (result && result.needsRestart) {
            notify(updateT('needsRestartToast'), 'info');
        }
    } else {
        const reason = (job.failure && job.failure.message) ? job.failure.message : updateT('failureNoMessage');
        notify(updateT('jobFailedToast') + ': ' + reason, 'error');
    }
    fetchUpdateStatus().then(renderUpdateConsole).catch(err => {
        notify(updateT(UPDATE_FAILURE_KEYS.load, { reason: err.message }), 'error');
    });
}

// ---------------------------------------------------------------------------
// 动作（上传离线包与重启激活）
// ---------------------------------------------------------------------------

function selectUpdatePackageFile(file) {
    if (!file) return;
    if (!isAllowedPackageFile(file.name)) {
        selectedUpdatePackageFile = null;
        const msg = updateT('packageInvalidFormat');
        updateActionError = msg;
        renderUpdateConsole();
        notify(msg, 'error');
        return;
    }
    selectedUpdatePackageFile = file;
    updateActionError = '';
    renderUpdateConsole();
}

function onUpdatePackageInputChange(input) {
    const file = input && input.files ? input.files[0] : null;
    if (file) selectUpdatePackageFile(file);
}

function clearUpdatePackageFile() {
    selectedUpdatePackageFile = null;
    const input = document.getElementById('update-package-file-input');
    if (input) input.value = '';
    renderUpdateConsole();
}

function handleUpdatePackageDragOver(event, over) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const zone = document.getElementById('update-dropzone');
    if (zone) {
        zone.classList.toggle('is-dragover', !!over);
    }
}

function handleUpdatePackageDrop(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    handleUpdatePackageDragOver(null, false);
    const file = event?.dataTransfer?.files ? event.dataTransfer.files[0] : null;
    if (file) selectUpdatePackageFile(file);
}

async function startPackageUpload() {
    if (updateBusy || isUpdateJobRunning()) return;
    if (!selectedUpdatePackageFile) {
        notify(updateT('packageNoFile'), 'error');
        return;
    }
    if (!isAllowedPackageFile(selectedUpdatePackageFile.name)) {
        const msg = updateT('packageInvalidFormat');
        updateActionError = msg;
        renderUpdateConsole();
        notify(msg, 'error');
        return;
    }

    const restart = updateCanRestart();
    const formData = new FormData();
    formData.append('file', selectedUpdatePackageFile);
    formData.append('restart', restart ? 'true' : 'false');

    await withUpdateBusy(async () => {
        const r = await runUpdateRequest('POST', '/api/system/update/package', formData);
        if (r.status === 409 && r.data.job) {
            if (updateConsoleState) updateConsoleState.job = r.data.job;
            if (r.data.job.restartRequested) watchUpdateActivation(r.data.job.id, r.data.bootID);
            renderUpdateConsole();
            startUpdatePolling();
            return;
        }
        if (!r.ok) throw new Error(r.error);
        selectedUpdatePackageFile = null;
        const input = document.getElementById('update-package-file-input');
        if (input) input.value = '';
        notify(updateT('packageUploadAccepted'), 'success');
        if (restart) watchUpdateActivation(r.data.job_id, r.data.bootID);
        startUpdatePolling();
        await pollUpdateJob();
    }, 'package');
}

async function startRestartNow() {
    if (updateBusy) return;
    if (!window.confirm(updateT('restartNowConfirm'))) return;

    await withUpdateBusy(async () => {
        const r = await runUpdateRequest('POST', '/api/system/update/restart');
        if (!r.ok) throw new Error(r.error);
        stopUpdatePolling();
        watchUpdateActivation(r.data.activation_id, r.data.bootID);
        notify(updateT('restartRequestedToast'), 'info');
        waitForUpdateRestart();
    }, 'restart');
}

// ---------------------------------------------------------------------------
// 渲染
// ---------------------------------------------------------------------------

function updateSection(title, body) {
    return '<section class="update-section"><h3 class="update-section-title">' +
        escapeHtml(title) + '</h3>' + body + '</section>';
}

function updateFact(label, value) {
    const text = value == null || value === '' ? '-' : String(value);
    return '<div class="update-fact"><span>' + escapeHtml(label) + '</span>' +
        '<code title="' + escapeAttr(text) + '">' + escapeHtml(text) + '</code></div>';
}

function updateMark(ok, yesKey, noKey, reason) {
    const cls = ok ? 'update-chip update-chip-ok' : 'update-chip update-chip-warn';
    if (!reason) {
        return '<span class="' + cls + '">' + escapeHtml(ok ? updateT(yesKey) : updateT(noKey)) + '</span>';
    }
    return '<span class="' + cls + '" title="' + escapeAttr(String(reason)) + '">' +
        escapeHtml(ok ? updateT(yesKey) : updateT(noKey)) + '</span>';
}

function renderUpdateSwitchHint() {
    return '<div class="update-hint">' +
        escapeHtml(updateT(updateCanRestart() ? 'confirmRestartYes' : 'restartNotWired')) + '</div>';
}

function renderUpdateInstallBody(status) {
    const revision = updateConsoleState?.buildRevision;
    const facts = [
        updateFact(updateT('root'), status.root),
        revision ? updateFact(updateT('runningBuild'), revision.slice(0, 12)) : '',
    ].join('');
    const marks = [
        updateMark(!!status.hasBinary, 'binaryPresent', 'binaryMissing'),
    ];
    if (updateConsoleState && updateConsoleState.needsRestart) {
        marks.push('<span class="update-chip update-chip-warn">' + escapeHtml(updateT('restartNeeded')) + '</span>');
    }
    return '<div class="update-facts">' + facts + '</div><div class="update-marks">' + marks.join('') + '</div>';
}

function renderUpdatePackageBody(job) {
    const running = !!(job && job.state === 'running');
    const busy = updateBusy || running;
    const uploadDisabled = busy || !selectedUpdatePackageFile ? ' disabled data-state-disabled="true"' : '';
    const browseDisabled = busy ? ' disabled data-state-disabled="true"' : '';
    const parts = [];

    if (running) {
        parts.push('<div class="update-warn">' + escapeHtml(updateT('jobRunningHint')) + '</div>');
    }

    const uploadSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';
    parts.push(
        '<div id="update-dropzone" class="update-dropzone"' +
        ' ondragover="handleUpdatePackageDragOver(event, true)"' +
        ' ondragleave="handleUpdatePackageDragOver(event, false)"' +
        ' ondrop="handleUpdatePackageDrop(event)">' +
        '<input type="file" id="update-package-file-input" class="update-file-input" accept=".zip,.tar.gz,.tgz,application/zip,application/gzip"' + browseDisabled + ' onchange="onUpdatePackageInputChange(this)" />' +
        '<label for="update-package-file-input" class="update-dropzone-label">' +
        '<span class="update-dropzone-icon">' + uploadSvg + '</span>' +
        '<span class="update-dropzone-title">' + escapeHtml(updateT('packageDropHint')) + '</span>' +
        '<span class="btn-secondary update-browse-btn">' + escapeHtml(updateT('packageSelectBtn')) + '</span>' +
        '</label>' +
        '</div>'
    );

    if (selectedUpdatePackageFile) {
        parts.push(
            '<div class="update-file-pill">' +
            '<span class="update-file-pill-label">' + escapeHtml(updateT('packageSelectedLabel')) + ':</span>' +
            '<code class="update-file-pill-name" title="' + escapeAttr(selectedUpdatePackageFile.name) + '">' + escapeHtml(selectedUpdatePackageFile.name) + '</code>' +
            '<span class="update-file-pill-size">' + escapeHtml(formatPackageSize(selectedUpdatePackageFile.size)) + '</span>' +
            '<button type="button" class="btn-secondary update-file-clear-btn"' + browseDisabled + ' onclick="clearUpdatePackageFile()">' + escapeHtml(updateT('packageClearBtn')) + '</button>' +
            '</div>'
        );
    }

    parts.push('<div class="update-hint">' + escapeHtml(updateT('packageProtectedHint')) + '</div>');
    parts.push(renderUpdateSwitchHint());
    parts.push(
        '<div class="update-actions">' +
        '<button type="button" class="btn-primary update-package-upload-btn"' + uploadDisabled +
        ' data-require-permission="update:apply" onclick="startPackageUpload()">' +
        escapeHtml(updateBusy ? updateT('packageUploadingBtn') : updateT('packageUploadBtn')) +
        '</button></div>'
    );

    return parts.join('');
}

function updateStateChip(state) {
    const known = { running: 'update-chip-running', succeeded: 'update-chip-ok', failed: 'update-chip-danger' };
    const cls = known[state] || 'update-chip';
    const label = state === 'running' ? updateT('stateRunning')
        : state === 'succeeded' ? updateT('stateSucceeded')
            : state === 'failed' ? updateT('stateFailed') : updateT('stateUnknown');
    return '<span class="' + cls + '">' + escapeHtml(label) + '</span>';
}

function renderUpdateStep(step) {
    return '<li class="update-step">' +
        '<code class="update-step-phase">' + escapeHtml(String(step.phase || '-')) + '</code>' +
        '<span class="update-step-message">' + escapeHtml(String(step.message || '')) + '</span>' +
        '<span class="update-step-at">' + escapeHtml(String(step.at || '')) + '</span></li>';
}

function renderUpdateResult(result) {
    if (!result) return '';
    const kept = result.keptContent || [];
    const facts = [
        updateFact(updateT('packageFilesUpdated'), result.filesTouched),
        updateFact(updateT('resultDuration'), result.duration),
        updateFact(updateT('resultBackup'), result.backupDir),
    ].join('');
    const marks = [
        updateMark(!!result.binaryBuilt, 'binarySwapped', 'binaryNotSwapped', result.binaryPath || ''),
        updateMark(!!result.needsRestart, 'restartNeeded', 'restartNotNeeded'),
    ].join('');
    const keptList = kept.length
        ? '<ul class="update-kept-list">' + kept.map(p =>
            '<li><code title="' + escapeAttr(String(p)) + '">' + escapeHtml(String(p)) + '</code></li>').join('') + '</ul>'
        : '<div class="update-hint">' + escapeHtml(updateT('nothingKept')) + '</div>';
    return '<div class="update-result">' +
        '<h4 class="update-sub-title">' + escapeHtml(updateT('resultTitle')) + '</h4>' +
        '<div class="update-facts">' + facts + '</div><div class="update-marks">' + marks + '</div>' +
        '<h4 class="update-sub-title">' + escapeHtml(updateT('keptTitle')) + '</h4>' + keptList +
        '</div>';
}

function renderUpdateFailure(failure) {
    if (!failure) return '';
    const items = failure.items || [];
    const reason = failure.reason ? '（' + escapeHtml(String(failure.reason)) + '）' : '';
    return '<div class="update-error update-failure">' +
        '<div class="update-failure-title">' + escapeHtml(updateT('failureTitle')) + reason + '</div>' +
        '<div class="update-failure-message">' +
        escapeHtml(String(failure.message || updateT('failureNoMessage'))) + '</div>' +
        (items.length
            ? '<ul class="update-item-list">' + items.map(i =>
                '<li><code title="' + escapeAttr(String(i)) + '">' + escapeHtml(String(i)) + '</code></li>').join('') + '</ul>'
            : '') +
        '</div>';
}

function renderUpdateJobBody(job) {
    if (!job) return '<div class="empty-state">' + escapeHtml(updateT('noJob')) + '</div>';
    const parts = ['<div class="update-job-head">' + updateStateChip(job.state) +
        '<code title="' + escapeAttr(String(job.id || '-')) + '">' + escapeHtml(String(job.id || '-')) + '</code>' +
        (job.started ? '<span class="update-job-time">' + escapeHtml(String(job.started)) + '</span>' : '') +
        (job.restartRequested ? '<span class="update-chip">' + escapeHtml(updateT('restartRequested')) + '</span>' : '') +
        '</div>'];
    const steps = job.steps || [];
    parts.push(steps.length
        ? '<ol class="update-step-list">' + steps.map(renderUpdateStep).join('') + '</ol>'
        : '<div class="empty-state">' + escapeHtml(updateT('noSteps')) + '</div>');
    if (job.state === 'running') {
        parts.push('<div class="update-hint">' +
            escapeHtml(updateT('pollingHint', { sec: UPDATE_POLL_INTERVAL_MS / 1000 })) + '</div>');
    }
    if (job.result) parts.push(renderUpdateResult(job.result));
    if (job.failure) parts.push(renderUpdateFailure(job.failure));
    return parts.join('');
}

function formatBinaryBuiltAt() {
    const raw = (updateConsoleState && updateConsoleState.binaryBuiltAt) || '';
    if (!raw) return '-';
    const d = new Date(raw);
    return isNaN(d.getTime()) ? raw : d.toLocaleString();
}

function renderRestartBanner() {
    const text = updateT('restartBannerNoCommit', {
        builtAt: formatBinaryBuiltAt(),
    });
    return '<div class="update-restart-banner">' +
        '<div class="update-restart-banner-text">' + escapeHtml(text) + '</div>' +
        (updateCanRestart() ?
            '<button class="btn-primary update-restart-btn" data-require-permission="update:apply" onclick="startRestartNow()">' +
            escapeHtml(updateT('restartNowBtn')) + '</button>' : '') +
        '</div>';
}

function renderUpdateWatchdog() {
    const el = document.getElementById('update-console');
    if (!el) return;
    const parts = ['<div class="update-overlay">',
        '<div class="update-overlay-spinner" aria-hidden="true"></div>',
        '<div class="update-overlay-title">' + escapeHtml(updateT('restartOverlayTitle')) + '</div>',
        '<div class="update-overlay-body">' + escapeHtml(updateT('restartOverlayBody')) + '</div>'];
    if (updateWatchdogSlow) {
        parts.push('<div class="update-overlay-slow">' + escapeHtml(updateT(
            { running: 'restartOverlaySlowRunning', down: 'restartOverlaySlowDown', unexpected: 'restartOverlayUnexpected' }[updateWatchdogSlow])) + '</div>');
        parts.push('<div class="update-overlay-actions">' +
            '<button class="btn-secondary" type="button" onclick="refreshUpdatePage()">' +
            escapeHtml(updateT('restartOverlayRefresh')) + '</button></div>');
    }
    parts.push('</div>');
    el.innerHTML = parts.join('');
}

function refreshUpdatePage() {
    location.reload();
}

function renderUpdateConsole() {
    const el = document.getElementById('update-console');
    if (!el || !updateConsoleState) return;
    const status = updateStatusOf();
    const job = updateJobOf();

    const parts = [];
    if (updateActionError) {
        parts.push('<div class="update-error">' + escapeHtml(updateActionError) + '</div>');
    }
    if (updateConsoleState.needsRestart) parts.push(renderRestartBanner());
    parts.push(updateSection(updateT('installTitle'), renderUpdateInstallBody(status)));
    parts.push(updateSection(updateT('packageTitle'), renderUpdatePackageBody(job)));
    parts.push(updateSection(updateT('jobTitle'), renderUpdateJobBody(job)));

    el.innerHTML = parts.join('');
    if (typeof window.applyRBACToUI === 'function') {
        window.applyRBACToUI(el);
    }
}

window.loadUpdateConsole = loadUpdateConsole;
window.startPackageUpload = startPackageUpload;
window.selectUpdatePackageFile = selectUpdatePackageFile;
window.onUpdatePackageInputChange = onUpdatePackageInputChange;
window.clearUpdatePackageFile = clearUpdatePackageFile;
window.handleUpdatePackageDrop = handleUpdatePackageDrop;
window.handleUpdatePackageDragOver = handleUpdatePackageDragOver;
window.startRestartNow = startRestartNow;
window.refreshUpdatePage = refreshUpdatePage;
window.stopUpdatePolling = stopUpdatePolling;
window.renderUpdateConsole = renderUpdateConsole;
window.isAllowedPackageFile = isAllowedPackageFile;
window.formatPackageSize = formatPackageSize;
