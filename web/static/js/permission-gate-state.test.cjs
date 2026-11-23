// The platform's permission gate must not re-enable a control a page disabled for a reason
// of its own.
//
// How the bug looked in a real browser: the 一键更新 page rendered an *enabled* apply button
// directly under the text "有 53 个产品源码文件被本地改过，自动更新不会覆盖它们". Nothing in
// the page's own tests could see it, because the page really does write `disabled` - the
// gate then runs over every [data-require-permission] element afterwards and writes
// `el.disabled = !allowed`, which for an administrator is `false`. Permission says whether a
// user may ever use a control; it does not say whether the control is ready.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const AUTH = fs.readFileSync(path.join(__dirname, 'auth.js'), 'utf8');
const UPDATE = fs.readFileSync(path.join(__dirname, 'update.js'), 'utf8');

function sourceOf(name, src) {
	const at = src.indexOf('function ' + name + '(');
	assert.ok(at >= 0, `${name} is not in auth.js any more - this test is where the gate lives`);
	let depth = 0;
	for (let i = src.indexOf('{', at); i < src.length; i++) {
		if (src[i] === '{') depth++;
		else if (src[i] === '}') {
			depth--;
			if (depth === 0) return src.slice(at, i + 1);
		}
	}
	assert.fail(`${name}: unbalanced`);
}

function element(attrs = {}) {
	const el = {
		hidden: false,
		disabled: false,
		dataset: {},
		_attrs: { ...attrs },
		classList: { classes: new Set(), toggle(c, on) { on ? this.classes.add(c) : this.classes.delete(c); } },
		getAttribute(k) { return this._attrs[k] ?? null; },
		setAttribute(k, v) { this._attrs[k] = String(v); },
	};
	if (attrs['data-state-disabled']) el.dataset.stateDisabled = attrs['data-state-disabled'];
	// Buttons in a DOM have a `disabled` property; a plain object only gets one if the page
	// asked for it, and the gate's `if ('disabled' in el)` is what decides whether state
	// survives - so it is the part worth keeping honest.
	return el;
}

function makeGate(granted) {
	const sandbox = {
		hasPermission: (p) => granted.has(p),
		hasAnyPermission: (list) => list.some((p) => granted.has(p)),
		console,
	};
	vm.createContext(sandbox);
	vm.runInContext(sourceOf('permissionAllowedForElement', AUTH) + '\n' + sourceOf('applyPermissionElement', AUTH), sandbox);
	return sandbox.applyPermissionElement;
}

test('a state-disabled control stays disabled for a user who holds the permission', () => {
	const gate = makeGate(new Set(['update:apply']));
	const el = element({ 'data-require-permission': 'update:apply', 'data-state-disabled': 'true' });
	el.disabled = true;
	gate(el);
	assert.strictEqual(el.disabled, true, 'permission granted must not re-enable a control the page blocked');
	assert.strictEqual(el.getAttribute('aria-disabled'), 'true', 'the assistive state must agree with the real one');
	assert.strictEqual(el.hidden, false);
});

test('a permitted and ready control is enabled, and an unpermitted one is not', () => {
	const gate = makeGate(new Set(['update:apply']));
	const ready = element({ 'data-require-permission': 'update:apply' });
	gate(ready);
	assert.strictEqual(ready.disabled, false);
	assert.strictEqual(ready.getAttribute('aria-disabled'), 'false');

	// applyPermissionElement returns nothing, so the assertions read the element itself.
	const deniedEl = element({ 'data-require-permission': 'update:apply' });
	makeGate(new Set())(deniedEl);
	assert.strictEqual(deniedEl.hidden, true);
	assert.strictEqual(deniedEl.disabled, true);
	assert.strictEqual(deniedEl.classList.classes.has('rbac-permission-denied'), true);
});

test('every control the update page disables by state carries the marker the gate honors', () => {
	// The other half of the pair: a page that writes `disabled` without the marker silently
	// loses it the moment the gate runs. Asserted over the rendered strings rather than by
	// reading the source, so a refactor that drops the attribute is what fails.
	function makeSandbox(selectedFile) {
		const sandbox = {
			console,
			escapeHtml: (v) => String(v),
			escapeAttr: (v) => String(v),
			updateT: (key) => key,
			renderUpdateSwitchHint: () => '',
			formatPackageSize: (n) => String(n) + ' B',
			updateBusy: false,
			selectedUpdatePackageFile: selectedFile,
		};
		vm.createContext(sandbox);
		vm.runInContext(sourceOf('renderUpdatePackageBody', UPDATE), sandbox);
		return sandbox;
	}

	const noFileHtml = makeSandbox(null).renderUpdatePackageBody(null);
	const runningHtml = makeSandbox(null).renderUpdatePackageBody({ state: 'running' });
	const readyHtml = makeSandbox({ name: 'strixlens-v2.zip', size: 2048 }).renderUpdatePackageBody(null);

	for (const [label, html] of [['package(no-file)', noFileHtml], ['package(running)', runningHtml]]) {
		const buttons = html.match(/<button[^>]*>/g) || [];
		assert.ok(buttons.length > 0, `${label}: rendered no button`);
		const disabledTags = buttons.filter((t) => / disabled/.test(t));
		assert.ok(disabledTags.length > 0, `${label}: expected a disabled button`);
		for (const tag of disabledTags) {
			assert.match(tag, /data-state-disabled="true"/, `${label}: state-disabled must carry the marker the gate reads: ${tag}`);
			assert.match(tag, /data-require-permission=/, `${label}: the marker only matters on a permission-gated control: ${tag}`);
		}
	}

	// And when a package file IS selected and idle, the upload control must not be state-disabled.
	const uploadTag = (readyHtml.match(/<button[^>]*update-package-upload-btn[^>]*>/) || [])[0];
	assert.ok(uploadTag, 'no upload button rendered when a package file is selected');
	assert.ok(!/disabled/.test(uploadTag), `a ready package upload control must not be disabled: ${uploadTag}`);
	for (const tag of (readyHtml.match(/<button[^>]*>/g) || [])) {
		if (/ disabled/.test(tag)) {
			assert.match(tag, /data-state-disabled="true"/, `every state-disabled control needs the marker: ${tag}`);
		}
	}
});
