const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const easmDrp = require('./easm-drp.js');

test('easm-drp exports all expected EASM and DRP UI handlers', () => {
    const expected = [
        'loadEASMOverview',
        'triggerEASMIncrementalScan',
        'triggerEASMExposureAssess',
        'claimShadowAsset',
        'applyEASMAssetFilters',
        'loadEASMConvergence',
        'switchEASMConvergenceView',
        'onEASMCardDragStart',
        'onEASMColumnDrop',
        'openEASMConvergenceDrawer',
        'closeEASMConvergenceDrawer',
        'saveEASMConvergenceDrawer',
        'loadDRPMonitor',
        'selectDRPChannelTab',
        'applyDRPEventFilters',
        'openDRPEventDrawer',
        'closeDRPEventDrawer',
        'triageActiveDRPEvent',
        'triggerDRPScan',
        'loadDRPConfig',
        'createDRPRuleFromForm',
        'deleteDRPRule',
        'saveDRPConnector',
        'testDRPConnector',
        'remediationChecklistFor'
    ];
    for (const fn of expected) {
        assert.equal(typeof easmDrp[fn], 'function', `expected ${fn} to be exported`);
    }
});

test('easm-drp.js has no placeholder corp.example target and parses cleanly', () => {
    const jsPath = path.join(__dirname, './easm-drp.js');
    const src = fs.readFileSync(jsPath, 'utf8');
    assert.ok(!src.includes('corp.example'), 'easm-drp.js must not hardcode corp.example');
    require('node:child_process').execFileSync(process.execPath, ['--check', jsPath]);
});

test('remediationChecklistFor returns tailored guidance by channel group', () => {
    const codeSteps = easmDrp.remediationChecklistFor({ channel_group: 'code_repo' });
    assert.ok(codeSteps.some(s => s.includes('吊销')));

    const cloudSteps = easmDrp.remediationChecklistFor({ channel_group: 'cloud_drive' });
    assert.ok(cloudSteps.some(s => s.includes('取消公开链接') || s.includes('下架')));

    const credSteps = easmDrp.remediationChecklistFor({ channel_group: 'stealer_cti' });
    assert.ok(credSteps.some(s => s.includes('重置密码')));
});

test('index.html wires EASM & DRP navigation, pages, drawers, CSS and JS', () => {
    const html = fs.readFileSync(path.join(__dirname, '../../templates/index.html'), 'utf8');
    const requiredTokens = [
        '/static/css/easm-drp.css',
        '/static/js/easm-drp.js',
        'data-page="easm"',
        'data-page="easm-overview"',
        'data-page="easm-convergence"',
        'data-page="drp"',
        'data-page="drp-monitor"',
        'data-page="drp-config"',
        'id="page-easm-overview"',
        'id="page-easm-convergence"',
        'id="easm-convergence-drawer"',
        'id="page-drp-monitor"',
        'id="drp-event-drawer"',
        'id="page-drp-config"'
    ];
    for (const token of requiredTokens) {
        assert.ok(html.includes(token), `index.html missing ${token}`);
    }
});

test('router.js registers all 4 EASM & DRP page IDs and init hooks', () => {
    const routerSrc = fs.readFileSync(path.join(__dirname, './router.js'), 'utf8');
    for (const token of ['easm-overview', 'easm-convergence', 'drp-monitor', 'drp-config', 'loadEASMOverview', 'loadEASMConvergence', 'loadDRPMonitor', 'loadDRPConfig']) {
        assert.ok(routerSrc.includes(token), `router.js missing ${token}`);
    }
});

test('easm-drp.css keeps page containers non-flex until active and honors [hidden]', () => {
    const css = fs.readFileSync(path.join(__dirname, '../css/easm-drp.css'), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '');
    const rules = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)]
        .map(m => ({ selector: m[1].trim(), body: m[2] }));

    const bareFlexRules = rules.filter(r =>
        /\.(easm|drp)-page\b/.test(r.selector) &&
        !/\.active\b/.test(r.selector) &&
        /display\s*:\s*flex/.test(r.body)
    );
    assert.deepEqual(
        bareFlexRules.map(r => r.selector),
        [],
        'bare .easm-page / .drp-page must not be display:flex (only .active may be)'
    );

    for (const page of ['easm', 'drp']) {
        const hiddenRule = rules.find(r =>
            r.selector.split(',').some(s => s.trim() === `.${page}-page [hidden]`)
        );
        assert.ok(hiddenRule, `.${page}-page [hidden] rule missing`);
        assert.match(hiddenRule.body, /display\s*:\s*none\s*!important/,
            `.${page}-page [hidden] must be display: none !important`);
    }
});

test('index.html groups EASM & DRP nav under navGroups.exposure, between workbench and assessment', () => {
    const html = fs.readFileSync(path.join(__dirname, '../../templates/index.html'), 'utf8');
    const indexOf = (token) => {
        const i = html.indexOf(token);
        assert.ok(i !== -1, `index.html missing ${token}`);
        return i;
    };

    const workbench = indexOf('navGroups.workbench');
    const exposure = indexOf('navGroups.exposure');
    const assessment = indexOf('navGroups.assessment');
    assert.ok(workbench < exposure, 'navGroups.exposure must come after navGroups.workbench');
    assert.ok(exposure < assessment, 'navGroups.exposure must come before navGroups.assessment');

    for (const token of ['data-page="easm"', 'data-page="drp"']) {
        const i = indexOf(token);
        assert.ok(i > exposure && i < assessment,
            `${token} must sit between navGroups.exposure and navGroups.assessment`);
    }
});
