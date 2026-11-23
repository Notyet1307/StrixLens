// \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), u = /* @__PURE__ */ o(((e, t) => {
	t.exports = l();
})), d = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.for("react.view_transition"), m = Symbol.iterator;
	function h(e) {
		return typeof e != "object" || !e ? null : (e = m && e[m] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var g = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, _ = Object.assign, v = {};
	function y(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, y.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function b() {}
	b.prototype = y.prototype;
	function x(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	var S = x.prototype = new b();
	S.constructor = x, _(S, y.prototype), S.isPureReactComponent = !0;
	var C = Array.isArray;
	function w() {}
	var T = {
		H: null,
		A: null,
		T: null,
		S: null
	}, E = Object.prototype.hasOwnProperty;
	function D(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function O(e, t) {
		return D(e.type, t, e.props);
	}
	function k(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function A(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var j = /\/+/g;
	function M(e, t) {
		return typeof e == "object" && e && e.key != null ? A("" + e.key) : t.toString(36);
	}
	function N(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(w, w) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function P(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, P(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + M(e, 0) : a, C(o) ? (i = "", c != null && (i = c.replace(j, "$&/") + "/"), P(o, r, i, "", function(e) {
			return e;
		})) : o != null && (k(o) && (o = O(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(j, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (C(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + M(a, u), c += P(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + M(a, u++), c += P(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return P(N(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function F(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return P(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function I(e) {
		if (e._status === -1) {
			var t = e._result, n = t();
			n.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t, n.status === void 0 && (n.status = "fulfilled", n.value = t));
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t, n.status === void 0 && (n.status = "rejected", n.reason = t));
			}), e._status === -1 && (e._status = 0, e._result = n);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var L = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	};
	function R(e) {
		var t = T.T, n = {};
		n.types = t === null ? null : t.types, T.T = n;
		try {
			var r = e(), i = T.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(w, L);
		} catch (e) {
			L(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), T.T = t;
		}
	}
	function ee(e) {
		var t = T.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else R(ee.bind(null, e));
	}
	var te = {
		map: F,
		forEach: function(e, t, n) {
			F(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return F(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return F(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!k(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = te, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = x, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return T.H.useMemoCache(e);
		}
	}, e.addTransitionType = ee, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !E.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return D(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) E.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return D(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = k, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: I
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = R, e.unstable_useCacheRefresh = function() {
		return T.H.useCacheRefresh();
	}, e.use = function(e) {
		return T.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return T.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return T.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return T.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return T.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return T.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return T.H.useEffectEvent(e);
	}, e.useId = function() {
		return T.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return T.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return T.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return T.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return T.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return T.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return T.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return T.H.useRef(e);
	}, e.useState = function(e) {
		return T.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return T.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return T.H.useTransition();
	}, e.version = "19.3.1";
})), f = /* @__PURE__ */ o(((e, t) => {
	t.exports = d();
})), p = /* @__PURE__ */ c(f(), 1), m = /* @__PURE__ */ (0, p.createContext)({});
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/utils/use-constant.mjs
function h(e) {
	let t = (0, p.useRef)(null);
	return t.current === null && (t.current = e()), t.current;
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/utils/use-isomorphic-effect.mjs
var g = typeof window < "u" ? p.useLayoutEffect : p.useEffect, _ = /* @__PURE__ */ (0, p.createContext)(null);
// node_modules/.pnpm/motion-utils@14.7.0/node_modules/motion-utils/dist/es/array.mjs
function v(e, t) {
	e.indexOf(t) === -1 && e.push(t);
}
function y(e, t) {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}
// node_modules/.pnpm/motion-utils@14.7.0/node_modules/motion-utils/dist/es/clamp.mjs
var b = (e, t, n) => n > t ? t : n < e ? e : n, x = {}, S = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e), C = (e) => typeof e == "object" && !!e, w = (e) => /^0[^.\s]+$/u.test(e);
// node_modules/.pnpm/motion-utils@14.7.0/node_modules/motion-utils/dist/es/memo.mjs
/*#__NO_SIDE_EFFECTS__*/
function T(e) {
	let t;
	return () => (t === void 0 && (t = e()), t);
}
// node_modules/.pnpm/motion-utils@14.7.0/node_modules/motion-utils/dist/es/noop.mjs
var E = /* @__NO_SIDE_EFFECTS__ */ (e) => e, D = (...e) => e.reduce((e, t) => (n) => t(e(n))), O = /* @__NO_SIDE_EFFECTS__ */ (e, t, n) => {
	let r = t - e;
	return r ? (n - e) / r : 1;
}, k = class {
	constructor() {
		this.subscriptions = [];
	}
	add(e) {
		return v(this.subscriptions, e), () => this.remove(e);
	}
	remove(e) {
		y(this.subscriptions, e);
	}
	notify(e, t, n) {
		let r = this.subscriptions.length;
		if (r) {
			if (r === 1) this.subscriptions[0](e, t, n);
			else for (let i = 0; i < r; i++) {
				let r = this.subscriptions[i];
				r && r(e, t, n);
			}
		}
	}
	getSize() {
		return this.subscriptions.length;
	}
	clear() {
		this.subscriptions.length = 0;
	}
}, A = /* @__NO_SIDE_EFFECTS__ */ (e) => e * 1e3, j = /* @__NO_SIDE_EFFECTS__ */ (e) => e / 1e3, M = /* @__NO_SIDE_EFFECTS__ */ (e, t) => t ? 1e3 / t * e : 0, N = (e, t, n) => e * (3 * (1 - e) * ((1 - e) * t + e * n) + e * e);
/*#__NO_SIDE_EFFECTS__*/
function P(e, t, n, r) {
	return e === t && n === r ? E : (i) => {
		let a = 0, o = 1, s = i;
		for (let t = 0;; t++) {
			s >= a && s <= o || (s = (a + o) / 2);
			let r = N(s, e, n) - i;
			if (r * r < 1e-28 || t === 40) break;
			r > 0 ? o = s : a = s, s -= r * 1e-7 / (N(s + 1e-7, e, n) - i - r);
		}
		return N(s, t, r);
	};
}
// node_modules/.pnpm/motion-utils@14.7.0/node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs
var F = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => t <= .5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, I = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => 1 - e(1 - t), L = /*@__PURE__*/ P(.33, 1.53, .69, .99), R = /*@__PURE__*/ I(L), ee = /*@__PURE__*/ F(R), te = (e) => e >= 1 ? 1 : (e *= 2) < 1 ? .5 * R(e) : .5 * (2 - 2 ** (-10 * (e - 1))), ne = (e) => 1 - Math.sin(Math.acos(e)), z = /* @__PURE__ */ I(ne), re = /* @__PURE__ */ F(ne), ie = /*@__PURE__*/ P(.42, 0, 1, 1), B = /*@__PURE__*/ P(0, 0, .58, 1), ae = /*@__PURE__*/ P(.42, 0, .58, 1), oe = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] != "number", se = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] == "number", V = {
	linear: E,
	easeIn: ie,
	easeInOut: ae,
	easeOut: B,
	circIn: ne,
	circInOut: re,
	circOut: z,
	backIn: R,
	backInOut: ee,
	backOut: L,
	anticipate: te
}, H = (e) => typeof e == "string", ce = (e) => {
	if (/* @__PURE__ */ se(e)) {
		let [t, n, r, i] = e;
		return /* @__PURE__ */ P(t, n, r, i);
	}
	return H(e) ? V[e] : e;
}, le = {
	delta: 0,
	timestamp: 0,
	isProcessing: !1
}, ue;
function de() {
	ue = void 0;
}
var U = {
	now: () => (ue === void 0 && U.set(le.isProcessing || x.useManualTiming ? le.timestamp : performance.now()), ue),
	set: (e) => {
		ue = e, queueMicrotask(de);
	}
}, W = (e) => Math.round(e * 1e5) / 1e5, fe = (e) => (t) => typeof t == "string" && t.startsWith(e), pe = /*@__PURE__*/ fe("--"), me = /*@__PURE__*/ fe("var(--"), he = (e) => me(e) ? ge.test(e.split("/*")[0].trim()) : !1, ge = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function _e(e) {
	return typeof e == "string" && e.split("/*")[0].includes("var(--");
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/value/types/numbers/index.mjs
var ve = {
	test: (e) => typeof e == "number",
	parse: parseFloat,
	transform: (e) => e
}, ye = {
	...ve,
	transform: (e) => b(0, 1, e)
}, be = {
	...ve,
	default: 1
}, xe = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/value/types/utils/is-nullish.mjs
function Se(e) {
	return e == null;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/value/types/utils/single-color-regex.mjs
var Ce = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, we = (e, t) => (n) => !!(typeof n == "string" && Ce.test(n) && n.startsWith(e) || t && !Se(n) && Object.prototype.hasOwnProperty.call(n, t)), Te = (e, t, n) => (r) => {
	if (typeof r != "string") return r;
	let [i, a, o, s] = r.match(xe);
	return {
		[e]: parseFloat(i),
		[t]: parseFloat(a),
		[n]: parseFloat(o),
		alpha: s === void 0 ? 1 : parseFloat(s)
	};
}, Ee = (e) => b(0, 255, e), De = {
	...ve,
	transform: (e) => Math.round(Ee(e))
}, Oe = {
	test: /*@__PURE__*/ we("rgb", "red"),
	parse: /*@__PURE__*/ Te("red", "green", "blue"),
	transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) => "rgba(" + De.transform(e) + ", " + De.transform(t) + ", " + De.transform(n) + ", " + W(ye.transform(r)) + ")"
}, ke = (e, t, n) => {
	let r = e.substring(1 + t * n, 1 + (t + 1) * n);
	return n > 1 ? r : r + r;
};
function Ae(e) {
	let t = e.length > 5 ? 2 : 1, n = ke(e, 3, t);
	return {
		red: parseInt(ke(e, 0, t), 16),
		green: parseInt(ke(e, 1, t), 16),
		blue: parseInt(ke(e, 2, t), 16),
		alpha: n ? parseInt(n, 16) / 255 : 1
	};
}
var je = {
	test: /*@__PURE__*/ we("#"),
	parse: Ae,
	transform: Oe.transform
}, Me = /* @__NO_SIDE_EFFECTS__ */ (e) => ({
	test: (t) => typeof t == "string" && t.endsWith(e) && t.split(" ").length === 1,
	parse: parseFloat,
	transform: (t) => `${t}${e}`
}), Ne = /*@__PURE__*/ Me("deg"), Pe = /*@__PURE__*/ Me("%"), G = /*@__PURE__*/ Me("px"), Fe = /*@__PURE__*/ Me("vh"), Ie = /*@__PURE__*/ Me("vw"), Le = {
	...Pe,
	parse: (e) => Pe.parse(e) / 100,
	transform: (e) => Pe.transform(e * 100)
}, Re = {
	test: /*@__PURE__*/ we("hsl", "hue"),
	parse: /*@__PURE__*/ Te("hue", "saturation", "lightness"),
	transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) => "hsla(" + Math.round(e) + ", " + Pe.transform(W(t)) + ", " + Pe.transform(W(n)) + ", " + W(ye.transform(r)) + ")"
}, ze = {
	test: (e) => Oe.test(e) || je.test(e) || Re.test(e),
	parse: (e) => Oe.test(e) ? Oe.parse(e) : Re.test(e) ? Re.parse(e) : je.parse(e),
	transform: (e) => typeof e == "string" ? e : e.hasOwnProperty("red") ? Oe.transform(e) : Re.transform(e),
	getAnimatableNone: (e) => {
		let t = ze.parse(e);
		return t.alpha = 0, ze.transform(t);
	}
}, Be = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu, Ve = /*@__PURE__*/ new RegExp(xe.source), He = /*@__PURE__*/ new RegExp(Be.source, "i");
function Ue(e) {
	return isNaN(e) && typeof e == "string" && (Ve.test(e) || He.test(e));
}
var We = "number", Ge = "color", Ke = "var", qe = "var(", Je = "${}", Ye = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)(?![a-z]*\()/giu;
function Xe(e) {
	let t = e.toString();
	return Ve.test(t) || He.test(t);
}
function Ze(e) {
	let t = e.toString(), n = [], r = {
		color: [],
		number: [],
		var: []
	}, i = [], a = 0;
	return {
		values: n,
		split: t.replace(Ye, (e) => (ze.test(e) ? (r.color.push(a), i.push(Ge), n.push(ze.parse(e))) : e.startsWith(qe) ? (r.var.push(a), i.push(Ke), n.push(e)) : (r.number.push(a), i.push(We), n.push(parseFloat(e))), ++a, Je)).split(Je),
		indexes: r,
		types: i
	};
}
function Qe(e) {
	return Ze(e).values;
}
function $e({ split: e, types: t }) {
	let n = e.length;
	return (r) => {
		let i = "";
		for (let a = 0; a < n; a++) if (i += e[a], r[a] !== void 0) {
			let e = t[a];
			i += e === We ? W(r[a]) : e === Ge ? ze.transform(r[a]) : r[a];
		}
		return i;
	};
}
function et(e) {
	return $e(Ze(e));
}
var tt = (e) => typeof e == "number" ? 0 : ze.test(e) ? ze.getAnimatableNone(e) : e, nt = (e, t) => typeof e == "number" ? t?.trim().endsWith("/") ? e : 0 : tt(e);
function rt(e) {
	let t = Ze(e);
	return $e(t)(t.values.map((e, n) => nt(e, t.split[n])));
}
var it = {
	test: Ue,
	parse: Qe,
	createTransformer: et,
	getAnimatableNone: rt
};
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/value/types/color/hsla-to-rgba.mjs
function at(e, t, n) {
	return n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function ot({ hue: e, saturation: t, lightness: n, alpha: r }) {
	e /= 360, t /= 100, n /= 100;
	let i = 0, a = 0, o = 0;
	if (!t) i = a = o = n;
	else {
		let r = n < .5 ? n * (1 + t) : n + t - n * t, s = 2 * n - r;
		i = at(s, r, e + 1 / 3), a = at(s, r, e), o = at(s, r, e - 1 / 3);
	}
	return {
		red: Math.round(i * 255),
		green: Math.round(a * 255),
		blue: Math.round(o * 255),
		alpha: r
	};
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/utils/mix/immediate.mjs
function st(e, t) {
	return (n) => n > 0 ? t : e;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/utils/mix/number.mjs
var K = (e, t, n) => e + (t - e) * n, ct = (e, t, n) => {
	let r = e * e, i = n * (t * t - r) + r;
	return i < 0 ? 0 : Math.sqrt(i);
}, lt = [
	je,
	Oe,
	Re
], ut = (e) => lt.find((t) => t.test(e));
function dt(e) {
	let t = ut(e);
	if (!t) return !1;
	let n = t.parse(e);
	return t === Re && (n = ot(n)), n;
}
var ft = (e, t) => {
	let n = dt(e), r = dt(t);
	if (!n || !r) return st(e, t);
	let i = { ...n };
	return (e) => (i.red = ct(n.red, r.red, e), i.green = ct(n.green, r.green, e), i.blue = ct(n.blue, r.blue, e), i.alpha = K(n.alpha, r.alpha, e), Oe.transform(i));
}, pt = /* @__PURE__ */ new Set(["none", "hidden"]);
function mt(e, t) {
	return pt.has(e) ? (n) => n <= 0 ? e : t : (n) => n >= 1 ? t : e;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/utils/mix/complex.mjs
function ht(e, t) {
	return (n) => K(e, t, n);
}
function gt(e) {
	return typeof e == "number" ? ht : typeof e == "string" ? he(e) ? st : ze.test(e) ? ft : bt : Array.isArray(e) ? _t : typeof e == "object" ? ze.test(e) ? ft : vt : st;
}
function _t(e, t) {
	let n = [...e], r = n.length, i = e.map((e, n) => gt(e)(e, t[n]));
	return (e) => {
		for (let t = 0; t < r; t++) n[t] = i[t](e);
		return n;
	};
}
function vt(e, t) {
	let n = {
		...e,
		...t
	}, r = {};
	for (let i in n) e[i] !== void 0 && t[i] !== void 0 && (r[i] = gt(e[i])(e[i], t[i]));
	return (e) => {
		for (let t in r) n[t] = r[t](e);
		return n;
	};
}
function yt(e, t) {
	let n = [], r = {
		color: 0,
		var: 0,
		number: 0
	};
	for (let i = 0; i < t.values.length; i++) {
		let a = t.types[i], o = e.indexes[a][r[a]], s = e.values[o] ?? 0;
		n[i] = s, r[a]++;
	}
	return n;
}
var bt = (e, t) => {
	let n = Ze(e), r = Ze(t);
	return n.indexes.var.length === r.indexes.var.length && n.indexes.color.length === r.indexes.color.length && n.indexes.number.length >= r.indexes.number.length ? pt.has(e) && !r.values.length || pt.has(t) && !n.values.length ? mt(e, t) : D(_t(yt(n, r), r.values), $e(r)) : st(e, t);
}, xt = /^(-?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/iu;
function St(e, t) {
	let n = xt.exec(e);
	if (!n) return;
	let r = xt.exec(t);
	if (!r || n[2] !== r[2]) return;
	let i = n[2], a = parseFloat(n[1]), o = parseFloat(r[1]);
	return (e) => W(K(a, o, e)) + i;
}
function Ct(e, t, n) {
	if (typeof e == "number" && typeof t == "number" && typeof n == "number") return K(e, t, n);
	if (typeof e == "string" && typeof t == "string") {
		let n = St(e, t);
		if (n) return n;
	}
	return gt(e)(e, t);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/frameloop/order.mjs
var wt = [
	"setup",
	"read",
	"resolveKeyframes",
	"preUpdate",
	"update",
	"preRender",
	"render",
	"postRender"
];
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/frameloop/render-step.mjs
function Tt(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = !1, i = !1, a, o = /* @__PURE__ */ new Set(), s = {
		delta: 0,
		timestamp: 0,
		isProcessing: !1
	};
	function c(t) {
		o.has(t) && (n.add(t), e()), (a = t)(s);
	}
	let l = {
		schedule: (e, i = !1, s = !1) => {
			let c = s && r, l = c ? t : n;
			return i && o.add(e), c && e !== a && l.delete(e), l.add(e), e;
		},
		cancel: (e) => {
			n.delete(e), o.delete(e);
		},
		process: (e) => {
			if (s = e, r) {
				i = !0;
				return;
			}
			r = !0;
			let o = t;
			t = n, n = o, t.forEach(c), t.clear(), a = void 0, r = !1, i && (i = !1, l.process(e));
		}
	};
	return l;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/frameloop/batcher.mjs
var Et = 40;
function Dt(e, t, n = {
	delta: 0,
	timestamp: 0,
	isProcessing: !1
}) {
	let r = !1, i = !0, a = () => r = !0, o = wt.reduce((e, t) => (e[t] = Tt(a), e), {}), { setup: s, read: c, resolveKeyframes: l, preUpdate: u, update: d, preRender: f, render: p, postRender: m } = o, h = () => {
		let a = x.useManualTiming, o = a ? n.timestamp : performance.now();
		r = !1, a || (n.delta = i ? 1e3 / 60 : Math.max(Math.min(o - n.timestamp, Et), 1)), n.timestamp = o, n.isProcessing = !0, s.process(n), c.process(n), l.process(n), u.process(n), d.process(n), f.process(n), p.process(n), m.process(n), n.isProcessing = !1, r && t && (i = !1, e(h));
	}, g = () => {
		r = !0, i = !0, n.isProcessing || e(h);
	};
	return {
		schedule: wt.reduce((e, t) => {
			let n = o[t];
			return e[t] = (e, t = !1, i = !1) => (r || g(), n.schedule(e, t, i)), e;
		}, {}),
		cancel: (e) => {
			for (let t = 0; t < wt.length; t++) o[wt[t]].cancel(e);
		},
		state: n,
		steps: o
	};
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/frameloop/frame.mjs
var { schedule: Ot, cancel: kt, steps: At } = /* @__PURE__ */ Dt(typeof requestAnimationFrame < "u" ? requestAnimationFrame : E, !0, le), jt = (e) => {
	let t = ({ timestamp: t }) => e(t);
	return {
		start: (e = !0) => Ot.update(t, e),
		stop: () => kt(t),
		now: () => le.isProcessing ? le.timestamp : U.now()
	};
}, Mt = (e, t, n = 10) => {
	let r = "", i = Math.max(Math.round(t / n), 2);
	for (let t = 0; t < i; t++) r += Math.round(e(t / (i - 1)) * 1e4) / 1e4 + ", ";
	return `linear(${r.substring(0, r.length - 2)})`;
}, Nt = 2e4;
function Pt(e, t = 50, n = Nt, r) {
	let i = 0, a = e.next(i);
	for (r?.push(a.value); !a.done && i < n;) i += t, a = e.next(i), r?.push(a.value);
	return i >= n ? Infinity : i;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/generators/utils/create-generator-easing.mjs
function Ft(e, t = 100, n) {
	let { keyframes: r, velocity: i } = e, a = r && r[r.length - 1] - r[0], o = n({
		...e,
		velocity: i && a ? i * t / a : i,
		keyframes: [0, t]
	}), s = Math.min(Pt(o), Nt);
	return {
		type: "keyframes",
		ease: (e) => o.next(s * e).value / t,
		duration: /* @__PURE__ */ j(s)
	};
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/generators/spring.mjs
var It = 100, Lt = 10, Rt = 1, zt = 800, Bt = .3, Vt = .3, Ht = .01, Ut = 2, Wt = .005, Gt = .5, Kt = .01, qt = 10, Jt = .05, Yt = (e) => e < 0 ? 1 / Math.max(1 + e, Jt) : Math.max(1 - e, Jt);
function Xt(e, t) {
	if (!(e > 1)) return 1;
	let n = Math.sqrt(e * e - 1), r = e - n, i = e + n, a = 2 * n * Math.exp(-t) * (1 + t);
	return $t((e) => i * Math.exp(-r * e) - r * Math.exp(-i * e) - a, (e) => Math.exp(-i * e) - Math.exp(-r * e), t) / t;
}
function Zt(e, t) {
	return e * Math.sqrt(1 - t * t);
}
var Qt = 12;
function $t(e, t, n) {
	let r = n;
	for (let n = 1; n < Qt; n++) r -= e(r) / t(r);
	return r;
}
var en = .001;
function tn({ duration: e = zt, bounce: t = Bt }) {
	let n, r, i = Yt(t);
	e = b(Kt, qt, /* @__PURE__ */ j(e)), i < 1 ? (n = (t) => {
		let n = t * i, r = n * e, a = Zt(t, i), o = Math.exp(-r);
		return en - n / a * o;
	}, r = (t) => {
		let r = t * i * e, a = i * i * t * t * e, o = Math.exp(-r), s = Zt(t * t, i);
		return (-n(t) + en > 0 ? -1 : 1) * -a * o / s;
	}) : (n = (t) => -.001 + Math.exp(-t * e) * (t * e + 1), r = (t) => Math.exp(-t * e) * (-t * (e * e)));
	let a = 5 / e, o = $t(n, r, a), s = o * Xt(i, o * e), c = s * s;
	return {
		stiffness: c,
		damping: i * 2 * Math.sqrt(c),
		duration: /* @__PURE__ */ A(e)
	};
}
var nn = (e, t) => (t ? e >= 0 : e > 0) && e < Infinity;
function rn(e, t) {
	if (nn(e, t)) return e;
}
function an(e) {
	let t = rn(e.stiffness), n = rn(e.damping, !0), r = rn(e.mass), i = {
		...e,
		stiffness: t ?? It,
		damping: n ?? Lt,
		mass: r ?? Rt,
		isResolvedFromDuration: !1,
		isTimeDefined: (t ?? n ?? r) === void 0 && (e.duration !== void 0 || e.bounce !== void 0)
	};
	if (i.isTimeDefined) {
		if (e.visualDuration) {
			let t = Yt(e.bounce || 0), n = 2 * Math.PI / (e.visualDuration * 1.2) * Xt(t, 2 * Math.PI / 1.2);
			i.stiffness = n * n, i.damping = 2 * t * Math.sqrt(i.stiffness);
		} else Object.assign(i, tn(i)), i.isResolvedFromDuration = !0;
		nn(i.stiffness) && nn(i.damping, !0) || (i.stiffness = It, i.damping = Lt);
	}
	return i;
}
function on(e = Vt, t = Bt) {
	let n = typeof e == "object" ? e : {
		visualDuration: e,
		keyframes: [0, 1],
		bounce: t
	}, r = n.keyframes[0], i = n.keyframes[n.keyframes.length - 1], a = {
		done: !1,
		value: r
	}, { stiffness: o, damping: s, mass: c, duration: l, isResolvedFromDuration: u, isTimeDefined: d } = an({ ...n }), f = (e) => u ? 0 : -/* @__PURE__ */ j(e), p = s / (2 * Math.sqrt(o * c)), m = /* @__PURE__ */ j(Math.sqrt(o / c)), h = p * m, g = {
		target: i,
		delta: i - r,
		velocity: f(n.velocity) || 0,
		restSpeed: 0,
		restDelta: 0
	}, _ = () => {
		let e = Math.abs(g.delta) < 5;
		g.restSpeed = n.restSpeed || (e ? Ht : Ut), g.restDelta = n.restDelta || (e ? Wt : Gt);
	};
	_();
	let v, y, b;
	if (p < 1) {
		let e = Zt(m, p), t = {
			A: 0,
			sinC: 0,
			cosC: 0,
			t: -1,
			env: 0,
			sin: 0,
			cos: 0
		};
		b = () => {
			t.A = (g.velocity + h * g.delta) / e, t.sinC = h * t.A + g.delta * e, t.cosC = h * g.delta - t.A * e;
		};
		let n = (n) => {
			n !== t.t && (t.t = n, t.env = Math.exp(-h * n), t.sin = Math.sin(e * n), t.cos = Math.cos(e * n));
		};
		v = (e) => (n(e), g.target - t.env * (t.A * t.sin + g.delta * t.cos)), y = (e) => (n(e), t.env * (t.sinC * t.sin + t.cosC * t.cos));
	} else if (p === 1) {
		v = (e) => g.target - Math.exp(-m * e) * (g.delta + (g.velocity + m * g.delta) * e);
		let e = { C: 0 };
		b = () => {
			e.C = g.velocity + m * g.delta;
		}, y = (t) => Math.exp(-m * t) * (m * e.C * t - g.velocity);
	} else {
		let e = m * Math.sqrt(p * p - 1), t = h - e, n = h + e, r = e < 1 || d ? Infinity : 300 / e, i = (e, t) => Math.exp(t > r ? (h - e) * r - h * t : -e * t), a = {
			S: 0,
			F: 0
		};
		b = () => {
			let t = (g.velocity + h * g.delta) / e;
			a.S = (g.delta + t) / 2, a.F = (g.delta - t) / 2;
		}, v = (e) => g.target - a.S * i(t, e) - a.F * i(n, e), y = (e) => t * a.S * i(t, e) + n * a.F * i(n, e);
	}
	b();
	let x = u && l || null, S = {
		calculatedDuration: x,
		retarget: (e, t) => {
			g.target = e[e.length - 1], g.delta = g.target - e[0], g.velocity = f(t), n.restSpeed && n.restDelta || _(), S.calculatedDuration = x, a.done = !1, b();
		},
		velocity: (e) => /* @__PURE__ */ A(y(e)),
		next: (e) => {
			let t = v(e);
			if (u) a.done = e >= l;
			else {
				let n = /* @__PURE__ */ A(y(e));
				a.done = Math.abs(n) <= g.restSpeed && Math.abs(g.target - t) <= g.restDelta;
			}
			return a.value = a.done ? g.target : t, a;
		},
		toString: () => {
			let e = Math.min(Pt(S), Nt), t = Mt((t) => S.next(e * t).value, e, 30);
			return e + "ms " + t;
		}
	};
	return S;
}
var sn = /* @__PURE__ */ Object.assign(on, { applyToOptions: (e) => {
	let t = Ft(e, 100, on);
	return e.ease = t.ease, e.duration = /* @__PURE__ */ A(t.duration), e.type = "keyframes", e;
} });
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/generators/inertia.mjs
function cn({ keyframes: e, velocity: t = 0, power: n = .8, timeConstant: r = 325, bounceDamping: i = 10, bounceStiffness: a = 500, modifyTarget: o, min: s, max: c, restDelta: l = .5, restSpeed: u }) {
	let d = e[0], f = {
		done: !1,
		value: d
	}, p = (e) => e < s || e > c, m = (e) => s === void 0 ? c : c === void 0 || Math.abs(s - e) < Math.abs(c - e) ? s : c, h = n * t, g = d + h, _ = o ? o(g) : g;
	_ !== g && (h = _ - d);
	let v = (e) => -h * Math.exp(-e / r), y = (e) => {
		let t = v(e);
		f.done = Math.abs(t) <= l, f.value = f.done ? _ : e ? _ + t : d;
	}, b, x, S = (e) => {
		p(f.value) && (b = e, x = sn({
			keyframes: [f.value, m(f.value)],
			velocity: -v(e) / r * 1e3,
			damping: i,
			stiffness: a,
			restDelta: l,
			restSpeed: u
		}));
	};
	return S(0), {
		calculatedDuration: null,
		next: (e) => {
			let t = !1;
			return !x && b === void 0 && (t = !0, y(e), S(e)), b !== void 0 && e >= b ? x.next(e - b) : (!t && y(e), f);
		}
	};
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/utils/interpolate.mjs
function ln(e, t, n) {
	let r = [], i = x.mix || Ct, a = e.length - 1;
	for (let o = 0; o < a; o++) {
		let a = n?.(e[o], e[o + 1]) || i(e[o], e[o + 1]);
		t && (a = D(Array.isArray(t) ? t[o] || E : t, a)), r.push(a);
	}
	return r;
}
function un(e, t, { clamp: n = !0, ease: r, mixer: i } = {}) {
	let a = e.length;
	if (a === 1) return () => t[0];
	if (a === 2 && t[0] === t[1]) return () => t[1];
	let o = e[0] === e[1];
	e[0] > e[a - 1] && (e = [...e].reverse(), t = [...t].reverse());
	let s = ln(t, r, i), c = s.length, l = (n) => {
		if (o && n < e[0]) return t[0];
		let r = 0;
		if (c > 1) for (; r < e.length - 2 && !(n < e[r + 1]); r++);
		let i = /* @__PURE__ */ O(e[r], e[r + 1], n);
		return s[r](i);
	};
	return n ? (t) => l(b(e[0], e[a - 1], t)) : l;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/keyframes/offsets/fill.mjs
function dn(e, t) {
	let n = e[e.length - 1];
	for (let r = 1; r <= t; r++) {
		let i = /* @__PURE__ */ O(0, t, r);
		e.push(K(n, 1, i));
	}
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/keyframes/offsets/default.mjs
function fn(e) {
	let t = [0];
	return dn(t, e.length - 1), t;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/keyframes/offsets/time.mjs
function pn(e, t) {
	return e.map((e) => e * t);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/generators/keyframes.mjs
function mn(e, t) {
	return e.map(() => t || ae).splice(0, e.length - 1);
}
function hn({ duration: e = 300, keyframes: t, times: n, ease: r = "easeInOut", mixer: i }) {
	let a = typeof t[0] == "number" ? void 0 : i, o = /* @__PURE__ */ oe(r) ? r.map(ce) : ce(r) || ae, s = {
		done: !1,
		value: t[0]
	}, c = -1;
	if (!a) {
		for (let e = 1; e < t.length; e++) if (t[e] !== t[e - 1]) {
			if (c >= 0) {
				c = -2;
				break;
			}
			c = e - 1;
		}
	}
	if (c >= 0) {
		let r = n && n.length === t.length ? n : fn(t), i = r[c] * e, a = r[c + 1] * e, l = t[c], u = t[c + 1], d = Array.isArray(o) ? o[c] : o, f = (x.mix || Ct)(l, u), p = t.length - 2;
		return {
			calculatedDuration: e,
			next: (t) => (s.value = c && t < i ? f(0) : c < p && (t >= a || !e) ? typeof u == "number" ? u : f(1) : f(d(t >= a || !e ? 1 : t <= i ? 0 : (t - i) / (a - i))), s.done = t >= e, s)
		};
	}
	let l = un(pn(n && n.length === t.length ? n : fn(t), e), t, {
		ease: Array.isArray(o) ? o : mn(t, o),
		mixer: a
	});
	return {
		calculatedDuration: e,
		next: (t) => (s.value = l(t), s.done = t >= e, s)
	};
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/generators/utils/velocity.mjs
var gn = 5;
function _n(e, t, n) {
	let r = Math.max(t - gn, 0);
	return /* @__PURE__ */ M(n - e(r), t - r);
}
function vn(e, t, n = 0) {
	return t <= 0 ? n : e.velocity ? e.velocity(t) : _n((t) => e.next(t).value, t, e.next(t).value);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/keyframes/get-final.mjs
function yn(e, { repeat: t, repeatType: n = "loop" }, r, i = 1) {
	let a, o, s = 0;
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		n !== null && (s++ || (a = n), o = n);
	}
	let c = i < 0 || t && n !== "loop" && t % 2 == 1 ? 0 : s - 1;
	return !c || r === void 0 ? c ? o : a : r;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/utils/replace-transition-type.mjs
var bn = {
	decay: cn,
	inertia: cn,
	tween: hn,
	keyframes: hn,
	spring: sn
};
function xn(e) {
	typeof e.type == "string" && (e.type = bn[e.type]);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/utils/resolve-start-time.mjs
var Sn = 40, Cn = (e, t) => t - e > Sn && !x.useManualTiming ? t : e;
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/utils/notify-inspector.mjs
function wn(e, t) {
	return {
		kind: e,
		animation: t,
		timestamp: U.now(),
		frameTimestamp: le.timestamp,
		frameIsProcessing: le.isProcessing
	};
}
function Tn(e, t, n) {
	let r = globalThis.__MOTION_INSPECT__;
	if (r) try {
		r({
			...wn("animation-start", e),
			options: n ? {
				...t,
				...n
			} : t
		});
	} catch {}
}
function En(e, t) {
	let n = globalThis.__MOTION_INSPECT__;
	if (n) try {
		n({
			...wn("layout-animation-start", e),
			node: t
		});
	} catch {}
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/utils/WithPromise.mjs
var Dn = class {
	constructor() {
		this.isResolved = !1;
	}
	get finished() {
		return this._finished ||= this.isResolved ? Promise.resolve() : new Promise((e) => {
			this._resolve = e;
		}), this._finished;
	}
	updateFinished() {
		this._finished = this._resolve = void 0, this.isResolved = !1;
	}
	notifyFinished() {
		this.isResolved = !0, this._resolve?.();
	}
	then(e, t) {
		return this.finished.then(e, t);
	}
}, On = (e) => e / 100, kn = (e) => Math.round(e * 1e4) / 1e4, An = class extends Dn {
	constructor(e) {
		super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.delayState = {
			done: !1,
			value: void 0
		}, this.stop = () => {
			let { motionValue: e } = this.options, t = U.now();
			e && e.updatedAt !== t && this.tick(e.updatedAt = t), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop?.());
		}, this.options = e, this.initAnimation(), this.play(), e.autoplay === !1 && this.pause(), Tn(this, this.options);
	}
	initAnimation() {
		let { options: e } = this;
		xn(e);
		let { type: t = hn, repeat: n = 0, repeatDelay: r = 0, repeatType: i, velocity: a = 0 } = e, { keyframes: o } = e, s = t || hn;
		this.mixKeyframes = void 0, s !== hn && typeof o[0] != "number" && (this.mixKeyframes = D(On, e.mixer?.(o[0], o[1]) || Ct(o[0], o[1])), o = [0, 100]);
		let c = s(o === e.keyframes ? e : {
			...e,
			keyframes: o
		});
		i === "mirror" && (this.mirroredGenerator = s({
			...e,
			keyframes: [...o].reverse(),
			velocity: -a
		})), c.calculatedDuration === null && (c.calculatedDuration = Pt(c));
		let { calculatedDuration: l } = c;
		this.calculatedDuration = l, this.resolvedDuration = l + r, this.totalDuration = this.resolvedDuration * (n + 1) - r, this.generator = c;
	}
	updateTime(e) {
		this.currentTime = this.holdTime ?? Math.round(e - this.startTime) * this.playbackSpeed;
	}
	tick(e, t = !1) {
		let { generator: n, totalDuration: r, calculatedDuration: i } = this;
		if (this.startTime === null) return n.next(0);
		let { delay: a = 0, keyframes: o, type: s, onUpdate: c, finalKeyframe: l } = this.options;
		this.startTime === this.pendingStartTime && (this.startTime = Cn(this.startTime, e)), this.pendingStartTime = void 0, this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - r / this.speed, this.startTime)), t ? this.currentTime = e : this.updateTime(e);
		let u = this.currentTime - a * (this.playbackSpeed >= 0 ? 1 : -1), d = this.playbackSpeed >= 0 ? u < 0 : u > r;
		this.currentTime = Math.max(u, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = r);
		let f = this.generate(this.currentTime, d), { done: p } = f;
		d || (p = this.playbackSpeed >= 0 ? i < Infinity ? this.currentTime >= r : p : this.currentTime <= 0);
		let m = this.holdTime === null && (this.state === "finished" || this.state === "running" && p);
		return m && s !== cn && (f.value = yn(o, this.options, l, this.speed)), c && c(f.value), m && this.finish(), f;
	}
	at(e) {
		return this.holdTime ?? kn((e - this.startTime) * this.playbackSpeed);
	}
	sampleAt(e, t) {
		let { options: n, totalDuration: r } = this, i = this.at(e) - (n.delay || 0);
		return i >= r && n.type !== cn ? yn(n.keyframes, n, t ? void 0 : n.finalKeyframe) : this.generate(Math.max(i, 0), i < 0).value;
	}
	generate(e, t) {
		let { generator: n, totalDuration: r, mixKeyframes: i, mirroredGenerator: a, resolvedDuration: o } = this, { keyframes: s, repeat: c, repeatType: l, repeatDelay: u } = this.options, d = e, f = n;
		if (c) {
			let t = Math.min(e, r) / o, n = Math.floor(t), i = t % 1;
			!i && t >= 1 && (i = 1), i === 1 && n--, n = Math.min(n, c + 1), n % 2 && (l === "reverse" ? (i = 1 - i, u && (i -= u / o)) : l === "mirror" && (f = a)), d = b(0, 1, i) * o;
		}
		let p;
		return t ? (this.delayState.value = s[0], p = this.delayState) : p = f.next(d), i && !t && (p.value = i(p.value)), p;
	}
	get duration() {
		return /* @__PURE__ */ j(this.calculatedDuration);
	}
	get iterationDuration() {
		return this.duration + /* @__PURE__ */ j(this.options.delay ?? 0);
	}
	get time() {
		return /* @__PURE__ */ j(this.currentTime);
	}
	set time(e) {
		this.state === "finished" && this.updateFinished(), e = /* @__PURE__ */ A(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), this.driver ? this.driver.start(!1) : (this.startTime = 0, this.state = "paused", this.holdTime = e, this.tick(e));
	}
	getGeneratorVelocity() {
		return vn(this.generator, this.currentTime, this.options.velocity);
	}
	get speed() {
		return this.playbackSpeed;
	}
	set speed(e) {
		let t = this.playbackSpeed !== e;
		t && this.driver && this.updateTime(U.now()), this.playbackSpeed = e, t && this.driver && (this.time = /* @__PURE__ */ j(this.currentTime));
	}
	play() {
		if (this.isStopped) return;
		let { driver: e = jt, startTime: t } = this.options;
		this.driver ||= e((e) => this.tick(e)), this.options.onPlay?.();
		let n = this.driver.now();
		this.state === "finished" ? (this.updateFinished(), this.startTime = n) : this.holdTime === null ? this.startTime ||= t ?? (this.pendingStartTime = n) : this.startTime = n - this.holdTime / (this.playbackSpeed || 1), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
	}
	pause() {
		this.state = "paused", this.updateTime(U.now()), this.holdTime = this.currentTime;
	}
	complete() {
		this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
	}
	finish() {
		this.notifyFinished(), this.teardown(), this.state = "finished", this.options.onComplete?.();
	}
	cancel() {
		this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), this.options.onCancel?.();
	}
	teardown() {
		this.state = "idle", this.driver?.stop(), this.driver = void 0, this.startTime = this.holdTime = null;
	}
	sample(e) {
		return this.startTime = 0, this.tick(e, !0);
	}
	attachTimeline(e) {
		return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), this.driver?.stop(), e.observe(this);
	}
}, jn = /* @__PURE__ */ new Set([
	"brightness",
	"contrast",
	"saturate",
	"opacity"
]);
function Mn(e) {
	let [t, n] = e.slice(0, -1).split("(");
	if (t === "drop-shadow") return e;
	let [r] = n.match(xe) || [];
	if (!r) return e;
	let i = n.replace(r, ""), a = +!!jn.has(t);
	return r !== n && (a *= 100), t + "(" + a + i + ")";
}
var Nn = /\b([a-z-]*)\(.*?\)/gu, Pn = {
	...it,
	getAnimatableNone: (e) => {
		let t = e.match(Nn);
		return t ? t.map(Mn).join(" ") : e;
	}
}, Fn = {
	...it,
	getAnimatableNone: (e) => {
		let t = it.parse(e);
		return it.createTransformer(e)(t.map((e) => typeof e == "number" ? 0 : typeof e == "object" ? {
			...e,
			alpha: 1
		} : e));
	}
}, In = {
	...ve,
	transform: Math.round
}, Ln = {
	rotate: Ne,
	pathRotation: Ne,
	rotateX: Ne,
	rotateY: Ne,
	rotateZ: Ne,
	scale: be,
	scaleX: be,
	scaleY: be,
	scaleZ: be,
	skew: Ne,
	skewX: Ne,
	skewY: Ne,
	distance: G,
	translateX: G,
	translateY: G,
	translateZ: G,
	x: G,
	y: G,
	z: G,
	perspective: G,
	transformPerspective: G,
	opacity: ye,
	originX: Le,
	originY: Le,
	originZ: G
}, Rn = {
	borderWidth: G,
	borderTopWidth: G,
	borderRightWidth: G,
	borderBottomWidth: G,
	borderLeftWidth: G,
	borderRadius: G,
	borderTopLeftRadius: G,
	borderTopRightRadius: G,
	borderBottomRightRadius: G,
	borderBottomLeftRadius: G,
	width: G,
	maxWidth: G,
	height: G,
	maxHeight: G,
	top: G,
	right: G,
	bottom: G,
	left: G,
	inset: G,
	insetBlock: G,
	insetBlockStart: G,
	insetBlockEnd: G,
	insetInline: G,
	insetInlineStart: G,
	insetInlineEnd: G,
	padding: G,
	paddingTop: G,
	paddingRight: G,
	paddingBottom: G,
	paddingLeft: G,
	paddingBlock: G,
	paddingBlockStart: G,
	paddingBlockEnd: G,
	paddingInline: G,
	paddingInlineStart: G,
	paddingInlineEnd: G,
	margin: G,
	marginTop: G,
	marginRight: G,
	marginBottom: G,
	marginLeft: G,
	marginBlock: G,
	marginBlockStart: G,
	marginBlockEnd: G,
	marginInline: G,
	marginInlineStart: G,
	marginInlineEnd: G,
	fontSize: G,
	backgroundPositionX: G,
	backgroundPositionY: G,
	...Ln,
	zIndex: In,
	fillOpacity: ye,
	strokeOpacity: ye,
	numOctaves: In
}, zn = {
	...Rn,
	color: ze,
	backgroundColor: ze,
	outlineColor: ze,
	fill: ze,
	stroke: ze,
	borderColor: ze,
	borderTopColor: ze,
	borderRightColor: ze,
	borderBottomColor: ze,
	borderLeftColor: ze,
	filter: Pn,
	WebkitFilter: Pn,
	mask: Fn,
	WebkitMask: Fn
}, Bn = (e) => zn[e], Vn = /*@__PURE__*/ new Set([Pn, Fn]), Hn, Un, Wn;
function Gn(e, t) {
	if (e === Hn && t === Un) return Wn;
	let n = Bn(e);
	return Vn.has(n) || (n = it), Wn = n.getAnimatableNone ? n.getAnimatableNone(t) : void 0, Hn = e, Un = t, Wn;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/keyframes/utils/fill-wildcards.mjs
function Kn(e) {
	for (let t = 1; t < e.length; t++) e[t] ?? (e[t] = e[t - 1]);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/dom/parse-transform.mjs
var qn = (e) => e * 180 / Math.PI, Jn = (e) => Xn(qn(Math.atan2(e[1], e[0]))), Yn = {
	x: 4,
	y: 5,
	translateX: 4,
	translateY: 5,
	scaleX: 0,
	scaleY: 3,
	scaleZ: () => 1,
	scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
	rotate: Jn,
	rotateZ: Jn,
	skewX: (e) => qn(Math.atan(e[1])),
	skewY: (e) => qn(Math.atan(e[2])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2
}, Xn = (e) => (e %= 360, e < 0 && (e += 360), e), Zn = Jn, Qn = (e) => Math.hypot(e[0], e[1]), $n = (e) => Math.hypot(e[4], e[5]), er = {
	x: 12,
	y: 13,
	z: 14,
	translateX: 12,
	translateY: 13,
	translateZ: 14,
	scaleX: Qn,
	scaleY: $n,
	scaleZ: (e) => Math.hypot(e[8], e[9], e[10]),
	scale: (e) => (Qn(e) + $n(e)) / 2,
	rotateX: (e) => Xn(qn(Math.atan2(e[6], e[5]))),
	rotateY: (e) => Xn(qn(Math.atan2(-e[2], e[0]))),
	rotateZ: Zn,
	rotate: Zn,
	skewX: (e) => qn(Math.atan(e[4])),
	skewY: (e) => qn(Math.atan(e[1])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2
};
function tr(e) {
	return +!!e.includes("scale");
}
function nr(e, t) {
	if (!e || e === "none") return tr(t);
	let n = e.match(/^matrix(3d)?\(([-\d.e\s,]+)\)$/u);
	if (!n) return tr(t);
	let r = (n[1] ? er : Yn)[t], i = n[2].split(",").map((e) => parseFloat(e));
	return typeof r == "function" ? r(i) : i[r];
}
var rr = (e, t) => {
	let { transform: n = "none" } = getComputedStyle(e);
	return nr(n, t);
}, ir = [
	"transformPerspective",
	"x",
	"y",
	"z",
	"translateX",
	"translateY",
	"translateZ",
	"scale",
	"scaleX",
	"scaleY",
	"scaleZ",
	"rotate",
	"rotateX",
	"rotateY",
	"rotateZ",
	"skew",
	"skewX",
	"skewY"
], ar = /* @__PURE__ */ new Set([...ir, "pathRotation"]), or = (e) => e === ve || e === G, sr = /* @__PURE__ */ new Set([
	"x",
	"y",
	"z"
]), cr = /* @__PURE__ */ ir.filter((e) => !sr.has(e));
function lr(e) {
	let t = [];
	return cr.forEach((n) => {
		let r = e.getValue(n);
		if (r !== void 0) {
			let e = r.get(), i = +!!n.startsWith("scale");
			if (e === i) return;
			t.push([n, e]), r.set(i);
		}
	}), t;
}
var ur = /* @__PURE__ */ new Set(["bottom", "right"]);
function dr(e, t, n, r, i, a) {
	let o = parseFloat(e);
	if (!isNaN(o)) return o;
	let { min: s, max: c } = t()[n], l = c - s;
	return a === "border-box" ? l : l - parseFloat(r) - parseFloat(i);
}
var fr = ({ transform: e }) => nr(e, "x"), pr = ({ transform: e }) => nr(e, "y"), mr = {
	width: ({ width: e, paddingLeft: t = "0", paddingRight: n = "0", boxSizing: r }, i) => dr(e, i, "x", t, n, r),
	height: ({ height: e, paddingTop: t = "0", paddingBottom: n = "0", boxSizing: r }, i) => dr(e, i, "y", t, n, r),
	top: ({ top: e }) => parseFloat(e),
	left: ({ left: e }) => parseFloat(e),
	bottom: ({ top: e }, t) => {
		let { y: n } = t();
		return parseFloat(e) + (n.max - n.min);
	},
	right: ({ left: e }, t) => {
		let { x: n } = t();
		return parseFloat(e) + (n.max - n.min);
	},
	x: fr,
	y: pr,
	translateX: fr,
	translateY: pr
}, hr = /* @__PURE__ */ new Set(), gr = !1, _r = !1, vr = !1;
function yr() {
	if (_r) {
		let e = [], t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
		hr.forEach((r) => {
			r.needsMeasurement && (e.push(r), t.add(r.element), ur.has(r.name) && n.add(r.element));
		});
		let r = /* @__PURE__ */ new Map();
		n.forEach((e) => {
			let t = lr(e);
			t.length && (r.set(e, t), e.render());
		}), e.forEach((e) => e.measureInitialState()), t.forEach((e) => {
			e.render();
			let t = r.get(e);
			t && t.forEach(([t, n]) => {
				e.getValue(t)?.set(n);
			});
		}), e.forEach((e) => e.measureEndState()), e.forEach((e) => {
			e.suspendedScrollY !== void 0 && window.scrollTo(0, e.suspendedScrollY);
		});
	}
	_r = !1, gr = !1, hr.forEach((e) => e.complete(vr)), hr.clear();
}
function br() {
	hr.forEach((e) => {
		e.readKeyframes(), e.needsMeasurement && (_r = !0);
	});
}
function xr() {
	vr = !0, br(), yr(), vr = !1;
}
function Sr(e, t, n) {
	if (typeof e == "string") {
		if (S(e) || w(e)) return parseFloat(e);
		if (!it.test(e) && it.test(n)) return Gn(t, n);
	}
	return e ?? void 0;
}
var Cr = class {
	constructor(e, t, n, r, i, a = !1) {
		this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...e], this.onComplete = t, this.name = n, this.motionValue = r, this.element = i, this.isAsync = a;
	}
	scheduleResolve() {
		this.state = "scheduled", this.isAsync ? (hr.add(this), gr || (gr = !0, Ot.read(br), Ot.resolveKeyframes(yr))) : (this.readKeyframes(), this.complete());
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, name: t, element: n, motionValue: r } = this;
		if (e[0] === null) {
			let i = r?.get(), a = e[e.length - 1];
			if (i !== void 0) e[0] = i;
			else if (n && t) {
				let r = Sr(n.readValue(t, a), t, a);
				r !== void 0 && (e[0] = r);
			}
			e[0] === void 0 && (e[0] = a), r && i === void 0 && r.set(e[0]);
		}
		Kn(e);
	}
	setFinalKeyframe() {}
	measureInitialState() {}
	renderEndStyles() {}
	measureEndState() {}
	complete(e = !1) {
		this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), hr.delete(this);
	}
	cancel() {
		this.state === "scheduled" && (hr.delete(this), this.state = "pending");
	}
	resume() {
		this.state === "pending" && this.scheduleResolve();
	}
}, wr = (e) => e.startsWith("--");
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/dom/style-set.mjs
function Tr(e, t, n) {
	wr(t) ? e.style.setProperty(t, n) : e.style[t] = n;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/utils/supports/flags.mjs
var Er = {};
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/utils/supports/memo.mjs
function Dr(e, t) {
	let n = /* @__PURE__ */ T(e);
	return () => Er[t] ?? n();
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/utils/supports/scroll-timeline.mjs
var Or = /* @__PURE__ */ Dr(() => window.ScrollTimeline !== void 0, "scrollTimeline"), kr = /*@__PURE__*/ Dr(() => {
	try {
		document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
	} catch {
		return !1;
	}
	return !0;
}, "linearEasing"), Ar = ([e, t, n, r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`, jr = {
	linear: "linear",
	ease: "ease",
	easeIn: "ease-in",
	easeOut: "ease-out",
	easeInOut: "ease-in-out",
	circIn: /*@__PURE__*/ Ar([
		0,
		.65,
		.55,
		1
	]),
	circOut: /*@__PURE__*/ Ar([
		.55,
		0,
		1,
		.45
	]),
	backIn: /*@__PURE__*/ Ar([
		.31,
		.01,
		.66,
		-.59
	]),
	backOut: /*@__PURE__*/ Ar([
		.33,
		1.53,
		.69,
		.99
	])
};
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/waapi/easing/map-easing.mjs
function Mr(e, t) {
	if (e) return typeof e == "function" ? kr() ? Mt(e, t) : "ease-out" : /* @__PURE__ */ se(e) ? Ar(e) : Array.isArray(e) ? e.map((e) => Mr(e, t) || jr.easeOut) : jr[e];
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/waapi/start-waapi-animation.mjs
function Nr(e, t, n, { delay: r = 0, duration: i = 300, repeat: a = 0, repeatType: o = "loop", ease: s = "easeOut", times: c } = {}, l = void 0) {
	let u = { [t]: n };
	c && (u.offset = c);
	let d = Mr(s, i);
	Array.isArray(d) && (u.easing = d);
	let f = {
		delay: r,
		duration: i,
		easing: Array.isArray(d) ? "linear" : d,
		fill: "both",
		iterations: a + 1,
		direction: o === "reverse" ? "alternate" : "normal"
	};
	return l && (f.pseudoElement = l), e.animate(u, f);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/generators/utils/is-generator.mjs
function Pr(e) {
	return typeof e == "function" && "applyToOptions" in e;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/waapi/utils/apply-generator.mjs
function Fr({ type: e, ...t }) {
	return Pr(e) && kr() ? e.applyToOptions(t) : (t.duration ??= 300, t.ease ??= "easeOut", t);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/NativeAnimation.mjs
var Ir = class extends Dn {
	constructor(e) {
		if (super(), this.finishedTime = null, this.isStopped = !1, this.manualStartTime = null, !e) return;
		let { element: t, name: n, keyframes: r, pseudoElement: i, allowFlatten: a = !1, finalKeyframe: o, onComplete: s } = e;
		this.isPseudoElement = !!i, this.allowFlatten = a, this.options = e;
		let c = Fr(e);
		this.animation = Nr(t, n, r, c, i), c.autoplay === !1 && this.animation.pause(), this.animation.onfinish = this.onFinish = () => {
			if (this.animation.onfinish = null, this.finishedTime = this.time, !i) {
				let e = yn(r, this.options, o, this.speed);
				this.updateMotionValue?.(e), Tr(t, n, e), this.animation.cancel();
			}
			s?.(), this.notifyFinished();
		}, Tn(this, e, c);
	}
	play() {
		this.isStopped || (this.manualStartTime = null, this.animation.onfinish = this.onFinish, this.animation.play(), this.state === "finished" && this.updateFinished());
	}
	pause() {
		this.animation.pause();
	}
	complete() {
		this.isStopped || (this.animation.onfinish = this.onFinish), this.animation.finish?.();
	}
	cancel() {
		this.animation.onfinish = null;
		try {
			this.animation.cancel();
		} catch {}
	}
	stop() {
		this.isStopped || (this.isStopped = !0, this.state !== "idle" && this.finishedTime === null && (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel()));
	}
	commitStyles() {
		let e = this.options?.element;
		!this.isPseudoElement && e?.isConnected && this.animation.commitStyles?.();
	}
	get duration() {
		let e = this.animation.effect?.getComputedTiming?.().duration || 0;
		return /* @__PURE__ */ j(Number(e));
	}
	get iterationDuration() {
		let { delay: e = 0 } = this.options || {};
		return this.duration + /* @__PURE__ */ j(e);
	}
	get time() {
		return /* @__PURE__ */ j(Number(this.animation.currentTime) || 0);
	}
	set time(e) {
		let t = this.finishedTime !== null;
		this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ A(e), t && (this.animation.pause(), this.updateFinished());
	}
	get speed() {
		return this.animation.playbackRate;
	}
	set speed(e) {
		e < 0 && (this.finishedTime = null), this.animation.playbackRate = e;
	}
	get state() {
		return this.finishedTime === null ? this.animation.playState : "finished";
	}
	get startTime() {
		return this.manualStartTime ?? Number(this.animation.startTime);
	}
	set startTime(e) {
		this.manualStartTime = this.animation.startTime = e;
	}
	attachTimeline({ timeline: e, onAttach: t, observe: n }) {
		return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = this.onFinish = null, e && Or() ? (this.animation.timeline = e, t?.(this.animation), E) : n(this);
	}
}, Lr = {
	anticipate: te,
	backInOut: ee,
	circInOut: re
};
function Rr(e) {
	return e in Lr;
}
function zr(e) {
	typeof e.ease == "string" && Rr(e.ease) && (e.ease = Lr[e.ease]);
}
var Br = class extends Ir {
	constructor(e) {
		zr(e), xn(e), super(e), e.startTime !== void 0 && e.autoplay !== !1 && (this.startTime = e.startTime), this.options = e;
	}
	elapsed() {
		return this.state === "running" ? (U.now() - this.startTime) * this.speed : this.time * 1e3;
	}
	sample(e) {
		if (!this.sampler) {
			let { motionValue: e, onUpdate: t, onComplete: n, onPlay: r, onStop: i, element: a, ...o } = this.options;
			this.sampler = new An({
				...o,
				autoplay: !1
			}), this.sampler.stop();
		}
		return this.sampler.sample(Math.max(0, e)).value;
	}
	liveValue() {
		let { state: e } = this;
		if (e === "running" || e === "paused") return this.sample(this.elapsed());
	}
	updateMotionValue(e) {
		let { motionValue: t, element: n, name: r } = this.options;
		if (!t) return;
		if (e !== void 0) {
			t.set(e);
			return;
		}
		let { speed: i } = this, a = this.elapsed(), o = this.state === "running" && i ? b(0, 10, a) : 0, s = this.sample(a);
		n && r && Tr(n, r, s), t.setWithVelocity(this.sample(a - o * Math.sign(i)), s, o / Math.abs(i || 1));
	}
}, Vr = (e, t) => t !== "zIndex" && !!(typeof e == "number" || Array.isArray(e) || typeof e == "string" && (it.test(e) || e === "0") && !e.startsWith("url("));
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/utils/can-animate.mjs
function Hr(e) {
	let t = e[0];
	if (e.length === 1) return !0;
	for (let n = 0; n < e.length; n++) if (e[n] !== t) return !0;
}
function Ur(e, t, n, r) {
	let i = e[0];
	if (i === null) return !1;
	if (t === "display" || t === "visibility") return !0;
	let a = e[e.length - 1], o = Vr(i, t), s = Vr(a, t);
	return !o || !s ? !1 : Hr(e) || (n === "spring" || Pr(n)) && r;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/utils/make-animation-instant.mjs
function Wr(e) {
	e.duration = 0, e.type = "keyframes";
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/waapi/utils/accelerated-values.mjs
var Gr = /* @__PURE__ */ new Set([
	"opacity",
	"clipPath",
	"filter",
	"transform"
]), Kr = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function qr(e) {
	for (let t = 0; t < e.length; t++) if (typeof e[t] == "string" && Kr.test(e[t])) return !0;
	return !1;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/waapi/utils/needs-mixer.mjs
var Jr = ({ mixer: e, keyframes: t }) => e && typeof t[0] != "number" && t.some((n, r) => r && e(t[r - 1], n)), Yr = /* @__PURE__ */ new Set([
	"color",
	"backgroundColor",
	"outlineColor",
	"fill",
	"stroke",
	"borderColor",
	"borderTopColor",
	"borderRightColor",
	"borderBottomColor",
	"borderLeftColor"
]), Xr = () => !x.useManualTiming && Object.hasOwnProperty.call(Element.prototype, "animate");
function Zr(e) {
	let { motionValue: t, name: n, repeatDelay: r, repeatType: i, damping: a, type: o, keyframes: s } = e;
	if (!n || !(Gr.has(n) || Yr.has(n))) return !1;
	let c = t?.owner?.current;
	if (!(c instanceof HTMLElement) && !(c instanceof SVGElement)) return !1;
	let { onUpdate: l, transformTemplate: u } = t.owner.getProps();
	return Xr() && (Gr.has(n) || Yr.has(n) && qr(s)) && (n !== "transform" || !u) && !l && !r && i !== "mirror" && a !== 0 && o !== "inertia" && !Jr(e);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/value/types/utils/get-as-type.mjs
var Qr = (e, t) => t && typeof e == "number" ? t.transform(e) : e, $r = {
	x: "translateX",
	y: "translateY",
	z: "translateZ",
	transformPerspective: "perspective"
}, ei = ir.length, ti = {}, ni = (e, t, n = Qr(t, Ln[e])) => (ti[e] || (ti[e] = ($r[e] || e) + "(")) + n + ")", ri = (e, t) => (typeof t == "number" ? t : parseFloat(t)) === +!!e.startsWith("scale");
function ii(e, t, n) {
	let r = "";
	for (let i = 0; i < ei; i++) {
		let a = ir[i], o = e[a];
		if (o === void 0) continue;
		let s = n && (t[a] = Qr(o, Rn[a]));
		ri(a, o) || (r += ni(a, o, s || void 0) + " ");
	}
	let i = e.pathRotation;
	return i && (r += ni("rotate", i)), r = r.trim(), n ? n(t, r) : r || "none";
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/waapi/transforms/groups.mjs
var ai = /* @__PURE__ */ new WeakMap(), oi = 200, si = .001, ci = .1, li = .001, ui = 100, di = 100, fi = /* @__PURE__ */ new Set([
	"linear",
	"easeIn",
	"easeOut",
	"easeInOut"
]), pi = (e) => fi.has(e), mi = /* @__PURE__ */ new WeakMap(), hi = (e, t) => {
	let n = mi.get(e);
	return n?.[0] !== t && (n = [t, "linear(" + fn(Array(t + 1)).map((t) => kn(e(t)) + " " + kn(t * 100) + "%") + ")"], mi.set(e, n)), n[1];
}, gi = (e, t) => Math.min(oi, Math.max(2, Math.ceil((t - e) / 10))), _i = (e, t) => Math.abs(e - t) <= si, vi = (e, t) => e - t, yi = (e, t, n) => fn(Array(n + 1)).map((n) => K(e, t, n)), bi = (e) => e.motionValue.owner, xi = (e) => ai.get(e), Si = ({ state: e }) => e === "idle" || e === "finished", Ci = (e, t) => e.latestValues ? e.latestValues[t] : e.getValue(t)?.get(), wi = ({ name: e, motionValue: t }) => e && ir.includes(e) && t?.owner?.current instanceof HTMLElement && Xr() && kr();
function Ti(e) {
	let t = bi(e), { onUpdate: n, transformTemplate: r } = t.getProps();
	return !e.isHandoff && !n && !e.hasOnUpdate && !r && e.type !== "inertia" && (Ci(t, "transform") || "none") === "none" && !Ci(t, "pathRotation") && !t.projection?.isProjecting() && !Jr(e);
}
var Ei = class {
	constructor(e, t, n, r) {
		this.element = e, this.update = t, this.makeDriver = n, this.animation = r;
	}
	get js() {
		return this.driver ||= this.makeDriver(this.update);
	}
	now() {
		return this.driver || this.makeDriver !== jt ? this.js.now() : le.isProcessing ? le.timestamp : U.now();
	}
	start(e = !0) {
		let t = xi(this.element);
		!t || t.isJS ? this.js.start(e) : t.schedule(!1, !e);
	}
	stopJS() {
		this.driver?.stop();
	}
	stop() {
		this.stopJS();
		let e = xi(this.element);
		e && !e.isFinishing && e.release(this.animation);
	}
}, Di, Oi = class extends An {
	constructor(e) {
		let t = bi(e).current, { driver: n = jt } = e, r, i = Ti(e);
		e.driver = (e) => new Ei(t, e, n, r), super(e), r = this;
		let a = this.driver;
		a && (a.animation = this), this.canAccelerate = i;
		let { stop: o } = this;
		this.stop = () => {
			this.isAccelerated() && this.sync(), o();
		};
	}
	offsets() {
		let { keyframes: e, times: t } = this.options;
		return t || (this.offsetsOf !== e && (this.offsetsOf = e, this.cachedOffsets = fn(e)), this.cachedOffsets);
	}
	get group() {
		return xi(bi(this.options).current);
	}
	get js() {
		return this.driver?.js;
	}
	stopJS() {
		this.driver?.stopJS();
	}
	get name() {
		return this.options.name;
	}
	timing() {
		let { startTime: e, speed: t, totalDuration: n } = this, { delay: r = 0, repeatType: i } = this.options;
		return this.holdTime === null ? n === Infinity ? [e + r / t, this.resolvedDuration * (i === "loop" ? 1 : 2) / t || 1] : [e + (r + n) / t, 0] : [Infinity, 0];
	}
	isAccelerated() {
		let { group: e, state: t } = this;
		return e?.tracks.has(this) && !e.isJS && this.canAccelerate && (t === "running" || t === "paused");
	}
	liveValue() {
		return this.isAccelerated() ? this.sampleAt(U.now()) : void 0;
	}
	tween() {
		let { keyframes: e, type: t, repeat: n, delay: r = 0 } = this.options, i = -1;
		if (n || t !== hn || this.holdTime !== null) return;
		for (let t = 1; t < e.length; t++) if (e[t] !== e[t - 1]) {
			if (i >= 0) return;
			i = t - 1;
		}
		let { ease: a } = this.options;
		/* @__PURE__ */ oe(a) && (a = a[i]);
		let o = this.offsets(), s = (e) => this.startTime + (r + o[e] * this.totalDuration) / this.speed;
		if (i >= 0) {
			let e = /* @__PURE__ */ se(a) ? Ar(a) : pi(a) ? jr[a] : ce(a);
			return [
				s(i),
				s(i + 1),
				typeof e == "string" || _i(e(0), 0) && _i(e(1), 1) ? e : void 0
			];
		}
	}
	boundaries(e, t) {
		let { startTime: n, speed: r, resolvedDuration: i, options: a } = this, { delay: o = 0, repeat: s = 0, repeatDelay: c = 0, repeatType: l, type: u } = a, d = (u || hn) === hn ? this.offsets() : [0, 1], f = n + o / r, p = [];
		if (this.holdTime !== null || !(i > 0)) return p;
		for (let n = Math.max(0, Math.floor((e - f) * r / i)); n <= s; n++) {
			let a = f + n * i / r;
			if (a > t) break;
			for (let o of d) {
				let s = a + (n % 2 && l && l !== "loop" ? 1 - o : o) * (i - c) / r;
				s > e && s < t && p.push(s);
			}
		}
		return p;
	}
	numberAt(e) {
		return parseFloat(this.sampleAt(e, !0));
	}
	sync() {
		let e = U.now(), t = this.sampleAt(e, !0);
		this.options.motionValue.setWithVelocity(this.holdTime === null ? this.sampleAt(e - 10, !0) : t, t, 10);
	}
	play() {
		this.isStopped || ((this.group || ji(bi(this.options))).tracks.add(this), super.play());
	}
	pause() {
		super.pause(), this.isAccelerated() && this.group.schedule(!1);
	}
	complete() {
		super.complete();
		let { group: e } = this;
		e && !e.isJS && this.tick(U.now());
	}
	get time() {
		return this.isAccelerated() ? /* @__PURE__ */ j(b(0, this.totalDuration, this.at(U.now()) - (this.options.delay || 0))) : super.time;
	}
	set time(e) {
		(Di ??= Object.getOwnPropertyDescriptor(An.prototype, "time").set).call(this, e);
	}
	attachTimeline(e) {
		return this.canAccelerate = !1, this.group?.demote(!0), super.attachTimeline(e);
	}
}, ki, Ai = (e) => {
	ki || queueMicrotask(() => {
		let e = ki;
		ki = void 0, e.forEach((e) => e());
	}), (ki ||= []).push(e);
};
function ji(e) {
	let t = e.current, n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), i = {}, a = [], o = /* @__PURE__ */ new Map(), s = [], c = !1, l = !1, u = !1, d = !1, f = -Infinity, p, m = Infinity, h, g = (e) => {
		for (let t of n) if (t.name === e) return !0;
	}, _ = (t, n) => {
		let o = {};
		for (let s of t === void 0 ? ir : a) {
			let a = r.get(s), c = t === void 0 ? Ci(e, s) : a ? a.sampleAt(n > t && !a.timing()[1] ? n : t) : i[s];
			c !== void 0 && (o[s] = c);
		}
		return o;
	}, v = (e, t) => {
		let n = "";
		for (let r in e) {
			let i = e[r];
			t && ri(r, i) || (n += ni(r, i) + " ");
		}
		return (t ? n.trim() : n) || "none";
	}, y = (e, t) => v(_(e, t)), b = (e = _()) => {
		t.style.transform = v(e, !0);
	}, x = (e) => {
		e.onfinish = e.oncancel = null, e.cancel();
	}, S = (e = !0) => {
		clearTimeout(p), m = Infinity, h = void 0, e && b(), s.forEach(({ animation: e }) => x(e)), s = [];
	}, C = (e, n) => new Animation(new KeyframeEffect(t, e, n)), w = (e, t, n = Infinity) => {
		let r = {
			animation: e,
			offset: t,
			end: n
		};
		e.startTime = U.now() + t, n < Infinity && (e.onfinish = () => {
			r.isDone = !0, s.some((e) => e.end === Infinity) && (x(e), s = s.filter((e) => e !== r)), I.schedule(!1);
		}), e.oncancel = () => s.includes(r) && I.demote(), s.push(r);
	}, T = (e, t, n) => {
		let r = (t, n) => Math.abs(e(n) - e(t)), i = r(t, n);
		for (; n - t > .01;) {
			let e = (t + n) / 2;
			r(t, e) > r(e, n) ? n = e : t = e;
		}
		return r(t, n) > i / 2 ? [t, n] : [];
	}, E = (e, t, n, r) => {
		let i = gi(t, n);
		if (r.length * 4 > i) return;
		let a;
		for (let r of e) {
			let e = r.numberAt(t), i = (r.numberAt((t + n) / 2) - e) / (r.numberAt(n) - e);
			if (i === i) {
				if (a === void 0) a = i;
				else if (!_i(i, a)) return;
			}
		}
		let o = yi(t, n, i).concat(r).sort(vi), s = (e) => /* @__PURE__ */ O(t, n, e), c, l;
		for (let n of e) {
			let e = n.numberAt(t), r = o.map((t) => n.numberAt(t) - e), i = r[r.length - 1], a = r.some((e) => Math.abs(e) * si > Math.abs(i)) ? 0 : i, s = r.map((e) => a ? e / a : e);
			if (a && !c) c = s, l = (t) => (n.numberAt(t) - e) / a;
			else if (s.some((e, t) => !_i(e, a && c[t]))) return;
		}
		if (!c || c.every((e, t) => _i(e, s(o[t])))) return "linear";
		let u = [], d = (e, t = l(e)) => u.push(kn(t) + " " + kn(s(e) * 100) + "%");
		return c.forEach((e, t) => {
			t && Math.abs(e - c[t - 1]) > .2 && T(l, o[t - 1], o[t]).forEach((e) => d(e)), d(o[t], e);
		}), "linear(" + u + ")";
	}, D = (e, t, n, r) => {
		let i = [t], a = [], o = n, s = t;
		for (let r of e) {
			let e = r.tween();
			if (e?.[2] !== "linear") {
				let [i, c] = r.timing(), [l, u] = e || [t, c ? n : i];
				o = Math.min(o, l), s = Math.max(s, u), a.push(r);
			}
		}
		o = Math.max(t, o), s = Math.min(n, s);
		let c = (e, t) => a.every((n) => !(Math.abs(n.numberAt((e + t) / 2) - (n.numberAt(e) + n.numberAt(t)) / 2) > (n.name.startsWith("scale") ? li : ci))), l = (t, n, r) => {
			if (n - t < 1 || c(t, n)) i.push(n);
			else if (r < 4) l(t, (t + n) / 2, r + 1), l((t + n) / 2, n, r + 1);
			else {
				for (let r of e) i.push(...T((e) => r.numberAt(e), t, n));
				i.push(n);
			}
		}, u = s > o ? yi(o, s, Math.ceil((s - o) / 100)) : [];
		u.push(n);
		for (let e of r) u.push(e, Math.min(e + .01, n));
		let d = t;
		for (let e of u.sort(vi)) e > d && l(d, e, 0), d = e;
		return i.sort(vi);
	}, k = (e) => {
		let t;
		for (let n of e) {
			let e = n.tween();
			if (!e || t && (Math.abs(e[0] - t[0]) > 1 || Math.abs(e[1] - t[1]) > 1)) return;
			t = [
				e[0],
				e[1],
				!t || e[2] === t[2] ? e[2] : void 0
			];
		}
		return t;
	}, A = (e, t, n, r, i = { fill: "both" }, a) => {
		let o = r ? [] : e.flatMap((e) => e.boundaries(t, n)), s = r || E(e, t, n, o), c = s ? [t, n] : D(e, t, n, o), l = c.map((e) => y(e, a)), u = { transform: l };
		return s || (u.offset = c.map((e) => /* @__PURE__ */ O(t, n, e))), l.every((e) => e === l[0]) && (b(_(t, a)), u = null), C(u, {
			...i,
			duration: n - t,
			easing: s || "linear"
		});
	}, j = (e) => {
		let t = U.now() + e;
		t < m && (clearTimeout(p), m = t, p = setTimeout(() => {
			m = Infinity, I.schedule(!1);
		}, e));
	}, M = (t) => {
		let c = t, l = 0, u = 0, d = [], f = [], p = /* @__PURE__ */ new Set();
		r.clear(), o = /* @__PURE__ */ new Map();
		for (let e of n) {
			r.set(e.name, e);
			let [n, i] = e.timing(), a = n === Infinity;
			if (o.set(e, [
				e.at(t),
				e.speed,
				a
			]), !a) {
				if (e.speed < 0) return;
				if (i) {
					if (l) {
						let e = (n - u) / i;
						if (Math.abs(i - l) > 1 || Math.abs(e - Math.round(e)) * l > 1) return;
					} else l = i, u = n;
					f.push(e);
				} else p.add(n);
				d.push(e), c = Math.max(c, n);
			}
		}
		i = {}, a = ir.filter((t) => {
			if (r.has(t)) return !0;
			let n = i[t] = Ci(e, t);
			return n !== void 0 && !ri(t, n);
		}), S(!1);
		let m = !l && k(d);
		try {
			if (c > t) {
				let e;
				if (m && m[1] > t) {
					let [n, r, i] = m;
					if (n - t > di) return d.forEach((e) => e.sync()), j(h = n - t - di), !0;
					e = typeof i == "string" ? i : i ? hi(i, gi(n, r)) : E(d, n, r, []), e && w(A(d, n, r, e, {
						fill: "both",
						endDelay: c - r
					}), n - t, c - n);
				}
				e || w(A(d, t, c), 0, c - t), p.forEach((e) => e < c - 1 && w(C(null, { duration: e - t }), 0, e - t));
			}
			if (l) {
				let e = u + Math.floor((c - u) / l) * l;
				w(A(f, e, e + l, void 0, {
					iterations: Infinity,
					iterationStart: (c - e) / l,
					fill: "forwards"
				}, c), c - t);
			}
		} catch {
			return;
		}
		return s.length || S(), !0;
	}, N = (e, t) => {
		let r, i = 0;
		for (let t of n) {
			let n = o.get(t);
			if (!n) return !1;
			let [a, c, l] = n, u = t.at(e), d = t.timing()[0] === Infinity;
			if (l) {
				if (d && (u === a || !s.length)) continue;
				return !1;
			}
			let f = (u - a) / c, p = d ? 0 : t.speed / c;
			if (r === void 0) r = f, i = p;
			else if (Math.abs(f - r) > 1 || p !== i) return !1;
		}
		if (r === void 0) return !0;
		if (!s.length) {
			if (h === void 0 || t && i) return !1;
			if (i) {
				let e = (h - r) / i;
				if (e < 1) return !1;
				j(e);
			}
			return !0;
		}
		for (let { offset: e, end: n, isDone: i } of s) {
			let a = r - e;
			if (n < Infinity && (i ? a < n - 1 : a < 0 && (t || e <= 0) || a >= n)) return !1;
		}
		for (let { animation: t, offset: n, isDone: a } of s) {
			if (a) continue;
			let o = r - n;
			i && t.updatePlaybackRate && t.playState === "running" && Math.abs(Number(t.currentTime) - o) < 20 ? t.playbackRate !== i && t.updatePlaybackRate(i) : i ? (t.playbackRate !== i && (t.playbackRate = i), t.startTime = e - o / i) : (t.startTime = null, t.currentTime = o);
		}
		return !0;
	}, P = () => !n.size && (u = !0, xi(t) === I && ai.delete(t), I.isJS || S(), !0), F = () => {
		let t = U.now();
		if (I.isJS || (I.isFinishing = !0, n.forEach((n) => {
			let [r, a] = n.timing();
			n.state === "running" && n.speed > 0 && !a && r <= t + 1 && (n.complete(), i[n.name] = Ci(e, n.name), o.has(n) || (c = !0));
		}), I.isFinishing = !1), l = !1, u || (n.forEach((e) => Si(e) && n.delete(e)), P())) return;
		for (let e of n) if (!e.canAccelerate) return I.demote(!0);
		I.isJS && (I.isJS = !1, c = !0, n.forEach((e) => e.stopJS()));
		let r = c, a = d;
		if (c = d = !1, r || !N(t, a)) {
			if (a) {
				if (t - f < ui) return I.demote();
				f = t;
			}
			if (!M(t)) return I.demote();
		} else if (h !== void 0 && !a) return;
		n.forEach((e) => e.timing()[0] === Infinity && e.sync());
	}, I = {
		tracks: n,
		isJS: !1,
		isFinishing: !1,
		schedule(e, t) {
			u || (c ||= e, d ||= !!t, l || (l = !0, le.isProcessing ? Ot.render(F, !1, !0) : Ai(F)));
		},
		release(e) {
			Si(e) && n.delete(e), P() || I.schedule(!0);
		},
		check() {
			if (!I.isJS) {
				for (let t in i) if (Ci(e, t) !== i[t] && !g(t)) return I.schedule(!0, !0);
			}
		},
		demote(e) {
			if (!(I.isJS || u)) return n.forEach((t) => {
				t.isAccelerated() && t.sync(), e || (t.canAccelerate = !1);
			}), I.isJS = !0, o = /* @__PURE__ */ new Map(), S(), n.forEach((e) => e.state === "running" && e.js?.start()), !0;
		}
	};
	return ai.set(t, I), I;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/AsyncMotionValueAnimation.mjs
var Mi = class extends Dn {
	constructor(e) {
		super(), this.stop = () => {
			this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
		}, this.createdAt = U.now();
		let { keyframes: t, name: n, motionValue: r, element: i } = e, a = e;
		a.autoplay ??= !0, a.delay ??= 0, a.type ??= "keyframes", a.repeat ??= 0, a.repeatDelay ??= 0, a.repeatType ??= "loop";
		let o = i?.KeyframeResolver || Cr;
		this.keyframeResolver = new o(t, (e, t, n) => this.onKeyframesResolved(e, t, a, !n), n, r, i), this.keyframeResolver?.scheduleResolve();
	}
	onKeyframesResolved(e, t, n, r) {
		this.keyframeResolver = void 0;
		let { name: i, type: a, velocity: o, delay: s, isHandoff: c, onUpdate: l } = n;
		this.resolvedAt = U.now();
		let u = Ur(e, i, a, o);
		u || ((x.instantAnimations || !s) && l?.(yn(e, n, t)), e[0] = e[e.length - 1], Wr(n), n.repeat = 0);
		let { onComplete: d } = n;
		n.finalKeyframe = t, n.keyframes = e, n.onComplete = () => {
			d?.(), this.notifyFinished();
		};
		let f = u && !c && Zr(n), p = !f && wi(n);
		r && (f || p || this.resolvedAt !== this.createdAt) && (n.startTime ??= Cn(this.createdAt, this.resolvedAt));
		let m;
		if (f) {
			n.element = n.motionValue?.owner?.current;
			try {
				m = new Br(n);
			} catch {
				m = new An(n);
			}
		} else m = p ? new Oi(n) : new An(n);
		this.pendingTimeline &&= (this.stopTimeline = m.attachTimeline(this.pendingTimeline), void 0), this._animation = m;
	}
	get finished() {
		return this._animation ? this._animation.finished : super.finished;
	}
	then(e, t) {
		return this.finished.finally(e).then(() => {});
	}
	liveValue() {
		return this._animation?.liveValue?.();
	}
	get animation() {
		return this._animation || (this.keyframeResolver?.resume(), xr()), this._animation;
	}
	get duration() {
		return this.animation.duration;
	}
	get iterationDuration() {
		return this.animation.iterationDuration;
	}
	get time() {
		return this.animation.time;
	}
	set time(e) {
		this.animation.time = e;
	}
	get speed() {
		return this.animation.speed;
	}
	get state() {
		return this.animation.state;
	}
	set speed(e) {
		this.animation.speed = e;
	}
	get startTime() {
		return this.animation.startTime;
	}
	attachTimeline(e) {
		return this._animation ? this.stopTimeline = this.animation.attachTimeline(e) : this.pendingTimeline = e, () => this.stop();
	}
	play() {
		this.animation.play();
	}
	pause() {
		this.animation.pause();
	}
	complete() {
		this.animation.complete();
	}
	cancel() {
		this._animation?.cancel(), this.keyframeResolver?.cancel();
	}
};
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/utils/calc-child-stagger.mjs
function Ni(e, t, n, r = 0, i = 1) {
	let a = Array.from(e).sort((e, t) => e.sortNodePosition(t)).indexOf(t), o = e.size, s = (o - 1) * r;
	return typeof n == "function" ? n(a, o) : i === 1 ? a * r : s - a * r;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/value/index.mjs
var Pi = 30, Fi = (e) => !isNaN(parseFloat(e)), Ii = { current: void 0 }, Li = class {
	constructor(e, t = {}) {
		this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (e) => {
			let t = U.now();
			if (this.updatedAt !== t && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(e), this.current !== this.prev && (this.dirty(), this.dependents)) for (let e of this.dependents) e.dirty();
		}, this.hasAnimated = !1, this.setCurrent(e), this.owner = t.owner;
	}
	setCurrent(e) {
		this.current = e, this.updatedAt = U.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = Fi(this.current));
	}
	setPrevFrameValue(e = this.current) {
		this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt;
	}
	onChange(e) {
		return this.on("change", e);
	}
	on(e, t) {
		var n;
		return e === "change" ? this.onChangeSubscribe(t) : ((n = this.events)[e] || (n[e] = new k())).add(t);
	}
	onChangeSubscribe(e) {
		let { events: t } = this;
		return !t.change && !this.changeSubscriber ? this.changeSubscriber = e : (t.change || (t.change = new k(), t.change.add(this.changeSubscriber), this.changeSubscriber = void 0), t.change.add(e)), () => {
			this.changeSubscriber === e ? this.changeSubscriber = void 0 : t.change?.remove(e), this.stopIfUnobserved();
		};
	}
	stopIfUnobserved() {
		Ot.read(() => {
			!this.changeSubscriber && !this.events.change?.getSize() && this.stop();
		});
	}
	clearListeners() {
		this.changeSubscriber = void 0;
		for (let e in this.events) this.events[e].clear();
	}
	attach(e, t) {
		this.passiveEffect = e, this.stopPassiveEffect = t;
	}
	set(e) {
		this.passiveEffect ? this.passiveEffect(e, this.updateAndNotify) : this.updateAndNotify(e);
	}
	setWithVelocity(e, t, n) {
		this.set(t), this.prev = void 0, this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt - n;
	}
	jump(e, t = !0) {
		t && (this.updatedAt = U.now(), this.stop()), this.updateAndNotify(e), this.prev = e, this.prevUpdatedAt = this.prevFrameValue = void 0, this.stopPassiveEffect?.();
	}
	dirty() {
		let { current: e, changeSubscriber: t } = this;
		t ? t(e) : this.events.change?.notify(e);
	}
	addDependent(e) {
		(this.dependents ||= /* @__PURE__ */ new Set()).add(e);
	}
	removeDependent(e) {
		this.dependents?.delete(e);
	}
	get() {
		Ii.current?.push(this);
		let e = this.animation?.liveValue?.();
		return e === void 0 ? this.current : e;
	}
	getCurrent() {
		return this.current;
	}
	getPrevious() {
		return this.prev;
	}
	getVelocity() {
		let e = U.now();
		if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > Pi) return 0;
		let t = Math.min(this.updatedAt - this.prevUpdatedAt, Pi);
		return /* @__PURE__ */ M(parseFloat(this.current) - parseFloat(this.prevFrameValue), t);
	}
	start(e) {
		return new Promise((t) => this.run(e, t));
	}
	run(e, t) {
		this.stop(), this.hasAnimated = !0;
		let n = !1, r;
		r = e(() => {
			n = !0, this.events.animationComplete?.notify(), this.animation === r && (this.animation = void 0), t?.();
		}), n || (this.animation = r), this.events.animationStart?.notify();
	}
	stop() {
		this.animation && (this.animation.stop(), this.events.animationCancel?.notify()), this.animation = void 0;
	}
	isAnimating() {
		return !!this.animation;
	}
	destroy() {
		this.dependents?.clear(), this.events.destroy?.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect?.();
	}
};
function Ri(e, t) {
	return new Li(e, t);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/utils/resolve-transition.mjs
function zi(e, t) {
	if (e?.inherit && t) {
		let { inherit: n, ...r } = e;
		return {
			...t,
			...r
		};
	}
	return e;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/utils/get-value-transition.mjs
function Bi(e, t) {
	let n = e?.[t] ?? e?.default ?? e;
	return n === e ? n : zi(n, e);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/utils/default-transitions.mjs
var Vi = {
	type: "spring",
	stiffness: 500,
	damping: 25,
	restSpeed: 10
}, Hi = (e) => ({
	type: "spring",
	stiffness: 550,
	damping: e === 0 ? 2 * Math.sqrt(550) : 30,
	restSpeed: 10
}), Ui = {
	type: "keyframes",
	duration: .8
}, Wi = {
	type: "keyframes",
	ease: [
		.25,
		.1,
		.35,
		1
	],
	duration: .3
}, Gi = (e, { keyframes: t }) => t.length > 2 ? Ui : ar.has(e) ? e.startsWith("scale") ? Hi(t[1]) : Vi : Wi, Ki = /* @__PURE__ */ new Set([
	"when",
	"delay",
	"delayChildren",
	"staggerChildren",
	"staggerDirection",
	"repeat",
	"repeatType",
	"repeatDelay",
	"from",
	"elapsed",
	"out",
	"mixer"
]);
function qi(e) {
	for (let t in e) if (!Ki.has(t)) return !0;
	return !1;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/interfaces/motion-value.mjs
var Ji = (e, t, n, r = {}, i, a) => (o) => {
	let s = Bi(r, e) || {}, c = s.delay || r.delay || 0, { elapsed: l = 0 } = r;
	l -= /* @__PURE__ */ A(c);
	let u = {
		keyframes: Array.isArray(n) ? n : [null, n],
		ease: "easeOut",
		velocity: t.getVelocity(),
		...s,
		delay: -l,
		onUpdate: (e) => {
			t.set(e), s.onUpdate && s.onUpdate(e);
		},
		onComplete: () => {
			o(), s.onComplete && s.onComplete();
		},
		name: e,
		motionValue: t,
		element: a ? void 0 : i,
		hasOnUpdate: !!s.onUpdate
	};
	qi(s) || Object.assign(u, Gi(e, u)), u.duration &&= /* @__PURE__ */ A(u.duration), u.repeatDelay &&= /* @__PURE__ */ A(u.repeatDelay), u.from !== void 0 && (u.keyframes[0] = u.from);
	let d = !1;
	if ((u.type === !1 || u.duration === 0 && !u.repeatDelay) && (Wr(u), u.delay === 0 && (d = !0)), (x.instantAnimations || x.skipAnimations || i?.shouldSkipAnimations || s.skipAnimations) && (d = !0, Wr(u), u.delay = 0), u.allowFlatten = !s.type && !s.ease, d && !a && t.get() !== void 0) {
		let e = yn(u.keyframes, s);
		if (e !== void 0) {
			Ot.update(() => {
				u.onUpdate(e), u.onComplete();
			});
			return;
		}
	}
	return s.isSync ? new An(u) : new Mi(u);
}, Yi = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function Xi(e) {
	let t = Yi.exec(e);
	if (!t) return [,];
	let [, n, r, i] = t;
	return [`--${n ?? r}`, i];
}
function Zi(e, t, n = 1) {
	let [r, i] = Xi(e);
	if (!r) return;
	let a = window.getComputedStyle(t).getPropertyValue(r);
	if (a) {
		let e = a.trim();
		return S(e) ? parseFloat(e) : e;
	}
	return he(i) ? Zi(i, t, n + 1) : i;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/utils/resolve-variants.mjs
function Qi(e) {
	let t = [{}, {}];
	return e?.values.forEach((e, n) => {
		t[0][n] = e.get(), t[1][n] = e.getVelocity();
	}), t;
}
function $i(e, t, n, r) {
	let i = (t) => typeof t == "function" ? t(n === void 0 ? e.custom : n, ...Qi(r)) : t;
	return t = i(t), typeof t == "string" && (t = e.variants && e.variants[t]), i(t);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/utils/resolve-dynamic-variants.mjs
function ea(e, t, n) {
	return $i(e.getProps(), t, n, e);
}
var ta = (e, t) => t === "exit" ? e.presenceContext?.custom : void 0, na = /* @__PURE__ */ new Set([
	"width",
	"height",
	"top",
	"left",
	"right",
	"bottom",
	...ir
]), ra = (e) => Array.isArray(e);
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/utils/setters.mjs
function ia(e, t, n) {
	e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, Ri(n));
}
function aa(e) {
	return ra(e) ? e[e.length - 1] || 0 : e;
}
function oa(e, t) {
	let { transitionEnd: n = {}, transition: r = {}, ...i } = ea(e, t) || {};
	i = {
		...i,
		...n
	};
	for (let t in i) ia(e, t, aa(i[t]));
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/value/utils/is-motion-value.mjs
var sa = (e) => !!(e && e.getVelocity);
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/value/will-change/is.mjs
function ca(e) {
	return !!(sa(e) && e.add);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/value/will-change/add-will-change.mjs
function la(e, t) {
	let n = e.getValue("willChange");
	if (ca(n)) return n.add(t);
	if (!n && x.WillChange) {
		let n = new x.WillChange("auto");
		e.addValue("willChange", n), n.add(t);
	}
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/optimized-appear/data-id.mjs
var ua = "data-framer-appear-id";
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/optimized-appear/get-appear-id.mjs
function da(e) {
	return e.props[ua];
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/interfaces/visual-element-target.mjs
var fa = typeof window < "u";
function pa({ protectedKeys: e, needsAnimating: t }, n) {
	let r = n in e && !t[n];
	return t[n] = !1, r;
}
function ma(e, t, { delay: n = 0, transitionOverride: r, type: i } = {}) {
	let { transition: a, transitionEnd: o, ...s } = t, c = e.getDefaultTransition();
	a = a ? zi(a, c) : c;
	let l = a?.reduceMotion, u = a?.skipAnimations;
	r && (a = r);
	let d = [], f = i && e.animationState?.getState()[i], p = a?.path;
	p && (p.animateValues ? p.animateValues((t) => e.getValue(t, e.latestValues[t] ?? 0), s, a, n, d) : p.animateVisualElement?.(e, s, a, n, d));
	for (let t in s) {
		let r = e.getValue(t, e.latestValues[t] ?? null), i = s[t];
		if (i === void 0 || f && pa(f, t)) continue;
		let o = {
			delay: n,
			...Bi(f?.out[t] || a || {}, t)
		};
		u && (o.skipAnimations = !0);
		let c = r.get();
		if (c !== void 0 && !r.isAnimating() && !Array.isArray(i) && i === c && !o.velocity) {
			Ot.update(() => r.set(i));
			continue;
		}
		let p = !1;
		if (fa && window.MotionHandoffAnimation) {
			let n = da(e);
			if (n) {
				let e = window.MotionHandoffAnimation(n, t, Ot);
				e !== null && (o.startTime = e, p = !0);
			}
		}
		la(e, t);
		let m = l ?? e.shouldReduceMotion;
		r.run(Ji(t, r, i, m && na.has(t) ? { type: !1 } : o, e, p));
		let h = r.animation;
		h && d.push(h);
	}
	if (o) {
		let t = () => Ot.update(() => {
			o && oa(e, o);
		});
		d.length ? Promise.all(d).then(t) : t();
	}
	return d;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/interfaces/visual-element-variant.mjs
function ha(e, t, n = {}) {
	let r = ea(e, t, ta(e, n.type)), i = n.transitionOverride || (r?.transition ?? (e.getDefaultTransition() || {})), a = () => Promise.all(r ? ma(e, r, n) : []), o = (r = 0) => {
		let { variantChildren: a } = e, { delayChildren: o = 0, staggerChildren: s, staggerDirection: c } = i, l = [];
		return a?.forEach((e) => {
			e.notify("AnimationStart", t), l.push(ha(e, t, {
				...n,
				delay: r + (typeof o == "function" ? 0 : o) + Ni(a, e, o, s, c)
			}).then(() => e.notify("AnimationComplete", t)));
		}), Promise.all(l);
	}, { when: s } = i;
	return s ? s === "beforeChildren" ? a().then(() => o()) : o().then(a) : Promise.all([a(), o(n.delay)]);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/interfaces/visual-element.mjs
function ga(e, t, n = {}) {
	return e.notify("AnimationStart", t), (Array.isArray(t) ? Promise.all(t.map((t) => ha(e, t, n))) : typeof t == "string" ? ha(e, t, n) : Promise.all(ma(e, ea(e, t, n.custom), n))).then(() => {
		e.notify("AnimationComplete", t);
	});
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/value/types/auto.mjs
var _a = {
	test: (e) => e === "auto",
	parse: (e) => e
}, va = (e) => (t) => t.test(e), ya = [
	ve,
	G,
	Pe,
	Ne,
	Ie,
	Fe,
	_a
], ba = (e) => ya.find(va(e));
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/keyframes/utils/is-none.mjs
function xa(e) {
	return typeof e == "number" ? e === 0 : e === null || e === "none" || e === "0" || w(e);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/keyframes/utils/make-none-animatable.mjs
var Sa = /* @__PURE__ */ new Set([
	"auto",
	"none",
	"0"
]);
function Ca(e, t, n) {
	let r = 0, i;
	for (; r < e.length && !i;) {
		let t = e[r];
		typeof t == "string" && !Sa.has(t) && Xe(t) && (i = e[r]), r++;
	}
	if (i && n) for (let r of t) e[r] !== i && (e[r] = Gn(n, i));
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/keyframes/DOMKeyframesResolver.mjs
var wa = class extends Cr {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i, !0);
	}
	scheduleResolve() {
		if (this.canReadNow() && (this.readKeyframes(), !this.needsMeasurement)) return this.complete();
		super.scheduleResolve();
	}
	canReadNow() {
		let { unresolvedKeyframes: e, element: t, motionValue: n } = this, r = e[0] ?? n?.get();
		if (!t?.current || r === void 0) return !1;
		for (let t = 0; t < e.length; t++) if (_e(t ? e[t] : r)) return !1;
		return !0;
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, element: t, name: n } = this;
		if (!t?.current) return;
		super.readKeyframes();
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (typeof r == "string" && (r = r.trim(), he(r))) {
				let i = Zi(r, t.current);
				i !== void 0 && (e[n] = i), n === e.length - 1 && (this.finalKeyframe = r);
			}
		}
		if (this.resolveNoneKeyframes(), !na.has(n) || e.length !== 2) return;
		let [r, i] = e;
		if (typeof r == "number" && typeof i == "number") return;
		let a = ba(r), o = ba(i);
		if (_e(r) !== _e(i) && mr[n]) this.needsMeasurement = !0;
		else if (a !== o) {
			if (or(a) && or(o)) for (let t = 0; t < e.length; t++) {
				let n = e[t];
				typeof n == "string" && (e[t] = parseFloat(n));
			}
			else mr[n] && (this.needsMeasurement = !0);
		}
	}
	resolveNoneKeyframes() {
		let { unresolvedKeyframes: e, name: t } = this, n = [];
		for (let t = 0; t < e.length; t++) (e[t] === null || xa(e[t])) && n.push(t);
		n.length && Ca(e, n, t);
	}
	measure() {
		let { element: e, name: t } = this;
		return mr[t](window.getComputedStyle(e.current), () => e.measureViewportBox());
	}
	measureInitialState() {
		let { element: e, unresolvedKeyframes: t, name: n } = this;
		if (!e?.current) return;
		n === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = this.measure(), t[0] = this.measuredOrigin;
		let r = t[t.length - 1];
		r !== void 0 && this.motionValue?.jump(r, !1);
	}
	measureEndState() {
		let { element: e, unresolvedKeyframes: t } = this;
		if (!e?.current) return;
		this.motionValue?.jump(this.measuredOrigin, !1);
		let n = t.length - 1, r = t[n];
		t[n] = this.measure(), r !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = r), this.resolveNoneKeyframes();
	}
}, Ta = [
	"borderTopLeftRadius",
	"borderTopRightRadius",
	"borderBottomRightRadius",
	"borderBottomLeftRadius"
];
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/utils/is-html-element.mjs
function Ea(e) {
	return C(e) && "offsetHeight" in e && !("ownerSVGElement" in e);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/utils/is-svg-element.mjs
function Da(e) {
	return C(e) && "ownerSVGElement" in e;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/scope/active.mjs
var Oa = {};
function ka(e) {
	return Oa.current?.add(e), e;
}
var Aa = (e) => Oa.current ? Oa.current.bind(e) : e;
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/utils/resolve-elements.mjs
function ja(e, t, n) {
	if (e == null) return [];
	if (e instanceof EventTarget) return [e];
	if (typeof e == "string") {
		let r = t ? t.current : Oa.current?.root || document, i = n?.[e] ?? r.querySelectorAll(e);
		return i ? Array.from(i) : [];
	}
	return Array.from(e).filter((e) => e != null);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/dom/utils/camel-to-dash.mjs
function Ma(e) {
	return e.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/html/utils/build-styles.mjs
function Na(e, t, n) {
	let { style: r, vars: i, transformOrigin: a } = e, o = !1, s = !1;
	for (let e in t) {
		let n = t[e];
		if (ar.has(e)) o = !0;
		else if (pe(e)) i[e] = n;
		else {
			let t = Qr(n, Rn[e]);
			e.startsWith("origin") ? (s = !0, a[e] = t) : r[e] = t;
		}
	}
	if (t.transform || (o || n ? r.transform = ii(t, e.transform, n) : r.transform &&= "none"), s) {
		let { originX: e = "50%", originY: t = "50%", originZ: n = 0 } = a;
		r.transformOrigin = `${e} ${t} ${n}`;
	}
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/svg/utils/path.mjs
var Pa = {
	offset: "stroke-dashoffset",
	array: "stroke-dasharray"
}, Fa = {
	offset: "strokeDashoffset",
	array: "strokeDasharray"
};
function Ia(e, t, n = 1, r = 0, i = !0) {
	e.pathLength = 1;
	let a = i ? Pa : Fa;
	e[a.offset] = `${-r}`, e[a.array] = `${t} ${n}`;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/svg/utils/build-attrs.mjs
var La = [
	"transform",
	"opacity",
	"clipPath",
	"filter",
	"offsetDistance",
	"offsetPath",
	"offsetRotate",
	"offsetAnchor"
];
function Ra(e, { attrX: t, attrY: n, attrScale: r, pathLength: i, pathSpacing: a = 1, pathOffset: o = 0, ...s }, c, l, u) {
	if (Na(e, s, l), c) {
		e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
		return;
	}
	e.attrs = e.style, e.style = {};
	let { attrs: d, style: f } = e;
	for (let e of La) d[e] !== void 0 && (f[e] = d[e], delete d[e]);
	(f.transform || d.transformOrigin) && (f.transformOrigin = d.transformOrigin ?? "50% 50%", delete d.transformOrigin), f.transform && (f.transformBox = u?.transformBox ?? "fill-box", delete d.transformBox), t !== void 0 && (d.x = t), n !== void 0 && (d.y = n), r !== void 0 && (d.scale = r), i !== void 0 && Ia(d, i, a, o, !1);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/geometry/conversion.mjs
function za({ top: e, left: t, right: n, bottom: r }) {
	return {
		x: {
			min: t,
			max: n
		},
		y: {
			min: e,
			max: r
		}
	};
}
function Ba({ x: e, y: t }) {
	return {
		top: t.min,
		right: e.max,
		bottom: t.max,
		left: e.min
	};
}
function Va(e, t) {
	if (!t) return e;
	let n = t({
		x: e.left,
		y: e.top
	}), r = t({
		x: e.right,
		y: e.bottom
	});
	return {
		top: n.y,
		left: n.x,
		bottom: r.y,
		right: r.x
	};
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/utils/has-transform.mjs
function Ha(e) {
	return e === void 0 || e === 1;
}
function Ua({ scale: e, scaleX: t, scaleY: n }) {
	return !Ha(e) || !Ha(t) || !Ha(n);
}
var Wa = [
	"rotate",
	"rotateX",
	"rotateY",
	"rotateZ",
	"skewX",
	"skewY"
];
function Ga(e) {
	return Ua(e) || qa(e) || Ka(e);
}
function Ka(e) {
	return e.z || e.rotate || e.rotateX || e.rotateY || e.rotateZ || e.skewX || e.skewY;
}
function qa(e) {
	return Ja(e.x) || Ja(e.y);
}
function Ja(e) {
	return e && e !== "0%";
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/geometry/delta-apply.mjs
function Ya(e, t, n) {
	return n + t * (e - n);
}
function Xa(e, t, n, r, i) {
	return i !== void 0 && (e = Ya(e, i, r)), Ya(e, n, r) + t;
}
function Za(e, t = 0, n = 1, r, i) {
	e.min = Xa(e.min, t, n, r, i), e.max = Xa(e.max, t, n, r, i);
}
function Qa(e, { x: t, y: n }) {
	Za(e.x, t.translate, t.scale, t.originPoint), Za(e.y, n.translate, n.scale, n.originPoint);
}
var $a = .999999999999, eo = 1.0000000000001;
function to(e, t, n, r = !1) {
	let i = n.length;
	if (!i) return;
	t.x = t.y = 1;
	let a, o;
	for (let s = 0; s < i; s++) a = n[s], o = a.projectionDelta, a.options.visualElement?.props.style?.display !== "contents" && (r === !0 && a.options.layoutScroll && a.scroll && a !== a.root && (no(e.x, -a.scroll.offset.x), no(e.y, -a.scroll.offset.y)), o && (t.x *= o.x.scale, t.y *= o.y.scale, Qa(e, o)), r && (r.path?.[s] || r) !== a && Ga(a.latestValues) && ao(e, a.latestValues, a.layout?.layoutBox));
	t.x < eo && t.x > $a && (t.x = 1), t.y < eo && t.y > $a && (t.y = 1);
}
function no(e, t) {
	e.min += t, e.max += t;
}
function ro(e, t, n, r, i = .5) {
	Za(e, t, n, K(e.min, e.max, i), r);
}
function io(e, t) {
	return typeof e == "string" ? parseFloat(e) / 100 * (t.max - t.min) : e;
}
function ao(e, t, n) {
	let r = n ?? e;
	ro(e.x, io(t.x, r.x), t.scaleX, t.scale, t.originX), ro(e.y, io(t.y, r.y), t.scaleY, t.scale, t.originY);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/utils/measure.mjs
function oo(e, t) {
	return za(Va(e.getBoundingClientRect(), t));
}
function so(e, t, n) {
	let r = oo(e, n), { scroll: i } = t;
	return i && (no(r.x, i.offset.x), no(r.y, i.offset.y)), r;
}
var co = () => ({
	x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
	y: document.documentElement.scrollTop || document.body?.scrollTop || 0
}), { schedule: lo, cancel: uo } = /* @__PURE__ */ Dt(queueMicrotask, !1);
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/animation/animate/single-value.mjs
function fo(e, t, n) {
	let r = sa(e) ? e : Ri(e);
	return r.run(Ji("", r, t, n)), r.animation;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/styles/scale-correction.mjs
var po = {}, mo = {
	value: null,
	addProjectionMetrics: null,
	countProjection: void 0
};
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/utils/delay.mjs
function ho(e, t) {
	let n = U.now();
	e = Aa(e);
	let r = ({ timestamp: i }) => {
		let a = i - n;
		a >= t && (kt(r), e(a - t));
	};
	return Ot.setup(r, !0), ka(() => kt(r));
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/utils/is-ref-object.mjs
function go(e) {
	return e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/utils/is-svg-svg-element.mjs
function _o(e) {
	return Da(e) && e.tagName === "svg";
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/value/utils/resolve-motion-value.mjs
function vo(e) {
	return sa(e) ? e.get() : e;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/value/utils/as-number.mjs
var yo = (e) => typeof e == "number" ? e : parseFloat(e), bo = Ta.length, xo = (e) => typeof e == "number" || G.test(e);
function So(e, t, n, r, i, a) {
	i ? (e.opacity = K(0, n.opacity ?? 1, wo(r)), e.opacityExit = K(t.opacity ?? 1, 0, To(r))) : a && (e.opacity = K(t.opacity ?? 1, n.opacity ?? 1, r));
	for (let i = 0; i < bo; i++) {
		let a = Ta[i], o = Co(t, a), s = Co(n, a);
		(o !== void 0 || s !== void 0) && (o ||= 0, s ||= 0, o === 0 || s === 0 || xo(o) === xo(s) ? (e[a] = Math.max(K(yo(o), yo(s), r), 0), (Pe.test(s) || Pe.test(o)) && (e[a] += "%")) : e[a] = s);
	}
	for (let i = 0; i < Wa.length; i++) {
		let a = Wa[i];
		(t[a] || n[a]) && (e[a] = K(t[a] || 0, n[a] || 0, r));
	}
}
function Co(e, t) {
	return e[t] === void 0 ? e.borderRadius : e[t];
}
var wo = /*@__PURE__*/ Eo(0, .5, z), To = /*@__PURE__*/ Eo(.5, .95, E);
function Eo(e, t, n) {
	return (r) => r < e ? 0 : r > t ? 1 : n(/* @__PURE__ */ O(e, t, r));
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/animation/layout-velocity.mjs
var Do = (e, t, { x: n, y: r }) => {
	let i = e * e + t * t;
	return i < 1 ? 0 : -1e3 * (n * e + r * t) / i;
}, Oo = (e, t = 300) => {
	let n = b(.25, 2, t / 300), { stiffness: r, damping: i } = an({
		...e,
		duration: e.duration && /* @__PURE__ */ A(e.duration)
	});
	return {
		...e,
		stiffness: r,
		damping: i * Math.sqrt(n),
		mass: n
	};
};
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/geometry/copy.mjs
function ko(e, t) {
	e.min = t.min, e.max = t.max;
}
function Ao(e, t) {
	ko(e.x, t.x), ko(e.y, t.y);
}
function jo(e, t) {
	e.translate = t.translate, e.scale = t.scale, e.originPoint = t.originPoint, e.origin = t.origin;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/geometry/delta-calc.mjs
var Mo = .9999, No = 1.0001, Po = -.01, Fo = .01;
function Io(e) {
	return e.max - e.min;
}
function Lo(e, t, n) {
	return Math.abs(e - t) <= n;
}
function Ro(e, t, n, r = .5) {
	e.origin = r, e.originPoint = K(t.min, t.max, e.origin), e.scale = Io(n) / Io(t), e.translate = K(n.min, n.max, e.origin) - e.originPoint, (e.scale >= Mo && e.scale <= No || isNaN(e.scale)) && (e.scale = 1), (e.translate >= Po && e.translate <= Fo || isNaN(e.translate)) && (e.translate = 0);
}
function zo(e, t, n, r) {
	Ro(e.x, t.x, n.x, r?.originX), Ro(e.y, t.y, n.y, r?.originY);
}
function Bo(e, t, n, r = 0) {
	e.min = (r ? K(n.min, n.max, r) : n.min) + t.min, e.max = e.min + Io(t);
}
function Vo(e, t, n, r) {
	Bo(e.x, t.x, n.x, r?.x), Bo(e.y, t.y, n.y, r?.y);
}
function Ho(e, t, n, r = 0) {
	let i = r ? K(n.min, n.max, r) : n.min;
	e.min = t.min - i, e.max = e.min + Io(t);
}
function Uo(e, t, n, r) {
	Ho(e.x, t.x, n.x, r?.x), Ho(e.y, t.y, n.y, r?.y);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/geometry/delta-remove.mjs
function Wo(e, t, n, r, i) {
	return e -= t, e = Ya(e, 1 / n, r), i !== void 0 && (e = Ya(e, 1 / i, r)), e;
}
function Go(e, t = 0, n = 1, r = .5, i, a = e, o = e) {
	if (Pe.test(t) && (t = parseFloat(t), t = K(o.min, o.max, t / 100) - o.min), typeof t != "number") return;
	let s = K(a.min, a.max, r);
	e === a && (s -= t), e.min = Wo(e.min, t, n, s, i), e.max = Wo(e.max, t, n, s, i);
}
function Ko(e, t, [n, r, i], a, o) {
	Go(e, t[n], t[r], t[i], t.scale, a, o);
}
var qo = [
	"x",
	"scaleX",
	"originX"
], Jo = [
	"y",
	"scaleY",
	"originY"
];
function Yo(e, t, n, r) {
	Ko(e.x, t, qo, n?.x, r?.x), Ko(e.y, t, Jo, n?.y, r?.y);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/geometry/round.mjs
var Xo = (e) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e), Zo = Xo("applewebkit/") && !Xo("chrome/") ? Math.round : E;
function Qo(e) {
	e.min = Zo(e.min), e.max = Zo(e.max);
}
function $o(e) {
	Qo(e.x), Qo(e.y);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/geometry/models.mjs
var es = () => ({
	translate: 0,
	scale: 1,
	origin: 0,
	originPoint: 0
}), ts = () => ({
	x: es(),
	y: es()
}), ns = () => ({
	min: 0,
	max: 0
}), rs = () => ({
	x: ns(),
	y: ns()
});
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/geometry/utils.mjs
function is(e) {
	return e.translate === 0 && e.scale === 1;
}
function as(e) {
	return is(e.x) && is(e.y);
}
function os(e, t) {
	return e.min === t.min && e.max === t.max;
}
function ss(e, t) {
	return os(e.x, t.x) && os(e.y, t.y);
}
function cs(e, t) {
	return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
}
function ls(e, t) {
	return cs(e.x, t.x) && cs(e.y, t.y);
}
function us(e) {
	return Io(e.x) / Io(e.y);
}
function ds(e, t) {
	return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/shared/stack.mjs
var fs = class {
	constructor() {
		this.members = [];
	}
	add(e) {
		v(this.members, e);
		for (let t = this.members.length - 1; t >= 0; t--) {
			let n = this.members[t];
			if (n === e || n === this.lead || n === this.prevLead) continue;
			let r = n.instance;
			r && r.isConnected !== !1 || n.snapshot || (y(this.members, n), n.unmount());
		}
		e.scheduleRender();
	}
	remove(e) {
		if (y(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
			let e = this.members[this.members.length - 1];
			e && this.promote(e);
		}
	}
	relegate(e) {
		for (let t = this.members.indexOf(e) - 1; t >= 0; t--) {
			let e = this.members[t];
			if (e.isPresent !== !1 && e.instance?.isConnected !== !1) return this.promote(e), !0;
		}
		return !1;
	}
	promote(e, t) {
		let n = this.lead;
		if (e !== n && (this.prevLead = n, this.lead = e, e.show(), n)) {
			n.updateSnapshot(), e.scheduleRender();
			let { layoutDependency: r } = n.options, { layoutDependency: i } = e.options;
			(r === void 0 || r !== i) && (e.resumeFrom = n, t && (n.preserveOpacity = !0), n.snapshot && (e.snapshot = n.snapshot, e.snapshot.latestValues = n.animationValues || n.latestValues), e.root?.isUpdating && (e.isLayoutDirty = !0)), e.options.crossfade === !1 && n.hide();
		}
	}
	exitAnimationComplete() {
		this.members.forEach((e) => {
			e.options.onExitComplete?.(), e.resumingFrom?.options.onExitComplete?.();
		});
	}
	scheduleRender() {
		this.members.forEach((e) => e.instance && e.scheduleRender(!1));
	}
	removeLeadSnapshot() {
		this.lead?.snapshot && (this.lead.snapshot = void 0);
	}
};
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/styles/scale-border-radius.mjs
function ps(e, t) {
	return t.max === t.min ? 0 : e / (t.max - t.min) * 100;
}
var ms = { correct: (e, t) => {
	if (!t.target) return e;
	if (typeof e == "string") {
		if (G.test(e)) e = parseFloat(e);
		else return e;
	}
	return `${ps(e, t.target.x)}% ${ps(e, t.target.y)}%`;
} }, hs = {
	borderRadius: /* @__PURE__ */ Object.assign({}, ms, { applyTo: /* @__PURE__ */ Ta.slice() }),
	borderTopLeftRadius: ms,
	borderTopRightRadius: ms,
	borderBottomLeftRadius: ms,
	borderBottomRightRadius: ms,
	boxShadow: { correct: (e, { treeScale: t, projectionDelta: n }) => {
		let r = e, i = it.parse(e);
		if (i.length > 5) return r;
		let a = it.createTransformer(e), o = typeof i[0] == "number" ? 0 : 1, s = n.x.scale * t.x, c = n.y.scale * t.y;
		i[0 + o] /= s, i[1 + o] /= c;
		let l = K(s, c, .5);
		return typeof i[2 + o] == "number" && (i[2 + o] /= l), typeof i[3 + o] == "number" && (i[3 + o] /= l), a(i);
	} }
};
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/styles/transform.mjs
function gs(e, t, n) {
	let r = "", i = e.x.translate / t.x, a = e.y.translate / t.y, o = n?.z || 0;
	(i || a || o) && (r = `translate3d(${i}px, ${a}px, ${o}px) `);
	let s = "";
	if (n) {
		let { transformPerspective: e } = n;
		e && (r = `perspective(${e}px) ${r}`);
		for (let e = 0; e < Wa.length; e++) {
			let t = Wa[e], r = n[t];
			r && (s += `${t}(${r}deg) `), !e && n.pathRotation && (s += `rotate(${n.pathRotation}deg) `);
		}
	}
	if (s) {
		(t.x !== 1 || t.y !== 1) && (r += `scale(${1 / t.x}, ${1 / t.y}) `), r += s;
		let n = e.x.scale * t.x, i = e.y.scale * t.y;
		(n !== 1 || i !== 1) && (r += `scale(${n}, ${i})`);
	} else e.x.scale !== 1 || e.y.scale !== 1 ? r += `scale(${e.x.scale}, ${e.y.scale})` : r || t.x === 1 && t.y === 1 || (r = "scale(1, 1)");
	return r || "none";
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/utils/each-axis.mjs
function _s(e) {
	return [e("x"), e("y")];
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/utils/compare-by-depth.mjs
var vs = (e, t) => e.depth - t.depth, ys = class {
	constructor() {
		this.children = [], this.isDirty = !1;
	}
	add(e) {
		v(this.children, e), this.isDirty = !0;
	}
	remove(e) {
		y(this.children, e), this.isDirty = !0;
	}
	forEach(e) {
		this.isDirty && this.children.sort(vs), this.isDirty = !1, this.children.forEach(e);
	}
}, bs = {
	hasAnimatedSinceResize: !0,
	hasEverUpdated: !1
}, xs = [
	"z",
	"skew",
	"skewZ"
], Ss = 1e3, Cs = 0;
function ws(e, t, n, r) {
	let { latestValues: i } = t;
	i[e] && (n[e] = i[e], t.setStaticValue(e, 0), r && (r[e] = 0));
}
var Ts = (e) => e.instance && ai.get(e.instance)?.demote() && e.resetSkewAndRotation();
function Es(e) {
	if (e.hasCheckedOptimisedAppear = !0, e.root === e) return;
	let { visualElement: t } = e.options;
	if (!t) return;
	let n = da(t);
	if (window.MotionHasOptimisedAnimation(n, "transform")) {
		let { layout: t, layoutId: r } = e.options;
		window.MotionCancelOptimisedAnimation(n, "transform", Ot, !(t || r));
	}
	let { parent: r } = e;
	r && !r.hasCheckedOptimisedAppear && Es(r);
}
function Ds(e) {
	if (e) return e.options.allowProjection === !1 ? Ds(e.parent) : e.projection;
}
function Os({ attachResizeListener: e, defaultParent: t, measureScroll: n, checkIsScrollRoot: r, resetTransform: i }) {
	return Object.assign(po, {
		...hs,
		...po
	}), class {
		static create(e, t, n) {
			let { layoutId: r, layout: i, drag: a, dragConstraints: o, layoutScroll: s, layoutRoot: c, layoutAnchor: l, layoutCrossfade: u } = t, d = e.projection = new this(e.latestValues, t["data-framer-portal-id"] ? void 0 : Ds(e.parent));
			d.setOptions({
				layoutId: r,
				layout: i,
				alwaysMeasureLayout: !!a || o && go(o),
				visualElement: e,
				animationType: typeof i == "string" ? i : "both",
				initialPromotionConfig: n,
				crossfade: u,
				layoutScroll: s,
				layoutRoot: c,
				layoutAnchor: l
			});
			let f = d.getStack()?.lead;
			f && !d.root.isUpdateBlocked() && (f.willUpdate(), f.scheduleCheckAfterUnmount());
		}
		constructor(e = {}, n = t?.()) {
			this.id = Cs++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = {
				x: 1,
				y: 1
			}, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
				this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
			}, this.updateProjection = () => {
				this.projectionUpdateScheduled = !1, this.nodes.forEach(js), this.nodes.forEach(Hs), this.nodes.forEach(Us), this.nodes.forEach(Ms), mo.countProjection?.();
			}, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = e, this.root = n ? n.root || n : this, this.path = n ? [...n.path, n] : [], this.parent = n, this.depth = n ? n.depth + 1 : 0;
			for (let e = 0; e < this.path.length; e++) this.path[e].shouldResetTransform = !0;
			this.root === this && (this.nodes = new ys());
		}
		addEventListener(e, t) {
			return this.eventHandlers.has(e) || this.eventHandlers.set(e, new k()), this.eventHandlers.get(e).add(t);
		}
		notifyListeners(e, ...t) {
			this.eventHandlers.get(e)?.notify(...t);
		}
		hasListeners(e) {
			return this.eventHandlers.has(e);
		}
		mount(t) {
			if (this.instance) return;
			this.isSVG = Da(t) && !_o(t), this.instance = t;
			let { layoutId: n, layout: r, visualElement: i } = this.options;
			if (i && !i.current && i.mount(t), this.root.nodes.add(this), this.parent?.children.add(this), this.root.hasTreeAnimated && (r || n) && (this.isLayoutDirty = !0), e) {
				let n, r = 0, i = () => this.root.updateBlockedByResize = !1;
				Ot.read(() => {
					r = window.innerWidth;
				}), e(t, () => {
					let e = window.innerWidth;
					e !== r && (r = e, this.root.updateBlockedByResize = !0, n?.(), n = ho(i, 250), bs.hasAnimatedSinceResize && (bs.hasAnimatedSinceResize = !1, this.nodes.forEach(Vs)));
				});
			}
			n && this.root.registerSharedNode(n, this), this.addLayoutListener();
		}
		addLayoutListener() {
			let { layoutId: e, layout: t, visualElement: n, animate: r } = this.options;
			this.instance && !this.hasLayoutListener && r !== !1 && n && (e || t) && (this.hasLayoutListener = !0, this.addEventListener("didUpdate", ({ delta: e, hasLayoutChanged: t, hasRelativeLayoutChanged: r, layout: i }) => {
				if (this.isAnimationBlocked) {
					this.target = void 0, this.relativeTarget = void 0;
					return;
				}
				let a = this.options.transition || n.getDefaultTransition() || Xs, { onLayoutAnimationStart: o, onLayoutAnimationComplete: s } = n.getProps(), c = !this.targetLayout || !ls(this.targetLayout, i), l = !t && r;
				if (this.options.layoutRoot || this.resumeFrom || l || t && (c || !this.currentAnimation)) {
					this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
					let t = {
						...Bi(a, "layout"),
						onPlay: o,
						onComplete: s
					};
					(n.shouldReduceMotion || this.options.layoutRoot) && (t.delay = 0, t.type = !1), this.startAnimation(t), this.setAnimationOrigin(e, l, t.path);
				} else t || Vs(this), this.isLead() && this.options.onExitComplete?.();
				this.targetLayout = i;
			}));
		}
		unmount() {
			this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this), this.getStack()?.remove(this), this.parent?.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), this.hasLayoutListener = !1, kt(this.updateProjection);
		}
		blockUpdate() {
			this.updateManuallyBlocked = !0;
		}
		unblockUpdate() {
			this.updateManuallyBlocked = !1;
		}
		isUpdateBlocked() {
			return this.updateManuallyBlocked || this.updateBlockedByResize;
		}
		startUpdate() {
			this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes?.forEach(Ws), this.animationId++);
		}
		getTransformTemplate() {
			let { visualElement: e } = this.options;
			return e && e.getProps().transformTemplate;
		}
		willUpdate(e = !0) {
			if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
				this.options.onExitComplete?.();
				return;
			}
			if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Es(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty) return;
			Ts(this), this.isLayoutDirty = !0;
			for (let e = 0; e < this.path.length; e++) {
				let t = this.path[e];
				t.shouldResetTransform = !0, Ts(t), (typeof t.latestValues.x == "string" || typeof t.latestValues.y == "string") && (t.isLayoutDirty = !0), t.updateScroll("snapshot"), t.options.layoutRoot && t.willUpdate(!1), t.isAnimationBlocked && (t.dragSnapshot ||= t.measure(), this.dragAncestor = t);
			}
			let { layoutId: t, layout: n } = this.options;
			if (t === void 0 && !n) return;
			let r = this.getTransformTemplate();
			this.prevTransformTemplateValue = r ? r(this.latestValues, "") : void 0, this.updateSnapshot(), e && this.notifyListeners("willUpdate");
		}
		update() {
			if (this.updateScheduled = !1, this.isUpdateBlocked()) {
				let e = this.updateBlockedByResize;
				this.unblockUpdate(), this.updateBlockedByResize = !1, this.clearAllSnapshots(), e && this.nodes.forEach(Fs), this.nodes.forEach(Ps);
				return;
			}
			if (this.animationId <= this.animationCommitId) {
				this.nodes.forEach(Is);
				return;
			}
			this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(Rs), this.nodes.forEach(zs), this.nodes.forEach(Bs), this.nodes.forEach(ks), this.nodes.forEach(As)) : this.nodes.forEach(Is), this.clearAllSnapshots();
			let e = U.now();
			le.delta = b(0, 1e3 / 60, e - le.timestamp), le.timestamp = e, le.isProcessing = !0, At.update.process(le), At.preRender.process(le), At.render.process(le), le.isProcessing = !1;
		}
		didUpdate() {
			this.updateScheduled || (this.updateScheduled = !0, lo.read(this.scheduleUpdate));
		}
		clearAllSnapshots() {
			this.nodes.forEach(Ns), this.sharedNodes.forEach((e, t) => e.members.length ? e.removeLeadSnapshot() : this.sharedNodes.delete(t));
		}
		scheduleUpdateProjection() {
			this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, Ot.preRender(this.updateProjection, !1, !0));
		}
		scheduleCheckAfterUnmount() {
			Ot.postRender(() => {
				this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
			});
		}
		updateSnapshot() {
			if (!this.snapshot && this.instance && (this.snapshot = this.measure(), this.snapshot && !Io(this.snapshot.measuredBox.x) && !Io(this.snapshot.measuredBox.y) && (this.snapshot = void 0), this.snapshot)) {
				let { visualElement: e } = this.options, t = this.currentAnimation?.state === "running", n = t && this.animationEdges;
				t && this.relativeTarget && (this.snapshot.relativeVelocity = this.relativeVelocity?.slice() || []);
				let r = n && this.motionValue?.getVelocity() || 0, i = [
					0,
					1,
					2,
					3,
					4,
					5
				].map((t) => (t < 4 ? n && (this.edgeValues ? this.edgeVelocity(t) : -n[t] * r / 1e3) : e?.getValue(t < 5 ? "x" : "y")?.getVelocity()) || 0);
				i.some(Boolean) && (this.snapshot.velocity = i);
			}
		}
		updateLayout() {
			if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)) return;
			if (this.resumeFrom && !this.resumeFrom.instance) for (let e = 0; e < this.path.length; e++) this.path[e].updateScroll();
			let e = this.layout;
			this.layout = this.measure(!1), this.layoutCorrected ||= rs(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
			let { visualElement: t } = this.options;
			t?.notify("LayoutMeasure", this.layout.layoutBox, e?.layoutBox);
		}
		updateScroll(e = "measure") {
			let { scroll: t, instance: i } = this, { animationId: a } = this.root;
			if (this.options.layoutScroll && i && !(t && t.animationId === a && t.phase === e)) {
				let o = r(i);
				this.scroll = {
					animationId: a,
					phase: e,
					isRoot: o,
					offset: n(i),
					wasRoot: t ? t.isRoot : o
				};
			}
		}
		resetTransform() {
			if (!i) return;
			let e = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout;
			e && Ts(this);
			let t = this.projectionDelta && !as(this.projectionDelta), n = this.getTransformTemplate(), r = n ? n(this.latestValues, "") : void 0, a = r !== this.prevTransformTemplateValue;
			e && this.instance && (t || Ga(this.latestValues) || a) && (i(this.instance, r), this.shouldResetTransform = !1, this.scheduleRender());
		}
		measure(e = !0) {
			let t = this.measurePageBox(), n = this.removeElementScroll(t);
			return e && (n = this.removeTransform(n)), $o(n), {
				animationId: this.root.animationId,
				measuredBox: t,
				layoutBox: n,
				latestValues: {},
				source: this.id
			};
		}
		measurePageBox() {
			let { visualElement: e } = this.options;
			if (!e) return rs();
			let t = e.measureViewportBox();
			if (!(this.scroll?.wasRoot || this.path.some($s))) {
				let { scroll: e } = this.root;
				e && (no(t.x, e.offset.x), no(t.y, e.offset.y));
			}
			return t;
		}
		removeElementScroll(e) {
			let t = rs();
			if (Ao(t, e), this.scroll?.wasRoot) return t;
			for (let n = 0; n < this.path.length; n++) {
				let r = this.path[n], { scroll: i, options: a } = r;
				r !== this.root && i && a.layoutScroll && (i.wasRoot && Ao(t, e), no(t.x, i.offset.x), no(t.y, i.offset.y));
			}
			return t;
		}
		applyTransform(e, t = !1, n, r, i = 0) {
			let a = n || rs();
			Ao(a, e);
			for (let e = i; e < this.path.length; e++) {
				let n = this.path[e];
				!t && n.options.layoutScroll && n.scroll && n !== n.root && (no(a.x, -n.scroll.offset.x), no(a.y, -n.scroll.offset.y)), Ga(n.latestValues) && ao(a, n.latestValues, n.layout?.layoutBox);
			}
			return !r && Ga(this.latestValues) && ao(a, this.latestValues, this.layout?.layoutBox), a;
		}
		removeTransform(e) {
			let t = rs();
			Ao(t, e);
			for (let e = 0; e < this.path.length; e++) {
				let n = this.path[e];
				if (!Ga(n.latestValues)) continue;
				let r;
				n.instance && (Ua(n.latestValues) && n.updateSnapshot(), r = rs(), Ao(r, n.measurePageBox())), Yo(t, n.latestValues, n.snapshot?.layoutBox, r);
			}
			return Ga(this.latestValues) && Yo(t, this.latestValues), t;
		}
		setTargetDelta(e) {
			this.targetDelta = e, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
		}
		setOptions(e) {
			this.options = {
				...this.options,
				...e,
				crossfade: e.crossfade === void 0 || e.crossfade
			}, this.addLayoutListener();
		}
		clearMeasurements() {
			this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
		}
		forceRelativeParentToResolveTarget() {
			this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== le.timestamp && this.relativeParent.resolveTargetDelta(!0);
		}
		resolveTargetDelta(e = !1) {
			let t = this.getLead();
			this.isProjectionDirty ||= t.isProjectionDirty, this.isTransformDirty ||= t.isTransformDirty, this.isSharedProjectionDirty ||= t.isSharedProjectionDirty;
			let n = !!this.resumingFrom || this !== t;
			if (!(e || n && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize)) return;
			let { layout: r, layoutId: i } = this.options;
			if (!this.layout || !(r || i)) return;
			this.resolvedRelativeTargetAt = le.timestamp;
			let a = this.getClosestProjectingParent();
			!this.targetDelta && !this.relativeTarget && (this.options.layoutAnchor !== !1 && a && a.layout ? this.createRelativeTarget(a, this.layout.layoutBox, a.layout.layoutBox) : this.removeRelativeTarget()), (this.relativeTarget || this.targetDelta) && (this.target || (this.target = rs(), this.targetWithTransforms = rs()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), Vo(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0)) : this.targetDelta ? (this.resumingFrom ? this.applyTransform(this.layout.layoutBox, !1, this.target, !0) : Ao(this.target, this.layout.layoutBox), Qa(this.target, this.targetDelta)) : Ao(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = !1, this.options.layoutAnchor !== !1 && a && (!a.resumingFrom == !this.resumingFrom || a.options.layoutRoot && !a.resumingFrom) && !a.options.layoutScroll && a.target && this.animationProgress !== 1 ? this.createRelativeTarget(a, this.target, a.target) : this.relativeParent = this.relativeTarget = void 0), mo.countProjection?.(1));
		}
		getClosestProjectingParent() {
			if (!(!this.parent || Ua(this.parent.latestValues) || qa(this.parent.latestValues))) return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
		}
		isProjecting() {
			return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
		}
		createRelativeTarget(e, t, n) {
			this.relativeParent = e, this.forceRelativeParentToResolveTarget(), this.relativeTarget = rs(), this.relativeTargetOrigin = rs(), Uo(this.relativeTargetOrigin, t, n, this.options.layoutAnchor || void 0), Ao(this.relativeTarget, this.relativeTargetOrigin);
		}
		removeRelativeTarget() {
			this.relativeParent = this.relativeTarget = void 0;
		}
		calcProjection() {
			let e = this.getLead(), t = !!this.resumingFrom || this !== e, n = !0;
			if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (n = !1), t && (this.isSharedProjectionDirty || this.isTransformDirty) && (n = !1), this.resolvedRelativeTargetAt === le.timestamp && (n = !1), n) return;
			let { layout: r, layoutId: i } = this.options;
			if (this.isTreeAnimating = !!(this.parent?.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(r || i)) return;
			Ao(this.layoutCorrected, this.layout.layoutBox);
			let a = this.treeScale.x, o = this.treeScale.y;
			to(this.layoutCorrected, this.treeScale, this.path, t && (e.relativeTarget && !e.relativeParent.resumingFrom ? e.relativeParent : !0)), e.layout && !e.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (e.target = e.layout.layoutBox, e.targetWithTransforms = rs());
			let { target: s } = e;
			s ? (!this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (jo(this.prevProjectionDelta.x, this.projectionDelta.x), jo(this.prevProjectionDelta.y, this.projectionDelta.y)), zo(this.projectionDelta, this.layoutCorrected, s, this.latestValues), this.treeScale.x === a && this.treeScale.y === o && ds(this.projectionDelta.x, this.prevProjectionDelta.x) && ds(this.projectionDelta.y, this.prevProjectionDelta.y) || (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", s)), mo.countProjection?.(2)) : this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
		}
		hide() {
			this.isVisible = !1;
		}
		show() {
			this.isVisible = !0;
		}
		scheduleRender(e = !0) {
			this.options.visualElement?.scheduleRender(), e && this.getStack()?.scheduleRender(), this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
		}
		createProjectionDeltas() {
			this.prevProjectionDelta = ts(), this.projectionDelta = ts(), this.projectionDeltaWithTransform = ts();
		}
		setAnimationOrigin(e, t = !1, n) {
			let r = this.snapshot, i = r ? r.latestValues : {}, a = { ...this.latestValues }, o = ts();
			this.relativeParent && this.relativeParent.options.layoutRoot || (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !t;
			let s = rs(), c = r?.source !== this.layout?.source, l = this.getStack(), u = !l || l.members.length <= 1, d = !(!c || u || this.options.crossfade !== !0 || this.path.some(Ys));
			this.animationProgress = 0;
			let f, p = n?.interpolateProjection(e), m = this.layout?.layoutBox, h = m && [
				m.x.min,
				m.x.max,
				m.y.min,
				m.y.max
			].map((t, n) => {
				let { translate: r, scale: i, originPoint: a } = e[n < 2 ? "x" : "y"];
				return (t - a) * (i - 1) + r;
			});
			h?.every(isFinite) || (h = void 0), this.animationEdges = h, this.edgeValues = this.startVelocity = this.impulse = this.relativeVelocity = this.relativeStart = void 0;
			let g = r?.velocity, _ = r?.relativeVelocity || g;
			if (_?.slice(0, 4).some(Boolean) && this.getClosestProjectingParent() && (this.relativeStart = _), g && h) {
				let t = g.slice(0, 4).map((e, t) => e + (c ? g[4 + (t >> 1)] : 0));
				t.some(Boolean) && (this.startVelocity = p ? Do(e.x.translate, e.y.translate, {
					x: (t[0] + t[1]) / 2,
					y: (t[2] + t[3]) / 2
				}) : t);
			}
			this.mixTargetDelta = (t) => {
				let n = t / 1e3, r = p?.(n), l = this.edgeValues;
				for (let t = 0; t < 2; t++) {
					let r = t ? "y" : "x";
					l ? Gs(o[r], e[r], this.layout.layoutBox[r], l[t * 2], l[t * 2 + 1]) : Ks(o[r], e[r], n);
				}
				if (r && (o.x.translate = r.x, o.y.translate = r.y), this.setTargetDelta(o), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout) {
					Uo(s, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0);
					let e = this.relativeTargetOrigin, t = s;
					if (Js(this.relativeTarget, e, t, n), this.isSpringLayout) {
						let e = this.relativeTarget, t = this.impulse || 0, n = this.relativeStart, r = U.now(), i = (r - this.relativeTime) / 1e3;
						this.relativeTime = r;
						let a = this.relativeVelocity ||= [
							0,
							0,
							0,
							0
						];
						for (let r = 0; r < 4; r++) {
							let o = r < 2 ? "x" : "y", s = r & 1 ? "max" : "min";
							n && (e[o][s] += n[r] * t), f && i > 0 && (a[r] = (e[o][s] - f[o][s]) / i);
						}
					}
					f && ss(this.relativeTarget, f) && (this.isProjectionDirty = !1), f ||= rs(), Ao(f, this.relativeTarget);
				}
				c && (this.animationValues = a, So(a, i, this.latestValues, n, d, u)), r?.rotate !== void 0 && (this.animationValues ||= a, this.animationValues.pathRotation = r.rotate), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = n;
			}, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
		}
		startAnimation(e) {
			this.notifyListeners("animationStart");
			let t = this.isSpringLayout = e.type === "spring";
			this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.resumingFrom && (this.resumingFrom.edgeValues = void 0), this.pendingAnimation &&= (kt(this.pendingAnimation), void 0), this.pendingAnimation = Ot.update(() => {
				bs.hasAnimatedSinceResize = !0, this.motionValue ||= Ri(0), this.motionValue.jump(0, !1);
				let n = this.startVelocity;
				this.startVelocity = void 0;
				let r = e, i = 0;
				if (t) {
					if (e.mass === "auto") {
						let t = this.layout?.layoutBox;
						r = Oo(e, t && Math.sqrt(Io(t.x) * Io(t.y)));
					}
					let t = this.relativeStart;
					if ((n || t) && !e.repeat) {
						if (typeof n == "number") i = n;
						else {
							let e = n && this.animationEdges;
							r = {
								...r,
								type: (r) => {
									let i = [r.velocity, ...n || []].map((t, n) => sn({
										...r,
										keyframes: n ? [e[n - 1], 0] : r.keyframes,
										velocity: t
									})), a = i.length;
									t && i.push(sn({
										...r,
										keyframes: [0, 0],
										velocity: 1e3,
										restDelta: .5,
										restSpeed: 5
									}));
									let o = 0, s = [], c = {
										calculatedDuration: null,
										next: (t) => {
											o = t;
											let n = i[0].next(t), r = n.done;
											for (let e = 1; e < i.length; e++) {
												let { value: n, done: o } = i[e].next(t);
												e < a ? s[e - 1] = n : this.impulse = n / 1e3, r &&= o;
											}
											return e && (this.edgeValues = s), n.done = r, n;
										}
									};
									return c.calculatedDuration = Pt(c), c.next(0), this.edgeVelocity = (e) => i[e + 1].velocity(o), c;
								}
							};
						}
					}
				}
				let a = fo(this.motionValue, [0, 1e3], {
					...r,
					velocity: i,
					isSync: !0,
					onUpdate: (t) => {
						this.mixTargetDelta(t), e.onUpdate && e.onUpdate(t);
					},
					onComplete: () => {
						e.onComplete && e.onComplete(), this.completeAnimation();
					}
				});
				this.currentAnimation = a, En(this.currentAnimation, this), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
			});
		}
		completeAnimation() {
			this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
			let e = this.getStack();
			e && e.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = this.edgeValues = this.edgeVelocity = this.impulse = void 0, this.notifyListeners("animationComplete");
		}
		finishAnimation() {
			this.currentAnimation && (this.edgeValues = this.impulse = void 0, this.mixTargetDelta?.(Ss), this.currentAnimation.stop()), this.completeAnimation();
		}
		applyTransformsToTarget() {
			let e = this.getLead(), { targetWithTransforms: t, layout: n, latestValues: r } = e, { target: i } = e;
			if (t && i && n) {
				if (this !== e && this.layout && n && Qs(this.options.animationType, this.layout.layoutBox, n.layoutBox)) {
					let { layoutBox: e } = this.layout, t = i;
					i = this.target || rs(), Zs(i.x, t.x, e.x), Zs(i.y, t.y, e.y);
				}
				Ao(t, i), ao(t, r), zo(this.projectionDeltaWithTransform, this.layoutCorrected, t, r);
			}
		}
		registerSharedNode(e, t) {
			this.sharedNodes.has(e) || this.sharedNodes.set(e, new fs()), this.sharedNodes.get(e).add(t);
			let n = t.options.initialPromotionConfig;
			t.promote({
				transition: n?.transition,
				preserveFollowOpacity: n?.shouldPreserveFollowOpacity ? n.shouldPreserveFollowOpacity(t) : void 0
			});
		}
		isLead() {
			let e = this.getStack();
			return !e || e.lead === this;
		}
		getLead() {
			let { layoutId: e } = this.options;
			return e && this.getStack()?.lead || this;
		}
		getPrevLead() {
			let { layoutId: e } = this.options;
			return e ? this.getStack()?.prevLead : void 0;
		}
		getStack() {
			let { layoutId: e } = this.options;
			if (e) return this.root.sharedNodes.get(e);
		}
		promote({ needsReset: e, transition: t, preserveFollowOpacity: n } = {}) {
			this.getStack()?.promote(this, n), e && (this.projectionDelta = void 0, this.needsReset = !0), t && this.setOptions({ transition: t });
		}
		relegate() {
			return this.getStack()?.relegate(this) || !1;
		}
		resetSkewAndRotation() {
			let { visualElement: e } = this.options;
			if (!e) return;
			let { latestValues: t } = e;
			if (!Ka(t)) return;
			let n = {};
			for (let t = 0; t < xs.length; t++) ws(xs[t], e, n, this.animationValues);
			for (let t = 0; t < Wa.length; t++) ws(Wa[t], e, n, this.animationValues);
			e.render();
			for (let t in n) e.setStaticValue(t, n[t]), this.animationValues && (this.animationValues[t] = n[t]);
			e.scheduleRender();
		}
		applyProjectionStyles(e, t) {
			if (!this.instance || this.isSVG) return;
			let n = this.getLead();
			if (!this.isVisible && n !== this) {
				e.visibility = "hidden";
				return;
			}
			let r = this.getTransformTemplate();
			if (this.needsReset) {
				this.needsReset = !1, e.visibility = "", e.opacity = "", e.pointerEvents = vo(t?.pointerEvents) || "", e.transform = r ? r(this.latestValues, "") : "none";
				return;
			}
			if (!this.projectionDelta || !this.layout || !n.target) {
				(this.options.layoutId || this.needsShow) && (this.needsShow = !1, e.visibility = "", e.opacity = this.latestValues.opacity === void 0 ? 1 : this.latestValues.opacity, e.pointerEvents = vo(t?.pointerEvents) || ""), this.hasProjected && !Ga(this.latestValues) && (e.transform = r ? r({}, "") : "none", this.hasProjected = !1);
				return;
			}
			e.visibility = "";
			let i = n.animationValues || n.latestValues;
			this.applyTransformsToTarget();
			let a = gs(this.projectionDeltaWithTransform, this.treeScale, i);
			r && (a = r(i, a)), e.transform = a;
			let { x: o, y: s } = this.projectionDelta;
			e.transformOrigin = `${o.origin * 100}% ${s.origin * 100}% 0`, e.opacity = n.animationValues ? n === this ? i.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : i.opacityExit : n === this ? i.opacity === void 0 ? "" : i.opacity : i.opacityExit === void 0 ? 0 : i.opacityExit;
			for (let t in po) {
				if (i[t] === void 0) continue;
				let { correct: r, applyTo: o, isCSSVariable: s } = po[t], c = a === "none" ? i[t] : r(i[t], n);
				if (o) {
					let t = o.length;
					for (let n = 0; n < t; n++) e[o[n]] = c;
				} else s ? this.options.visualElement.renderState.vars[t] = c : e[t] = c;
			}
			this.options.layoutId && (e.pointerEvents = n === this ? vo(t?.pointerEvents) || "" : "none");
		}
		clearSnapshot() {
			this.resumeFrom = this.snapshot = this.dragSnapshot = this.dragAncestor = void 0;
		}
		resetTree() {
			this.root.nodes.forEach((e) => e.currentAnimation?.stop()), this.root.nodes.forEach(Ps), this.root.sharedNodes.clear();
		}
	};
}
function ks(e) {
	e.updateLayout(), Ls(e);
}
function As(e) {
	let t = e.resumeFrom?.snapshot || e.snapshot;
	if (e.isLead() && e.layout && t && e.hasListeners("didUpdate")) {
		let { layoutBox: n, measuredBox: r } = e.layout, { animationType: i } = e.options, a = t.source !== e.layout.source, o = (r, a) => {
			if (i === "size") _s((e) => {
				let t = Io(r[e]);
				r[e].min = a[e].min, r[e].max = r[e].min + t;
			});
			else if (i === "x" || i === "y") {
				let e = i === "x" ? "y" : "x";
				ko(r[e], a[e]);
			} else Qs(i, t.layoutBox, n) && _s((t) => {
				let n = Io(a[t]);
				r[t].max = r[t].min + n, e.relativeTarget && !e.currentAnimation && (e.isProjectionDirty = !0, e.relativeTarget[t].max = e.relativeTarget[t].min + n);
			});
		}, s = a ? t.measuredBox : t.layoutBox;
		o(s, n);
		let c = ts();
		zo(c, n, t.layoutBox);
		let l = ts();
		zo(l, a ? e.applyTransform(r, !0) : n, s);
		let u = !as(c), d = !1, f = e.getClosestProjectingParent();
		if ((!a || f?.options.layoutRoot && e.resumeFrom?.path.includes(f)) && f && !f.resumeFrom) {
			let { snapshot: r, layout: i } = f;
			if (r && i) {
				let s = e.options.layoutAnchor || void 0, c = rs();
				Uo(c, a ? e.resumeFrom.applyTransform(t.layoutBox, !0, void 0, !0, f.depth + 1) : t.layoutBox, r.layoutBox, s);
				let l = rs();
				Uo(l, n, i.layoutBox, s), a && o(c, l), ls(c, l) || (d = !0), f.options.layoutRoot && (e.relativeTarget = l, e.relativeTargetOrigin = c, e.relativeParent = f);
			}
		}
		e.notifyListeners("didUpdate", {
			layout: n,
			snapshot: t,
			delta: l,
			layoutDelta: c,
			hasLayoutChanged: u,
			hasRelativeLayoutChanged: d
		});
	} else e.isLead() && e.options.onExitComplete?.();
	e.options.transition = void 0;
}
function js(e) {
	mo.countProjection?.(0), e.parent && (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty), e.isSharedProjectionDirty ||= !!(e.isProjectionDirty || e.parent.isProjectionDirty || e.parent.isSharedProjectionDirty), e.isTransformDirty ||= e.parent.isTransformDirty);
}
function Ms(e) {
	e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function Ns(e) {
	e.clearSnapshot();
}
function Ps(e) {
	e.clearMeasurements();
}
function Fs(e) {
	e.isLayoutDirty = !0, e.updateLayout();
}
function Is(e) {
	e.isLayoutDirty = !1;
}
function Ls(e) {
	let { snapshot: t, dragAncestor: n } = e, r = n?.isAnimationBlocked && n.layout;
	if (!t || !r || e.resumeFrom || e.isAnimationBlocked) return;
	let i = n.dragSnapshot;
	_s((e) => no(t.layoutBox[e], r.layoutBox[e].min - i.layoutBox[e].min));
}
function Rs(e) {
	e.isAnimationBlocked && e.layout && !e.isLayoutDirty && (e.snapshot = e.dragSnapshot || e.layout, e.isLayoutDirty = !0);
}
function zs(e) {
	e.relativeTarget && e.relativeParent?.isLayoutDirty && (e.currentAnimation ? e.isLayoutDirty = !0 : (e.targetDelta = void 0, e.removeRelativeTarget()));
}
function Bs(e) {
	let { visualElement: t } = e.options;
	t?.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"), e.resetTransform();
}
function Vs(e) {
	e.finishAnimation(), e.targetDelta = e.relativeTarget = e.target = void 0, e.isProjectionDirty = !0;
}
function Hs(e) {
	e.resolveTargetDelta();
}
function Us(e) {
	e.calcProjection();
}
function Ws(e) {
	e.resetSkewAndRotation();
}
function Gs(e, t, n, r, i) {
	let a = n.max - n.min, o = a ? Math.max(0, (a + i - r) / a) : 1, s = e.originPoint = t.originPoint;
	e.origin = t.origin, e.scale = o, e.translate = n.min + r - (s + (n.min - s) * o);
}
function Ks(e, t, n) {
	e.translate = K(t.translate, 0, n), e.scale = K(t.scale, 1, n), e.origin = t.origin, e.originPoint = t.originPoint;
}
function qs(e, t, n, r) {
	e.min = K(t.min, n.min, r), e.max = K(t.max, n.max, r);
}
function Js(e, t, n, r) {
	qs(e.x, t.x, n.x, r), qs(e.y, t.y, n.y, r);
}
function Ys(e) {
	return e.animationValues?.opacityExit !== void 0;
}
var Xs = {
	duration: .45,
	ease: [
		.4,
		0,
		.1,
		1
	]
};
function Zs(e, t, n) {
	e.max = Io(n) + (e.min = t.min);
}
function Qs(e, t, n) {
	return e === "position" || e === "preserve-aspect" && !Lo(us(t), us(n), .2);
}
function $s(e) {
	return e !== e.root && e.scroll?.wasRoot;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/events/add-dom-event.mjs
function ec(e, t, n, r = { passive: !0 }) {
	return e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/projection/node/DocumentProjectionNode.mjs
var tc = /* @__PURE__ */ Os({
	attachResizeListener: (e, t) => ec(e, "resize", t),
	measureScroll: co,
	checkIsScrollRoot: () => !0
}), nc = { current: void 0 }, rc = /* @__PURE__ */ Os({
	measureScroll: (e) => ({
		x: e.scrollLeft,
		y: e.scrollTop
	}),
	defaultParent: () => {
		if (!nc.current) {
			let e = new tc({});
			e.mount(window), e.setOptions({ layoutScroll: !0 }), nc.current = e;
		}
		return nc.current;
	},
	resetTransform: (e, t) => {
		e.style.transform = t === void 0 ? "none" : t;
	},
	checkIsScrollRoot: (e) => window.getComputedStyle(e).position === "fixed"
}), ic = /* @__PURE__ */ new WeakMap();
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/utils/is-animation-controls.mjs
function ac(e) {
	return typeof e == "object" && !!e && typeof e.start == "function";
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/utils/is-variant-label.mjs
function oc(e) {
	return typeof e == "string" || Array.isArray(e);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/utils/variant-props.mjs
var sc = [
	"animate",
	"whileInView",
	"whileFocus",
	"whileHover",
	"whileTap",
	"whileDrag",
	"whilePinch",
	"exit"
], cc = /* @__PURE__ */ ["initial"].concat(sc);
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/utils/is-controlling-variants.mjs
function lc(e) {
	if (ac(e.animate)) return !0;
	for (let t = 0; t < cc.length; t++) if (oc(e[cc[t]])) return !0;
	return !1;
}
function uc(e) {
	return !!(lc(e) || e.variants);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/utils/motion-values.mjs
function dc(e, t, n) {
	for (let r in t) {
		let i = t[r], a = n[r];
		if (sa(i)) e.addValue(r, i);
		else if (sa(a)) e.addValue(r, Ri(i, { owner: e }));
		else if (a !== i) {
			if (e.hasValue(r)) {
				let t = e.getValue(r);
				t.liveStyle === !0 ? t.jump(i) : t.hasAnimated || t.set(i);
			} else {
				let t = e.getStaticValue(r);
				e.addValue(r, Ri(t === void 0 ? i : t, { owner: e }));
			}
		}
	}
	for (let r in n) t[r] === void 0 && e.removeValue(r);
	return t;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/utils/reduced-motion/state.mjs
var fc = { current: null }, pc = { current: !1 }, mc = typeof window < "u";
function hc() {
	if (pc.current = !0, mc) {
		if (window.matchMedia) {
			let e = window.matchMedia("(prefers-reduced-motion)"), t = () => fc.current = e.matches;
			e.addEventListener("change", t), t();
		} else fc.current = !1;
	}
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/VisualElement.mjs
var gc = [
	"AnimationStart",
	"AnimationComplete",
	"Update",
	"BeforeLayoutMeasure",
	"LayoutMeasure",
	"LayoutAnimationStart",
	"LayoutAnimationComplete"
], _c = {};
function vc(e) {
	_c = e;
}
function yc() {
	return _c;
}
var bc = class {
	scrapeMotionValuesFromProps(e, t, n) {
		return {};
	}
	constructor({ parent: e, props: t, presenceContext: n, reducedMotionConfig: r, skipAnimations: i, blockInitialAnimation: a, visualState: o }, s = {}) {
		this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.shouldSkipAnimations = !1, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Cr, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.hasBeenMounted = !1, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
			this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
		}, this.renderScheduledAt = 0, this.scheduleRender = () => {
			let e = U.now();
			this.renderScheduledAt < e && (this.renderScheduledAt = e, Ot.render(this.render, !1, !0));
		};
		let { latestValues: c, renderState: l } = o;
		this.latestValues = c, this.baseTarget = { ...c }, this.initialValues = t.initial ? { ...c } : {}, this.renderState = l, this.parent = e, this.props = t, this.presenceContext = n, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = r, this.skipAnimationsConfig = i, this.options = s, this.blockInitialAnimation = !!a, this.isControllingVariants = lc(t), this.isVariantNode = uc(t), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
		let { willChange: u, ...d } = this.scrapeMotionValuesFromProps(t, {}, this);
		for (let e in d) {
			let t = d[e];
			c[e] !== void 0 && sa(t) && t.set(c[e]);
		}
	}
	mount(e) {
		let t = this.presenceContext;
		if (this.hasBeenMounted && t?.isPresent !== !1 && !t?.keepValuesOnRemount) for (let e in this.initialValues) this.values.get(e)?.jump(this.initialValues[e]), this.latestValues[e] = this.initialValues[e];
		if (this.current = e, ic.set(e, this), this.projection?.instance || this.projection?.mount(e), this.isVariantNode && !this.isControllingVariants) {
			let e = this;
			do
				e = e.props.inherit !== !1 && e.parent;
			while (e && !e.isVariantNode);
			if (e) {
				let { variantChildren: t } = e;
				t.add(this), this.removeFromVariantTree = () => t.delete(this);
			}
		}
		this.values.forEach((e, t) => this.bindToMotionValue(t, e)), this.reducedMotionConfig === "never" ? this.shouldReduceMotion = !1 : this.reducedMotionConfig === "always" ? this.shouldReduceMotion = !0 : (pc.current || hc(), this.shouldReduceMotion = fc.current), this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1, this.parent?.addChild(this), this.update(this.props, this.presenceContext), this.hasBeenMounted = !0;
	}
	unmount() {
		this.projection?.unmount(), kt(this.notifyUpdate), kt(this.render), this.valueSubscriptions.forEach((e) => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree?.(), this.parent?.removeChild(this);
		for (let e in this.events) this.events[e].clear();
		for (let e in this.features) {
			let t = this.features[e];
			t && (t.unmount(), t.isMounted = !1);
		}
		this.current = null;
	}
	addChild(e) {
		this.children.add(e), (this.enteringChildren ||= /* @__PURE__ */ new Set()).add(e);
	}
	removeChild(e) {
		this.children.delete(e), this.enteringChildren?.delete(e);
	}
	bindToMotionValue(e, t) {
		if (this.valueSubscriptions.get(e)?.(), t.accelerate && Gr.has(e) && this.current instanceof HTMLElement) {
			let { factory: n, keyframes: r, times: i, ease: a, duration: o } = t.accelerate, s = new Ir({
				element: this.current,
				name: e,
				keyframes: r,
				times: i,
				ease: a,
				duration: /* @__PURE__ */ A(o)
			}), c = n(s);
			this.valueSubscriptions.set(e, () => {
				c(), s.cancel();
			});
			return;
		}
		let n = ar.has(e);
		n && this.onBindTransform && this.onBindTransform();
		let r = t.on("change", (t) => {
			this.latestValues[e] = t, this.props.onUpdate && Ot.preRender(this.notifyUpdate), n && (this.projection && (this.projection.isTransformDirty = !0), ai.get(this.current)?.check()), this.scheduleRender();
		}), i;
		typeof window < "u" && window.MotionCheckAppearSync && (i = window.MotionCheckAppearSync(this, e, t)), this.valueSubscriptions.set(e, () => {
			r(), i?.();
		});
	}
	sortNodePosition(e) {
		return !this.current || !e.current || !this.sortInstanceNodePosition || this.type !== e.type ? 0 : this.sortInstanceNodePosition(this.current, e.current);
	}
	updateFeatures() {
		let e = "animation";
		for (e in _c) {
			let t = _c[e];
			if (!t) continue;
			let { isEnabled: n, Feature: r } = t;
			if (!this.features[e] && r && n(this.props) && (this.features[e] = new r(this)), this.features[e]) {
				let t = this.features[e];
				t.isMounted ? t.update() : (t.mount(), t.isMounted = !0);
			}
		}
	}
	triggerBuild() {
		this.build(this.renderState, this.latestValues, this.props);
	}
	measureViewportBox() {
		return this.current ? this.measureInstanceViewportBox(this.current, this.props) : rs();
	}
	getStaticValue(e) {
		return this.latestValues[e];
	}
	setStaticValue(e, t) {
		this.latestValues[e] = t;
	}
	update(e, t) {
		let { transformTemplate: n, onUpdate: r } = this.props;
		(e.transformTemplate || n) && this.scheduleRender(), (e.transformTemplate && !n || e.onUpdate && !r) && ai.get(this.current)?.demote(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = t;
		for (let t = 0; t < gc.length; t++) {
			let n = gc[t];
			this.propEventSubscriptions[n]?.(), delete this.propEventSubscriptions[n];
			let r = e["on" + n];
			r && (this.propEventSubscriptions[n] = this.on(n, r));
		}
		this.prevMotionValues = dc(this, this.scrapeMotionValuesFromProps(e, this.prevProps || {}, this), this.prevMotionValues), this.handleChildMotionValue?.();
	}
	getProps() {
		return this.props;
	}
	getVariant(e) {
		return this.props.variants?.[e];
	}
	getDefaultTransition() {
		return this.props.transition;
	}
	getTransformPagePoint() {
		return this.props.transformPagePoint;
	}
	addValue(e, t) {
		let n = this.values.get(e);
		if (t !== n) {
			n && this.removeValue(e), this.bindToMotionValue(e, t), this.values.set(e, t);
			let r = t.get();
			r !== void 0 && (this.latestValues[e] = r);
		}
	}
	removeValue(e) {
		this.values.delete(e), this.valueSubscriptions.get(e)?.(), this.valueSubscriptions.delete(e), delete this.latestValues[e], this.removeValueFromRenderState(e, this.renderState);
	}
	hasValue(e) {
		return this.values.has(e);
	}
	getValue(e, t) {
		let n = this.props.values?.[e];
		return n || (n = this.values.get(e), n === void 0 && t !== void 0 && (n = Ri(t ?? this.getDefaultValue?.(e), { owner: this }), this.addValue(e, n)), n);
	}
	readValue(e, t) {
		let n = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
		return n != null && (typeof n == "string" && (S(n) || w(n)) ? n = parseFloat(n) : typeof n != "number" && !it.test(n) && it.test(t) && (n = Gn(e, t)), this.setBaseTarget(e, sa(n) ? n.get() : n)), sa(n) ? n.get() : n;
	}
	setBaseTarget(e, t) {
		this.baseTarget[e] = t;
	}
	on(e, t) {
		return (this.events[e] || (this.events[e] = new k())).add(t);
	}
	notify(e, ...t) {
		this.events[e]?.notify(...t);
	}
	scheduleRenderMicrotask() {
		lo.render(this.render);
	}
}, xc = class extends bc {
	constructor() {
		super(...arguments), this.KeyframeResolver = wa;
	}
	sortInstanceNodePosition(e, t) {
		return e.compareDocumentPosition(t) & 2 ? 1 : -1;
	}
	getBaseTargetFromProps(e, t) {
		let n = e.style;
		return n ? n[t] : void 0;
	}
	removeValueFromRenderState(e, { vars: t, style: n }) {
		delete t[e], delete n[e];
	}
	handleChildMotionValue() {
		this.childSubscription && (this.childSubscription(), delete this.childSubscription);
		let { children: e } = this.props;
		sa(e) && (this.childSubscription = e.on("change", (e) => {
			this.current && (this.current.textContent = `${e}`);
		}));
	}
};
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/html/utils/render.mjs
function Sc(e, { style: t, vars: n }, r, i) {
	let a = e.style, o;
	for (o in t) a[o] = t[o];
	for (o in i?.applyProjectionStyles(a, r), n) a.setProperty(o, n[o]);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/utils/is-forced-motion-value.mjs
function Cc(e, { layout: t, layoutId: n }) {
	return ar.has(e) || e.startsWith("origin") || (t || n !== void 0) && (!!po[e] || e === "opacity");
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/html/utils/scrape-motion-values.mjs
function wc(e, t, n) {
	let r = e.style, i = t?.style, a = {};
	if (!r) return a;
	for (let t in r) (sa(r[t]) || i && sa(i[t]) || Cc(t, e) || n?.getValue(t)?.liveStyle !== void 0) && (a[t] = r[t]);
	return a;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/html/HTMLVisualElement.mjs
function Tc(e) {
	return window.getComputedStyle(e);
}
var Ec = class extends xc {
	constructor() {
		super(...arguments), this.type = "html", this.renderInstance = Sc;
	}
	mount(e) {
		super.mount(e);
	}
	readValueFromInstance(e, t) {
		if (ar.has(t)) return this.projection?.isProjecting ? tr(t) : rr(e, t);
		{
			let n = Tc(e), r = (pe(t) ? n.getPropertyValue(t) : n[t]) || 0;
			return typeof r == "string" ? r.trim() : r;
		}
	}
	measureInstanceViewportBox(e, { transformPagePoint: t }) {
		return oo(e, t);
	}
	build(e, t, n) {
		Na(e, t, n.transformTemplate);
	}
	scrapeMotionValuesFromProps(e, t, n) {
		return wc(e, t, n);
	}
}, Dc = (e) => e.pointerType === "mouse" ? typeof e.button != "number" || e.button <= 0 : e.isPrimary !== !1;
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/events/event-info.mjs
function Oc(e) {
	return { point: {
		x: e.pageX,
		y: e.pageY
	} };
}
var kc = (e) => (t) => Dc(t) && e(t, Oc(t));
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/events/add-pointer-event.mjs
function Ac(e, t, n, r) {
	return ec(e, t, kc(n), r);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/resize/handle-element.mjs
var jc = /* @__PURE__ */ new WeakMap(), Mc, Nc = (e, t, n) => (r, i) => i && i[0] ? i[0][e + "Size"] : Da(r) && "getBBox" in r ? r.getBBox()[t] : r[n], Pc = /*@__PURE__*/ Nc("inline", "width", "offsetWidth"), Fc = /*@__PURE__*/ Nc("block", "height", "offsetHeight");
function Ic({ target: e, borderBoxSize: t }) {
	jc.get(e)?.forEach((n) => {
		n(e, {
			get width() {
				return Pc(e, t);
			},
			get height() {
				return Fc(e, t);
			}
		});
	});
}
function Lc(e) {
	e.forEach(Ic);
}
function Rc() {
	typeof ResizeObserver < "u" && (Mc = new ResizeObserver(Lc));
}
function zc(e, t) {
	Mc || Rc();
	let n = ja(e);
	return n.forEach((e) => {
		let n = jc.get(e);
		n || (n = /* @__PURE__ */ new Set(), jc.set(e, n)), n.add(t), Mc?.observe(e);
	}), () => {
		n.forEach((e) => {
			let n = jc.get(e);
			n?.delete(t), n?.size || Mc?.unobserve(e);
		});
	};
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/resize/handle-window.mjs
var Bc = /* @__PURE__ */ new Set(), Vc;
function Hc() {
	Vc = () => {
		let e = {
			get width() {
				return window.innerWidth;
			},
			get height() {
				return window.innerHeight;
			}
		};
		Bc.forEach((t) => t(e));
	}, window.addEventListener("resize", Vc);
}
function Uc(e) {
	return Bc.add(e), Vc || Hc(), () => {
		Bc.delete(e), !Bc.size && typeof Vc == "function" && (window.removeEventListener("resize", Vc), Vc = void 0);
	};
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/resize/index.mjs
function Wc(e, t) {
	return ka(typeof e == "function" ? Uc(e) : zc(e, t));
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/utils/distance.mjs
var Gc = (e, t) => Math.abs(e - t);
function Kc(e, t) {
	let n = Gc(e.x, t.x), r = Gc(e.y, t.y);
	return Math.sqrt(n ** 2 + r ** 2);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/gestures/pan/PanSession.mjs
var qc = /*#__PURE__*/ new Set(["auto", "scroll"]), Jc = class {
	constructor(e, t, { transformPagePoint: n, contextWindow: r = window, dragSnapToOrigin: i = !1, distanceThreshold: a = 3, element: o, immediate: s } = {}) {
		if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.lastRawMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.scrollPositions = /* @__PURE__ */ new Map(), this.onElementScroll = (e) => {
			this.handleScroll(e.target);
		}, this.onWindowScroll = () => {
			this.handleScroll(window);
		}, this.updatePoint = () => {
			if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			this.hasPendingMove = !1, this.lastRawMoveEventInfo && (this.lastMoveEventInfo = Xc(this.lastRawMoveEventInfo, this.transformPagePoint));
			let e = Qc(this.lastMoveEventInfo, this.history), t = this.startEvent !== null, n = Kc(e.offset, {
				x: 0,
				y: 0
			}) >= this.distanceThreshold;
			if (!t && !n) return;
			let { point: r } = e;
			this.history.push({
				...r,
				timestamp: U.now()
			});
			let { onStart: i, onMove: a } = this.handlers;
			t || (i?.(this.lastMoveEvent, e), this.startEvent = this.lastMoveEvent), a?.(this.lastMoveEvent, e);
		}, this.handlePointerMove = (e, t) => {
			this.handleScroll(window), this.lastMoveEvent = e, this.lastRawMoveEventInfo = t, this.lastMoveEventInfo = Xc(t, this.transformPagePoint), this.hasPendingMove = !0, Ot.update(this.updatePoint, !0);
		}, this.handlePointerUp = (e, t) => {
			this.hasPendingMove && this.updatePoint(), this.end();
			let { onEnd: n, onSessionEnd: r, resumeAnimation: i } = this.handlers;
			if ((this.dragSnapToOrigin || !this.startEvent) && i?.(), !(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			let a = Qc(e.type === "pointercancel" ? this.lastMoveEventInfo : Xc(t, this.transformPagePoint), this.history);
			this.startEvent && n?.(e, a), r?.(e, a);
		}, !Dc(e)) return;
		this.dragSnapToOrigin = i, this.handlers = t, this.transformPagePoint = n, this.distanceThreshold = s ? 0 : a, this.contextWindow = r || window;
		let c = Oc(e), l = Xc(c, this.transformPagePoint), { point: u } = l;
		this.history = [{
			...u,
			timestamp: U.now()
		}];
		let { onSessionStart: d } = t;
		d && d(e, Qc(l, this.history));
		let f = {
			passive: !0,
			capture: !0
		};
		this.removeListeners = D(Ac(this.contextWindow, "pointermove", this.handlePointerMove, f), Ac(this.contextWindow, "pointerup", this.handlePointerUp, f), Ac(this.contextWindow, "pointercancel", this.handlePointerUp, f)), o && this.startScrollTracking(o), s && (this.handlePointerMove(e, c), this.updatePoint());
	}
	startScrollTracking(e) {
		let t = e.parentElement;
		for (; t;) {
			let e = getComputedStyle(t);
			(qc.has(e.overflowX) || qc.has(e.overflowY)) && this.scrollPositions.set(t, Yc(t)), t = t.parentElement;
		}
		this.scrollPositions.set(window, Yc(window)), this.removeScrollListeners = D(ec(window, "scroll", this.onElementScroll, { capture: !0 }), ec(window, "scroll", this.onWindowScroll, {}));
	}
	handleScroll(e) {
		let t = this.scrollPositions.get(e);
		if (!t) return;
		let n = e === window, r = Yc(e), i = {
			x: r.x - t.x,
			y: r.y - t.y
		};
		(i.x !== 0 || i.y !== 0) && (n ? this.lastMoveEventInfo && (this.lastMoveEventInfo.point.x += i.x, this.lastMoveEventInfo.point.y += i.y) : this.history.length > 0 && (this.history[0].x -= i.x, this.history[0].y -= i.y), this.scrollPositions.set(e, r), Ot.update(this.updatePoint, !0));
	}
	updateHandlers(e) {
		this.handlers = e;
	}
	end() {
		this.removeListeners?.(), this.removeScrollListeners?.(), this.scrollPositions.clear(), kt(this.updatePoint);
	}
}, Yc = (e) => e === window ? {
	x: window.scrollX,
	y: window.scrollY
} : {
	x: e.scrollLeft,
	y: e.scrollTop
};
function Xc(e, t) {
	return t ? { point: t(e.point) } : e;
}
function Zc(e, t) {
	return {
		x: e.x - t.x,
		y: e.y - t.y
	};
}
function Qc({ point: e }, t) {
	return {
		point: e,
		delta: Zc(e, el(t)),
		offset: Zc(e, $c(t)),
		velocity: tl(t, .1)
	};
}
function $c(e) {
	return e[0];
}
function el(e) {
	return e[e.length - 1];
}
function tl(e, t) {
	if (e.length < 2) return {
		x: 0,
		y: 0
	};
	let n = e.length - 1, r = null, i = el(e);
	for (; n >= 0 && (r = e[n], !(i.timestamp - r.timestamp > /* @__PURE__ */ A(t)));) n--;
	if (!r) return {
		x: 0,
		y: 0
	};
	r === e[0] && e.length > 2 && i.timestamp - r.timestamp > /* @__PURE__ */ A(t) * 2 && (r = e[1]);
	let a = /* @__PURE__ */ j(i.timestamp - r.timestamp);
	if (a === 0) return {
		x: 0,
		y: 0
	};
	let o = {
		x: (i.x - r.x) / a,
		y: (i.y - r.y) / a
	};
	return o.x === Infinity && (o.x = 0), o.y === Infinity && (o.y = 0), o;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/gestures/press/utils/is-keyboard-accessible.mjs
var nl = /* @__PURE__ */ new Set([
	"BUTTON",
	"INPUT",
	"SELECT",
	"TEXTAREA",
	"A"
]);
function rl(e) {
	return nl.has(e.tagName) || e.isContentEditable === !0;
}
var il = /* @__PURE__ */ new Set([
	"INPUT",
	"SELECT",
	"TEXTAREA"
]);
function al(e) {
	return il.has(e.tagName) || e.isContentEditable === !0;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/gestures/drag/state/is-active.mjs
var ol = {
	x: !1,
	y: !1
};
function sl() {
	return ol.x || ol.y;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/gestures/drag/state/set-active.mjs
function cl(e) {
	return e === "x" || e === "y" ? ol[e] ? null : (ol[e] = !0, () => {
		ol[e] = !1;
	}) : ol.x || ol.y ? null : (ol.x = ol.y = !0, () => {
		ol.x = ol.y = !1;
	});
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/gestures/drag/utils/constraints.mjs
function ll(e, { min: t, max: n }, r) {
	return t !== void 0 && e < t ? e = r ? K(t, e, r.min) : Math.max(e, t) : n !== void 0 && e > n && (e = r ? K(n, e, r.max) : Math.min(e, n)), e;
}
function ul(e, t, n) {
	return {
		min: t === void 0 ? void 0 : e.min + t,
		max: n === void 0 ? void 0 : e.max + n - (e.max - e.min)
	};
}
function dl(e, { top: t, left: n, bottom: r, right: i }) {
	return {
		x: ul(e.x, n, i),
		y: ul(e.y, t, r)
	};
}
function fl(e, t) {
	let n = t.min - e.min, r = t.max - e.max;
	return t.max - t.min < e.max - e.min && ([n, r] = [r, n]), {
		min: n,
		max: r
	};
}
function pl(e, t) {
	return {
		x: fl(e.x, t.x),
		y: fl(e.y, t.y)
	};
}
function ml(e, t) {
	let n = .5, r = Io(e), i = Io(t);
	return i > r ? n = /* @__PURE__ */ O(t.min, t.max - r, e.min) : r > i && (n = /* @__PURE__ */ O(e.min, e.max - i, t.min)), b(0, 1, n);
}
function hl(e, t) {
	let n = {};
	return t.min !== void 0 && (n.min = t.min - e.min), t.max !== void 0 && (n.max = t.max - e.min), n;
}
var gl = .35;
function _l(e = gl) {
	return e === !1 ? e = 0 : e === !0 && (e = gl), {
		x: vl(e, "left", "right"),
		y: vl(e, "top", "bottom")
	};
}
function vl(e, t, n) {
	return {
		min: yl(e, t),
		max: yl(e, n)
	};
}
function yl(e, t) {
	return typeof e == "number" ? e : e[t] || 0;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/gestures/drag/VisualElementDragControls.mjs
function bl(e) {
	let t = "";
	for (let n of e.path) {
		n.scroll = void 0, n.updateScroll();
		let { scroll: r } = n;
		n !== e.root && r && (t += r.offset.x + "," + r.offset.y + ",");
	}
	return t;
}
var xl = /* @__PURE__ */ new WeakMap(), Sl = class {
	constructor(e, t = () => e.getProps()) {
		this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = {
			x: 0,
			y: 0
		}, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = rs(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = e, this.readProps = t;
	}
	start(e, t = {}) {
		if (this.visualElement.presenceContext?.isPresent === !1) return;
		let n = (e) => {
			t.snapToCursor && this.snapToCursor(e), this.stopAnimation();
		}, r = (e, t) => {
			let { drag: n, dragConstraints: r, dragPropagation: i, onDragStart: a } = this.getProps();
			if (n && !i && (this.openDragLock?.(), this.openDragLock = cl(n), !this.openDragLock)) return;
			this.latestPointerEvent = e, this.latestPanInfo = t, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints();
			let { projection: o } = this.visualElement;
			o && (o.isAnimationBlocked = !0, o.target = void 0), _s((e) => {
				let t = this.getAxisMotionValue(e).get() || 0;
				if (he(t) && (t = Zi(t, this.visualElement.current) || 0), G.test(t)) t = parseFloat(t);
				else if (Pe.test(t)) {
					let n = o?.layout?.layoutBox[e];
					n && (t = Io(n) * (parseFloat(t) / 100));
				}
				this.originPoint[e] = t;
			}), this.point = typeof r == "function" && r(this), a && Ot.update(() => a(e, t), !1, !0), la(this.visualElement, "transform"), this.visualElement.animationState?.setActive("whileDrag", !0);
		}, i = (e, t) => {
			this.latestPointerEvent = e, this.latestPanInfo = t;
			let { dragPropagation: n, dragDirectionLock: r, onDirectionLock: i, onDrag: a } = this.getProps();
			if (!n && !this.openDragLock) return;
			let { offset: o } = t;
			if (r && this.currentDirection === null) {
				if (this.currentDirection = Ol(o), this.currentDirection === null) return;
				i && i(this.currentDirection);
			}
			this.updateAxis("x", o), this.updateAxis("y", o), this.point && this.point.move(), this.visualElement.render(), a && Ot.update(() => a(e, t), !1, !0);
		}, a = (e, t) => {
			this.latestPointerEvent = e, this.latestPanInfo = t, this.stop(e, t), this.latestPointerEvent = null, this.latestPanInfo = null;
		}, o = () => {
			let { dragSnapToOrigin: e } = this.getProps();
			(e || this.constraints || this.point) && this.startAnimation({
				x: 0,
				y: 0
			});
		}, { dragSnapToOrigin: s } = this.getProps();
		this.panSession = new Jc(e, {
			onSessionStart: n,
			onStart: r,
			onMove: i,
			onSessionEnd: a,
			resumeAnimation: o
		}, {
			...t,
			transformPagePoint: this.visualElement.getTransformPagePoint(),
			dragSnapToOrigin: s,
			contextWindow: this.visualElement.current?.ownerDocument.defaultView,
			element: this.visualElement.current
		});
	}
	stop(e, t, n) {
		let r = e || this.latestPointerEvent, i = t || this.latestPanInfo, a = this.isDragging;
		if (this.cancel(), !a || !i || !r) return;
		let { velocity: o } = i;
		this.startAnimation(o, n);
		let { onDragEnd: s } = this.getProps();
		s && Ot.postRender(() => s(r, i));
	}
	cancel() {
		this.isDragging = !1;
		let { projection: e, animationState: t } = this.visualElement;
		e && (e.isAnimationBlocked = !1), this.endPanSession(), !this.getProps().dragPropagation && this.openDragLock && (this.openDragLock(), this.openDragLock = null), t?.setActive("whileDrag", !1);
	}
	endPanSession() {
		this.panSession?.end(), this.panSession = void 0;
	}
	updateAxis(e, t) {
		let { drag: n } = this.readProps();
		if (!t || !Dl(e, n, this.currentDirection)) return;
		let r = this.getAxisMotionValue(e), i = this.originPoint[e] + t[e], a = this.constraints && this.constraints[e];
		a && (i = ll(i, a, this.elastic[e])), this.point ? this.point[e] = i : r.set(i);
	}
	resolveConstraints() {
		let { dragConstraints: e, dragElastic: t } = this.getProps(), { projection: n } = this.visualElement, r = n && (n.layout || n.measure(!1)), i = this.constraints;
		Cl(e) ? this.constraints && this.scroll === bl(n) || (this.constraints = this.resolveRefConstraints()) : this.constraints = e && r && typeof e == "object" ? dl(r.layoutBox, e) : !1, this.elastic = _l(t), i !== this.constraints && !Cl(e) && r && this.constraints && !this.hasMutatedConstraints && _s((e) => {
			this.constraints !== !1 && this.getAxisMotionValue(e) && (this.constraints[e] = hl(r.layoutBox[e], this.constraints[e]));
		});
	}
	resolveRefConstraints() {
		let { dragConstraints: e, onMeasureDragConstraints: t } = this.getProps();
		if (!Cl(e)) return !1;
		let n = wl(e), { projection: r } = this.visualElement;
		if (!r || !r.layout) return !1;
		this.scroll = bl(r);
		let i = so(n, r.root, this.visualElement.getTransformPagePoint()), a = pl(r.layout.layoutBox, r.removeElementScroll(i));
		if (t) {
			let e = t(Ba(a));
			this.hasMutatedConstraints = !!e, e && (a = za(e));
		}
		return a;
	}
	startAnimation(e, t) {
		let { drag: n, dragMomentum: r, dragElastic: i, dragTransition: a, dragSnapToOrigin: o, onDragTransitionEnd: s } = this.getProps(), c = {
			bounceStiffness: i ? 200 : 1e6,
			bounceDamping: i ? 40 : 1e7,
			timeConstant: 750,
			restDelta: 1,
			restSpeed: 10,
			...a
		}, l = (i) => r && !(this.point && o) && Dl(i, t || n, this.currentDirection) ? e[i] : 0;
		if (this.point && !o) return this.point.release({
			x: l("x"),
			y: l("y")
		}, c).then(s);
		let u = this.constraints || {}, d = _s((e) => {
			if (!Dl(e, t || n, this.currentDirection)) return;
			let r = u[e] || {};
			(o === !0 || o === e) && (r = {
				min: 0,
				max: 0
			});
			let i = {
				type: "inertia",
				velocity: l(e),
				...c,
				...r
			};
			return this.startAxisValueAnimation(e, i);
		});
		return Promise.all(d).then(s);
	}
	startAxisValueAnimation(e, t) {
		let n = this.getAxisMotionValue(e);
		return la(this.visualElement, e), n.start(Ji(e, n, 0, t, this.visualElement, !1));
	}
	stopAnimation() {
		_s((e) => this.getAxisMotionValue(e).stop());
	}
	getAxisMotionValue(e) {
		let t = `_drag${e.toUpperCase()}`;
		return this.readProps()[t] || this.visualElement.getValue(e, this.visualElement.latestValues[e] ?? 0);
	}
	snapToCursor({ clientX: e, clientY: t }) {
		let { drag: n } = this.getProps(), r = {
			x: e,
			y: t
		}, i = this.visualElement.getTransformPagePoint()?.(r) || r, a = this.visualElement.measureViewportBox();
		_s((e) => {
			if (!Dl(e, n, this.currentDirection)) return;
			let t = this.getAxisMotionValue(e), { min: r, max: o } = a[e];
			t.set((t.get() || 0) + i[e] - K(r, o, .5));
		});
	}
	scalePositionWithinConstraints() {
		if (!this.visualElement.current) return;
		let { drag: e, dragConstraints: t } = this.getProps(), { projection: n } = this.visualElement;
		if (!Cl(t) || !n || !this.constraints) return;
		this.stopAnimation();
		let r = this.constraints, i = {
			x: 0,
			y: 0
		};
		_s((e) => {
			let t = this.getAxisMotionValue(e).get();
			i[e] = ml({
				min: t,
				max: t
			}, r[e]);
		});
		let { transformTemplate: a } = this.visualElement.getProps();
		this.visualElement.current.style.transform = a ? a({}, "") : "none", n.root?.updateScroll(), n.updateLayout(), this.constraints = !1, this.resolveConstraints(), _s((t) => {
			let n = this.getAxisMotionValue(t);
			if (!Dl(t, e, null) || !n.get()) return;
			let { min: r, max: a } = this.constraints[t];
			n.set(K(r, a, i[t]));
		}), this.visualElement.render();
	}
	addListeners() {
		if (!this.visualElement.current) return;
		xl.set(this.visualElement, this);
		let e = this.visualElement.current, t = Ac(e, "pointerdown", (t) => {
			let { drag: n, dragListener: r = !0 } = this.getProps(), i = t.target, a = i !== e && al(i);
			n && r && !a && this.start(t);
		}), n, r = () => {
			let { dragConstraints: t } = this.getProps(), r = Cl(t) && wl(t);
			r && (this.constraints = this.resolveRefConstraints(), n ||= El(e, r, () => this.scalePositionWithinConstraints()));
		}, { projection: i } = this.visualElement, a = i.addEventListener("measure", r);
		i.layout || (i.root?.updateScroll(), i.updateLayout()), Ot.read(r);
		let o = ec(window, "resize", () => this.scalePositionWithinConstraints()), s = i.addEventListener("didUpdate", (({ delta: e, hasLayoutChanged: t }) => {
			this.isDragging && t && (_s((t) => {
				if (!Dl(t, this.getProps().drag, this.currentDirection)) return;
				let n = this.getAxisMotionValue(t);
				this.originPoint[t] += e[t].translate, n.set(n.get() + e[t].translate);
			}), this.visualElement.render());
		}));
		return () => {
			o(), t(), a(), s(), n?.();
		};
	}
	getProps() {
		let e = this.readProps(), { dragElastic: t = gl, dragMomentum: n = !0 } = e;
		return {
			...e,
			dragElastic: t,
			dragMomentum: n
		};
	}
};
function Cl(e) {
	return !!e && typeof e == "object" && ("current" in e || "nodeType" in e);
}
var wl = (e) => "current" in e ? e.current : e;
function Tl(e) {
	let t = !0;
	return () => {
		t ? t = !1 : e();
	};
}
function El(e, t, n) {
	let r = Wc(e, Tl(n)), i = Wc(t, Tl(n));
	return () => {
		r(), i();
	};
}
function Dl(e, t, n) {
	return (t === !0 || t === e) && (n === null || n === e);
}
function Ol(e, t = 10) {
	let n = null;
	return Math.abs(e.y) > t ? n = "y" : Math.abs(e.x) > t && (n = "x"), n;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/gestures/utils/setup.mjs
function kl(e, t) {
	let n = ja(e), r = new AbortController();
	return [
		n,
		{
			passive: !0,
			...t,
			signal: r.signal
		},
		ka(() => r.abort())
	];
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/gestures/hover.mjs
function Al(e) {
	return !(e.pointerType === "touch" || sl());
}
function jl(e, t, n = {}) {
	t = Aa(t);
	let [r, i, a] = kl(e, n);
	return r.forEach((e) => {
		let n = !1, r = !1, a, o = () => {
			e.removeEventListener("pointerleave", u);
		}, s = (e) => {
			a &&= (a(e), void 0), o();
		}, c = (e) => {
			n = !1, window.removeEventListener("pointerup", c), window.removeEventListener("pointercancel", c), r && (r = !1, s(e));
		}, l = () => {
			n = !0, window.addEventListener("pointerup", c, i), window.addEventListener("pointercancel", c, i);
		}, u = (e) => {
			e.pointerType !== "touch" && (n ? r = !0 : s(e));
		};
		e.addEventListener("pointerenter", (n) => {
			if (!Al(n)) return;
			r = !1;
			let o = t(e, n);
			typeof o == "function" && (a = o, e.addEventListener("pointerleave", u, i));
		}, i), e.addEventListener("pointerdown", l, i);
	}), a;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/gestures/utils/is-node-or-child.mjs
var Ml = (e, t) => t ? e === t || Ml(e, t.parentElement) : !1, Nl = /* @__PURE__ */ new WeakSet();
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/gestures/press/utils/keyboard.mjs
function Pl(e) {
	return (t) => {
		t.key === "Enter" && e(t);
	};
}
function Fl(e, t) {
	e.dispatchEvent(new PointerEvent("pointer" + t, {
		isPrimary: !0,
		bubbles: !0
	}));
}
var Il = (e, t) => {
	let n = !1, r = Pl(() => {
		n || Nl.has(e) || (n = !0, Fl(e, "down"));
	}), i = Pl(() => {
		n && (n = !1, Fl(e, "up"));
	});
	e.addEventListener("keydown", r, t), e.addEventListener("keyup", i, t), e.addEventListener("blur", () => {
		e.removeEventListener("keydown", r), e.removeEventListener("keyup", i), n && Fl(e, "cancel");
	}, {
		...t,
		once: !0
	});
};
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/gestures/press/index.mjs
function Ll(e) {
	return Dc(e) && !sl();
}
var Rl = /* @__PURE__ */ new WeakSet(), zl = 100, Bl = 8, Vl = (e, t, n) => Math.hypot(e.clientX - t.clientX, e.clientY - t.clientY) > n, Hl = (e) => e.preventDefault();
function Ul(e, t, n = {}) {
	t = Aa(t);
	let [r, i, a] = kl(e, n), o = /* @__PURE__ */ new WeakMap(), s = (e) => {
		let r = e.currentTarget;
		if (!Ll(e) || Rl.has(e)) return;
		n.stopPropagation && Rl.add(e);
		let { count: a = 1, countTimeout: s = .3, hold: c = 0, repeat: l } = n, u = U.now(), d = /* @__PURE__ */ A(c), f = /* @__PURE__ */ A(s), p = o.get(r);
		p?.expire(Vl(p.event, e, zl)) ? p = void 0 : p && (kt(p.expire), o.delete(r));
		let m = p ? p.count + 1 : 1, h = m >= a, g = h && (c || l), _ = !c, v = 0, y;
		if (Nl.add(r), p) y = p.handlers;
		else {
			let n = t(r, e);
			y = typeof n == "function" ? { onComplete: n } : n || {};
		}
		h && _ && y.onActive?.();
		let b = /* @__PURE__ */ A(l), x = d || b, S = u + x, C = !0, w = () => {
			if (i.signal.aborted) return kt(w);
			let e = Math.min(1 - (S - U.now()) / x, 1);
			C && e < 1 && (e = 0), C = !1, y.onHold?.(e), e < 1 || (_ ? y.onRepeat?.(++v) : (_ = !0, y.onActive?.()), l ? (C = !0, S += x = b) : kt(w));
		}, T = {
			...i,
			capture: !0
		}, E = (t, n) => {
			if (Dc(t)) {
				if (window.removeEventListener("pointerup", D, T), window.removeEventListener("pointercancel", O, T), window.removeEventListener("pointermove", k, T), r.removeEventListener("contextmenu", Hl), kt(w), Nl.delete(r), sl() && (n = !1), n && !h) {
					let n = U.now(), a = (e) => {
						let s = i.signal.aborted;
						if (s || e === !0 || U.now() - n > f) return kt(a), o.delete(r), s || y.onComplete?.(t, { success: !1 }), !0;
					};
					o.set(r, {
						count: m,
						event: e,
						handlers: y,
						expire: a
					}), Ot.update(a, !0);
				} else y.onComplete?.(t, { success: n && _ });
			}
		}, D = (e) => {
			E(e, r === window || r === document || n.useGlobalTarget || Ml(r, e.target));
		}, O = (e) => {
			E(e, !1);
		}, k = (t) => {
			Dc(t) && ((l || !_) && Vl(e, t, Bl) || a > 1 && sl()) && O(t);
		};
		window.addEventListener("pointerup", D, T), window.addEventListener("pointercancel", O, T), (g || a > 1) && window.addEventListener("pointermove", k, T), g && (Ot.update(w, !0), r.addEventListener("contextmenu", Hl, {
			...i,
			passive: !1
		}));
	};
	return r.forEach((e) => {
		(n.useGlobalTarget ? window : e).addEventListener("pointerdown", s, i), Ea(e) && (e.addEventListener("focus", () => Il(e, i), i), !rl(e) && !e.hasAttribute("tabindex") && (e.tabIndex = 0));
	}), a;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/Feature.mjs
var Wl = class {
	constructor(e) {
		this.isMounted = !1, this.node = e;
	}
	update() {}
}, Gl = /* @__PURE__ */ new Set([
	"baseFrequency",
	"diffuseConstant",
	"kernelMatrix",
	"kernelUnitLength",
	"keySplines",
	"keyTimes",
	"limitingConeAngle",
	"markerHeight",
	"markerWidth",
	"numOctaves",
	"targetX",
	"targetY",
	"surfaceScale",
	"specularConstant",
	"specularExponent",
	"stdDeviation",
	"tableValues",
	"viewBox",
	"gradientTransform",
	"pathLength",
	"startOffset",
	"textLength",
	"lengthAdjust"
]), Kl = (e) => typeof e == "string" && e.toLowerCase() === "svg";
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/svg/utils/render.mjs
function ql(e, t, n, r) {
	Sc(e, t, void 0, r);
	for (let n in t.attrs) e.setAttribute(Gl.has(n) ? n : Ma(n), t.attrs[n]);
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/svg/utils/scrape-motion-values.mjs
function Jl(e, t, n) {
	let r = wc(e, t, n);
	for (let n in e) if (n !== "children" && (sa(e[n]) || sa(t[n]))) {
		let t = ir.indexOf(n) === -1 ? n : "attr" + n.charAt(0).toUpperCase() + n.substring(1);
		r[t] = e[n];
	}
	return r;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/svg/SVGVisualElement.mjs
var Yl = class extends xc {
	constructor() {
		super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = rs;
	}
	getBaseTargetFromProps(e, t) {
		return ar.has(t) ? super.getBaseTargetFromProps(e, t) ?? tr(t) : e[t];
	}
	getDefaultValue(e) {
		return ar.has(e) ? this.latestValues[e] ?? tr(e) : void 0;
	}
	readValueFromInstance(e, t) {
		if (ar.has(t)) {
			let e = Bn(t);
			return e && e.default || 0;
		}
		if (La.includes(t)) {
			let n = getComputedStyle(e)[t];
			if (typeof n == "string" && n) return n.trim();
		}
		return t = Gl.has(t) ? t : Ma(t), e.getAttribute(t);
	}
	scrapeMotionValuesFromProps(e, t, n) {
		return Jl(e, t, n);
	}
	build(e, t, n) {
		Ra(e, t, this.isSVGTag, n.transformTemplate, n.style);
	}
	renderInstance(e, t, n, r) {
		ql(e, t, n, r);
	}
	mount(e) {
		this.isSVGTag = Kl(e.tagName), super.mount(e);
	}
};
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/utils/shallow-compare.mjs
function Xl(e, t) {
	if (!Array.isArray(t)) return !1;
	let n = t.length;
	if (n !== e.length) return !1;
	for (let r = 0; r < n; r++) if (t[r] !== e[r]) return !1;
	return !0;
}
// node_modules/.pnpm/motion-dom@14.14.0/node_modules/motion-dom/dist/es/render/utils/animation-state.mjs
var Zl = [...sc].reverse(), Ql = (e) => e?.out === !0 ? e : e?.out;
function $l(e) {
	let t = (t) => Promise.all(t.map(({ animation: t, options: n }) => ga(e, t, n))), n = tu(), r = !0, i = !1;
	function a(a) {
		let { props: o, parent: s, manuallyAnimateOnMount: c } = e, { initial: l } = o, u = r || i, d = [], f = (t = l) => typeof t != "boolean" && ea(e, Array.isArray(t) ? t[0] : t, e.presenceContext?.custom) || void 0, p = /* @__PURE__ */ new Map(), m = {}, h = Infinity, g = e;
		do
			g = g.props.inherit !== !1 && g.parent;
		while (g && !g.isControllingVariants);
		let _ = u && Ql(f(l ?? (g && g.props.initial))?.transition);
		if (Zl.forEach((t, r) => {
			let i = n[t], l = o[t], f = g && g.props[t], v = l === void 0 ? oc(f) || f === !1 ? f : void 0 : l, y = oc(v), b = t === a ? i.isActive : null, x = y && l === void 0 && !(u && c);
			if (i.protectedKeys = { ...m }, !i.isActive && b === null || !v && !i.prevProp || ac(v) || typeof v == "boolean") return;
			if (b === !1 && (h = r), t === "exit" && i.isActive && b !== !0) {
				m = {
					...m,
					...i.prevResolvedValues
				};
				return;
			}
			let S = eu(i.prevProp, v), C = S || y && (b && !x || r > h), w = !1, T = Array.isArray(v) ? v : [v], E = {}, D;
			if (b !== !1) for (let n of T) {
				let { transition: r, transitionEnd: i, ...a } = ea(e, n, ta(e, t)) || {};
				E = {
					...E,
					...a,
					...i
				}, D = Ql(r) || D;
			}
			let { prevResolvedValues: O } = i;
			for (let t in {
				...O,
				...E
			}) {
				if (t in m) continue;
				let n = E[t], r = O[t], a = Array.isArray(n) && Array.isArray(r) ? !Xl(n, r) || S : n !== r, o;
				if (a && n == null) p.has(t) || p.set(t, i.prevOut);
				else if (a || n !== void 0 && p.has(t)) {
					C = !0, o = p.get(t) || _, p.delete(t) && (w = !0), i.needsAnimating[t] = !0;
					let n = e.getValue(t);
					n && (n.liveStyle = !1);
				} else i.protectedKeys[t] = !0;
				i.out[t] = o;
			}
			if (i.prevProp = v, i.prevResolvedValues = E, i.prevOut = D, i.isActive && (m = {
				...m,
				...E
			}), C && (!(x && S) || w)) for (let n of T) {
				let r = { type: t };
				if (typeof n == "string" && u && c && s?.enteringChildren) {
					let t = ea(s, n)?.transition?.delayChildren;
					r.delay = Ni(s.enteringChildren, e, t);
				}
				d.push({
					animation: n,
					options: r
				});
			}
		}), p.size) {
			let t = {}, n = f(), r = n?.transition;
			p.forEach((i, a) => {
				i && (r = {
					...r || e.getDefaultTransition(),
					[a]: i
				});
				let s = e.getValue(a);
				s && (s.liveStyle = !0);
				let c = n && !Array.isArray(l) ? n[a] : void 0, u = e.getBaseTargetFromProps(o, a);
				t[a] = (c === void 0 ? u !== void 0 && !sa(u) ? u : e.initialValues[a] === void 0 ? e.baseTarget[a] : void 0 : c) ?? null;
			}), r && (t.transition = r), d.push({ animation: t });
		}
		let v = u && e.blockInitialAnimation || r && !c && (o.initial === !1 || o.initial === o.animate);
		return r = i = !1, !v && d.length ? t(d) : Promise.resolve();
	}
	function o(t, r) {
		if (n[t].isActive === r) return Promise.resolve();
		e.variantChildren?.forEach((e) => e.animationState?.setActive(t, r)), n[t].isActive = r;
		let i = a(t);
		for (let e in n) n[e].protectedKeys = {};
		return i;
	}
	return {
		animateChanges: a,
		setActive: o,
		setAnimateFunction: (n) => {
			t = n(e);
		},
		getState: () => n,
		reset: () => {
			n = tu(), i = !0;
		}
	};
}
function eu(e, t) {
	return typeof t == "string" ? t !== e : Array.isArray(t) ? !Xl(t, e) : !1;
}
function tu() {
	let e = {};
	for (let t of sc) e[t] = {
		isActive: t === "animate",
		protectedKeys: {},
		needsAnimating: {},
		prevResolvedValues: {},
		out: {}
	};
	return e;
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/context/MotionConfigContext.mjs
var nu = /* @__PURE__ */ (0, p.createContext)({
	transformPagePoint: (e) => e,
	isStatic: !1,
	reducedMotion: "never"
});
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/utils/use-composed-ref.mjs
function ru(e, t) {
	if (typeof e == "function") return e(t);
	e != null && (e.current = t);
}
function iu(...e) {
	return (t) => {
		let n = !1, r = e.map((e) => {
			let r = ru(e, t);
			return !n && typeof r == "function" && (n = !0), r;
		});
		if (n) return () => {
			for (let t = 0; t < r.length; t++) {
				let n = r[t];
				typeof n == "function" ? n() : ru(e[t], null);
			}
		};
	};
}
function au(...e) {
	return p.useCallback(iu(...e), e);
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/components/AnimatePresence/PopChild.mjs
var q = u(), ou = (e) => {
	let { width: t, height: n } = e?.getBoundingClientRect() || {};
	return [t / e?.offsetWidth || 1, n / e?.offsetHeight || 1];
}, su = (e) => {
	let { left: t, top: n } = e.getBoundingClientRect(), r = e;
	for (; r = r.parentElement || r.parentNode?.host;) {
		let { scrollLeft: e, scrollTop: i } = r;
		if (e || i) {
			let [a, o] = ou(r);
			t += e * a, n += i * o;
		}
		if (getComputedStyle(r).position === "fixed") break;
	}
	let [i, a] = ou(e.offsetParent);
	return [t / i, n / a];
}, cu = class extends p.Component {
	getSnapshotBeforeUpdate(e) {
		let t = this.props.getElement();
		if (Ea(t) && e.isPresent && !this.props.isPresent && this.props.pop !== !1) {
			let e = t.offsetParent, n = Ea(e) && e.offsetWidth || 0, r = Ea(e) && e.offsetHeight || 0, i = getComputedStyle(t), a = this.props.sizeRef.current;
			a.height = parseFloat(i.height), a.width = parseFloat(i.width), a.top = t.offsetTop, a.left = t.offsetLeft, a.right = n - a.width - a.left, a.bottom = r - a.height - a.top, a.direction = i.direction, a.point = su(t);
		}
		return null;
	}
	componentDidUpdate() {}
	render() {
		return this.props.children;
	}
};
function lu({ children: e, isPresent: t, anchorX: n, anchorY: r, root: i, pop: a, popNode: o }) {
	let s = (0, p.useId)(), c = (0, p.useRef)(null), l = (0, p.useRef)({
		width: 0,
		height: 0,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		direction: "ltr"
	}), { nonce: u } = (0, p.useContext)(nu), d = au(c, a === !1 ? void 0 : e.props?.ref ?? e?.ref), f = () => c.current || o?.current?.current, m = (e) => {
		let { width: t, height: i, top: a, left: o, right: c, bottom: u, direction: d } = l.current, f = d === "rtl", p = n === "left" ? f ? `right:${c}` : `left:${o}` : f ? `left:${o}` : `right:${c}`, m = r === "bottom" ? `bottom:${u}` : `top:${a}`;
		e?.insertRule(`[data-motion-pop-id="${s}"]{position:absolute!important;width:${t}px!important;height:${i}px!important;${p}px!important;${m}px!important}`);
	};
	return (0, p.useInsertionEffect)(() => {
		let { width: e, height: n } = l.current, r = f();
		if (t || a === !1 || !r || !e || !n) return;
		r.dataset.motionPopId = s;
		let o = r.ownerDocument, c = o.createElement("style");
		u && (c.nonce = u);
		let d = i ?? o.head;
		d.appendChild(c), m(c.sheet);
		let p = 0, h = 0;
		return lo.setup(() => {
			let [e, t] = su(r);
			p = l.current.point[0] - e, h = l.current.point[1] - t;
		}), lo.read(() => {
			let { sheet: e } = c;
			if (!e || !p && !h) return;
			let t = l.current;
			t.left += p, t.right -= p, t.top += h, t.bottom -= h, e.deleteRule(0), m(e);
		}), () => {
			r.removeAttribute("data-motion-pop-id"), d.contains(c) && d.removeChild(c);
		};
	}, [t]), (0, q.jsx)(cu, {
		isPresent: t,
		getElement: f,
		sizeRef: l,
		pop: a,
		children: a === !1 ? e : p.cloneElement(e, { ref: d })
	});
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/components/AnimatePresence/PresenceChild.mjs
var uu = ({ children: e, initial: t, isPresent: n, onExitComplete: r, custom: i, presenceAffectsLayout: a, mode: o, anchorX: s, anchorY: c, root: l }) => {
	let u = h(du), d = (0, p.useId)(), f = (0, p.useRef)(), m = (0, p.useRef)(n), v = (0, p.useRef)(r);
	g(() => {
		m.current = n, v.current = r;
	});
	let y = !0, b = (0, p.useMemo)(() => (y = !1, {
		id: d,
		initial: t,
		isPresent: n,
		custom: i,
		onExitComplete: (e) => {
			u.set(e, !0);
			for (let e of u.values()) if (!e) return;
			r && r();
		},
		register: (e, t) => (u.set(e, !1), t && t.parent?.presenceContext?.id !== d && (f.current = t), () => {
			u.delete(e), !m.current && !u.size && v.current?.();
		})
	}), [
		n,
		u,
		r
	]);
	return a && y && (b = { ...b }), (0, p.useMemo)(() => {
		u.forEach((e, t) => u.set(t, !1));
	}, [n]), p.useEffect(() => {
		!n && !u.size && r && r();
	}, [n]), e = (0, q.jsx)(lu, {
		pop: o === "popLayout",
		isPresent: n,
		anchorX: s,
		anchorY: c,
		root: l,
		popNode: f,
		children: e
	}), (0, q.jsx)(_.Provider, {
		value: b,
		children: e
	});
};
function du() {
	return /* @__PURE__ */ new Map();
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/components/AnimatePresence/use-presence.mjs
function fu(e = !0) {
	let t = (0, p.useContext)(_);
	if (t === null) return [!0, null];
	let { isPresent: n, onExitComplete: r, register: i } = t, a = (0, p.useId)();
	(0, p.useEffect)(() => {
		if (e) return i(a);
	}, [e]);
	let o = (0, p.useCallback)(() => e && r && r(a), [
		a,
		r,
		e
	]);
	return !n && r ? [!1, o] : [!0];
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/components/AnimatePresence/utils.mjs
var pu = (e) => e.key || "";
function mu(e) {
	let t = [];
	return p.Children.forEach(e, (e) => {
		(0, p.isValidElement)(e) && t.push(e);
	}), t;
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs
var hu = ({ children: e, custom: t, initial: n = !0, onExitComplete: r, presenceAffectsLayout: i = !0, mode: a = "sync", propagate: o = !1, anchorX: s = "left", anchorY: c = "top", root: l }) => {
	let [u, d] = fu(o), f = (0, p.useMemo)(() => mu(e), [e]), _ = o && !u ? [] : f.map(pu), v = (0, p.useRef)(!0), y = h(() => /* @__PURE__ */ new Map()), b = (0, p.useRef)(/* @__PURE__ */ new Set()), [x, S] = (0, p.useState)(f), [C, w] = (0, p.useState)(f);
	g(() => {
		o && !u && !C.length && d?.();
	}, [
		u,
		o,
		C.length,
		d
	]);
	let T = (0, p.useRef)();
	(0, p.useEffect)(() => () => {
		let e = T.current;
		T.current = void 0, e?.();
	}, [C]), g(() => {
		v.current = !1;
		for (let e = 0; e < C.length; e++) {
			let t = pu(C[e]);
			_.includes(t) ? (y.delete(t), b.current.delete(t)) : y.get(t) !== !0 && y.set(t, !1);
		}
	}, [
		C,
		_.length,
		_.join("-")
	]);
	let E = [];
	if (f !== x) {
		let e = [...f], t = 0;
		for (let n of C) {
			let r = _.indexOf(pu(n));
			r === -1 ? (e.splice(t++, 0, n), E.push(n)) : t = r + E.length + 1;
		}
		return E.every((e) => y.get(pu(e))) ? e = f : a === "wait" && (e = E), w(mu(e)), S(f), null;
	}
	let { forceRender: D } = (0, p.useContext)(m);
	return (0, q.jsx)(q.Fragment, { children: C.map((e) => {
		let p = pu(e), m = o && !u ? !1 : f === C || _.includes(p);
		return (0, q.jsx)(uu, {
			isPresent: m,
			initial: !v.current || n ? void 0 : !1,
			custom: t,
			presenceAffectsLayout: i,
			mode: a,
			root: l,
			onExitComplete: m ? void 0 : () => {
				if (b.current.has(p)) return;
				if (y.has(p)) b.current.add(p), y.set(p, !0);
				else return;
				let e = !0;
				y.forEach((t) => {
					t || (e = !1);
				}), e && (D?.(), S([]), o && d?.(), T.current = r);
			},
			anchorX: s,
			anchorY: c,
			children: e
		}, p);
	}) });
}, gu = /* @__PURE__ */ (0, p.createContext)({ strict: !1 }), _u = {
	animation: ["variants", ...sc],
	exit: ["exit"],
	drag: ["drag", "dragControls"],
	focus: ["whileFocus"],
	hover: [
		"whileHover",
		"onHoverStart",
		"onHoverEnd"
	],
	tap: [
		"whileTap",
		"onTap",
		"onTapStart",
		"onTapCancel"
	],
	pan: [
		"onPan",
		"onPanStart",
		"onPanSessionStart",
		"onPanEnd"
	],
	inView: [
		"whileInView",
		"onViewportEnter",
		"onViewportLeave"
	],
	layout: ["layout", "layoutId"]
}, vu = !1;
function yu() {
	if (vu) return;
	let e = {};
	for (let t in _u) e[t] = { isEnabled: (e) => _u[t].some((t) => !!e[t]) };
	vc(e), vu = !0;
}
function bu() {
	return yu(), yc();
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/motion/features/load-features.mjs
function xu(e) {
	let t = bu();
	for (let n in e) t[n] = {
		...t[n],
		...e[n]
	};
	vc(t);
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/components/MotionConfig/index.mjs
function Su({ children: e, ...t }) {
	let n = (0, p.useContext)(nu);
	t = {
		...n,
		...t
	}, t.transition = zi(t.transition, n.transition), t.isStatic = h(() => t.isStatic);
	let r = (0, p.useMemo)(() => t, [
		JSON.stringify(t.transition),
		t.transformPagePoint,
		t.reducedMotion,
		t.skipAnimations,
		t.isValidProp
	]);
	return (0, q.jsx)(nu.Provider, {
		value: r,
		children: e
	});
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/context/MotionContext/index.mjs
var Cu = /* @__PURE__ */ (0, p.createContext)({});
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/context/MotionContext/utils.mjs
function wu(e, t) {
	if (lc(e)) {
		let { initial: t, animate: n } = e;
		return {
			initial: t === !1 || oc(t) ? t : void 0,
			animate: oc(n) ? n : void 0
		};
	}
	return e.inherit === !1 ? {} : t;
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/context/MotionContext/create.mjs
function Tu(e) {
	let { initial: t, animate: n } = wu(e, (0, p.useContext)(Cu));
	return (0, p.useMemo)(() => ({
		initial: t,
		animate: n
	}), [Eu(t), Eu(n)]);
}
function Eu(e) {
	return Array.isArray(e) ? e.join(" ") : e;
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/render/html/utils/create-render-state.mjs
var Du = () => ({
	style: {},
	transform: {},
	transformOrigin: {},
	vars: {}
});
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/render/html/use-props.mjs
function Ou(e, t, n) {
	for (let r in t) !sa(t[r]) && !Cc(r, n) && (e[r] = t[r]);
}
function ku({ transformTemplate: e }, t) {
	return (0, p.useMemo)(() => {
		let n = Du();
		return Na(n, t, e), Object.assign({}, n.vars, n.style);
	}, [t]);
}
function Au(e, t) {
	let n = e.style || {}, r = {};
	return Ou(r, n, e), Object.assign(r, ku(e, t)), r;
}
function ju(e, t) {
	let n = {}, r = Au(e, t);
	return e.drag && e.dragListener !== !1 && (n.draggable = !1, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none", r.touchAction = e.drag === !0 ? "none" : `pan-${e.drag === "x" ? "y" : "x"}`), e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (n.tabIndex = 0), n.style = r, n;
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/render/svg/utils/create-render-state.mjs
var Mu = () => ({
	...Du(),
	attrs: {}
});
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/render/svg/use-props.mjs
function Nu(e, t, n, r) {
	let i = (0, p.useMemo)(() => {
		let n = Mu();
		return Ra(n, t, Kl(r), e.transformTemplate, e.style), {
			...n.attrs,
			style: { ...n.style }
		};
	}, [t]);
	if (e.style) {
		let t = {};
		return Ou(t, e.style, e), {
			...i,
			style: {
				...t,
				...i.style
			}
		};
	}
	return i;
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/motion/utils/valid-prop.mjs
var Pu = /* @__PURE__ */ new Set(/* @__PURE__ */ "animate.exit.variants.initial.style.values.transition.transformTemplate.custom.inherit.onBeforeLayoutMeasure.onAnimationStart.onAnimationComplete.onUpdate.onDragStart.onDrag.onDragEnd.onMeasureDragConstraints.onDirectionLock.onDragTransitionEnd._dragX._dragY.onHoverStart.onHoverEnd.onViewportEnter.onViewportLeave.globalTapTarget.tap.propagate.ignoreStrict.viewport.pinch".split("."));
function Fu(e) {
	return e.startsWith("while") || e.startsWith("drag") && e !== "draggable" || e.startsWith("layout") || e.startsWith("onTap") || e.startsWith("onPan") || e.startsWith("onLayout") || Pu.has(e);
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/render/dom/utils/filter-props.mjs
function Iu(e, t) {
	return e.startsWith("on") ? !Fu(e) : t?.(e) ?? !Fu(e);
}
function Lu(e, t, n, r) {
	let i = {};
	for (let a in e) a === "values" && typeof e.values == "object" || sa(e[a]) || (a === "fx" ? e.fx && (i.fx = "") : (Iu(a, r) || n === !0 && Fu(a) || !t && !Fu(a) || e.draggable && a.startsWith("onDrag")) && (i[a] = e[a]));
	return i;
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/render/svg/lowercase-elements.mjs
var Ru = [
	"animate",
	"circle",
	"defs",
	"desc",
	"ellipse",
	"g",
	"image",
	"line",
	"filter",
	"marker",
	"mask",
	"metadata",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"rect",
	"stop",
	"switch",
	"symbol",
	"svg",
	"text",
	"tspan",
	"use",
	"view"
];
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/render/dom/utils/is-svg-component.mjs
function zu(e) {
	return typeof e != "string" || e.includes("-") ? !1 : !!(Ru.indexOf(e) > -1 || /[A-Z]/u.test(e));
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/render/dom/use-render.mjs
function Bu(e, t, n, { latestValues: r }, i, a = !1, o, s) {
	let c = (o ?? zu(e) ? Nu : ju)(t, r, i, e), l = Lu(t, typeof e == "string", a, s), u = e === p.Fragment ? {} : {
		...l,
		...c,
		ref: n
	}, { children: d } = t, f = (0, p.useMemo)(() => sa(d) ? d.get() : d, [d]);
	return (0, p.createElement)(e, {
		...u,
		children: f
	});
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/motion/utils/use-visual-state.mjs
function Vu({ scrapeMotionValuesFromProps: e, createRenderState: t }, n, r, i) {
	return {
		latestValues: Hu(n, r, i, e),
		renderState: t()
	};
}
function Hu(e, t, n, r) {
	let i = {}, a = r(e, {});
	for (let e in a) i[e] = vo(a[e]);
	let { initial: o, animate: s } = e, c = lc(e), l = uc(e);
	t && l && !c && e.inherit !== !1 && (o === void 0 && (o = t.initial), s === void 0 && (s = t.animate));
	let u = n ? n.initial === !1 : !1;
	u ||= o === !1;
	let d = u ? s : o;
	if (d && typeof d != "boolean" && !ac(d)) {
		let t = Array.isArray(d) ? d : [d];
		for (let n = 0; n < t.length; n++) {
			let r = $i(e, t[n]);
			if (r) {
				let { transitionEnd: e, transition: t, ...n } = r;
				for (let e in n) {
					let t = n[e];
					if (Array.isArray(t)) {
						let e = u ? t.length - 1 : 0;
						t = t[e];
					}
					t !== null && (i[e] = t);
				}
				for (let t in e) i[t] = e[t];
			}
		}
	}
	return i;
}
var Uu = (e) => (t, n) => {
	let r = (0, p.useContext)(Cu), i = (0, p.useContext)(_), a = () => Vu(e, t, r, i);
	return n ? a() : h(a);
}, Wu = /*@__PURE__*/ Uu({
	scrapeMotionValuesFromProps: wc,
	createRenderState: Du
}), Gu = /*@__PURE__*/ Uu({
	scrapeMotionValuesFromProps: Jl,
	createRenderState: Mu
}), Ku = /* @__PURE__ */ Symbol.for("motionComponentSymbol");
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/motion/utils/use-motion-ref.mjs
function qu(e, t, n) {
	let r = (0, p.useRef)(n);
	(0, p.useInsertionEffect)(() => {
		r.current = n;
	});
	let i = (0, p.useRef)(null);
	return (0, p.useCallback)((n) => {
		n && e.onMount?.(n), t && (n ? t.mount(n) : t.unmount());
		let a = r.current;
		if (typeof a == "function") {
			if (n) {
				let e = a(n);
				typeof e == "function" && (i.current = e);
			} else i.current ? (i.current(), i.current = null) : a(n);
		} else a && (a.current = n);
	}, [t]);
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/context/SwitchLayoutGroupContext.mjs
var Ju = /* @__PURE__ */ (0, p.createContext)({});
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/motion/utils/use-visual-element.mjs
function Yu(e, t, n, r, i, a) {
	let { visualElement: o } = (0, p.useContext)(Cu), s = (0, p.useContext)(gu), c = (0, p.useContext)(_), l = (0, p.useContext)(nu), u = l.reducedMotion, d = l.skipAnimations, f = (0, p.useRef)(null), m = (0, p.useRef)(!1);
	r ||= s.renderer, !f.current && r && (f.current = r(e, {
		visualState: t,
		parent: o,
		props: n,
		presenceContext: c,
		blockInitialAnimation: c ? c.initial === !1 : !1,
		reducedMotionConfig: u,
		skipAnimations: d,
		isSVG: a
	}), m.current && f.current && (f.current.manuallyAnimateOnMount = !0));
	let h = f.current, v = (0, p.useContext)(Ju);
	h && !h.projection && i && (h.type === "html" || h.type === "svg") && i.create(h, n, v), (0, p.useInsertionEffect)(() => {
		h && h.props !== n && h.update(n, c);
	});
	let y = n[ua], b = (0, p.useRef)(!!y && typeof window < "u" && !window.MotionHandoffIsComplete?.(y) && window.MotionHasOptimisedAnimation?.(y));
	return g(() => {
		m.current && h && (h.animationState?.animateChanges(), h.enteringChildren = void 0);
	}, []), g(() => {
		m.current = !0, h && (window.MotionIsMounted = !0, h.updateFeatures(), h.scheduleRenderMicrotask(), b.current && h.animationState && h.animationState.animateChanges());
	}), (0, p.useEffect)(() => {
		h && (!b.current && h.animationState && h.animationState.animateChanges(), b.current &&= (queueMicrotask(() => {
			window.MotionHandoffMarkAsComplete?.(y);
		}), !1), h.enteringChildren = void 0);
	}), h;
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/motion/index.mjs
function Xu(e, { forwardMotionProps: t = !1, type: n } = {}, r, i) {
	r && xu(r);
	let a = n ? n === "svg" : zu(e), o = a ? Gu : Wu;
	function s(n, s) {
		let c, l = Zu(n);
		h(() => !!nc.current?.sharedNodes.get(l)?.lead && n.initial) && (n = {
			...n,
			initial: !1
		});
		let u = {
			...(0, p.useContext)(nu),
			...n,
			layoutId: l
		}, { isStatic: d, isValidProp: f } = u, m = Tu(n), g = o(n, d);
		if (!d && typeof window < "u") {
			Qu(u, r);
			let t = $u(u);
			m.visualElement = Yu(e, g, u, i, t.ProjectionNode, a), (t.isEnabled || m.visualElement?.projection?.options.layoutId) && (c = t.MeasureLayout);
		}
		return (0, q.jsxs)(Cu.Provider, {
			value: m,
			children: [c && m.visualElement ? (0, q.jsx)(c, {
				visualElement: m.visualElement,
				...u
			}) : null, Bu(e, n, qu(g, m.visualElement, s), g, d, t, a, f)]
		});
	}
	s.displayName = `motion.${typeof e == "string" ? e : `create(${e.displayName ?? e.name ?? ""})`}`;
	let c = (0, p.forwardRef)(s);
	return c[Ku] = e, c;
}
function Zu({ layoutId: e }) {
	let t = (0, p.useContext)(m).id;
	return t && e !== void 0 ? t + "-" + e : e;
}
function Qu(e, t) {
	(0, p.useContext)(gu).strict;
}
function $u(e) {
	let { drag: t, layout: n } = bu();
	if (!t && !n) return {};
	let r = {
		...t,
		...n
	};
	return {
		MeasureLayout: r.MeasureLayout,
		isEnabled: t?.isEnabled(e) || n?.isEnabled(e),
		ProjectionNode: r.ProjectionNode
	};
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/render/components/create-proxy.mjs
function ed(e, t) {
	if (typeof Proxy > "u") return Xu;
	let n = /* @__PURE__ */ new Map(), r = (n, r) => Xu(n, r, e, t);
	return new Proxy((e, t) => r(e, t), { get: (i, a) => a === "create" ? r : (n.has(a) || n.set(a, Xu(a, void 0, e, t)), n.get(a)) });
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/render/dom/create-visual-element.mjs
var td = (e, t) => t.isSVG ?? zu(e) ? new Yl(t) : new Ec(t, { allowProjection: e !== p.Fragment }), nd = class extends Wl {
	constructor(e) {
		super(e), e.animationState ||= $l(e);
	}
	updateAnimationControlsSubscription() {
		let { animate: e } = this.node.getProps();
		ac(e) && (this.unmountControls = e.subscribe(this.node));
	}
	mount() {
		this.updateAnimationControlsSubscription();
	}
	update() {
		this.node.getProps().animate !== this.node.prevProps?.animate && this.updateAnimationControlsSubscription();
	}
	unmount() {
		this.node.animationState.reset(), this.unmountControls?.();
	}
}, rd = 0, id = {
	animation: { Feature: nd },
	exit: { Feature: class extends Wl {
		constructor() {
			super(...arguments), this.id = rd++;
		}
		update() {
			let { presenceContext: e, animationState: t } = this.node;
			if (!e || !t) return;
			let { isPresent: n, onExitComplete: r } = e;
			if (n === !this.exit) return;
			if (n) {
				if (this.exit === !0) {
					let { initial: e } = this.node.getProps();
					if (e && !Array.isArray(e)) {
						let { transition: t, transitionEnd: n, ...r } = ea(this.node, e) || {};
						for (let e in r) this.node.getValue(e)?.jump(r[e]);
					}
					this.node.blockInitialAnimation = !1, t.reset(), t.animateChanges();
				} else t.setActive("exit", !1);
				this.exit = void 0;
				return;
			}
			let i = this.exit = t.setActive("exit", !0);
			r && i.then(() => {
				this.exit === i && (this.exit = !0, r(this.id));
			});
		}
		mount() {
			let { register: e } = this.node.presenceContext || {};
			e && (this.unmount = e(this.id, this.node)), this.update();
		}
		unmount() {}
	} }
}, ad = class extends Wl {
	constructor(e) {
		super(e), this.removeGroupControls = E, this.removeListeners = E, this.controls = new Sl(e);
	}
	mount() {
		let { dragControls: e } = this.node.getProps();
		e && (this.removeGroupControls = e.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || E;
	}
	update() {
		let { dragControls: e, drag: t } = this.node.getProps(), { dragControls: n, drag: r } = this.node.prevProps || {};
		e !== n && (this.removeGroupControls(), e && (this.removeGroupControls = e.subscribe(this.controls))), r && !t && this.controls.stop(void 0, void 0, r);
	}
	unmount() {
		this.removeGroupControls(), this.removeListeners(), this.controls.isDragging || this.controls.endPanSession();
	}
}, od = (e) => (t, n) => {
	e && Ot.update(() => e(t, n), !1, !0);
}, sd = class extends Wl {
	constructor() {
		super(...arguments), this.removePointerDownListener = E;
	}
	onPointerDown(e) {
		this.session = new Jc(e, this.createPanHandlers(), {
			transformPagePoint: this.node.getTransformPagePoint(),
			contextWindow: this.node.current?.ownerDocument.defaultView
		});
	}
	createPanHandlers() {
		let { onPanSessionStart: e, onPanStart: t, onPan: n, onPanEnd: r } = this.node.getProps();
		return {
			onSessionStart: od(e),
			onStart: od(t),
			onMove: od(n),
			onEnd: (e, t) => {
				delete this.session, r && Ot.postRender(() => r(e, t));
			}
		};
	}
	mount() {
		this.removePointerDownListener = Ac(this.node.current, "pointerdown", (e) => this.onPointerDown(e));
	}
	update() {
		this.session?.updateHandlers(this.createPanHandlers());
	}
	unmount() {
		this.removePointerDownListener(), this.session?.end();
	}
}, cd = !1, ld = ({ layout: e, layoutDependency: t, layoutAnchor: n }) => ({
	layout: e,
	layoutDependency: t,
	layoutAnchor: n,
	animationType: typeof e == "string" ? e : "both"
}), ud = (e, t) => {
	let { snapshot: n } = e, r = e.getStack();
	r?.remove(e);
	let i = r?.lead;
	if (r?.prevLead === e && i.resumeFrom === e && (i.resumeFrom = i.currentAnimation = e.resumingFrom = void 0), e.options.layoutId = t, !t) e.needsShow = !0;
	else return e.root.registerSharedNode(t, e), () => {
		let { resumeFrom: t } = e;
		t?.isPresent !== !1 && e.getStack().members.includes(t) && (t.hide(), e.resumeFrom = void 0, e.snapshot = n);
	};
}, dd = class extends p.Component {
	componentDidMount() {
		let { visualElement: e, layoutGroup: t, switchLayoutGroup: n, layoutId: r } = this.props, { projection: i } = e;
		i && (t.group?.add(i), r && n?.register?.(i), cd && i.root.didUpdate(), i.options.layoutId !== r && ud(i, r)?.(), i.addEventListener("animationComplete", () => this.safeToRemove()), i.setOptions({
			...i.options,
			...ld(this.props),
			onExitComplete: () => this.safeToRemove()
		})), bs.hasEverUpdated = !0;
	}
	getSnapshotBeforeUpdate(e) {
		let { layoutDependency: t, layoutId: n, visualElement: r, drag: i, isPresent: a } = this.props, { projection: o } = r;
		return o && (o.isPresent = a, this.takeOver = e.layoutId === n ? void 0 : (o.willUpdate(), ud(o, n)), o.setOptions({
			...o.options,
			...ld(this.props)
		}), cd = !0, i || e.layoutDependency !== t || t === void 0 || e.isPresent !== a ? o.willUpdate() : this.safeToRemove(), e.isPresent !== a && (a ? o.promote() : o.relegate() || Ot.postRender(() => {
			o.getStack()?.members.length || this.safeToRemove();
		}))), null;
	}
	componentDidUpdate() {
		let { projection: e } = this.props.visualElement;
		e && (this.takeOver?.(), e.root.didUpdate(), lo.postRender(() => {
			!e.currentAnimation && e.isLead() && this.safeToRemove();
		}));
	}
	componentWillUnmount() {
		let { visualElement: e, layoutGroup: t, switchLayoutGroup: n } = this.props, { projection: r } = e;
		cd = !0, r && (r.scheduleCheckAfterUnmount(), t.group?.remove(r), n?.deregister?.(r));
	}
	safeToRemove() {
		this.props.safeToRemove?.();
	}
	render() {
		return null;
	}
};
function fd(e) {
	let [t, n] = fu(), r = (0, p.useContext)(m);
	return (0, q.jsx)(dd, {
		...e,
		layoutGroup: r,
		switchLayoutGroup: (0, p.useContext)(Ju),
		isPresent: t,
		safeToRemove: n
	});
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/motion/features/drag.mjs
var pd = {
	pan: { Feature: sd },
	drag: {
		Feature: ad,
		ProjectionNode: rc,
		MeasureLayout: fd
	}
};
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/gestures/hover.mjs
function md(e, t, n, r, i) {
	let { props: a } = e, o = "while" + n;
	!i && e.animationState && a[o] && e.animationState.setActive(o, r === "Start");
	let s = a["on" + n + r];
	s && Ot.postRender(() => s(t, Oc(t)));
}
var hd = class extends Wl {
	mount() {
		let { current: e } = this.node;
		e && (this.unmount = jl(e, (e, t) => (md(this.node, t, "Hover", "Start"), (e) => md(this.node, e, "Hover", "End"))));
	}
	unmount() {}
}, gd = class extends Wl {
	constructor() {
		super(...arguments), this.isActive = !1;
	}
	onFocus() {
		let e = !1;
		try {
			e = this.node.current.matches(":focus-visible");
		} catch {
			e = !0;
		}
		e && this.node.animationState && (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
	}
	onBlur() {
		this.isActive && this.node.animationState && (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
	}
	mount() {
		this.unmount = D(ec(this.node.current, "focus", () => this.onFocus()), ec(this.node.current, "blur", () => this.onBlur()));
	}
	unmount() {}
};
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/gestures/press.mjs
function _d(e, t, n, r) {
	e.current instanceof HTMLButtonElement && e.current.disabled || md(e, t, "Tap", n, r);
}
var vd = class extends Wl {
	constructor() {
		super(...arguments), this.options = {};
	}
	mount() {
		let { current: e } = this.node;
		e && (this.update(), this.unmount = Ul(e, (e, t) => (_d(this.node, t, "Start"), {
			onComplete: (e, { success: t }) => _d(this.node, e, t ? "" : "Cancel"),
			onRepeat: () => _d(this.node, t, "", !0)
		}), this.options));
	}
	update() {
		let { options: e, node: t } = this, { globalTapTarget: n, propagate: r, tap: i } = t.props;
		for (let t in e) delete e[t];
		Object.assign(e, i, {
			useGlobalTarget: n,
			stopPropagation: r?.tap === !1
		});
	}
	unmount() {}
}, yd = /* @__PURE__ */ new WeakMap(), bd = /* @__PURE__ */ new WeakMap(), xd = (e) => {
	let t = yd.get(e.target);
	t && t(e);
}, Sd = (e) => {
	e.forEach(xd);
};
function Cd({ root: e, ...t }) {
	let n = e || document;
	bd.has(n) || bd.set(n, {});
	let r = bd.get(n), i = JSON.stringify(t);
	return r[i] || (r[i] = new IntersectionObserver(Sd, {
		root: e,
		...t
	})), r[i];
}
function wd(e, t, n) {
	let r = Cd(t);
	return yd.set(e, n), r.observe(e), () => {
		yd.delete(e), r.unobserve(e);
	};
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/motion/features/viewport/index.mjs
var Td = {
	some: 0,
	all: 1
}, Ed = class extends Wl {
	constructor() {
		super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
	}
	startObserver() {
		this.stopObserver?.();
		let { viewport: e = {} } = this.node.getProps(), { root: t, margin: n, amount: r = "some", once: i } = e, a = {
			root: t ? t.current : void 0,
			rootMargin: n,
			threshold: typeof r == "number" ? r : Td[r]
		}, o = (e) => {
			let { isIntersecting: t } = e;
			if (this.isInView === t || (this.isInView = t, i && !t && this.hasEnteredView)) return;
			t && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", t);
			let { onViewportEnter: n, onViewportLeave: r } = this.node.getProps(), a = t ? n : r;
			a && a(e);
		};
		this.stopObserver = wd(this.node.current, a, o);
	}
	mount() {
		this.startObserver();
	}
	update() {
		if (typeof IntersectionObserver > "u") return;
		let { props: e, prevProps: t } = this.node;
		[
			"amount",
			"margin",
			"root"
		].some(Dd(e, t)) && this.startObserver();
	}
	unmount() {
		this.stopObserver?.(), this.hasEnteredView = !1, this.isInView = !1;
	}
};
function Dd({ viewport: e = {} }, { viewport: t = {} } = {}) {
	return (n) => e[n] !== t[n];
}
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs
var Od = /*@__PURE__*/ ed(/* @__PURE__ */ Object.assign({}, id, {
	inView: { Feature: Ed },
	tap: { Feature: vd },
	focus: { Feature: gd },
	hover: { Feature: hd }
}, pd, { layout: {
	ProjectionNode: rc,
	MeasureLayout: fd
} }), td);
// node_modules/.pnpm/framer-motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs
function kd() {
	!pc.current && hc();
	let [e] = (0, p.useState)(fc.current);
	return e;
}
// node_modules/.pnpm/motion@14.14.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/motion/dist/es/react.mjs
var Ad = Od, jd = /* @__PURE__ */ o(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, S || (S = !0, O());
			else {
				var t = n(l);
				t !== null && j(x, t.startTime - e);
			}
		}
	}
	var S = !1, C = -1, w = 5, T = -1;
	function E() {
		return g ? !0 : !(e.unstable_now() - T < w);
	}
	function D() {
		if (g = !1, S) {
			var t = e.unstable_now();
			T = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(C), C = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && E());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && j(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? O() : S = !1;
			}
		}
	}
	var O;
	if (typeof y == "function") O = function() {
		y(D);
	};
	else if (typeof MessageChannel < "u") {
		var k = new MessageChannel(), A = k.port2;
		k.port1.onmessage = D, O = function() {
			A.postMessage(null);
		};
	} else O = function() {
		_(D, 0);
	};
	function j(t, n) {
		C = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : w = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, j(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, O()))), r;
	}, e.unstable_shouldYield = E, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), Md = /* @__PURE__ */ o(((e, t) => {
	t.exports = jd();
})), Nd = /* @__PURE__ */ o(((e) => {
	var t = f();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal"), o = Symbol.for("react.recoverable"), s = Symbol.for("react.optimistic_key");
	function c(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : r === s ? s : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var l = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function u(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.browser = function(e) {
		return {
			$$typeof: o,
			_reason: e
		};
	}, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return c(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = l.T, n = i.p;
		try {
			if (l.T = null, i.p = 2, e) return e();
		} finally {
			l.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = u(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = u(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0,
						fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = u(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = u(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0,
					fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return l.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return l.H.useHostTransitionStatus();
	}, e.version = "19.3.1";
})), Pd = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = Nd();
})), Fd = /* @__PURE__ */ o(((e) => {
	var t = Md(), n = f(), r = Pd();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		for (var t = e, n = t; n && !n.alternate;) t = n, t.flags & 4098 && (e = t.return), n = t.return;
		for (; t.return;) t = t.return;
		return t.tag === 3 ? e : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function u(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function d(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = d(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	function p(e, t, n, r, i, a) {
		for (; e !== null;) {
			if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, r, i, a) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && p(e.child, t, n, r, i, a)) return !0;
			e = e.sibling;
		}
		return !1;
	}
	function m(e) {
		for (e = e.return; e !== null;) {
			if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
			e = e.return;
		}
		return null;
	}
	function h(e) {
		var t = !1;
		for (e = e.return; e !== null && (e.tag === 4 && (t = !0), e.tag !== 3 && e.tag !== 5 && e.tag !== 27);) e = e.return;
		return t;
	}
	function g(e) {
		var t = [null, null], n = m(e);
		return n === null || _(t, e, n.child, { foundSelf: !1 }), t;
	}
	function _(e, t, n, r) {
		for (; n !== null;) {
			if (n === t) r.foundSelf = !0;
			else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
				if (r.foundSelf) return e[1] = n, !0;
				e[0] = n;
			} else if ((n.tag !== 22 || n.memoizedState === null) && _(e, t, n.child, r)) return !0;
			n = n.sibling;
		}
		return !1;
	}
	function v(e) {
		switch (e.tag) {
			case 5:
			case 27:
			case 6: return e.stateNode;
			case 3: return e.stateNode.containerInfo;
			default: throw Error(i(559));
		}
	}
	var y = null, b = null;
	function x(e, t, n) {
		return e === n || e === t && (y = e, !0);
	}
	function S(e, t, n) {
		return e === n ? (b = e, !1) : e === t && (b !== null && (y = e), !0);
	}
	function C(e) {
		if (e === null) return null;
		do
			e = e === null ? null : e.return;
		while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
		return e || null;
	}
	function w(e, t, n) {
		for (var r = 0, i = e; i; i = n(i)) r++;
		i = 0;
		for (var a = t; a; a = n(a)) i++;
		for (; 0 < r - i;) e = n(e), r--;
		for (; 0 < i - r;) t = n(t), i--;
		for (; r--;) {
			if (e === t || t !== null && e === t.alternate) return e;
			e = n(e), t = n(t);
		}
		return null;
	}
	var T = Object.assign, E = Symbol.for("react.element"), D = Symbol.for("react.transitional.element"), O = Symbol.for("react.portal"), k = Symbol.for("react.fragment"), A = Symbol.for("react.strict_mode"), j = Symbol.for("react.profiler"), M = Symbol.for("react.consumer"), N = Symbol.for("react.context"), P = Symbol.for("react.forward_ref"), F = Symbol.for("react.suspense"), I = Symbol.for("react.suspense_list"), L = Symbol.for("react.memo"), R = Symbol.for("react.lazy"), ee = Symbol.for("react.activity"), te = Symbol.for("react.legacy_hidden"), ne = Symbol.for("react.memo_cache_sentinel"), z = Symbol.for("react.view_transition"), re = Symbol.for("react.recoverable"), ie = Symbol.iterator;
	function B(e) {
		return typeof e != "object" || !e ? null : (e = ie && e[ie] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var ae = Symbol.for("react.client.reference");
	function oe(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === ae ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case k: return "Fragment";
			case j: return "Profiler";
			case A: return "StrictMode";
			case F: return "Suspense";
			case I: return "SuspenseList";
			case ee: return "Activity";
			case z: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case O: return "Portal";
			case N: return e.displayName || "Context";
			case M: return (e._context.displayName || "Context") + ".Consumer";
			case P:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case L: return t = e.displayName || null, t === null ? oe(e.type) || "Memo" : t;
			case R:
				t = e._payload, e = e._init;
				try {
					return oe(e(t));
				} catch {}
		}
		return null;
	}
	var se = Array.isArray, V = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, H = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ce = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, le = [], ue = -1;
	function de(e) {
		return { current: e };
	}
	function U(e) {
		0 > ue || (e.current = le[ue], le[ue] = null, ue--);
	}
	function W(e, t) {
		ue++, le[ue] = e.current, e.current = t;
	}
	var fe = de(null), pe = de(null), me = de(null), he = de(null);
	function ge(e, t) {
		switch (W(me, t), W(pe, e), W(fe, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? pp(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = pp(t), e = mp(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		U(fe), W(fe, e);
	}
	function _e() {
		U(fe), U(pe), U(me);
	}
	function ve(e) {
		var t = e.memoizedState;
		t !== null && (uh._currentValue = t.memoizedState, W(he, e)), t = fe.current;
		var n = mp(t, e.type);
		t !== n && (W(pe, e), W(fe, n));
	}
	function ye(e) {
		pe.current === e && (U(fe), U(pe)), he.current === e && (U(he), uh._currentValue = ce);
	}
	var be, xe;
	function Se(e) {
		if (be === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			be = t && t[1] || "", xe = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + be + e + xe;
	}
	var Ce = !1;
	function we(e, t) {
		if (!e || Ce) return "";
		Ce = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							n = !1;
							try {
								var i = Object.getOwnPropertyDescriptor(e.prototype, "props");
								Object.defineProperty(e.prototype, "props", {
									configurable: !0,
									set: function() {
										throw Error();
									}
								}), n = !0, new e();
							} finally {
								n && (i === void 0 ? delete e.prototype.props : Object.defineProperty(e.prototype, "props", i));
							}
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			Ce = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Se(n) : "";
	}
	function Te(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Se(e.type);
			case 16: return Se("Lazy");
			case 13: return e.child !== t && t !== null ? Se("Suspense Fallback") : Se("Suspense");
			case 19: return Se("SuspenseList");
			case 0:
			case 15: return we(e.type, !1);
			case 11: return we(e.type.render, !1);
			case 1: return we(e.type, !0);
			case 31: return Se("Activity");
			case 30: return Se("ViewTransition");
			default: return "";
		}
	}
	function Ee(e) {
		try {
			var t = "", n = null;
			do
				t += Te(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var De = Object.prototype.hasOwnProperty, Oe = t.unstable_scheduleCallback, ke = t.unstable_cancelCallback, Ae = t.unstable_shouldYield, je = t.unstable_requestPaint, Me = t.unstable_now, Ne = t.unstable_getCurrentPriorityLevel, Pe = t.unstable_ImmediatePriority, G = t.unstable_UserBlockingPriority, Fe = t.unstable_NormalPriority, Ie = t.unstable_LowPriority, Le = t.unstable_IdlePriority, Re = t.log, ze = t.unstable_setDisableYieldValue, Be = null, Ve = null;
	function He(e) {
		if (typeof Re == "function" && ze(e), Ve && typeof Ve.setStrictMode == "function") try {
			Ve.setStrictMode(Be, e);
		} catch {}
	}
	var Ue = Math.clz32 ? Math.clz32 : Ke, We = Math.log, Ge = Math.LN2;
	function Ke(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (We(e) / Ge | 0) | 0;
	}
	var qe = 256, Je = 262144, Ye = 4194304;
	function Xe(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & -e;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function Ze(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = Xe(n))) : i = Xe(o) : i = Xe(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = Xe(n))) : i = Xe(o)) : i = Xe(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function Qe(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function $e(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - Ue(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function et(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function tt() {
		var e = Ye;
		return Ye <<= 1, !(Ye & 62914560) && (Ye = 4194304), e;
	}
	function nt(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function rt(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function it(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - Ue(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && at(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function at(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - Ue(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function ot(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - Ue(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function st(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : K(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function K(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function ct(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function lt() {
		var e = H.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Eh(e.type)) : e;
	}
	function ut(e, t) {
		var n = H.p;
		try {
			return H.p = e, t();
		} finally {
			H.p = n;
		}
	}
	var dt = Math.random().toString(36).slice(2), ft = "__reactFiber$" + dt, pt = "__reactProps$" + dt, mt = "__reactContainer$" + dt, ht = "__reactEvents$" + dt, gt = "__reactListeners$" + dt, _t = "__reactHandles$" + dt, vt = "__reactResources$" + dt, yt = "__reactMarker$" + dt, bt = "__reactLoad$" + dt;
	function xt(e) {
		delete e[ft], delete e[pt], delete e[gt], delete e[_t];
	}
	function St(e) {
		var t;
		if (t = e[ft]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[mt] || n[ft]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = hm(e); e !== null;) {
					if (n = e[ft]) return n;
					e = hm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function Ct(e) {
		if (e = e[ft] || e[mt]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function wt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Tt(e) {
		var t = e[vt];
		return t ||= e[vt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function Et(e) {
		e[yt] = !0;
	}
	function Dt(e) {
		e[bt] = void 0;
	}
	var Ot = /* @__PURE__ */ new Set(), kt = {};
	function At(e, t) {
		jt(e, t), jt(e + "Capture", t);
	}
	function jt(e, t) {
		for (kt[e] = t, e = 0; e < t.length; e++) Ot.add(t[e]);
	}
	var Mt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Nt = {}, Pt = {};
	function Ft(e) {
		return De.call(Pt, e) ? !0 : De.call(Nt, e) ? !1 : Mt.test(e) ? Pt[e] = !0 : (Nt[e] = !0, !1);
	}
	var It = !1;
	function Lt() {
		var e = It;
		return It = !1, e;
	}
	function Rt(e, t, n) {
		if (Ft(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, n);
			}
		}
	}
	function zt(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, n);
		}
	}
	function Bt(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, r);
		}
	}
	function Vt(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function Ht(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Ut(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function Wt(e) {
		if (!e._valueTracker) {
			var t = Ht(e) ? "checked" : "value";
			e._valueTracker = Ut(e, t, "" + e[t]);
		}
	}
	function Gt(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Ht(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var Kt = /[\n"\\]/g;
	function qt(e) {
		return e.replace(Kt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function Jt(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Vt(t)) : e.value !== "" + Vt(t) && (e.value = "" + Vt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Xt(e, Vt(n)) : o === "number" && e.value == t ? Xt(e, Vt(e.value)) : Xt(e, Vt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Vt(s) : e.removeAttribute("name");
	}
	function Yt(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Wt(e);
				return;
			}
			n = n == null ? "" : "" + Vt(n), t = t == null ? n : "" + Vt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Wt(e);
	}
	function Xt(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function Zt(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Vt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function Qt(e, t, n) {
		t != null && (t = "" + Vt(t), t !== e.value && (e.value = t), n == null) ? e.defaultValue !== t && (e.defaultValue = t) : e.defaultValue = n == null ? "" : "" + Vt(n);
	}
	function $t(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (se(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Vt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Wt(e);
	}
	function en(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var tn = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function nn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || tn.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function rn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", It = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (nn(e, a, r), It = !0);
		} else for (var o in t) t.hasOwnProperty(o) && nn(e, o, t[o]);
	}
	function an(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var on = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["maskType", "mask-type"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), sn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function cn(e) {
		return sn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function ln() {}
	var un = null;
	function dn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var fn = null, pn = null;
	function mn(e) {
		var t = Ct(e);
		if (t && (e = t.stateNode)) {
			var n = e[pt] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (Jt(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + qt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[pt] || null;
								if (!a) throw Error(i(90));
								Jt(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && Gt(r);
					}
					break a;
				case "textarea":
					Qt(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Zt(e, !!n.multiple, t, !1);
			}
		}
	}
	var hn = !1;
	function gn(e, t, n) {
		if (hn) return e(t, n);
		hn = !0;
		try {
			return e(t);
		} finally {
			if (hn = !1, (fn !== null || pn !== null) && (Hd(), fn && (t = fn, e = pn, pn = fn = null, mn(t), e))) for (t = 0; t < e.length; t++) mn(e[t]);
		}
	}
	function _n(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[pt] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var vn = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, yn = !1;
	if (vn) try {
		var bn = {};
		Object.defineProperty(bn, "passive", { get: function() {
			yn = !0;
		} }), window.addEventListener("test", bn, bn), window.removeEventListener("test", bn, bn);
	} catch {
		yn = !1;
	}
	var xn = null, Sn = null, Cn = null;
	function wn() {
		if (Cn) return Cn;
		var e, t = Sn, n = t.length, r, i = "value" in xn ? xn.value : xn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Cn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function Tn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function En() {
		return !0;
	}
	function Dn() {
		return !1;
	}
	function On(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? En : Dn, this.isPropagationStopped = Dn, this;
		}
		return T(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = En);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = En);
			},
			persist: function() {},
			isPersistent: En
		}), t;
	}
	var kn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, An = On(kn), jn = T({}, kn, {
		view: 0,
		detail: 0
	}), Mn = On(jn), Nn, Pn, Fn, In = T({}, jn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: qn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Fn && (Fn && e.type === "mousemove" ? (Nn = e.screenX - Fn.screenX, Pn = e.screenY - Fn.screenY) : Pn = Nn = 0, Fn = e), Nn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Pn;
		}
	}), Ln = On(In), Rn = On(T({}, In, { dataTransfer: 0 })), zn = On(T({}, jn, { relatedTarget: 0 })), Bn = On(T({}, kn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Vn = On(T({}, kn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Hn = On(T({}, kn, { data: 0 })), Un = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, Wn = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, Gn = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function Kn(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = Gn[e]) ? !!t[e] : !1;
	}
	function qn() {
		return Kn;
	}
	var Jn = On(T({}, jn, {
		key: function(e) {
			if (e.key) {
				var t = Un[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = Tn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Wn[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: qn,
		charCode: function(e) {
			return e.type === "keypress" ? Tn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? Tn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), Yn = On(T({}, In, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), Xn = On(T({}, kn, { submitter: 0 })), Zn = On(T({}, jn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: qn
	})), Qn = On(T({}, kn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), $n = On(T({}, In, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), er = On(T({}, kn, {
		newState: 0,
		oldState: 0,
		source: 0
	})), tr = [
		9,
		13,
		27,
		32
	], nr = vn && "CompositionEvent" in window, rr = null;
	vn && "documentMode" in document && (rr = document.documentMode);
	var ir = vn && "TextEvent" in window && !rr, ar = vn && (!nr || rr && 8 < rr && 11 >= rr), or = " ", sr = !1;
	function cr(e, t) {
		switch (e) {
			case "keyup": return tr.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function lr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var ur = !1;
	function dr(e, t) {
		switch (e) {
			case "compositionend": return lr(t);
			case "keypress": return t.which === 32 ? (sr = !0, or) : null;
			case "textInput": return e = t.data, e === or && sr ? null : e;
			default: return null;
		}
	}
	function fr(e, t) {
		if (ur) return e === "compositionend" || !nr && cr(e, t) ? (e = wn(), Cn = Sn = xn = null, ur = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return ar && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var pr = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function mr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!pr[e.type] : t === "textarea";
	}
	function hr(e, t, n, r) {
		fn ? pn ? pn.push(r) : pn = [r] : fn = r, t = Xf(t, "onChange"), 0 < t.length && (n = new An("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var gr = null, _r = null;
	function vr(e) {
		Uf(e, 0);
	}
	function yr(e) {
		if (Gt(wt(e))) return e;
	}
	function br(e, t) {
		if (e === "change") return t;
	}
	var xr = !1;
	if (vn) {
		var Sr;
		if (vn) {
			var Cr = "oninput" in document;
			if (!Cr) {
				var wr = document.createElement("div");
				wr.setAttribute("oninput", "return;"), Cr = typeof wr.oninput == "function";
			}
			Sr = Cr;
		} else Sr = !1;
		xr = Sr && (!document.documentMode || 9 < document.documentMode);
	}
	function Tr() {
		gr && (gr.detachEvent("onpropertychange", Er), _r = gr = null);
	}
	function Er(e) {
		if (e.propertyName === "value" && yr(_r)) {
			var t = [];
			hr(t, _r, e, dn(e)), gn(vr, t);
		}
	}
	function Dr(e, t, n) {
		e === "focusin" ? (Tr(), gr = t, _r = n, gr.attachEvent("onpropertychange", Er)) : e === "focusout" && Tr();
	}
	function Or(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return yr(_r);
	}
	function kr(e, t) {
		if (e === "click") return yr(t);
	}
	function Ar(e, t) {
		if (e === "input" || e === "change") return yr(t);
	}
	function jr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Mr = typeof Object.is == "function" ? Object.is : jr;
	function Nr(e, t) {
		if (Mr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!De.call(t, i) || !Mr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Pr(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function Fr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Ir(e, t) {
		var n = Fr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = Fr(n);
		}
	}
	function Lr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Lr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Rr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Pr(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Pr(e.document);
		}
		return t;
	}
	function zr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Br = vn && "documentMode" in document && 11 >= document.documentMode, Vr = null, Hr = null, Ur = null, Wr = !1;
	function Gr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Wr || Vr == null || Vr !== Pr(r) || (r = Vr, "selectionStart" in r && zr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Ur && Nr(Ur, r) || (Ur = r, r = Xf(Hr, "onSelect"), 0 < r.length && (t = new An("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Vr)));
	}
	function Kr(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var qr = {
		animationend: Kr("Animation", "AnimationEnd"),
		animationiteration: Kr("Animation", "AnimationIteration"),
		animationstart: Kr("Animation", "AnimationStart"),
		transitionrun: Kr("Transition", "TransitionRun"),
		transitionstart: Kr("Transition", "TransitionStart"),
		transitioncancel: Kr("Transition", "TransitionCancel"),
		transitionend: Kr("Transition", "TransitionEnd")
	}, Jr = {}, Yr = {};
	vn && (Yr = document.createElement("div").style, "AnimationEvent" in window || (delete qr.animationend.animation, delete qr.animationiteration.animation, delete qr.animationstart.animation), "TransitionEvent" in window || delete qr.transitionend.transition);
	function Xr(e) {
		if (Jr[e]) return Jr[e];
		if (!qr[e]) return e;
		var t = qr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Yr) return Jr[e] = t[n];
		return e;
	}
	var Zr = Xr("animationend"), Qr = Xr("animationiteration"), $r = Xr("animationstart"), ei = Xr("transitionrun"), ti = Xr("transitionstart"), ni = Xr("transitioncancel"), ri = Xr("transitionend"), ii = /* @__PURE__ */ new Map(), ai = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	ai.push("scrollEnd");
	function oi(e, t) {
		ii.set(e, t), At(t, [e]);
	}
	var si = 0;
	function ci(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = xd.identifierPrefix;
		var n = si++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function li(e) {
		if (e == null || typeof e == "string") return e;
		var t = null, n = kd;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = e[n[r]];
			if (i != null) {
				if (i === "none") return "none";
				t = t == null ? i : t + (" " + i);
			}
		}
		return t ?? e.default;
	}
	function ui(e, t) {
		return e = li(e), t = li(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var di = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, fi = [], pi = 0, mi = 0;
	function hi() {
		for (var e = pi, t = mi = pi = 0; t < e;) {
			var n = fi[t];
			fi[t++] = null;
			var r = fi[t];
			fi[t++] = null;
			var i = fi[t];
			fi[t++] = null;
			var a = fi[t];
			if (fi[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && yi(n, i, a);
		}
	}
	function gi(e, t, n, r) {
		fi[pi++] = e, fi[pi++] = t, fi[pi++] = n, fi[pi++] = r, mi |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function _i(e, t, n, r) {
		return gi(e, t, n, r), bi(e);
	}
	function vi(e, t) {
		return gi(e, null, null, t), bi(e);
	}
	function yi(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - Ue(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function bi(e) {
		if (50 < Ad) throw Ad = 0, jd = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var xi = {};
	function Si(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function Ci(e, t, n, r) {
		return new Si(e, t, n, r);
	}
	function wi(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function Ti(e, t) {
		var n = e.alternate;
		return n === null ? (n = Ci(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Ei(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function Di(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") wi(r) && (s = 1);
		else if (typeof r == "string") s = Xm(e, n, fe.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case ee: return e = Ci(31, n, t, a), e.elementType = ee, e.lanes = o, e;
			case k: return Oi(n.children, a, o, t);
			case A:
				s = 8, a |= 24;
				break;
			case j: return e = Ci(12, n, t, a | 2), e.elementType = j, e.lanes = o, e;
			case F: return e = Ci(13, n, t, a), e.elementType = F, e.lanes = o, e;
			case I: return e = Ci(19, n, t, a), e.elementType = I, e.lanes = o, e;
			case te:
			case z: return e = a | 32, e = Ci(30, n, t, e), e.elementType = z, e.lanes = o, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case N:
						s = 10;
						break a;
					case M:
						s = 9;
						break a;
					case P:
						s = 11;
						break a;
					case L:
						s = 14;
						break a;
					case R:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = Ci(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function Oi(e, t, n, r) {
		return e = Ci(7, e, r, t), e.lanes = n, e;
	}
	function ki(e, t, n) {
		return e = Ci(6, e, null, t), e.lanes = n, e;
	}
	function Ai(e) {
		var t = Ci(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function ji(e, t, n) {
		return t = Ci(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Mi = /* @__PURE__ */ new WeakMap();
	function Ni(e, t) {
		if (typeof e == "object" && e) {
			var n = Mi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: Ee(t)
			}, Mi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: Ee(t)
		};
	}
	var Pi = [], Fi = 0, Ii = null, Li = 0, Ri = [], zi = 0, Bi = null, Vi = 1, Hi = "";
	function Ui(e, t) {
		Pi[Fi++] = Li, Pi[Fi++] = Ii, Ii = e, Li = t;
	}
	function Wi(e, t, n) {
		Ri[zi++] = Vi, Ri[zi++] = Hi, Ri[zi++] = Bi, Bi = e;
		var r = Vi;
		e = Hi;
		var i = 32 - Ue(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - Ue(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Vi = 1 << 32 - Ue(t) + i | n << i | r, Hi = a + e;
		} else Vi = 1 << a | n << i | r, Hi = e;
	}
	function Gi(e) {
		e.return !== null && (Ui(e, 1), Wi(e, 1, 0));
	}
	function Ki(e) {
		for (; e === Ii;) Ii = Pi[--Fi], Pi[Fi] = null, Li = Pi[--Fi], Pi[Fi] = null;
		for (; e === Bi;) Bi = Ri[--zi], Ri[zi] = null, Hi = Ri[--zi], Ri[zi] = null, Vi = Ri[--zi], Ri[zi] = null;
	}
	function qi(e, t) {
		Ri[zi++] = Vi, Ri[zi++] = Hi, Ri[zi++] = Bi, Vi = t.id, Hi = t.overflow, Bi = e;
	}
	var Ji = null, Yi = null, Xi = !1, Zi = null, Qi = !1, $i = Error(i(519));
	function ea(e) {
		throw oa(Ni(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), $i;
	}
	function ta(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[ft] = e, t[pt] = r, n) {
			case "dialog":
				Wf("cancel", t), Wf("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				Wf("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < Y.length; n++) Wf(Y[n], t);
				break;
			case "source":
				Wf("error", t);
				break;
			case "img":
			case "image":
			case "link":
				Wf("error", t), Wf("load", t);
				break;
			case "details":
				Wf("toggle", t);
				break;
			case "input":
				Wf("invalid", t), Yt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Wf("invalid", t);
				break;
			case "textarea": Wf("invalid", t), $t(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || np(t.textContent, n) ? (r.popover != null && (Wf("beforetoggle", t), Wf("toggle", t)), r.onScroll != null && Wf("scroll", t), r.onScrollEnd != null && Wf("scrollend", t), r.onClick != null && (t.onclick = ln), t = !0) : t = !1, t || ea(e, !0);
	}
	function na(e) {
		for (Ji = e.return; Ji;) switch (Ji.tag) {
			case 5:
			case 31:
			case 13:
				Qi = !1;
				return;
			case 27:
			case 3:
				Qi = !0;
				return;
			default: Ji = Ji.return;
		}
	}
	function ra(e) {
		if (e !== Ji) return !1;
		if (!Xi) return na(e), Xi = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || gp(e.type, e.memoizedProps)), n = !n), n && Yi && ea(e), na(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Yi = mm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Yi = mm(e);
		} else t === 27 ? (t = Yi, Tp(e.type) ? (e = pm, pm = null, Yi = e) : Yi = t) : Yi = Ji ? fm(e.stateNode.nextSibling) : null;
		return !0;
	}
	function ia() {
		Yi = Ji = null, Xi = !1;
	}
	function aa() {
		var e = Zi;
		return e !== null && (pd === null ? pd = e : pd.push.apply(pd, e), Zi = null), e;
	}
	function oa(e) {
		Zi === null ? Zi = [e] : Zi.push(e);
	}
	var sa = de(null), ca = null, la = null;
	function ua(e, t, n) {
		W(sa, t._currentValue), t._currentValue = n;
	}
	function da(e) {
		e._currentValue = sa.current, U(sa);
	}
	function fa(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function pa(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), fa(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), fa(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), fa(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function ma(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					Mr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === he.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [uh] : e.push(uh));
			}
			a = a.return;
		}
		return e !== null && pa(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function ha(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Mr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function ga(e) {
		ca = e, la = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function _a(e) {
		return ya(ca, e);
	}
	function va(e, t) {
		return ca === null && ga(e), ya(e, t);
	}
	function ya(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, la === null) {
			if (e === null) throw Error(i(308));
			la = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else la = la.next = t;
		return n;
	}
	var ba = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, xa = t.unstable_scheduleCallback, Sa = t.unstable_NormalPriority, Ca = {
		$$typeof: N,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function wa() {
		return {
			controller: new ba(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function Ta(e) {
		e.refCount--, e.refCount === 0 && xa(Sa, function() {
			e.controller.abort();
		});
	}
	function Ea(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var Da = null;
	function Oa(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var ka = null, Aa = 0, ja = 0, Ma = null;
	function Na(e, t) {
		if (ka === null) {
			var n = ka = [];
			Aa = 0, ja = Lf(), Ma = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return Aa++, t.then(Pa, Pa), t;
	}
	function Pa() {
		if (--Aa === 0 && (Da = null, ka !== null)) {
			Ma !== null && (Ma.status = "fulfilled");
			var e = ka;
			ka = null, ja = 0, Ma = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function Fa(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var Ia = V.S;
	V.S = function(e, t) {
		if (gd = Me(), typeof t == "object" && t && typeof t.then == "function" && Na(e, t), Da !== null) for (var n = wf; n !== null;) Ea(n, Da), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = wf; r !== null;) Ea(r, n), r = r.next;
			if (ja !== 0) {
				r = Da, r === null && (r = Da = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		Ia !== null && Ia(e, t);
	};
	var La = de(null);
	function Ra() {
		var e = La.current;
		return e === null ? Zu.pooledCache : e;
	}
	function za(e, t) {
		t === null ? W(La, La.current) : W(La, t.pool);
	}
	function Ba() {
		var e = Ra();
		return e === null ? null : {
			parent: Ca._currentValue,
			pool: e
		};
	}
	var Va = Error(i(460)), Ha = Error(i(474)), Ua = Error(i(542)), Wa = { then: function() {} };
	function Ga(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function Ka(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(ln, ln), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, Xa(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(ln, ln);
				else {
					if (e = Zu, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, Xa(e), e;
				}
				throw Ja = t, Va;
		}
	}
	function qa(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (Ja = e, Va) : e;
		}
	}
	var Ja = null;
	function Ya() {
		if (Ja === null) throw Error(i(459));
		var e = Ja;
		return Ja = null, e;
	}
	function Xa(e) {
		if (e === Va || e === Ua) throw Error(i(483));
	}
	var Za = null, Qa = 0;
	function $a(e) {
		var t = Qa;
		return Qa += 1, Za === null && (Za = []), Ka(Za, e, t);
	}
	function eo(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function to(e, t) {
		throw t.$$typeof === E ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function no(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = Ti(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = ki(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === k ? (e = d(e, t, n.props.children, r, n.key), eo(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === R && qa(i) === t.type) ? (t = a(t, n.props), eo(t, n), t.return = e, t) : (t = Di(n.type, n.key, n.props, null, e.mode, r), eo(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = ji(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = Oi(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = ki("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case D: return n = Di(t.type, t.key, t.props, null, e.mode, n), eo(n, t), n.return = e, n;
					case O: return t = ji(t, e.mode, n), t.return = e, t;
					case R: return t = qa(t), f(e, t, n);
				}
				if (se(t) || B(t)) return t = Oi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, $a(t), n);
				if (t.$$typeof === N) return f(e, va(e, t), n);
				to(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case D: return n.key === i ? l(e, t, n, r) : null;
					case O: return n.key === i ? u(e, t, n, r) : null;
					case R: return n = qa(n), p(e, t, n, r);
				}
				if (se(n) || B(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, $a(n), r);
				if (n.$$typeof === N) return p(e, t, va(e, n), r);
				to(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case D: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case O: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case R: return r = qa(r), m(e, t, n, r, i);
				}
				if (se(r) || B(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, $a(r), i);
				if (r.$$typeof === N) return m(e, t, n, va(t, r), i);
				to(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), Xi && Ui(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return Xi && Ui(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), Xi && Ui(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), Xi && Ui(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return Xi && Ui(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), Xi && Ui(a, g), u;
		}
		function _(e, r, o, c) {
			if (typeof o == "object" && o && o.type === k && o.key === null && o.props.ref === void 0 && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case D:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === k) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), eo(c, o), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === R && qa(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), eo(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === k ? (c = Oi(o.props.children, e.mode, c, o.key), eo(c, o), c.return = e, e = c) : (c = Di(o.type, o.key, o.props, null, e.mode, c), eo(c, o), c.return = e, e = c);
						}
						return s(e);
					case O:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = ji(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case R: return o = qa(o), _(e, r, o, c);
				}
				if (se(o)) return h(e, r, o, c);
				if (B(o)) {
					if (l = B(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, $a(o), c);
				if (o.$$typeof === N) return _(e, r, va(e, o), c);
				to(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = ki(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				Qa = 0;
				var i = _(e, t, n, r);
				return Za = null, i;
			} catch (t) {
				if (t === Va || t === Ua) throw t;
				var a = Ci(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var ro = no(!0), io = no(!1), ao = !1;
	function oo(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function so(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function co(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function lo(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, Xu & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = bi(e), yi(e, null, n), t;
		}
		return gi(e, r, t, n), bi(e);
	}
	function uo(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, ot(e, n);
		}
	}
	function fo(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
		} else e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var po = !1;
	function mo() {
		if (po) {
			var e = Ma;
			if (e !== null) throw e;
		}
	}
	function ho(e, t, n, r) {
		po = !1;
		var i = e.updateQueue;
		ao = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? ($u & f) === f : (r & f) === f) {
					f !== 0 && f === ja && (po = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, h = s;
						f = t;
						var g = n;
						switch (h.tag) {
							case 1:
								if (m = h.payload, typeof m == "function") {
									d = m.call(g, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = h.payload, f = typeof m == "function" ? m.call(g, d, f) : m, f == null) break a;
								d = T({}, d, f);
								break a;
							case 2: ao = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), sd |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function go(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function _o(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) go(n[e], t);
	}
	var vo = de(null), yo = de(0);
	function bo(e, t) {
		e = ad, W(yo, e), W(vo, t), ad = e | t.baseLanes;
	}
	function xo() {
		W(yo, ad), W(vo, vo.current);
	}
	function So() {
		ad = yo.current, U(vo), U(yo);
	}
	var Co = de(null), wo = null;
	function To(e) {
		var t = e.alternate;
		W(Ao, Ao.current & 1), W(Co, e), wo === null && (t === null || vo.current !== null || t.memoizedState !== null) && (wo = e);
	}
	function Eo(e) {
		W(Ao, Ao.current), W(Co, e), wo === null && (wo = e);
	}
	function Do(e) {
		e.tag === 22 ? (W(Ao, Ao.current), W(Co, e), wo === null && (wo = e)) : Oo();
	}
	function Oo() {
		W(Ao, Ao.current), W(Co, Co.current);
	}
	function ko(e) {
		U(Co), wo === e && (wo = null), U(Ao);
	}
	var Ao = de(0);
	function jo(e, t) {
		W(Co, Co.current), W(Ao, t);
	}
	function Mo(e) {
		U(Ao), U(Co), wo === e && (wo = null);
	}
	function No(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || lm(n) || um(n))) return t;
			} else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var Po = 0, Fo = null, Io = null, Lo = null, Ro = !1, zo = !1, Bo = !1, Vo = 0, Ho = 0, Uo = null, Wo = 0;
	function Go() {
		throw Error(i(321));
	}
	function Ko(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Mr(e[n], t[n])) return !1;
		return !0;
	}
	function qo(e, t, n, r, i, a) {
		return Po = a, Fo = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, V.H = e === null || e.memoizedState === null ? uc : dc, Bo = !1, a = n(r, i), Bo = !1, zo && (a = Yo(t, n, r, i)), Jo(e), a;
	}
	function Jo(e) {
		V.H = lc;
		var t = Io !== null && Io.next !== null;
		if (Po = 0, Lo = Io = Fo = null, Ro = !1, Ho = 0, Uo = null, t) throw Error(i(300));
		e === null || Oc || (e = e.dependencies, e !== null && ha(e) && (Oc = !0));
	}
	function Yo(e, t, n, r) {
		Fo = e;
		var a = 0;
		do {
			if (zo && (Uo = null), Ho = 0, zo = !1, 25 <= a) throw Error(i(301));
			if (a += 1, Lo = Io = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			V.H = fc, o = t(n, r);
		} while (zo);
		return o;
	}
	function Xo() {
		var e = V.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? rs(t) : t, e = e.useState()[0], (Io === null ? null : Io.memoizedState) !== e && (Fo.flags |= 1024), t;
	}
	function Zo() {
		var e = Vo !== 0;
		return Vo = 0, e;
	}
	function Qo(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function $o(e) {
		if (Ro) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			Ro = !1;
		}
		Po = 0, Lo = Io = Fo = null, zo = !1, Ho = Vo = 0, Uo = null;
	}
	function es() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return Lo === null ? Fo.memoizedState = Lo = e : Lo = Lo.next = e, Lo;
	}
	function ts() {
		if (Io === null) {
			var e = Fo.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = Io.next;
		var t = Lo === null ? Fo.memoizedState : Lo.next;
		if (t !== null) Lo = t, Io = e;
		else {
			if (e === null) throw Fo.alternate === null ? Error(i(467)) : Error(i(310));
			Io = e, e = {
				memoizedState: Io.memoizedState,
				baseState: Io.baseState,
				baseQueue: Io.baseQueue,
				queue: Io.queue,
				next: null
			}, Lo === null ? Fo.memoizedState = Lo = e : Lo = Lo.next = e;
		}
		return Lo;
	}
	function ns() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function rs(e) {
		var t = Ho;
		return Ho += 1, Uo === null && (Uo = []), e = Ka(Uo, e, t), t = Fo, (Lo === null ? t.memoizedState : Lo.next) === null && (t = t.alternate, V.H = t === null || t.memoizedState === null ? uc : dc), e;
	}
	function is(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return rs(e);
			if (e.$$typeof === re) return;
			if (e.$$typeof === N) return _a(e);
		}
		throw Error(i(438, String(e)));
	}
	function as(e) {
		var t = null, n = Fo.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = Fo.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = ns(), Fo.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = ne;
		return t.index++, n;
	}
	function os(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function ss(e) {
		return cs(ts(), Io, e);
	}
	function cs(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (Po & f) === f : ($u & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === ja && (d = !0);
					else if ((Po & p) === p) {
						u = u.next, p === ja && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, Fo.lanes |= p, sd |= p;
					f = u.action, Bo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, Fo.lanes |= f, sd |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Mr(o, e.memoizedState) && (Oc = !0, d && (n = Ma, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function ls(e) {
		var t = ts(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Mr(o, t.memoizedState) || (Oc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function us(e, t, n) {
		var r = Fo, a = ts(), o = Xi;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Mr((Io || a).memoizedState, n);
		if (s && (a.memoizedState = n, Oc = !0), a = a.queue, Fs(ps.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || Lo !== null && !!(Lo.memoizedState.tag & 1), As(e ? 9 : 8, { destroy: void 0 }, fs.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, Zu === null) throw Error(i(349));
			o || Po & 127 || ds(r, t, n);
		}
		return n;
	}
	function ds(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = Fo.updateQueue, t === null ? (t = ns(), Fo.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function fs(e, t, n, r) {
		t.value = n, t.getSnapshot = r, ms(t) && hs(e);
	}
	function ps(e, t, n) {
		return n(function() {
			ms(t) && hs(e);
		});
	}
	function ms(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Mr(e, n);
		} catch {
			return !0;
		}
	}
	function hs(e) {
		var t = vi(e, 2);
		t !== null && Ld(t, e, 2);
	}
	function gs(e) {
		var t = es();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), Bo) {
				He(!0);
				try {
					n();
				} finally {
					He(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: os,
			lastRenderedState: e
		}, t;
	}
	function _s(e, t, n, r) {
		return e.baseState = n, cs(e, Io, typeof r == "function" ? r : os);
	}
	function vs(e, t, n, r, a) {
		if (oc(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			V.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, ys(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function ys(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = V.T, o = {};
			o.types = a === null ? null : a.types, V.T = o;
			try {
				var s = n(i, r), c = V.S;
				c !== null && c(o, s), bs(e, t, s);
			} catch (n) {
				Ss(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), V.T = a;
			}
		} else try {
			a = n(i, r), bs(e, t, a);
		} catch (n) {
			Ss(e, t, n);
		}
	}
	function bs(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			xs(e, t, n);
		}, function(n) {
			return Ss(e, t, n);
		}) : xs(e, t, n);
	}
	function xs(e, t, n) {
		t.status = "fulfilled", t.value = n, Cs(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, ys(e, n)));
	}
	function Ss(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Cs(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Cs(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function ws(e, t) {
		return t;
	}
	function Ts(e, t) {
		if (Xi) {
			var n = Zu.formState;
			if (n !== null) {
				a: {
					var r = Fo;
					if (Xi) {
						if (Yi) {
							b: {
								for (var i = Yi, a = Qi; i.nodeType !== 8;) if (!a || (i = fm(i.nextSibling), i === null)) {
									i = null;
									break b;
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								Yi = fm(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						ea(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = es(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: ws,
			lastRenderedState: t
		}, n.queue = r, n = rc.bind(null, Fo, r), r.dispatch = n, r = gs(!1), a = ac.bind(null, Fo, !1, r.queue), r = es(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = vs.bind(null, Fo, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function Es(e) {
		return Ds(ts(), Io, e);
	}
	function Ds(e, t, n) {
		if (t = cs(e, t, ws)[0], e = ss(os)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = rs(t);
		} catch (e) {
			throw e === Va ? Ua : e;
		}
		else r = t;
		t = ts();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (Fo.flags |= 2048, As(9, { destroy: void 0 }, Os.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Os(e, t) {
		e.action = t;
	}
	function ks(e) {
		var t = ts(), n = Io;
		if (n !== null) return Ds(t, n, e);
		ts(), t = t.memoizedState, n = ts();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function As(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = Fo.updateQueue, t === null && (t = ns(), Fo.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function js() {
		return ts().memoizedState;
	}
	function Ms(e, t, n, r) {
		var i = es();
		Fo.flags |= e, i.memoizedState = As(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Ns(e, t, n, r) {
		var i = ts();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		Io !== null && r !== null && Ko(r, Io.memoizedState.deps) ? i.memoizedState = As(t, a, n, r) : (Fo.flags |= e, i.memoizedState = As(1 | t, a, n, r));
	}
	function Ps(e, t) {
		Ms(8390656, 8, e, t);
	}
	function Fs(e, t) {
		Ns(2048, 8, e, t);
	}
	function Is(e) {
		Fo.flags |= 4;
		var t = Fo.updateQueue;
		if (t === null) t = ns(), Fo.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function Ls(e) {
		var t = ts().memoizedState;
		return Is({
			ref: t,
			nextImpl: e
		}), function() {
			if (Xu & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function Rs(e, t) {
		return Ns(4, 2, e, t);
	}
	function zs(e, t) {
		return Ns(4, 4, e, t);
	}
	function Bs(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function Vs(e, t, n) {
		n = n == null ? null : n.concat([e]), Ns(4, 4, Bs.bind(null, t, e), n);
	}
	function Hs() {}
	function Us(e, t) {
		var n = ts();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && Ko(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Ws(e, t) {
		var n = ts();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && Ko(t, r[1])) return r[0];
		if (r = e(), Bo) {
			He(!0);
			try {
				e();
			} finally {
				He(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function Gs(e, t, n) {
		return n === void 0 || Po & 1073741824 && !($u & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Fd(), Fo.lanes |= e, sd |= e, n);
	}
	function Ks(e, t, n, r) {
		return Mr(n, t) ? n : vo.current === null ? !(Po & 106) || Po & 1073741824 && !($u & 261930) ? (Oc = !0, e.memoizedState = n) : (e = Fd(), Fo.lanes |= e, sd |= e, t) : (e = Gs(e, n, r), Mr(e, t) || (Oc = !0), e);
	}
	function qs(e, t, n, r, i) {
		var a = H.p;
		H.p = a !== 0 && 8 > a ? a : 8;
		var o = V.T, s = {};
		s.types = o === null ? null : o.types, V.T = s, ac(e, !1, t, n);
		try {
			var c = i(), l = V.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? ic(e, t, Fa(c, r), Nd(e)) : ic(e, t, r, Nd(e));
		} catch (n) {
			ic(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, Nd());
		} finally {
			H.p = a, o !== null && s.types !== null && (o.types = s.types), V.T = o;
		}
	}
	function Js() {}
	function Ys(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = Xs(e).queue;
		qs(e, a, t, ce, n === null ? Js : function() {
			return Zs(e), n(r);
		});
	}
	function Xs(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: ce,
			baseState: ce,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: os,
				lastRenderedState: ce
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: os,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function Zs(e) {
		var t = Xs(e);
		t.next === null && (t = e.alternate.memoizedState), ic(e, t.next.queue, {}, Nd());
	}
	function Qs() {
		return _a(uh);
	}
	function $s() {
		return ts().memoizedState;
	}
	function ec() {
		return ts().memoizedState;
	}
	function tc(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = Nd();
					e = co(n);
					var r = lo(t, e, n);
					r !== null && (Ld(r, t, n), uo(r, t, n)), t = { cache: wa() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function nc(e, t, n) {
		var r = Nd();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, oc(e) ? sc(t, n) : (n = _i(e, t, n, r), n !== null && (Ld(n, e, r), cc(n, t, r)));
	}
	function rc(e, t, n) {
		ic(e, t, n, Nd());
	}
	function ic(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (oc(e)) sc(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Mr(s, o)) return gi(e, t, i, 0), Zu === null && hi(), !1;
			} catch {}
			if (n = _i(e, t, i, r), n !== null) return Ld(n, e, r), cc(n, t, r), !0;
		}
		return !1;
	}
	function ac(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Lf(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, oc(e)) {
			if (t) throw Error(i(479));
		} else t = _i(e, n, r, 2), t !== null && Ld(t, e, 2);
	}
	function oc(e) {
		var t = e.alternate;
		return e === Fo || t !== null && t === Fo;
	}
	function sc(e, t) {
		zo = Ro = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function cc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, ot(e, n);
		}
	}
	var lc = {
		readContext: _a,
		use: is,
		useCallback: Go,
		useContext: Go,
		useEffect: Go,
		useImperativeHandle: Go,
		useLayoutEffect: Go,
		useInsertionEffect: Go,
		useMemo: Go,
		useReducer: Go,
		useRef: Go,
		useState: Go,
		useDebugValue: Go,
		useDeferredValue: Go,
		useTransition: Go,
		useSyncExternalStore: Go,
		useId: Go,
		useHostTransitionStatus: Go,
		useFormState: Go,
		useActionState: Go,
		useOptimistic: Go,
		useMemoCache: Go,
		useCacheRefresh: Go,
		useEffectEvent: Go
	}, uc = {
		readContext: _a,
		use: is,
		useCallback: function(e, t) {
			return es().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: _a,
		useEffect: Ps,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), Ms(4194308, 4, Bs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return Ms(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			Ms(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = es();
			t = t === void 0 ? null : t;
			var r = e();
			if (Bo) {
				He(!0);
				try {
					e();
				} finally {
					He(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = es();
			if (n !== void 0) {
				var i = n(t);
				if (Bo) {
					He(!0);
					try {
						n(t);
					} finally {
						He(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = nc.bind(null, Fo, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = es();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = gs(e);
			var t = e.queue, n = rc.bind(null, Fo, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Hs,
		useDeferredValue: function(e, t) {
			return Gs(es(), e, t);
		},
		useTransition: function() {
			var e = gs(!1);
			return e = qs.bind(null, Fo, e.queue, !0, !1), es().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = Fo, a = es();
			if (Xi) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), Zu === null) throw Error(i(349));
				$u & 127 || ds(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, Ps(ps.bind(null, r, o, e), [e]), r.flags |= 2048, As(9, { destroy: void 0 }, fs.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = es(), t = Zu.identifierPrefix;
			if (Xi) {
				var n = Hi, r = Vi;
				n = (r & ~(1 << 32 - Ue(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Vo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Wo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Qs,
		useFormState: Ts,
		useActionState: Ts,
		useOptimistic: function(e) {
			var t = es();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = ac.bind(null, Fo, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: as,
		useCacheRefresh: function() {
			return es().memoizedState = tc.bind(null, Fo);
		},
		useEffectEvent: function(e) {
			var t = es(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (Xu & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, dc = {
		readContext: _a,
		use: is,
		useCallback: Us,
		useContext: _a,
		useEffect: Fs,
		useImperativeHandle: Vs,
		useInsertionEffect: Rs,
		useLayoutEffect: zs,
		useMemo: Ws,
		useReducer: ss,
		useRef: js,
		useState: function() {
			return ss(os);
		},
		useDebugValue: Hs,
		useDeferredValue: function(e, t) {
			return Ks(ts(), Io.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ss(os)[0], t = ts().memoizedState;
			return [typeof e == "boolean" ? e : rs(e), t];
		},
		useSyncExternalStore: us,
		useId: $s,
		useHostTransitionStatus: Qs,
		useFormState: Es,
		useActionState: Es,
		useOptimistic: function(e, t) {
			return _s(ts(), Io, e, t);
		},
		useMemoCache: as,
		useCacheRefresh: ec,
		useEffectEvent: Ls
	}, fc = {
		readContext: _a,
		use: is,
		useCallback: Us,
		useContext: _a,
		useEffect: Fs,
		useImperativeHandle: Vs,
		useInsertionEffect: Rs,
		useLayoutEffect: zs,
		useMemo: Ws,
		useReducer: ls,
		useRef: js,
		useState: function() {
			return ls(os);
		},
		useDebugValue: Hs,
		useDeferredValue: function(e, t) {
			var n = ts();
			return Io === null ? Gs(n, e, t) : Ks(n, Io.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ls(os)[0], t = ts().memoizedState;
			return [typeof e == "boolean" ? e : rs(e), t];
		},
		useSyncExternalStore: us,
		useId: $s,
		useHostTransitionStatus: Qs,
		useFormState: ks,
		useActionState: ks,
		useOptimistic: function(e, t) {
			var n = ts();
			return Io === null ? (n.baseState = e, [e, n.queue.dispatch]) : _s(n, Io, e, t);
		},
		useMemoCache: as,
		useCacheRefresh: ec,
		useEffectEvent: Ls
	};
	function pc(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : T({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var mc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = Nd(), i = co(r);
			i.payload = t, n != null && (i.callback = n), t = lo(e, i, r), t !== null && (Ld(t, e, r), uo(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = Nd(), i = co(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = lo(e, i, r), t !== null && (Ld(t, e, r), uo(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = Nd(), r = co(n);
			r.tag = 2, t != null && (r.callback = t), t = lo(e, r, n), t !== null && (Ld(t, e, n), uo(t, e, n));
		}
	};
	function hc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Nr(n, r) || !Nr(i, a) : !0;
	}
	function gc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && mc.enqueueReplaceState(t, t.state, null);
	}
	function _c(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = T({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function vc(e) {
		di(e);
	}
	function yc(e) {
		console.error(e);
	}
	function bc(e) {
		di(e);
	}
	function xc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Sc(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Cc(e, t, n) {
		return n = co(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			xc(e, t);
		}, n;
	}
	function wc(e) {
		return e = co(e), e.tag = 3, e;
	}
	function Tc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Sc(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Sc(t, n, r), typeof i != "function" && (yd === null ? yd = /* @__PURE__ */ new Set([this]) : yd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Ec(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && ma(t, n, a, !0), n = Co.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return wo === null ? Yd() : n.alternate === null && od === 0 && (od = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === Wa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), vf(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === Wa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), vf(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return vf(e, r, a), Yd(), !1;
		}
		if (Xi) return t = Co.current, t === null ? (r !== $i && (t = Error(i(423), { cause: r }), oa(Ni(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = Ni(r, n), a = Cc(e.stateNode, r, a), fo(e, a), od !== 4 && (od = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== $i && (e = Error(i(422), { cause: r }), oa(Ni(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = Ni(o, n), fd === null ? fd = [o] : fd.push(o), od !== 4 && (od = 2), t === null) return !0;
		r = Ni(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Cc(n.stateNode, r, e), fo(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (yd === null || !yd.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = wc(a), Tc(a, e, n, r), fo(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var Dc = Error(i(461)), Oc = !1;
	function kc(e, t, n, r) {
		t.child = e === null ? io(t, null, n, r) : ro(t, e.child, n, r);
	}
	function Ac(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return ga(t), r = qo(e, t, n, o, a, i), s = Zo(), e !== null && !Oc ? (Qo(e, t, i), il(e, t, i)) : (Xi && s && Gi(t), t.flags |= 1, kc(e, t, r, i), t.child);
	}
	function jc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !wi(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, Mc(e, t, a, r, i)) : (e = Di(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !al(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Nr : n, n(o, r) && e.ref === t.ref) return il(e, t, i);
		}
		return t.flags |= 1, e = Ti(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function Mc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Nr(a, r) && e.ref === t.ref) {
				if (Oc = !1, t.pendingProps = r = a, al(e, i)) e.flags & 131072 && (Oc = !0);
				else return t.lanes = e.lanes, il(e, t, i);
			}
		}
		return Bc(e, t, n, r, i);
	}
	function Nc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return Fc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && za(t, a === null ? null : a.cachePool), a === null ? xo() : bo(t, a), Do(t);
			else return r = t.lanes = 536870912, Fc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && za(t, null), xo(), Oo()) : (za(t, a.cachePool), bo(t, a), Oo(), t.memoizedState = null);
		return kc(e, t, i, n), t.child;
	}
	function Pc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function Fc(e, t, n, r, i) {
		var a = Ra();
		return a = a === null ? null : {
			parent: Ca._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && za(t, null), xo(), Do(t), e !== null && ma(e, t, r, !0), t.childLanes = i, null;
	}
	function Ic(e, t) {
		return t = Yc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function Lc(e, t, n) {
		return ro(t, e.child, null, n), e = Ic(t, t.pendingProps), e.flags |= 2, ko(t), t.memoizedState = null, e;
	}
	function Rc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (Xi) {
				if (r.mode === "hidden") return e = Ic(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Pc(null, e);
				if (Eo(t), (e = Yi) ? (e = cm(e, Qi), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Bi === null ? null : {
						id: Vi,
						overflow: Hi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Ai(e), n.return = t, t.child = n, Ji = t, Yi = null)) : e = null, e === null) throw ea(t);
				return t.lanes = 536870912, null;
			}
			return Ic(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (Eo(t), a) {
				if (t.flags & 256) t.flags &= -257, t = Lc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Oc || ma(e, t, n, !1), a = (n & e.childLanes) !== 0, Oc || a) {
				if (vo.current === null) {
					if (r = Zu, r !== null && (s = st(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, vi(e, s), Ld(r, e, s), Dc;
					Yd();
				}
				t = Lc(e, t, n);
			} else e = o.treeContext, Yi = fm(s.nextSibling), Ji = t, Xi = !0, Zi = null, Qi = !1, e !== null && qi(t, e), t = Ic(t, r), t.flags |= 134221824;
			return t;
		}
		return e = Ti(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function zc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Bc(e, t, n, r, i) {
		return ga(t), n = qo(e, t, n, r, void 0, i), r = Zo(), e !== null && !Oc ? (Qo(e, t, i), il(e, t, i)) : (Xi && r && Gi(t), t.flags |= 1, kc(e, t, n, i), t.child);
	}
	function Vc(e, t, n, r, i, a) {
		return ga(t), t.updateQueue = null, n = Yo(t, r, n, i), Jo(e), r = Zo(), e !== null && !Oc ? (Qo(e, t, a), il(e, t, a)) : (Xi && r && Gi(t), t.flags |= 1, kc(e, t, n, a), t.child);
	}
	function Hc(e, t, n, r, i) {
		if (ga(t), t.stateNode === null) {
			var a = xi, o = n.contextType;
			typeof o == "object" && o && (a = _a(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = mc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, oo(t), o = n.contextType, a.context = typeof o == "object" && o ? _a(o) : xi, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (pc(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && mc.enqueueReplaceState(a, a.state, null), ho(t, r, a, i), mo(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = _c(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = xi, typeof u == "object" && u && (o = _a(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && gc(t, a, r, o), ao = !1;
			var f = t.memoizedState;
			a.state = f, ho(t, r, a, i), mo(), l = t.memoizedState, s || f !== l || ao ? (typeof d == "function" && (pc(t, n, d, r), l = t.memoizedState), (c = ao || hc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, so(e, t), o = t.memoizedProps, u = _c(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = xi, typeof l == "object" && l && (c = _a(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && gc(t, a, r, c), ao = !1, f = t.memoizedState, a.state = f, ho(t, r, a, i), mo();
			var p = t.memoizedState;
			o !== d || f !== p || ao || e !== null && e.dependencies !== null && ha(e.dependencies) ? (typeof s == "function" && (pc(t, n, s, r), p = t.memoizedState), (u = ao || hc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && ha(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, zc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = ro(t, e.child, null, i), t.child = ro(t, null, n, i)) : kc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = il(e, t, i), e;
	}
	function Uc(e, t, n, r) {
		return ia(), t.flags |= 256, kc(e, t, n, r), t.child;
	}
	var Wc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function Gc(e) {
		return {
			baseLanes: e,
			cachePool: Ba()
		};
	}
	function Kc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= ud), e;
	}
	function qc(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(Ao.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (Xi) {
				if (i ? To(t) : Oo(), (e = Yi) ? (e = cm(e, Qi), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Bi === null ? null : {
						id: Vi,
						overflow: Hi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Ai(e), n.return = t, t.child = n, Ji = t, Yi = null)) : e = null, e === null) throw ea(t);
				return t.lanes = um(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (Oo(), i = t.mode, a = Yc({
				mode: "hidden",
				children: a
			}, i), r = Oi(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = Gc(n), r.childLanes = Kc(e, o, n), t.memoizedState = Wc, Pc(null, r)) : (To(t), Jc(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return Zc(e, t, a, o, r, c, s, n);
		}
		return i ? (Oo(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = Ti(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = Oi(i, a, n, null), i.flags |= 2) : i = Ti(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Pc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = Gc(n) : (a = i.cachePool, a === null ? a = Ba() : (s = Ca._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = Kc(e, o, n), t.memoizedState = Wc, Pc(e.child, r)) : (To(t), n = e.child, e = n.sibling, n = Ti(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function Jc(e, t) {
		return t = Yc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function Yc(e, t) {
		return e = Ci(22, e, null, t), e.lanes = 0, e;
	}
	function Xc(e, t, n) {
		return ro(t, e.child, null, n), e = Jc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Zc(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (To(t), t.flags &= -257, Xc(e, t, c)) : t.memoizedState === null ? (Oo(), o = a.fallback, s = t.mode, a = Yc({
			mode: "visible",
			children: a.children
		}, s), o = Oi(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, ro(t, e.child, null, c), a = t.child, a.memoizedState = Gc(c), a.childLanes = Kc(e, r, c), t.memoizedState = Wc, Pc(null, a)) : (Oo(), t.child = e.child, t.flags |= 128, null);
		if (To(t), um(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, oa({
				value: a,
				source: null,
				stack: null
			})), Xc(e, t, c);
		}
		if (Oc || ma(e, t, c, !1), r = (c & e.childLanes) !== 0, Oc || r) {
			if (vo.current !== null) return Xc(e, t, c);
			if (r = Zu, r !== null && (a = st(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, vi(e, a), Ld(r, e, a), Dc;
			return lm(o) || Yd(), Xc(e, t, c);
		}
		return lm(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, Yi = fm(o.nextSibling), Ji = t, Xi = !0, Zi = null, Qi = !1, e !== null && qi(t, e), t = Jc(t, a.children), t.flags |= 134221824, t);
	}
	function Qc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), fa(e.return, t, n);
	}
	function $c(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && No(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function el(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function tl(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function nl(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = Ao.current;
		if (t.flags & 128) return jo(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, jo(t, o), i === "backwards" && e !== null ? (tl(e), kc(e, t, r, n), tl(e)) : kc(e, t, r, n), r = Xi ? Li : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && Qc(e, n, t);
			else if (e.tag === 19) Qc(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "backwards":
				n = $c(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, tl(t)), el(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && No(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				el(t, !0, n, null, a, r);
				break;
			case "together":
				el(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = $c(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), el(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function rl(e, t, n) {
		var r = t.pendingProps;
		return ua(t, t.type, r.value), kc(e, t, r.children, n), t.child;
	}
	function il(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), sd |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (ma(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = Ti(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = Ti(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function al(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && ha(e)));
	}
	function ol(e, t, n) {
		switch (t.tag) {
			case 3:
				ge(t, t.stateNode.containerInfo), ua(t, Ca, e.memoizedState.cache), ia();
				break;
			case 27:
			case 5:
				ve(t);
				break;
			case 4:
				ge(t, t.stateNode.containerInfo);
				break;
			case 10:
				ua(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Eo(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return To(t), t.flags |= 128, null;
					r = ma(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? qc(e, t, n) : (To(t), e = il(e, t, n), e === null ? null : e.sibling);
				}
				To(t);
				break;
			case 19:
				if (t.flags & 128) return nl(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (ma(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return nl(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), jo(t, Ao.current), r) break;
				return null;
			case 22: return t.lanes = 0, Nc(e, t, n, t.pendingProps);
			case 24: ua(t, Ca, e.memoizedState.cache);
		}
		return il(e, t, n);
	}
	function sl(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Oc = !0;
			else {
				if (!al(e, n) && !(t.flags & 128)) return Oc = !1, ol(e, t, n);
				Oc = !!(e.flags & 131072);
			}
		} else Oc = !1, Xi && t.flags & 1048576 && Wi(t, Li, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = qa(t.elementType), t.type = e, typeof e == "function") wi(e) ? (r = _c(e, r), t.tag = 1, t = Hc(null, t, e, r, n)) : (t.tag = 0, t = Bc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === P) {
								t.tag = 11, t = Ac(null, t, e, r, n);
								break a;
							}
							if (a === L) {
								t.tag = 14, t = jc(null, t, e, r, n);
								break a;
							}
							if (a === N) {
								t.tag = 10, t.type = e, t = rl(null, t, n);
								break a;
							}
						}
						throw t = oe(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return Bc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = _c(r, t.pendingProps), Hc(e, t, r, a, n);
			case 3:
				a: {
					if (ge(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, so(e, t), ho(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, ua(t, Ca, r), r !== o.cache && pa(t, [Ca], n, !0), mo(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = Uc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = Ni(Error(i(424)), t), oa(a), t = Uc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (Yi = fm(e.firstChild), Ji = t, Xi = !0, Zi = null, Qi = !0, n = io(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (ia(), r === a) {
							t = il(e, t, n);
							break a;
						}
						kc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return zc(e, t), e === null ? (n = Im(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : Xi || (t.stateNode = hp(t.type, t.pendingProps, me.current, t)) : t.memoizedState = Im(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return ve(t), e === null && Xi && (r = t.stateNode = vm(t.type, t.pendingProps, me.current), Ji = t, Qi = !0, a = Yi, Tp(t.type) ? (pm = a, Yi = fm(r.firstChild)) : Yi = a), kc(e, t, t.pendingProps.children, n), zc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && Xi && ((a = r = Yi) && (r = om(r, t.type, t.pendingProps, Qi), r === null ? a = !1 : (t.stateNode = r, Ji = t, Yi = fm(r.firstChild), Qi = !1, a = !0)), a || ea(t)), ve(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, gp(a, o) ? r = null : s !== null && gp(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = qo(e, t, Xo, null, null, n), uh._currentValue = a), zc(e, t), kc(e, t, r, n), t.child;
			case 6: return e === null && Xi && ((e = n = Yi) && (n = sm(n, t.pendingProps, Qi), n === null ? e = !1 : (t.stateNode = n, Ji = t, Yi = null, e = !0)), e || ea(t)), null;
			case 13: return qc(e, t, n);
			case 4: return ge(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = ro(t, null, r, n) : kc(e, t, r, n), t.child;
			case 11: return Ac(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, zc(e, t), kc(e, t, r, n), t.child;
			case 8: return kc(e, t, t.pendingProps.children, n), t.child;
			case 12: return kc(e, t, t.pendingProps.children, n), t.child;
			case 10: return rl(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, ga(t), a = _a(a), r = r(a), t.flags |= 1, kc(e, t, r, n), t.child;
			case 14: return jc(e, t, t.type, t.pendingProps, n);
			case 15: return Mc(e, t, t.type, t.pendingProps, n);
			case 19: return nl(e, t, n);
			case 31: return Rc(e, t, n);
			case 22: return Nc(e, t, n, t.pendingProps);
			case 24: return ga(t), r = _a(Ca), e === null ? (a = Ra(), a === null && (a = Zu, o = wa(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, oo(t), ua(t, Ca, a)) : ((e.lanes & n) !== 0 && (so(e, t), ho(t, null, null, n), mo()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, ua(t, Ca, r), r !== a.cache && pa(t, [Ca], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), ua(t, Ca, r))), kc(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : Xi && Gi(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : zc(e, t), kc(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function cl(e) {
		e.flags |= 4;
	}
	function ll(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? Zm(t, r) : Zm(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Kd()) e.flags |= 8192;
				else throw Ja = Wa, Ha;
			}
		} else e.flags &= -16777217;
	}
	function ul(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Qm(t)) {
			if (Kd()) e.flags |= 8192;
			else throw Ja = Wa, Ha;
		}
	}
	function dl(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : tt(), e.lanes |= t, dd |= t);
	}
	function fl(e, t) {
		if (!Xi) switch (e.tailMode) {
			case "visible": break;
			case "collapsed":
				for (var n = e.tail, r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
				break;
			default:
				for (t = e.tail, n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
		}
	}
	function pl(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function ml(e, t, n) {
		var r = t.pendingProps;
		switch (Ki(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return pl(t), null;
			case 1: return pl(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), da(Ca), _e(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (ra(t) ? cl(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, aa())), pl(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (cl(t), o === null ? (pl(t), ll(t, a, null, r, n)) : (pl(t), ul(t, o))) : o ? o === e.memoizedState ? (pl(t), t.flags &= -16777217) : (cl(t), pl(t), ul(t, o)) : (e = e.memoizedProps, e !== r && cl(t), pl(t), ll(t, a, e, r, n)), null;
			case 27:
				if (ye(t), n = me.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && cl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return pl(t), t.subtreeFlags &= -33554433, null;
					}
					e = fe.current, ra(t) ? ta(t, e) : (e = vm(a, r, n), t.stateNode = e, cl(t));
				}
				return pl(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (ye(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && cl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return pl(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = fe.current, ra(t)) ta(t, o);
					else {
						var s = fp(me.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[ft] = t, o[pt] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (ap(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && cl(t);
					}
				}
				return pl(t), t.subtreeFlags &= -33554433, ll(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && cl(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = me.current, ra(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = Ji, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[ft] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || np(e.nodeValue, n)), e || ea(t, !0);
					} else e = fp(e).createTextNode(r), e[ft] = t, t.stateNode = e;
				}
				return pl(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = ra(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[ft] = t;
						} else ia(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						pl(t), e = !1;
					} else n = aa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (ko(t), t) : (ko(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return pl(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = ra(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[ft] = t;
						} else ia(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						pl(t), a = !1;
					} else a = aa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (ko(t), t) : (ko(t), null);
				}
				return ko(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), dl(t, t.updateQueue), pl(t), null);
			case 4: return _e(), e === null && qf(t.stateNode.containerInfo), t.flags |= 67108864, pl(t), null;
			case 10: return da(t.type), pl(t), null;
			case 19:
				if (Mo(t), r = t.memoizedState, r === null) return pl(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) fl(r, !1);
					else {
						if (od !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = No(e), o !== null) {
								for (t.flags |= 128, fl(r, !1), e = o.updateQueue, t.updateQueue = e, dl(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Ei(n, e), n = n.sibling;
								return jo(t, Ao.current & 1 | 2), Xi && Ui(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Me() > _d && (t.flags |= 128, a = !0, fl(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = No(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, dl(t, e), fl(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !Xi) return pl(t), null;
						} else 2 * Me() - r.renderingStartTime > _d && n !== 536870912 && (t.flags |= 128, a = !0, fl(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				if (r.tail !== null) {
					e = r.tail;
					a: {
						for (n = e; n !== null;) {
							if (n.alternate !== null) {
								n = !1;
								break a;
							}
							n = n.sibling;
						}
						n = !0;
					}
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Me(), e.sibling = null, o = Ao.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || Xi ? jo(t, o) : (n = o, W(Co, t), W(Ao, n), wo === null && (wo = t)), Xi && Ui(t, r.treeForkCount), e;
				}
				return pl(t), null;
			case 22:
			case 23: return ko(t), So(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (pl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : pl(t), n = t.updateQueue, n !== null && dl(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && U(La), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), da(Ca), pl(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, pl(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function hl(e, t) {
		switch (Ki(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return da(Ca), _e(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return ye(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (ko(t), t.alternate === null) throw Error(i(340));
					ia();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (ko(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					ia();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return Mo(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return _e(), null;
			case 10: return da(t.type), null;
			case 22:
			case 23: return ko(t), So(), e !== null && U(La), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return da(Ca), null;
			case 25: return null;
			default: return null;
		}
	}
	function gl(e, t) {
		switch (Ki(t), t.tag) {
			case 3:
				da(Ca), _e();
				break;
			case 26:
			case 27:
			case 5:
				ye(t);
				break;
			case 4:
				_e();
				break;
			case 31:
				t.memoizedState !== null && ko(t);
				break;
			case 13:
				ko(t);
				break;
			case 19:
				Mo(t);
				break;
			case 10:
				da(t.type);
				break;
			case 22:
			case 23:
				ko(t), So(), e !== null && U(La);
				break;
			case 24: da(Ca);
		}
	}
	function _l(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			_f(t, t.return, e);
		}
	}
	function vl(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								_f(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			_f(t, t.return, e);
		}
	}
	function yl(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				_o(t, n);
			} catch (t) {
				_f(e, e.return, t);
			}
		}
	}
	function bl(e, t, n) {
		n.props = _c(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			_f(e, t, n);
		}
	}
	function xl(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						var i = e.stateNode, a = ci(e.memoizedProps, i);
						(i.ref === null || i.ref.name !== a) && (i.ref = Lp(a)), r = i.ref;
						break;
					case 7:
						if (e.stateNode === null) {
							var o = new Rp(e);
							p(e.child, !1, tm, o, void 0, void 0), e.stateNode = o;
						}
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			_f(e, t, n);
		}
	}
	function Sl(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				_f(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				_f(e, t, n);
			}
			else n.current = null;
		}
	}
	function Cl(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) rm(e.stateNode, t[n]);
	}
	function wl(e) {
		for (var t = e.return; t !== null && (Dl(t) && rm(e.stateNode, t.stateNode), !El(t));) t = t.return;
	}
	function Tl(e) {
		for (var t = e.return; t !== null && (Dl(t) && im(e.stateNode, t.stateNode), !El(t));) t = t.return;
	}
	function El(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function Dl(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function Ol(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			_f(e, e.return, t);
		}
	}
	function kl(e, t, n) {
		try {
			var r = e.stateNode;
			sp(r, e.type, n, t), r[pt] = t;
		} catch (t) {
			_f(e, e.return, t);
		}
	}
	function Al(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Tp(e.type) || e.tag === 4;
	}
	function jl(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Al(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Tp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Ml(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = ln)), Cl(e, r), It = !0;
		else if (i !== 4 && (i === 27 && (Cl(e, r), r = null, Tp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (Ml(e, t, n, r), e = e.sibling; e !== null;) Ml(e, t, n, r), e = e.sibling;
	}
	function Nl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), Cl(e, r), It = !0;
		else if (i !== 4 && (i === 27 && (Cl(e, r), r = null, Tp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (Nl(e, t, n, r), e = e.sibling; e !== null;) Nl(e, t, n, r), e = e.sibling;
	}
	function Pl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			ap(t, r, n), t[ft] = e, t[pt] = n;
		} catch (t) {
			_f(e, e.return, t);
		}
	}
	var Fl = !1, Il = null;
	function Ll(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (Fl = !0);
	}
	var Rl = null;
	function zl() {
		var e = Rl;
		return Rl = null, e;
	}
	var Bl = 0;
	function Vl(e, t, n, r, i) {
		return Bl = 0, Hl(e.child, t, n, r, i);
	}
	function Hl(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = jp(o);
					r.push(s), s.view && (a = !0);
				} else a || jp(o).view && (a = !0);
				Fl = !0, Op(o, Bl === 0 ? t : t + "_" + Bl, n), Bl++;
			} else e.tag === 22 && e.memoizedState !== null || e.tag === 30 && i || Hl(e.child, t, n, r, i) && (a = !0);
			e = e.sibling;
		}
		return a;
	}
	function Ul(e, t) {
		for (; e !== null;) e.tag === 5 ? kp(e.stateNode, e.memoizedProps) : e.tag === 22 && e.memoizedState !== null || e.tag === 30 && t || Ul(e.child, t), e = e.sibling;
	}
	function Wl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (Wl(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = ui(t.default, t.share), t !== "none" && (Vl(e, n, t, null, !1) || Ul(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function Gl(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = ci(r, n), a = ui(r.default, n.paired ? r.share : r.enter);
			a === "none" ? Wl(e) : Vl(e, i, a, null, !1) ? (Wl(e), n.paired || t || Id(e, r.onEnter)) : Ul(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Gl(e, t), e = e.sibling;
		else Wl(e);
	}
	function Kl(e) {
		if (Il !== null && Il.size !== 0) {
			var t = Il;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = ui(n.default, n.share);
								if (a !== "none" && (Vl(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, Id(e, n.onShare)) : Ul(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					Kl(e);
				}
				e = e.sibling;
			}
		}
	}
	function ql(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = ci(t, e.stateNode), r = Il === null ? void 0 : Il.get(n), i = ui(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (Vl(e, n, i, null, !1) ? r === void 0 ? Id(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Il.delete(n), Id(e, t.onShare)) : Ul(e.child, !1)), Il !== null && Kl(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) ql(e), e = e.sibling;
		else Il !== null && Kl(e);
	}
	function Jl(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = ci(t, e.stateNode);
				t = ui(t.default, t.update), e.flags &= -5, t !== "none" && Vl(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && Jl(e);
			e = e.sibling;
		}
	}
	function Yl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, Ul(e.child, !1));
				}
				Yl(e);
			}
			e = e.sibling;
		}
	}
	function Xl(e) {
		if (e.tag === 30) e.stateNode.paired = null, Ul(e.child, !1), Yl(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Xl(e), e = e.sibling;
		else Yl(e);
	}
	function Zl(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? Ul(e.child, !1) : e.subtreeFlags & 33554432 && Zl(e), e = e.sibling;
	}
	function Ql(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && Bl < a.length) {
					var l = a[Bl], u = jp(c);
					(l.view || u.view) && (s = !0);
					var d;
					if (d = !(e.flags & 4)) {
						if (u.clip) d = !0;
						else {
							d = l.rect;
							var f = u.rect;
							d = d.y !== f.y || d.x !== f.x || d.height !== f.height || d.width !== f.width;
						}
					}
					d && (e.flags |= 4), u.abs ? u = !l.abs : (l = l.rect, u = u.rect, u = l.height !== u.height || l.width !== u.width), u && (e.flags |= 32);
				} else e.flags |= 32;
				e.flags & 4 && Op(c, Bl === 0 ? n : n + "_" + Bl, i), s && e.flags & 4 || (Rl === null && (Rl = []), Rl.push(c, Bl === 0 ? r : r + "_" + Bl, t.memoizedProps)), Bl++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : Ql(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function $l(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = ci(n, r), a = ui(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(Mp);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				Bl = 0, i = Ql(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || Id(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && $l(e, t);
			e = e.sibling;
		}
	}
	var eu = !1, tu = !1, nu = !1, ru = !1, iu = typeof WeakSet == "function" ? WeakSet : Set, au = null, q = !1, ou = !1, su = !1, cu = !1;
	function lu(e, t, n) {
		if (e = e.containerInfo, up = yh, e = Rr(e), zr(e)) {
			if ("selectionStart" in e) var r = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				r = (r = e.ownerDocument) && r.defaultView || window;
				var i = r.getSelection && r.getSelection();
				if (i && i.rangeCount !== 0) {
					r = i.anchorNode;
					var a = i.anchorOffset, o = i.focusNode;
					i = i.focusOffset;
					try {
						r.nodeType, o.nodeType;
					} catch {
						r = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== r || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || i !== 0 && f.nodeType !== 3 || (l = s + i), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === r && ++u === a && (c = s), p === o && ++d === i && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					r = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else r = null;
			}
			r ||= {
				start: 0,
				end: 0
			};
		} else r = null;
		for (dp = {
			focusedElem: e,
			selectionRange: r
		}, yh = !1, n = (n & 335544064) === n, au = t, t = n ? 9270 : 1024; au !== null;) {
			if (e = au, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && ql(r[a]);
			if (e.alternate === null && e.flags & 2) n && Ll(e), uu(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && ql(r), uu(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && Ll(e), uu(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, au = r) : (n && Jl(e), uu(n));
			}
		}
		Il = null;
	}
	function uu(e) {
		for (; au !== null;) {
			var t = au, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = _c(t.type, a);
							n = o.getSnapshotBeforeUpdate(s, r), o.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							_f(t, t.return, e);
						}
					}
					break;
				case 3:
					if (a & 1024) {
						if (r = t.stateNode.containerInfo, n = r.nodeType, n === 9) am(r);
						else if (n === 1) switch (r.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								am(r);
								break;
							default: r.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				case 30:
					n && r !== null && (n = ci(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = ui(a.default, a.update), a !== "none" && Vl(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, au = r;
				break;
			}
			au = t.return;
		}
	}
	function du(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				ju(e, n), r & 4 && _l(5, n);
				break;
			case 1:
				if (ju(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						_f(n, n.return, e);
					}
					else {
						var i = _c(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							_f(n, n.return, e);
						}
					}
				}
				r & 64 && yl(n), r & 512 && xl(n, n.return);
				break;
			case 3:
				if (ju(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						_o(e, t);
					} catch (e) {
						_f(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Pl(n);
			case 26:
			case 5:
				ju(e, n), t === null && r & 4 && Ol(n), r & 512 && xl(n, n.return);
				break;
			case 12:
				ju(e, n);
				break;
			case 31:
				ju(e, n), r & 4 && bu(e, n);
				break;
			case 13:
				ju(e, n), r & 4 && xu(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = xf.bind(null, n), dm(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || eu, !r) {
					var a = t !== null && t.memoizedState !== null || tu;
					t = eu, i = tu, eu = r, (tu = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), Nu(e, n, r)) : ju(e, n), eu = t, tu = i;
				}
				break;
			case 30:
				ju(e, n), r & 512 && xl(n, n.return);
				break;
			case 7: r & 512 && xl(n, n.return);
			default: ju(e, n);
		}
	}
	function fu(e, t) {
		for (e = e.child; e !== null;) pu(e, t), e = e.sibling;
	}
	function pu(e, t) {
		switch (e.tag) {
			case 5:
			case 26:
				try {
					var n = e.stateNode;
					if (t) {
						var r = n.style;
						typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
					} else {
						var i = e.stateNode, a = e.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null;
						i.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim();
					}
				} catch (t) {
					_f(e, e.return, t);
				}
				mu(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, It = !0;
				} catch (t) {
					_f(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? Dp(s, !0) : Dp(e.stateNode, !1);
				} catch (t) {
					_f(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && fu(e, t);
				break;
			default: fu(e, t);
		}
	}
	function mu(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						pu(n, r);
						break a;
					case 22:
						n.memoizedState === null && mu(n, r);
						break a;
					default: mu(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function hu(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, hu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && xt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var gu = null, _u = !1;
	function vu(e, t, n) {
		for (n = n.child; n !== null;) yu(e, t, n), n = n.sibling;
	}
	function yu(e, t, n) {
		if (Ve && typeof Ve.onCommitFiberUnmount == "function") try {
			Ve.onCommitFiberUnmount(Be, n);
		} catch {}
		switch (n.tag) {
			case 26:
				tu || Sl(n, t), vu(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !tu && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				tu || Sl(n, t), Tl(n);
				var r = gu, i = _u;
				Tp(n.type) && (gu = n.stateNode, _u = !1), vu(e, t, n), ym(n.stateNode, n.type, n.memoizedProps), gu = r, _u = i;
				break;
			case 5: tu || Sl(n, t), Tl(n);
			case 6:
				if (n.tag === 6 && Tl(n), r = gu, i = _u, gu = null, vu(e, t, n), gu = r, _u = i, gu !== null) {
					if (_u) try {
						(gu.nodeType === 9 ? gu.body : gu.nodeName === "HTML" ? gu.ownerDocument.body : gu).removeChild(n.stateNode), It = !0;
					} catch (e) {
						_f(n, t, e);
					}
					else try {
						gu.removeChild(n.stateNode), It = !0;
					} catch (e) {
						_f(n, t, e);
					}
				}
				break;
			case 18:
				gu !== null && (_u ? (e = gu, Ep(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Gh(e)) : Ep(gu, n.stateNode));
				break;
			case 4:
				r = gu, i = _u, gu = n.stateNode.containerInfo, _u = !0, vu(e, t, n), gu = r, _u = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				vl(2, n, t), tu || vl(4, n, t), vu(e, t, n);
				break;
			case 1:
				tu || (Sl(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && bl(n, t, r)), vu(e, t, n);
				break;
			case 21:
				vu(e, t, n);
				break;
			case 22:
				tu = (r = tu) || n.memoizedState !== null, vu(e, t, n), tu = r;
				break;
			case 30:
				Sl(n, t), vu(e, t, n);
				break;
			case 7:
				tu || Sl(n, t), vu(e, t, n);
				break;
			default: vu(e, t, n);
		}
	}
	function bu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Gh(e);
			} catch (e) {
				_f(t, t.return, e);
			}
		}
	}
	function xu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Gh(e);
		} catch (e) {
			_f(t, t.return, e);
		}
	}
	function Su(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new iu()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new iu()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function Cu(e, t) {
		var n = Su(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = Sf.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function wu(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var a = 0; a < r.length; a++) {
			var o = r[a], s = e, c = t, l = c;
			a: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (Tp(l.type)) {
							gu = l.stateNode, _u = !1;
							break a;
						}
						break;
					case 5:
						gu = l.stateNode, _u = !1;
						break a;
					case 3:
					case 4:
						gu = l.stateNode.containerInfo, _u = !0;
						break a;
				}
				l = l.return;
			}
			if (gu === null) throw Error(i(160));
			yu(s, c, o), gu = null, _u = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Eu(t, e, n), t = t.sibling;
	}
	var Tu = null;
	function Eu(e, t, n) {
		var r = e.alternate, a = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				if (a & 4 && (r = e.updateQueue, r = r === null ? null : r.events, r !== null)) for (var o = 0; o < r.length; o++) {
					var s = r[o];
					s.ref.impl = s.nextImpl;
				}
				wu(t, e, n), Du(e), a & 4 && (vl(3, e, e.return), _l(3, e), vl(5, e, e.return));
				break;
			case 1:
				wu(t, e, n), Du(e), a & 512 && (tu || r === null || Sl(r, r.return)), a & 64 && eu && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = Tu, wu(t, e, n), Du(e), a & 512 && (tu || r === null || Sl(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (eu) e.stateNode = hp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										b: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[yt] || r[ft] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), ap(r, t, n), r[ft] = e, Et(r), t = r;
												break a;
											case "link":
												if (o = Jm("link", "href", a).get(t + (n.href || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), ap(r, t, n), a.head.appendChild(r);
												break;
											case "meta":
												if (o = Jm("meta", "content", a).get(t + (n.content || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), ap(r, t, n), a.head.appendChild(r);
												break;
											default: throw Error(i(468, t));
										}
										r[ft] = e, Et(r), t = r;
									}
									e.stateNode = t;
								}
							} else eu || Ym(o, e.type, e.stateNode);
						} else e.stateNode = Um(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && kl(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || tu || t.parentNode.removeChild(t)) : a.count--, n === null ? eu || Ym(o, e.type, e.stateNode) : Um(o, n, e.memoizedProps));
				}
				break;
			case 27:
				wu(t, e, n), Du(e), a & 512 && (tu || r === null || Sl(r, r.return)), r !== null && a & 4 && kl(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = nu, nu = !1, wu(t, e, n), nu = o, Du(e), a & 512 && (tu || r === null || Sl(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						en(t, ""), It = !0;
					} catch (t) {
						_f(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, kl(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (ru = !0);
				break;
			case 6:
				if (wu(t, e, n), Du(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, It = !0;
					} catch (t) {
						_f(e, e.return, t);
					}
				}
				break;
			case 3:
				if (It = !1, qm = null, o = Tu, Tu = Cm(t.containerInfo), wu(t, e, n), Tu = o, Du(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Gh(t.containerInfo);
				} catch (t) {
					_f(e, e.return, t);
				}
				ru && (ru = !1, Ou(e)), It = !1;
				break;
			case 4:
				a = nu, nu = eu, r = Lt(), o = Tu, Tu = Cm(e.stateNode.containerInfo), wu(t, e, n), Du(e), Tu = o, It && ou && (su = !0), It = r, nu = a;
				break;
			case 12:
				wu(t, e, n), Du(e);
				break;
			case 31:
				wu(t, e, n), Du(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Cu(e, t)));
				break;
			case 13:
				wu(t, e, n), Du(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (hd = Me()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Cu(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = eu, l = tu, u = nu;
				eu = c || o, nu = u || o, tu = l || s, wu(t, e, n), tu = l, nu = u, eu = c, Du(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || eu || tu || (t = s || tu, n = eu, r = tu, eu = o || eu, tu = t, Mu(e, 2), eu = n, tu = r), !o && nu || fu(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, Cu(e, n))));
				break;
			case 19:
				wu(t, e, n), Du(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Cu(e, t)));
				break;
			case 30:
				a & 512 && (tu || r === null || Sl(r, r.return)), a = Lt(), o = ou, s = (n & 335544064) === n, c = e.memoizedProps, ou = s && ui(c.default, c.update) !== "none", wu(t, e, n), Du(e), s && r !== null && It && (e.flags |= 4), ou = o, It = a;
				break;
			case 21: break;
			case 7: a & 512 && (tu || r === null || Sl(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: wu(t, e, n), Du(e);
		}
	}
	function Du(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Al(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (Dl(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (El(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						Nl(e, jl(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (en(l, ""), n.flags &= -33), Nl(e, jl(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						Ml(e, jl(e), u, s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				_f(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Ou(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Ou(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, yh = !0, t.reset(), yh = !1), e = e.sibling;
		}
	}
	function ku(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) Au(t, e), t = t.sibling;
		else $l(t, !1);
	}
	function Au(e, t) {
		var n = e.alternate;
		if (n === null) Gl(e, !1);
		else switch (e.tag) {
			case 3:
				if (cu = q = !1, zl(), ku(t, e), !q && !su) {
					if (e = Rl, e !== null) for (var r = 0; r < e.length; r += 3) {
						n = e[r];
						var i = e[r + 1];
						kp(n, e[r + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate({
							opacity: [0, 0],
							pointerEvents: ["none", "none"]
						}, {
							duration: 0,
							fill: "forwards",
							pseudoElement: "::view-transition-group(" + i + ")"
						});
					}
					e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate({
						opacity: [0, 0],
						pointerEvents: ["none", "none"]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition-group(root)"
					}), e.animate({
						width: [0, 0],
						height: [0, 0]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition"
					})), cu = !0;
				}
				Rl = null;
				break;
			case 5:
				ku(t, e);
				break;
			case 4:
				r = q, q = !1, ku(t, e), q && (su = !0), q = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? ku(t, e) : Gl(e, !1));
				break;
			case 30:
				r = q, i = zl(), q = !1, ku(t, e), q && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = ci(a, o), o = ci(n.memoizedProps, o);
				var s = ui(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, Bl = 0, t = Ql(e, n, t, o, s, a, !0), Bl !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (Id(e, e.memoizedProps.onUpdate), Rl = i) : i !== null && (i.push.apply(i, Rl), Rl = i), q = e.flags & 32 ? !0 : r;
				break;
			default: ku(t, e);
		}
	}
	function ju(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) du(e, t.alternate, t), t = t.sibling;
	}
	function Mu(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					vl(4, n, n.return), Mu(n, r);
					break;
				case 1:
					Sl(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && bl(n, n.return, i), Mu(n, r);
					break;
				case 27: r & 2 && ym(n.stateNode, n.type, n.memoizedProps);
				case 5:
					Sl(n, n.return), n.tag !== 5 && n.tag !== 27 || Tl(n), Mu(n, r);
					break;
				case 6:
					Tl(n);
					break;
				case 26:
					Sl(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || tu || i.parentNode.removeChild(i), Mu(n, r);
					break;
				case 22:
					n.memoizedState === null && Mu(n, r);
					break;
				case 30:
					Sl(n, n.return), Mu(n, r);
					break;
				case 7: Sl(n, n.return);
				default: Mu(n, r);
			}
			e = e.sibling;
		}
	}
	function Nu(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Nu(i, a, n), _l(4, a);
					break;
				case 1:
					if (Nu(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						_f(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) go(l[i], c);
						} catch (e) {
							_f(r, r.return, e);
						}
					}
					s && o & 64 && yl(a), xl(a, a.return);
					break;
				case 27: n & 2 && Pl(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || wl(a), Nu(i, a, n), s && r === null && o & 4 && Ol(a), xl(a, a.return);
					break;
				case 6:
					wl(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || eu || Ym(Cm(c.ownerDocument), a.type, c), Nu(i, a, n), s && r === null && o & 4 && Ol(a), xl(a, a.return);
					break;
				case 12:
					Nu(i, a, n);
					break;
				case 31:
					Nu(i, a, n), s && o & 4 && bu(i, a);
					break;
				case 13:
					Nu(i, a, n), s && o & 4 && xu(i, a);
					break;
				case 22:
					a.memoizedState === null && Nu(i, a, n), xl(a, a.return);
					break;
				case 30:
					Nu(i, a, n), xl(a, a.return);
					break;
				case 7: xl(a, a.return);
				default: Nu(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Pu(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Ta(n));
	}
	function Fu(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ta(e));
	}
	function Iu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Lu(e, t, n, r), t = t.sibling;
		else i && Zl(t);
	}
	function Lu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && Xl(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Iu(e, t, n, r), a & 2048 && _l(9, t);
				break;
			case 1:
				Iu(e, t, n, r);
				break;
			case 3:
				Iu(e, t, n, r), i && cu && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && Ta(a)));
				break;
			case 12:
				if (a & 2048) {
					Iu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						_f(t, t.return, e);
					}
				} else Iu(e, t, n, r);
				break;
			case 31:
				Iu(e, t, n, r);
				break;
			case 13:
				Iu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && Xl(t), o._visibility & 2 ? Iu(e, t, n, r) : (o._visibility |= 2, Ru(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && Xl(s), o._visibility & 2 ? Iu(e, t, n, r) : zu(e, t)), a & 2048 && Pu(s, t);
				break;
			case 24:
				Iu(e, t, n, r), a & 2048 && Fu(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (Ul(a.child, !0), Ul(t.child, !0))), Iu(e, t, n, r);
				break;
			default: Iu(e, t, n, r);
		}
	}
	function Ru(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Ru(a, o, s, c, i), _l(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Ru(a, o, s, c, i)) : u._visibility & 2 ? Ru(a, o, s, c, i) : zu(a, o), i && l & 2048 && Pu(o.alternate, o);
					break;
				case 24:
					Ru(a, o, s, c, i), i && l & 2048 && Fu(o.alternate, o);
					break;
				default: Ru(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function zu(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					zu(n, r), i & 2048 && Pu(r.alternate, r);
					break;
				case 24:
					zu(n, r), i & 2048 && Fu(r.alternate, r);
					break;
				default: zu(n, r);
			}
			t = t.sibling;
		}
	}
	var Bu = 8192;
	function Vu(e, t, n) {
		if (e.subtreeFlags & Bu) for (e = e.child; e !== null;) Hu(e, t, n), e = e.sibling;
	}
	function Hu(e, t, n) {
		switch (e.tag) {
			case 26:
				Vu(e, t, n), e.flags & Bu && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && eh(n, e)) : th(n, Tu, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				Vu(e, t, n), e.flags & Bu && (e = e.stateNode, (t & 335544128) === t && eh(n, e));
				break;
			case 3:
			case 4:
				var r = Tu;
				Tu = Cm(e.stateNode.containerInfo), Vu(e, t, n), Tu = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Bu, Bu = 16777216, Vu(e, t, n), Bu = r) : Vu(e, t, n));
				break;
			case 30:
				if ((e.flags & Bu) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Il === null && (Il = /* @__PURE__ */ new Map()), Il.set(r, i);
				}
				Vu(e, t, n);
				break;
			default: Vu(e, t, n);
		}
	}
	function Uu(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Wu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				au = r, qu(r, e);
			}
			Uu(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Gu(e), e = e.sibling;
	}
	function Gu(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Wu(e), e.flags & 2048 && vl(9, e, e.return);
				break;
			case 3:
				Wu(e);
				break;
			case 12:
				Wu(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Ku(e)) : Wu(e);
				break;
			default: Wu(e);
		}
	}
	function Ku(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				au = r, qu(r, e);
			}
			Uu(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					vl(8, t, t.return), Ku(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Ku(t));
					break;
				default: Ku(t);
			}
			e = e.sibling;
		}
	}
	function qu(e, t) {
		for (; au !== null;) {
			var n = au;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					vl(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: Ta(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, au = r;
			else a: for (n = e; au !== null;) {
				r = au;
				var i = r.sibling, a = r.return;
				if (hu(r), r === n) {
					au = null;
					break a;
				}
				if (i !== null) {
					i.return = a, au = i;
					break a;
				}
				au = a;
			}
		}
	}
	var Ju = {
		getCacheForType: function(e) {
			var t = _a(Ca), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return _a(Ca).controller.signal;
		}
	}, Yu = typeof WeakMap == "function" ? WeakMap : Map, Xu = 0, Zu = null, Qu = null, $u = 0, ed = 0, td = null, nd = !1, rd = !1, id = !1, ad = 0, od = 0, sd = 0, cd = 0, ld = 0, ud = 0, dd = 0, fd = null, pd = null, md = !1, hd = 0, gd = 0, _d = Infinity, vd = null, yd = null, bd = 0, xd = null, Sd = null, Cd = 0, wd = 0, Td = null, Ed = null, Dd = null, Od = null, kd = null, Ad = 0, jd = null;
	function Nd() {
		return Xu & 2 && $u !== 0 ? $u & -$u : V.T === null ? lt() : Lf();
	}
	function Fd() {
		if (ud === 0) {
			if (!($u & 536870912) || Xi) {
				var e = Je;
				Je <<= 1, !(Je & 3932160) && (Je = 262144), ud = e;
			} else ud = 536870912;
		}
		return e = Co.current, e !== null && (e.flags |= 32), ud;
	}
	function Id(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Lp(ci(e.memoizedProps, n))), Od === null && (Od = []), Od.push(t.bind(null, r));
		}
	}
	function Ld(e, t, n) {
		(e === Zu && (ed === 2 || ed === 9) || e.cancelPendingCommit !== null) && (Wd(e, 0), Vd(e, $u, ud, !1)), rt(e, n), Xu & 2 && e === Zu || (e === Zu && (!(Xu & 2) && (cd |= n), od === 4 && Vd(e, $u, ud, !1)), J(e));
	}
	function Rd(e, t, n) {
		if (Xu & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || Qe(e, t), a = r ? Qd(e, t) : Xd(e, t, !0), o = r;
		do {
			if (a === 0) {
				rd && !r && Vd(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !Bd(n)) a = Xd(e, t, !1), o = !1;
			else {
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = fd;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (Wd(c, s).flags |= 256), s = Xd(c, s, !1), s !== 2 && s !== 6) {
								if (id && !l) {
									c.errorRecoveryDisabledLanes |= o, cd |= o, a = 4;
									break a;
								}
								o = pd, pd = a, o !== null && (pd === null ? pd = o : pd.push.apply(pd, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					Wd(e, 0), Vd(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
						case 6:
							Vd(r, t, ud, !nd);
							break a;
						case 2:
							pd = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = hd + 300 - Me(), 10 < a)) {
						if (Vd(r, t, ud, !nd), Ze(r, 0, !0) !== 0) break a;
						Cd = t, r.timeoutHandle = yp(zd.bind(null, r, n, pd, vd, md, t, ud, cd, dd, nd, o, "Throttled", -0, 0), a);
						break a;
					}
					zd(r, n, pd, vd, md, t, ud, cd, dd, nd, o, null, -0, 0);
				}
				break;
			}
		} while (1);
		J(e);
	}
	function zd(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		e.timeoutHandle = -1;
		var m = t.subtreeFlags, h = (a & 335544064) === a;
		d = null, (h || m & 8192 || (m & 16785408) == 16785408) && (d = {
			stylesheets: null,
			count: 0,
			imgCount: 0,
			imgBytes: 0,
			suspenseyImages: [],
			waitingForImages: !0,
			waitingForViewTransition: !1,
			unsuspend: ln
		}, Il = null, Hu(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = ah.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? hd - Me() : (a & 4194048) === a ? gd - Me() : 0, m = rh(d, m), m !== null) ? (Cd = a, e.cancelPendingCommit = m(of.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), Vd(e, a, o, !l)) : of(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Bd(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Mr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function Vd(e, t, n, r) {
		t = $e(e, t), t &= ~ld, t &= ~cd, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - Ue(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && at(e, n, t);
	}
	function Hd() {
		return Xu & 6 ? !0 : (Af(0, !1), !1);
	}
	function Ud() {
		if (Qu !== null) {
			if (ed === 0) var e = Qu.return;
			else e = Qu, la = ca = null, $o(e), Za = null, Qa = 0, e = Qu;
			for (; e !== null;) gl(e.alternate, e), e = e.return;
			Qu = null;
		}
	}
	function Wd(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, bp(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Cd = 0, Ud(), Zu = e, Qu = n = Ti(e.current, null), $u = t, ed = 0, td = null, nd = !1, rd = Qe(e, t), id = !1, dd = ud = ld = cd = sd = od = 0, pd = fd = null, md = !1, ad = $e(e, t), hi(), n;
	}
	function Gd(e, t) {
		Fo = null, V.H = lc, t === Va || t === Ua ? (t = Ya(), ed = 3) : t === Ha ? (t = Ya(), ed = 4) : ed = t === Dc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, td = t, Qu === null && (od = 1, xc(e, Ni(t, e.current)));
	}
	function Kd() {
		var e = Co.current;
		return e === null ? !0 : ($u & 4194048) === $u ? wo === null : ($u & 62914560) === $u || $u & 536870912 ? e === wo : !1;
	}
	function qd() {
		var e = V.H;
		return V.H = lc, e === null ? lc : e;
	}
	function Jd() {
		var e = V.A;
		return V.A = Ju, e;
	}
	function Yd() {
		od = 4, nd || ($u & 4194048) !== $u && Co.current !== null || (rd = !0), !(sd & 134217727) && !(cd & 134217727) || Zu === null || Vd(Zu, $u, ud, !1);
	}
	function Xd(e, t, n) {
		var r = Xu;
		Xu |= 2;
		var i = qd(), a = Jd();
		(Zu !== e || $u !== t) && (vd = null, Wd(e, t)), t = !1;
		var o = od;
		a: do
			try {
				if (ed !== 0 && Qu !== null) {
					var s = Qu, c = td;
					switch (ed) {
						case 8:
							Ud(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							Co.current === null && (t = !0);
							var l = ed;
							if (ed = 0, td = null, nf(e, s, c, l), n && rd) {
								o = 0;
								break a;
							}
							break;
						default: l = ed, ed = 0, td = null, nf(e, s, c, l);
					}
				}
				Zd(), o = od;
				break;
			} catch (t) {
				Gd(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, la = ca = null, Xu = r, V.H = i, V.A = a, Qu === null && (Zu = null, $u = 0, hi()), o;
	}
	function Zd() {
		for (; Qu !== null;) ef(Qu);
	}
	function Qd(e, t) {
		var n = Xu;
		Xu |= 2;
		var r = qd(), a = Jd();
		Zu !== e || $u !== t ? (vd = null, _d = Me() + 500, Wd(e, t)) : rd = Qe(e, t);
		a: do
			try {
				if (ed !== 0 && Qu !== null) {
					t = Qu;
					var o = td;
					b: switch (ed) {
						case 1:
							ed = 0, td = null, nf(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Ga(o)) {
								ed = 0, td = null, tf(t);
								break;
							}
							t = function() {
								ed !== 2 && ed !== 9 || Zu !== e || (ed = 7), J(e);
							}, o.then(t, t);
							break a;
						case 3:
							ed = 7;
							break a;
						case 4:
							ed = 5;
							break a;
						case 7:
							Ga(o) ? (ed = 0, td = null, tf(t)) : (ed = 0, td = null, nf(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (Qu.tag) {
								case 26: s = Qu.memoizedState;
								case 5:
								case 27:
									var c = Qu;
									if (s ? Qm(s) : c.stateNode.complete) {
										ed = 0, td = null;
										var l = c.sibling;
										if (l !== null) Qu = l;
										else {
											var u = c.return;
											u === null ? Qu = null : (Qu = u, rf(u));
										}
										break b;
									}
							}
							ed = 0, td = null, nf(e, t, o, 5);
							break;
						case 6:
							ed = 0, td = null, nf(e, t, o, 6);
							break;
						case 8:
							Ud(), od = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				$d();
				break;
			} catch (t) {
				Gd(e, t);
			}
		while (1);
		return la = ca = null, V.H = r, V.A = a, Xu = n, Qu === null ? (Zu = null, $u = 0, hi(), od) : 0;
	}
	function $d() {
		for (; Qu !== null && !Ae();) ef(Qu);
	}
	function ef(e) {
		var t = sl(e.alternate, e, ad);
		e.memoizedProps = e.pendingProps, t === null ? rf(e) : Qu = t;
	}
	function tf(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Vc(n, t, t.pendingProps, t.type, void 0, $u);
				break;
			case 11:
				t = Vc(n, t, t.pendingProps, t.type.render, t.ref, $u);
				break;
			case 5:
				$o(t);
				var r = t;
				r === Ji && (Xi ? (na(r), r.tag === 5 && r.stateNode != null && (Yi = r.stateNode)) : (na(r), Xi = !0));
			default: gl(n, t), t = Qu = Ei(t, ad), t = sl(n, t, ad);
		}
		e.memoizedProps = e.pendingProps, t === null ? rf(e) : Qu = t;
	}
	function nf(e, t, n, r) {
		la = ca = null, $o(t), Za = null, Qa = 0;
		var i = t.return;
		try {
			if (Ec(e, i, t, n, $u)) {
				od = 1, xc(e, Ni(n, e.current)), Qu = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw Qu = i, t;
			od = 1, xc(e, Ni(n, e.current)), Qu = null;
			return;
		}
		t.flags & 32768 ? (Xi || r === 1 ? e = !0 : rd || $u & 536870912 ? e = !1 : (nd = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = Co.current, r !== null && r.tag === 13 && (r.flags |= 16384))), af(t, e)) : rf(t);
	}
	function rf(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				af(t, nd);
				return;
			}
			e = t.return;
			var n = ml(t.alternate, t, ad);
			if (n !== null) {
				Qu = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				Qu = t;
				return;
			}
			Qu = t = e;
		} while (t !== null);
		od === 0 && (od = 5);
	}
	function af(e, t) {
		do {
			var n = hl(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, Qu = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				Qu = e;
				return;
			}
			Qu = e = n;
		} while (e !== null);
		od = 6, Qu = null;
	}
	function of(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			mf();
		while (bd !== 0);
		if (Xu & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === Zu && (Qu = Zu = null, $u = 0), Sd = t, xd = e, Cd = n, Td = a, Ed = r, sf(e, t, n, s, c, l, f);
		}
	}
	function sf(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (wd = s, s |= mi, it(e, n, s, r, i, a), Od = null, (n & 335544064) === n ? (kd = Oa(e), r = 10262) : (kd = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, Cf(Fe, function() {
			return hf(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), Fl = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = V.T, V.T = null, i = H.p, H.p = 2, a = Xu, Xu |= 4;
			try {
				lu(e, t, n);
			} finally {
				Xu = a, H.p = i, V.T = r;
			}
		}
		bd = 1, Fl ? Dd = Fp(o, e.containerInfo, kd, uf, df, lf, ff, hf, cf, null, null) : (uf(), df(), ff());
	}
	function cf(e) {
		if (bd !== 0) {
			var t = xd.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function lf() {
		bd === 3 && (bd = 0, Au(Sd, xd), bd = 4);
	}
	function uf() {
		if (bd === 1) {
			bd = 0;
			var e = xd, t = Sd, n = Cd, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = V.T, V.T = null;
				var i = H.p;
				H.p = 2;
				var a = Xu;
				Xu |= 4;
				try {
					ou = su = !1, Eu(t, e, n), n = dp;
					var o = Rr(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && Lr(s.ownerDocument.documentElement, s)) {
						if (c !== null && zr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Ir(s, h), v = Ir(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					yh = !!up, dp = up = null;
				} finally {
					Xu = a, H.p = i, V.T = r;
				}
			}
			e.current = t, bd = 2;
		}
	}
	function df() {
		if (bd === 2) {
			bd = 0;
			var e = xd, t = Sd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = V.T, V.T = null;
				var r = H.p;
				H.p = 2;
				var i = Xu;
				Xu |= 4;
				try {
					du(e, t.alternate, t);
				} finally {
					Xu = i, H.p = r, V.T = n;
				}
			}
			bd = 3;
		}
	}
	function ff() {
		if (bd === 4 || bd === 3) {
			bd = 0;
			var e = Dd;
			Dd = null, je();
			var t = xd, n = Sd, r = Cd, i = Ed, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? bd = 5 : (bd = 0, Sd = xd = null, pf(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (yd = null), ct(r), n = n.stateNode, Ve && typeof Ve.onCommitFiberRoot == "function") try {
				Ve.onCommitFiberRoot(Be, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = V.T, a = H.p, H.p = 2, V.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					V.T = n, H.p = a;
				}
			}
			if (i = Od, o = kd, kd = null, i !== null && (Od = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			Cd & 3 && mf(), J(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === jd ? Ad++ : (Ad = 0, jd = t) : (Ad = 0, jd = null), Af(0, !1);
		}
	}
	function pf(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Ta(t)));
	}
	function mf() {
		return Dd !== null && (Dd.skipTransition(), Dd = null), uf(), df(), ff(), hf();
	}
	function hf() {
		if (bd !== 5) return !1;
		var e = xd, t = wd;
		wd = 0;
		var n = ct(Cd), r = V.T, a = H.p;
		try {
			H.p = 32 > n ? 32 : n, V.T = null, n = Td, Td = null;
			var o = xd, s = Cd;
			if (bd = 0, Sd = xd = null, Cd = 0, Xu & 6) throw Error(i(331));
			var c = Xu;
			if (Xu |= 4, Gu(o.current), Lu(o, o.current, s, n), Xu = c, Af(0, !1), Ve && typeof Ve.onPostCommitFiberRoot == "function") try {
				Ve.onPostCommitFiberRoot(Be, o);
			} catch {}
			return !0;
		} finally {
			H.p = a, V.T = r, pf(e, t);
		}
	}
	function gf(e, t, n) {
		t = Ni(n, t), t = Cc(e.stateNode, t, 2), e = lo(e, t, 2), e !== null && (rt(e, 2), J(e));
	}
	function _f(e, t, n) {
		if (e.tag === 3) gf(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				gf(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (yd === null || !yd.has(r))) {
					e = Ni(n, e), n = wc(2), r = lo(t, n, 2), r !== null && (Tc(n, r, t, e), rt(r, 2), J(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function vf(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new Yu();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (id = !0, i.add(n), e = yf.bind(null, e, t, n), t.then(e, e));
	}
	function yf(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Zu === e && ($u & n) === n && (od === 4 || od === 3 && ($u & 62914560) === $u && 300 > Me() - hd ? Xu & 2 ? ld |= n : Wd(e, 0) : ld |= n, dd === $u && (dd = 0)), J(e);
	}
	function bf(e, t) {
		t === 0 && (t = tt()), e = vi(e, t), e !== null && (rt(e, t), J(e));
	}
	function xf(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), bf(e, n);
	}
	function Sf(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), bf(e, n);
	}
	function Cf(e, t) {
		return Oe(e, t);
	}
	var wf = null, Tf = null, Ef = !1, Df = !1, Of = !1, kf = 0;
	function J(e) {
		e !== Tf && e.next === null && (Tf === null ? wf = Tf = e : Tf = Tf.next = e), Df = !0, Ef || (Ef = !0, If());
	}
	function Af(e, t) {
		if (!Of && Df) {
			Of = !0;
			do
				for (var n = !1, r = wf; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - Ue(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, Ff(r, a));
						} else a = $u, a = Ze(r, r === Zu ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || Qe(r, a) || (n = !0, Ff(r, a));
					}
					r = r.next;
				}
			while (n);
			Of = !1;
		}
	}
	function jf() {
		Mf();
	}
	function Mf() {
		Df = Ef = !1;
		var e = 0;
		kf !== 0 && vp() && (e = kf);
		for (var t = Me(), n = null, r = wf; r !== null;) {
			var i = r.next, a = Nf(r, t);
			a === 0 ? (r.next = null, n === null ? wf = i : n.next = i, i === null && (Tf = n)) : (n = r, (e !== 0 || a & 3) && (Df = !0)), r = i;
		}
		bd !== 0 && bd !== 5 || Af(e, !1), kf !== 0 && (kf = 0);
	}
	function Nf(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - Ue(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = et(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = Zu, n = $u, n = Ze(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (ed === 2 || ed === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && ke(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || Qe(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && ke(r), ct(n)) {
				case 2:
				case 8:
					n = G;
					break;
				case 32:
					n = Fe;
					break;
				case 268435456:
					n = Le;
					break;
				default: n = Fe;
			}
			return r = Pf.bind(null, e), n = Oe(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && ke(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function Pf(e, t) {
		if (bd !== 0 && bd !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (mf() && e.callbackNode !== n) return null;
		var r = $u;
		return r = Ze(e, e === Zu ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Rd(e, r, t), Nf(e, Me()), e.callbackNode != null && e.callbackNode === n ? Pf.bind(null, e) : null);
	}
	function Ff(e, t) {
		if (mf()) return null;
		Rd(e, t, !0);
	}
	function If() {
		Cp(function() {
			Xu & 6 ? Oe(Pe, jf) : Mf();
		});
	}
	function Lf() {
		if (kf === 0) {
			var e = ja;
			e === 0 && (e = qe, qe <<= 1, !(qe & 261888) && (qe = 256)), kf = e;
		}
		return kf;
	}
	function Rf(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : cn(e);
	}
	function zf(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = Rf((i[pt] || null).action), o = r.submitter;
			o && (t = (t = o[pt] || null) ? Rf(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new An("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (kf !== 0) {
								var e = new FormData(i, o);
								Ys(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), Ys(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var Bf = 0; Bf < ai.length; Bf++) {
		var Vf = ai[Bf];
		oi(Vf.toLowerCase(), "on" + (Vf[0].toUpperCase() + Vf.slice(1)));
	}
	oi(Zr, "onAnimationEnd"), oi(Qr, "onAnimationIteration"), oi($r, "onAnimationStart"), oi("dblclick", "onDoubleClick"), oi("focusin", "onFocus"), oi("focusout", "onBlur"), oi(ei, "onTransitionRun"), oi(ti, "onTransitionStart"), oi(ni, "onTransitionCancel"), oi(ri, "onTransitionEnd"), jt("onMouseEnter", ["mouseout", "mouseover"]), jt("onMouseLeave", ["mouseout", "mouseover"]), jt("onPointerEnter", ["pointerout", "pointerover"]), jt("onPointerLeave", ["pointerout", "pointerover"]), At("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), At("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), At("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), At("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), At("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), At("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var Y = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Hf = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Y));
	function Uf(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						di(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						di(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Wf(e, t) {
		var n = t[ht];
		n === void 0 && (n = t[ht] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Jf(t, e, 2, !1), n.add(r));
	}
	function Gf(e, t, n) {
		var r = 0;
		t && (r |= 4), Jf(n, e, r, t);
	}
	var Kf = "_reactListening" + Math.random().toString(36).slice(2);
	function qf(e) {
		if (!e[Kf]) {
			e[Kf] = !0, Ot.forEach(function(t) {
				t !== "selectionchange" && (Hf.has(t) || Gf(t, !1, e), Gf(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Kf] || (t[Kf] = !0, Gf("selectionchange", !1, t));
		}
	}
	function Jf(e, t, n, r) {
		switch (Eh(t)) {
			case 2:
				var i = bh;
				break;
			case 8:
				i = xh;
				break;
			default: i = Sh;
		}
		n = i.bind(null, t, n, e), i = void 0, !yn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Yf(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = St(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		gn(function() {
			var r = a, i = dn(n), s = [];
			a: {
				var c = ii.get(e);
				if (c !== void 0) {
					var l = An, u = e;
					switch (e) {
						case "keypress": if (Tn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Jn;
							break;
						case "focusin":
							u = "focus", l = zn;
							break;
						case "focusout":
							u = "blur", l = zn;
							break;
						case "beforeblur":
						case "afterblur":
							l = zn;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = Ln;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Rn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = Zn;
							break;
						case Zr:
						case Qr:
						case $r:
							l = Bn;
							break;
						case ri:
							l = Qn;
							break;
						case "scroll":
						case "scrollend":
							l = Mn;
							break;
						case "wheel":
							l = $n;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Vn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = Yn;
							break;
						case "submit":
							l = Xn;
							break;
						case "toggle":
						case "beforetoggle": l = er;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = _n(m, p), g != null && d.push(X(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== un && (u = n.relatedTarget || n.fromElement) && (St(u) || u[mt])) break a;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? St(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = Ln, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = Yn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : wt(c), h = l == null ? u : wt(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, St(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? w(c, l, Zf) : null, c !== null && Qf(s, u, c, d, !1), l !== null && f !== null && Qf(s, f, l, d, !0)));
				}
				a: {
					if (c = r ? wt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = br;
					else if (mr(c)) {
						if (xr) _ = Ar;
						else {
							_ = Or;
							var v = Dr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && an(r.elementType) && (_ = br) : _ = kr;
					if (_ &&= _(e, r)) {
						hr(s, _, n, i);
						break a;
					}
					v && v(e, c, r);
				}
				switch (v = r ? wt(r) : window, e) {
					case "focusin":
						(mr(v) || v.contentEditable === "true") && (Vr = v, Hr = r, Ur = null);
						break;
					case "focusout":
						Ur = Hr = Vr = null;
						break;
					case "mousedown":
						Wr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Wr = !1, Gr(s, n, i);
						break;
					case "selectionchange": if (Br) break;
					case "keydown":
					case "keyup": Gr(s, n, i);
				}
				var y;
				if (nr) b: {
					switch (e) {
						case "compositionstart":
							var b = "onCompositionStart";
							break b;
						case "compositionend":
							b = "onCompositionEnd";
							break b;
						case "compositionupdate":
							b = "onCompositionUpdate";
							break b;
					}
					b = void 0;
				}
				else ur ? cr(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (ar && n.locale !== "ko" && (ur || b !== "onCompositionStart" ? b === "onCompositionEnd" && ur && (y = wn()) : (xn = i, Sn = "value" in xn ? xn.value : xn.textContent, ur = !0)), v = Xf(r, b), 0 < v.length && (b = new Hn(b, e, null, n, i), s.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = lr(n), y !== null && (b.data = y)))), (y = ir ? dr(e, n) : fr(e, n)) && (b = Xf(r, "onBeforeInput"), 0 < b.length && (v = new Hn("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: v,
					listeners: b
				}), v.data = y)), zf(s, e, r, n, i);
			}
			Uf(s, t);
		});
	}
	function X(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Xf(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = _n(e, n), i != null && r.unshift(X(e, i, a)), i = _n(e, t), i != null && r.push(X(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Zf(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Qf(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = _n(n, a), l != null && o.unshift(X(n, l, c))) : i || (l = _n(n, a), l != null && o.push(X(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var $f = /\r\n?/g, ep = /\u0000|\uFFFD/g;
	function tp(e) {
		return (typeof e == "string" ? e : "" + e).replace($f, "\n").replace(ep, "");
	}
	function np(e, t) {
		return t = tp(t), tp(e) === t;
	}
	function rp(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || en(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && en(e, "" + r);
				else return;
				break;
			case "className":
				zt(e, "class", r);
				break;
			case "tabIndex":
				zt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				zt(e, n, r);
				break;
			case "style":
				rn(e, r, o);
				return;
			case "data": if (t !== "object") {
				zt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href") || r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = cn(r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && rp(e, t, "name", a.name, a, null), rp(e, t, "formEncType", a.formEncType, a, null), rp(e, t, "formMethod", a.formMethod, a, null), rp(e, t, "formTarget", a.formTarget, a, null)) : (rp(e, t, "encType", a.encType, a, null), rp(e, t, "method", a.method, a, null), rp(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = cn(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = ln);
				return;
			case "onScroll":
				r != null && Wf("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Wf("scrollend", e);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = cn(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "credentialless":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				Wf("beforetoggle", e), Wf("toggle", e), Rt(e, "popover", r);
				break;
			case "xlinkActuate":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Rt(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = on.get(n) || n, Rt(e, n, r);
			else return;
		}
		It = !0;
	}
	function ip(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				rn(e, r, o);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "children":
				if (typeof r == "string") en(e, r);
				else if (typeof r == "number" || typeof r == "bigint") en(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && Wf("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Wf("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = ln);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!kt.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[pt] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break a;
					}
					It = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Rt(e, n, r);
				}
				return;
		}
		It = !0;
	}
	function ap(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				Wf("error", e), Wf("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: rp(e, t, o, s, n, null);
					}
				}
				a && rp(e, t, "srcSet", n.srcSet, n, null), r && rp(e, t, "src", n.src, n, null);
				return;
			case "input":
				Wf("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: rp(e, t, r, d, n, null);
					}
				}
				Yt(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in Wf("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: rp(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && Zt(e, !!r, n, !0) : Zt(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in Wf("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: rp(e, t, s, c, n, null);
				}
				$t(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: rp(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				Wf("beforetoggle", e), Wf("toggle", e), Wf("cancel", e), Wf("close", e);
				break;
			case "iframe":
			case "object":
				Wf("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < Y.length; r++) Wf(Y[r], e);
				break;
			case "image":
				Wf("error", e), Wf("load", e);
				break;
			case "details":
				Wf("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": Wf("error", e), Wf("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: rp(e, t, u, r, n, null);
				}
				return;
			default: if (an(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && ip(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && rp(e, t, c, r, n, null));
	}
	var op = {};
	function sp(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || rp(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							m !== f && (It = !0), o = m;
							break;
						case "name":
							m !== f && (It = !0), a = m;
							break;
						case "checked":
							m !== f && (It = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (It = !0), d = m;
							break;
						case "value":
							m !== f && (It = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (It = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && rp(e, t, p, m, r, f);
					}
				}
				Jt(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || rp(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (It = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (It = !0), c = o;
						break;
					case "multiple": o !== l && (It = !0), s = o;
					default: o !== l && rp(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? Zt(e, !!n, n ? [] : "", !1) : Zt(e, !!n, t, !0)) : Zt(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: rp(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (It = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (It = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && rp(e, t, s, a, r, o);
				}
				Qt(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: rp(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						p !== m && (It = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: rp(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && rp(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: rp(e, t, u, p, r, m);
				}
				return;
			default: if (an(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && ip(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || ip(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && rp(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || rp(e, t, f, p, r, m);
	}
	function cp(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function lp() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && cp(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && cp(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var up = null, dp = null;
	function fp(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function pp(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function mp(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function hp(e, t, n, r) {
		return n = fp(n).createElement(e), n[ft] = r, n[pt] = t, ap(n, e, t), Et(n), n;
	}
	function gp(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var _p = null;
	function vp() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== _p && (_p = e, !0) : (_p = null, !1);
	}
	var yp = typeof setTimeout == "function" ? setTimeout : void 0, bp = typeof clearTimeout == "function" ? clearTimeout : void 0, xp = typeof Promise == "function" ? Promise : void 0, Sp = typeof requestAnimationFrame == "function" ? requestAnimationFrame : yp, Cp = typeof queueMicrotask == "function" ? queueMicrotask : xp === void 0 ? yp : function(e) {
		return xp.resolve(null).then(e).catch(wp);
	};
	function wp(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Tp(e) {
		return e === "head";
	}
	function Ep(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Gh(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") bm(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, bm(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[yt] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && bm(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Gh(t);
	}
	function Dp(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function Op(e, t, n) {
		if (t = CSS.escape(t) === t ? t : "r-" + btoa(t).replace(/=/g, ""), e.style.viewTransitionName = t, n != null && (e.style.viewTransitionClass = n), n = getComputedStyle(e), n.display === "inline") {
			if (t = e.getClientRects(), t.length === 1) var r = 1;
			else for (var i = r = 0; i < t.length; i++) {
				var a = t[i];
				0 < a.width && 0 < a.height && r++;
			}
			r === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + n.paddingTop, e.marginBottom = "-" + n.paddingBottom);
		}
	}
	function kp(e, t) {
		e = e.style, t = t.style;
		var n = t == null ? null : t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null;
		e.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = t == null ? null : t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null, e.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (n = t.display, e.display = n == null || typeof n == "boolean" ? "" : n, n = t.margin, n == null ? (n = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = n == null || typeof n == "boolean" ? "" : n, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t) : e.margin = n));
	}
	function Ap(e, t, n) {
		return n = n.ownerDocument.defaultView, {
			rect: e,
			abs: t.position === "absolute" || t.position === "fixed",
			clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
			view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth
		};
	}
	function jp(e) {
		return Ap(e.getBoundingClientRect(), getComputedStyle(e), e);
	}
	function Mp(e) {
		var t = e.getBoundingClientRect();
		t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
		var n = getComputedStyle(e);
		return Ap(t, n, e);
	}
	function Np(e) {
		return e.documentElement.clientHeight;
	}
	function Pp(e) {
		this.addEventListener("load", e), this.addEventListener("error", e);
	}
	function Fp(e, t, n, r, i, a, o, s, c) {
		var l = t.nodeType === 9 ? t : t.ownerDocument;
		try {
			var u = l.startViewTransition({
				update: function() {
					var t = l.defaultView, n = t.navigation && t.navigation.transition, o = l.fonts.status;
					r();
					var s = [];
					if (o === "loaded" && (Np(l), l.fonts.status === "loading" && s.push(l.fonts.ready)), o = s.length, e !== null) for (var c = e.suspenseyImages, u = 0, d = 0; d < c.length; d++) {
						var f = c[d];
						if (!f.complete) {
							var p = f.getBoundingClientRect();
							if (0 < p.bottom && 0 < p.right && p.top < t.innerHeight && p.left < t.innerWidth) {
								if (u += $m(f), u > nh) {
									s.length = o;
									break;
								}
								f = new Promise(Pp.bind(f)), s.push(f);
							}
						}
					}
					if (0 < s.length) return t = Promise.race([Promise.all(s), new Promise(function(e) {
						return setTimeout(e, 500);
					})]).then(i, i), (n ? Promise.allSettled([n.finished, t]) : t).then(a, a);
					if (i(), n) return n.finished.then(a, a);
					a();
				},
				types: n
			});
			l.__reactViewTransition = u;
			var d = [];
			return u.ready.then(function() {
				for (var e = l.documentElement.getAnimations({ subtree: !0 }), t = 0; t < e.length; t++) {
					var n = e[t], r = n.effect, i = r.pseudoElement;
					if (i != null && i.startsWith("::view-transition")) {
						d.push(n), n = r.getKeyframes();
						for (var a = i = void 0, s = !0, c = 0; c < n.length; c++) {
							var u = n[c], f = u.width;
							if (i === void 0) i = f;
							else if (i !== f) {
								s = !1;
								break;
							}
							if (f = u.height, a === void 0) a = f;
							else if (a !== f) {
								s = !1;
								break;
							}
							delete u.width, delete u.height, u.transform === "none" && delete u.transform;
						}
						s && i !== void 0 && a !== void 0 && (r.setKeyframes(n), s = getComputedStyle(r.target, r.pseudoElement), s.width !== i || s.height !== a) && (s = n[0], s.width = i, s.height = a, s = n[n.length - 1], s.width = i, s.height = a, r.setKeyframes(n));
					}
				}
				o();
			}, function(e) {
				l.__reactViewTransition === u && (l.__reactViewTransition = null);
				try {
					if (typeof e == "object" && e) switch (e.name) {
						case "InvalidStateError": (e.message === "View transition was skipped because document visibility state is hidden." || e.message === "Skipping view transition because document visibility state has become hidden." || e.message === "Skipping view transition because viewport size changed." || e.message === "Transition was aborted because of invalid state") && (e = null);
					}
					e !== null && c(e);
				} finally {
					r(), i(), o();
				}
			}), u.finished.finally(function() {
				for (var e = 0; e < d.length; e++) d[e].cancel();
				l.__reactViewTransition === u && (l.__reactViewTransition = null), s();
			}), u;
		} catch {
			return r(), i(), o(), null;
		}
	}
	function Ip(e, t) {
		this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
	}
	Ip.prototype.animate = function(e, t) {
		return t = typeof t == "number" ? { duration: t } : T({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
	}, Ip.prototype.getAnimations = function() {
		for (var e = this._scope, t = this._selector, n = e.getAnimations({ subtree: !0 }), r = [], i = 0; i < n.length; i++) {
			var a = n[i].effect;
			a !== null && a.target === e && a.pseudoElement === t && r.push(n[i]);
		}
		return r;
	}, Ip.prototype.getComputedStyle = function() {
		return getComputedStyle(this._scope, this._selector);
	};
	function Lp(e) {
		return {
			name: e,
			group: new Ip("group", e),
			imagePair: new Ip("image-pair", e),
			old: new Ip("old", e),
			new: new Ip("new", e)
		};
	}
	function Rp(e) {
		this._fragmentFiber = e, this._observers = this._eventListeners = null;
	}
	Rp.prototype.addEventListener = function(e, t, n) {
		var r = null, i = null;
		if (!(n != null && typeof n != "boolean" && (r = n.signal || null, r !== null && r.aborted))) {
			this._eventListeners === null && (this._eventListeners = []);
			var a = this._eventListeners;
			if (Up(a, e, t, n) === -1) {
				var o = this, s = t;
				n != null && typeof n != "boolean" && !0 === n.once && (s = function(r) {
					o.removeEventListener(e, t, n), typeof t == "function" ? t.call(this, r) : t.handleEvent(r);
				}), r !== null && (i = o.removeEventListener.bind(o, e, t, n), r.addEventListener("abort", i, { once: !0 }), i = r.removeEventListener.bind(r, "abort", i)), r = Vp(n), a.push({
					type: e,
					listener: t,
					optionsOrUseCapture: n,
					attachedListener: s,
					cleanup: i
				}), p(this._fragmentFiber.child, !1, zp, e, s, r);
			}
			this._eventListeners = a;
		}
	};
	function zp(e, t, n, r) {
		return v(e).addEventListener(t, n, r), !1;
	}
	Rp.prototype.removeEventListener = function(e, t, n) {
		var r = this._eventListeners;
		if (r !== null && (t = Up(r, e, t, n), t !== -1)) {
			var i = r[t];
			n = i.attachedListener;
			var a = i.cleanup;
			i = Vp(i.optionsOrUseCapture), p(this._fragmentFiber.child, !1, Bp, e, n, i), r.splice(t, 1), a !== null && a();
		}
	};
	function Bp(e, t, n, r) {
		return v(e).removeEventListener(t, n, r), !1;
	}
	function Vp(e) {
		return e != null && typeof e != "boolean" && (!0 === e.once || e.signal instanceof AbortSignal) ? {
			capture: e.capture,
			passive: e.passive
		} : e;
	}
	function Hp(e) {
		return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
	}
	function Up(e, t, n, r) {
		if (e.length === 0) return -1;
		r = Hp(r);
		for (var i = 0; i < e.length; i++) {
			var a = e[i];
			if (a.type === t && a.listener === n && Hp(a.optionsOrUseCapture) === r) return i;
		}
		return -1;
	}
	Rp.prototype.dispatchEvent = function(e) {
		var t = m(this._fragmentFiber);
		if (t === null) return !0;
		t = v(t);
		var n = this._eventListeners;
		if (n !== null && 0 < n.length || !e.bubbles) {
			var r = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
			if (n) for (var i = 0; i < n.length; i++) {
				var a = n[i];
				r.addEventListener(a.type, a.attachedListener, Vp(a.optionsOrUseCapture));
			}
			if (t.appendChild(r), e = r.dispatchEvent(e), n) for (i = 0; i < n.length; i++) a = n[i], r.removeEventListener(a.type, a.attachedListener, Vp(a.optionsOrUseCapture));
			return t.removeChild(r), e;
		}
		return t.dispatchEvent(e);
	}, Rp.prototype.focus = function(e) {
		p(this._fragmentFiber.child, !0, Wp, e, void 0, void 0);
	};
	function Wp(e, t) {
		return e.tag !== 6 && (e = v(e), gm(e, t));
	}
	Rp.prototype.focusLast = function(e) {
		var t = [];
		p(this._fragmentFiber.child, !0, Gp, t, void 0, void 0);
		for (var n = t.length - 1; 0 <= n && !Wp(t[n], e); n--);
	};
	function Gp(e, t) {
		return t.push(e), !1;
	}
	Rp.prototype.blur = function() {
		var e = m(this._fragmentFiber);
		e !== null && (e = v(e), e = fp(e).activeElement, e !== null && p(this._fragmentFiber.child, !1, Kp, e, void 0, void 0));
	};
	function Kp(e, t) {
		return e.tag !== 6 && (e = v(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
	}
	Rp.prototype.observeUsing = function(e) {
		this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), p(this._fragmentFiber.child, !1, qp, e, void 0, void 0);
	};
	function qp(e, t) {
		return e.tag === 6 || (e = v(e), t.observe(e)), !1;
	}
	Rp.prototype.unobserveUsing = function(e) {
		var t = this._observers;
		if (t !== null && t.has(e)) {
			t.delete(e), p(this._fragmentFiber.child, !1, Jp, e, void 0, void 0);
			for (var n = t = 0; n < Yp.length; n++) {
				var r = Yp[n];
				r.fragmentInstance === this && r.observer === e ? e.unobserve(r.instance) : Yp[t++] = r;
			}
			Yp.length = t;
		}
	};
	function Jp(e, t) {
		return e.tag === 6 || (e = v(e), t.unobserve(e)), !1;
	}
	var Yp = [], Xp = !1;
	function Zp(e, t, n) {
		Yp.push({
			fragmentInstance: e,
			observer: t,
			instance: n
		}), Xp || (Xp = !0, _m(function() {
			Xp = !1;
			var e = Yp;
			Yp = [];
			for (var t = 0; t < e.length; t++) {
				var n = e[t];
				n.observer.unobserve(n.instance);
			}
		}));
	}
	Rp.prototype.getClientRects = function() {
		var e = [];
		return p(this._fragmentFiber.child, !1, Qp, e, void 0, void 0), e;
	};
	function Qp(e, t) {
		if (e.tag === 6) {
			e = e.stateNode;
			var n = e.ownerDocument.createRange();
			n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
		} else e = v(e), t.push.apply(t, e.getClientRects());
		return !1;
	}
	Rp.prototype.getRootNode = function(e) {
		var t = m(this._fragmentFiber);
		return t === null ? this : v(t).getRootNode(e);
	}, Rp.prototype.compareDocumentPosition = function(e) {
		var t = m(this._fragmentFiber);
		if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		var n = [];
		p(this._fragmentFiber.child, !1, Gp, n, void 0, void 0);
		var r = v(t);
		if (n.length === 0) {
			if (n = r, h(this._fragmentFiber)) {
				a: {
					for (t = this._fragmentFiber.return; t !== null;) {
						if (t.tag === 4) {
							t = t.stateNode.containerInfo;
							break a;
						}
						if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
						t = t.return;
					}
					t = null;
				}
				t != null && (n = t);
			}
			t = this._fragmentFiber;
			var i = r = n.compareDocumentPosition(e);
			return n === e ? i = Node.DOCUMENT_POSITION_CONTAINS : r & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = g(t)[1], n === null ? i = Node.DOCUMENT_POSITION_PRECEDING : (e = v(n).compareDocumentPosition(e), i = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
		}
		t = v(n[0]), i = v(n[n.length - 1]);
		var a = h(this._fragmentFiber) ? t.parentElement : r;
		if (a == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		r = a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, a = a.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINED_BY;
		var o = t.compareDocumentPosition(e), s = i.compareDocumentPosition(e), c = o & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
		return s = r && a && o & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = r && t === e || a && i === e || c || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !r && t === e || !a && i === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || $p(t, this._fragmentFiber, n[0], n[n.length - 1], e) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
	};
	function $p(e, t, n, r, i) {
		var a = St(i);
		if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
			if (n = !!a) a: {
				for (; a !== null;) {
					if (a.tag === 7 && (a === t || a.alternate === t)) {
						n = !0;
						break a;
					}
					a = a.return;
				}
				n = !1;
			}
			return n;
		}
		if (e & Node.DOCUMENT_POSITION_CONTAINS) {
			if (a === null) return a = i.ownerDocument, i === a || i === a.documentElement || i === a.body;
			a: {
				for (a = t, t = m(t); a !== null;) {
					if (!(a.tag !== 5 && a.tag !== 3 && a.tag !== 27 || a !== t && a.alternate !== t)) {
						a = !0;
						break a;
					}
					a = a.return;
				}
				a = !1;
			}
			return a;
		}
		return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!a) && !(t = a === n) && (t = w(n, a, C), t === null ? t = !1 : (p(t, !0, x, a, n), a = y, y = null, t = a !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!a) && !(t = a === r) && (t = w(r, a, C), t === null ? t = !1 : (p(t, !0, S, a, r), a = y, b = y = null, t = a !== null)), t) : !1;
	}
	function em(e, t) {
		var n = e.ownerDocument.createRange();
		n.selectNodeContents(e), e = n.getBoundingClientRect(), window.scrollTo(window.scrollX + e.left, t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight);
	}
	Rp.prototype.scrollIntoView = function(e) {
		if (typeof e == "object") throw Error(i(566));
		var t = [];
		p(this._fragmentFiber.child, !1, Gp, t, void 0, void 0);
		var n = !1 !== e;
		if (t.length === 0) {
			var r = g(this._fragmentFiber);
			if (r = n ? r[1] || r[0] || m(this._fragmentFiber) : r[0] || r[1], r === null) return;
			if (r.tag === 6) {
				e = v(r), em(e, n);
				return;
			}
			if (r = v(r), r.nodeType !== 9) {
				if (r.nodeType === 11) {
					n = "host" in r ? r.host : null, n !== null && n.scrollIntoView(e);
					return;
				}
				r.scrollIntoView(e);
			}
		}
		for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length);) {
			var a = t[r];
			a.tag === 6 ? (a = v(a), em(a, n)) : v(a).scrollIntoView(e), r += n ? -1 : 1;
		}
	};
	function tm(e, t) {
		return e = v(e), nm(e, t), !1;
	}
	function nm(e, t) {
		e.reactFragments ??= /* @__PURE__ */ new Set(), e.reactFragments.add(t);
	}
	function rm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.addEventListener(i.type, i.attachedListener, Vp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			for (var r = 0, i = 0; i < Yp.length; i++) {
				var a = Yp[i];
				(a.fragmentInstance !== t || a.observer !== n || a.instance !== e) && (Yp[r++] = a);
			}
			Yp.length = r, n.observe(e);
		}), nm(e, t));
	}
	function im(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.removeEventListener(i.type, i.attachedListener, Vp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			typeof n.rootMargin == "string" ? Zp(t, n, e) : n.unobserve(e);
		}), e.reactFragments != null && e.reactFragments.delete(t));
	}
	function am(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					am(n), xt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function om(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[yt]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = fm(e.nextSibling), e === null) break;
		}
		return null;
	}
	function sm(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = fm(e.nextSibling), e === null)) return null;
		return e;
	}
	function cm(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = fm(e.nextSibling), e === null)) return null;
		return e;
	}
	function lm(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function um(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function dm(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function fm(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var pm = null;
	function mm(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return fm(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function hm(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function gm(e, t) {
		function n() {
			r = !0;
		}
		if (e.ownerDocument.activeElement === e) return !0;
		var r = !1;
		try {
			e.ownerDocument.addEventListener("focus", n, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
		} finally {
			e.ownerDocument.removeEventListener("focus", n, !0);
		}
		return r;
	}
	function _m(e) {
		Sp(function() {
			Sp(function(t) {
				return e(t);
			});
		});
	}
	function vm(e, t, n) {
		switch (t = fp(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function ym(e, t, n) {
		for (var r in n) {
			var i = n[r];
			n.hasOwnProperty(r) && i != null && rp(e, t, r, null, op, i);
		}
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === ln && (e.onclick = null), xt(e);
	}
	function bm(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		xt(e);
	}
	var xm = /* @__PURE__ */ new Map(), Sm = /* @__PURE__ */ new Set();
	function Cm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var wm = H.d;
	H.d = {
		f: Tm,
		r: Em,
		D: km,
		C: Am,
		L: jm,
		m: Mm,
		X: Pm,
		S: Nm,
		M: Fm
	};
	function Tm() {
		var e = wm.f(), t = Hd();
		return e || t;
	}
	function Em(e) {
		var t = Ct(e);
		t !== null && t.tag === 5 && t.type === "form" ? Zs(t) : wm.r(e);
	}
	var Dm = typeof document > "u" ? null : document;
	function Om(e, t, n) {
		var r = Dm;
		if (r && typeof t == "string" && t) {
			var i = qt(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), Sm.has(i) || (Sm.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), ap(t, "link", e), Et(t), r.head.appendChild(t)));
		}
	}
	function km(e) {
		wm.D(e), Om("dns-prefetch", e, null);
	}
	function Am(e, t) {
		wm.C(e, t), Om("preconnect", e, t);
	}
	function jm(e, t, n) {
		wm.L(e, t, n);
		var r = Dm;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + qt(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + qt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + qt(n.imageSizes) + "\"]")) : i += "[href=\"" + qt(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Lm(e);
					break;
				case "script": a = Vm(e);
			}
			if (!(xm.has(a) || (e = T({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), xm.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Rm(a)) || t === "script" && r.querySelector(Hm(a))))) {
				var o = r.createElement("link");
				ap(o, "link", e), t === "style" && (o[bt] = !0, o.onload = o.onerror = function() {
					Dt(o);
				}), Et(o), r.head.appendChild(o);
			}
		}
	}
	function Mm(e, t) {
		wm.m(e, t);
		var n = Dm;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + qt(r) + "\"][href=\"" + qt(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Vm(e);
			}
			if (!xm.has(a) && (e = T({
				rel: "modulepreload",
				href: e
			}, t), xm.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(Hm(a))) return;
				}
				r = n.createElement("link"), ap(r, "link", e), Et(r), n.head.appendChild(r);
			}
		}
	}
	function Nm(e, t, n) {
		wm.S(e, t, n);
		var r = Dm;
		if (r && e) {
			var i = Tt(r).hoistableStyles, a = Lm(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Rm(a))) s.loading = 5;
				else {
					e = T({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = xm.get(a)) && Gm(e, n);
					var c = o = r.createElement("link");
					Et(c), ap(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Wm(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function Pm(e, t) {
		wm.X(e, t);
		var n = Dm;
		if (n && e) {
			var r = Tt(n).hoistableScripts, i = Vm(e), a = r.get(i);
			a || (a = n.querySelector(Hm(i)), a || (e = T({
				src: e,
				async: !0
			}, t), (t = xm.get(i)) && Km(e, t), a = n.createElement("script"), Et(a), ap(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Fm(e, t) {
		wm.M(e, t);
		var n = Dm;
		if (n && e) {
			var r = Tt(n).hoistableScripts, i = Vm(e), a = r.get(i);
			a || (a = n.querySelector(Hm(i)), a || (e = T({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = xm.get(i)) && Km(e, t), a = n.createElement("script"), Et(a), ap(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Im(e, t, n, r) {
		var a = (a = me.current) ? Cm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Lm(n.href), t = Tt(a).hoistableStyles, r = t.get(n), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Lm(n.href);
					var o = Tt(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Rm(e))) ? o._p || (s.instance = o, s.state.loading = 5) : (o = xm.get(e), o || (o = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, xm.set(e, o)), Bm(a, e, o, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Vm(n), t = Tt(a).hoistableScripts, r = t.get(n), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function Lm(e) {
		return "href=\"" + qt(e) + "\"";
	}
	function Rm(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function zm(e) {
		return T({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Bm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[bt]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[bt] = !0, t.onload = t.onerror = Dt.bind(null, t), ap(t, "link", n), Et(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function Vm(e) {
		return "[src=\"" + qt(e) + "\"]";
	}
	function Hm(e) {
		return "script[async]" + e;
	}
	function Um(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + qt(n.href) + "\"]");
				if (r) return t.instance = r, Et(r), r;
				var a = T({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), Et(r), ap(r, "style", a), Wm(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Lm(n.href);
				var o = e.querySelector(Rm(a));
				if (o) return t.state.loading |= 4, t.instance = o, Et(o), o;
				r = zm(n), (a = xm.get(a)) && Gm(r, a), o = (e.ownerDocument || e).createElement("link"), Et(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), ap(o, "link", r), t.state.loading |= 4, Wm(o, n.precedence, e), t.instance = o;
			case "script": return o = Vm(n.src), (a = e.querySelector(Hm(o))) ? (t.instance = a, Et(a), a) : (r = n, (a = xm.get(o)) && (r = T({}, n), Km(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), Et(a), ap(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Wm(r, n.precedence, e));
		return t.instance;
	}
	function Wm(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Gm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Km(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var qm = null;
	function Jm(e, t, n) {
		if (qm === null) {
			var r = /* @__PURE__ */ new Map(), i = qm = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = qm, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[yt] || a[ft] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Ym(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function Xm(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Zm(e, t) {
		return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
	}
	function Qm(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function $m(e) {
		return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * .25;
	}
	function eh(e, t) {
		typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += $m(t), e.suspenseyImages.push(t)), e = oh.bind(e), t.decode().then(e, e));
	}
	function th(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Lm(r.href), a = t.querySelector(Rm(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = ah.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, Et(a);
					return;
				}
				a = t.ownerDocument || t, r = zm(r), (i = xm.get(i)) && Gm(r, i), a = a.createElement("link"), Et(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), ap(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = ah.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var nh = 0;
	function rh(e, t) {
		return e.stylesheets && e.count === 0 && ch(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && ch(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && nh === 0 && (nh = 62500 * lp());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && ch(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > nh ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function ih(e) {
		if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
			if (e.stylesheets) ch(e, e.stylesheets);
			else if (e.unsuspend) {
				var t = e.unsuspend;
				e.unsuspend = null, t();
			}
		}
	}
	function ah() {
		this.count--, ih(this);
	}
	function oh() {
		this.imgCount--, ih(this);
	}
	var sh = null;
	function ch(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, sh = /* @__PURE__ */ new Map(), t.forEach(lh, e), sh = null, ah.call(e));
	}
	function lh(e, t) {
		if (!(t.state.loading & 4)) {
			var n = sh.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), sh.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = ah.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var uh = {
		$$typeof: N,
		Provider: null,
		Consumer: null,
		_currentValue: ce,
		_currentValue2: ce,
		_threadCount: 0
	};
	function dh(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = nt(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = nt(0), this.hiddenUpdates = nt(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function fh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new dh(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = Ci(3, null, null, t), e.current = a, a.stateNode = e, t = wa(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, oo(a), e;
	}
	function ph(e) {
		return e ? (e = xi, e) : xi;
	}
	function mh(e, t, n, r, i, a) {
		i = ph(i), r.context === null ? r.context = i : r.pendingContext = i, r = co(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = lo(e, r, t), n !== null && (Ld(n, e, t), uo(n, e, t));
	}
	function hh(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function gh(e, t) {
		hh(e, t), (e = e.alternate) && hh(e, t);
	}
	function _h(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = vi(e, 67108864);
			t !== null && Ld(t, e, 67108864), gh(e, 67108864);
		}
	}
	function vh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Nd();
			t = K(t);
			var n = vi(e, t);
			n !== null && Ld(n, e, t), gh(e, t);
		}
	}
	var yh = !0;
	function bh(e, t, n, r) {
		var i = V.T;
		V.T = null;
		var a = H.p;
		try {
			H.p = 2, Sh(e, t, n, r);
		} finally {
			H.p = a, V.T = i;
		}
	}
	function xh(e, t, n, r) {
		var i = V.T;
		V.T = null;
		var a = H.p;
		try {
			H.p = 8, Sh(e, t, n, r);
		} finally {
			H.p = a, V.T = i;
		}
	}
	function Sh(e, t, n, r) {
		if (yh) {
			var i = Ch(r);
			if (i === null) Yf(e, t, r, wh, n), Fh(e, r);
			else if (Lh(i, e, t, n, r)) r.stopPropagation();
			else if (Fh(e, r), t & 4 && -1 < Ph.indexOf(e)) {
				for (; i !== null;) {
					var a = Ct(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = Xe(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - Ue(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									J(a), !(Xu & 6) && (_d = Me() + 500, Af(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = vi(a, 2), s !== null && Ld(s, a, 2), Hd(), gh(a, 2);
					}
					if (a = Ch(r), a === null && Yf(e, t, r, wh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Yf(e, t, r, null, n);
		}
	}
	function Ch(e) {
		return e = dn(e), Th(e);
	}
	var wh = null;
	function Th(e) {
		if (wh = null, e = St(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return wh = e, null;
	}
	function Eh(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "fullscreenerror":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "resize":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Ne()) {
				case Pe: return 2;
				case G: return 8;
				case Fe:
				case Ie: return 32;
				case Le: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var Dh = !1, Oh = null, kh = null, Ah = null, jh = /* @__PURE__ */ new Map(), Mh = /* @__PURE__ */ new Map(), Nh = [], Ph = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Fh(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Oh = null;
				break;
			case "dragenter":
			case "dragleave":
				kh = null;
				break;
			case "mouseover":
			case "mouseout":
				Ah = null;
				break;
			case "pointerover":
			case "pointerout":
				jh.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": Mh.delete(t.pointerId);
		}
	}
	function Ih(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = Ct(t), t !== null && _h(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Lh(e, t, n, r, i) {
		switch (t) {
			case "focusin": return Oh = Ih(Oh, e, t, n, r, i), !0;
			case "dragenter": return kh = Ih(kh, e, t, n, r, i), !0;
			case "mouseover": return Ah = Ih(Ah, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return jh.set(a, Ih(jh.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, Mh.set(a, Ih(Mh.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Rh(e) {
		var t = St(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, ut(e.priority, function() {
							vh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, ut(e.priority, function() {
							vh(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function zh(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = Ch(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				un = r, n.target.dispatchEvent(r), un = null;
			} else return t = Ct(n), t !== null && _h(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Bh(e, t, n) {
		zh(e) && n.delete(t);
	}
	function Vh() {
		Dh = !1, Oh !== null && zh(Oh) && (Oh = null), kh !== null && zh(kh) && (kh = null), Ah !== null && zh(Ah) && (Ah = null), jh.forEach(Bh), Mh.forEach(Bh);
	}
	function Hh(e, n) {
		e.blockedOn === n && (e.blockedOn = null, Dh || (Dh = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Vh)));
	}
	var Uh = null;
	function Wh(e) {
		Uh !== e && (Uh = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Uh === e && (Uh = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (Th(r || n) === null) continue;
					break;
				}
				var a = Ct(n);
				a !== null && (e.splice(t, 3), t -= 3, Ys(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Gh(e) {
		function t(t) {
			return Hh(t, e);
		}
		Oh !== null && Hh(Oh, e), kh !== null && Hh(kh, e), Ah !== null && Hh(Ah, e), jh.forEach(t), Mh.forEach(t);
		for (var n = 0; n < Nh.length; n++) {
			var r = Nh[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < Nh.length && (n = Nh[0], n.blockedOn === null);) Rh(n), n.blockedOn === null && Nh.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[pt] || null;
			if (typeof a == "function") o || Wh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[pt] || null) s = o.formAction;
					else if (Th(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Wh(n);
			}
		}
	}
	function Kh() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function qh(e) {
		this._internalRoot = e;
	}
	Jh.prototype.render = qh.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		mh(n, Nd(), e, t, null, null);
	}, Jh.prototype.unmount = qh.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			mh(e.current, 2, null, e, null, null), Hd(), t[mt] = null;
		}
	};
	function Jh(e) {
		this._internalRoot = e;
	}
	Jh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = lt();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < Nh.length && t !== 0 && t < Nh[n].priority; n++);
			Nh.splice(n, 0, e), n === 0 && Rh(e);
		}
	};
	var Yh = n.version;
	if (Yh !== "19.3.1") throw Error(i(527, Yh, "19.3.1"));
	H.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = u(t), e = e === null ? null : d(e), e = e === null ? null : e.stateNode, e;
	};
	var Xh = {
		bundleType: 0,
		version: "19.3.1",
		rendererPackageName: "react-dom",
		currentDispatcherRef: V,
		reconcilerVersion: "19.3.1"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Zh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Zh.isDisabled && Zh.supportsFiber) try {
			Be = Zh.inject(Xh), Ve = Zh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = vc, s = yc, c = bc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = fh(e, 1, !1, null, null, n, r, null, o, s, c, Kh), e[mt] = t.current, qf(e), new qh(t);
	};
})), Id = (/* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = Fd();
})))();
function Ld(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Ld(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function Rd() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Ld(e)) && (r && (r += " "), r += t);
	return r;
}
// node_modules/.pnpm/tailwind-merge@3.7.1/node_modules/tailwind-merge/dist/bundle-mjs.mjs
var zd = (e, t) => {
	let n = Array(e.length + t.length);
	for (let t = 0; t < e.length; t++) n[t] = e[t];
	for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
	return n;
}, Bd = (e, t) => ({
	classGroupId: e,
	validator: t
}), Vd = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
	nextPart: e,
	validators: t,
	classGroupId: n
}), Hd = "-", Ud = [], Wd = "arbitrary..", Gd = (e) => {
	let t = Jd(e), { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
	return {
		getClassGroupId: (e) => {
			if (e.startsWith("[") && e.endsWith("]")) return qd(e);
			let n = e.split(Hd);
			return Kd(n, +(n[0] === "" && n.length > 1), t);
		},
		getConflictingClassGroupIds: (e, t) => {
			if (t) {
				let t = r[e], i = n[e];
				return t ? i ? zd(i, t) : t : i || Ud;
			}
			return n[e] || Ud;
		}
	};
}, Kd = (e, t, n) => {
	if (e.length - t === 0) return n.classGroupId;
	let r = e[t], i = n.nextPart.get(r);
	if (i) {
		let n = Kd(e, t + 1, i);
		if (n) return n;
	}
	let a = n.validators;
	if (a === null) return;
	let o = t === 0 ? e.join(Hd) : e.slice(t).join(Hd), s = a.length;
	for (let e = 0; e < s; e++) {
		let t = a[e];
		if (t.validator(o)) return t.classGroupId;
	}
}, qd = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	let t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
	return r ? Wd + r : void 0;
})(), Jd = (e) => {
	let { theme: t, classGroups: n } = e;
	return Yd(n, t);
}, Yd = (e, t) => {
	let n = Vd();
	for (let r in e) {
		let i = e[r];
		Xd(i, n, r, t);
	}
	return n;
}, Xd = (e, t, n, r) => {
	let i = e.length;
	for (let a = 0; a < i; a++) {
		let i = e[a];
		Zd(i, t, n, r);
	}
}, Zd = (e, t, n, r) => {
	typeof e == "string" ? Qd(e, t, n) : typeof e == "function" ? $d(e, t, n, r) : ef(e, t, n, r);
}, Qd = (e, t, n) => {
	let r = e === "" ? t : tf(t, e);
	r.classGroupId = n;
}, $d = (e, t, n, r) => {
	nf(e) ? Xd(e(r), t, n, r) : (t.validators === null && (t.validators = []), t.validators.push(Bd(n, e)));
}, ef = (e, t, n, r) => {
	let i = Object.entries(e), a = i.length;
	for (let e = 0; e < a; e++) {
		let [a, o] = i[e];
		Xd(o, tf(t, a), n, r);
	}
}, tf = (e, t) => {
	let n = e, r = t.split(Hd), i = r.length;
	for (let e = 0; e < i; e++) {
		let t = r[e], i = n.nextPart.get(t);
		i || (i = Vd(), n.nextPart.set(t, i)), n = i;
	}
	return n;
}, nf = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, rf = (e) => {
	if (e < 1) return {
		get: () => void 0,
		set: () => {}
	};
	let t = 0, n = Object.create(null), r = Object.create(null), i = (i, a) => {
		n[i] = a, t++, t > e && (t = 0, r = n, n = Object.create(null));
	};
	return {
		get(e) {
			let t = n[e];
			if (t !== void 0) return t;
			if ((t = r[e]) !== void 0) return i(e, t), t;
		},
		set(e, t) {
			e in n ? n[e] = t : i(e, t);
		}
	};
}, af = "!", of = ":", sf = [], cf = (e, t, n, r, i) => ({
	modifiers: e,
	hasImportantModifier: t,
	baseClassName: n,
	maybePostfixModifierPosition: r,
	isExternal: i
}), lf = (e) => {
	let { prefix: t, experimentalParseClassName: n } = e, r = (e) => {
		let t = [], n = 0, r = 0, i = 0, a, o = e.length;
		for (let s = 0; s < o; s++) {
			let c = e[s];
			if (n === 0 && r === 0) {
				if (c === of) {
					t.push(e.slice(i, s)), i = s + 1;
					continue;
				}
				if (c === "/") {
					a = s;
					continue;
				}
			}
			if (c === "[") n++;
			else if (c === "]") n--;
			else if (c === "(") r++;
			else if (c === ")") r--;
			else if (c === "\\") s++;
			else if (c === "\"" || c === "'") for (; ++s < o;) {
				let t = e[s];
				if (t === "\\") s++;
				else if (t === c) break;
			}
		}
		let s = t.length === 0 ? e : e.slice(i), c = s, l = !1;
		s.endsWith(af) ? (c = s.slice(0, -1), l = !0) : s.startsWith(af) && (c = s.slice(1), l = !0);
		let u = l && s.startsWith(af) ? 1 : 0, d = a && a > i ? a - i - u : void 0;
		return cf(t, l, c, d);
	};
	if (t) {
		let e = t + of, n = r;
		r = (t) => t.startsWith(e) ? n(t.slice(e.length)) : cf(sf, !1, t, void 0, !0);
	}
	if (n) {
		let e = r;
		r = (t) => n({
			className: t,
			parseClassName: e
		});
	}
	return r;
}, uf = (e) => {
	let t = /* @__PURE__ */ new Map();
	return e.orderSensitiveModifiers.forEach((e, n) => {
		t.set(e, 1e6 + n);
	}), (e) => {
		let n = [], r = [];
		for (let i = 0; i < e.length; i++) {
			let a = e[i], o = a[0] === "[", s = t.has(a);
			o || s ? (r.length > 0 && (r.sort(), n.push(...r), r = []), n.push(a)) : r.push(a);
		}
		return r.length > 0 && (r.sort(), n.push(...r)), n;
	};
}, df = (e) => ({
	cache: rf(e.cacheSize),
	parseClassName: lf(e),
	sortModifiers: uf(e),
	postfixLookupClassGroupIds: ff(e),
	...Gd(e)
}), ff = (e) => {
	let t = Object.create(null), n = e.postfixLookupClassGroups;
	if (n) for (let e = 0; e < n.length; e++) t[n[e]] = !0;
	return t;
}, pf = /\s+/, mf = (e, t) => {
	let { parseClassName: n, getClassGroupId: r, getConflictingClassGroupIds: i, sortModifiers: a, postfixLookupClassGroupIds: o } = t, s = [], c = e.trim().split(pf), l = "";
	for (let e = c.length - 1; e >= 0; --e) {
		let t = c[e], { isExternal: u, modifiers: d, hasImportantModifier: f, baseClassName: p, maybePostfixModifierPosition: m } = n(t);
		if (u) {
			l = t + (l.length > 0 ? " " + l : l);
			continue;
		}
		let h = !!m, g;
		if (h) {
			g = r(p.substring(0, m));
			let e = g && o[g] ? r(p) : void 0;
			e && e !== g && (g = e, h = !1);
		} else g = r(p);
		if (!g) {
			if (!h || (g = r(p), !g)) {
				l = t + (l.length > 0 ? " " + l : l);
				continue;
			}
			h = !1;
		}
		let _ = d.length === 0 ? "" : d.length === 1 ? d[0] : a(d).join(":"), v = f ? _ + af : _, y = v + g;
		if (s.indexOf(y) > -1) continue;
		s.push(y);
		let b = i(g, h);
		for (let e = 0; e < b.length; ++e) {
			let t = b[e];
			s.push(v + t);
		}
		l = t + (l.length > 0 ? " " + l : l);
	}
	return l;
}, hf = (...e) => {
	let t = 0, n, r, i = "";
	for (; t < e.length;) (n = e[t++]) && (r = gf(n)) && (i && (i += " "), i += r);
	return i;
}, gf = (e) => {
	if (typeof e == "string") return e;
	let t, n = "";
	for (let r = 0; r < e.length; r++) e[r] && (t = gf(e[r])) && (n && (n += " "), n += t);
	return n;
}, _f = (e, ...t) => {
	let n, r, i, a, o = (o) => (n = df(t.reduce((e, t) => t(e), e())), r = n.cache.get, i = n.cache.set, a = s, s(o)), s = (e) => {
		let t = r(e);
		if (t) return t;
		let a = mf(e, n);
		return i(e, a), a;
	};
	return a = o, (...e) => a(hf(...e));
}, vf = [], yf = (e) => {
	let t = (t) => t[e] || vf;
	return t.isThemeGetter = !0, t.themeKey = e, t;
}, bf = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, xf = /^\((?:(\w[\w-]*):)?(.+)\)$/i, Sf = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, Cf = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, wf = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|Q|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^--spacing\(.+\)|^0$/, Tf = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix|color|light-dark|contrast-color|device-cmyk|--alpha)\(.+\)$/i, Ef = /^(?:_*[+-]?(?:\d|\.\d)|[\w-]+\(|_*(?:inherit|initial|revert(?:-layer)?|unset)_*$)/i, Df = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Of = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, kf = (e) => Sf.test(e), J = (e) => !!e && !Number.isNaN(Number(e)), Af = (e) => !!e && Number.isInteger(Number(e)), jf = (e) => e.endsWith("%") && J(e.slice(0, -1)), Mf = (e) => Cf.test(e), Nf = () => !0, Pf = (e) => wf.test(e) && !Tf.test(e), Ff = (e) => Ef.test(e) && !Tf.test(e), If = () => !1, Lf = (e) => Df.test(e), Rf = (e) => Of.test(e), zf = (e) => !Y(e) && !X(e), Bf = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), Vf = (e) => ip(e, cp, If), Y = (e) => bf.test(e), Hf = (e) => ip(e, lp, Pf), Uf = (e) => ip(e, up, Ff), Wf = (e) => ip(e, dp, J), Gf = (e) => ip(e, pp, Nf), Kf = (e) => ip(e, fp, If), qf = (e) => ip(e, op, If), Jf = (e) => ip(e, sp, Rf), Yf = (e) => ip(e, mp, Lf), X = (e) => xf.test(e), Xf = (e) => ap(e, lp), Zf = (e) => ap(e, up, !0), Qf = (e) => ap(e, fp), $f = (e) => ap(e, op), ep = (e) => ap(e, cp), tp = (e) => ap(e, sp), np = (e) => ap(e, mp, !0), rp = (e) => ap(e, pp, !0), ip = (e, t, n) => {
	let r = bf.exec(e);
	return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, ap = (e, t, n = !1) => {
	let r = xf.exec(e);
	return r ? r[1] ? t(r[1]) : n : !1;
}, op = (e) => e === "position" || e === "percentage", sp = (e) => e === "image" || e === "url", cp = (e) => e === "length" || e === "size" || e === "bg-size", lp = (e) => e === "length", up = (e) => e !== "color", dp = (e) => e === "number", fp = (e) => e === "family-name", pp = (e) => e === "number" || e === "weight", mp = (e) => e === "shadow", hp = /*#__PURE__*/ _f(() => {
	let e = yf("color"), t = yf("font"), n = yf("text"), r = yf("font-weight"), i = yf("tracking"), a = yf("leading"), o = yf("breakpoint"), s = yf("container"), c = yf("spacing"), l = yf("radius"), u = yf("shadow"), d = yf("inset-shadow"), f = yf("text-shadow"), p = yf("drop-shadow"), m = yf("blur"), h = yf("perspective"), g = yf("aspect"), _ = yf("ease"), v = yf("animate"), y = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	], b = () => [
		"center",
		"top",
		"bottom",
		"left",
		"right",
		"top-left",
		"left-top",
		"top-right",
		"right-top",
		"bottom-right",
		"right-bottom",
		"bottom-left",
		"left-bottom"
	], x = () => [
		...b(),
		X,
		Y
	], S = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	], C = () => [
		"auto",
		"contain",
		"none"
	], w = () => [
		X,
		Y,
		c
	], T = () => [
		kf,
		"full",
		"auto",
		...w()
	], E = () => [
		Af,
		"none",
		"subgrid",
		X,
		Y
	], D = () => [
		"auto",
		{ span: [
			"full",
			Af,
			X,
			Y
		] },
		Af,
		X,
		Y
	], O = () => [
		Af,
		"auto",
		X,
		Y
	], k = () => [
		"auto",
		"min",
		"max",
		"fr",
		X,
		Y
	], A = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch",
		"baseline",
		"center-safe",
		"end-safe"
	], j = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	], M = () => ["auto", ...w()], N = () => [
		kf,
		"auto",
		"full",
		"dvw",
		"dvh",
		"lvw",
		"lvh",
		"svw",
		"svh",
		"min",
		"max",
		"fit",
		...w()
	], P = () => [
		s,
		kf,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...w()
	], F = () => [
		kf,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...w()
	], I = () => [
		e,
		X,
		Y
	], L = () => [
		...b(),
		$f,
		qf,
		{ position: [X, Y] }
	], R = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }], ee = () => [
		"auto",
		"cover",
		"contain",
		ep,
		Vf,
		{ size: [X, Y] }
	], te = () => [
		jf,
		Xf,
		Hf
	], ne = () => [
		"",
		"none",
		"full",
		l,
		X,
		Y
	], z = () => [
		"",
		J,
		Xf,
		Hf
	], re = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	], ie = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	], B = () => [
		J,
		jf,
		Zf,
		Uf
	], ae = () => [
		"",
		"none",
		m,
		X,
		Y
	], oe = () => [
		"none",
		J,
		X,
		Y
	], se = () => [
		"none",
		J,
		X,
		Y
	], V = () => [
		J,
		X,
		Y
	], H = () => [
		kf,
		"full",
		...w()
	];
	return {
		cacheSize: 500,
		theme: {
			animate: [
				"spin",
				"ping",
				"pulse",
				"bounce"
			],
			aspect: ["video"],
			blur: [Mf],
			breakpoint: [Mf],
			color: [Nf],
			container: [Mf],
			"drop-shadow": [Mf],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [zf],
			"font-weight": [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black"
			],
			"inset-shadow": [Mf],
			leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose"
			],
			perspective: [
				"dramatic",
				"near",
				"normal",
				"midrange",
				"distant",
				"none"
			],
			radius: [Mf],
			shadow: [Mf],
			spacing: ["px", J],
			text: [Mf],
			"text-shadow": [Mf],
			tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest"
			]
		},
		classGroups: {
			aspect: [{ aspect: [
				"auto",
				"square",
				kf,
				Y,
				X,
				g
			] }],
			container: ["container"],
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				X,
				Y
			] }],
			"container-named": [Bf],
			columns: [{ columns: [
				J,
				"auto",
				Y,
				X,
				s
			] }],
			"break-after": [{ "break-after": y() }],
			"break-before": [{ "break-before": y() }],
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			box: [{ box: ["border", "content"] }],
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			sr: ["sr-only"],
			"not-sr": ["not-sr-only"],
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			isolation: ["isolate", "isolation-auto"],
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			"object-position": [{ object: x() }],
			overflow: [{ overflow: S() }],
			"overflow-x": [{ "overflow-x": S() }],
			"overflow-y": [{ "overflow-y": S() }],
			overscroll: [{ overscroll: C() }],
			"overscroll-x": [{ "overscroll-x": C() }],
			"overscroll-y": [{ "overscroll-y": C() }],
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			inset: [{ inset: T() }],
			"inset-x": [{ "inset-x": T() }],
			"inset-y": [{ "inset-y": T() }],
			start: [{
				"inset-s": T(),
				start: T()
			}],
			end: [{
				"inset-e": T(),
				end: T()
			}],
			"inset-bs": [{ "inset-bs": T() }],
			"inset-be": [{ "inset-be": T() }],
			top: [{ top: T() }],
			right: [{ right: T() }],
			bottom: [{ bottom: T() }],
			left: [{ left: T() }],
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			z: [{ z: [
				Af,
				"auto",
				X,
				Y
			] }],
			basis: [{ basis: [
				kf,
				"full",
				"auto",
				s,
				...w()
			] }],
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			"flex-wrap": [{ flex: [
				"nowrap",
				"wrap",
				"wrap-reverse"
			] }],
			flex: [{ flex: [
				J,
				kf,
				"auto",
				"initial",
				"none",
				X,
				Y
			] }],
			grow: [{ grow: [
				"",
				J,
				X,
				Y
			] }],
			shrink: [{ shrink: [
				"",
				J,
				X,
				Y
			] }],
			order: [{ order: [
				Af,
				"first",
				"last",
				"none",
				X,
				Y
			] }],
			"grid-cols": [{ "grid-cols": E() }],
			"col-start-end": [{ col: D() }],
			"col-start": [{ "col-start": O() }],
			"col-end": [{ "col-end": O() }],
			"grid-rows": [{ "grid-rows": E() }],
			"row-start-end": [{ row: D() }],
			"row-start": [{ "row-start": O() }],
			"row-end": [{ "row-end": O() }],
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			"auto-cols": [{ "auto-cols": k() }],
			"auto-rows": [{ "auto-rows": k() }],
			gap: [{ gap: w() }],
			"gap-x": [{ "gap-x": w() }],
			"gap-y": [{ "gap-y": w() }],
			"justify-content": [{ justify: [...A(), "normal"] }],
			"justify-items": [{ "justify-items": [...j(), "normal"] }],
			"justify-self": [{ "justify-self": ["auto", ...j()] }],
			"align-content": [{ content: ["normal", ...A()] }],
			"align-items": [{ items: [...j(), { baseline: ["", "last"] }] }],
			"align-self": [{ self: [
				"auto",
				...j(),
				{ baseline: ["", "last"] }
			] }],
			"place-content": [{ "place-content": A() }],
			"place-items": [{ "place-items": [...j(), "baseline"] }],
			"place-self": [{ "place-self": ["auto", ...j()] }],
			p: [{ p: w() }],
			px: [{ px: w() }],
			py: [{ py: w() }],
			ps: [{ ps: w() }],
			pe: [{ pe: w() }],
			pbs: [{ pbs: w() }],
			pbe: [{ pbe: w() }],
			pt: [{ pt: w() }],
			pr: [{ pr: w() }],
			pb: [{ pb: w() }],
			pl: [{ pl: w() }],
			m: [{ m: M() }],
			mx: [{ mx: M() }],
			my: [{ my: M() }],
			ms: [{ ms: M() }],
			me: [{ me: M() }],
			mbs: [{ mbs: M() }],
			mbe: [{ mbe: M() }],
			mt: [{ mt: M() }],
			mr: [{ mr: M() }],
			mb: [{ mb: M() }],
			ml: [{ ml: M() }],
			"space-x": [{ "space-x": w() }],
			"space-x-reverse": ["space-x-reverse"],
			"space-y": [{ "space-y": w() }],
			"space-y-reverse": ["space-y-reverse"],
			size: [{ size: N() }],
			"inline-size": [{ inline: ["auto", ...P()] }],
			"min-inline-size": [{ "min-inline": ["auto", ...P()] }],
			"max-inline-size": [{ "max-inline": ["none", ...P()] }],
			"block-size": [{ block: ["auto", ...F()] }],
			"min-block-size": [{ "min-block": ["auto", ...F()] }],
			"max-block-size": [{ "max-block": ["none", ...F()] }],
			w: [{ w: [
				s,
				"screen",
				...N()
			] }],
			"min-w": [{ "min-w": [
				s,
				"screen",
				"none",
				...N()
			] }],
			"max-w": [{ "max-w": [
				s,
				"screen",
				"none",
				"prose",
				{ screen: [o] },
				...N()
			] }],
			h: [{ h: [
				"screen",
				"lh",
				...N()
			] }],
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...N()
			] }],
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				"none",
				...N()
			] }],
			"font-size": [{ text: [
				"base",
				n,
				Xf,
				Hf
			] }],
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			"font-style": ["italic", "not-italic"],
			"font-weight": [{ font: [
				r,
				rp,
				Gf
			] }],
			"font-stretch": [{ "font-stretch": [
				"ultra-condensed",
				"extra-condensed",
				"condensed",
				"semi-condensed",
				"normal",
				"semi-expanded",
				"expanded",
				"extra-expanded",
				"ultra-expanded",
				jf,
				Y
			] }],
			"font-family": [{ font: [
				Qf,
				Kf,
				t
			] }],
			"font-features": [{ "font-features": [Y] }],
			"fvn-normal": ["normal-nums"],
			"fvn-ordinal": ["ordinal"],
			"fvn-slashed-zero": ["slashed-zero"],
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			tracking: [{ tracking: [
				i,
				X,
				Y
			] }],
			"line-clamp": [{ "line-clamp": [
				J,
				"none",
				X,
				Y
			] }],
			leading: [{ leading: [
				"none",
				a,
				...w()
			] }],
			"list-image": [{ "list-image": [
				"none",
				X,
				Y
			] }],
			"list-style-position": [{ list: ["inside", "outside"] }],
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				X,
				Y
			] }],
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			"placeholder-color": [{ placeholder: I() }],
			"text-color": [{ text: I() }],
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			"text-decoration-style": [{ decoration: [...re(), "wavy"] }],
			"text-decoration-thickness": [{ decoration: [
				J,
				"from-font",
				"auto",
				Xf,
				$f,
				Hf
			] }],
			"text-decoration-color": [{ decoration: I() }],
			"underline-offset": [{ "underline-offset": [
				J,
				"auto",
				X,
				Y
			] }],
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			indent: [{ indent: w() }],
			"tab-size": [{ tab: [
				Af,
				X,
				Y
			] }],
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				X,
				Y
			] }],
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			wrap: [{ wrap: [
				"break-word",
				"anywhere",
				"normal"
			] }],
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			content: [{ content: [
				"none",
				X,
				Y
			] }],
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			"bg-position": [{ bg: L() }],
			"bg-repeat": [{ bg: R() }],
			"bg-size": [{ bg: ee() }],
			"bg-image": [{ bg: [
				"none",
				{
					linear: [
						{ to: [
							"t",
							"tr",
							"r",
							"br",
							"b",
							"bl",
							"l",
							"tl"
						] },
						Af,
						X,
						Y
					],
					radial: [
						"",
						X,
						Y
					],
					conic: [
						"",
						Af,
						X,
						Y
					]
				},
				tp,
				Jf
			] }],
			"bg-color": [{ bg: I() }],
			"gradient-from-pos": [{ from: te() }],
			"gradient-via-pos": [{ via: te() }],
			"gradient-to-pos": [{ to: te() }],
			"gradient-from": [{ from: I() }],
			"gradient-via": [{ via: I() }],
			"gradient-to": [{ to: I() }],
			rounded: [{ rounded: ne() }],
			"rounded-s": [{ "rounded-s": ne() }],
			"rounded-e": [{ "rounded-e": ne() }],
			"rounded-t": [{ "rounded-t": ne() }],
			"rounded-r": [{ "rounded-r": ne() }],
			"rounded-b": [{ "rounded-b": ne() }],
			"rounded-l": [{ "rounded-l": ne() }],
			"rounded-ss": [{ "rounded-ss": ne() }],
			"rounded-se": [{ "rounded-se": ne() }],
			"rounded-ee": [{ "rounded-ee": ne() }],
			"rounded-es": [{ "rounded-es": ne() }],
			"rounded-tl": [{ "rounded-tl": ne() }],
			"rounded-tr": [{ "rounded-tr": ne() }],
			"rounded-br": [{ "rounded-br": ne() }],
			"rounded-bl": [{ "rounded-bl": ne() }],
			"border-w": [{ border: z() }],
			"border-w-x": [{ "border-x": z() }],
			"border-w-y": [{ "border-y": z() }],
			"border-w-s": [{ "border-s": z() }],
			"border-w-e": [{ "border-e": z() }],
			"border-w-bs": [{ "border-bs": z() }],
			"border-w-be": [{ "border-be": z() }],
			"border-w-t": [{ "border-t": z() }],
			"border-w-r": [{ "border-r": z() }],
			"border-w-b": [{ "border-b": z() }],
			"border-w-l": [{ "border-l": z() }],
			"divide-x": [{ "divide-x": z() }],
			"divide-x-reverse": ["divide-x-reverse"],
			"divide-y": [{ "divide-y": z() }],
			"divide-y-reverse": ["divide-y-reverse"],
			"border-style": [{ border: [
				...re(),
				"hidden",
				"none"
			] }],
			"divide-style": [{ divide: [
				...re(),
				"hidden",
				"none"
			] }],
			"border-color": [{ border: I() }],
			"border-color-x": [{ "border-x": I() }],
			"border-color-y": [{ "border-y": I() }],
			"border-color-s": [{ "border-s": I() }],
			"border-color-e": [{ "border-e": I() }],
			"border-color-bs": [{ "border-bs": I() }],
			"border-color-be": [{ "border-be": I() }],
			"border-color-t": [{ "border-t": I() }],
			"border-color-r": [{ "border-r": I() }],
			"border-color-b": [{ "border-b": I() }],
			"border-color-l": [{ "border-l": I() }],
			"divide-color": [{ divide: I() }],
			"outline-style": [{ outline: [
				...re(),
				"none",
				"hidden"
			] }],
			"outline-offset": [{ "outline-offset": [
				J,
				X,
				Y
			] }],
			"outline-w": [{ outline: [
				"",
				J,
				Xf,
				Hf
			] }],
			"outline-color": [{ outline: I() }],
			shadow: [{ shadow: [
				"",
				"inner",
				"none",
				u,
				np,
				Yf
			] }],
			"shadow-color": [{ shadow: I() }],
			"inset-shadow": [{ "inset-shadow": [
				"none",
				d,
				np,
				Yf
			] }],
			"inset-shadow-color": [{ "inset-shadow": I() }],
			"ring-w": [{ ring: z() }],
			"ring-w-inset": ["ring-inset"],
			"ring-color": [{ ring: I() }],
			"ring-offset-w": [{ "ring-offset": [J, Hf] }],
			"ring-offset-color": [{ "ring-offset": I() }],
			"inset-ring-w": [{ "inset-ring": z() }],
			"inset-ring-color": [{ "inset-ring": I() }],
			"text-shadow": [{ "text-shadow": [
				"none",
				f,
				np,
				Yf
			] }],
			"text-shadow-color": [{ "text-shadow": I() }],
			opacity: [{ opacity: [
				J,
				X,
				Y
			] }],
			"mix-blend": [{ "mix-blend": [
				...ie(),
				"plus-darker",
				"plus-lighter"
			] }],
			"bg-blend": [{ "bg-blend": ie() }],
			"mask-clip": [{ "mask-clip": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }, "mask-no-clip"],
			"mask-composite": [{ mask: [
				"add",
				"subtract",
				"intersect",
				"exclude"
			] }],
			"mask-image-linear-pos": [{ "mask-linear": [J] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": B() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": B() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": I() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": I() }],
			"mask-image-t-from-pos": [{ "mask-t-from": B() }],
			"mask-image-t-to-pos": [{ "mask-t-to": B() }],
			"mask-image-t-from-color": [{ "mask-t-from": I() }],
			"mask-image-t-to-color": [{ "mask-t-to": I() }],
			"mask-image-r-from-pos": [{ "mask-r-from": B() }],
			"mask-image-r-to-pos": [{ "mask-r-to": B() }],
			"mask-image-r-from-color": [{ "mask-r-from": I() }],
			"mask-image-r-to-color": [{ "mask-r-to": I() }],
			"mask-image-b-from-pos": [{ "mask-b-from": B() }],
			"mask-image-b-to-pos": [{ "mask-b-to": B() }],
			"mask-image-b-from-color": [{ "mask-b-from": I() }],
			"mask-image-b-to-color": [{ "mask-b-to": I() }],
			"mask-image-l-from-pos": [{ "mask-l-from": B() }],
			"mask-image-l-to-pos": [{ "mask-l-to": B() }],
			"mask-image-l-from-color": [{ "mask-l-from": I() }],
			"mask-image-l-to-color": [{ "mask-l-to": I() }],
			"mask-image-x-from-pos": [{ "mask-x-from": B() }],
			"mask-image-x-to-pos": [{ "mask-x-to": B() }],
			"mask-image-x-from-color": [{ "mask-x-from": I() }],
			"mask-image-x-to-color": [{ "mask-x-to": I() }],
			"mask-image-y-from-pos": [{ "mask-y-from": B() }],
			"mask-image-y-to-pos": [{ "mask-y-to": B() }],
			"mask-image-y-from-color": [{ "mask-y-from": I() }],
			"mask-image-y-to-color": [{ "mask-y-to": I() }],
			"mask-image-radial": [{ "mask-radial": [X, Y] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": B() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": B() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": I() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": I() }],
			"mask-image-radial-shape": [{ mask: ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": b() }],
			"mask-image-conic-pos": [{ "mask-conic": [J] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": B() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": B() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": I() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": I() }],
			"mask-mode": [{ mask: [
				"alpha",
				"luminance",
				"match"
			] }],
			"mask-origin": [{ "mask-origin": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }],
			"mask-position": [{ mask: L() }],
			"mask-repeat": [{ mask: R() }],
			"mask-size": [{ mask: ee() }],
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			"mask-image": [{ mask: [
				"none",
				X,
				Y
			] }],
			filter: [{ filter: [
				"",
				"none",
				X,
				Y
			] }],
			blur: [{ blur: ae() }],
			brightness: [{ brightness: [
				J,
				X,
				Y
			] }],
			contrast: [{ contrast: [
				J,
				X,
				Y
			] }],
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				p,
				np,
				Yf
			] }],
			"drop-shadow-color": [{ "drop-shadow": I() }],
			grayscale: [{ grayscale: [
				"",
				J,
				X,
				Y
			] }],
			"hue-rotate": [{ "hue-rotate": [
				J,
				X,
				Y
			] }],
			invert: [{ invert: [
				"",
				J,
				X,
				Y
			] }],
			saturate: [{ saturate: [
				J,
				X,
				Y
			] }],
			sepia: [{ sepia: [
				"",
				J,
				X,
				Y
			] }],
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				X,
				Y
			] }],
			"backdrop-blur": [{ "backdrop-blur": ae() }],
			"backdrop-brightness": [{ "backdrop-brightness": [
				J,
				X,
				Y
			] }],
			"backdrop-contrast": [{ "backdrop-contrast": [
				J,
				X,
				Y
			] }],
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				J,
				X,
				Y
			] }],
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				J,
				X,
				Y
			] }],
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				J,
				X,
				Y
			] }],
			"backdrop-opacity": [{ "backdrop-opacity": [
				J,
				X,
				Y
			] }],
			"backdrop-saturate": [{ "backdrop-saturate": [
				J,
				X,
				Y
			] }],
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				J,
				X,
				Y
			] }],
			"border-collapse": [{ border: ["collapse", "separate"] }],
			"border-spacing": [{ "border-spacing": w() }],
			"border-spacing-x": [{ "border-spacing-x": w() }],
			"border-spacing-y": [{ "border-spacing-y": w() }],
			"table-layout": [{ table: ["auto", "fixed"] }],
			caption: [{ caption: ["top", "bottom"] }],
			transition: [{ transition: [
				"",
				"all",
				"colors",
				"opacity",
				"shadow",
				"transform",
				"none",
				X,
				Y
			] }],
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			duration: [{ duration: [
				J,
				"initial",
				X,
				Y
			] }],
			ease: [{ ease: [
				"linear",
				"initial",
				_,
				X,
				Y
			] }],
			delay: [{ delay: [
				J,
				X,
				Y
			] }],
			animate: [{ animate: [
				"none",
				v,
				X,
				Y
			] }],
			backface: [{ backface: ["hidden", "visible"] }],
			perspective: [{ perspective: [
				h,
				X,
				Y
			] }],
			"perspective-origin": [{ "perspective-origin": x() }],
			rotate: [{ rotate: oe() }],
			"rotate-x": [{ "rotate-x": oe() }],
			"rotate-y": [{ "rotate-y": oe() }],
			"rotate-z": [{ "rotate-z": oe() }],
			scale: [{ scale: se() }],
			"scale-x": [{ "scale-x": se() }],
			"scale-y": [{ "scale-y": se() }],
			"scale-z": [{ "scale-z": se() }],
			"scale-3d": ["scale-3d"],
			skew: [{ skew: V() }],
			"skew-x": [{ "skew-x": V() }],
			"skew-y": [{ "skew-y": V() }],
			transform: [{ transform: [
				X,
				Y,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			"transform-origin": [{ origin: x() }],
			"transform-style": [{ transform: ["3d", "flat"] }],
			translate: [{ translate: H() }],
			"translate-x": [{ "translate-x": H() }],
			"translate-y": [{ "translate-y": H() }],
			"translate-z": [{ "translate-z": H() }],
			"translate-none": ["translate-none"],
			zoom: [{ zoom: [
				Af,
				X,
				Y
			] }],
			accent: [{ accent: I() }],
			appearance: [{ appearance: ["none", "auto"] }],
			"caret-color": [{ caret: I() }],
			"color-scheme": [{ scheme: [
				"normal",
				"dark",
				"light",
				"light-dark",
				"only-dark",
				"only-light"
			] }],
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				X,
				Y
			] }],
			"field-sizing": [{ "field-sizing": ["fixed", "content"] }],
			"pointer-events": [{ "pointer-events": ["auto", "none"] }],
			resize: [{ resize: [
				"none",
				"",
				"y",
				"x"
			] }],
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			"scrollbar-thumb-color": [{ "scrollbar-thumb": I() }],
			"scrollbar-track-color": [{ "scrollbar-track": I() }],
			"scrollbar-gutter": [{ "scrollbar-gutter": [
				"auto",
				"stable",
				"both"
			] }],
			"scrollbar-w": [{ scrollbar: [
				"auto",
				"thin",
				"none"
			] }],
			"scroll-m": [{ "scroll-m": w() }],
			"scroll-mx": [{ "scroll-mx": w() }],
			"scroll-my": [{ "scroll-my": w() }],
			"scroll-ms": [{ "scroll-ms": w() }],
			"scroll-me": [{ "scroll-me": w() }],
			"scroll-mbs": [{ "scroll-mbs": w() }],
			"scroll-mbe": [{ "scroll-mbe": w() }],
			"scroll-mt": [{ "scroll-mt": w() }],
			"scroll-mr": [{ "scroll-mr": w() }],
			"scroll-mb": [{ "scroll-mb": w() }],
			"scroll-ml": [{ "scroll-ml": w() }],
			"scroll-p": [{ "scroll-p": w() }],
			"scroll-px": [{ "scroll-px": w() }],
			"scroll-py": [{ "scroll-py": w() }],
			"scroll-ps": [{ "scroll-ps": w() }],
			"scroll-pe": [{ "scroll-pe": w() }],
			"scroll-pbs": [{ "scroll-pbs": w() }],
			"scroll-pbe": [{ "scroll-pbe": w() }],
			"scroll-pt": [{ "scroll-pt": w() }],
			"scroll-pr": [{ "scroll-pr": w() }],
			"scroll-pb": [{ "scroll-pb": w() }],
			"scroll-pl": [{ "scroll-pl": w() }],
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			"snap-stop": [{ snap: ["normal", "always"] }],
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			"touch-pz": ["touch-pinch-zoom"],
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				X,
				Y
			] }],
			fill: [{ fill: ["none", ...I()] }],
			"stroke-w": [{ stroke: [
				J,
				Xf,
				Hf,
				Wf
			] }],
			stroke: [{ stroke: ["none", ...I()] }],
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			"container-named": ["container-type"],
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"inset-bs",
				"inset-be",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": [
				"start",
				"end",
				"right",
				"left"
			],
			"inset-y": [
				"inset-bs",
				"inset-be",
				"top",
				"bottom"
			],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			"place-content": ["align-content", "justify-content"],
			"place-items": ["align-items", "justify-items"],
			"place-self": ["align-self", "justify-self"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pbs",
				"pbe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: [
				"ps",
				"pe",
				"pr",
				"pl"
			],
			py: [
				"pbs",
				"pbe",
				"pt",
				"pb"
			],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mbs",
				"mbe",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: [
				"ms",
				"me",
				"mr",
				"ml"
			],
			my: [
				"mbs",
				"mbe",
				"mt",
				"mb"
			],
			size: ["w", "h"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			sr: /* @__PURE__ */ "not-sr.position.size.w.h.p.px.py.ps.pe.pbs.pbe.pt.pr.pb.pl.m.mx.my.ms.me.mbs.mbe.mt.mr.mb.ml.overflow.overflow-x.overflow-y.whitespace".split("."),
			"not-sr": ["sr"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-x",
				"border-w-y",
				"border-w-s",
				"border-w-e",
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": [
				"border-w-s",
				"border-w-e",
				"border-w-r",
				"border-w-l"
			],
			"border-w-y": [
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-b"
			],
			"border-color": [
				"border-color-x",
				"border-color-y",
				"border-color-s",
				"border-color-e",
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": [
				"border-color-s",
				"border-color-e",
				"border-color-r",
				"border-color-l"
			],
			"border-color-y": [
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-b"
			],
			"mask-image-x-from-pos": ["mask-image-r-from-pos", "mask-image-l-from-pos"],
			"mask-image-x-to-pos": ["mask-image-r-to-pos", "mask-image-l-to-pos"],
			"mask-image-x-from-color": ["mask-image-r-from-color", "mask-image-l-from-color"],
			"mask-image-x-to-color": ["mask-image-r-to-color", "mask-image-l-to-color"],
			"mask-image-y-from-pos": ["mask-image-t-from-pos", "mask-image-b-from-pos"],
			"mask-image-y-to-pos": ["mask-image-t-to-pos", "mask-image-b-to-pos"],
			"mask-image-y-from-color": ["mask-image-t-from-color", "mask-image-b-from-color"],
			"mask-image-y-to-color": ["mask-image-t-to-color", "mask-image-b-to-color"],
			translate: [
				"translate-x",
				"translate-y",
				"translate-none"
			],
			"translate-none": [
				"translate",
				"translate-x",
				"translate-y",
				"translate-z"
			],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": [
				"scroll-ms",
				"scroll-me",
				"scroll-mr",
				"scroll-ml"
			],
			"scroll-my": [
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mb"
			],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": [
				"scroll-ps",
				"scroll-pe",
				"scroll-pr",
				"scroll-pl"
			],
			"scroll-py": [
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pb"
			],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] },
		postfixLookupClassGroups: ["container-type"],
		orderSensitiveModifiers: [
			"*",
			"**",
			"after",
			"backdrop",
			"before",
			"details-content",
			"file",
			"first-letter",
			"first-line",
			"marker",
			"placeholder",
			"selection"
		]
	};
});
// src/lib/utils.ts
function gp(...e) {
	return hp(Rd(e));
}
// src/components/chat/chat-typing-indicator.tsx
function _p({ label: e, visible: t = !0, className: n, ...r }) {
	return /* @__PURE__ */ (0, q.jsx)(hu, { children: t && /* @__PURE__ */ (0, q.jsx)(p.Fragment, { children: /* @__PURE__ */ (0, q.jsx)(vp, {
		label: e,
		className: n,
		...r
	}) }, "typing") });
}
function vp({ label: e, className: t, ...n }) {
	let r = kd(), [i, a] = fu();
	return /* @__PURE__ */ (0, q.jsx)(Ad.div, {
		className: "overflow-hidden",
		initial: {
			height: 0,
			opacity: 0
		},
		animate: i ? {
			height: "auto",
			opacity: 1
		} : {
			height: 0,
			opacity: 0
		},
		transition: {
			duration: r ? 0 : .2,
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		onAnimationComplete: () => {
			i || a?.();
		},
		children: /* @__PURE__ */ (0, q.jsxs)("div", {
			role: "status",
			"data-slot": "chat-typing-indicator",
			className: gp("flex items-center gap-2.5", t),
			...n,
			children: [/* @__PURE__ */ (0, q.jsx)(Ad.div, {
				"aria-hidden": "true",
				className: "flex origin-bottom-left items-center gap-1 rounded-2xl rounded-es-md bg-muted/72 px-3 py-3.5 rtl:origin-bottom-right",
				initial: { transform: r ? "scale(1)" : "scale(0.92)" },
				animate: { transform: i || r ? "scale(1)" : "scale(0.96)" },
				transition: {
					duration: r ? 0 : .2,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				children: [
					0,
					1,
					2
				].map((e) => /* @__PURE__ */ (0, q.jsx)(Ad.span, {
					className: "block size-1.5 rounded-full bg-muted-foreground",
					initial: {
						transform: "translateY(0px) scale(0.8)",
						opacity: .4
					},
					animate: r ? {
						transform: "translateY(0px) scale(1)",
						opacity: 1
					} : {
						transform: [
							"translateY(0px) scale(0.8)",
							"translateY(-2px) scale(1.1)",
							"translateY(0px) scale(0.8)",
							"translateY(0px) scale(0.8)"
						],
						opacity: [
							.4,
							1,
							.4,
							.4
						]
					},
					transition: r ? { duration: 0 } : {
						duration: 1.4,
						times: [
							0,
							.22,
							.44,
							1
						],
						delay: e * .16,
						repeat: Infinity,
						ease: "easeInOut"
					}
				}, e))
			}), /* @__PURE__ */ (0, q.jsx)("span", {
				className: "min-w-0 text-muted-foreground text-xs",
				children: e
			})]
		})
	});
}
// src/islands/CossChatExperienceIsland.tsx
function yp() {
	let e = document.getElementById("stop-chat-btn");
	if (e && !e.hidden) {
		let t = window.getComputedStyle(e);
		if (t.display !== "none" && t.visibility !== "hidden") return !0;
	}
	let t = document.getElementById("chat-messages");
	return t ? !!t.querySelector(".typing-indicator, .message.assistant.is-streaming, .streaming-indicator") : !1;
}
function bp() {
	if (typeof window.t == "function") {
		let e = window.t("chat.thinking");
		if (e && e !== "chat.thinking") return String(e);
	}
	return document.documentElement.lang?.startsWith("zh") ? "正在思考与执行" : "Thinking";
}
function xp() {
	let [e, t] = (0, p.useState)(!1), [n, r] = (0, p.useState)(bp);
	return (0, p.useEffect)(() => {
		let e = () => {
			t(yp()), r(bp());
		};
		e();
		let n = new MutationObserver(e), i = document.getElementById("page-chat");
		i && n.observe(i, {
			childList: !0,
			subtree: !0,
			attributes: !0,
			attributeFilter: [
				"style",
				"hidden",
				"class"
			]
		});
		let a = () => r(bp());
		return window.addEventListener("languageChanged", a), () => {
			n.disconnect(), window.removeEventListener("languageChanged", a);
		};
	}, []), /* @__PURE__ */ (0, q.jsx)("div", {
		className: "coss-island flex items-center justify-start px-4 pb-1.5 pointer-events-none",
		children: /* @__PURE__ */ (0, q.jsx)(_p, {
			label: n,
			visible: e
		})
	});
}
// node_modules/.pnpm/lucide-react@1.77.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
var Sp = (e) => (e.match(/\d+[xX]\d+|[A-Z]?[a-z]+|[A-Z]|\d+/g) ?? []).join("-").toLowerCase();
// node_modules/.pnpm/lucide-react@1.77.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
function Cp(e, t, n = []) {
	if (t == null) throw Error("[lucide]: iconNode is required when icon name is used");
	return {
		name: Sp(e),
		size: 24,
		node: t,
		...n.length > 0 ? { aliases: n } : {}
	};
}
// node_modules/.pnpm/lucide-react@1.77.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
var wp = (e) => {
	let t = "", n = !1;
	for (let r of e) r === "-" || r === "_" || r <= " " ? n = t.length > 0 : (t.length === 0 ? t += r.toLowerCase() : t += n ? r.toUpperCase() : r, n = !1);
	return t;
}, Tp = (e) => {
	let t = wp(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, Ep = (...e) => {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) if (typeof n == "string") for (let e of n.split(/\s+/)) e && t.add(e);
	return [...t].join(" ");
}, Dp = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
};
// node_modules/.pnpm/lucide-react@1.77.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs
function Op(e) {
	return e != null;
}
function kp(e, t = {}) {
	let n = t.attributeNames ?? {}, r = (e) => n[e] ?? e, i = e.size ?? e.width ?? Dp.width, a = e.size ?? e.height ?? Dp.height, o = e.aliases?.filter((e) => typeof e == "string" && e.trim() !== "").map((e) => `lucide-${e}`) ?? [], s = [...e.name ? [`lucide-${e.name}`] : [], ...o], c = t.className?.split(" ").filter(Boolean) ?? [], l = t.includeDefaultClasses === !1 ? Ep(...c) : Ep("lucide", ...s, ...c), u = t.absoluteStrokeWidth ? Number(t.strokeWidth ?? Dp["stroke-width"]) * Number(e.size ?? e.width ?? Dp.width) / Number(t.size ?? t.width ?? Dp.width) : t.strokeWidth ?? Dp["stroke-width"];
	return [
		"svg",
		{
			...Object.entries(Dp).reduce((e, [t, n]) => (e[r(t)] = n, e), {}),
			..."color" in t && t.color && { [r("stroke")]: t.color },
			..."size" in t && Op(t.size) && {
				[r("width")]: t.size,
				[r("height")]: t.size
			},
			..."width" in t && Op(t.width) && { [r("width")]: t.width },
			..."height" in t && Op(t.height) && { [r("height")]: t.height },
			[r("stroke-width")]: u,
			...l && { [r("class")]: l },
			[r("viewBox")]: `0 0 ${i} ${a}`,
			...t.hasA11yProp === !1 ? { [r("aria-hidden")]: "true" } : {},
			..."attributes" in t && t.attributes
		},
		e.node.map((e) => {
			let [n, i, a] = e, o = t.nonScalingStroke ? {
				[r("vector-effect")]: "non-scaling-stroke",
				...i
			} : i;
			return a ? [
				n,
				o,
				a
			] : [n, o];
		})
	];
}
// node_modules/.pnpm/lucide-react@1.77.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs
function Ap(e, t = {}) {
	return kp(e, {
		...t,
		attributeNames: {
			...t.attributeNames,
			class: "className",
			"stroke-width": "strokeWidth",
			"stroke-linecap": "strokeLinecap",
			"stroke-linejoin": "strokeLinejoin",
			"vector-effect": "vectorEffect"
		}
	});
}
// node_modules/.pnpm/lucide-react@1.77.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
var jp = (e) => {
	if (typeof e != "object" || !e) return !1;
	for (let t in e) if (Object.prototype.hasOwnProperty.call(e, t) && (t.startsWith("aria-") || t === "role" || t === "title") && e[t] != null) return !0;
	return !1;
}, Mp = (0, p.createContext)({}), Np = () => (0, p.useContext)(Mp), Pp = (0, p.forwardRef)(({ color: e, size: t, width: n, height: r, strokeWidth: i, absoluteStrokeWidth: a, nonScalingStroke: o, className: s = "", children: c, iconNode: l = [], icon: u = {
	node: l,
	aliases: [],
	size: 24
}, ...d }, f) => {
	let { size: m = 24, strokeWidth: h = 2, absoluteStrokeWidth: g = !1, nonScalingStroke: _ = !1, color: v = "currentColor", className: y = "" } = Np() ?? {}, b = !!c || jp(d), [x, S, C = []] = Ap(u, {
		color: e ?? v,
		width: n ?? t ?? m,
		height: r ?? t ?? m,
		strokeWidth: i ?? h,
		absoluteStrokeWidth: a ?? g,
		nonScalingStroke: o ?? _,
		className: Ep(y, s),
		hasA11yProp: b,
		attributes: d
	});
	return (0, p.createElement)(x, {
		ref: f,
		...S
	}, [...C.map(([e, t]) => (0, p.createElement)(e, t)), ...Array.isArray(c) ? c : [c]]);
});
// node_modules/.pnpm/lucide-react@1.77.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/createLucideIcon.mjs
function Fp(e, t = [], n = []) {
	let r = typeof e == "string" ? Cp(e, t, n) : e, i = (0, p.forwardRef)(({ className: e, ...t }, n) => (0, p.createElement)(Pp, {
		ref: n,
		icon: r,
		className: e,
		...t
	}));
	return r.name && (i.displayName = Tp(r.name)), i;
}
// node_modules/.pnpm/lucide-react@1.77.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/activity.mjs
var Ip = {
	name: "activity",
	size: 24,
	node: [["path", {
		d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
		key: "169zse"
	}]]
};
Ip.node;
var Lp = Fp(Ip), Rp = {
	name: "arrow-down",
	size: 24,
	node: [["path", {
		d: "M12 5v14",
		key: "s699le"
	}], ["path", {
		d: "m19 12-7 7-7-7",
		key: "1idqje"
	}]]
};
Rp.node;
var zp = Fp(Rp), Bp = {
	name: "arrow-up",
	size: 24,
	node: [["path", {
		d: "m5 12 7-7 7 7",
		key: "hav0vg"
	}], ["path", {
		d: "M12 19V5",
		key: "x0mq9r"
	}]]
};
Bp.node;
var Vp = Fp(Bp), Hp = {
	name: "book-open",
	size: 24,
	node: [["path", {
		d: "M12 5v16",
		key: "1f6ucr"
	}], ["path", {
		d: "M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z",
		key: "1fyvmf"
	}]]
};
Hp.node;
var Up = Fp(Hp), Wp = {
	name: "bot",
	size: 24,
	node: [
		["path", {
			d: "M12 8V4H8",
			key: "hb8ula"
		}],
		["rect", {
			width: "16",
			height: "12",
			x: "4",
			y: "8",
			rx: "2",
			key: "enze0r"
		}],
		["path", {
			d: "M2 14h2",
			key: "vft8re"
		}],
		["path", {
			d: "M20 14h2",
			key: "4cs60a"
		}],
		["path", {
			d: "M15 13v2",
			key: "1xurst"
		}],
		["path", {
			d: "M9 13v2",
			key: "rq6x2g"
		}]
	]
};
Wp.node;
var Gp = Fp(Wp), Kp = {
	name: "chevrons-up-down",
	size: 24,
	node: [["path", {
		d: "m7 15 5 5 5-5",
		key: "1hf1tw"
	}], ["path", {
		d: "m7 9 5-5 5 5",
		key: "sgt6xg"
	}]]
};
Kp.node;
var qp = Fp(Kp), Jp = {
	name: "circle-check",
	size: 24,
	node: [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "m16 9-5.5 5.5L8 12",
		key: "xofnsj"
	}]],
	aliases: ["check-circle-2"]
};
Jp.node;
var Yp = Fp(Jp), Xp = {
	name: "circle-exclamation-point",
	size: 24,
	node: [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "8",
			y2: "12",
			key: "1pkeuh"
		}],
		["line", {
			x1: "12",
			x2: "12.01",
			y1: "16",
			y2: "16",
			key: "4dfq90"
		}]
	],
	aliases: ["alert-circle", "circle-alert"]
};
Xp.node;
var Zp = Fp(Xp), Qp = {
	name: "corner-down-left",
	size: 24,
	node: [["path", {
		d: "M20 4v7a4 4 0 0 1-4 4H4",
		key: "6o5b7l"
	}], ["path", {
		d: "m9 10-5 5 5 5",
		key: "1kshq7"
	}]]
};
Qp.node;
var $p = Fp(Qp), em = {
	name: "database",
	size: 24,
	node: [
		["ellipse", {
			cx: "12",
			cy: "5",
			rx: "9",
			ry: "3",
			key: "msslwz"
		}],
		["path", {
			d: "M3 5V19A9 3 0 0 0 21 19V5",
			key: "1wlel7"
		}],
		["path", {
			d: "M3 12A9 3 0 0 0 21 12",
			key: "mv7ke4"
		}]
	]
};
em.node;
var tm = Fp(em), nm = {
	name: "file-text",
	size: 24,
	node: [
		["path", {
			d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
			key: "1oefj6"
		}],
		["path", {
			d: "M14 2v5a1 1 0 0 0 1 1h5",
			key: "wfsgrz"
		}],
		["path", {
			d: "M10 9H8",
			key: "b1mrlr"
		}],
		["path", {
			d: "M16 13H8",
			key: "t4e002"
		}],
		["path", {
			d: "M16 17H8",
			key: "z1uh3a"
		}]
	]
};
nm.node;
var rm = Fp(nm), im = {
	name: "folder-kanban",
	size: 24,
	node: [
		["path", {
			d: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z",
			key: "1fr9dc"
		}],
		["path", {
			d: "M8 10v4",
			key: "tgpxqk"
		}],
		["path", {
			d: "M12 10v2",
			key: "hh53o1"
		}],
		["path", {
			d: "M16 10v6",
			key: "1d6xys"
		}]
	]
};
im.node;
var am = Fp(im), om = {
	name: "git-branch",
	size: 24,
	node: [
		["path", {
			d: "M15 6a9 9 0 0 0-9 9V3",
			key: "1cii5b"
		}],
		["circle", {
			cx: "18",
			cy: "6",
			r: "3",
			key: "1h7g24"
		}],
		["circle", {
			cx: "6",
			cy: "18",
			r: "3",
			key: "fqmcym"
		}]
	]
};
om.node;
var sm = Fp(om), cm = {
	name: "info",
	size: 24,
	node: [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M12 16v-4",
			key: "1dtifu"
		}],
		["path", {
			d: "M12 8h.01",
			key: "e9boi3"
		}]
	]
};
cm.node;
var lm = Fp(cm), um = {
	name: "key-round",
	size: 24,
	node: [["path", {
		d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
		key: "1s6t7t"
	}], ["circle", {
		cx: "16.5",
		cy: "7.5",
		r: ".5",
		fill: "currentColor",
		key: "w0ekpg"
	}]]
};
um.node;
var dm = Fp(um), fm = {
	name: "layout-dashboard",
	size: 24,
	node: [
		["rect", {
			width: "7",
			height: "9",
			x: "3",
			y: "3",
			rx: "1",
			key: "10lvy0"
		}],
		["rect", {
			width: "7",
			height: "5",
			x: "14",
			y: "3",
			rx: "1",
			key: "16une8"
		}],
		["rect", {
			width: "7",
			height: "9",
			x: "14",
			y: "12",
			rx: "1",
			key: "1hutg5"
		}],
		["rect", {
			width: "7",
			height: "5",
			x: "3",
			y: "16",
			rx: "1",
			key: "ldoo1y"
		}]
	]
};
fm.node;
var pm = Fp(fm), mm = {
	name: "loader-circle",
	size: 24,
	node: [["path", {
		d: "M21 12a9 9 0 1 1-6.219-8.56",
		key: "13zald"
	}]],
	aliases: ["loader-2"]
};
mm.node;
var hm = Fp(mm), gm = {
	name: "message-square",
	size: 24,
	node: [["path", {
		d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
		key: "18887p"
	}]]
};
gm.node;
var _m = Fp(gm), vm = {
	name: "network",
	size: 24,
	node: [
		["rect", {
			x: "16",
			y: "16",
			width: "6",
			height: "6",
			rx: "1",
			key: "4q2zg0"
		}],
		["rect", {
			x: "2",
			y: "16",
			width: "6",
			height: "6",
			rx: "1",
			key: "8cvhb9"
		}],
		["rect", {
			x: "9",
			y: "2",
			width: "6",
			height: "6",
			rx: "1",
			key: "1egb70"
		}],
		["path", {
			d: "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3",
			key: "1jsf9p"
		}],
		["path", {
			d: "M12 12V8",
			key: "2874zd"
		}]
	]
};
vm.node;
var ym = Fp(vm), bm = {
	name: "panel-left",
	size: 24,
	node: [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "M9 3v18",
		key: "fh3hqa"
	}]],
	aliases: ["sidebar"]
};
bm.node;
var xm = Fp(bm), Sm = {
	name: "plus",
	size: 24,
	node: [["path", {
		d: "M5 12h14",
		key: "1ays0h"
	}], ["path", {
		d: "M12 5v14",
		key: "s699le"
	}]]
};
Sm.node;
var Cm = Fp(Sm), wm = {
	name: "radar",
	size: 24,
	node: [
		["path", {
			d: "M19.07 4.93A10 10 0 0 0 6.99 3.34",
			key: "z3du51"
		}],
		["path", {
			d: "M4 6h.01",
			key: "oypzma"
		}],
		["path", {
			d: "M2.29 9.62A10 10 0 1 0 21.31 8.35",
			key: "qzzz0"
		}],
		["path", {
			d: "M16.24 7.76A6 6 0 1 0 8.23 16.67",
			key: "1yjesh"
		}],
		["path", {
			d: "M12 18h.01",
			key: "mhygvu"
		}],
		["path", {
			d: "M17.99 11.66A6 6 0 0 1 15.77 16.67",
			key: "1u2y91"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "2",
			key: "1c9p78"
		}],
		["path", {
			d: "m13.41 10.59 5.66-5.66",
			key: "mhq4k0"
		}]
	]
};
wm.node;
var Tm = Fp(wm), Em = {
	name: "radio",
	size: 24,
	node: [
		["path", {
			d: "M16.247 7.761a6 6 0 0 1 0 8.478",
			key: "1fwjs5"
		}],
		["path", {
			d: "M19.075 4.933a10 10 0 0 1 0 14.134",
			key: "ehdyv1"
		}],
		["path", {
			d: "M4.925 19.067a10 10 0 0 1 0-14.134",
			key: "1q22gi"
		}],
		["path", {
			d: "M7.753 16.239a6 6 0 0 1 0-8.478",
			key: "r2q7qm"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "2",
			key: "1c9p78"
		}]
	]
};
Em.node;
var Dm = Fp(Em), Om = {
	name: "search",
	size: 24,
	node: [["path", {
		d: "m21 21-4.34-4.34",
		key: "14j7rj"
	}], ["circle", {
		cx: "11",
		cy: "11",
		r: "8",
		key: "4ej97u"
	}]]
};
Om.node;
var km = Fp(Om), Am = {
	name: "server",
	size: 24,
	node: [
		["rect", {
			width: "20",
			height: "8",
			x: "2",
			y: "2",
			rx: "2",
			ry: "2",
			key: "ngkwjq"
		}],
		["rect", {
			width: "20",
			height: "8",
			x: "2",
			y: "14",
			rx: "2",
			ry: "2",
			key: "iecqi9"
		}],
		["line", {
			x1: "6",
			x2: "6.01",
			y1: "6",
			y2: "6",
			key: "16zg32"
		}],
		["line", {
			x1: "6",
			x2: "6.01",
			y1: "18",
			y2: "18",
			key: "nzw8ys"
		}]
	]
};
Am.node;
var jm = Fp(Am), Mm = {
	name: "settings",
	size: 24,
	node: [["path", {
		d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
		key: "1i5ecw"
	}], ["circle", {
		cx: "12",
		cy: "12",
		r: "3",
		key: "1v7zrd"
	}]]
};
Mm.node;
var Nm = Fp(Mm), Pm = {
	name: "shield-check",
	size: 24,
	node: [["path", {
		d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
		key: "oel41y"
	}], ["path", {
		d: "m9 12 2 2 4-4",
		key: "dzmm74"
	}]]
};
Pm.node;
var Fm = Fp(Pm), Im = {
	name: "shield-exclamation-point",
	size: 24,
	node: [
		["path", {
			d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
			key: "oel41y"
		}],
		["path", {
			d: "M12 8v4",
			key: "1got3b"
		}],
		["path", {
			d: "M12 16h.01",
			key: "1drbdi"
		}]
	],
	aliases: ["shield-alert"]
};
Im.node;
var Lm = Fp(Im), Rm = {
	name: "sparkles",
	size: 24,
	node: [
		["path", {
			d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
			key: "1s2grr"
		}],
		["path", {
			d: "M20 2v4",
			key: "1rf3ol"
		}],
		["path", {
			d: "M22 4h-4",
			key: "gwowj6"
		}],
		["circle", {
			cx: "4",
			cy: "20",
			r: "2",
			key: "6kqj1y"
		}]
	],
	aliases: ["stars"]
};
Rm.node;
var zm = Fp(Rm), Bm = {
	name: "square-check-big",
	size: 24,
	node: [["path", {
		d: "M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",
		key: "2acyp4"
	}], ["path", {
		d: "m9 11 3 3L22 4",
		key: "1pflzl"
	}]],
	aliases: ["check-square"]
};
Bm.node;
var Vm = Fp(Bm), Hm = {
	name: "sun-moon",
	size: 24,
	node: [
		["path", {
			d: "M12 2v2",
			key: "tus03m"
		}],
		["path", {
			d: "M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715",
			key: "xlf6rm"
		}],
		["path", {
			d: "M16 12a4 4 0 0 0-4-4",
			key: "6vsxu"
		}],
		["path", {
			d: "m19 5-1.256 1.256",
			key: "1yg6a6"
		}],
		["path", {
			d: "M20 12h2",
			key: "1q8mjw"
		}]
	]
};
Hm.node;
var Um = Fp(Hm), Wm = {
	name: "terminal",
	size: 24,
	node: [["path", {
		d: "M12 19h8",
		key: "baeox8"
	}], ["path", {
		d: "m4 17 6-6-6-6",
		key: "1yngyt"
	}]]
};
Wm.node;
var Gm = Fp(Wm), Km = {
	name: "triangle-exclamation-point",
	size: 24,
	node: [
		["path", {
			d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
			key: "wmoenq"
		}],
		["path", {
			d: "M12 9v4",
			key: "juzpu7"
		}],
		["path", {
			d: "M12 17h.01",
			key: "p32p05"
		}]
	],
	aliases: ["alert-triangle", "triangle-alert"]
};
Km.node;
var qm = Fp(Km), Jm = {
	name: "user-check",
	size: 24,
	node: [
		["path", {
			d: "m16 11 2 2 4-4",
			key: "9rsbq5"
		}],
		["path", {
			d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
			key: "1yyitq"
		}],
		["circle", {
			cx: "9",
			cy: "7",
			r: "4",
			key: "nufk8"
		}]
	]
};
Jm.node;
var Ym = Fp(Jm), Xm = {
	name: "wrench",
	size: 24,
	node: [["path", {
		d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",
		key: "1ngwbx"
	}]]
};
Xm.node;
var Zm = Fp(Xm), Qm = {
	name: "x",
	size: 24,
	node: [["path", {
		d: "M18 6 6 18",
		key: "1bl5f8"
	}], ["path", {
		d: "m6 6 12 12",
		key: "d8bk6v"
	}]]
};
Qm.node;
var $m = Fp(Qm);
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/mergeObjects.mjs
function eh(e, t) {
	if (e && !t) return e;
	if (!e && t) return t;
	if (e || t) return {
		...e,
		...t
	};
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/merge-props/mergeProps.mjs
var th = {};
function nh(e, t, n, r, i) {
	if (!n && !r && !i && !e) return ih(t);
	let a = ih(e);
	return t && (a = ah(a, t)), n && (a = ah(a, n)), r && (a = ah(a, r)), i && (a = ah(a, i)), a;
}
function rh(e) {
	if (e.length === 0) return th;
	if (e.length === 1) return ih(e[0]);
	let t = ih(e[0]);
	for (let n = 1; n < e.length; n += 1) t = ah(t, e[n]);
	return t;
}
function ih(e) {
	return lh(e) ? { ...uh(e, th) } : oh(e);
}
function ah(e, t) {
	return lh(t) ? uh(t, e) : sh(e, t);
}
function oh(e) {
	let t = { ...e };
	for (let e in t) {
		let n = t[e];
		ch(e, n) && (t[e] = fh(n));
	}
	return t;
}
function sh(e, t) {
	if (!t) return e;
	for (let n in t) {
		let r = t[n];
		switch (n) {
			case "style":
				e[n] = eh(e.style, r);
				break;
			case "className":
				e[n] = mh(e.className, r);
				break;
			default: e[n] = ch(n, r) ? dh(e[n], r) : r;
		}
	}
	return e;
}
function ch(e, t) {
	let n = e.charCodeAt(0), r = e.charCodeAt(1), i = e.charCodeAt(2);
	return n === 111 && r === 110 && i >= 65 && i <= 90 && (typeof t == "function" || t === void 0);
}
function lh(e) {
	return typeof e == "function";
}
function uh(e, t) {
	return lh(e) ? e(t) : e ?? th;
}
function dh(e, t) {
	return t ? e ? (...n) => {
		let r = n[0];
		if (hh(r)) {
			let i = r;
			ph(i);
			let a = t(...n);
			return i.baseUIHandlerPrevented || e?.(...n), a;
		}
		let i = t(...n);
		return e?.(...n), i;
	} : fh(t) : e;
}
function fh(e) {
	return e && ((...t) => {
		let n = t[0];
		return hh(n) && ph(n), e(...t);
	});
}
function ph(e) {
	return e.preventBaseUIHandler = () => {
		e.baseUIHandlerPrevented = !0;
	}, e;
}
function mh(e, t) {
	return t ? e ? t + " " + e : t : e;
}
function hh(e) {
	return typeof e == "object" && !!e && "nativeEvent" in e;
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/formatErrorMessage.mjs
function gh(e, t) {
	return function(n, ...r) {
		let i = new URL(e);
		return i.searchParams.set("code", n.toString()), r.forEach((e) => i.searchParams.append("args[]", e)), `${t} error #${n}; visit ${i} for the full message.`;
	};
}
var _h = gh("https://base-ui.com/production-error", "Base UI"), vh = {};
function yh(e, t) {
	let n = p.useRef(vh);
	return n.current === vh && (n.current = e(t)), n;
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/useMergedRefs.mjs
function bh(e, t, n, r) {
	let i = yh(Sh).current;
	return Ch(i, e, t, n, r) && Th(i, [
		e,
		t,
		n,
		r
	]), i.callback;
}
function xh(e) {
	let t = yh(Sh).current;
	return wh(t, e) && Th(t, e), t.callback;
}
function Sh() {
	return {
		callback: null,
		cleanup: null,
		refs: []
	};
}
function Ch(e, t, n, r, i) {
	return e.refs[0] !== t || e.refs[1] !== n || e.refs[2] !== r || e.refs[3] !== i;
}
function wh(e, t) {
	return e.refs.length !== t.length || e.refs.some((e, n) => e !== t[n]);
}
function Th(e, t) {
	e.refs = t, e.callback = t.every((e) => e == null) ? null : (n) => {
		if (e.cleanup &&= (e.cleanup(), null), n != null) {
			let r = Array(t.length).fill(null);
			for (let e = 0; e < t.length; e += 1) {
				let i = t[e];
				if (i != null) switch (typeof i) {
					case "function": {
						let t = i(n);
						typeof t == "function" && (r[e] = t);
						break;
					}
					case "object": i.current = n;
				}
			}
			e.cleanup = () => {
				for (let e = 0; e < t.length; e += 1) {
					let n = t[e];
					if (n != null) switch (typeof n) {
						case "function": {
							let t = r[e];
							typeof t == "function" ? t() : n(null);
							break;
						}
						case "object": n.current = null;
					}
				}
			};
		}
	};
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/reactVersion.mjs
var Eh = 19;
function Dh(e) {
	return Eh >= e;
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/getReactElementRef.mjs
function Oh(e) {
	if (!/*#__PURE__*/ p.isValidElement(e)) return null;
	let t = e, n = t.props;
	return (Dh(19) ? n?.ref : t.ref) ?? null;
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/empty.mjs
function kh() {}
var Ah = Object.freeze([]), jh = Object.freeze({});
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/getStateAttributesProps.mjs
function Mh(e, t) {
	let n = {};
	for (let r in e) {
		let i = e[r];
		if (t?.hasOwnProperty(r)) {
			let e = t[r](i);
			e != null && Object.assign(n, e);
		} else i === !0 ? n[`data-${r.toLowerCase()}`] = "" : i && (n[`data-${r.toLowerCase()}`] = i.toString());
	}
	return n;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/utils/resolveClassName.mjs
function Nh(e, t) {
	return typeof e == "function" ? e(t) : e;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/utils/resolveStyle.mjs
function Ph(e, t) {
	return typeof e == "function" ? e(t) : e;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/useRenderElement.mjs
function Fh(e, t, n = {}) {
	let r = t.render;
	n.enabled !== !1 && (r = zh(r));
	let i = Ih(t, n, r);
	if (n.enabled === !1) return null;
	let a = n.state ?? jh;
	return Bh(e, r, i, a);
}
function Ih(e, t, n) {
	let { className: r, style: i } = e, { state: a = jh, ref: o, props: s, stateAttributesMapping: c, enabled: l = !0 } = t, u = l ? Nh(r, a) : void 0, d = l ? Ph(i, a) : void 0, f = l ? Mh(a, c) : jh, p = l && s ? Lh(s) : void 0, m = l ? eh(f, p) ?? {} : jh;
	return typeof document < "u" && (l ? m.ref = Array.isArray(o) ? xh([
		m.ref,
		Oh(n),
		...o
	]) : bh(m.ref, Oh(n), o) : bh(null, null)), l ? (u !== void 0 && (m.className = mh(m.className, u)), d !== void 0 && (m.style = eh(m.style, d)), m) : jh;
}
function Lh(e) {
	return Array.isArray(e) ? rh(e) : nh(void 0, e);
}
var Rh = Symbol.for("react.lazy");
function zh(e) {
	if (e?.$$typeof !== Rh) return e;
	let t = p.Children.toArray(e)[0];
	return /*#__PURE__*/ p.isValidElement(t) ? t : e;
}
function Bh(e, t, n, r) {
	if (t) {
		if (typeof t == "function") return t(n, r);
		let e = nh(n, t.props);
		return e.ref = n.ref, /*#__PURE__*/ p.cloneElement(t, e);
	}
	if (e && typeof e == "string") return Vh(e, n);
	throw Error(_h(8));
}
function Vh(e, t) {
	return e === "button" ? /*#__PURE__*/ (0, p.createElement)("button", {
		type: "button",
		...t,
		key: t.key
	}) : e === "img" ? /*#__PURE__*/ (0, p.createElement)("img", {
		alt: "",
		...t,
		key: t.key
	}) : /*#__PURE__*/ p.createElement(e, t);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/use-render/useRender.mjs
function Hh(e) {
	return Fh(e.defaultTagName ?? "div", e, e);
}
// node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs
var Uh = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, Wh = Rd, Gh = (e, t) => (n) => {
	if (t?.variants == null) return Wh(e, n?.class, n?.className);
	let { variants: r, defaultVariants: i } = t, a = Object.keys(r).map((e) => {
		let t = n?.[e], a = i?.[e];
		if (t === null) return null;
		let o = Uh(t) || Uh(a);
		return r[e][o];
	}), o = n && Object.entries(n).reduce((e, t) => {
		let [n, r] = t;
		return r === void 0 || (e[n] = r), e;
	}, {});
	return Wh(e, a, t?.compoundVariants?.reduce((e, t) => {
		let { class: n, className: r, ...a } = t;
		return Object.entries(a).every((e) => {
			let [t, n] = e;
			return Array.isArray(n) ? n.includes({
				...i,
				...o
			}[t]) : {
				...i,
				...o
			}[t] === n;
		}) ? [
			...e,
			n,
			r
		] : e;
	}, []), n?.class, n?.className);
}, Kh = Gh("relative inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-sm border border-transparent font-medium outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-3.5 sm:[&_svg:not([class*='size-'])]:size-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [button&,a&]:cursor-pointer [button&,a&]:pointer-coarse:after:absolute [button&,a&]:pointer-coarse:after:size-full [button&,a&]:pointer-coarse:after:min-h-11 [button&,a&]:pointer-coarse:after:min-w-11", {
	defaultVariants: {
		size: "default",
		variant: "default"
	},
	variants: {
		size: {
			default: "h-5.5 min-w-5.5 px-[calc(--spacing(1)-1px)] text-sm sm:h-4.5 sm:min-w-4.5 sm:text-xs",
			lg: "h-6.5 min-w-6.5 px-[calc(--spacing(1.5)-1px)] text-base sm:h-5.5 sm:min-w-5.5 sm:text-sm",
			sm: "h-5 min-w-5 rounded-[.25rem] px-[calc(--spacing(1)-1px)] text-xs sm:h-4 sm:min-w-4 sm:text-[.625rem]"
		},
		variant: {
			default: "bg-primary text-primary-foreground [button&,a&]:hover:bg-primary/90",
			destructive: "bg-destructive text-white [button&,a&]:hover:bg-destructive/90",
			error: "bg-destructive/8 text-destructive-foreground dark:bg-destructive/16",
			info: "bg-info/8 text-info-foreground dark:bg-info/16",
			outline: "border-input bg-background text-foreground dark:bg-input/32 [button&,a&]:hover:bg-accent/50 dark:[button&,a&]:hover:bg-input/48",
			secondary: "bg-secondary text-secondary-foreground [button&,a&]:hover:bg-secondary/90",
			success: "bg-success/8 text-success-foreground dark:bg-success/16",
			warning: "bg-warning/8 text-warning-foreground dark:bg-warning/16"
		}
	}
});
function qh({ className: e, variant: t, size: n, render: r, ...i }) {
	return Hh({
		defaultTagName: "span",
		props: nh({
			className: gp(Kh({
				className: e,
				size: n,
				variant: t
			})),
			"data-slot": "badge"
		}, i),
		render: r
	});
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/dialog/root/DialogRootContext.mjs
var Jh = /*#__PURE__*/ p.createContext(void 0);
function Yh(e) {
	let t = p.useContext(Jh);
	if (!e && t === void 0) throw Error(_h(27));
	return t;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/TransitionStatusDataAttributes.mjs
var Xh = "data-starting-style", Zh = "data-ending-style", Qh = { [Xh]: "" }, $h = { [Zh]: "" }, eg = { transitionStatus(e) {
	return e === "starting" ? Qh : e === "ending" ? $h : null;
} }, tg = "data-open", ng = "data-closed", rg = "data-anchor-hidden", ig = "data-popup-open", ag = "data-pressed", og = { [ig]: "" }, sg = {
	[ig]: "",
	[ag]: ""
}, cg = { [tg]: "" }, lg = { [ng]: "" }, ug = { [rg]: "" }, dg = { open(e) {
	return e ? og : null;
} }, fg = { open(e) {
	return e ? sg : null;
} }, pg = {
	open(e) {
		return e ? cg : lg;
	},
	anchorHidden(e) {
		return e ? ug : null;
	}
}, mg = {
	...pg,
	...eg
}, hg = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, forceRender: a = !1, ...o } = e, s = Yh(), c = s.useState("open"), l = s.useState("nested"), u = s.useState("mounted");
	return Fh("div", e, {
		state: {
			open: c,
			transitionStatus: s.useState("transitionStatus")
		},
		ref: [s.context.backdropRef, t],
		stateAttributesMapping: mg,
		props: [{
			role: "presentation",
			hidden: !u,
			style: {
				userSelect: "none",
				WebkitUserSelect: "none"
			}
		}, o],
		enabled: a || !l
	});
});
// node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function gg() {
	return typeof window < "u";
}
function _g(e) {
	return bg(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function vg(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function yg(e) {
	return ((bg(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function bg(e) {
	return gg() ? e instanceof Node || e instanceof vg(e).Node : !1;
}
function xg(e) {
	return gg() ? e instanceof Element || e instanceof vg(e).Element : !1;
}
function Sg(e) {
	return gg() ? e instanceof HTMLElement || e instanceof vg(e).HTMLElement : !1;
}
function Cg(e) {
	return !gg() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof vg(e).ShadowRoot;
}
function wg(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = Eg(e);
	return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function Tg(e) {
	return /^(html|body|#document)$/.test(_g(e));
}
function Eg(e) {
	return vg(e).getComputedStyle(e);
}
function Dg(e) {
	if (_g(e) === "html") return e;
	let t = e.assignedSlot || e.parentNode || Cg(e) && e.host || yg(e);
	return Cg(t) ? t.host : t;
}
function Og(e) {
	let t = Dg(e);
	return Tg(t) ? (e.ownerDocument || e).body : Sg(t) && wg(t) ? t : Og(t);
}
function kg(e, t, n) {
	t === void 0 && (t = []), n === void 0 && (n = !0);
	let r = Og(e), i = r === e.ownerDocument?.body, a = vg(r);
	if (i) {
		let e = Ag(a);
		return t.concat(a, a.visualViewport || [], wg(r) ? r : [], e && n ? kg(e) : []);
	}
	return t.concat(r, kg(r, [], n));
}
function Ag(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/safeReact.mjs
var jg = { ...p }, Mg = jg.useInsertionEffect, Ng = Mg && Mg !== jg.useLayoutEffect ? Mg : (e) => e();
function Z(e) {
	let t = yh(Pg).current;
	return t.next = e, Ng(t.effect), t.trampoline;
}
function Pg() {
	let e = {
		next: void 0,
		callback: Fg,
		trampoline: (...t) => e.callback?.(...t),
		effect: () => {
			e.callback = e.next;
		}
	};
	return e;
}
function Fg() {}
var Q = typeof document < "u" ? p.useLayoutEffect : () => {}, Ig = /*#__PURE__*/ p.createContext(void 0);
function Lg(e = !1) {
	let t = p.useContext(Ig);
	if (t === void 0 && !e) throw Error(_h(16));
	return t;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/utils/useFocusableWhenDisabled.mjs
function Rg(e) {
	let { focusableWhenDisabled: t, disabled: n, composite: r = !1, tabIndex: i = 0, isNativeButton: a } = e, o = r && t !== !1, s = r && t === !1;
	return { props: p.useMemo(() => {
		let e = { onKeyDown(e) {
			n && t && e.key !== "Tab" && e.preventDefault();
		} };
		return r || (e.tabIndex = i, !a && n && (e.tabIndex = t ? i : -1)), (a && (t || o) || !a && n) && (e["aria-disabled"] = n), a && (!t || s) && (e.disabled = n), e;
	}, [
		r,
		n,
		t,
		o,
		s,
		a,
		i
	]) };
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/owner.mjs
function zg(e) {
	return e?.ownerDocument || document;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/utils/dispatchClickWithModifiers.mjs
function Bg(e, t, { detail: n = 0 } = {}) {
	e.dispatchEvent(new (vg(e)).PointerEvent("click", {
		bubbles: !0,
		cancelable: !0,
		composed: !0,
		detail: n,
		shiftKey: t.shiftKey,
		ctrlKey: t.ctrlKey,
		altKey: t.altKey,
		metaKey: t.metaKey
	}));
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/use-button/useButton.mjs
function Vg(e = {}) {
	let { disabled: t = !1, focusableWhenDisabled: n, tabIndex: r = 0, native: i = !0, composite: a } = e, o = p.useRef(null), s = Lg(!0), c = a ?? s !== void 0, { props: l } = Rg({
		focusableWhenDisabled: n,
		disabled: t,
		composite: c,
		tabIndex: r,
		isNativeButton: i
	}), u = p.useCallback(() => {
		let e = o.current;
		Hg(e) && c && t && l.disabled === void 0 && e.disabled && (e.disabled = !1);
	}, [
		t,
		l.disabled,
		c
	]);
	return Q(u, [u]), {
		getButtonProps: p.useCallback((e = {}) => {
			let { onClick: n, onMouseDown: r, onKeyUp: a, onKeyDown: o, onPointerDown: s, ...u } = e;
			return nh({
				onClick(e) {
					t ? e.preventDefault() : n?.(e);
				},
				onMouseDown(e) {
					t || r?.(e);
				},
				onKeyDown(e) {
					if (t || (ph(e), o?.(e), e.baseUIHandlerPrevented)) return;
					let n = e.target === e.currentTarget, r = e.currentTarget, a = Hg(r), s = !i && Ug(r), l = n && (i ? a : !s), u = e.key === "Enter", d = e.key === " ", f = r.getAttribute("role"), p = f?.startsWith("menuitem") || f === "option" || f === "gridcell";
					if (n && c && d) {
						if (e.defaultPrevented && p) return;
						e.preventDefault(), (!i || a) && (e.preventBaseUIHandler(), Bg(r, e));
					} else !l || i || !d && !u ? n && s && d && e.preventDefault() : e.defaultPrevented || (e.preventDefault(), u && (e.preventBaseUIHandler(), Bg(r, e)));
				},
				onKeyUp(e) {
					t || (ph(e), a?.(e), e.target === e.currentTarget && i && c && Hg(e.currentTarget) && e.key === " " ? e.preventDefault() : e.baseUIHandlerPrevented || e.target !== e.currentTarget || i || c || e.defaultPrevented || e.key !== " " || (e.preventBaseUIHandler(), Bg(e.currentTarget, e)));
				},
				onPointerDown(e) {
					t ? e.preventDefault() : s?.(e);
				}
			}, i ? { type: "button" } : { role: "button" }, l, u);
		}, [
			t,
			l,
			c,
			i
		]),
		buttonRef: Z((e) => {
			o.current = e, u();
		})
	};
}
function Hg(e) {
	return Sg(e) && e.tagName === "BUTTON";
}
function Ug(e) {
	return Sg(e) && e.tagName === "A" && !!e.href;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/reason-parts.mjs
var Wg = "none", Gg = "trigger-press", Kg = "outside-press", qg = "item-press", Jg = "close-press", Yg = "clear-press", Xg = "input-change", Zg = "input-clear", Qg = "input-press", $g = "focus-out", e_ = "escape-key", t_ = "list-navigation", n_ = "keyboard", r_ = "pointer", i_ = "cancel-open", a_ = "imperative-action";
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/createBaseUIEventDetails.mjs
function o_(e, t, n, r) {
	let i = !1, a = !1, o = r ?? jh;
	return {
		reason: e,
		event: t ?? new Event("base-ui"),
		cancel() {
			i = !0;
		},
		allowPropagation() {
			a = !0;
		},
		get isCanceled() {
			return i;
		},
		get isPropagationAllowed() {
			return a;
		},
		trigger: n,
		...o
	};
}
function s_(e, t, n) {
	let r = n ?? jh;
	return {
		reason: e,
		event: t ?? new Event("base-ui"),
		...r
	};
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/useId.mjs
var c_ = 0;
function l_(e, t = "mui") {
	let [n, r] = p.useState(e), i = e || n;
	return p.useEffect(() => {
		n ?? (c_ += 1, r(`${t}-${c_}`));
	}, [n, t]), i;
}
var u_ = jg.useId;
function d_(e, t) {
	if (u_ !== void 0) {
		let n = u_();
		return e ?? (t ? `${t}-${n}` : n);
	}
	return l_(e, t);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/useBaseUiId.mjs
function f_(e) {
	return d_(e, "base-ui");
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/useOnMount.mjs
function p_(e) {
	p.useEffect(e, Ah);
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/useTimeout.mjs
var m_ = 0, h_ = class e {
	static create() {
		return new e();
	}
	currentId = m_;
	start(e, t) {
		this.clear(), this.currentId = setTimeout(() => {
			this.currentId = m_, t();
		}, e);
	}
	isStarted() {
		return this.currentId !== m_;
	}
	clear = () => {
		this.currentId !== m_ && (clearTimeout(this.currentId), this.currentId = m_);
	};
	disposeEffect = () => this.clear;
};
function g_() {
	let e = yh(h_.create).current;
	return p_(e.disposeEffect), e;
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/platform/shared.mjs
function __() {
	return typeof navigator > "u" ? {
		userAgent: "",
		platform: "",
		maxTouchPoints: 0
	} : {
		userAgent: navigator.userAgent,
		platform: navigator.platform ?? "",
		maxTouchPoints: navigator.maxTouchPoints ?? 0
	};
}
var { userAgent: v_, platform: y_, maxTouchPoints: b_ } = __(), x_ = v_.toLowerCase(), S_ = y_.toLowerCase(), C_ = /^i(os$|p)/.test(S_) || S_ === "macintel" && b_ > 1, w_ = "android", T_ = S_ === w_ || x_.includes(w_), E_ = !C_ && S_.startsWith("mac");
S_.startsWith("win"), !T_ && /^(linux|chrome os)/.test(S_);
var D_ = E_ || C_, O_ = typeof CSS < "u" && !!CSS.supports?.("-webkit-backdrop-filter:none"), k_ = !O_ && x_.includes("firefox");
!O_ && x_.includes("chrom");
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/platform/screen-reader.mjs
var A_ = D_, j_ = /jsdom|happydom/.test(x_);
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/utils/event.mjs
function M_(e) {
	e.preventDefault(), e.stopPropagation();
}
function N_(e) {
	return "nativeEvent" in e;
}
function P_(e) {
	return e.pointerType === "" && e.isTrusted ? !0 : T_ && e.pointerType ? e.type === "click" && e.buttons === 1 : e.detail === 0 && !e.pointerType;
}
function F_(e) {
	return j_ ? !1 : !T_ && e.width === 0 && e.height === 0 || T_ && e.width === 1 && e.height === 1 && e.pressure === 0 && e.detail === 0 && e.pointerType === "mouse" || e.width < 1 && e.height < 1 && e.pressure === 0 && e.detail === 0 && e.pointerType === "touch";
}
function I_(e, t) {
	let n = ["mouse", "pen"];
	return t || n.push("", void 0), n.includes(e);
}
function L_(e) {
	let t = e.type;
	return t === "click" || t === "mousedown" || t === "keydown" || t === "keyup";
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/shadowDom.mjs
function R_(e) {
	let t = e.activeElement;
	for (; t?.shadowRoot?.activeElement != null;) t = t.shadowRoot.activeElement;
	return t;
}
function $(e, t) {
	if (!e || !t) return !1;
	let n = t.getRootNode?.();
	if (e.contains(t)) return !0;
	if (n && Cg(n)) {
		let n = t;
		for (; n;) {
			if (e === n) return !0;
			n = n.parentNode || n.host;
		}
	}
	return !1;
}
function z_(e) {
	return "composedPath" in e ? e.composedPath()[0] ?? e.target : e.target;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/utils/constants.mjs
var B_ = "data-base-ui-focusable", V_ = "input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])", H_ = "ArrowLeft", U_ = "ArrowRight", W_ = "ArrowUp", G_ = "ArrowDown";
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/utils/element.mjs
function K_(e, t) {
	if (t == null) return !1;
	if ("composedPath" in e) return e.composedPath().includes(t);
	let n = e;
	return n.target != null && t.contains(n.target);
}
function q_(e) {
	return e.matches("html,body");
}
function J_(e) {
	return Sg(e) && e.matches("input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])");
}
function Y_(e) {
	return e?.closest(`button,a[href],[role="button"],select,[tabindex]:not([tabindex="-1"]),${V_}`) != null;
}
function X_(e) {
	return e ? e.getAttribute("role") === "combobox" && J_(e) : !1;
}
function Z_(e) {
	if (!e || j_) return !0;
	try {
		return e.matches(":focus-visible");
	} catch {
		return !0;
	}
}
function Q_(e) {
	return e ? e.hasAttribute("data-base-ui-focusable") ? e : e.querySelector("[data-base-ui-focusable]") || e : null;
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/addEventListener.mjs
function $_(e, t, n, r) {
	return e.addEventListener(t, n, r), () => {
		e.removeEventListener(t, n, r);
	};
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/mergeCleanups.mjs
function ev(...e) {
	return () => {
		for (let t = 0; t < e.length; t += 1) {
			let n = e[t];
			n && n();
		}
	};
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/useValueAsRef.mjs
function tv(e) {
	let t = yh(nv, e).current;
	return t.next = e, Q(t.effect), t;
}
function nv(e) {
	let t = {
		current: e,
		next: e,
		effect: () => {
			t.current = t.next;
		}
	};
	return t;
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/useAnimationFrame.mjs
var rv = null;
globalThis.requestAnimationFrame;
var iv = new class {
	callbacks = [];
	callbacksCount = 0;
	nextId = 1;
	startId = 1;
	isScheduled = !1;
	tick = (e) => {
		this.isScheduled = !1;
		let t = this.callbacks, n = this.callbacksCount;
		if (this.callbacks = [], this.callbacksCount = 0, this.startId = this.nextId, n > 0) for (let n = 0; n < t.length; n += 1) t[n]?.(e);
	};
	request(e) {
		let t = this.nextId;
		return this.nextId += 1, this.callbacks.push(e), this.callbacksCount += 1, this.isScheduled ||= (requestAnimationFrame(this.tick), !0), t;
	}
	cancel(e) {
		let t = e - this.startId;
		t < 0 || t >= this.callbacks.length || this.callbacks[t] !== null && (this.callbacks[t] = null, --this.callbacksCount);
	}
}(), av = class e {
	static create() {
		return new e();
	}
	static request(e) {
		return iv.request(e);
	}
	static cancel(e) {
		return iv.cancel(e);
	}
	currentId = rv;
	request(e) {
		this.cancel(), this.currentId = iv.request(() => {
			this.currentId = rv, e();
		});
	}
	cancel = () => {
		this.currentId !== rv && (iv.cancel(this.currentId), this.currentId = rv);
	};
	disposeEffect = () => this.cancel;
};
function ov() {
	let e = yh(av.create).current;
	return p_(e.disposeEffect), e;
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/visuallyHidden.mjs
var sv = {
	clipPath: "inset(50%)",
	overflow: "hidden",
	whiteSpace: "nowrap",
	border: 0,
	padding: 0,
	width: 1,
	height: 1,
	margin: -1
}, cv = {
	...sv,
	position: "fixed",
	top: 0,
	left: 0
}, lv = {
	...sv,
	position: "absolute"
}, uv = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let [n, r] = p.useState();
	Q(() => {
		A_ && O_ && r("button");
	}, []);
	let i = {
		tabIndex: 0,
		role: n
	};
	return /*#__PURE__*/ (0, q.jsx)("span", {
		...e,
		ref: t,
		style: cv,
		"aria-hidden": !n || void 0,
		...i,
		"data-base-ui-focus-guard": ""
	});
}), dv = Math.floor;
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/utils/composite.mjs
function fv(e, t, n) {
	return Math.floor(e / t) !== n;
}
function pv(e, t) {
	return t < 0 || t >= e.length;
}
function mv(e, t) {
	return gv(e.current, { disabledIndices: t });
}
function hv(e, t) {
	return gv(e.current, {
		decrement: !0,
		startingIndex: e.current.length,
		disabledIndices: t
	});
}
function gv(e, { startingIndex: t = -1, decrement: n = !1, disabledIndices: r, amount: i = 1 } = {}) {
	let a = t;
	do
		a += n ? -i : i;
	while (a >= 0 && a <= e.length - 1 && vv(e, a, r));
	return a;
}
function _v(e, { event: t, orientation: n, loopFocus: r, onLoop: i, rtl: a, cols: o, disabledIndices: s, minIndex: c, maxIndex: l, prevIndex: u, stopEvent: d = !1 }) {
	let f = u, p;
	if (t.key === "ArrowUp" ? p = "up" : t.key === "ArrowDown" && (p = "down"), p) {
		let n = [], a = [], m = !1, h = 0;
		{
			let t = null, r = -1;
			e.forEach((e, i) => {
				if (e == null) return;
				h += 1;
				let o = e.closest("[role=\"row\"]");
				o && (m = !0), (o !== t || r === -1) && (t = o, r += 1, n[r] = []), n[r].push(i), a[i] = r;
			});
		}
		let g = !1, _ = 0;
		if (m) for (let e of n) {
			let t = e.length;
			t > _ && (_ = t), t !== o && (g = !0);
		}
		let v = g && h < e.length, y = _ || o, b = (o) => {
			if (!g || u === -1) return;
			let c = a[u];
			if (c == null) return;
			let l = n[c].indexOf(u), d = o === "up" ? -1 : 1;
			for (let o = c + d, f = 0; f < n.length; f += 1, o += d) {
				if (o < 0 || o >= n.length) {
					if (!r || v) return;
					if (o = o < 0 ? n.length - 1 : 0, i) {
						let e = Math.min(l, n[o].length - 1), r = i(t, u, n[o][e] ?? n[o][0]);
						o = a[r] ?? o;
					}
				}
				let c = n[o];
				for (let t = Math.min(l, c.length - 1); t >= 0; --t) {
					let n = c[t];
					if (!vv(e, n, s)) return n;
				}
			}
		}, x = (t) => {
			if (!v || u === -1) return;
			let n = u % y, i = t === "up" ? -y : y, a = l - l % y, o = dv(l / y) + 1;
			for (let t = u - n + i, c = 0; c < o; c += 1, t += i) {
				if (t < 0 || t > l) {
					if (!r) return;
					t = t < 0 ? a : 0;
				}
				let i = Math.min(t + y - 1, l);
				for (let r = Math.min(t + n, i); r >= t; --r) if (!vv(e, r, s)) return r;
			}
		};
		d && M_(t);
		let S = b(p) ?? x(p);
		if (S !== void 0) f = S;
		else if (u === -1) f = p === "up" ? l : c;
		else if (f = gv(e, {
			startingIndex: u,
			amount: y,
			decrement: p === "up",
			disabledIndices: s
		}), r) {
			if (p === "up" && (u - y < c || f < 0)) {
				let e = u % y, n = l % y, r = l - (n - e);
				f = n === e ? l : n > e ? r : r - y, i && (f = i(t, u, f));
			}
			p === "down" && u + y > l && (f = gv(e, {
				startingIndex: u % y - y,
				amount: y,
				disabledIndices: s
			}), i && (f = i(t, u, f)));
		}
		pv(e, f) && (f = u);
	}
	if (n === "both") {
		let n = dv(u / o);
		t.key === (a ? "ArrowLeft" : "ArrowRight") && (d && M_(t), u % o === o - 1 ? r && (f = gv(e, {
			startingIndex: u - u % o - 1,
			disabledIndices: s
		}), i && (f = i(t, u, f))) : (f = gv(e, {
			startingIndex: u,
			disabledIndices: s
		}), r && fv(f, o, n) && (f = gv(e, {
			startingIndex: u - u % o - 1,
			disabledIndices: s
		}), i && (f = i(t, u, f)))), fv(f, o, n) && (f = u)), t.key === (a ? "ArrowRight" : "ArrowLeft") && (d && M_(t), u % o === 0 ? r && (f = gv(e, {
			startingIndex: u + (o - u % o),
			decrement: !0,
			disabledIndices: s
		}), i && (f = i(t, u, f))) : (f = gv(e, {
			startingIndex: u,
			decrement: !0,
			disabledIndices: s
		}), r && fv(f, o, n) && (f = gv(e, {
			startingIndex: u + (o - u % o),
			decrement: !0,
			disabledIndices: s
		}), i && (f = i(t, u, f)))), fv(f, o, n) && (f = u));
		let c = dv(l / o) === n;
		pv(e, f) && (r && c ? (f = t.key === (a ? "ArrowRight" : "ArrowLeft") ? l : gv(e, {
			startingIndex: u - u % o - 1,
			disabledIndices: s
		}), i && (f = i(t, u, f))) : f = u);
	}
	return f;
}
function vv(e, t, n) {
	if (typeof n == "function" ? n(t) : n?.includes(t) ?? !1) return !0;
	let r = e[t];
	return r ? !bv(r) || r.matches(":disabled") ? !0 : !n && (r.hasAttribute("disabled") || r.getAttribute("aria-disabled") === "true") : !1;
}
function yv(e) {
	return e.visibility === "hidden" || e.visibility === "collapse";
}
function bv(e, t = e ? Eg(e) : null) {
	return !e || !e.isConnected || !t || yv(t) ? !1 : typeof e.checkVisibility == "function" ? e.checkVisibility() : t.display !== "none" && t.display !== "contents";
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/utils/tabbable.mjs
var xv = "a[href],button,input,select,textarea,summary,details,iframe,object,embed,[tabindex],[contenteditable]:not([contenteditable=\"false\"]),audio[controls],video[controls]";
function Sv(e) {
	let t = e.assignedSlot;
	if (t) return t;
	if (e.parentElement) return e.parentElement;
	let n = e.getRootNode();
	return Cg(n) ? n.host : null;
}
function Cv(e) {
	for (let t of Array.from(e.children)) if (_g(t) === "summary") return t;
	return null;
}
function wv(e, t) {
	let n = Cv(t);
	return !!n && (e === n || $(n, e));
}
function Tv(e) {
	let t = e ? _g(e) : "";
	return e != null && e.matches(xv) && (t !== "summary" || e.parentElement != null && _g(e.parentElement) === "details" && Cv(e.parentElement) === e) && (t !== "details" || Cv(e) == null) && (t !== "input" || e.type !== "hidden");
}
function Ev(e) {
	if (!Tv(e) || !e.isConnected || e.matches(":disabled")) return !1;
	for (let t = e; t; t = Sv(t)) {
		let n = t !== e, r = _g(t) === "slot";
		if (t.hasAttribute("inert") || n && _g(t) === "details" && !t.open && !wv(e, t) || t.hasAttribute("hidden") || !r && !Dv(t, n)) return !1;
	}
	return !0;
}
function Dv(e, t) {
	let n = Eg(e);
	return t ? n.display !== "none" : bv(e, n);
}
function Ov(e) {
	let t = e.tabIndex;
	if (t < 0) {
		let t = _g(e);
		if (t === "details" || t === "audio" || t === "video" || Sg(e) && e.isContentEditable) return 0;
	}
	return t;
}
function kv(e) {
	if (_g(e) !== "input") return null;
	let t = e;
	return t.type === "radio" && t.name !== "" ? t : null;
}
function Av(e, t) {
	let n = kv(e);
	if (!n) return !0;
	let r = t.find((e) => {
		let t = kv(e);
		return t?.name === n.name && t.form === n.form && t.checked;
	});
	return r ? r === n : t.find((e) => {
		let t = kv(e);
		return t?.name === n.name && t.form === n.form;
	}) === n;
}
function jv(e) {
	if (Sg(e) && _g(e) === "slot") {
		let t = e.assignedElements({ flatten: !0 });
		if (t.length > 0) return t;
	}
	return Sg(e) && e.shadowRoot ? Array.from(e.shadowRoot.children) : Array.from(e.children);
}
function Mv(e, t) {
	jv(e).forEach((e) => {
		Tv(e) && t.push(e), Mv(e, t);
	});
}
function Nv(e, t, n) {
	jv(e).forEach((e) => {
		Sg(e) && e.matches(t) && n.push(e), Nv(e, t, n);
	});
}
function Pv(e) {
	return Ev(e) && Ov(e) >= 0;
}
function Fv(e) {
	let t = [];
	return Mv(e, t), t.filter(Ev);
}
function Iv(e) {
	let t = Fv(e);
	return t.filter((e) => Ov(e) >= 0 && Av(e, t));
}
function Lv(e, t) {
	let n = Iv(e), r = n.length;
	if (r === 0) return;
	let i = R_(zg(e)), a = n.indexOf(i);
	return n[a === -1 ? t === 1 ? 0 : r - 1 : a + t];
}
function Rv(e) {
	return Lv(zg(e).body, 1) || e;
}
function zv(e) {
	return Lv(zg(e).body, -1) || e;
}
function Bv(e, t) {
	let n = t || e.currentTarget, r = e.relatedTarget;
	return !r || !$(n, r);
}
function Vv(e) {
	Iv(e).forEach((e) => {
		e.dataset.tabindex = e.getAttribute("tabindex") || "", e.setAttribute("tabindex", "-1");
	});
}
function Hv(e) {
	let t = [];
	Nv(e, "[data-tabindex]", t), t.forEach((e) => {
		let t = e.dataset.tabindex;
		delete e.dataset.tabindex, t ? e.setAttribute("tabindex", t) : e.removeAttribute("tabindex");
	});
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/utils/nodes.mjs
function Uv(e, t, n = !0) {
	return e.filter((e) => e.parentId === t).flatMap((t) => [...!n || t.context?.open ? [t] : [], ...Uv(e, t.id, n)]);
}
function Wv(e, t) {
	let n = [], r = e.find((e) => e.id === t)?.parentId;
	for (; r;) {
		let t = e.find((e) => e.id === r);
		r = t?.parentId, t && (n = n.concat(t));
	}
	return n;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/utils/createAttribute.mjs
function Gv(e) {
	return `data-base-ui-${e}`;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/utils/enqueueFocus.mjs
var Kv = 0;
function qv(e, t = {}) {
	let { preventScroll: n = !1, sync: r = !1, shouldFocus: i } = t;
	cancelAnimationFrame(Kv);
	function a() {
		(!i || i()) && e?.focus({ preventScroll: n });
	}
	if (r) return a(), kh;
	let o = requestAnimationFrame(a);
	return Kv = o, () => {
		Kv === o && (cancelAnimationFrame(o), Kv = 0);
	};
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/utils/markOthers.mjs
var Jv = {
	inert: /* @__PURE__ */ new WeakMap(),
	"aria-hidden": /* @__PURE__ */ new WeakMap()
}, Yv = "data-base-ui-inert", Xv = {
	inert: /* @__PURE__ */ new WeakSet(),
	"aria-hidden": /* @__PURE__ */ new WeakSet()
}, Zv = /* @__PURE__ */ new WeakMap(), Qv = 0;
function $v(e) {
	return Xv[e];
}
function ey(e) {
	return e ? Cg(e) ? e.host : ey(e.parentNode) : null;
}
var ty = (e, t) => t.map((t) => {
	if (e.contains(t)) return t;
	let n = ey(t);
	return e.contains(n) ? n : null;
}).filter((e) => e != null), ny = (e) => {
	let t = /* @__PURE__ */ new Set();
	return e.forEach((e) => {
		let n = e;
		for (; n && !t.has(n);) t.add(n), n = n.parentNode;
	}), t;
}, ry = (e, t, n) => {
	let r = [], i = (e) => {
		e && !n.has(e) && Array.from(e.children).forEach((e) => {
			_g(e) !== "script" && (t.has(e) ? i(e) : r.push(e));
		});
	};
	return i(e), r;
};
function iy(e, t, n, r, { mark: i = !0 }) {
	let a = null;
	r ? a = "inert" : n && (a = "aria-hidden");
	let o = null, s = null, c = ty(t, e), l = i ? ry(t, ny(c), new Set(c)) : [], u = [], d = [];
	if (a) {
		let e = Jv[a], n = $v(a);
		s = n, o = e;
		let r = ty(t, Array.from(t.querySelectorAll("[aria-live]"))), i = c.concat(r);
		ry(t, ny(i), new Set(i)).forEach((t) => {
			let r = t.getAttribute(a), i = r !== null && r !== "false", o = (e.get(t) || 0) + 1;
			e.set(t, o), u.push(t), o === 1 && i && n.add(t), i || t.setAttribute(a, a === "inert" ? "" : "true");
		});
	}
	return i && l.forEach((e) => {
		let t = (Zv.get(e) || 0) + 1;
		Zv.set(e, t), d.push(e), t === 1 && e.setAttribute(Yv, "");
	}), Qv += 1, () => {
		o && u.forEach((e) => {
			let t = (o.get(e) || 0) - 1;
			o.set(e, t), t || (!s?.has(e) && a && e.removeAttribute(a), s?.delete(e));
		}), i && d.forEach((e) => {
			let t = (Zv.get(e) || 0) - 1;
			Zv.set(e, t), t || e.removeAttribute(Yv);
		}), --Qv, Qv || (Jv.inert = /* @__PURE__ */ new WeakMap(), Jv["aria-hidden"] = /* @__PURE__ */ new WeakMap(), Xv.inert = /* @__PURE__ */ new WeakSet(), Xv["aria-hidden"] = /* @__PURE__ */ new WeakSet(), Zv = /* @__PURE__ */ new WeakMap());
	};
}
function ay(e, t = {}) {
	let { ariaHidden: n = !1, inert: r = !1, mark: i = !0 } = t, a = zg(e[0]).body;
	return iy(e, a, n, r, { mark: i });
}
var oy = "data-base-ui-swipe-ignore", sy = "data-swipe-ignore", cy = `[${oy}]`, ly = `[${sy}]`, uy = {
	clipPath: "inset(50%)",
	position: "fixed",
	top: 0,
	left: 0
}, dy = /* @__PURE__ */ c(Pd(), 1), fy = /*#__PURE__*/ p.createContext(null), py = () => p.useContext(fy), my = Gv("portal");
function hy(e = {}) {
	let { ref: t, container: n, componentProps: r = jh, elementProps: i } = e, a = d_(), o = py()?.portalNode, [s, c] = p.useState(null), [l, u] = p.useState(null), d = Z((e) => {
		e !== null && u(e);
	}), f = p.useRef(null);
	Q(() => {
		if (n === null) {
			f.current && (f.current = null, u(null), c(null));
			return;
		}
		let e = (n && (bg(n) ? n : n.current)) ?? o ?? document.body;
		e == null ? f.current && (f.current = null, u(null), c(null)) : f.current !== e && (f.current = e, u(null), c(e));
	}, [n, o]);
	let m = Fh("div", r, {
		ref: [t, d],
		props: [{
			id: a,
			[my]: ""
		}, i]
	}), h = s && m ? /*#__PURE__*/ dy.createPortal(m, s) : null;
	return {
		node: l,
		nodeId: /*#__PURE__*/ p.isValidElement(m) ? m.props.id : void 0,
		subtree: h
	};
}
var gy = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, children: a, container: o, portalOwnerRole: s, ...c } = e, { node: l, nodeId: u, subtree: d } = hy({
		container: o,
		ref: t,
		componentProps: e,
		elementProps: c
	}), f = p.useRef(null), m = p.useRef(null), h = p.useRef(null), g = p.useRef(null), [_, v] = p.useState(null), y = p.useRef(!1), b = _?.modal, x = _?.open, S = !!_ && !_.modal && _.open && !!l;
	p.useEffect(() => {
		if (!l || b) return;
		function e(e) {
			l && e.relatedTarget && Bv(e) && (e.type === "focusin" ? y.current &&= (Hv(l), !1) : (Vv(l), y.current = !0));
		}
		return ev($_(l, "focusin", e, !0), $_(l, "focusout", e, !0));
	}, [l, b]), Q(() => {
		l && x === !0 && y.current && (Hv(l), y.current = !1);
	}, [x, l]);
	let C = p.useMemo(() => ({
		beforeOutsideRef: f,
		afterOutsideRef: m,
		beforeInsideRef: h,
		afterInsideRef: g,
		portalNode: l,
		setFocusManagerState: v
	}), [l]);
	return /*#__PURE__*/ (0, q.jsxs)(p.Fragment, { children: [d, /*#__PURE__*/ (0, q.jsxs)(fy.Provider, {
		value: C,
		children: [
			S && l && /*#__PURE__*/ (0, q.jsx)(uv, {
				"data-type": "outside",
				ref: f,
				onFocus: (e) => {
					Bv(e, l) ? h.current?.focus() : zv(_ ? _.domReference : null)?.focus();
				}
			}),
			S && l && /*#__PURE__*/ (0, q.jsx)("span", {
				role: s,
				"aria-owns": u,
				style: uy
			}),
			l && /*#__PURE__*/ dy.createPortal(a, l),
			S && l && /*#__PURE__*/ (0, q.jsx)(uv, {
				"data-type": "outside",
				ref: m,
				onFocus: (e) => {
					Bv(e, l) ? g.current?.focus() : (Rv(_ ? _.domReference : null)?.focus(), _?.closeOnFocusOut && _?.onOpenChange(!1, o_("focus-out", e.nativeEvent)));
				}
			})
		]
	})] });
});
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/utils/createEventEmitter.mjs
function _y() {
	let e = /* @__PURE__ */ new Map();
	return {
		emit(t, n) {
			e.get(t)?.forEach((e) => e(n));
		},
		on(t, n) {
			e.has(t) || e.set(t, /* @__PURE__ */ new Set()), e.get(t).add(n);
		},
		off(t, n) {
			e.get(t)?.delete(n);
		}
	};
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/components/FloatingTree.mjs
var vy = /*#__PURE__*/ p.createContext(null), yy = /*#__PURE__*/ p.createContext(null), by = () => p.useContext(vy)?.id || null, xy = (e) => {
	let t = p.useContext(yy);
	return e ?? t;
};
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/utils/resolveRef.mjs
function Sy(e) {
	return e == null ? e : "current" in e ? e.current : e;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/components/FloatingFocusManager.mjs
function Cy(e, t) {
	let n = vg(z_(e));
	return e instanceof n.KeyboardEvent ? "keyboard" : e instanceof n.FocusEvent ? t || "keyboard" : "pointerType" in e ? e.pointerType || "keyboard" : "touches" in e ? "touch" : e instanceof n.MouseEvent ? t || (e.detail === 0 ? "keyboard" : "mouse") : "";
}
var wy = 20, Ty = [];
function Ey() {
	Ty = Ty.filter((e) => e.deref()?.isConnected);
}
function Dy(e) {
	Ey(), e && _g(e) !== "body" && (Ty.push(new WeakRef(e)), Ty.length > wy && (Ty = Ty.slice(-20)));
}
function Oy() {
	return Ey(), Ty[Ty.length - 1]?.deref();
}
function ky(e) {
	return e ? Pv(e) ? e : Iv(e)[0] || e : null;
}
function Ay(e) {
	if (e.hasAttribute("tabindex") && !e.hasAttribute("data-tabindex") || !e.getAttribute("role")?.includes("dialog")) return;
	let t = Fv(e).filter((e) => {
		let t = e.getAttribute("data-tabindex") || "";
		return Pv(e) || e.hasAttribute("data-tabindex") && !t.startsWith("-");
	}), n = e.getAttribute("tabindex");
	t.length === 0 ? n !== "0" && (e.setAttribute("tabindex", "0"), e.setAttribute("data-tabindex", "0")) : (n !== "-1" || e.hasAttribute("data-tabindex") && e.getAttribute("data-tabindex") !== "-1") && (e.setAttribute("tabindex", "-1"), e.setAttribute("data-tabindex", "-1"));
}
function jy(e) {
	let { context: t, children: n, disabled: r = !1, initialFocus: i = !0, returnFocus: a = !0, restoreFocus: o = !1, modal: s = !0, closeOnFocusOut: c = !0, openInteractionType: l = "", nextFocusableElement: u, previousFocusableElement: d, beforeContentFocusGuardRef: f, externalTree: m, getInsideElements: h } = e, g = "rootStore" in t ? t.rootStore : t, _ = g.useState("open"), v = g.useState("domReferenceElement"), y = g.useState("floatingElement"), { events: b, dataRef: x } = g.context, S = Z(() => x.current.floatingContext?.nodeId), C = i === !1, w = X_(v) && C, T = tv(i), E = tv(a), D = tv(l), O = tv(_), k = xy(m), A = py(), j = p.useRef(!1), M = p.useRef(!1), N = p.useRef(!1), P = p.useRef(null), F = p.useRef(""), I = p.useRef(""), L = p.useRef(null), R = p.useRef(null), ee = bh(L, f, A?.beforeInsideRef), te = bh(R, A?.afterInsideRef), ne = g_(), z = g_(), re = ov(), ie = A != null, B = Q_(y), ae = Z((e = B) => e ? Iv(e) : []), oe = Z(() => h?.().filter((e) => e != null) ?? []);
	p.useEffect(() => {
		if (r || !s) return;
		function e(e) {
			e.key === "Tab" && $(B, R_(zg(B))) && ae().length === 0 && !w && M_(e);
		}
		return $_(zg(B), "keydown", e);
	}, [
		r,
		B,
		s,
		w,
		ae
	]), p.useEffect(() => {
		if (r || !_) return;
		let e = zg(B);
		function t() {
			N.current = !1;
		}
		function n(e) {
			let t = z_(e), n = oe(), r = $(y, t) || $(v, t) || $(A?.portalNode, t) || n.some((e) => e === t || $(e, t));
			N.current = !r, I.current = e.pointerType || "keyboard", t?.closest("[data-base-ui-click-trigger]") && (M.current = !0, z.start(0, () => {
				M.current = !1;
			}));
		}
		function i() {
			I.current = "keyboard";
		}
		return ev($_(e, "pointerdown", n, !0), $_(e, "pointerup", t, !0), $_(e, "pointercancel", t, !0), $_(e, "keydown", i, !0), t);
	}, [
		r,
		y,
		v,
		B,
		_,
		A,
		z,
		oe
	]), p.useEffect(() => {
		if (r || !c) return;
		let e = zg(B);
		function t() {
			M.current = !0, z.start(0, () => {
				M.current = !1;
			});
		}
		function n(e) {
			let t = z_(e);
			Pv(t) && (P.current = t);
		}
		function i(t) {
			let n = t.relatedTarget, r = t.currentTarget, i = z_(t);
			s && n == null && i != null && $(y, i) && Dy(i), queueMicrotask(() => {
				let a = S(), c = g.context.triggerElements, l = oe(), f = n?.hasAttribute(Gv("focus-guard")) && [
					L.current,
					R.current,
					A?.beforeInsideRef.current,
					A?.afterInsideRef.current,
					A?.beforeOutsideRef.current,
					A?.afterOutsideRef.current,
					Sy(d),
					Sy(u)
				].includes(n), p = !($(v, n) || $(y, n) || $(n, y) || $(A?.portalNode, n) || l.some((e) => e === n || $(e, n)) || c.hasMatchingElement((e) => $(e, n)) || f || k && (Uv(k.nodesRef.current, a).find((e) => $(e.context?.elements.floating, n) || $(e.context?.elements.domReference, n)) || Wv(k.nodesRef.current, a).find((e) => [e.context?.elements.floating, Q_(e.context?.elements.floating)].includes(n) || e.context?.elements.domReference === n)));
				if (r === v && B && Ay(B), o && r !== v && !bv(i) && R_(e) === e.body) {
					if (Sg(B) && (B.focus(), o === "popup")) {
						re.request(() => {
							B.focus();
						});
						return;
					}
					let e = ae(), t = P.current, n = (t && e.includes(t) ? t : null) || e[e.length - 1] || B;
					Sg(n) && n.focus();
				}
				x.current.insideReactTree ? x.current.insideReactTree = !1 : (w || !s) && n && p && !M.current && (w || n !== Oy()) && (j.current = !0, g.setOpen(!1, o_($g, t)));
			});
		}
		function a() {
			N.current || (x.current.insideReactTree = !0, ne.start(0, () => {
				x.current.insideReactTree = !1;
			}));
		}
		let l = Sg(v) ? v : null;
		if (y || l) return ev(l && $_(l, "focusout", i), l && $_(l, "pointerdown", t), y && $_(y, "focusin", n), y && $_(y, "focusout", i), y && A && $_(y, "focusout", a, !0));
	}, [
		r,
		v,
		y,
		B,
		s,
		k,
		A,
		g,
		c,
		o,
		ae,
		w,
		S,
		x,
		ne,
		z,
		re,
		u,
		d,
		oe
	]), p.useEffect(() => {
		if (r || !y || !_) return;
		let e = Array.from(A?.portalNode?.querySelectorAll(`[${Gv("portal")}]`) || []), t = (k ? Wv(k.nodesRef.current, S()) : []).find((e) => X_(e.context?.elements.domReference || null))?.context?.elements.domReference, n = ay([
			y,
			...e,
			L.current,
			R.current,
			A?.beforeOutsideRef.current,
			A?.afterOutsideRef.current,
			...oe(),
			t,
			Sy(d),
			Sy(u),
			w ? v : null
		].filter((e) => e != null), {
			ariaHidden: s || w,
			mark: !1
		}), i = ay([y, ...e].filter((e) => e != null));
		return () => {
			i(), n();
		};
	}, [
		_,
		r,
		v,
		y,
		s,
		A,
		w,
		k,
		S,
		u,
		d,
		oe
	]), Q(() => {
		if (!_ || r || !Sg(B)) return;
		F.current = "", I.current = "";
		let e = zg(B), t = R_(e);
		queueMicrotask(() => {
			let n = T.current, r = typeof n == "function" ? n(D.current || "") : n;
			if (r === void 0 || r === !1 || $(B, t)) return;
			let i = null, a = () => (i ??= ae(B), i[0] || B), o;
			o = r === !0 || r === null ? a() : Sy(r), o ||= a();
			let s = $(B, R_(e));
			qv(o, {
				preventScroll: o === B,
				shouldFocus() {
					if (!O.current) return !1;
					if (s) return !0;
					let t = R_(e);
					return !(t !== o && $(B, t));
				}
			});
		});
	}, [
		r,
		_,
		B,
		ae,
		T,
		D,
		O
	]), Q(() => {
		if (r || !B) return;
		let e = zg(B), t = R_(e), n = D.current == null;
		Dy(t);
		function i(e) {
			if (e.open || (F.current = Cy(e.nativeEvent, I.current)), e.reason === "trigger-hover" && e.nativeEvent.type === "mouseleave" && (j.current = !0), e.reason === "outside-press") {
				if (e.nested) j.current = !1;
				else if (P_(e.nativeEvent) || F_(e.nativeEvent)) j.current = !1;
				else {
					let e = !1;
					zg(B).createElement("div").focus({ get preventScroll() {
						return e = !0, !1;
					} }), e ? j.current = !1 : j.current = !0;
				}
			}
		}
		b.on("openchange", i);
		function a(e) {
			let r = E.current, i = typeof r == "function" ? r(e) : r;
			if (i === void 0 || i === !1) return null;
			i === null && (i = !0);
			let a = v?.isConnected ? v : null, o = t?.isConnected && _g(t) !== "body" ? t : null, s = n ? o || a : a || o;
			return s ||= Oy() || null, typeof i == "boolean" ? s : Sy(i) || s || null;
		}
		return () => {
			b.off("openchange", i);
			let t = R_(e), n = oe(), r = $(y, t) || n.some((e) => e === t || $(e, t)) || k && Uv(k.nodesRef.current, S(), !1).some((e) => $(e.context?.elements.floating, t)), o = E.current, s = F.current, c = a(s);
			queueMicrotask(() => {
				let n = ky(c), i = typeof o != "boolean";
				if (o && !j.current && Sg(n) && (i || n === t || t === e.body || r)) {
					let e = { preventScroll: !0 };
					s === "keyboard" && (e.focusVisible = !0), n.focus(e);
				}
				j.current = !1;
			});
		};
	}, [
		r,
		y,
		B,
		E,
		D,
		b,
		k,
		v,
		S,
		oe
	]), Q(() => {
		if (!O_ || _ || !y) return;
		let e = R_(zg(y));
		Sg(e) && J_(e) && $(y, e) && e.blur();
	}, [_, y]), Q(() => {
		if (!r && A) return A.setFocusManagerState({
			modal: s,
			closeOnFocusOut: c,
			open: _,
			onOpenChange: g.setOpen,
			domReference: v
		}), () => {
			A.setFocusManagerState(null);
		};
	}, [
		r,
		A,
		s,
		_,
		g,
		c,
		v
	]), Q(() => {
		if (!r && B) return Ay(B), () => {
			queueMicrotask(Ey);
		};
	}, [r, B]);
	let se = !r && (!s || !w) && (ie || s);
	return /*#__PURE__*/ (0, q.jsxs)(p.Fragment, { children: [
		se && /*#__PURE__*/ (0, q.jsx)(uv, {
			"data-type": "inside",
			ref: ee,
			onFocus: (e) => {
				if (s) {
					let e = ae();
					qv(e[e.length - 1]);
				} else A?.portalNode && (j.current = !1, Bv(e, A.portalNode) ? Rv(v)?.focus() : Sy(d ?? A.beforeOutsideRef)?.focus());
			}
		}),
		n,
		se && /*#__PURE__*/ (0, q.jsx)(uv, {
			"data-type": "inside",
			ref: te,
			onFocus: (e) => {
				s ? qv(ae()[0]) : A?.portalNode && (c && (j.current = !0), Bv(e, A.portalNode) ? zv(v)?.focus() : Sy(u ?? A.afterOutsideRef)?.focus());
			}
		})
	] });
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/hooks/useClick.mjs
function My(e, t = {}) {
	let { enabled: n = !0, event: r = "click", toggle: i = !0, ignoreMouse: a = !1, stickIfOpen: o = !0, touchOpenDelay: s = 0, reason: c = Gg } = t, l = "rootStore" in e ? e.rootStore : e, u = l.context.dataRef, d = p.useRef(void 0), f = ov(), m = g_(), h = p.useMemo(() => {
		function e(e, t, n, r) {
			let i = o_(c, t, n);
			e && r === "touch" && s > 0 ? m.start(s, () => {
				l.setOpen(!0, i);
			}) : l.setOpen(e, i);
		}
		function t(e, t, n) {
			let r = u.current.openEvent, a = l.select("domReferenceElement") !== t;
			return e && a || !e || !i ? !0 : r && o ? !n(r.type) : !1;
		}
		return {
			onPointerDown(e) {
				d.current = I_(e.pointerType, !0) && F_(e.nativeEvent) ? "virtual" : e.pointerType;
			},
			onMouseDown(n) {
				let i = d.current, o = n.nativeEvent, s = l.select("open");
				if (n.button !== 0 || r === "click" || I_(i, !0) && a) return;
				let c = t(s, n.currentTarget, (e) => e === "click" || e === "mousedown"), u = z_(o);
				if (J_(u)) {
					e(c, o, u, i);
					return;
				}
				let p = n.currentTarget;
				f.request(() => {
					e(c, o, p, i);
				});
			},
			onClick(n) {
				if (r === "mousedown-only") return;
				let i = d.current;
				r === "mousedown" && i ? d.current = void 0 : I_(i, !0) && a || e(t(l.select("open"), n.currentTarget, (e) => e === "click" || e === "mousedown" || e === "keydown" || e === "keyup"), n.nativeEvent, n.currentTarget, i);
			},
			onKeyDown() {
				d.current = void 0;
			}
		};
	}, [
		u,
		r,
		a,
		c,
		l,
		o,
		i,
		f,
		m,
		s
	]);
	return p.useMemo(() => n ? { reference: h } : jh, [n, h]);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/hooks/useDismiss.mjs
function Ny() {
	return !1;
}
function Py(e) {
	return {
		escapeKey: typeof e == "boolean" ? e : e?.escapeKey ?? !1,
		outsidePress: typeof e == "boolean" ? e : e?.outsidePress ?? !0
	};
}
function Fy(e, t = {}) {
	let { enabled: n = !0, escapeKey: r = !0, outsidePress: i = !0, outsidePressEvent: a = "sloppy", referencePress: o = Ny, bubbles: s, externalTree: c } = t, l = "rootStore" in e ? e.rootStore : e, u = l.useState("open"), d = l.useState("floatingElement"), { dataRef: f, events: m } = l.context, h = xy(c), g = Z(typeof i == "function" ? i : () => !1), _ = typeof i == "function" ? g : i, v = _ !== !1, y = Z(() => a), { escapeKey: b, outsidePress: x } = Py(s), S = p.useRef(!1), C = p.useRef(!1), w = p.useRef(!1), T = p.useRef(!1), E = p.useRef(!1), D = p.useRef(""), O = p.useRef(null), k = g_(), A = g_(), j = Z(() => {
		A.clear(), f.current.insideReactTree = !1;
	}), M = Z((e) => {
		let t = f.current.floatingContext?.nodeId;
		return (h ? Uv(h.nodesRef.current, t) : []).some((t) => t.context?.open && !t.context.dataRef.current[e]);
	}), N = Z((e) => K_(e, l.select("floatingElement")) || K_(e, l.select("domReferenceElement"))), P = Z((e) => {
		o() && l.setOpen(!1, o_(Gg, e.nativeEvent));
	}), F = Z((e) => {
		if (!u || !n || !r || e.key !== "Escape" || E.current || !b && M("__escapeKeyBubbles")) return;
		let t = o_(e_, N_(e) ? e.nativeEvent : e);
		l.setOpen(!1, t), t.isCanceled || e.preventDefault(), !b && !t.isPropagationAllowed && e.stopPropagation();
	}), I = Z(() => {
		f.current.insideReactTree = !0, A.start(0, j);
	}), L = Z((e) => {
		if (!u || !n || e.button !== 0) return;
		let t = z_(e.nativeEvent);
		$(l.select("floatingElement"), t) && (S.current || (S.current = !0, C.current = !1));
	}), R = Z((e) => {
		u && n && (e.defaultPrevented || e.nativeEvent.defaultPrevented) && S.current && (C.current = !0);
	});
	p.useEffect(() => {
		function e(e) {
			e.open || (T.current = !1);
		}
		return m.on("openchange", e), () => {
			m.off("openchange", e);
		};
	}, [m]), p.useEffect(() => {
		if (!u || !n) return u || (T.current = !1), j;
		f.current.__escapeKeyBubbles = b, f.current.__outsidePressBubbles = x;
		let e = new h_(), t = new h_(), i = zg(d);
		function a() {
			e.clear(), E.current = !0;
		}
		function o() {
			e.start(O_ ? 5 : 0, () => {
				E.current = !1;
			});
		}
		function s() {
			w.current = !0, t.start(0, () => {
				w.current = !1;
			});
		}
		function c() {
			S.current = !1, C.current = !1;
		}
		function p() {
			let e = D.current, t = e === "pen" || !e ? "mouse" : e, n = y(), r = typeof n == "function" ? n() : n;
			return typeof r == "string" ? r : r[t];
		}
		function m(e) {
			let t = p();
			return t === "intentional" && e.type !== "click" || t === "sloppy" && e.type === "click";
		}
		function g(e) {
			let t = f.current.floatingContext?.nodeId, n = h && Uv(h.nodesRef.current, t).some((t) => K_(e, t.context?.elements.floating));
			return N(e) || n;
		}
		function A(e) {
			if (m(e)) {
				e.type !== "click" && !N(e) && (t.clear(), w.current = !1), j();
				return;
			}
			if (f.current.insideReactTree) {
				j();
				return;
			}
			let n = z_(e), r = `[${Gv("inert")}]`, i = xg(n) ? n.getRootNode() : null, a = Array.from((Cg(i) ? i : zg(l.select("floatingElement"))).querySelectorAll(r)), o = l.context.triggerElements;
			if (n && (o.hasElement(n) || o.hasMatchingElement((e) => $(e, n)))) return;
			let s = xg(n) ? n : null;
			for (; s && !Tg(s);) {
				let e = Dg(s);
				if (Tg(e) || !xg(e)) break;
				s = e;
			}
			if (!(a.length && xg(n) && !q_(n) && !$(n, l.select("floatingElement")) && a.every((e) => !$(s, e)))) {
				if (Sg(n) && !("touches" in e)) {
					let t = Tg(n), r = Eg(n), i = /auto|scroll/, a = t || i.test(r.overflowX), o = t || i.test(r.overflowY), s = a && n.clientWidth > 0 && n.scrollWidth > n.clientWidth, c = o && n.clientHeight > 0 && n.scrollHeight > n.clientHeight, l = r.direction === "rtl", u = c && (l ? e.offsetX <= n.offsetWidth - n.clientWidth : e.offsetX > n.clientWidth), d = s && e.offsetY > n.clientHeight;
					if (u || d) return;
				}
				if (!g(e)) {
					if (p() === "intentional") {
						if (e.detail !== 0 && !P_(e) && !T.current) return;
						if (w.current) {
							t.clear(), w.current = !1;
							return;
						}
					}
					typeof _ == "function" && !_(e) || M("__outsidePressBubbles") || (l.setOpen(!1, o_(Kg, e)), j());
				}
			}
		}
		function P(e) {
			p() === "sloppy" && e.pointerType !== "touch" && l.select("open") && n && !N(e) && A(e);
		}
		function I(e) {
			if (p() !== "sloppy" || !l.select("open") || !n || N(e)) return;
			let t = e.touches[0];
			t && (O.current = {
				startTime: Date.now(),
				startX: t.clientX,
				startY: t.clientY,
				dismissOnTouchEnd: !1,
				dismissOnMouseDown: !0
			}, k.start(1e3, () => {
				O.current && (O.current.dismissOnTouchEnd = !1, O.current.dismissOnMouseDown = !1);
			}));
		}
		function L(e, t) {
			let n = z_(e);
			if (!n) return;
			let r = $_(n, e.type, () => {
				t(e), r();
			});
		}
		function R(e) {
			D.current = "touch", L(e, I);
		}
		function ee(e) {
			k.clear(), e.type === "pointerdown" && (e.button === 0 && (T.current = !0), D.current = e.pointerType), (e.type !== "mousedown" || !O.current || O.current.dismissOnMouseDown) && L(e, (e) => {
				e.type === "pointerdown" ? P(e) : A(e);
			});
		}
		function te(e) {
			if (e.type === "pointercancel" && (T.current = !1), !S.current) return;
			let n = C.current;
			c(), p() === "intentional" && (e.type === "pointercancel" ? n && s() : g(e) || (n ? s() : (typeof _ != "function" || _(e)) && (t.clear(), w.current = !0, j())));
		}
		function ne(e) {
			if (p() !== "sloppy" || !O.current || N(e)) return;
			let t = e.touches[0];
			if (!t) return;
			let n = Math.abs(t.clientX - O.current.startX), r = Math.abs(t.clientY - O.current.startY), i = Math.sqrt(n * n + r * r);
			i > 5 && (O.current.dismissOnTouchEnd = !0), i > 10 && (A(e), k.clear(), O.current = null);
		}
		function z(e) {
			L(e, ne);
		}
		function re(e) {
			p() === "sloppy" && O.current && !N(e) && (O.current.dismissOnTouchEnd && A(e), k.clear(), O.current = null);
		}
		function ie(e) {
			L(e, re);
		}
		let B = ev(r && ev($_(i, "keydown", F), $_(i, "compositionstart", a), $_(i, "compositionend", o)), v && ev($_(i, "click", ee, !0), $_(i, "pointerdown", ee, !0), $_(i, "pointerup", te, !0), $_(i, "pointercancel", te, !0), $_(i, "mousedown", ee, !0), $_(i, "mouseup", te, !0), $_(i, "touchstart", R, {
			capture: !0,
			passive: !0
		}), $_(i, "touchmove", z, {
			capture: !0,
			passive: !0
		}), $_(i, "touchend", ie, {
			capture: !0,
			passive: !0
		})));
		return () => {
			B(), e.clear(), t.clear(), c(), w.current = !1, j();
		};
	}, [
		f,
		d,
		r,
		v,
		_,
		u,
		n,
		b,
		x,
		F,
		j,
		y,
		M,
		N,
		h,
		l,
		k
	]);
	let ee = p.useMemo(() => ({
		onKeyDown: F,
		onPointerDown: P,
		onClick: P
	}), [F, P]), te = p.useMemo(() => ({
		onKeyDown: F,
		onPointerDown: R,
		onMouseDown: R,
		onClickCapture: I,
		onMouseDownCapture(e) {
			I(), L(e);
		},
		onPointerDownCapture(e) {
			I(), L(e);
		},
		onMouseUpCapture: I,
		onTouchEndCapture: I,
		onTouchMoveCapture: I
	}), [
		F,
		I,
		L,
		R
	]);
	return p.useMemo(() => n ? {
		reference: ee,
		floating: te,
		trigger: ee
	} : {}, [
		n,
		ee,
		te
	]);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/utils/popups/popupHandle.mjs
var Iy = /* @__PURE__ */ o(((e) => {
	var t = f();
	function n(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var r = typeof Object.is == "function" ? Object.is : n, i = t.useState, a = t.useEffect, o = t.useLayoutEffect, s = t.useDebugValue;
	function c(e, t) {
		var n = t(), r = i({ inst: {
			value: n,
			getSnapshot: t
		} }), c = r[0].inst, u = r[1];
		return o(function() {
			c.value = n, c.getSnapshot = t, l(c) && u({ inst: c });
		}, [
			e,
			n,
			t
		]), a(function() {
			return l(c) && u({ inst: c }), e(function() {
				l(c) && u({ inst: c });
			});
		}, [e]), s(n), n;
	}
	function l(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !r(e, n);
		} catch {
			return !0;
		}
	}
	function u(e, t) {
		return t();
	}
	var d = typeof window > "u" || window.document === void 0 || window.document.createElement === void 0 ? u : c;
	e.useSyncExternalStore = t.useSyncExternalStore === void 0 ? d : t.useSyncExternalStore;
})), Ly = /* @__PURE__ */ o(((e, t) => {
	t.exports = Iy();
})), Ry = /* @__PURE__ */ o(((e) => {
	var t = f(), n = Ly();
	function r(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var i = typeof Object.is == "function" ? Object.is : r, a = n.useSyncExternalStore, o = t.useRef, s = t.useEffect, c = t.useMemo, l = t.useDebugValue;
	e.useSyncExternalStoreWithSelector = function(e, t, n, r, u) {
		var d = o(null);
		if (d.current === null) {
			var f = {
				hasValue: !1,
				value: null
			};
			d.current = f;
		} else f = d.current;
		d = c(function() {
			function e(e) {
				if (!a) {
					if (a = !0, o = e, e = r(e), u !== void 0 && f.hasValue) {
						var t = f.value;
						if (u(t, e)) return s = t;
					}
					return s = e;
				}
				if (t = s, i(o, e)) return t;
				var n = r(e);
				return u !== void 0 && u(t, n) ? (o = e, t) : (o = e, s = n);
			}
			var a = !1, o, s, c = n === void 0 ? null : n;
			return [function() {
				return e(t());
			}, c === null ? void 0 : function() {
				return e(c());
			}];
		}, [
			t,
			n,
			r,
			u
		]);
		var p = a(e, d[0], d[1]);
		return s(function() {
			f.hasValue = !0, f.value = p;
		}, [p]), l(p), p;
	};
})), zy = /* @__PURE__ */ o(((e, t) => {
	t.exports = Ry();
})), By = [], Vy = void 0;
function Hy() {
	return Vy;
}
function Uy(e) {
	By.push(e);
}
function Wy(e) {
	let t = (t, n) => {
		let r = yh(Gy).current, i;
		try {
			Vy = r;
			for (let e of By) e.before(r);
			i = e(t, n);
			for (let e of By) e.after(r);
			r.didInitialize = !0;
		} finally {
			Vy = void 0;
		}
		return i;
	};
	return t.displayName = e.displayName || e.name, t;
}
function Gy() {
	return { didInitialize: !1 };
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/store/useStore.mjs
var Ky = Ly(), qy = zy(), Jy = Dh(19) ? Zy : Qy;
function Yy(e, t, n, r, i) {
	return Jy(e, t, n, r, i);
}
function Xy(e, t, n, r, i) {
	let a = p.useCallback(() => t(e.getSnapshot(), n, r, i), [
		e,
		t,
		n,
		r,
		i
	]);
	return (0, Ky.useSyncExternalStore)(e.subscribe, a, a);
}
Uy({
	before(e) {
		e.syncIndex = 0, e.didInitialize || (e.syncTick = 1, e.syncHooks = [], e.didChangeStore = !0, e.getSnapshot = () => {
			let t = !1;
			for (let n = 0; n < e.syncHooks.length; n += 1) {
				let r = e.syncHooks[n], i = r.selector(r.store.state, r.a1, r.a2, r.a3);
				Object.is(r.value, i) || (t = !0, r.value = i);
			}
			return t && (e.syncTick += 1), e.syncTick;
		});
	},
	after(e) {
		e.syncHooks.length > 0 && (e.didChangeStore && (e.didChangeStore = !1, e.subscribe = (t) => {
			let n = /* @__PURE__ */ new Set();
			for (let t of e.syncHooks) n.add(t.store);
			let r = [];
			for (let e of n) r.push(e.subscribe(t));
			return () => {
				for (let e of r) e();
			};
		}), (0, Ky.useSyncExternalStore)(e.subscribe, e.getSnapshot, e.getSnapshot));
	}
});
function Zy(e, t, n, r, i) {
	let a = Hy();
	if (!a) return Xy(e, t, n, r, i);
	let o = a.syncIndex;
	a.syncIndex += 1;
	let s;
	return a.didInitialize ? (s = a.syncHooks[o], s.store === e && s.selector === t && Object.is(s.a1, n) && Object.is(s.a2, r) && Object.is(s.a3, i) || (s.store !== e && (a.didChangeStore = !0), s.store = e, s.selector = t, s.a1 = n, s.a2 = r, s.a3 = i, s.value = t(e.getSnapshot(), n, r, i))) : (s = {
		store: e,
		selector: t,
		a1: n,
		a2: r,
		a3: i,
		value: t(e.getSnapshot(), n, r, i)
	}, a.syncHooks.push(s)), s.value;
}
function Qy(e, t, n, r, i) {
	return (0, qy.useSyncExternalStoreWithSelector)(e.subscribe, e.getSnapshot, e.getSnapshot, (e) => t(e, n, r, i));
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/store/Store.mjs
var $y = class {
	static create(e) {
		return new this(e);
	}
	constructor(e) {
		this.state = e, this.listeners = /* @__PURE__ */ new Set(), this.updateTick = 0;
	}
	subscribe = (e) => (this.listeners.add(e), () => {
		this.listeners.delete(e);
	});
	getSnapshot = () => this.state;
	setState(e) {
		if (this.state === e) return;
		this.state = e, this.updateTick += 1;
		let t = this.updateTick;
		for (let n of this.listeners) {
			if (t !== this.updateTick) return;
			n(e);
		}
	}
	update(e) {
		for (let t in e) if (!Object.is(this.state[t], e[t])) {
			this.setState({
				...this.state,
				...e
			});
			return;
		}
	}
	set(e, t) {
		Object.is(this.state[e], t) || this.setState({
			...this.state,
			[e]: t
		});
	}
	notifyAll() {
		let e = { ...this.state };
		this.setState(e);
	}
	use(e, t, n, r) {
		return Yy(this, e, t, n, r);
	}
}, eb = class extends $y {
	constructor(e, t = {}, n) {
		super(e), this.context = t, this.selectors = n;
	}
	useSyncedValue(e, t) {
		p.useDebugValue(e);
		let n = this;
		Q(() => {
			n.state[e] !== t && n.set(e, t);
		}, [
			n,
			e,
			t
		]);
	}
	useSyncedValueWithCleanup(e, t) {
		let n = this;
		Q(() => (n.state[e] !== t && n.set(e, t), () => {
			n.set(e, void 0);
		}), [
			n,
			e,
			t
		]);
	}
	useSyncedValues(e) {
		let t = this;
		Q(() => {
			t.update(e);
		}, [t, ...Object.values(e)]);
	}
	useControlledProp(e, t) {
		p.useDebugValue(e);
		let n = this, r = t !== void 0;
		Q(() => {
			r && !Object.is(n.state[e], t) && n.setState({
				...n.state,
				[e]: t
			});
		}, [
			n,
			e,
			t,
			r
		]);
	}
	select(e, t, n, r) {
		let i = this.selectors[e];
		return i(this.state, t, n, r);
	}
	useState(e, t, n, r) {
		return p.useDebugValue(e), Yy(this, this.selectors[e], t, n, r);
	}
	useContextCallback(e, t) {
		p.useDebugValue(e);
		let n = Z(t ?? kh);
		this.context[e] = n;
	}
	useStateSetter(e) {
		let t = p.useRef(void 0);
		return t.current === void 0 && (t.current = (t) => {
			this.set(e, t);
		}), t.current;
	}
	observe(e, t) {
		let n;
		n = typeof e == "function" ? e : this.selectors[e];
		let r = n(this.state);
		return t(r, r, this), this.subscribe((e) => {
			let i = n(e);
			if (!Object.is(r, i)) {
				let e = r;
				r = i, t(i, e, this);
			}
		});
	}
}, tb = {
	open: (e) => e.open,
	transitionStatus: (e) => e.transitionStatus,
	domReferenceElement: (e) => e.domReferenceElement,
	referenceElement: (e) => e.positionReference ?? e.referenceElement,
	floatingElement: (e) => e.floatingElement,
	floatingId: (e) => e.floatingId
}, nb = class extends eb {
	constructor(e) {
		let { syncOnly: t, nested: n, onOpenChange: r, triggerElements: i, ...a } = e;
		super({
			...a,
			positionReference: a.referenceElement,
			domReferenceElement: a.referenceElement
		}, {
			onOpenChange: r,
			dataRef: { current: {} },
			events: _y(),
			nested: n,
			triggerElements: i
		}, tb), this.syncOnly = t;
	}
	syncOpenEvent = (e, t) => {
		(!e || !this.state.open || t != null && L_(t)) && (this.context.dataRef.current.openEvent = e ? t : void 0);
	};
	dispatchOpenChange = (e, t) => {
		this.syncOpenEvent(e, t.event);
		let n = {
			open: e,
			reason: t.reason,
			nativeEvent: t.event,
			nested: this.context.nested,
			triggerElement: t.trigger
		};
		this.context.events.emit("openchange", n);
	};
	setOpen = (e, t) => {
		this.syncOnly || this.dispatchOpenChange(e, t), this.context.onOpenChange?.(e, t);
	};
};
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/hooks/useSyncedFloatingRootContext.mjs
function rb(e) {
	let { popupStore: t, treatPopupAsFloatingElement: n = !1, floatingRootContext: r, floatingId: i, nested: a, onOpenChange: o } = e, s = t.useState("open"), c = t.useState("activeTriggerElement"), l = t.useState(n ? "popupElement" : "positionerElement"), u = t.context.triggerElements, d = o, f = p.useRef(null);
	r === void 0 && f.current === null && (f.current = new nb({
		open: s,
		transitionStatus: void 0,
		referenceElement: c,
		floatingElement: l,
		triggerElements: u,
		onOpenChange: d,
		floatingId: i,
		syncOnly: !0,
		nested: a
	}));
	let m = r ?? f.current;
	return t.useSyncedValue("floatingId", i), Q(() => {
		let e = {
			open: s,
			floatingId: i,
			referenceElement: c,
			floatingElement: l
		};
		xg(c) && (e.domReferenceElement = c), m.state.positionReference === m.state.referenceElement && (e.positionReference = c), m.update(e);
	}, [
		s,
		i,
		c,
		l,
		m
	]), m.context.onOpenChange = d, m.context.nested = a, m;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/useTransitionStatus.mjs
function ib(e, t = !1, n = !1, r = !1) {
	let [i, a] = p.useState(e && t ? "idle" : void 0), [o, s] = p.useState(e && !r);
	return e && !o && (s(!0), a("starting")), !e && o && i !== "ending" && !n && a("ending"), !e && !o && i === "ending" && a(void 0), Q(() => {
		if (!e && o && i !== "ending" && n) {
			let e = av.request(() => {
				a("ending");
			});
			return () => {
				av.cancel(e);
			};
		}
	}, [
		e,
		o,
		i,
		n
	]), Q(() => {
		if (!e || t) return;
		let n = av.request(() => {
			a(void 0);
		});
		return () => {
			av.cancel(n);
		};
	}, [t, e]), Q(() => {
		if (!e || !t) return;
		e && o && i !== "idle" && a("starting");
		let n = av.request(() => {
			a("idle");
		});
		return () => {
			av.cancel(n);
		};
	}, [
		t,
		e,
		o,
		i
	]), {
		mounted: o,
		setMounted: s,
		transitionStatus: i
	};
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/useAnimationsFinished.mjs
var ab = null;
function ob(e) {
	if (!ab) {
		let e = [];
		ab = e, queueMicrotask(() => {
			ab = null, dy.flushSync(() => {
				for (let t of e) t();
			});
		});
	}
	ab.push(e);
}
function sb(e, t = !1, n = !1) {
	let r = ov();
	return Z((i, a = null) => {
		r.cancel();
		let o = Sy(e);
		if (o == null) return;
		let s = o, c = () => {
			n ? ob(() => {
				a?.aborted || i();
			}) : dy.flushSync(i);
		};
		if (typeof s.getAnimations != "function" || globalThis.BASE_UI_ANIMATIONS_DISABLED) {
			i();
			return;
		}
		function l() {
			Promise.all(s.getAnimations().map((e) => e.finished)).then(() => {
				a?.aborted || c();
			}, () => {
				a?.aborted || (s.getAnimations().some((e) => e.pending || e.playState !== "finished") ? l() : c());
			});
		}
		if (t) {
			let e = Xh;
			if (!s.hasAttribute(e)) {
				r.request(l);
				return;
			}
			let t = new MutationObserver(() => {
				s.hasAttribute(e) || (t.disconnect(), l());
			});
			t.observe(s, {
				attributes: !0,
				attributeFilter: [e]
			}), a?.addEventListener("abort", () => t.disconnect(), { once: !0 });
		} else r.request(l);
	});
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/useOpenChangeComplete.mjs
function cb(e) {
	let { enabled: t = !0, open: n, ref: r, batch: i = !1, onComplete: a } = e, o = Z(a), s = sb(r, n, i);
	p.useEffect(() => {
		if (!t) return;
		let e = new AbortController();
		return s(o, e.signal), () => {
			e.abort();
		};
	}, [
		t,
		n,
		o,
		s
	]);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/utils/popups/popupStoreUtils.mjs
var lb = {
	tabIndex: -1,
	[B_]: ""
};
function ub(e) {
	return (t) => t !== "touch" || e.current;
}
function db(e, t = !1) {
	let n = d_(), r = by() != null, i = yh(() => e(n, r)).current;
	return rb({
		popupStore: i,
		treatPopupAsFloatingElement: t,
		floatingRootContext: i.state.floatingRootContext,
		floatingId: n,
		nested: r,
		onOpenChange: i.setOpen
	}), i;
}
function fb({ handle: e, store: t }) {
	return Q(() => e.attachStore(t), [e, t]), null;
}
function pb(e, t, n, r = !1) {
	let i = e.preventUnmountingOnClose;
	t ? i = !1 : r && (i = !0);
	let a = n?.id ?? null, o = e.activeTriggerId, s = e.activeTriggerElement;
	return (a || t) && (o = a, s = n ?? null), {
		open: t,
		preventUnmountingOnClose: i,
		activeTriggerId: o,
		activeTriggerElement: s
	};
}
function mb(e, t = {}) {
	let { closeOnActiveTriggerUnmount: n = !1 } = t, r = p.useRef(null), i = e.useState("open");
	Q(() => {
		if (!i) {
			r.current = null, e.state.triggerCount !== 0 && e.set("triggerCount", 0);
			return;
		}
		let t = e.context.triggerElements.size, a = {};
		e.state.triggerCount !== t && (a.triggerCount = t);
		let o = e.select("activeTriggerId"), s = null;
		if (o) {
			let t = e.context.triggerElements.getById(o);
			if (t) r.current = o, t !== e.state.activeTriggerElement && (a.activeTriggerElement = t);
			else {
				for (let [t, n] of e.context.triggerElements.entries()) if (n === e.state.activeTriggerElement) {
					a.activeTriggerId = t, a.activeTriggerElement = n, r.current = t;
					break;
				}
				a.activeTriggerId === void 0 && (r.current === o ? s = o : r.current = null);
			}
		} else r.current = null;
		if (!s && !o && t === 1) {
			let t = e.context.triggerElements.entries().next();
			if (!t.done) {
				let [e, n] = t.value;
				a.activeTriggerId = e, a.activeTriggerElement = n, r.current = e;
			}
		}
		(a.triggerCount !== void 0 || a.activeTriggerId !== void 0 || a.activeTriggerElement !== void 0) && e.update(a), s && n && queueMicrotask(() => {
			if (e.select("open") && e.select("activeTriggerId") === s && !e.context.triggerElements.getById(s)) {
				let t = o_(Wg);
				e.setOpen(!1, t), t.isCanceled || e.update({
					activeTriggerId: null,
					activeTriggerElement: null
				});
			}
		});
	}, [
		i,
		e,
		e.useState("triggerCount"),
		e.useState("activeTriggerId"),
		e.useState("activeTriggerElement"),
		n
	]);
}
function hb(e, t, n, r) {
	let { mounted: i, setMounted: a, transitionStatus: o } = ib(e, !1, !1, r), s = t.useState("preventUnmountingOnClose"), c = !e && s;
	t.useSyncedValues({
		mounted: i,
		transitionStatus: o,
		preventUnmountingOnClose: c
	});
	let l = Z(() => {
		a(!1), t.update({
			activeTriggerId: null,
			activeTriggerElement: null,
			mounted: !1,
			preventUnmountingOnClose: !1
		}), n?.(), t.context.onOpenChangeComplete?.(!1);
	});
	return cb({
		enabled: i && !e && !c,
		open: e,
		ref: t.context.popupRef,
		onComplete() {
			e || l();
		}
	}), {
		forceUnmount: l,
		transitionStatus: o
	};
}
function gb(e, t) {
	e.useSyncedValues(t), Q(() => () => {
		e.update({
			activeTriggerProps: jh,
			inactiveTriggerProps: jh,
			popupProps: jh
		});
	}, [e]);
}
function _b(e, t) {
	Q(() => {
		!t && e.state.openMethod !== null && e.set("openMethod", null);
	}, [t, e]), Q(() => () => {
		e.state.openMethod !== null && e.set("openMethod", null);
	}, [e]);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/utils/popups/popupTriggerMap.mjs
var vb = class {
	constructor() {
		this.idMap = /* @__PURE__ */ new Map();
	}
	add(e, t) {
		this.idMap.set(e, t);
	}
	delete(e) {
		this.idMap.delete(e);
	}
	hasElement(e) {
		for (let t of this.idMap.values()) if (t === e) return !0;
		return !1;
	}
	hasMatchingElement(e) {
		for (let t of this.idMap.values()) if (e(t)) return !0;
		return !1;
	}
	getById(e) {
		return this.idMap.get(e);
	}
	entries() {
		return this.idMap.entries();
	}
	elements() {
		return this.idMap.values();
	}
	get size() {
		return this.idMap.size;
	}
};
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/utils/popups/store.mjs
function yb(e, t, n = !1) {
	return {
		open: !1,
		openProp: void 0,
		mounted: !1,
		transitionStatus: void 0,
		floatingRootContext: new nb({
			open: !1,
			transitionStatus: void 0,
			floatingElement: null,
			referenceElement: null,
			triggerElements: e,
			floatingId: t,
			syncOnly: !0,
			nested: n,
			onOpenChange: void 0
		}),
		floatingId: t,
		triggerCount: 0,
		preventUnmountingOnClose: !1,
		payload: void 0,
		activeTriggerId: null,
		activeTriggerElement: null,
		triggerIdProp: void 0,
		popupElement: null,
		positionerElement: null,
		activeTriggerProps: jh,
		inactiveTriggerProps: jh,
		popupProps: jh
	};
}
var bb = (e) => e.triggerIdProp ?? e.activeTriggerId, xb = (e) => e.openProp ?? e.open, Sb = (e) => (e.popupElement?.id ?? e.floatingId) || void 0;
function Cb(e, t) {
	return t !== void 0 && xb(e) && bb(e) === t;
}
function wb(e, t) {
	return Cb(e, t) ? !0 : t !== void 0 && xb(e) && bb(e) == null && e.triggerCount === 1;
}
var Tb = {
	open: xb,
	mounted: (e) => e.mounted,
	transitionStatus: (e) => e.transitionStatus,
	floatingRootContext: (e) => e.floatingRootContext,
	triggerCount: (e) => e.triggerCount,
	preventUnmountingOnClose: (e) => e.preventUnmountingOnClose,
	payload: (e) => e.payload,
	activeTriggerId: bb,
	activeTriggerElement: (e) => e.mounted ? e.activeTriggerElement : null,
	popupId: Sb,
	isTriggerActive: (e, t) => t !== void 0 && bb(e) === t,
	isOpenedByTrigger: (e, t) => Cb(e, t),
	isMountedByTrigger: (e, t) => t !== void 0 && bb(e) === t && e.mounted,
	triggerProps: (e, t) => t ? e.activeTriggerProps : e.inactiveTriggerProps,
	triggerPopupId: (e, t) => wb(e, t) ? Sb(e) : void 0,
	popupProps: (e) => e.popupProps,
	popupElement: (e) => e.popupElement,
	positionerElement: (e) => e.positionerElement
};
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/hooks/useFloatingRootContext.mjs
function Eb(e) {
	let { open: t = !1, onOpenChange: n, elements: r = {} } = e, i = d_(), a = by() != null, o = yh(() => new nb({
		open: t,
		transitionStatus: void 0,
		onOpenChange: n,
		referenceElement: r.reference ?? null,
		floatingElement: r.floating ?? null,
		triggerElements: new vb(),
		floatingId: i,
		syncOnly: !1,
		nested: a
	})).current;
	return Q(() => {
		let e = {
			open: t,
			floatingId: i
		};
		r.reference !== void 0 && (e.referenceElement = r.reference, e.domReferenceElement = xg(r.reference) ? r.reference : null), r.floating !== void 0 && (e.floatingElement = r.floating), o.update(e);
	}, [
		t,
		i,
		r.reference,
		r.floating,
		o
	]), o.context.onOpenChange = n, o.context.nested = a, o;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/hooks/useListNavigation.mjs
var Db = "Escape";
function Ob(e) {
	return O_ && e.movementX === 0 && e.movementY === 0;
}
function kb(e, t, n) {
	switch (e) {
		case "vertical": return t;
		case "horizontal": return n;
		default: return t || n;
	}
}
function Ab(e, t) {
	return kb(t, e === "ArrowUp" || e === "ArrowDown", e === "ArrowLeft" || e === "ArrowRight");
}
function jb(e, t, n) {
	return kb(t, e === "ArrowDown", n ? e === "ArrowLeft" : e === "ArrowRight") || e === "Enter" || e === " " || e === "";
}
function Mb(e, t, n) {
	return kb(t, n ? e === H_ : e === U_, e === G_);
}
function Nb(e, t, n, r) {
	return t === "both" || t === "horizontal" && r ? e === Db : kb(t, n ? e === U_ : e === H_, e === W_);
}
function Pb(e, t) {
	let { listRef: n, activeIndex: r, onNavigate: i = () => {}, enabled: a = !0, selectedIndex: o = null, allowEscape: s = !1, loopFocus: c = !1, nested: l = !1, rtl: u = !1, virtual: d = !1, focusItemOnOpen: f = "auto", focusItemOnHover: m = !0, openOnArrowKeyDown: h = !0, disabledIndices: g = void 0, orientation: _ = "vertical", parentOrientation: v, id: y, resetOnPointerLeave: b = !0, externalTree: x, grid: S } = t, C = S != null, w = "rootStore" in e ? e.rootStore : e, T = w.useState("open"), E = w.useState("floatingElement"), D = w.useState("domReferenceElement"), O = w.context.dataRef, k = Q_(E), A = X_(D), j = tv(k), M = by(), N = xy(x), P = p.useRef(f), F = p.useRef(o ?? -1), I = p.useRef(null), L = p.useRef(!0), R = Z((e) => {
		i(F.current === -1 ? null : F.current, e);
	}), ee = p.useRef(!!E), te = p.useRef(T), ne = p.useRef(!1), z = p.useRef(!1), re = p.useRef(null), ie = tv(g), B = tv(T), ae = tv(o), oe = tv(b), se = ov(), V = ov(), H = Z(() => {
		function e(e) {
			d ? N?.events.emit("virtualfocus", e) : re.current = qv(e, {
				sync: ne.current,
				preventScroll: !0
			});
		}
		let t = n.current[F.current], r = z.current;
		t && e(t), (ne.current ? (e) => e() : (e) => se.request(e))(() => {
			let i = n.current[F.current] || t;
			i && (t || e(i), W && (r || !L.current) && i.scrollIntoView?.({
				block: "nearest",
				inline: "nearest"
			}));
		});
	});
	Q(() => {
		O.current.orientation = _;
	}, [O, _]), Q(() => {
		a && (T && E ? (F.current = o ?? -1, P.current && o != null && (z.current = !0, R())) : ee.current && (F.current = -1, R()));
	}, [
		a,
		T,
		E,
		o,
		R
	]), Q(() => {
		if (a) {
			if (!T) ne.current = !1;
			else if (E) {
				if (r == null) {
					if (ne.current = !1, ae.current != null) return;
					if (ee.current && (F.current = -1, H()), (!te.current || !ee.current) && P.current && (I.current != null || P.current === !0 && I.current == null)) {
						let e = 0, t = () => {
							n.current[0] == null ? (e < 2 && (e ? (e) => V.request(e) : queueMicrotask)(t), e += 1) : (F.current = I.current == null || jb(I.current, _, u) || l ? mv(n) : hv(n), I.current = null, R());
						};
						t();
					}
				} else pv(n.current, r) || (F.current = r, H(), z.current = !1);
			}
		}
	}, [
		a,
		T,
		E,
		r,
		ae,
		l,
		n,
		_,
		u,
		R,
		H,
		V
	]), Q(() => {
		if (!a || E || !N || d || !ee.current) return;
		let e = N.nodesRef.current, t = e.find((e) => e.id === M)?.context?.elements.floating, n = R_(zg(D ?? t ?? null)), r = e.some((e) => e.context && $(e.context.elements.floating, n));
		t && !r && L.current && t.focus({ preventScroll: !0 });
	}, [
		a,
		E,
		D,
		N,
		M,
		d
	]), Q(() => {
		te.current = T, ee.current = !!E;
	}), Q(() => {
		T || (I.current = null, P.current = f);
	}, [T, f]);
	let ce = r != null, le = Z((e) => {
		if (!B.current) return;
		let t = n.current.indexOf(e.currentTarget);
		t !== -1 && (F.current !== t || r !== t) && (F.current = t, R(e));
	}), ue = Z(() => v ?? N?.nodesRef.current.find((e) => e.id === M)?.context?.dataRef?.current.orientation), de = Z(() => mv(n, ie.current)), U = Z((e) => {
		if (L.current = !1, ne.current = !0, e.which === 229 || !B.current && e.currentTarget === j.current) return;
		if (l && Nb(e.key, _, u, C)) {
			Ab(e.key, ue()) || M_(e), w.setOpen(!1, o_(t_, e.nativeEvent)), Sg(D) && (d ? N?.events.emit("virtualfocus", D) : D.focus());
			return;
		}
		let t = F.current, r = mv(n, g), i = hv(n, g);
		if (A || (e.key === "Home" && (M_(e), F.current = r, R(e)), e.key === "End" && (M_(e), F.current = i, R(e))), S != null) {
			let t = S(e, F.current, n, _, c, u, g, r, i);
			if (t != null && (F.current = t, R(e)), _ === "both") return;
		}
		if (Ab(e.key, _)) {
			if (M_(e), T && !d && R_(e.currentTarget.ownerDocument) === e.currentTarget) {
				F.current = jb(e.key, _, u) ? r : i, R(e);
				return;
			}
			jb(e.key, _, u) ? c ? t >= i ? s && t !== n.current.length ? F.current = -1 : (ne.current = !1, F.current = r) : F.current = gv(n.current, {
				startingIndex: t,
				disabledIndices: g
			}) : F.current = Math.min(i, gv(n.current, {
				startingIndex: t,
				disabledIndices: g
			})) : c ? t <= r ? s && t !== -1 ? F.current = n.current.length : (ne.current = !1, F.current = i) : F.current = gv(n.current, {
				startingIndex: t,
				decrement: !0,
				disabledIndices: g
			}) : F.current = Math.max(r, gv(n.current, {
				startingIndex: t,
				decrement: !0,
				disabledIndices: g
			})), pv(n.current, F.current) && (F.current = -1), R(e);
		}
	}), W = p.useMemo(() => ({
		onFocus(e) {
			ne.current = !0, le(e);
		},
		onClick: ({ currentTarget: e }) => e.focus({ preventScroll: !0 }),
		onMouseMove(e) {
			Ob(e) || (ne.current = !0, z.current = !1, m && le(e));
		},
		onPointerLeave(e) {
			if (!B.current || !L.current || e.pointerType === "touch") return;
			ne.current = !0;
			let t = e.relatedTarget;
			if (m && !n.current.includes(t) && oe.current && (re.current?.(), re.current = null, F.current = -1, R(e), !d)) {
				let e = j.current, t = R_(zg(e));
				e && $(e, t) && e.focus({ preventScroll: !0 });
			}
		}
	}), [
		le,
		B,
		j,
		m,
		n,
		R,
		oe,
		d
	]), fe = p.useMemo(() => d && T && ce && { "aria-activedescendant": `${y}-${r}` }, [
		d,
		T,
		ce,
		y,
		r
	]), pe = p.useMemo(() => ({
		...A ? {} : fe,
		onKeyDown(e) {
			if (e.key === "Tab" && e.shiftKey && T && !d) {
				let t = z_(e.nativeEvent);
				if (t && !$(j.current, t)) return;
				M_(e), w.setOpen(!1, o_($g, e.nativeEvent)), Sg(D) && D.focus();
			} else U(e);
		},
		onPointerMove(e) {
			Ob(e) || (L.current = !0);
		}
	}), [
		fe,
		U,
		j,
		A,
		w,
		T,
		d,
		D
	]), me = p.useMemo(() => {
		function e(e) {
			w.setOpen(!0, o_(t_, e.nativeEvent, e.currentTarget));
		}
		function t(e) {
			f === "auto" && P_(e.nativeEvent) && (P.current = !d);
		}
		function n(e) {
			P.current = f, f === "auto" && F_(e.nativeEvent) && (P.current = !0);
		}
		return {
			onKeyDown(t) {
				let n = w.select("open");
				L.current = !1;
				let r = t.key.startsWith("Arrow"), i = Mb(t.key, ue(), u), a = Ab(t.key, _), o = (l ? i : a) || t.key === "Enter" || t.key.trim() === "";
				if (d && n) return U(t);
				if (n || h || !r) {
					if (o) {
						let e = Ab(t.key, ue());
						I.current = l && e ? null : t.key;
					}
					l ? i && (M_(t), n ? (F.current = de(), R(t)) : e(t)) : a && (ae.current != null && (F.current = ae.current), M_(t), !n && h ? e(t) : U(t), n && R(t));
				}
			},
			onFocus(e) {
				w.select("open") && !d && (F.current = -1, R(e));
			},
			onPointerDown: n,
			onPointerEnter: n,
			onMouseDown: t,
			onClick: t
		};
	}, [
		U,
		f,
		de,
		l,
		R,
		w,
		h,
		_,
		ue,
		u,
		ae,
		d
	]), he = p.useMemo(() => ({
		...fe,
		...me
	}), [fe, me]);
	return p.useMemo(() => a ? {
		reference: he,
		floating: pe,
		item: W,
		trigger: me
	} : {}, [
		a,
		he,
		pe,
		me,
		W
	]);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/hooks/useTypeahead.mjs
function Fb(e, t) {
	let { listRef: n, elementsRef: r, activeIndex: i, onMatch: a, disabledIndices: o, onTyping: s, enabled: c = !0, resetMs: l = 750, selectedIndex: u = null } = t, d = "rootStore" in e ? e.rootStore : e, f = d.useState("open"), m = g_(), h = p.useRef(""), g = p.useRef(u ?? i ?? -1), _ = p.useRef(null), v = Z((e) => {
		function t(e) {
			return r?.current[e];
		}
		function c(e) {
			let n = t(e);
			return n && !bv(n) || n?.matches(":disabled") ? !1 : o == null || !vv(Ah, e, o);
		}
		function d(e, t, n = 0) {
			if (e.length === 0) return -1;
			let r = (n % e.length + e.length) % e.length, i = t.toLowerCase();
			for (let t = 0; t < e.length; t += 1) {
				let n = (r + t) % e.length;
				if (e[n]?.toLowerCase().startsWith(i) && c(n)) return n;
			}
			return -1;
		}
		let p = n.current;
		if (h.current.length > 0 && e.key === " " && (M_(e), s?.(!0)), h.current.length > 0 && h.current[0] !== " " && d(p, h.current) === -1 && e.key !== " " && s?.(!1), p == null || e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
		f && e.key !== " " && (M_(e), s?.(!0));
		let v = h.current === "";
		v && (g.current = u ?? i ?? -1), p.every((e, t) => e && c(t) ? e[0]?.toLowerCase() !== e[1]?.toLowerCase() : !0) && h.current === e.key && (h.current = "", g.current = _.current), h.current += e.key, m.start(l, () => {
			h.current = "", g.current = _.current, s?.(!1);
		});
		let y = ((v ? u ?? i ?? -1 : g.current) ?? 0) + 1, b = d(p, h.current, y);
		b === -1 ? e.key !== " " && (h.current = "", s?.(!1)) : (a?.(b), _.current = b);
	}), y = Z((e) => {
		let t = e.relatedTarget, n = d.select("domReferenceElement"), r = d.select("floatingElement");
		$(n, t) || $(r, t) || (m.clear(), h.current = "", g.current = _.current, s?.(!1));
	});
	Q(() => {
		(f || u === null) && (m.clear(), _.current = null, h.current !== "" && (h.current = ""));
	}, [
		f,
		u,
		m
	]);
	let b = p.useMemo(() => ({
		onKeyDown: v,
		onBlur: y
	}), [v, y]);
	return p.useMemo(() => c ? {
		reference: b,
		floating: b
	} : {}, [c, b]);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/dialog/portal/DialogPortalContext.mjs
var Ib = /*#__PURE__*/ p.createContext(void 0);
function Lb() {
	let e = p.useContext(Ib);
	if (e === void 0) throw Error(_h(26));
	return e;
}
var Rb = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End"
]), zb = "--nested-dialogs", Bb = "data-nested-dialog-open", Vb = {
	...pg,
	...eg,
	nestedDialogOpen(e) {
		return e ? { [Bb]: "" } : null;
	}
}, Hb = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, finalFocus: a, initialFocus: o, ...s } = e, c = Yh(), l = c.useState("descriptionElementId"), u = c.useState("disablePointerDismissal"), d = c.useState("floatingRootContext"), f = c.useState("popupProps"), p = c.useState("modal"), m = c.useState("mounted"), h = c.useState("nested"), g = c.useState("nestedOpenDialogCount"), _ = c.useState("open"), v = c.useState("openMethod"), y = c.useState("titleElementId"), b = c.useState("transitionStatus"), x = c.useState("role"), S = d.useState("floatingId");
	Lb(), cb({
		open: _,
		ref: c.context.popupRef,
		onComplete() {
			_ && c.context.onOpenChangeComplete?.(!0);
		}
	});
	let C = o === void 0 ? ub(c.context.popupRef) : o, w = g > 0, T = c.useStateSetter("popupElement"), E = Fh("div", e, {
		state: {
			open: _,
			nested: h,
			transitionStatus: b,
			nestedDialogOpen: w
		},
		props: [
			f,
			{
				id: S,
				"aria-labelledby": y,
				"aria-describedby": l,
				role: x,
				...lb,
				hidden: !m,
				onKeyDown(e) {
					Rb.has(e.key) && e.stopPropagation();
				},
				style: { [zb]: g }
			},
			s
		],
		ref: [
			t,
			c.context.popupRef,
			T
		],
		stateAttributesMapping: Vb
	});
	return /*#__PURE__*/ (0, q.jsx)(jy, {
		context: d,
		openInteractionType: v,
		disabled: !m,
		closeOnFocusOut: !u,
		initialFocus: C,
		returnFocus: a,
		modal: p !== !1,
		restoreFocus: "popup",
		children: E
	});
});
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/inertValue.mjs
function Ub(e) {
	return Dh(19) ? e : e ? "true" : void 0;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/utils/InternalBackdrop.mjs
var Wb = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { cutout: n, ...r } = e, i;
	if (n) {
		let e = n.getBoundingClientRect();
		i = `polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% 0%,${e.left}px ${e.top}px,${e.left}px ${e.bottom}px,${e.right}px ${e.bottom}px,${e.right}px ${e.top}px,${e.left}px ${e.top}px)`;
	}
	return /*#__PURE__*/ (0, q.jsx)("div", {
		ref: t,
		role: "presentation",
		"data-base-ui-inert": "",
		...r,
		style: {
			position: "fixed",
			inset: 0,
			userSelect: "none",
			WebkitUserSelect: "none",
			clipPath: i
		}
	});
}), Gb = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { keepMounted: n = !1, ...r } = e, i = Yh(), a = i.useState("mounted"), o = i.useState("modal"), s = i.useState("open");
	return a || n ? /*#__PURE__*/ (0, q.jsx)(Ib.Provider, {
		value: n,
		children: /*#__PURE__*/ (0, q.jsxs)(gy, {
			ref: t,
			...r,
			children: [a && o === !0 && /*#__PURE__*/ (0, q.jsx)(Wb, {
				ref: i.context.internalBackdropRef,
				inert: Ub(!s)
			}), e.children]
		})
	}) : null;
}), Kb = {}, qb = {}, Jb = "";
function Yb(e, t) {
	return wg(e) ? e : t;
}
function Xb(e, t, n) {
	return /hidden|clip/.test(e.getComputedStyle(Yb(t, n)).overflowY);
}
function Zb(e) {
	if (typeof document > "u") return !1;
	let t = zg(e);
	return vg(t).innerWidth - t.documentElement.clientWidth > 0;
}
function Qb(e) {
	if (!(typeof CSS < "u" && CSS.supports && CSS.supports("scrollbar-gutter", "stable")) || typeof document > "u") return !1;
	let t = zg(e), n = t.documentElement, r = t.body, i = Yb(n, r), a = i.style.overflowY, o = n.style.scrollbarGutter;
	n.style.scrollbarGutter = "stable", i.style.overflowY = "scroll";
	let s = i.offsetWidth;
	i.style.overflowY = "hidden";
	let c = i.offsetWidth;
	return i.style.overflowY = a, n.style.scrollbarGutter = o, s === c;
}
function $b(e) {
	let t = zg(e), n = t.documentElement, r = t.body, i = Yb(n, r), a = {
		overflowY: i.style.overflowY,
		overflowX: i.style.overflowX
	};
	return Object.assign(i.style, {
		overflowY: "hidden",
		overflowX: "hidden"
	}), () => {
		Object.assign(i.style, a);
	};
}
function ex(e) {
	let t = zg(e), n = t.documentElement, r = t.body, i = vg(n), a = 0, o = 0, s = !1, c = av.create();
	if (O_ && (i.visualViewport?.scale ?? 1) !== 1) return () => {};
	function l() {
		let t = i.getComputedStyle(n), c = i.getComputedStyle(r), l = (t.scrollbarGutter || "").includes("both-edges") ? "stable both-edges" : "stable";
		a = n.scrollTop, o = n.scrollLeft, Kb = {
			scrollbarGutter: n.style.scrollbarGutter,
			overflowY: n.style.overflowY,
			overflowX: n.style.overflowX
		}, Jb = n.style.scrollBehavior, qb = {
			position: r.style.position,
			height: r.style.height,
			width: r.style.width,
			boxSizing: r.style.boxSizing,
			overflowY: r.style.overflowY,
			overflowX: r.style.overflowX,
			scrollBehavior: r.style.scrollBehavior
		};
		let u = n.scrollHeight > n.clientHeight, d = n.scrollWidth > n.clientWidth, f = t.overflowY === "scroll" || c.overflowY === "scroll", p = t.overflowX === "scroll" || c.overflowX === "scroll", m = Math.max(0, i.innerWidth - r.clientWidth), h = Math.max(0, i.innerHeight - r.clientHeight), g = parseFloat(c.marginTop) + parseFloat(c.marginBottom), _ = parseFloat(c.marginLeft) + parseFloat(c.marginRight), v = Yb(n, r);
		s = Qb(e), s ? (n.style.scrollbarGutter = l, v.style.overflowY = "hidden", v.style.overflowX = "hidden") : (Object.assign(n.style, {
			scrollbarGutter: l,
			overflowY: "hidden",
			overflowX: "hidden"
		}), (u || f) && (n.style.overflowY = "scroll"), (d || p) && (n.style.overflowX = "scroll"), Object.assign(r.style, {
			position: "relative",
			height: g || h ? `calc(100dvh - ${g + h}px)` : "100dvh",
			width: _ || m ? `calc(100vw - ${_ + m}px)` : "100vw",
			boxSizing: "border-box",
			overflowY: "hidden",
			overflowX: "hidden",
			scrollBehavior: "unset"
		}), r.scrollTop = a, r.scrollLeft = o, n.setAttribute("data-base-ui-scroll-locked", ""), n.style.scrollBehavior = "unset");
	}
	function u() {
		Object.assign(n.style, Kb), Object.assign(r.style, qb), s || (n.scrollTop = a, n.scrollLeft = o, n.removeAttribute("data-base-ui-scroll-locked"), n.style.scrollBehavior = Jb);
	}
	function d() {
		u(), c.request(l);
	}
	l();
	let f = $_(i, "resize", d);
	return () => {
		c.cancel(), u(), typeof i.removeEventListener == "function" && f();
	};
}
var tx = new class {
	lockCount = 0;
	restore = null;
	timeoutLock = h_.create();
	timeoutUnlock = h_.create();
	acquire(e) {
		return this.lockCount += 1, this.lockCount === 1 && this.restore === null && this.timeoutLock.start(0, () => this.lock(e)), this.release;
	}
	release = () => {
		--this.lockCount, this.lockCount === 0 && this.restore && this.timeoutUnlock.start(0, this.unlock);
	};
	unlock = () => {
		this.lockCount === 0 && this.restore && (this.restore?.(), this.restore = null);
	};
	lock(e) {
		if (this.lockCount === 0 || this.restore !== null) return;
		let t = zg(e), n = t.documentElement, r = t.body, i = vg(n);
		if (Xb(i, n, r)) {
			let t = new i.MutationObserver(() => {
				Xb(i, n, r) || (t.disconnect(), this.restore = null, this.lock(e));
			}), a = { attributes: !0 };
			t.observe(n, a), t.observe(r, a), this.restore = () => t.disconnect();
			return;
		}
		let a = C_ || !Zb(e);
		this.restore = a ? $b(e) : ex(e);
	}
}();
function nx(e = !0, t = null) {
	Q(() => {
		if (e) return tx.acquire(t);
	}, [e, t]);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/dialog/root/useDialogRoot.mjs
function rx({ store: e, parentContext: t, isDrawer: n }) {
	let r = e.useState("open"), i = e.useState("disablePointerDismissal"), a = e.useState("modal"), o = e.useState("popupElement"), s = e.useState("floatingRootContext"), [c, l] = p.useState(0), [u, d] = p.useState(0), f = c === 0, m = Fy(s, {
		outsidePressEvent() {
			return e.context.internalBackdropRef.current || e.context.backdropRef.current ? "intentional" : {
				mouse: a === "trap-focus" ? "sloppy" : "intentional",
				touch: "sloppy"
			};
		},
		outsidePress(t) {
			if (!e.context.outsidePressEnabledRef.current || "button" in t && t.button !== 0) return !1;
			if ("touches" in t) {
				if (t.type === "touchend") {
					if (t.changedTouches.length !== 1 || t.touches.length !== 0) return !1;
				} else if (t.touches.length !== 1) return !1;
			}
			let n = z_(t);
			if (f && !i) {
				if (a) {
					let t = e.context.internalBackdropRef.current, r = e.context.backdropRef.current;
					return t || r ? t === n || r === n || $(n, o) && !n?.hasAttribute("data-base-ui-portal") : !0;
				}
				return !0;
			}
			return !1;
		},
		escapeKey: f
	});
	return nx(r && a === !0, o), e.useContextCallback("onNestedDialogOpen", (e, t) => {
		l(e), d(t);
	}), Q(() => (t?.onNestedDialogOpen && (r ? t.onNestedDialogOpen(c + 1, u + +!!n) : t.onNestedDialogOpen(0, 0)), () => {
		t?.onNestedDialogOpen && r && t.onNestedDialogOpen(0, 0);
	}), [
		n,
		r,
		c,
		u,
		t
	]), gb(e, {
		activeTriggerProps: m.reference,
		inactiveTriggerProps: m.trigger,
		popupProps: m.floating,
		nestedOpenDialogCount: c,
		nestedOpenDrawerCount: u
	}), null;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/utils/NullStore.mjs
var ix = {
	...Tb,
	modal: (e) => e.modal,
	nested: (e) => e.nested,
	nestedOpenDialogCount: (e) => e.nestedOpenDialogCount,
	nestedOpenDrawerCount: (e) => e.nestedOpenDrawerCount,
	disablePointerDismissal: (e) => e.disablePointerDismissal,
	openMethod: (e) => e.openMethod,
	descriptionElementId: (e) => e.descriptionElementId,
	titleElementId: (e) => e.titleElementId,
	viewportElement: (e) => e.viewportElement,
	role: (e) => e.role
}, ax = class extends eb {
	constructor(e, t, n) {
		let r = new vb(), i = ox(e, r, t, n);
		super(i, sx(r), ix);
	}
	setOpen = (e, t) => {
		t.preventUnmountOnClose = () => {
			this.set("preventUnmountingOnClose", !0);
		}, !e && t.trigger == null && this.state.activeTriggerId != null && (t.trigger = this.state.activeTriggerElement ?? void 0), this.context.onOpenChange?.(e, t), t.isCanceled || (this.state.floatingRootContext.dispatchOpenChange(e, t), this.update(pb(this.state, e, t.trigger)));
	};
};
function ox(e, t, n, r = !1) {
	return {
		...yb(t, n, r),
		modal: !0,
		disablePointerDismissal: !1,
		viewportElement: null,
		descriptionElementId: void 0,
		titleElementId: void 0,
		openMethod: null,
		nested: !1,
		nestedOpenDialogCount: 0,
		nestedOpenDrawerCount: 0,
		role: "dialog",
		...e
	};
}
function sx(e) {
	return {
		popupRef: /*#__PURE__*/ p.createRef(),
		backdropRef: /*#__PURE__*/ p.createRef(),
		internalBackdropRef: /*#__PURE__*/ p.createRef(),
		outsidePressEnabledRef: { current: !0 },
		triggerElements: e,
		onOpenChange: void 0,
		onOpenChangeComplete: void 0
	};
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/dialog/root/useRenderDialogRoot.mjs
function cx(e, t) {
	let { children: n, open: r, defaultOpen: i = !1, onOpenChange: a, onOpenChangeComplete: o, disablePointerDismissal: s = !1, modal: c = !0, actionsRef: l, handle: u, triggerId: d, defaultTriggerId: f = null } = t, m = e === "drawer", h = e === "alert-dialog", g = h ? !0 : c, _ = h || s, v = h ? "alertdialog" : "dialog", y = Yh(!0), b = {
		modal: g,
		disablePointerDismissal: _,
		nested: y != null,
		role: v
	}, x = db((e, t) => new ax({
		open: i,
		openProp: r,
		activeTriggerId: f,
		triggerIdProp: d,
		...b
	}, e, t), !0);
	x.useControlledProp("openProp", r), x.useControlledProp("triggerIdProp", d), x.useSyncedValues(b), x.useContextCallback("onOpenChange", a), x.useContextCallback("onOpenChangeComplete", o);
	let S = x.useState("open"), C = x.useState("mounted"), w = x.useState("payload");
	_b(x, S), mb(x);
	let { forceUnmount: T } = hb(S, x);
	p.useImperativeHandle(l, () => ({
		unmount: T,
		close: () => x.setOpen(!1, o_(a_))
	}), [T, x]);
	let E = S || C;
	return /*#__PURE__*/ (0, q.jsxs)(Jh.Provider, {
		value: x,
		children: [
			u && /*#__PURE__*/ (0, q.jsx)(fb, {
				handle: u,
				store: x
			}),
			E && /*#__PURE__*/ (0, q.jsx)(rx, {
				store: x,
				parentContext: y?.context,
				isDrawer: m
			}),
			typeof n == "function" ? n({ payload: w }) : n
		]
	});
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/dialog/root/DialogRoot.mjs
var lx = Wy(function(e) {
	return cx("dialog", e);
}), ux = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, children: a, ...o } = e, s = Lb(), c = Yh(), l = c.useState("open"), u = c.useState("nested"), d = c.useState("transitionStatus"), f = c.useState("nestedOpenDialogCount"), p = c.useState("mounted"), m = c.useStateSetter("viewportElement");
	return Fh("div", e, {
		enabled: s || p,
		state: {
			open: l,
			nested: u,
			transitionStatus: d,
			nestedDialogOpen: f > 0
		},
		ref: [t, m],
		stateAttributesMapping: Vb,
		props: [{
			role: "presentation",
			hidden: !p,
			style: { pointerEvents: l ? void 0 : "none" },
			children: a
		}, o]
	});
});
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/useEnhancedClickHandler.mjs
function dx(e) {
	let t = p.useRef(""), n = p.useCallback((n) => {
		n.defaultPrevented || (t.current = n.pointerType, e(n, n.pointerType));
	}, [e]);
	return {
		onClick: p.useCallback((n) => {
			n.detail === 0 ? e(n, "keyboard") : ("pointerType" in n ? e(n, n.pointerType) : e(n, t.current), t.current = "");
		}, [e]),
		onPointerDown: n
	};
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/useValueChanged.mjs
function fx(e, t) {
	let n = p.useRef(e), r = Z(t);
	Q(() => {
		n.current !== e && r(n.current), n.current = e;
	}, [e, r]);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/utils/useOpenInteractionType.mjs
function px(e, t) {
	let { onClick: n, onPointerDown: r } = dx(Z((n, r) => {
		(typeof e == "function" ? e() : e) || t(r || (C_ ? "touch" : ""));
	}));
	return p.useMemo(() => ({
		onClick: n,
		onPointerDown: r
	}), [n, r]);
}
function mx(e) {
	let [t, n] = p.useState(null), r = px(e, n);
	return fx(e, (t) => {
		t && !e && n(null);
	}), p.useMemo(() => ({
		openMethod: t,
		triggerProps: r
	}), [t, r]);
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/useControlled.mjs
function hx({ controlled: e, default: t, name: n, state: r = "value" }) {
	let { current: i } = p.useRef(e !== void 0), [a, o] = p.useState(t);
	return [i && e !== void 0 ? e : a, p.useCallback((e) => {
		i || o(e);
	}, [])];
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/useOnFirstRender.mjs
function gx(e) {
	let t = p.useRef(!0);
	t.current && (t.current = !1, e());
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/floating-ui-react/hooks/gridNavigation.mjs
function _x(e, t, n, r, i, a, o, s, c, l = 2) {
	let u = _v(n.current, {
		event: e,
		orientation: r,
		loopFocus: i,
		rtl: a,
		cols: l,
		disabledIndices: o,
		minIndex: s,
		maxIndex: c,
		prevIndex: t > c ? s : t,
		stopEvent: !0
	});
	return pv(n.current, u) ? void 0 : u;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs
var vx = /*#__PURE__*/ p.createContext(void 0), yx = /*#__PURE__*/ p.createContext(void 0), bx = /*#__PURE__*/ p.createContext(void 0), xx = /*#__PURE__*/ p.createContext(!1), Sx = /*#__PURE__*/ p.createContext("");
function Cx() {
	let e = p.useContext(vx);
	if (!e) throw Error(_h(22));
	return e;
}
function wx() {
	let e = p.useContext(yx);
	if (!e) throw Error(_h(23));
	return e;
}
function Tx() {
	let e = p.useContext(bx);
	if (!e) throw Error(_h(24));
	return e;
}
function Ex() {
	return p.useContext(Sx);
}
function Dx() {
	return p.useContext(xx);
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/areArraysEqual.mjs
function Ox(e, t, n = Object.is) {
	let { length: r } = e;
	if (r !== t.length) return !1;
	for (let i = 0; i < r; i += 1) if (!n(e[i], t[i])) return !1;
	return !0;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/itemEquality.mjs
var kx = (e, t) => Object.is(e, t);
function Ax(e, t, n) {
	return e == null || t == null ? Object.is(e, t) : n(e, t);
}
function jx(e, t, n) {
	return Array.isArray(e) && Array.isArray(t) ? !Ox(e, t, (e, t) => Ax(e, t, n)) : e !== t;
}
function Mx(e, t, n) {
	return e ? e.some((e) => e !== void 0 && Ax(t, e, n)) : !1;
}
function Nx(e, t, n) {
	return e ? e.findIndex((e) => e !== void 0 && Ax(e, t, n)) : -1;
}
function Px(e, t) {
	if (t !== kx) return (n) => Mx(e, n, t);
	let n = new Set(e);
	return n.delete(void 0), (t) => n.has(t) && (t !== 0 || e.some((e) => Object.is(t, e)));
}
function Fx(e, t, n, r) {
	let i = r && Array.isArray(t) ? e.findIndex(Px(t, n)) : Nx(e, t, n);
	return i === -1 ? null : i;
}
function Ix(e, t, n, r, i, a) {
	return Mx(r, t, i) ? a != null && e > a && Mx(r, n[a], i) ? a : e : e === a ? Fx(n, r, i, !0) : a;
}
function Lx(e, t, n) {
	return e.filter((e) => !Ax(t, e, n));
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/serializeValue.mjs
function Rx(e) {
	if (e == null) return "";
	if (typeof e == "string") return e;
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/resolveValueLabel.mjs
function zx(e) {
	return typeof e == "object" && !!e && Array.isArray(e.items);
}
function Bx(e) {
	return zx(e?.[0]);
}
function Vx(e) {
	return Bx(e) ? e.flatMap((e) => e.items) : e;
}
function Hx(e) {
	if (!Array.isArray(e)) return e != null && "null" in e;
	let t = e;
	if (Bx(t)) {
		for (let e of t) for (let t of e.items) if (t && t.value == null && t.label != null) return !0;
		return !1;
	}
	for (let e of t) if (e && e.value == null && e.label != null) return !0;
	return !1;
}
function Ux(e, t) {
	if (t && e != null) return t(e) ?? "";
	if (e && typeof e == "object") {
		if ("label" in e && e.label != null) return String(e.label);
		if ("value" in e) return String(e.value);
	}
	return Rx(e);
}
function Wx(e, t) {
	return t && e != null ? t(e) ?? "" : e && typeof e == "object" && "value" in e && "label" in e ? Rx(e.value) : Rx(e);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/combobox/store.mjs
var Gx = {
	id: (e) => e.id,
	labelId: (e) => e.labelId,
	items: (e) => e.items,
	selectedValue: (e) => e.selectedValue,
	hasSelectionChips: (e) => {
		let t = e.selectedValue;
		return Array.isArray(t) && t.length > 0;
	},
	hasSelectedValue: (e) => {
		let { selectedValue: t, selectionMode: n } = e;
		return t == null ? !1 : n === "multiple" && Array.isArray(t) ? t.length > 0 : !0;
	},
	hasNullItemLabel: (e, t) => t ? Hx(e.items) : !1,
	open: (e) => e.open,
	mounted: (e) => e.mounted,
	forceMounted: (e) => e.forceMounted,
	inline: (e) => e.inline,
	activeIndex: (e) => e.activeIndex,
	selectedIndex: (e) => e.selectedIndex,
	isActive: (e, t) => e.activeIndex === t,
	isSelected: (e, t) => {
		let n = e.isItemEqualToValue, r = e.selectedValue;
		return Array.isArray(r) ? r.some((e) => Ax(t, e, n)) : Ax(t, r, n);
	},
	transitionStatus: (e) => e.transitionStatus,
	popupProps: (e) => e.popupProps,
	listProps: (e) => e.listProps,
	inputProps: (e) => e.inputProps,
	triggerProps: (e) => e.triggerProps,
	itemProps: (e) => e.itemProps,
	positionerElement: (e) => e.positionerElement,
	listElement: (e) => e.listElement,
	popupId: (e) => e.popupId,
	triggerElement: (e) => e.triggerElement,
	inputElement: (e) => e.inputElement,
	inputGroupElement: (e) => e.inputGroupElement,
	popupSide: (e) => e.popupSide,
	openMethod: (e) => e.openMethod,
	inputInsidePopup: (e) => e.inputInsidePopup,
	inputOwnsFormValue: (e) => e.inputOwnsFormValue,
	selectionMode: (e) => e.selectionMode,
	name: (e) => e.name,
	form: (e) => e.form,
	disabled: (e) => e.disabled,
	readOnly: (e) => e.readOnly,
	required: (e) => e.required,
	grid: (e) => e.grid,
	virtualized: (e) => e.virtualized,
	itemToStringLabel: (e) => e.itemToStringLabel,
	isItemEqualToValue: (e) => e.isItemEqualToValue,
	modal: (e) => e.modal,
	autoHighlight: (e) => e.autoHighlight
}, Kx = "data-valid", qx = "data-invalid", Jx = {
	badInput: !1,
	customError: !1,
	patternMismatch: !1,
	rangeOverflow: !1,
	rangeUnderflow: !1,
	stepMismatch: !1,
	tooLong: !1,
	tooShort: !1,
	typeMismatch: !1,
	valid: null,
	valueMissing: !1
}, Yx = {
	valid: null,
	touched: !1,
	dirty: !1,
	filled: !1,
	focused: !1
}, Xx = {
	disabled: !1,
	...Yx
}, Zx = { valid(e) {
	return e === null ? null : e ? { [Kx]: "" } : { [qx]: "" };
} }, Qx = {
	invalid: void 0,
	name: void 0,
	validityData: {
		state: Jx,
		errors: [],
		error: "",
		value: "",
		initialValue: null
	},
	setValidityData: kh,
	disabled: void 0,
	setTouched: kh,
	setDirty: kh,
	setFilled: kh,
	setFocused: kh,
	validationMode: "onSubmit",
	shouldValidateOnChange: () => !1,
	state: Xx,
	registerFieldControl: kh,
	validation: {
		getValidationProps: (e, t = jh) => t,
		inputRef: { current: null },
		registeredInputs: /* @__PURE__ */ new Map(),
		registerInput: kh,
		getInputControl: () => null,
		commit: async () => {},
		change: kh
	}
}, $x = /*#__PURE__*/ p.createContext(Qx);
function eS(e = !0) {
	let t = p.useContext($x);
	if (t.setValidityData === kh && !e) throw Error(_h(28));
	return t;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/field-register-control/useRegisterFieldControl.mjs
function tS(e, t, n, r, i = !0, a) {
	let { registerFieldControl: o } = eS(), s = yh(() => Symbol());
	Q(() => {
		let c = s.current;
		i ? o(c, {
			controlRef: e,
			getValue: r,
			id: t,
			name: a,
			value: n
		}) : o(c, void 0);
	}, [
		e,
		i,
		r,
		t,
		a,
		o,
		s,
		n
	]), Q(() => {
		let e = s.current;
		return () => {
			o(e, void 0);
		};
	}, [o, s]);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/form-context/FormContext.mjs
var nS = /*#__PURE__*/ p.createContext({
	elementRef: { current: null },
	formRef: { current: { fields: /* @__PURE__ */ new Map() } },
	errors: {},
	clearErrors: kh,
	validationMode: "onSubmit",
	submitCountRef: { current: 0 }
});
function rS() {
	return p.useContext(nS);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/labelable-provider/LabelableContext.mjs
var iS = /*#__PURE__*/ p.createContext({
	controlId: void 0,
	registerControlId: kh,
	resetControlId: kh,
	labelId: void 0,
	setLabelId: kh,
	messageIds: [],
	setMessageIds: kh,
	getDescriptionProps: (e) => e
});
function aS() {
	return p.useContext(iS);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/labelable-provider/useLabelableId.mjs
function oS(e = {}) {
	let { id: t, enabled: n = !0 } = e, { controlId: r, registerControlId: i, resetControlId: a } = aS(), o = f_(), s = yh(() => Symbol()), c = p.useRef(!1), l = p.useRef(!1), u = Z(() => {
		c.current && i !== kh && (c.current = !1, i(s.current, void 0));
	});
	return Q(() => {
		if (!n || i === kh) {
			u();
			return;
		}
		let e;
		if (t !== void 0) l.current = !0, e = t;
		else if (l.current) e = o;
		else {
			a();
			return;
		}
		e === void 0 ? u() : (c.current = !0, i(s.current, e));
	}, [
		t,
		n,
		i,
		a,
		o,
		s,
		u
	]), Q(() => u, [u]), (n ? r : void 0) ?? t ?? o;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/combobox/root/utils/index.mjs
function sS(e) {
	return e == null ? void 0 : `${e}-popup`;
}
function cS(e, t) {
	return (n, r) => n != null && e.contains(n, r, t);
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/stringifyLocale.mjs
function lS(e) {
	return Array.isArray(e) ? e.map((e) => lS(e)).join(",") : e == null ? "" : String(e);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/filter.mjs
var uS = /* @__PURE__ */ new Map();
function dS(e = {}) {
	let t = {
		usage: "search",
		sensitivity: "base",
		ignorePunctuation: !0,
		...e
	}, n = `${lS(e.locale)}|${JSON.stringify(t)}`, r = uS.get(n);
	if (r) return r;
	let i = new Intl.Collator(e.locale, t), a = {
		contains(e, t, n) {
			if (!t) return !0;
			let r = Ux(e, n);
			for (let e = 0; e <= r.length - t.length; e += 1) if (i.compare(r.slice(e, e + t.length), t) === 0) return !0;
			return !1;
		},
		startsWith(e, t, n) {
			if (!t) return !0;
			let r = Ux(e, n);
			return i.compare(r.slice(0, t.length), t) === 0;
		},
		endsWith(e, t, n) {
			if (!t) return !0;
			let r = Ux(e, n), a = t.length;
			return r.length >= a && i.compare(r.slice(r.length - a), t) === 0;
		}
	};
	return uS.set(n, a), a;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/combobox/root/utils/useFilter.mjs
var fS = dS;
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/utils/scrollable.mjs
function pS(e, t = !1) {
	let { overflowY: n } = Eg(e);
	return n !== "auto" && n !== "scroll" ? !1 : t ? e.clientHeight > 0 : e.scrollHeight > e.clientHeight;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/combobox/root/utils/constants.mjs
var mS = Symbol("none"), hS = {
	value: mS,
	index: -1
}, gS = /*#__PURE__*/ p.createContext(void 0);
function _S() {
	return p.useContext(gS)?.direction ?? "ltr";
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/combobox/items/itemCollection.mjs
function vS(e, t, n) {
	let r = e.get(t);
	if (r !== void 0 || n === kx) return r;
	for (let [r, i] of e) if (Ax(r, t, n)) return i;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/combobox/root/AriaCombobox.mjs
function yS(e) {
	let { id: t, onOpenChangeComplete: n, defaultSelectedValue: r = null, selectedValue: i, onSelectedValueChange: a, defaultInputValue: o, inputValue: s, open: c, defaultOpen: l = !1, selectionMode: u, onItemHighlighted: d, name: f, form: m, disabled: h = !1, readOnly: g = !1, required: _ = !1, inputRef: v, grid: y = !1, items: b, filteredItems: x, filter: S, filterQuery: C, openOnInputClick: w = !0, autoHighlight: T = !1, keepHighlight: E = !1, highlightItemOnHover: D = !0, loopFocus: O = !0, itemToStringLabel: k, itemToStringValue: A, isItemEqualToValue: j = kx, virtualized: M = !1, inline: N = !1, fillInputOnItemPress: P = !0, modal: F = !1, limit: I = -1, autoComplete: L = "list", formAutoComplete: R, locale: ee, submitOnItemClick: te = !1 } = e, { clearErrors: ne } = rS(), { setDirty: z, validityData: re, setFilled: ie, name: B, disabled: ae, setTouched: oe, setFocused: se, validationMode: V, validation: H } = eS(), ce = _S(), le = oS({ id: t }), ue = fS({ locale: ee }), de = Array.isArray(b) ? null : b;
	if (de && typeof de.label != "function") throw Error(_h(100));
	let U = de ? de.data : b, W = de?.value, fe = W ? void 0 : U, pe = p.useMemo(() => {
		if (!x || !W) return;
		let e = Vx(x), t = e.map(W), n;
		return {
			values: t,
			findItem(r, i) {
				if (!n) {
					n = /* @__PURE__ */ new Map();
					for (let r = 0; r < t.length; r += 1) n.has(t[r]) || n.set(t[r], e[r]);
				}
				return vS(n, r, i);
			}
		};
	}, [x, W]), me = p.useMemo(() => de ? (e) => de.label(e, j, (e) => {
		let t = pe?.findItem(e, j);
		return t == null ? Ux(e, k) : de.itemLabel(t);
	}) : k, [
		de,
		k,
		pe,
		j
	]), he = p.useMemo(() => de ? Object.assign((e) => de.itemLabel(e), { selected: (e) => Ux(e, me) }) : k, [
		de,
		me,
		k
	]);
	function ge(e) {
		return Ux(e, me);
	}
	let [_e, ve] = p.useState(!1), [ye, be] = p.useState(null), xe = p.useRef(ye), Se = p.useRef([]), Ce = p.useRef([]), we = p.useRef(null), Te = p.useRef(null), Ee = p.useRef(null), De = p.useRef(null), Oe = p.useRef(null), ke = p.useRef(!0), Ae = p.useRef(!1), je = p.useRef(null), Me = p.useRef(null), Ne = p.useRef(null), Pe = p.useRef(hS), G = p.useRef(null), Fe = p.useRef([]), Ie = p.useRef(null), Le = ae || h, Re = B ?? f, ze = u === "multiple", Be = u === "single", Ve = s !== void 0 || o !== void 0, He = U !== void 0, Ue = x !== void 0, We;
	We = T === "always" ? "always" : T ? "input-change" : !1;
	let [Ge, Ke] = hx({
		controlled: i,
		default: ze ? r ?? Ah : r,
		name: "Combobox",
		state: "selectedValue"
	}), qe = p.useMemo(() => S === null ? () => !0 : S === void 0 ? cS(ue, he) : S, [
		S,
		ue,
		he
	]), Je = yh(() => Ve ? o ?? "" : Be ? ge(Ge) : "").current, [Ye, Xe] = hx({
		controlled: s,
		default: Je,
		name: "Combobox",
		state: "inputValue"
	}), [Ze, Qe] = hx({
		controlled: c,
		default: l,
		name: "Combobox",
		state: "open"
	}), $e = Bx(U), et = !Ze && ye !== null ? ye : String(Ye).trim(), tt = Be ? ge(Ge) : "", nt = Be && !_e && et !== "" && tt.length === et.length && ue.contains(tt, et), rt = nt ? "" : C ?? et, it = He && Ue && nt && (!de || de.hasValue(Ge, j)), at = p.useMemo(() => U ? Vx(U) : Ah, [U]), ot = p.useMemo(() => {
		if (x && !it) return x;
		if (!U) return Ah;
		if ($e) {
			let e = U, t = [], n = 0;
			for (let r of e) {
				if (I > -1 && n >= I) break;
				let e = I > -1 ? I - n : Infinity, i = rt === "" ? r.items.slice(0, e) : [];
				if (rt !== "") for (let t of r.items) {
					if (i.length >= e) break;
					qe(t, rt, he) && i.push(t);
				}
				if (i.length > 0) {
					let e = {
						...r,
						items: i
					};
					t.push(e), n += i.length;
				}
			}
			return t;
		}
		if (rt === "") return I > -1 ? at.slice(0, I) : at;
		let e = [];
		for (let t of at) {
			if (I > -1 && e.length >= I) break;
			qe(t, rt, he) && e.push(t);
		}
		return e;
	}, [
		x,
		it,
		U,
		$e,
		rt,
		I,
		qe,
		he,
		at
	]), st = p.useMemo(() => {
		if (pe && ot === x) return pe.values;
		let e = Vx(ot);
		return W ? e.map((e) => W(e)) : e;
	}, [
		ot,
		x,
		pe,
		W
	]), K = yh(() => {
		let e = null;
		return N && Ze && He && u !== "none" && (e = Fx(st, Ge, j, ze)), new eb({
			id: le,
			labelId: void 0,
			selectedValue: Ge,
			open: Ze,
			items: fe,
			selectionMode: u,
			name: Re,
			form: m,
			disabled: Le,
			readOnly: g,
			required: _,
			grid: y,
			virtualized: M,
			openOnInputClick: w,
			itemToStringLabel: me,
			isItemEqualToValue: j,
			modal: F,
			autoHighlight: We,
			submitOnItemClick: te,
			hasInputValue: Ve,
			mounted: !1,
			forceMounted: !1,
			transitionStatus: "idle",
			inline: N,
			activeIndex: null,
			selectedIndex: e,
			popupProps: {},
			listProps: {},
			inputProps: {},
			triggerProps: {},
			itemProps: jh,
			positionerElement: null,
			listElement: null,
			popupId: void 0,
			triggerElement: null,
			inputElement: null,
			inputGroupElement: null,
			popupSide: null,
			openMethod: null,
			inputInsidePopup: !0,
			inputOwnsFormValue: u === "none"
		}, {
			onOpenChangeComplete: kh,
			setOpen: kh,
			setInputValue: kh,
			setSelectedValue: kh,
			setIndices: kh,
			handleSelection: kh,
			forceMount: kh,
			requestSubmit: kh,
			listRef: Se,
			labelsRef: Ce,
			popupRef: we,
			emptyRef: Oe,
			inputRef: Te,
			startDismissRef: Ee,
			endDismissRef: De,
			keyboardActiveRef: ke,
			chipsContainerRef: je,
			clearRef: Me,
			valuesRef: Fe,
			pointerDownItemRef: Ie,
			selectionEventRef: Ne
		}, Gx);
	}).current, ct = u === "none" ? Ye : Ge, lt = p.useMemo(() => u === "none" ? ct : Array.isArray(Ge) ? Ge.map((e) => Wx(e, A)) : Wx(Ge, A), [
		ct,
		A,
		u,
		Ge
	]), ut = Z(d), dt = Z(n), ft = K.useState("activeIndex"), pt = K.useState("selectedIndex"), mt = K.useState("positionerElement"), ht = K.useState("listElement"), gt = K.useState("triggerElement"), _t = K.useState("inputElement"), vt = K.useState("inputGroupElement"), yt = K.useState("inline"), bt = K.useState("inputInsidePopup"), xt = K.useState("inputOwnsFormValue"), St = Be && !bt && Ye === tt, Ct = tv(gt), { mounted: wt, setMounted: Tt, transitionStatus: Et } = ib(Ze), { openMethod: Dt, triggerProps: Ot } = mx(Ze), kt = Z(() => lt);
	tS(bt ? Ct : Te, le, ct, kt, !Le, f);
	let At = Z(() => {
		U ? Ce.current = st.map(ge) : K.set("forceMounted", !0);
	}), jt = Z((e, t, n) => {
		if (t === -1) {
			if (Pe.current === hS) return;
			Pe.current = hS;
		} else Pe.current = {
			value: e,
			index: t
		};
		ut(e, s_(n, void 0, { index: t }));
	}), Mt = Z((e) => {
		let t = {};
		e.activeIndex !== void 0 && (t.activeIndex = e.activeIndex), e.selectedIndex !== void 0 && (t.selectedIndex = e.selectedIndex), K.update(t);
		let n = e.activeIndex;
		if (n === void 0) return;
		let r = e.type || "none";
		n === null ? jt(void 0, -1, r) : jt(Fe.current[n], n, r);
	}), Nt = Z((t, n) => {
		if (e.onInputValueChange?.(t, n), !n.isCanceled) {
			if (Ae.current = n.reason === Zg, n.reason === "input-change") {
				Ze && ye !== null && be(null);
				let e = n.event, r = e.inputType;
				if (e.type === "compositionend" || r != null && r !== "" && r !== "insertReplacementText") {
					let e = t.trim() !== "";
					e && ve(!0), G.current = { hasQuery: e };
					let n = K.state.listElement;
					if (!K.state.virtualized && n) {
						let e = we.current;
						for (let t of kg(n.firstElementChild ?? n)) {
							if (!Sg(t) || (e ? !$(e, t) : t.getAttribute("role") === "dialog")) break;
							if (pS(t)) {
								t.scrollTop = 0;
								break;
							}
						}
					}
					e && We && K.state.activeIndex == null && (Ze || yt) && K.set("activeIndex", 0);
				}
			} else n.reason === "input-clear" && t === "" && K.state.inputInsidePopup && (G.current = {
				hasQuery: !1,
				selection: !0
			});
			Xe(t);
		}
	}), Pt = Z((e) => {
		let t = !e && bt && !yt && Ye !== "" && (String(Ye).trim() === ye || Ye === tt);
		!e && (t || Ye === "" || St) && ve(!1), be(null), t && Nt("", o_(Zg));
	}), Ft = Z((t, n) => {
		if (Ze !== t && (n.reason === "escape-key" && He && st.length === 0 && !Oe.current && n.allowPropagation(), e.onOpenChange?.(t, n), !n.isCanceled && (t && ye !== null && Pt(n.reason === Xg), !t && _e && (Be ? (yt || be(et), et === "" && ve(!1)) : ze && (yt || be(et), bt && Mt({ activeIndex: null }), (!bt || yt) && Nt("", o_(Zg, n.event, void 0, { isItemPress: n.reason === qg })))), Qe(t), !t && bt && (n.reason === "focus-out" || n.reason === "outside-press") && (oe(!0), se(!1), V === "onBlur")))) {
			let e = u === "none" ? Ye : Ge;
			H.commit(e);
		}
	}), It = Z((e, t) => {
		a?.(e, t), t.isCanceled || (Ke(e), (u === "none" && we.current && P || Be && !K.state.inputInsidePopup) && Nt(ge(e), o_(t.reason, t.event)));
	}), Lt = Z((e, t) => {
		let n = z_(e), r = Ne.current ?? e;
		Ne.current = null;
		let i = o_(qg, r), a = n?.closest("a")?.getAttribute("href");
		if (a) a.startsWith("#") && Ft(!1, i);
		else if (ze) {
			let e = Array.isArray(Ge) ? Ge : [], n = Mx(e, t, j), r = n ? Lx(e, t, j) : [...e, t];
			if (It(r, i), i.isCanceled || !(Te.current && Te.current.value.trim() !== "")) return;
			if (K.state.inputInsidePopup) {
				Nt("", o_(Zg, i.event, void 0, { isItemPress: !0 }));
				let e = G.current;
				e && !n && (e.toggledValue = t);
			} else Ft(!1, i);
		} else {
			if (It(t, i), i.isCanceled) return;
			Ft(!1, i);
		}
	}), Rt = Z(() => {
		let e = H.inputRef.current?.form ?? K.state.inputElement?.form;
		e && typeof e.requestSubmit == "function" && e.requestSubmit();
	}), zt = Z(() => {
		if (Tt(!1), dt?.(!1), ve(!1), be(null), Mt(u === "none" ? {
			activeIndex: null,
			selectedIndex: null
		} : { activeIndex: null }), ze && Te.current && Te.current.value !== "" && !Ae.current && Nt("", o_(Zg)), Be) {
			if (K.state.inputInsidePopup) Te.current && Te.current.value !== "" && Nt("", o_(Zg));
			else {
				let e = ge(Ge);
				Te.current && Te.current.value !== e && Nt(e, o_(e === "" ? Zg : Wg));
			}
		}
	}), Bt = p.useMemo(() => yt && mt ? { current: mt.closest("[role=\"dialog\"]") } : we, [yt, mt]);
	cb({
		enabled: !e.actionsRef,
		open: Ze,
		ref: Bt,
		onComplete() {
			Ze || zt();
		}
	}), p.useImperativeHandle(e.actionsRef, () => ({ unmount: zt }), [zt]), Q(function() {
		let e = xe.current !== null && ye === null;
		if (xe.current = ye, Ze && (!e || !He) || (Ze || (Ie.current = null), u === "none")) return;
		let t = He ? st : Fe.current;
		Mt({ selectedIndex: Fx(t, Ge, j, ze) });
	}, [
		Ze,
		ye,
		Ge,
		u,
		ze,
		He,
		st,
		j,
		Mt
	]), Q(() => {
		U && (Fe.current = st, Se.current.length = st.length);
	}, [U, st]), Q(() => {
		let e = G.current;
		if (e) {
			let t = Ze || yt || K.state.positionerElement?.hidden === !1;
			if (e.hasQuery) We && t && K.set("activeIndex", 0), G.current = null;
			else if (String(Ye).trim() === "" && (G.current = null, t)) {
				let t = e.selection;
				We === "always" && !t && K.state.selectionMode === "none" && K.set("activeIndex", 0), queueMicrotask(() => {
					if (!K.state.open && !K.state.inline || Te.current && Te.current.value.trim() !== "") return;
					let n = K.state.selectedValue, r = K.state.selectionMode === "multiple";
					if (r && Array.isArray(n) ? n.length > 0 : K.state.selectionMode !== "none" && n != null) {
						let t = He || Ue ? st : Fe.current, i = Nx(t, e.toggledValue, K.state.isItemEqualToValue);
						K.set("activeIndex", i === -1 ? Fx(t, n, K.state.isItemEqualToValue, r) : i);
					} else t ? K.set("activeIndex", null) : We === "always" && K.set("activeIndex", 0);
				});
			}
		}
		if (!Ze && !yt) return;
		let t = He || Ue ? st : Fe.current, n = K.state.activeIndex;
		if (n == null) {
			if (We === "always" && t.length > 0) {
				K.set("activeIndex", 0);
				return;
			}
			jt(void 0, -1, Wg);
			return;
		}
		if (n >= t.length) {
			jt(void 0, -1, Wg), K.set("activeIndex", null);
			return;
		}
		let r = t[n], i = Pe.current.value, a = i !== mS && Ax(r, i, K.state.isItemEqualToValue);
		Pe.current.index === n && a || jt(r, n, Wg);
	}, [
		ft,
		We,
		jt,
		Ue,
		He,
		st,
		yt,
		Ze,
		K,
		Ye
	]), Q(() => {
		ie(u === "none" ? String(Ye) !== "" : ze ? Array.isArray(Ge) && Ge.length > 0 : Ge != null);
	}, [
		ie,
		u,
		Ye,
		Ge,
		ze
	]), p.useEffect(() => {
		He && We && st.length === 0 && Mt({ activeIndex: null });
	}, [
		He,
		We,
		st.length,
		Mt
	]);
	function Vt() {
		Ze && et !== "" && et !== String(Je) && !St && ve(!0);
	}
	function Ht() {
		Ze && ye !== null && Pt(!1);
	}
	let Ut = !1;
	function Wt() {
		!Ut && Ye !== tt && (Ut = !0, Nt(tt, o_(Wg)));
	}
	function Gt() {
		u !== "none" && (ne(Re), z(jx(Ge, re.initialValue, j)), H.change(Ge), Be && !Ve && !bt && Wt());
	}
	function Kt() {
		Be && !Ve && !bt && !_e && Wt();
	}
	function qt() {
		u === "none" && (ne(Re), z(Ye !== re.initialValue), H.change(Ye));
	}
	fx(et, Vt), fx(Ze, Ht), fx(Ge, Gt), fx(tt, Kt), fx(U, Kt), fx(Ye, qt);
	let Jt = Eb({
		open: yt ? !0 : Ze,
		onOpenChange: Ft,
		elements: {
			reference: bt ? gt : _t,
			floating: mt
		}
	}), Yt = y ? "grid" : "listbox", Xt = Ze || yt, Zt = Xt ? "true" : "false", Qt = p.useMemo(() => {
		let e = _t?.tagName === "INPUT", t = _t == null || e, n = t || Xt, r = t ? {
			autoComplete: "off",
			spellCheck: "false",
			autoCorrect: "off",
			autoCapitalize: "none"
		} : {};
		return n && (r.role = "combobox", r["aria-expanded"] = Zt, r["aria-haspopup"] = Yt, r["aria-controls"] = Xt ? ht?.id : void 0, r["aria-autocomplete"] = g ? "none" : L), {
			reference: r,
			floating: { role: "presentation" }
		};
	}, [
		_t,
		Xt,
		Zt,
		Yt,
		ht?.id,
		L,
		g
	]), $t = My(Jt, {
		enabled: !Le && w,
		event: "mousedown-only",
		toggle: !1,
		touchOpenDelay: bt ? 0 : 100,
		reason: Qg
	}), en = Fy(Jt, {
		enabled: !Le && !yt,
		outsidePressEvent: {
			mouse: "sloppy",
			touch: "intentional"
		},
		bubbles: yt ? !0 : void 0,
		outsidePress(e) {
			let t = z_(e);
			return !$(gt, t) && !$(Me.current, t) && !$(je.current, t) && !$(vt, t);
		}
	}), tn = Pb(Jt, {
		enabled: !Le,
		id: le,
		listRef: Se,
		activeIndex: ft,
		selectedIndex: pt,
		virtual: !0,
		loopFocus: O,
		allowEscape: O && !We,
		focusItemOnOpen: _e || u === "none" && !We ? !1 : "auto",
		focusItemOnHover: D,
		resetOnPointerLeave: !E,
		orientation: y ? "horizontal" : void 0,
		rtl: ce === "rtl",
		disabledIndices: Ah,
		grid: y ? _x : void 0,
		onNavigate(e, t) {
			(t || Ze) && Et !== "ending" && Mt(t ? {
				activeIndex: e,
				type: ke.current ? n_ : r_
			} : { activeIndex: e });
		}
	}), nn = p.useMemo(() => nh(tn.reference, { onKeyDown(e) {
		y && K.state.activeIndex == null && (e.key === "ArrowLeft" || e.key === "ArrowRight") && e.preventBaseUIHandler();
	} }, en.reference, $t.reference, Qt.reference), [
		tn.reference,
		en.reference,
		$t.reference,
		Qt.reference,
		y,
		K
	]), rn = p.useMemo(() => nh(lb, en.floating), [en.floating]), an = p.useMemo(() => nh(tn.floating, Qt.floating), [tn.floating, Qt.floating]), on = p.useMemo(() => {
		let e = tn.item;
		return e ? {
			...e,
			onFocus: void 0
		} : jh;
	}, [tn.item]);
	K.useContextCallback("setOpen", Ft), K.useContextCallback("setInputValue", Nt), K.useContextCallback("setSelectedValue", It), K.useContextCallback("setIndices", Mt), K.useContextCallback("handleSelection", Lt), K.useContextCallback("forceMount", At), K.useContextCallback("requestSubmit", Rt), K.useContextCallback("onOpenChangeComplete", n), gx(() => {
		K.update({
			inline: N,
			popupProps: rn,
			listProps: an,
			inputProps: nn,
			triggerProps: Ot,
			itemProps: on
		});
	});
	let sn = {
		id: le,
		selectedValue: Ge,
		open: Ze,
		mounted: wt,
		transitionStatus: Et,
		items: fe,
		inline: N,
		popupProps: rn,
		listProps: an,
		inputProps: nn,
		triggerProps: Ot,
		itemProps: on,
		openMethod: Dt,
		selectionMode: u,
		name: Re,
		form: m,
		disabled: Le,
		readOnly: g,
		required: _,
		grid: y,
		virtualized: M,
		openOnInputClick: w,
		itemToStringLabel: me,
		modal: F,
		autoHighlight: We,
		isItemEqualToValue: j,
		submitOnItemClick: te,
		hasInputValue: Ve
	};
	Q(() => {
		K.update({
			...sn,
			inputOwnsFormValue: u === "none" && (N || !K.state.inputInsidePopup)
		});
	}, [K, ...Object.values(sn)]);
	let cn = bh(v, H.inputRef), ln = p.useMemo(() => ({
		query: et,
		hasItems: He,
		filteredItems: ot,
		flatFilteredValues: st
	}), [
		et,
		He,
		ot,
		st
	]), un = p.useMemo(() => Array.isArray(ct) ? "" : Wx(ct, A), [ct, A]), dn = ze && Array.isArray(Ge) && Ge.length > 0, fn = ze || u === "none" && xt ? void 0 : Re, pn = p.useMemo(() => !ze || !Array.isArray(Ge) || !Re ? null : Ge.map((e) => {
		let t = Wx(e, A);
		return /*#__PURE__*/ (0, q.jsx)("input", {
			type: "hidden",
			form: m,
			name: Re,
			value: t,
			disabled: Le
		}, t);
	}), [
		ze,
		Ge,
		m,
		Re,
		A,
		Le
	]), mn = /*#__PURE__*/ (0, q.jsxs)(p.Fragment, { children: [
		e.children,
		/*#__PURE__*/ (0, q.jsx)("input", {
			...H.getValidationProps(Le, {
				onFocus() {
					bt ? gt?.focus() : (Te.current || gt)?.focus();
				},
				onChange(e) {
					if (e.nativeEvent.defaultPrevented || Le || g) return;
					let t = e.currentTarget.value, n = t.toLowerCase(), r = o_(Wg, e.nativeEvent), i = () => Fe.current.findIndex((e) => Wx(e, A).toLowerCase() === n || ge(e).toLowerCase() === n);
					function a() {
						if (ze) return;
						if (u === "none") {
							Nt(t, r);
							return;
						}
						let e = i();
						e === -1 && (e = Fe.current.findIndex((e, t) => {
							let r = Ce.current[t];
							return r != null && r.toLowerCase() === n;
						}));
						let a = e === -1 ? void 0 : Fe.current[e];
						a != null && It?.(a, r);
					}
					Be && (At(), U && i() === -1 && K.set("forceMounted", !0)), queueMicrotask(a);
				}
			}),
			id: le && fn == null ? `${le}-hidden-input` : void 0,
			form: m,
			name: fn,
			autoComplete: R,
			disabled: Le,
			required: _ && !dn,
			readOnly: g,
			value: un,
			ref: cn,
			style: fn ? lv : cv,
			tabIndex: -1,
			"aria-hidden": !0,
			suppressHydrationWarning: !0
		}),
		pn
	] });
	return /*#__PURE__*/ (0, q.jsx)(vx.Provider, {
		value: K,
		children: /*#__PURE__*/ (0, q.jsx)(yx.Provider, {
			value: Jt,
			children: /*#__PURE__*/ (0, q.jsx)(xx.Provider, {
				value: He,
				children: /*#__PURE__*/ (0, q.jsx)(bx.Provider, {
					value: ln,
					children: /*#__PURE__*/ (0, q.jsx)(Sx.Provider, {
						value: Ye,
						children: mn
					})
				})
			})
		})
	});
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/autocomplete/root/AutocompleteRoot.mjs
function bS(e) {
	let { openOnInputClick: t = !1, value: n, defaultValue: r, onValueChange: i, mode: a = "list", itemToStringValue: o, ...s } = e, c = (a === "inline" || a === "both") && !e.readOnly, l = a === "inline" || a === "none", u = n !== void 0, [d, f] = p.useState(r ?? ""), [m, h] = p.useState("");
	p.useEffect(() => {
		(u || !c) && h("");
	}, [
		n,
		u,
		c
	]);
	let g;
	g = c && m !== "" ? m : u ? n ?? "" : d;
	let _ = fS({ locale: s.locale }), v = String((u ? n : d) ?? "").trim(), y = l || s.filter === null ? null : s.filter ?? _.contains;
	function b(e, t) {
		h(""), u || f(e), i?.(e, t);
	}
	function x(t, n) {
		e.onItemHighlighted?.(t, n), n.reason !== "pointer" && h(c && t != null ? Ux(t, o) : "");
	}
	return /*#__PURE__*/ (0, q.jsx)(yS, {
		...s,
		itemToStringLabel: o,
		openOnInputClick: t,
		selectionMode: "none",
		fillInputOnItemPress: !0,
		filter: y,
		filterQuery: a === "both" ? v : void 0,
		autoComplete: a,
		inputValue: g,
		defaultInputValue: r,
		onInputValueChange: b,
		onItemHighlighted: x
	});
}
var xS = "data-popup-side", SS = "data-list-empty", CS = {
	...fg,
	...Zx,
	popupSide: (e) => e ? { [xS]: e } : null,
	listEmpty: (e) => e ? { [SS]: "" } : null
}, wS = 5;
function TS(e, t) {
	let n = ES(t);
	return e.clientX >= n.left - wS && e.clientX <= n.right + wS && e.clientY >= n.top - wS && e.clientY <= n.bottom + wS;
}
function ES(e) {
	let t = e.getBoundingClientRect(), n = vg(e);
	if (j_) return t;
	let r = n.getComputedStyle(e, "::before"), i = n.getComputedStyle(e, "::after");
	if (r.content === "none" && i.content === "none") return t;
	let a = parseFloat(r.width) || 0, o = parseFloat(r.height) || 0, s = parseFloat(i.width) || 0, c = parseFloat(i.height) || 0, l = Math.max(t.width, a, s), u = Math.max(t.height, o, c), d = l - t.width, f = u - t.height;
	return {
		left: t.left - d / 2,
		right: t.right + d / 2,
		top: t.top - f / 2,
		bottom: t.bottom + f / 2
	};
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/utils/resolveAriaLabelledBy.mjs
function DS(e, t) {
	return e ?? t;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/combobox/utils/parts.mjs
function OS(e) {
	let t = e.useState("mounted"), n = e.useState("popupSide"), r = e.useState("positionerElement");
	return t && r ? n : null;
}
function kS() {
	return Tx().filteredItems.length === 0;
}
function AS(e) {
	return e === "rtl" ? ["ArrowRight", "ArrowLeft"] : ["ArrowLeft", "ArrowRight"];
}
function jS(e, t) {
	let n = e >= t - 1 ? t - 2 : e;
	return n >= 0 ? n : void 0;
}
function MS(e, t, n) {
	let r = e.context.listRef.current[t];
	r && (e.context.selectionEventRef.current = n, r.click(), e.context.selectionEventRef.current = null);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/autocomplete/trigger/AutocompleteTrigger.mjs
var NS = /* @__PURE__ */ p.forwardRef(function(e, t) {
	let { render: n, className: r, nativeButton: i = !0, disabled: a = !1, id: o, style: s, ...c } = e, { state: l, disabled: u, setTouched: d, setFocused: f, validationMode: m, validation: h } = eS(), { labelId: g } = aS(), _ = Cx(), v = _.useState("selectionMode"), y = _.useState("disabled"), b = _.useState("readOnly"), x = _.useState("required"), S = _.useState("positionerElement"), C = _.useState("listElement"), w = _.useState("popupId"), T = _.useState("triggerProps"), E = _.useState("inputInsidePopup"), D = _.useState("id"), O = _.useState("labelId"), k = _.useState("open"), A = _.useState("selectedValue"), j = _.useState("activeIndex"), M = _.useState("selectedIndex"), N = _.useState("hasSelectedValue"), P = wx(), F = Ex(), I = g_(), L = u || y || a, R = kS(), ee = OS(_);
	oS({ id: E ? o : void 0 });
	let te = E ? o ?? D : o, ne = DS(g, O), z;
	k && E ? z = w ?? sS(D) : k && (z = C?.id);
	let re = p.useRef("");
	function ie(e) {
		re.current = e.pointerType;
	}
	let { reference: B } = Fb(P, {
		enabled: !k && !b && !y && v === "single",
		listRef: _.context.labelsRef,
		activeIndex: j,
		selectedIndex: M,
		onMatch(e) {
			let t = _.context.valuesRef.current[e];
			t !== void 0 && _.context.setSelectedValue(t, o_(Wg));
		}
	}), { reference: ae } = My(P, {
		enabled: !y,
		event: "mousedown"
	}), { buttonRef: oe, getButtonProps: se } = Vg({
		native: i,
		disabled: L
	}), V = {
		...l,
		readOnly: b,
		open: k,
		disabled: L,
		popupSide: ee,
		listEmpty: R,
		placeholder: v !== "none" && !N
	};
	return Fh("button", e, {
		ref: [
			t,
			oe,
			Z((e) => {
				_.set("triggerElement", e);
			})
		],
		state: V,
		props: [
			T,
			ae,
			B,
			{
				id: te,
				tabIndex: E ? 0 : -1,
				role: E ? "combobox" : void 0,
				"aria-expanded": k,
				"aria-haspopup": E ? "dialog" : "listbox",
				"aria-controls": z,
				"aria-required": E && x || void 0,
				"aria-readonly": E && b || void 0,
				"aria-labelledby": ne,
				onPointerDown: ie,
				onPointerEnter: ie,
				onFocus() {
					f(!0), L || I.start(0, _.context.forceMount);
				},
				onBlur(e) {
					if (!$(S, e.relatedTarget) && (d(!0), f(!1), m === "onBlur")) {
						let e = v === "none" ? F : A;
						h.commit(e);
					}
				},
				onMouseDown(e) {
					if (L || (E || P.set("domReferenceElement", e.currentTarget), _.context.forceMount(), re.current !== "touch" && (_.context.inputRef.current?.focus(), E || e.preventDefault()), k)) return;
					let t = zg(e.currentTarget);
					function n(e) {
						let t = _.state.triggerElement;
						if (!t) return;
						let n = z_(e), r = _.state.positionerElement, i = _.state.listElement;
						$(t, n) || $(r, n) || $(i, n) || TS(e, t) || _.context.setOpen(!1, o_(i_, e));
					}
					E && t.addEventListener("mouseup", n, { once: !0 });
				},
				onKeyDown(e) {
					(e.key === "ArrowDown" || e.key === "ArrowUp") && (M_(e), _.context.setOpen(!0, o_(t_, e.nativeEvent)), _.context.inputRef.current?.focus());
				}
			},
			h.getValidationProps(L, c),
			se
		],
		stateAttributesMapping: CS
	});
}), PS = /*#__PURE__*/ p.createContext(void 0);
function FS() {
	return p.useContext(PS);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/combobox/positioner/ComboboxPositionerContext.mjs
var IS = /*#__PURE__*/ p.createContext(void 0);
function LS(e) {
	let t = p.useContext(IS);
	if (t === void 0 && !e) throw Error(_h(21));
	return t;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/combobox/utils/ComboboxInternalDismissButton.mjs
var RS = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let n = Cx(), { buttonRef: r, getButtonProps: i } = Vg({ native: !1 }), a = bh(t, r);
	function o(e) {
		n.context.setOpen(!1, o_(Jg, e.nativeEvent, e.currentTarget));
	}
	let s = i({ onClick: o });
	return /*#__PURE__*/ (0, q.jsx)("span", {
		ref: a,
		...s,
		"aria-label": "Dismiss",
		tabIndex: void 0,
		style: lv
	});
}), zS = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, disabled: i = !1, id: a, style: o, ...s } = e, { state: c, disabled: l, setTouched: u, setFocused: d, validationMode: f, validation: m } = eS(), { labelId: h } = aS(), g = FS(), _ = !!LS(!0), v = Cx(), y = Ex(), b = _S(), x = v.useState("required"), S = v.useState("disabled"), C = v.useState("readOnly"), w = v.useState("name"), T = v.useState("form"), E = v.useState("selectionMode"), D = v.useState("autoHighlight"), O = v.useState("inputProps"), k = v.useState("triggerProps"), A = v.useState("open"), j = v.useState("mounted"), M = v.useState("selectedValue"), N = v.useState("id"), P = v.useState("inline"), F = v.useState("modal"), I = !!D, L = OS(v), R = l || S || i, ee = kS(), te = _ || P, ne = !te || F, z = f_(a ?? (te ? void 0 : N)), re = _ ? Yx : c, [ie, B] = p.useState(null), ae = p.useRef(!1), oe = p.useRef(null), se = p.useRef(!1), V = E === "none" && !_, H = Z((e) => {
		let t = _ || v.state.inline;
		t && !v.state.hasInputValue && v.context.setInputValue("", o_(Wg)), v.update({
			inputElement: e,
			inputInsidePopup: t,
			inputOwnsFormValue: V
		});
	}), ce = _ ? s : m.getValidationProps(R, s);
	function le() {
		v.context.setIndices({
			activeIndex: null,
			selectedIndex: null,
			type: v.context.keyboardActiveRef.current ? n_ : r_
		});
	}
	function ue() {
		v.context.keyboardActiveRef.current = !1;
	}
	let de = {
		...re,
		open: A,
		disabled: R,
		readOnly: C,
		popupSide: L,
		listEmpty: ee
	};
	function U(e) {
		if (!g) return;
		let t, { highlightedChipIndex: n } = g, r = g.chipsRef.current.length, [i, a] = AS(b);
		return n === void 0 ? (e.key === i && (e.currentTarget.selectionStart ?? 0) === 0 && M.length > 0 && (e.preventDefault(), t = r > 0 ? r - 1 : void 0), t) : (e.key === i ? (e.preventDefault(), t = n > 0 ? n - 1 : void 0) : e.key === a ? (e.preventDefault(), t = n < r - 1 ? n + 1 : void 0) : (e.key === "Backspace" || e.key === "Delete") && (e.preventDefault(), t = jS(n, M.length), le()), t);
	}
	let W = Fh("input", e, {
		state: de,
		ref: [
			t,
			v.context.inputRef,
			H
		],
		props: [
			O,
			k,
			{
				value: ie ?? y,
				"aria-readonly": C || void 0,
				"aria-required": x || void 0,
				"aria-labelledby": h,
				disabled: R,
				readOnly: C,
				required: E === "none" ? x : void 0,
				form: T,
				...V && w && { name: w },
				id: z,
				onFocus() {
					if (d(!0), !P || !se.current) return;
					se.current = !1;
					let e = oe.current;
					e != null && Object.hasOwn(v.context.valuesRef.current, e) && v.context.setIndices({ activeIndex: e });
				},
				onBlur() {
					u(!0), d(!1);
					let e = v.state.activeIndex;
					if (P && e !== null && D !== "always" && (oe.current = e, se.current = !0, v.context.setIndices({ activeIndex: null })), f === "onBlur") {
						let e = E === "none" ? y : M;
						m.commit(e);
					}
				},
				onCompositionStart(e) {
					T_ || (ae.current = !0, B(e.currentTarget.value));
				},
				onCompositionEnd(e) {
					ae.current = !1;
					let t = e.currentTarget.value;
					B(null), v.context.setInputValue(t, o_(Xg, e.nativeEvent));
				},
				onChange(e) {
					let t = e.nativeEvent, n = t.inputType, r = !n || n === "insertReplacementText", i = ae.current || !r;
					function a(e) {
						!C && !R && e && i && (v.context.setOpen(!0, o_(Xg, t)), I || le());
					}
					if (ae.current) {
						let n = e.currentTarget.value;
						B(n), n === "" && !v.state.openOnInputClick && !v.state.inputInsidePopup && v.context.setOpen(!1, o_(Zg, t));
						let r = n.trim(), i = I && r !== "";
						a(r), A && v.state.activeIndex !== null && !i && le();
						return;
					}
					let o = o_(Xg, t);
					if (v.context.setInputValue(e.currentTarget.value, o), o.isCanceled) return;
					let s = e.currentTarget.value === "", c = o_(Zg, t);
					s && !v.state.inputInsidePopup && (E === "single" && v.context.setSelectedValue(null, c), v.state.openOnInputClick || v.context.setOpen(!1, c)), a(e.currentTarget.value.trim()), A && v.state.activeIndex !== null && !I && le();
				},
				onKeyDown(e) {
					if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
					if (v.context.keyboardActiveRef.current = !0, R || C) {
						C && e.key === "Enter" && A && v.state.activeIndex !== null && M_(e);
						return;
					}
					let t = e.currentTarget, n = t.scrollWidth - t.clientWidth, r = b === "rtl";
					if (e.key === "Home") {
						M_(e);
						let n = k_ && r ? t.value.length : 0;
						t.setSelectionRange(n, n), t.scrollLeft = 0;
						return;
					}
					if (e.key === "End") {
						M_(e);
						let i = k_ && r ? 0 : t.value.length;
						t.setSelectionRange(i, i), t.scrollLeft = r ? -n : n;
						return;
					}
					if (!j && e.key === "Escape") {
						let t = E === "multiple" && Array.isArray(M) ? M.length === 0 : M === null, n = o_(e_, e.nativeEvent), r = E === "multiple" ? [] : null;
						v.context.setInputValue("", n), v.context.setSelectedValue(r, n), t || v.state.inline || n.isPropagationAllowed || e.stopPropagation();
						return;
					}
					if (g && e.key === "Backspace" && t.value === "" && g.highlightedChipIndex === void 0 && Array.isArray(M) && M.length > 0) {
						let t = g.chipsRef.current.length, n = t > 0 ? t - 1 : M.length - 1, r = M.filter((e, t) => t !== n);
						le(), v.context.setSelectedValue(r, o_(Wg, e.nativeEvent));
						return;
					}
					let i = g?.highlightedChipIndex !== void 0, a = U(e);
					if (g?.setHighlightedChipIndex(a), a === void 0 ? i && v.context.inputRef.current?.focus() : g?.chipsRef.current[a]?.focus(), e.which !== 229 && e.key === "Enter" && A) {
						let t = v.state.activeIndex, n = e.nativeEvent;
						if (t === null) {
							if (P) return;
							v.context.setOpen(!1, o_(Wg, n));
							return;
						}
						M_(e), MS(v, t, n);
					}
				},
				onPointerMove: ue,
				onPointerDown: ue
			},
			ce
		],
		stateAttributesMapping: CS
	}), fe = _ ? /*#__PURE__*/ (0, q.jsx)($x.Provider, {
		value: Qx,
		children: W
	}) : W;
	return /*#__PURE__*/ (0, q.jsxs)(p.Fragment, { children: [A && ne && /*#__PURE__*/ (0, q.jsx)(RS, { ref: v.context.startDismissRef }), fe] });
});
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/combobox/utils/handleInputPress.mjs
function BS(e, t, n, r) {
	if (e.baseUIHandlerPrevented) return;
	let i = z_(e.nativeEvent), a = xg(i) ? i : null;
	(a === e.currentTarget || !r?.(a) && !Y_(a)) && (e.preventDefault(), n || (t.context.inputRef.current?.focus(), t.state.openOnInputClick && t.context.setOpen(!0, o_(Qg, e.nativeEvent))));
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/autocomplete/input-group/AutocompleteInputGroup.mjs
var VS = /* @__PURE__ */ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, ...a } = e, { state: o } = eS(), s = Cx(), c = s.useState("open"), l = s.useState("disabled"), u = s.useState("readOnly"), d = s.useState("hasSelectedValue"), f = s.useState("selectionMode"), p = OS(s), m = l, h = kS(), g = f !== "none" && !d, _ = {
		...o,
		open: c,
		disabled: m,
		readOnly: u,
		popupSide: p,
		listEmpty: h,
		placeholder: g
	};
	return Fh("div", e, {
		ref: [t, Z((e) => {
			s.set("inputGroupElement", e);
		})],
		props: [{
			role: "group",
			onMouseDown(e) {
				BS(e, s, m, (e) => $(s.context.chipsContainerRef.current, e));
			}
		}, a],
		state: _,
		stateAttributesMapping: CS
	});
}), HS = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, ...a } = e;
	return Fh("span", e, {
		ref: t,
		props: [{
			"aria-hidden": !0,
			children: "▼"
		}, a]
	});
}), US = {
	...eg,
	...dg
}, WS = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, disabled: i = !1, nativeButton: a = !0, keepMounted: o = !1, style: s, ...c } = e, { disabled: l } = eS(), u = Cx(), d = u.useState("selectionMode"), f = u.useState("disabled"), p = u.useState("readOnly"), m = u.useState("open"), h = u.useState("selectedValue"), g = u.useState("hasSelectionChips"), _ = Ex(), v = !1;
	v = d === "none" ? _ !== "" : d === "single" ? h != null : g;
	let y = l || f || i, { buttonRef: b, getButtonProps: x } = Vg({
		native: a,
		disabled: y
	}), { mounted: S, transitionStatus: C, setMounted: w } = ib(v), T = {
		disabled: y,
		visible: v,
		open: m,
		transitionStatus: C
	};
	cb({
		open: v,
		ref: u.context.clearRef,
		onComplete() {
			v || w(!1);
		}
	});
	let E = Fh("button", e, {
		state: T,
		ref: [
			t,
			b,
			u.context.clearRef
		],
		props: [
			{
				tabIndex: -1,
				children: "x",
				onMouseDown(e) {
					e.preventDefault();
				},
				onClick(e) {
					if (y || p) return;
					let t = u.context.keyboardActiveRef.current ? n_ : r_;
					u.context.setInputValue("", o_(Yg, e.nativeEvent)), d === "none" ? u.context.setIndices({
						activeIndex: null,
						type: t
					}) : (u.context.setSelectedValue(Array.isArray(h) ? [] : null, o_(Yg, e.nativeEvent)), u.context.setIndices({
						activeIndex: null,
						selectedIndex: null,
						type: t
					})), u.context.inputRef.current?.focus();
				}
			},
			c,
			x
		],
		stateAttributesMapping: US
	});
	return o || S ? E : null;
}), GS = /*#__PURE__*/ p.createContext(null);
function KS() {
	return p.useContext(GS);
}
function qS(e) {
	let { children: t, items: n } = e, r = p.useMemo(() => ({ items: n }), [n]);
	return /*#__PURE__*/ (0, q.jsx)(GS.Provider, {
		value: r,
		children: t
	});
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/combobox/collection/ComboboxCollection.mjs
function JS(e) {
	let { children: t } = e, { filteredItems: n } = Tx(), r = KS(), i = r ? r.items : n;
	return /*#__PURE__*/ (0, q.jsx)(p.Fragment, { children: i.map(t) });
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/composite/list/CompositeListContext.mjs
var YS = /*#__PURE__*/ p.createContext({
	register: () => {},
	unregister: () => {},
	subscribeMapChange: () => () => {},
	nextIndexRef: { current: 0 }
});
function XS() {
	return p.useContext(YS);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/composite/list/CompositeList.mjs
function ZS(e) {
	let { children: t, elementsRef: n, labelsRef: r, onMapChange: i } = e, a = Z(i), [, o] = p.useState(!1), s = yh($S).current, c = yh(QS).current, l = p.useRef(0), u = p.useRef(!0), d = p.useRef(null), f = p.useRef(null), m = Z(() => {
		u.current || (u.current = !0, o((e) => !e));
	}), h = Z((e, t) => {
		c.set(e, t), m();
	}), g = Z((e) => {
		c.delete(e), m();
	}), _ = Z((e) => {
		let t = /* @__PURE__ */ new Map();
		return n.current.length = 0, r && (r.current.length = 0), e.forEach((e) => {
			t.set(e.element, {
				...e.registration.metadata ?? {},
				index: e.index
			}), n.current[e.index] = e.element, r && (r.current[e.index] = e.registration.label === void 0 ? e.registration.textRef?.current?.textContent ?? e.element.textContent : e.registration.label);
		}), l.current = n.current.length, t;
	});
	function v(e) {
		if (f.current?.disconnect(), f.current = null, typeof MutationObserver != "function" || e.length < 2) return;
		let t = new MutationObserver((n) => {
			if (!nC(n)) return;
			let r = null;
			for (let n of e) if (n.isConnected) {
				if (r && rC(r, n) > 0) {
					t.disconnect(), m();
					return;
				}
				r = n;
			}
		});
		f.current = t;
		let n = /* @__PURE__ */ new Set();
		for (let t = 1; t < e.length; t += 1) {
			let r = tC(e[t - 1], e[t]);
			r && n.add(r);
		}
		n.forEach((e) => t.observe(e, { childList: !0 }));
	}
	let y = Z(() => {
		let [e, t] = eC(c), n = _(e), r = d.current, i = !r || r.length !== e.length || e.some((e, t) => {
			let n = r[t];
			return e.index !== n.index || e.element !== n.element || e.registration.index !== n.registration.index || e.registration.metadata !== n.registration.metadata;
		});
		v(t), d.current = e, u.current = !1, i && (s.forEach((e) => e(n)), a(n));
	});
	Q(() => (!u.current && d.current && _(d.current), () => {
		n.current = [], r && (r.current = []);
	}), [
		n,
		r,
		_
	]), Q(() => {
		u.current && y();
	}), Q(() => () => {
		f.current?.disconnect(), u.current = !0;
	}, []);
	let b = Z((e) => (s.add(e), () => {
		s.delete(e);
	})), x = p.useMemo(() => ({
		register: h,
		unregister: g,
		subscribeMapChange: b,
		nextIndexRef: l
	}), [
		h,
		g,
		b,
		l
	]);
	return /*#__PURE__*/ (0, q.jsx)(YS.Provider, {
		value: x,
		children: t
	});
}
function QS() {
	return /* @__PURE__ */ new Map();
}
function $S() {
	return /* @__PURE__ */ new Set();
}
function eC(e) {
	let t = /* @__PURE__ */ new Set(), n = [], r = [];
	e.forEach((e, i) => {
		if (!i.isConnected) return;
		let a = e.index, o = {
			index: a ?? -1,
			element: i,
			registration: e
		};
		a === null ? r.push(o) : a >= 0 && (t.add(a), n.push(o));
	});
	let i = 0;
	return r.sort((e, t) => rC(e.element, t.element)), r.forEach((e) => {
		for (; t.has(i);) i += 1;
		e.index = i, n.push(e), i += 1;
	}), t.size > 0 && n.sort((e, t) => e.index - t.index), [n, r.map((e) => e.element)];
}
function tC(e, t) {
	let n = e.parentElement;
	for (; n && !n.contains(t);) n = n.parentElement;
	return n;
}
function nC(e) {
	for (let t of e) for (let e = 0; e < t.removedNodes.length; e += 1) if (t.removedNodes[e].isConnected) return !0;
	return !1;
}
function rC(e, t) {
	return e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/combobox/list/ComboboxList.mjs
var iC = /*#__PURE__*/ p.forwardRef(function(e, t) {
	var n;
	let { render: r, className: i, style: a, children: o, ...s } = e, c = Cx(), l = wx(), u = !!LS(!0), { filteredItems: d, hasItems: f } = Tx(), m = c.useState("selectionMode"), h = c.useState("grid"), g = c.useState("readOnly"), _ = c.useState("listProps"), v = c.useState("virtualized"), y = c.useState("forceMounted"), b = m === "multiple", x = d.length === 0, S = Z((e) => {
		c.set("positionerElement", e);
	}), C = Z((e) => {
		c.set("listElement", e);
	}), w = p.useMemo(() => typeof o == "function" ? n ||= /*#__PURE__*/ (0, q.jsx)(JS, { children: o }) : o, [o]), T = { empty: x }, E = l.useState("floatingId"), D = Fh("div", e, {
		state: T,
		ref: [
			t,
			C,
			u ? null : S
		],
		props: [
			_,
			{
				children: w,
				tabIndex: -1,
				id: E,
				role: h ? "grid" : "listbox",
				"aria-multiselectable": b ? "true" : void 0,
				"aria-readonly": !h && g ? !0 : void 0,
				onKeyDown(e) {
					if (!(c.state.disabled || c.state.readOnly) && e.key === "Enter") {
						let t = c.state.activeIndex;
						if (t == null) return;
						M_(e), MS(c, t, e.nativeEvent);
					}
				},
				onKeyDownCapture() {
					c.context.keyboardActiveRef.current = !0;
				},
				onPointerMoveCapture() {
					c.context.keyboardActiveRef.current = !1;
				}
			},
			s
		]
	});
	if (v) return D;
	let O = f && !y ? void 0 : c.context.labelsRef;
	return /*#__PURE__*/ (0, q.jsx)(ZS, {
		elementsRef: c.context.listRef,
		labelsRef: O,
		children: D
	});
}), aC = "⁠";
function oC(e) {
	let t = e.ownerDocument.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = null;
	for (; t.nextNode();) {
		let e = t.currentNode;
		e.nodeValue !== "" && (n = e);
	}
	return n;
}
function sC() {
	let e = g_(), t = p.useRef(null);
	return p.useEffect(() => {
		if (C_) return;
		let n = t.current;
		if (n == null) return;
		let r = oC(n);
		if (r == null) return;
		let i = r.data, a = `${i}${aC}`;
		return r.nodeValue = a, e.start(200, () => {
			r.nodeValue === a && (r.nodeValue = i);
		}), () => {
			e.clear(), r.nodeValue === a && (r.nodeValue = i);
		};
	}, [t, e]), t;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/combobox/group/ComboboxGroupContext.mjs
var cC = /*#__PURE__*/ p.createContext(void 0);
function lC() {
	let e = p.useContext(cC);
	if (e === void 0) throw Error(_h(18));
	return e;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/combobox/group/ComboboxGroup.mjs
var uC = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, items: a, ...o } = e, s = Cx().useState("grid"), [c, l] = p.useState(), u = p.useMemo(() => ({
		labelId: c,
		setLabelId: l,
		items: a
	}), [
		c,
		l,
		a
	]), d = Fh("div", e, {
		ref: t,
		props: [{
			role: s ? "rowgroup" : "group",
			"aria-labelledby": c
		}, o]
	}), f = /*#__PURE__*/ (0, q.jsx)(cC.Provider, {
		value: u,
		children: d
	});
	return a ? /*#__PURE__*/ (0, q.jsx)(qS, {
		items: a,
		children: f
	}) : f;
}), dC = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, id: a, ...o } = e, { setLabelId: s } = lC(), c = f_(a);
	return Q(() => (s(c), () => {
		s((e) => e === c ? void 0 : e);
	}), [c, s]), Fh("div", e, {
		ref: t,
		props: [{
			id: c,
			"aria-hidden": !0
		}, o]
	});
});
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/internals/composite/list/useCompositeListItem.mjs
function fC(e = {}) {
	let { guess: t, label: n, metadata: r, textRef: i, index: a } = e, { register: o, unregister: s, subscribeMapChange: c, nextIndexRef: l } = XS(), u = p.useRef(-1), [d, f] = p.useState(a == null && t ? () => {
		if (u.current === -1) {
			let e = l.current;
			l.current += 1, u.current = e;
		}
		return u.current;
	} : -1), m = a ?? d, h = p.useRef(null), g = p.useCallback((e) => {
		let t = h.current;
		t && s(t), h.current = e, e && o(e, {
			metadata: r ?? null,
			index: a ?? null,
			label: n,
			textRef: i
		});
	}, [
		a,
		o,
		s,
		r,
		n,
		i
	]);
	return Q(() => {
		if (a == null) return c((e) => {
			let t = h.current ? e.get(h.current)?.index : null;
			t != null && f(t);
		});
	}, [a, c]), {
		ref: g,
		index: m
	};
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/combobox/item/ComboboxItemContext.mjs
var pC = /*#__PURE__*/ p.createContext(void 0), mC = /*#__PURE__*/ p.createContext(!1);
function hC() {
	return p.useContext(mC);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/combobox/item/ComboboxItem.mjs
function gC(e) {
	let { componentProps: t, forwardedRef: n, virtualized: r, indexFromFilter: i } = e, { render: a, className: o, style: s, value: c = null, index: l, disabled: u = !1, nativeButton: d = !1, ...f } = t, m = p.useRef(null), h = fC({
		guess: !0,
		index: l,
		textRef: m
	}), g = Cx(), _ = hC(), v = Dx(), y = g.useState("selectionMode"), b = g.useState("disabled"), x = g.useState("readOnly"), S = g.useState("isItemEqualToValue"), C = b || u, w = y !== "none", T = l ?? i ?? h.index, E = T !== -1, D = g.useState("id"), O = g.useState("isActive", T), k = g.useState("isSelected", c), A = g.useState("itemProps"), j = p.useRef(null), M = D != null && E ? `${D}-${T}` : void 0, N = k && w;
	Q(() => {
		if (!E || !r && l == null) return;
		let e = g.context.listRef.current;
		return e[T] = j.current, () => {
			delete e[T];
		};
	}, [
		E,
		r,
		T,
		l,
		g
	]), Q(() => {
		if (!E || v) return;
		let e = g.context.valuesRef.current;
		return e[T] = c, () => {
			delete e[T];
		};
	}, [
		E,
		v,
		T,
		c,
		g
	]), Q(() => {
		if (!E || v) return;
		let e = g.state.selectedValue, t = g.state.selectedIndex;
		g.state.selectionMode === "multiple" && Array.isArray(e) ? t = Ix(T, c, g.context.valuesRef.current, e, S, t) : Ax(c, e, S) && (t = T), g.set("selectedIndex", t);
	}, [
		E,
		v,
		g,
		T,
		c,
		S
	]);
	let { getButtonProps: P, buttonRef: F } = Vg({
		disabled: C,
		focusableWhenDisabled: !0,
		native: d,
		composite: !0
	}), I = {
		disabled: C,
		selected: N,
		highlighted: O
	};
	function L(e) {
		function t() {
			g.context.handleSelection(e, c);
		}
		g.state.submitOnItemClick ? (dy.flushSync(t), g.context.requestSubmit()) : t();
	}
	let R = {
		id: M,
		role: _ ? "gridcell" : "option",
		"aria-selected": w ? N : void 0,
		tabIndex: void 0,
		onPointerDownCapture(e) {
			e.isPrimary && (g.context.pointerDownItemRef.current = e.currentTarget), e.preventDefault();
		},
		onMouseDown(e) {
			e.preventDefault();
		},
		onClick(e) {
			C || x || L(e.nativeEvent);
		},
		onMouseUp(e) {
			let t = g.context.pointerDownItemRef.current === e.currentTarget;
			g.context.pointerDownItemRef.current = null, C || x || e.button !== 0 || t || !O || L(e.nativeEvent);
		}
	}, ee = Fh("div", t, {
		ref: [
			F,
			n,
			h.ref,
			j
		],
		state: I,
		props: [
			A,
			R,
			f,
			P
		]
	}), te = p.useMemo(() => ({
		selected: N,
		textRef: m
	}), [N, m]);
	return /*#__PURE__*/ (0, q.jsx)(pC.Provider, {
		value: te,
		children: ee
	});
}
function _C(e) {
	let { componentProps: t, forwardedRef: n } = e, r = Cx().useState("isItemEqualToValue"), { flatFilteredValues: i } = Tx(), a = Nx(i, t.value ?? null, r);
	return /*#__PURE__*/ (0, q.jsx)(gC, {
		componentProps: t,
		forwardedRef: n,
		virtualized: !0,
		indexFromFilter: a
	});
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/autocomplete/item/AutocompleteItem.mjs
var vC = /* @__PURE__ */ p.memo(/*#__PURE__*/ p.forwardRef(function(e, t) {
	let n = Cx().useState("virtualized");
	return n && e.index == null ? /*#__PURE__*/ (0, q.jsx)(_C, {
		componentProps: e,
		forwardedRef: t
	}) : /*#__PURE__*/ (0, q.jsx)(gC, {
		componentProps: e,
		forwardedRef: t,
		virtualized: n,
		indexFromFilter: void 0
	});
})), yC = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, children: a, ...o } = e, { filteredItems: s } = Tx(), c = Cx(), l = sC(), u = s.length === 0 ? a : null;
	return Fh("div", e, {
		ref: [
			t,
			c.context.emptyRef,
			l
		],
		props: [{
			children: u,
			role: "status",
			"aria-live": "polite",
			"aria-atomic": !0
		}, o]
	});
}), bC = /* @__PURE__ */ p.forwardRef(function(e, t) {
	let { className: n, render: r, orientation: i = "horizontal", style: a, ...o } = e;
	return Fh("div", e, {
		state: { orientation: i },
		ref: t,
		props: [{ role: "presentation" }, o]
	});
}), xC = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, id: i, name: a, value: o, disabled: s = !1, onValueChange: c, defaultValue: l, autoFocus: u = !1, style: d, ...f } = e, { state: m, name: h, disabled: g, setTouched: _, setDirty: v, validityData: y, setFocused: b, setFilled: x, validationMode: S, validation: C } = eS(), { clearErrors: w, elementRef: T, submitCountRef: E } = rS(), D = g || s, O = h ?? a, k = {
		...m,
		disabled: D
	}, { labelId: A } = aS(), j = oS({ id: i }), [M] = hx({
		controlled: o,
		default: l,
		name: "FieldControl",
		state: "value"
	}), N = o !== void 0, P = N ? M : void 0, F = P == null ? void 0 : String(P), I = Z(() => C.inputRef.current?.value);
	tS(C.inputRef, j, F, I, !D, a), Q(() => {
		let e = F ?? C.inputRef.current?.value;
		e !== void 0 && x(e !== "");
	}, [
		F,
		C.inputRef,
		x
	]), fx(F, () => {
		F !== void 0 && (w(O), v(F !== (y.initialValue ?? "")), C.change(F));
	});
	let L = p.useRef(null), R = g_();
	return Q(() => {
		u && L.current === R_(zg(L.current)) && b(!0);
	}, [u, b]), Fh("input", e, {
		ref: [t, L],
		state: k,
		props: [
			{
				id: j,
				disabled: D,
				name: O,
				ref: C.inputRef,
				"aria-labelledby": A,
				autoFocus: u,
				...N ? { value: P } : { defaultValue: l },
				onChange(e) {
					let t = e.currentTarget.value, n = o_(Wg, e.nativeEvent);
					c?.(t, n), N || (v(t !== (y.initialValue ?? "")), x(t !== ""), !e.nativeEvent.defaultPrevented && !n.isCanceled && (w(O), C.change(t)));
				},
				onFocus() {
					b(!0);
				},
				onBlur(e) {
					if (_(!0), b(!1), S === "onBlur") {
						let t = e.currentTarget.value;
						C.commit(t), N && queueMicrotask(() => {
							let e = C.inputRef.current?.value;
							e !== void 0 && e !== t && e !== (y.initialValue ?? "") && C.commit(e);
						});
					}
				},
				onKeyDown(e) {
					if (e.currentTarget.tagName === "INPUT" && e.key === "Enter") {
						_(!0);
						let t = e.currentTarget.value, n = e.currentTarget.form;
						if (n && n === T.current && !e.defaultPrevented) {
							let t = e.currentTarget, n = E.current;
							R.start(0, () => {
								E.current === n && C.commit(t.value);
							});
						} else C.commit(t);
					}
				}
			},
			f,
			(e) => C.getValidationProps(D, e)
		],
		stateAttributesMapping: Zx
	});
}), SC = /*#__PURE__*/ p.forwardRef(function(e, t) {
	return /*#__PURE__*/ (0, q.jsx)(xC, {
		ref: t,
		...e
	});
});
// src/components/ui/input.tsx
function CC({ className: e, size: t = "default", unstyled: n = !1, nativeInput: r = !1, style: i, ...a }) {
	let o = gp("h-8.5 w-full min-w-0 rounded-[inherit] px-[calc(--spacing(3)-1px)] text-foreground leading-8.5 outline-none [transition:background-color_5000000s_ease-in-out_0s] placeholder:text-muted-foreground/72 sm:h-7.5 sm:leading-7.5 autofill:[-webkit-text-fill-color:var(--foreground)]", t === "sm" && "h-7.5 px-[calc(--spacing(2.5)-1px)] leading-7.5 sm:h-6.5 sm:leading-6.5", t === "lg" && "h-9.5 leading-9.5 sm:h-8.5 sm:leading-8.5", a.type === "search" && "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none", a.type === "file" && "text-muted-foreground file:me-3 file:bg-transparent file:font-medium file:text-foreground file:text-sm");
	return /* @__PURE__ */ (0, q.jsx)("span", {
		className: gp(!n && "relative inline-flex w-full rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-visible:border-ring has-autofill:bg-foreground/4 has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none has-focus-visible:ring-[3px] sm:text-sm dark:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]", e) || void 0,
		"data-size": t,
		"data-slot": "input-control",
		children: r ? /* @__PURE__ */ (0, q.jsx)("input", {
			className: o,
			"data-slot": "input",
			size: typeof t == "number" ? t : void 0,
			style: typeof i == "function" ? void 0 : i,
			...a
		}) : /* @__PURE__ */ (0, q.jsx)(SC, {
			className: o,
			"data-slot": "input",
			size: typeof t == "number" ? t : void 0,
			style: i,
			...a
		})
	});
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/scroll-area/root/ScrollAreaRootContext.mjs
var wC = /*#__PURE__*/ p.createContext(void 0);
function TC() {
	let e = p.useContext(wC);
	if (e === void 0) throw Error(_h(53));
	return e;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/scroll-area/utils/getOffset.mjs
function EC(e, t, n) {
	if (!e) return 0;
	let r = getComputedStyle(e), i = `${t}${n === "x" ? "Inline" : "Block"}`, a = parseFloat(r[`${i}Start`]);
	return n === "x" && t === "margin" ? a * 2 : a + parseFloat(r[`${i}End`]);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/utils/styles.mjs
var DC = "base-ui-disable-scrollbar", OC = {
	className: DC,
	getElement(e) {
		return /*#__PURE__*/ (0, q.jsx)("style", {
			nonce: e,
			href: DC,
			precedence: "base-ui:low",
			children: `.${DC}{scrollbar-width:none}.${DC}::-webkit-scrollbar{display:none}`
		});
	}
}, kC = "data-has-overflow-x", AC = "data-has-overflow-y", jC = "data-overflow-x-start", MC = "data-overflow-x-end", NC = "data-overflow-y-start", PC = "data-overflow-y-end", FC = (e) => (t) => t ? { [e]: "" } : null, IC = {
	hasOverflowX: FC(kC),
	hasOverflowY: FC(AC),
	overflowXStart: FC(jC),
	overflowXEnd: FC(MC),
	overflowYStart: FC(NC),
	overflowYEnd: FC(PC),
	cornerHidden: () => null
}, LC = /*#__PURE__*/ p.createContext(void 0), RC = { disableStyleElements: !1 };
function zC() {
	return p.useContext(LC) ?? RC;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/scroll-area/root/ScrollAreaRootCssVars.mjs
var BC = "--scroll-area-corner-height", VC = "--scroll-area-corner-width", HC = "data-orientation", UC = {
	x: 0,
	y: 0
}, WC = {
	width: 0,
	height: 0
}, GC = {
	xStart: !1,
	xEnd: !1,
	yStart: !1,
	yEnd: !1
}, KC = {
	x: !0,
	y: !0,
	corner: !0
}, qC = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, overflowEdgeThreshold: i, style: a, ...o } = e, { xStart: s, xEnd: c, yStart: l, yEnd: u } = JC(i), d = f_(), f = g_(), m = g_(), { nonce: h, disableStyleElements: g } = zC(), [_, v] = p.useState(!1), [y, b] = p.useState(!1), [x, S] = p.useState(!1), [C, w] = p.useState(!1), [T, E] = p.useState(!1), [D, O] = p.useState(WC), [k, A] = p.useState(WC), [j, M] = p.useState(GC), [N, P] = p.useState(KC), F = p.useRef(null), I = p.useRef(null), L = p.useRef(null), R = p.useRef(null), ee = p.useRef(null), te = p.useRef(null), ne = p.useRef(null), z = p.useRef(null), re = p.useRef(0), ie = p.useRef(0), B = p.useRef(0), ae = p.useRef(0), oe = p.useRef("vertical"), se = p.useRef(UC), V = p.useRef(null);
	function H(e) {
		let t = e ? S : b, n = e ? f : m;
		t(!0), n.start(500, () => {
			t(!1);
		});
	}
	let ce = Z((e) => {
		let t = e.x - se.current.x, n = e.y - se.current.y;
		se.current = e, n !== 0 && H(!0), t !== 0 && H(!1);
	}), le = Z(() => {
		let e = I.current;
		e && V.current === null && (V.current = e.style.scrollSnapType, e.style.scrollSnapType = "none");
	}), ue = Z((e) => {
		if (e.button !== 0 || z.current !== null && (oe.current === "vertical" ? ee.current : te.current)?.hasPointerCapture(z.current)) return;
		z.current = e.pointerId, re.current = e.clientY, ie.current = e.clientX, oe.current = e.currentTarget.getAttribute(HC);
		let t = I.current;
		t && (B.current = t.scrollTop, ae.current = t.scrollLeft, le()), (oe.current === "vertical" ? ee.current : te.current)?.setPointerCapture(e.pointerId);
	}), de = Z((e) => {
		if (e.pointerId !== z.current) return;
		z.current = null, (oe.current === "vertical" ? S : b)(!1), V.current !== null && (I.current && (I.current.style.scrollSnapType = V.current), V.current = null);
		let t = oe.current === "vertical" ? ee.current : te.current;
		t?.hasPointerCapture(e.pointerId) && t.releasePointerCapture(e.pointerId);
	}), U = Z((e) => {
		if (e.pointerId !== z.current) return;
		if (e.buttons % 2 == 0) {
			de(e);
			return;
		}
		let t = I.current;
		if (!t) return;
		let n = oe.current === "vertical", r = n ? ee.current : te.current, i = n ? L.current : R.current;
		if (!r || !i) return;
		let a = n ? "y" : "x", o = EC(i, "padding", a), s = EC(r, "margin", a), c = n ? r.offsetHeight : r.offsetWidth, l = (n ? i.offsetHeight : i.offsetWidth) - c - o - s, u = n ? e.clientY - re.current : e.clientX - ie.current, d = l <= 0 ? 0 : u / l, f = n ? t.scrollHeight : t.scrollWidth, p = n ? t.clientHeight : t.clientWidth, m = (n ? B.current : ae.current) + d * (f - p);
		n ? t.scrollTop = m : t.scrollLeft = m, e.preventDefault(), H(n);
	});
	function W(e) {
		w(e.pointerType === "touch");
	}
	function fe(e) {
		if (W(e), e.pointerType !== "touch") {
			let t = $(F.current, e.target);
			v(t);
		}
	}
	let pe = p.useMemo(() => ({
		scrolling: y || x,
		hasOverflowX: !N.x,
		hasOverflowY: !N.y,
		overflowXStart: j.xStart,
		overflowXEnd: j.xEnd,
		overflowYStart: j.yStart,
		overflowYEnd: j.yEnd,
		cornerHidden: N.corner
	}), [
		y,
		x,
		N.x,
		N.y,
		N.corner,
		j
	]), me = {
		role: "presentation",
		onPointerEnter: fe,
		onPointerMove: fe,
		onPointerDown: W,
		onPointerLeave() {
			v(!1);
		},
		style: {
			position: "relative",
			[BC]: `${D.height}px`,
			[VC]: `${D.width}px`
		}
	}, he = Fh("div", e, {
		state: pe,
		ref: [t, F],
		props: [me, o],
		stateAttributesMapping: IC
	}), ge = p.useMemo(() => ({
		handlePointerDown: ue,
		handlePointerMove: U,
		handlePointerUp: de,
		handleScroll: ce,
		disableViewportSnap: le,
		cornerSize: D,
		setCornerSize: O,
		thumbSize: k,
		setThumbSize: A,
		hasMeasuredScrollbar: T,
		setHasMeasuredScrollbar: E,
		touchModality: C,
		cornerRef: ne,
		scrollingX: y,
		scrollingY: x,
		hovering: _,
		setHovering: v,
		viewportRef: I,
		scrollbarYRef: L,
		scrollbarXRef: R,
		thumbYRef: ee,
		thumbXRef: te,
		rootId: d,
		hiddenState: N,
		setHiddenState: P,
		overflowEdges: j,
		setOverflowEdges: M,
		viewportState: pe,
		overflowEdgeThreshold: {
			xStart: s,
			xEnd: c,
			yStart: l,
			yEnd: u
		}
	}), [
		ue,
		U,
		de,
		ce,
		le,
		D,
		k,
		T,
		C,
		y,
		x,
		_,
		d,
		N,
		j,
		pe,
		s,
		c,
		l,
		u
	]);
	return /*#__PURE__*/ (0, q.jsxs)(wC.Provider, {
		value: ge,
		children: [!g && OC.getElement(h), he]
	});
});
function JC(e) {
	let t = typeof e == "number" ? {
		xStart: e,
		xEnd: e,
		yStart: e,
		yEnd: e
	} : e;
	return {
		xStart: Math.max(0, t?.xStart || 0),
		xEnd: Math.max(0, t?.xEnd || 0),
		yStart: Math.max(0, t?.yStart || 0),
		yEnd: Math.max(0, t?.yEnd || 0)
	};
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/clamp.mjs
function YC(e, t = -(2 ** 53 - 1), n = 2 ** 53 - 1) {
	return Math.max(t, Math.min(e, n));
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/scroll-area/viewport/ScrollAreaViewportContext.mjs
var XC = /*#__PURE__*/ p.createContext(void 0);
function ZC() {
	let e = p.useContext(XC);
	if (e === void 0) throw Error(_h(55));
	return e;
}
function QC(e, t) {
	if (t <= 0) return 0;
	let n = YC(e, 0, t), r = n, i = t - n, a = r <= 1, o = i <= 1;
	return a && o ? r <= i ? 0 : t : a ? 0 : o ? t : n;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/scroll-area/viewport/ScrollAreaViewportCssVars.mjs
var $C = "--scroll-area-overflow-x-start", ew = "--scroll-area-overflow-x-end", tw = "--scroll-area-overflow-y-start", nw = "--scroll-area-overflow-y-end", rw = "--scroll-area-thumb-height", iw = "--scroll-area-thumb-width", aw = [
	$C,
	ew,
	tw,
	nw
], ow = !1;
function sw() {
	ow || O_ || (typeof CSS < "u" && "registerProperty" in CSS && aw.forEach((e) => {
		try {
			CSS.registerProperty({
				name: e,
				syntax: "<length>",
				inherits: !1,
				initialValue: "0px"
			});
		} catch {}
	}), ow = !0);
}
var cw = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, ...a } = e, { viewportRef: o, scrollbarYRef: s, scrollbarXRef: c, thumbYRef: l, thumbXRef: u, cornerRef: d, cornerSize: f, setCornerSize: m, setThumbSize: h, rootId: g, setHiddenState: _, hiddenState: v, setHasMeasuredScrollbar: y, handleScroll: b, touchModality: x, setHovering: S, setOverflowEdges: C, overflowEdgeThreshold: w, viewportState: T } = TC(), E = _S(), D = p.useRef(!0), O = p.useRef([
		NaN,
		NaN,
		NaN,
		NaN
	]), k = g_(), A = g_(), j = Z(() => {
		let e = o.current, t = s.current, n = c.current, r = l.current, i = u.current, a = d.current;
		if (!e) return;
		let p = e.scrollHeight, g = e.scrollWidth, v = e.clientHeight, b = e.clientWidth, x = e.scrollTop, S = e.scrollLeft, T = O.current, D = Number.isNaN(T[0]);
		if (T[0] = v, T[1] = p, T[2] = b, T[3] = g, D && y(!0), p === 0 || g === 0) return;
		let k = lw(e), A = k.y, j = k.x, M = b / g, N = v / p, P = Math.max(0, g - b), F = Math.max(0, p - v), I = 0, L = 0;
		j || (I = QC(E === "rtl" ? -S : S, P), L = P - I);
		let R = A ? 0 : QC(x, F), ee = A ? 0 : F - R, te = j ? 0 : b, ne = A ? 0 : v, z = 0, re = 0;
		!j && !A && (z = t?.offsetWidth || 0, re = n?.offsetHeight || 0);
		let ie = f.width === 0 && f.height === 0, B = ie ? z : 0, ae = ie ? re : 0, oe = EC(n, "padding", "x"), se = EC(t, "padding", "y"), V = EC(i, "margin", "x"), H = EC(r, "margin", "y"), ce = te - oe - V, le = ne - se - H, ue = n ? Math.min(n.offsetWidth - B, ce) : ce, de = t ? Math.min(t.offsetHeight - ae, le) : le, U = Math.max(16, ue * M), W = Math.max(16, de * N);
		if (h((e) => uw(e, {
			width: U,
			height: W
		})), t && r) {
			let e = dw(r, rw, x, F, p, W, t.offsetHeight - W - se - H);
			r.style.transform = `translate3d(0,${e}px,0)`;
		}
		if (n && i) {
			let e = n.offsetWidth - U - oe - V, t = dw(i, iw, E === "rtl" ? -S : S, P, g, U, e);
			i.style.transform = `translate3d(${E === "rtl" ? -t : t}px,0,0)`;
		}
		let fe = [
			I,
			L,
			R,
			ee
		];
		aw.forEach((t, n) => {
			e.style.setProperty(t, `${fe[n]}px`);
		}), a && m((e) => uw(e, {
			width: z,
			height: re
		})), _((e) => uw(e, k));
		let pe = {
			xStart: !j && I > w.xStart,
			xEnd: !j && L > w.xEnd,
			yStart: !A && R > w.yStart,
			yEnd: !A && ee > w.yEnd
		};
		C((e) => uw(e, pe));
	});
	Q(() => {
		sw();
	}, []), Q(() => {
		queueMicrotask(j);
	}, [
		j,
		v,
		E,
		w.xStart,
		w.xEnd,
		w.yStart,
		w.yEnd
	]), Q(() => {
		o.current?.matches(":hover") && S(!0);
	}, [o, S]), Q(() => {
		let e = o.current;
		if (typeof ResizeObserver > "u" || !e) return;
		let t = !1, n = new ResizeObserver(() => {
			if (!t) {
				t = !0;
				let n = O.current;
				if (n[0] === e.clientHeight && n[1] === e.scrollHeight && n[2] === e.clientWidth && n[3] === e.scrollWidth) return;
			}
			j();
		});
		return n.observe(e), A.start(0, () => {
			let t = e.getAnimations({ subtree: !0 });
			t.length !== 0 && Promise.allSettled(t.map((e) => e.finished)).then(j).catch(() => {});
		}), () => {
			n.disconnect(), A.clear();
		};
	}, [
		j,
		o,
		A
	]);
	function M() {
		D.current = !1;
	}
	let N = {
		role: "presentation",
		...g && { "data-id": `${g}-viewport` },
		tabIndex: v.x && v.y ? -1 : 0,
		className: OC.className,
		style: { overflow: "scroll" },
		onScroll() {
			o.current && (j(), (x || !D.current) && b({
				x: o.current.scrollLeft,
				y: o.current.scrollTop
			}), k.start(100, () => {
				D.current = !0;
			}));
		},
		onWheel: M,
		onPointerMove: M,
		onPointerEnter: M,
		onKeyDown: M
	}, P = Fh("div", e, {
		ref: [t, o],
		state: T,
		props: [N, a],
		stateAttributesMapping: IC
	}), F = p.useMemo(() => ({ computeThumbPosition: j }), [j]);
	return /*#__PURE__*/ (0, q.jsx)(XC.Provider, {
		value: F,
		children: P
	});
});
function lw(e) {
	let t = e.clientHeight >= e.scrollHeight, n = e.clientWidth >= e.scrollWidth;
	return {
		y: t,
		x: n,
		corner: t || n
	};
}
function uw(e, t) {
	for (let n in t) if (e[n] !== t[n]) return t;
	return e;
}
function dw(e, t, n, r, i, a, o) {
	let s = YC(n, 0, r), c = n - s, l = Math.max(16, a * i / (i + Math.abs(c)));
	return e.style.setProperty(t, c ? `${l}px` : ""), (r ? s / r * o : 0) + (c > 0 ? a - l : 0);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/scroll-area/scrollbar/ScrollAreaScrollbarContext.mjs
var fw = /*#__PURE__*/ p.createContext(void 0);
function pw() {
	let e = p.useContext(fw);
	if (e === void 0) throw Error(_h(54));
	return e;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/scroll-area/scrollbar/ScrollAreaScrollbar.mjs
var mw = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, orientation: i = "vertical", keepMounted: a = !1, style: o, ...s } = e, { hovering: c, scrollingX: l, scrollingY: u, hiddenState: d, scrollbarYRef: f, scrollbarXRef: m, viewportRef: h, thumbYRef: g, thumbXRef: _, handlePointerDown: v, handlePointerUp: y, handleScroll: b, disableViewportSnap: x, rootId: S, thumbSize: C, hasMeasuredScrollbar: w, viewportState: T } = TC(), E = i === "vertical", D = {
		...T,
		hovering: c,
		scrolling: E ? u : l,
		orientation: i
	}, O = _S(), k = !w && !a, A = E ? d.y : d.x, j = a || !A;
	p.useEffect(() => {
		if (!j) return;
		let e = h.current, t = E ? f.current : m.current;
		if (!t) return;
		function n(t) {
			if (!e || t.ctrlKey) return;
			let n = !E, r = n ? "scrollLeft" : "scrollTop", i = n ? t.deltaX : t.deltaY;
			if (i === 0) return;
			let a = n ? e.scrollWidth - e.clientWidth : e.scrollHeight - e.clientHeight, o = n && O === "rtl" ? -a : 0, s = n && O === "rtl" ? 0 : a, c = e[r];
			c <= o && i < 0 || c >= s && i > 0 || (t.preventDefault(), e[r] = Math.min(s, Math.max(o, c + i)), b({
				x: e.scrollLeft,
				y: e.scrollTop
			}));
		}
		return $_(t, "wheel", n, { passive: !1 });
	}, [
		O,
		b,
		E,
		m,
		f,
		j,
		h
	]);
	let M = {
		...S && { "data-id": `${S}-scrollbar` },
		"aria-hidden": !0,
		onPointerDown(e) {
			if (e.button !== 0) return;
			let t = z_(e.nativeEvent), n = E ? g.current : _.current;
			if (n && $(n, t)) return;
			let r = h.current;
			if (!r) return;
			let i = E ? f.current : m.current;
			if (!n || !i) return;
			let a = E ? "y" : "x", o = EC(n, "margin", a), s = EC(i, "padding", a), c = E ? n.offsetHeight : n.offsetWidth, l = i.getBoundingClientRect(), u = E ? e.clientY - l.top - c / 2 - s + o / 2 : e.clientX - l.left - c / 2 - s + o / 2, d = E ? r.scrollHeight : r.scrollWidth, p = E ? r.clientHeight : r.clientWidth, y = (E ? i.offsetHeight : i.offsetWidth) - c - s - o;
			if (y <= 0) return;
			let S = u / y, C = d - p;
			x(), E ? r.scrollTop = S * C : r.scrollLeft = O === "rtl" ? -(1 - S) * C : S * C, b({
				x: r.scrollLeft,
				y: r.scrollTop
			}), v(e);
		},
		onMouseDown(e) {
			e.preventDefault();
		},
		onPointerUp: y,
		onPointerCancel: y,
		style: {
			position: "absolute",
			touchAction: "none",
			WebkitUserSelect: "none",
			userSelect: "none",
			visibility: k ? "hidden" : void 0,
			...E ? {
				top: 0,
				bottom: `var(${BC})`,
				insetInlineEnd: 0,
				[rw]: `${C.height}px`
			} : {
				insetInlineStart: 0,
				insetInlineEnd: `var(${VC})`,
				bottom: 0,
				[iw]: `${C.width}px`
			}
		}
	}, N = Fh("div", e, {
		ref: [t, E ? f : m],
		state: D,
		props: [M, s],
		stateAttributesMapping: IC
	});
	return j ? /*#__PURE__*/ (0, q.jsx)(fw.Provider, {
		value: i,
		children: N
	}) : null;
}), hw = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, ...a } = e, { computeThumbPosition: o } = ZC(), { hasMeasuredScrollbar: s, viewportState: c } = TC(), l = p.useRef(null), u = p.useRef(s);
	return Q(() => {
		if (typeof ResizeObserver > "u") return;
		let e = !1, t = new ResizeObserver(() => {
			!e && (e = !0, !u.current) || o();
		});
		return l.current && t.observe(l.current), () => {
			t.disconnect();
		};
	}, [o]), Fh("div", e, {
		ref: [t, l],
		state: c,
		stateAttributesMapping: IC,
		props: [{
			role: "presentation",
			style: { minWidth: "fit-content" }
		}, a]
	});
}), gw = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, ...a } = e, { thumbYRef: o, thumbXRef: s, handlePointerDown: c, handlePointerMove: l, handlePointerUp: u, scrollingX: d, scrollingY: f, hasMeasuredScrollbar: p } = TC(), m = pw(), h = m === "vertical";
	return Fh("div", e, {
		ref: [t, h ? o : s],
		state: {
			scrolling: h ? f : d,
			orientation: m
		},
		props: [{
			onPointerDown: c,
			onPointerMove: l,
			onPointerUp: u,
			onPointerCancel: u,
			style: {
				visibility: p ? void 0 : "hidden",
				...h ? { height: "var(--scroll-area-thumb-height)" } : { width: "var(--scroll-area-thumb-width)" }
			}
		}, a]
	});
}), _w = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, ...a } = e, { cornerRef: o, cornerSize: s, hiddenState: c } = TC(), l = Fh("div", e, {
		ref: [t, o],
		props: [{
			"aria-hidden": !0,
			style: {
				position: "absolute",
				bottom: 0,
				insetInlineEnd: 0,
				width: s.width,
				height: s.height
			}
		}, a]
	});
	return c.corner ? null : l;
});
// src/components/ui/scroll-area.tsx
function vw({ className: e, children: t, scrollFade: n = !1, scrollbarGutter: r = !1, fill: i = !1, clampContentMinWidth: a = !0, overscrollContain: o = !1, ...s }) {
	return /* @__PURE__ */ (0, q.jsxs)(qC, {
		className: gp("size-full min-h-0", e),
		...s,
		children: [
			/* @__PURE__ */ (0, q.jsx)(cw, {
				className: gp("h-full rounded-[inherit] outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background", o && "data-has-overflow-y:overscroll-y-contain data-has-overflow-x:overscroll-x-contain", n && "mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))] mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))] [--fade-size:1.5rem]", r && "data-has-overflow-y:pe-2.5 data-has-overflow-x:pb-2.5"),
				"data-slot": "scroll-area-viewport",
				children: /* @__PURE__ */ (0, q.jsx)(hw, {
					className: gp(i && "size-full"),
					"data-slot": "scroll-area-content",
					style: a ? { minWidth: 0 } : void 0,
					children: t
				})
			}),
			/* @__PURE__ */ (0, q.jsx)(yw, { orientation: "vertical" }),
			/* @__PURE__ */ (0, q.jsx)(yw, { orientation: "horizontal" }),
			/* @__PURE__ */ (0, q.jsx)(_w, { "data-slot": "scroll-area-corner" })
		]
	});
}
function yw({ className: e, orientation: t = "vertical", ...n }) {
	return /* @__PURE__ */ (0, q.jsx)(mw, {
		className: gp("m-1 flex opacity-0 transition-opacity delay-300 data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5 data-[orientation=horizontal]:flex-col data-hovering:opacity-100 data-scrolling:opacity-100 data-hovering:delay-0 data-scrolling:delay-0 data-hovering:duration-100 data-scrolling:duration-100", e),
		"data-slot": "scroll-area-scrollbar",
		orientation: t,
		...n,
		children: /* @__PURE__ */ (0, q.jsx)(gw, {
			className: "relative flex-1 rounded-full bg-foreground/20",
			"data-slot": "scroll-area-thumb"
		})
	});
}
// src/components/ui/autocomplete.tsx
var bw = bS;
function xw({ className: e, showTrigger: t = !1, showClear: n = !1, startAddon: r, size: i, triggerProps: a, clearProps: o, ...s }) {
	let c = i ?? "default";
	return /* @__PURE__ */ (0, q.jsxs)(VS, {
		className: "relative not-has-[>*.w-full]:w-fit w-full text-foreground has-disabled:opacity-64",
		"data-slot": "autocomplete-input-group",
		children: [
			r && /* @__PURE__ */ (0, q.jsx)("div", {
				"aria-hidden": "true",
				className: "pointer-events-none absolute inset-y-0 start-px z-10 flex items-center ps-[calc(--spacing(3)-1px)] opacity-80 has-[+[data-size=sm]]:ps-[calc(--spacing(2.5)-1px)] [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:-mx-0.5",
				"data-slot": "autocomplete-start-addon",
				children: r
			}),
			/* @__PURE__ */ (0, q.jsx)(zS, {
				className: gp(r && "data-[size=sm]:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(7.5)-1px)] *:data-[slot=autocomplete-input]:ps-[calc(--spacing(8.5)-1px)] sm:data-[size=sm]:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(7)-1px)] sm:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(8)-1px)]", c === "sm" ? "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-6.5" : "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-7", e),
				"data-slot": "autocomplete-input",
				render: /* @__PURE__ */ (0, q.jsx)(CC, {
					nativeInput: !0,
					size: c
				}),
				...s
			}),
			t && /* @__PURE__ */ (0, q.jsx)(Aw, {
				className: gp("absolute top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-colors pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:opacity-100 has-[+[data-slot=autocomplete-clear]]:hidden sm:size-7 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", c === "sm" ? "end-0" : "end-0.5"),
				...a,
				children: /* @__PURE__ */ (0, q.jsx)(HS, {
					"data-slot": "autocomplete-icon",
					children: /* @__PURE__ */ (0, q.jsx)(qp, {})
				})
			}),
			n && /* @__PURE__ */ (0, q.jsx)(Ow, {
				className: gp("absolute top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-colors pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:opacity-100 has-[+[data-slot=autocomplete-clear]]:hidden sm:size-7 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", c === "sm" ? "end-0" : "end-0.5"),
				...o,
				children: /* @__PURE__ */ (0, q.jsx)($m, {})
			})
		]
	});
}
function Sw({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ (0, q.jsx)(vC, {
		className: gp("flex min-h-8 cursor-default select-none items-center rounded-sm px-2 py-1 text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm", e),
		"data-slot": "autocomplete-item",
		...n,
		children: t
	});
}
function Cw({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)(bC, {
		className: gp("mx-2 my-1 h-px bg-border last:hidden", e),
		"data-slot": "autocomplete-separator",
		...t
	});
}
function ww({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)(uC, {
		className: gp("[[role=group]+&]:mt-1.5", e),
		"data-slot": "autocomplete-group",
		...t
	});
}
function Tw({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)(dC, {
		className: gp("px-2 py-1.5 font-medium text-muted-foreground text-xs", e),
		"data-slot": "autocomplete-group-label",
		...t
	});
}
function Ew({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)(yC, {
		className: gp("not-empty:p-2 text-center text-base text-muted-foreground sm:text-sm", e),
		"data-slot": "autocomplete-empty",
		...t
	});
}
function Dw({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)(vw, {
		overscrollContain: !0,
		scrollbarGutter: !0,
		scrollFade: !0,
		children: /* @__PURE__ */ (0, q.jsx)(iC, {
			className: gp("not-empty:scroll-py-1 not-empty:p-1 in-data-has-overflow-y:pe-3", e),
			"data-slot": "autocomplete-list",
			...t
		})
	});
}
function Ow({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)(WS, {
		className: gp("absolute end-0.5 top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-[color,background-color,box-shadow,opacity] pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:opacity-100 sm:size-7 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", e),
		"data-slot": "autocomplete-clear",
		...t,
		children: /* @__PURE__ */ (0, q.jsx)($m, {})
	});
}
var kw = JS;
function Aw({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ (0, q.jsx)(NS, {
		className: e,
		"data-slot": "autocomplete-trigger",
		...n,
		children: t
	});
}
// src/components/ui/command.tsx
var jw = lx, Mw = Gb;
function Nw({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)(hg, {
		className: gp("fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute", e),
		"data-slot": "command-dialog-backdrop",
		...t
	});
}
function Pw({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)(ux, {
		className: gp("fixed inset-0 z-50 flex flex-col items-center px-4 py-[max(--spacing(4),4vh)] sm:py-[10vh]", e),
		"data-slot": "command-dialog-viewport",
		...t
	});
}
function Fw({ className: e, children: t, portalProps: n, ...r }) {
	return /* @__PURE__ */ (0, q.jsxs)(Mw, {
		...n,
		children: [/* @__PURE__ */ (0, q.jsx)(Nw, {}), /* @__PURE__ */ (0, q.jsx)(Pw, { children: /* @__PURE__ */ (0, q.jsx)(Hb, {
			className: gp("relative row-start-2 flex max-h-105 min-h-0 w-full min-w-0 max-w-xl -translate-y-[calc(1.25rem*var(--nested-dialogs))] scale-[calc(1-0.1*var(--nested-dialogs))] flex-col rounded-2xl border bg-popover not-dark:bg-clip-padding text-popover-foreground opacity-[calc(1-0.1*var(--nested-dialogs))] shadow-lg/5 outline-none transition-[scale,opacity,translate] duration-200 ease-in-out will-change-transform before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:bg-muted/72 before:shadow-[0_1px_--theme(--color-black/4%)] data-nested:data-ending-style:translate-y-8 data-nested:data-starting-style:translate-y-8 data-nested-dialog-open:origin-top data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0 **:data-[slot=scroll-area-viewport]:data-has-overflow-y:pe-1 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]", e),
			"data-slot": "command-dialog-popup",
			...r,
			children: t
		}) })]
	});
}
function Iw({ autoHighlight: e = "always", keepHighlight: t = !0, ...n }) {
	return /* @__PURE__ */ (0, q.jsx)(bw, {
		autoHighlight: e,
		inline: !0,
		keepHighlight: t,
		open: !0,
		...n
	});
}
function Lw({ className: e, placeholder: t = void 0, ...n }) {
	return /* @__PURE__ */ (0, q.jsx)("div", {
		className: "px-2.5 py-1.5",
		children: /* @__PURE__ */ (0, q.jsx)(xw, {
			autoFocus: !0,
			className: gp("border-transparent! bg-transparent! shadow-none before:hidden has-focus-visible:ring-0", e),
			placeholder: t,
			size: "lg",
			startAddon: /* @__PURE__ */ (0, q.jsx)(km, {}),
			...n
		})
	});
}
function Rw({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)(Dw, {
		className: gp("not-empty:scroll-py-2 not-empty:p-2", e),
		"data-slot": "command-list",
		...t
	});
}
function zw({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)(Ew, {
		className: gp("not-empty:py-6", e),
		"data-slot": "command-empty",
		...t
	});
}
function Bw({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)("div", {
		className: gp("relative -mx-px not-has-[+[data-slot=command-footer]]:-mb-px min-h-0 rounded-t-xl not-has-[+[data-slot=command-footer]]:rounded-b-2xl border border-b-0 bg-popover bg-clip-padding shadow-xs/5 [clip-path:inset(0_1px)] not-has-[+[data-slot=command-footer]]:[clip-path:inset(0_1px_1px_1px_round_0_0_calc(var(--radius-2xl)-1px)_calc(var(--radius-2xl)-1px))] before:pointer-events-none before:absolute before:inset-0 before:rounded-t-[calc(var(--radius-xl)-1px)] **:data-[slot=scroll-area-scrollbar]:mt-2", e),
		...t
	});
}
function Vw({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)(ww, {
		className: e,
		"data-slot": "command-group",
		...t
	});
}
function Hw({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)(Tw, {
		className: e,
		"data-slot": "command-group-label",
		...t
	});
}
var Uw = kw;
function Ww({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)(Sw, {
		className: gp("py-1.5", e),
		"data-slot": "command-item",
		...t
	});
}
function Gw({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)(Cw, {
		className: gp("my-2", e),
		"data-slot": "command-separator",
		...t
	});
}
function Kw({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)("kbd", {
		className: gp("ms-auto font-medium font-sans text-muted-foreground/72 text-xs tracking-widest", e),
		"data-slot": "command-shortcut",
		...t
	});
}
function qw({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)("div", {
		className: gp("flex items-center justify-between gap-2 rounded-b-[calc(var(--radius-2xl)-1px)] border-t px-5 py-3 text-muted-foreground text-xs", e),
		"data-slot": "command-footer",
		...t
	});
}
// src/components/ui/kbd.tsx
function Jw({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)("kbd", {
		className: gp("pointer-events-none inline-flex h-5 min-w-5 select-none items-center justify-center gap-1 rounded-[.25rem] bg-muted px-1 font-medium font-sans text-muted-foreground text-xs [&_svg:not([class*='size-'])]:size-3", e),
		"data-slot": "kbd",
		...t
	});
}
function Yw({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)("kbd", {
		className: gp("inline-flex items-center gap-1", e),
		"data-slot": "kbd-group",
		...t
	});
}
// src/islands/CossCommandPaletteIsland.tsx
function Xw(e, t) {
	if (typeof window.t == "function") {
		let t = window.t(e);
		if (t && t !== e) return String(t);
	}
	return t;
}
var Zw = [
	{
		id: "dashboard",
		i18nKey: "nav.dashboard",
		fallback: "仪表盘",
		keywords: "home overview metrics kpi 首页 概览",
		icon: pm
	},
	{
		id: "chat",
		i18nKey: "nav.chat",
		fallback: "对话",
		keywords: "agent task pentest ai 对话 渗透 测试",
		icon: _m
	},
	{
		id: "agents-swarm",
		i18nKey: "nav.agentsSwarm",
		fallback: "蜂群看板",
		keywords: "swarm multiagent topology graph 蜂群 拓扑 多代理",
		icon: ym
	},
	{
		id: "agents-management",
		i18nKey: "nav.agentsManagement",
		fallback: "智能体管理",
		keywords: "agents markdown subagent 智能体 子代理",
		icon: Gp
	},
	{
		id: "vulnerabilities",
		i18nKey: "nav.vulnerabilities",
		fallback: "漏洞管理",
		keywords: "vuln finding cve severity 漏洞 风险",
		icon: Lm
	},
	{
		id: "projects",
		i18nKey: "nav.projects",
		fallback: "项目管理",
		keywords: "project workspace fact 项目 工作区",
		icon: am
	},
	{
		id: "asset-overview",
		i18nKey: "nav.assetOverview",
		fallback: "资产概览",
		keywords: "assets dashboard 资产 概览",
		icon: Tm
	},
	{
		id: "asset-library",
		i18nKey: "nav.assetLibrary",
		fallback: "资产库",
		keywords: "assets host domain port ip 资产库 主机 域名",
		icon: tm
	},
	{
		id: "info-collect",
		i18nKey: "nav.infoCollect",
		fallback: "信息收集",
		keywords: "fofa recon subdomain 信息收集 侦察",
		icon: Lp
	},
	{
		id: "tasks",
		i18nKey: "nav.tasks",
		fallback: "任务管理",
		keywords: "batch queue jobs 任务 队列",
		icon: Vm
	},
	{
		id: "workflows",
		i18nKey: "nav.workflows",
		fallback: "工作流",
		keywords: "workflow dag automation 工作流",
		icon: sm
	},
	{
		id: "hitl",
		i18nKey: "nav.hitl",
		fallback: "人机协同",
		keywords: "hitl approval review 审批 人机协同",
		icon: Ym
	},
	{
		id: "tool-guard",
		i18nKey: "nav.toolGuard",
		fallback: "调用拦截",
		keywords: "guard policy security 拦截 规则",
		icon: Fm
	},
	{
		id: "mcp-monitor",
		i18nKey: "nav.mcpMonitor",
		fallback: "MCP监控",
		keywords: "mcp monitor calls 监控",
		icon: jm
	},
	{
		id: "mcp-management",
		i18nKey: "nav.mcpManagement",
		fallback: "MCP管理",
		keywords: "mcp tools server 工具",
		icon: Zm
	},
	{
		id: "skills-monitor",
		i18nKey: "nav.skillsMonitor",
		fallback: "技能状态",
		keywords: "skills status 技能 状态",
		icon: zm
	},
	{
		id: "skills-management",
		i18nKey: "nav.skillsManagement",
		fallback: "技能管理",
		keywords: "skills package 技能 管理",
		icon: Up
	},
	{
		id: "knowledge-management",
		i18nKey: "nav.knowledgeManagement",
		fallback: "知识管理",
		keywords: "rag kb docs 知识库",
		icon: Up
	},
	{
		id: "knowledge-retrieval-logs",
		i18nKey: "nav.knowledgeRetrievalLogs",
		fallback: "检索历史",
		keywords: "rag logs retrieval 检索 历史",
		icon: rm
	},
	{
		id: "webshell",
		i18nKey: "nav.webshell",
		fallback: "WebShell管理",
		keywords: "shell terminal webshell",
		icon: Gm
	},
	{
		id: "chat-files",
		i18nKey: "nav.chatFiles",
		fallback: "文件管理",
		keywords: "files artifacts 文件",
		icon: rm
	},
	{
		id: "c2-listeners",
		i18nKey: "nav.c2Listeners",
		fallback: "C2 · 监听器",
		keywords: "c2 listeners 监听",
		icon: Dm
	},
	{
		id: "c2-sessions",
		i18nKey: "nav.c2Sessions",
		fallback: "C2 · 会话",
		keywords: "c2 sessions 会话",
		icon: Gm
	},
	{
		id: "c2-tasks",
		i18nKey: "nav.c2Tasks",
		fallback: "C2 · 任务",
		keywords: "c2 tasks 任务",
		icon: Vm
	},
	{
		id: "c2-payloads",
		i18nKey: "nav.c2Payloads",
		fallback: "C2 · Payload",
		keywords: "c2 payloads 载荷",
		icon: Zm
	},
	{
		id: "c2-events",
		i18nKey: "nav.c2Events",
		fallback: "C2 · 事件",
		keywords: "c2 events 事件",
		icon: Lp
	},
	{
		id: "c2-profiles",
		i18nKey: "nav.c2Profiles",
		fallback: "C2 · 流量伪装",
		keywords: "c2 profiles 伪装",
		icon: Fm
	},
	{
		id: "roles-management",
		i18nKey: "nav.rolesManagement",
		fallback: "角色管理",
		keywords: "roles prompt 角色",
		icon: dm
	},
	{
		id: "platform-rbac",
		i18nKey: "nav.platformRbac",
		fallback: "平台权限",
		keywords: "rbac users auth 权限 用户",
		icon: dm
	},
	{
		id: "settings",
		i18nKey: "nav.settings",
		fallback: "系统设置",
		keywords: "settings config model ai 设置 模型 配置",
		icon: Nm
	}
];
function Qw(e) {
	if (typeof window.canAccessPage == "function" && !window.canAccessPage(e)) return !1;
	let t = document.querySelector(`.nav-item[data-page="${e}"], .nav-submenu-item[data-page="${e}"]`);
	return !t || !t.hidden && t.style.display !== "none";
}
function $w() {
	let [e, t] = (0, p.useState)(!1), [n, r] = (0, p.useState)(""), [i, a] = (0, p.useState)(0), [o, s] = (0, p.useState)([]), c = (0, p.useCallback)(async () => {
		if (typeof window.apiFetch == "function") try {
			let e = await window.apiFetch("/api/conversations?limit=8&offset=0");
			if (e && e.ok) {
				let t = await e.json();
				s(Array.isArray(t.conversations) ? t.conversations : []);
			}
		} catch {}
	}, []), l = (0, p.useCallback)(() => {
		r(""), t(!0);
		let e = document.getElementById("sl-cmdk-overlay");
		e && (e.hidden = !0), c();
	}, [c]), u = (0, p.useCallback)(() => {
		t(!1);
	}, []);
	(0, p.useEffect)(() => {
		window.openCommandPalette = l, window.closeCommandPalette = u, window.openCossCommandPalette = l;
		let e = document.getElementById("sl-cmdk-overlay");
		e && (e.hidden = !0);
		let n = (e) => {
			e.isComposing || (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" && (e.preventDefault(), e.stopImmediatePropagation(), t((e) => {
				let t = !e;
				return t && (r(""), c()), t;
			}));
		}, i = () => a((e) => e + 1);
		return document.addEventListener("keydown", n, !0), window.addEventListener("languageChanged", i), () => {
			document.removeEventListener("keydown", n, !0), window.removeEventListener("languageChanged", i);
		};
	}, [
		l,
		u,
		c
	]);
	let d = (0, p.useMemo)(() => {
		let e = Xw("commandPalette.groupActions", "快捷操作"), t = Xw("commandPalette.groupPages", "页面导航"), n = Xw("commandPalette.groupConversations", "最近对话"), r = [
			{
				value: "action:new-chat",
				label: Xw("commandPalette.actionNewChat", "新建安全测试任务"),
				subtitle: Xw("commandPalette.actionNewChatDesc", "切换到对话工作台并开启新会话"),
				badge: Xw("commandPalette.badgeAction", "操作"),
				searchText: "new chat task pentest 新建 任务 对话 " + Xw("commandPalette.actionNewChat", "新建安全测试任务"),
				icon: Cm,
				run: () => {
					window.switchPage?.("chat"), window.startNewConversation?.();
				}
			},
			{
				value: "action:open-swarm",
				label: Xw("commandPalette.actionOpenSwarm", "打开多代理蜂群看板"),
				subtitle: Xw("commandPalette.actionOpenSwarmDesc", "查看当前或最近一次对话的拓扑与协作轨迹"),
				badge: Xw("commandPalette.badgeSwarm", "Swarm"),
				searchText: "swarm topology agent graph 蜂群 看板 拓扑 " + Xw("commandPalette.actionOpenSwarm", "打开多代理蜂群看板"),
				icon: ym,
				run: () => {
					let e = typeof window.currentConversationId == "string" ? window.currentConversationId.trim() : "";
					e && typeof window.openSwarmDashboard == "function" ? window.openSwarmDashboard(e, "") : window.switchPage?.("agents-swarm");
				}
			},
			{
				value: "action:toggle-theme",
				label: Xw("commandPalette.actionToggleTheme", "切换界面主题"),
				subtitle: Xw("commandPalette.actionToggleThemeDesc", "在浅色 / 暗色 / 跟随系统之间循环切换"),
				badge: Xw("commandPalette.badgeTheme", "主题"),
				searchText: "theme light dark mode 主题 浅色 深色 暗色 " + Xw("commandPalette.actionToggleTheme", "切换界面主题"),
				icon: Um,
				run: () => window.cycleThemePreference?.()
			},
			{
				value: "action:toggle-sidebar",
				label: Xw("commandPalette.actionToggleSidebar", "折叠 / 展开侧边栏"),
				subtitle: Xw("commandPalette.actionToggleSidebarDesc", "调整主工作区可视空间"),
				badge: Xw("commandPalette.badgeLayout", "布局"),
				searchText: "sidebar collapse expand 侧边栏 折叠 " + Xw("commandPalette.actionToggleSidebar", "折叠 / 展开侧边栏"),
				icon: xm,
				run: () => window.toggleSidebar?.()
			}
		], i = Zw.filter((e) => Qw(e.id)).map((e) => {
			let t = Xw(e.i18nKey, e.fallback);
			return {
				value: `page:${e.id}`,
				label: t,
				subtitle: `#${e.id}`,
				badge: Xw("commandPalette.badgePage", "页面"),
				searchText: `${t} #${e.id} ${e.keywords}`,
				icon: e.icon,
				run: () => window.switchPage?.(e.id)
			};
		}), a = o.filter((e) => e && e.id).map((e) => {
			let t = e.title || Xw("chat.unnamedConversation", "未命名对话");
			return {
				value: `conv:${e.id}`,
				label: t,
				subtitle: `${e.agent_mode || "single"} · ${String(e.id).slice(0, 8)}`,
				badge: Xw("commandPalette.badgeConversation", "对话"),
				searchText: `${t} ${e.id} ${e.agent_mode || ""}`,
				icon: _m,
				run: () => {
					typeof window.navigateToConversation == "function" ? window.navigateToConversation(e.id) : (window.switchPage?.("chat"), window.loadConversation?.(e.id));
				}
			};
		}), s = [{
			value: e,
			items: r
		}, {
			value: t,
			items: i
		}];
		return a.length > 0 && s.push({
			value: n,
			items: a
		}), s;
	}, [o, i]), f = (e) => {
		t(!1);
		try {
			e.run();
		} catch (e) {
			console.warn("Command execution failed:", e);
		}
	};
	return /* @__PURE__ */ (0, q.jsx)(jw, {
		onOpenChange: t,
		open: e,
		children: /* @__PURE__ */ (0, q.jsx)(Fw, {
			className: "coss-island z-12060!",
			children: /* @__PURE__ */ (0, q.jsxs)(Iw, {
				filter: (e, t) => {
					let n = String(t || "").trim().toLowerCase();
					if (!n) return !0;
					let r = e;
					return (r.searchText || r.label).toLowerCase().includes(n);
				},
				items: d,
				itemToStringValue: (e) => e.label,
				onValueChange: r,
				value: n,
				children: [
					/* @__PURE__ */ (0, q.jsx)(Lw, { placeholder: Xw("commandPalette.placeholder", "输入页面名称、命令或对话标题…") }),
					/* @__PURE__ */ (0, q.jsxs)(Bw, { children: [/* @__PURE__ */ (0, q.jsx)(zw, { children: Xw("commandPalette.empty", "没有匹配的页面、命令或对话") }), /* @__PURE__ */ (0, q.jsx)(Rw, { children: (e, t) => /* @__PURE__ */ (0, q.jsxs)(p.Fragment, { children: [t > 0 && /* @__PURE__ */ (0, q.jsx)(Gw, {}), /* @__PURE__ */ (0, q.jsxs)(Vw, {
						items: e.items,
						children: [/* @__PURE__ */ (0, q.jsx)(Hw, { children: e.value }), /* @__PURE__ */ (0, q.jsx)(Uw, { children: (e) => {
							let t = e.icon;
							return /* @__PURE__ */ (0, q.jsxs)(Ww, {
								onClick: () => f(e),
								value: e,
								children: [
									/* @__PURE__ */ (0, q.jsxs)("span", {
										className: "flex items-center gap-2.5 min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, q.jsx)(t, { className: "size-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, q.jsxs)("span", {
											className: "flex flex-col min-w-0",
											children: [/* @__PURE__ */ (0, q.jsx)("span", {
												className: "truncate font-medium text-foreground",
												children: e.label
											}), e.subtitle && /* @__PURE__ */ (0, q.jsx)("span", {
												className: "truncate text-xs text-muted-foreground",
												children: e.subtitle
											})]
										})]
									}),
									e.badge && /* @__PURE__ */ (0, q.jsx)(qh, {
										className: "ms-2 shrink-0",
										size: "sm",
										variant: "secondary",
										children: e.badge
									}),
									e.shortcut && /* @__PURE__ */ (0, q.jsx)(Kw, { children: e.shortcut })
								]
							}, e.value);
						} })]
					})] }, e.value) })] }),
					/* @__PURE__ */ (0, q.jsxs)(qw, {
						className: "flex-nowrap whitespace-nowrap",
						children: [/* @__PURE__ */ (0, q.jsxs)("div", {
							className: "flex items-center gap-3 sm:gap-4 shrink-0",
							children: [/* @__PURE__ */ (0, q.jsxs)("div", {
								className: "flex items-center gap-1.5 whitespace-nowrap",
								children: [/* @__PURE__ */ (0, q.jsxs)(Yw, { children: [/* @__PURE__ */ (0, q.jsx)(Jw, { children: /* @__PURE__ */ (0, q.jsx)(Vp, {}) }), /* @__PURE__ */ (0, q.jsx)(Jw, { children: /* @__PURE__ */ (0, q.jsx)(zp, {}) })] }), /* @__PURE__ */ (0, q.jsx)("span", {
									className: "whitespace-nowrap",
									children: Xw("commandPalette.hintNavigate", "选择")
								})]
							}), /* @__PURE__ */ (0, q.jsxs)("div", {
								className: "flex items-center gap-1.5 whitespace-nowrap",
								children: [/* @__PURE__ */ (0, q.jsx)(Jw, { children: /* @__PURE__ */ (0, q.jsx)($p, {}) }), /* @__PURE__ */ (0, q.jsx)("span", {
									className: "whitespace-nowrap",
									children: Xw("commandPalette.hintOpen", "打开")
								})]
							})]
						}), /* @__PURE__ */ (0, q.jsxs)("div", {
							className: "flex items-center gap-1.5 shrink-0",
							children: [/* @__PURE__ */ (0, q.jsx)("span", {
								className: "hidden sm:inline whitespace-nowrap",
								children: Xw("commandPalette.brandFoot", "SI-Lens Workspace")
							}), /* @__PURE__ */ (0, q.jsx)(Jw, { children: "Esc" })]
						})]
					})
				]
			})
		})
	});
}
// src/islands/CossSwarmControlsIsland.tsx
function eT() {
	let e = document.getElementById("swarm-page-root");
	if (!e) return {
		total: 0,
		running: 0,
		completed: 0,
		failed: 0
	};
	let t = e.querySelectorAll(".swarm-agent-card"), n = 0, r = 0, i = 0;
	return t.forEach((e) => {
		let t = (e.getAttribute("data-status") || e.className || "").toLowerCase();
		t.includes("running") || t.includes("active") ? n += 1 : t.includes("completed") || t.includes("done") ? r += 1 : (t.includes("failed") || t.includes("error")) && (i += 1);
	}), {
		total: t.length,
		running: n,
		completed: r,
		failed: i
	};
}
function tT() {
	let [e, t] = (0, p.useState)(eT);
	return (0, p.useEffect)(() => {
		let e = () => t(eT());
		e();
		let n = document.getElementById("swarm-page-root"), r = new MutationObserver(e);
		return n && r.observe(n, {
			childList: !0,
			subtree: !0,
			attributes: !0
		}), window.addEventListener("si-lens-swarm-event", e), window.addEventListener("si-lens-page-changed", e), () => {
			r.disconnect(), window.removeEventListener("si-lens-swarm-event", e), window.removeEventListener("si-lens-page-changed", e);
		};
	}, []), e.total === 0 ? null : /* @__PURE__ */ (0, q.jsxs)(Ad.div, {
		animate: {
			opacity: 1,
			y: 0
		},
		className: "coss-island mb-3 flex flex-wrap items-center gap-2 rounded-xl border bg-card px-3.5 py-2 text-xs text-card-foreground shadow-xs/5",
		initial: {
			opacity: 0,
			y: 4
		},
		transition: {
			duration: .2,
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		children: [
			/* @__PURE__ */ (0, q.jsxs)("span", {
				className: "inline-flex items-center gap-1.5 font-medium text-foreground",
				children: [/* @__PURE__ */ (0, q.jsx)(ym, { className: "size-3.5 text-muted-foreground" }), "Swarm Telemetry"]
			}),
			/* @__PURE__ */ (0, q.jsxs)(qh, {
				size: "sm",
				variant: "secondary",
				children: [e.total, " agents"]
			}),
			e.running > 0 && /* @__PURE__ */ (0, q.jsxs)(qh, {
				size: "sm",
				variant: "info",
				children: [
					/* @__PURE__ */ (0, q.jsx)(Lp, { className: "size-3" }),
					e.running,
					" running"
				]
			}),
			e.completed > 0 && /* @__PURE__ */ (0, q.jsxs)(qh, {
				size: "sm",
				variant: "success",
				children: [
					/* @__PURE__ */ (0, q.jsx)(Yp, { className: "size-3" }),
					e.completed,
					" done"
				]
			}),
			e.failed > 0 && /* @__PURE__ */ (0, q.jsxs)(qh, {
				size: "sm",
				variant: "error",
				children: [
					/* @__PURE__ */ (0, q.jsx)(Zp, { className: "size-3" }),
					e.failed,
					" failed"
				]
			})
		]
	});
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/toast/provider/ToastProviderContext.mjs
var nT = /*#__PURE__*/ p.createContext(void 0);
function rT() {
	let e = p.useContext(nT);
	if (!e) throw Error(_h(73));
	return e;
}
// node_modules/.pnpm/@base-ui+utils@0.4.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/utils/generateId.mjs
var iT = 0;
function aT(e) {
	return iT += 1, `${e}-${Math.random().toString(36).slice(2, 6)}-${iT}`;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/toast/utils/resolvePromiseOptions.mjs
function oT(e, t) {
	if (typeof e == "string") return { description: e };
	if (typeof e == "function") {
		let n = e(t);
		return typeof n == "string" ? { description: n } : n;
	}
	return e;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/toast/store.mjs
function sT(e) {
	let t = /* @__PURE__ */ new Map(), n = 0, r = 0;
	return e.forEach((e, i) => {
		let a = e.transitionStatus === "ending";
		t.set(e.id, {
			value: e,
			domIndex: i,
			visibleIndex: a ? -1 : n,
			offsetY: r
		}), r += e.height || 0, a || (n += 1);
	}), t;
}
function cT(e, t) {
	let n = 0;
	return e.map((e) => {
		if (e.transitionStatus === "ending") return e;
		let r = n >= t;
		return n += 1, e.limited === r ? e : {
			...e,
			limited: r
		};
	});
}
var lT = {
	toasts: (e) => e.toasts,
	isEmpty: (e) => e.toasts.length === 0,
	toast: (e, t) => e.toastMetadata.get(t)?.value,
	toastIndex: (e, t) => e.toastMetadata.get(t)?.domIndex ?? -1,
	toastOffsetY: (e, t) => e.toastMetadata.get(t)?.offsetY ?? 0,
	toastVisibleIndex: (e, t) => e.toastMetadata.get(t)?.visibleIndex ?? -1,
	focused: (e) => e.focused,
	expanded: (e) => e.hovering || e.focused,
	expandedOrOutOfFocus: (e) => e.hovering || e.focused || !e.isWindowFocused,
	prevFocusElement: (e) => e.prevFocusElement
}, uT = class extends eb {
	timers = /* @__PURE__ */ new Map();
	areTimersPaused = !1;
	constructor(e) {
		super({
			...e,
			toastMetadata: sT(e.toasts)
		}, {}, lT);
	}
	setViewport = (e) => {
		this.set("viewport", e);
	};
	syncProviderProps(e, t) {
		let n = this.state.limit !== t;
		if (this.state.timeout === e && !n) return;
		let r = {
			timeout: e,
			limit: t
		};
		if (n) {
			let e = cT(this.state.toasts, t);
			r.toasts = e, r.toastMetadata = sT(e);
		}
		this.update(r);
	}
	disposeEffect = () => () => {
		this.timers.forEach((e) => {
			e.timeout?.clear();
		}), this.timers.clear();
	};
	removeToast(e, t = !1) {
		let n = lT.toastIndex(this.state, e);
		if (n === -1) return;
		let r = this.state.toasts[n];
		t || r?.onRemove?.();
		let i = [...this.state.toasts];
		i.splice(n, 1), this.setToasts(i);
	}
	addToast = (e) => {
		let { timeout: t, limit: n } = this.state, r = e.id || aT("toast");
		if (e.id) {
			let t = lT.toast(this.state, e.id);
			if (t) {
				if (t.transitionStatus === "ending") this.removeToast(e.id, !0);
				else {
					let { id: t, transitionStatus: n, ...r } = e;
					return this.updateToastInternal(e.id, r, !0, !0), e.id;
				}
			}
		}
		let i = {
			...e,
			id: r,
			updateKey: 0,
			transitionStatus: "starting"
		}, a = [i, ...this.state.toasts];
		this.setToasts(cT(a, n));
		let o = i.timeout ?? t;
		return i.type !== "loading" && o > 0 && this.scheduleTimer(r, o, () => this.closeToast(r)), lT.expandedOrOutOfFocus(this.state) && this.pauseTimers(), r;
	};
	updateToast = (e, t) => {
		let n = lT.toast(this.state, e);
		n && n.transitionStatus !== "ending" && this.updateToastInternal(e, typeof t == "function" ? t(n) : t, !1, !0);
	};
	updateToastInternal = (e, t, n = !1, r = !1) => {
		let { timeout: i, toasts: a } = this.state, o = lT.toast(this.state, e);
		if (!o || o.transitionStatus === "ending") return;
		let s = {
			...o,
			...t,
			...r && { updateKey: o.updateKey + 1 }
		};
		this.setToasts(a.map((t) => t.id === e ? s : t));
		let c = s.timeout ?? i, l = o.timeout ?? i, u = Object.hasOwn(t, "timeout"), d = s.transitionStatus !== "ending" && s.type !== "loading" && c > 0, f = this.timers.has(e), p = l !== c, m = o.type === "loading";
		!d && f ? this.clearTimer(e) : d && (!f || p || u || m || n) && (this.clearTimer(e), this.scheduleTimer(e, c, () => this.closeToast(e)), lT.expandedOrOutOfFocus(this.state) && this.pauseTimers());
	};
	closeToast = (e) => {
		let t = e === void 0, { limit: n, toasts: r } = this.state, i;
		if (t) i = r, this.clearTimers();
		else {
			let t = lT.toast(this.state, e);
			if (!t) return;
			i = [t], this.clearTimer(e);
		}
		let a = cT(r.map((n) => t || n.id === e ? {
			...n,
			transitionStatus: "ending",
			height: 0
		} : n), n);
		this.setToasts(a, !a.some((e) => e.transitionStatus !== "ending")), i.forEach((e) => {
			e.transitionStatus !== "ending" && e.onClose?.();
		}), this.handleFocusManagement(e);
	};
	promiseToast = (e, t) => {
		let n = oT(t.loading), r = this.addToast({
			...n,
			type: "loading"
		}), i = e.then((e) => {
			let n = oT(t.success, e);
			return this.updateToast(r, {
				...n,
				type: "success",
				timeout: n.timeout
			}), e;
		}).catch((e) => {
			let n = oT(t.error, e);
			return this.updateToast(r, {
				...n,
				type: "error",
				timeout: n.timeout
			}), Promise.reject(e);
		});
		return {}.hasOwnProperty.call(t, "setPromise") && t.setPromise(i), i;
	};
	pauseTimers() {
		this.areTimersPaused || (this.areTimersPaused = !0, this.timers.forEach((e) => {
			e.timeout && (e.timeout.clear(), e.remaining = Math.max(e.remaining - (Date.now() - e.start), 0));
		}));
	}
	resumeTimers() {
		this.areTimersPaused && (this.areTimersPaused = !1, this.timers.forEach((e, t) => {
			e.remaining = e.remaining > 0 ? e.remaining : e.delay, e.timeout ??= h_.create(), e.timeout.start(e.remaining, () => {
				this.handleTimerFired(t), e.callback();
			}), e.start = Date.now();
		}));
	}
	restoreFocusToPrevElement() {
		this.state.prevFocusElement?.focus({ preventScroll: !0 });
	}
	handleDocumentPointerDown = (e) => {
		if (e.pointerType !== "touch") return;
		let t = z_(e);
		$(this.state.viewport, t) || (this.resumeTimers(), this.update({
			hovering: !1,
			focused: !1
		}));
	};
	scheduleTimer(e, t, n) {
		let r = Date.now(), i = lT.expandedOrOutOfFocus(this.state) ? void 0 : h_.create();
		i?.start(t, () => {
			this.handleTimerFired(e), n();
		}), this.timers.set(e, {
			timeout: i,
			start: r,
			delay: t,
			remaining: t,
			callback: n
		});
	}
	clearTimers() {
		this.timers.forEach((e) => {
			e.timeout?.clear();
		}), this.timers.clear(), this.areTimersPaused = !1;
	}
	clearTimer(e) {
		this.timers.get(e)?.timeout?.clear(), this.timers.delete(e), this.resetPausedStateIfNoTimersRemain();
	}
	handleTimerFired(e) {
		this.timers.delete(e), this.resetPausedStateIfNoTimersRemain();
	}
	resetPausedStateIfNoTimersRemain() {
		this.timers.size === 0 && (this.areTimersPaused = !1);
	}
	setToasts(e, t = e.length === 0) {
		let n = {
			toasts: e,
			toastMetadata: sT(e)
		};
		t && (n.hovering = !1, n.focused = !1), this.update(n);
	}
	handleFocusManagement(e) {
		let t = R_(zg(this.state.viewport));
		if (!this.state.viewport || !$(this.state.viewport, t) || !Z_(t)) return;
		if (e === void 0) {
			this.restoreFocusToPrevElement();
			return;
		}
		let n = lT.toasts(this.state), r = lT.toastIndex(this.state, e), i = (e, t) => {
			for (let r = e; r >= 0 && r < n.length; r += t) if (n[r].transitionStatus !== "ending") return n[r];
			return null;
		}, a = i(r + 1, 1) ?? i(r - 1, -1);
		a ? a.ref?.current?.focus() : this.restoreFocusToPrevElement();
	}
}, dT = function(e) {
	let { children: t, timeout: n = 5e3, limit: r = 3, toastManager: i } = e, a = yh(() => new uT({
		timeout: n,
		limit: r,
		viewport: null,
		toasts: [],
		hovering: !1,
		focused: !1,
		isWindowFocused: !0,
		prevFocusElement: null
	})).current;
	return p_(a.disposeEffect), p.useEffect(function() {
		if (i) return i[" subscribe"](({ action: e, options: t }) => {
			let n = t.id;
			e === "promise" && t.promise ? a.promiseToast(t.promise, t) : e === "update" && n ? a.updateToast(n, t.updates) : e === "close" ? a.closeToast(n) : a.addToast(t);
		});
	}, [a, i]), /*#__PURE__*/ (0, q.jsxs)(nT.Provider, {
		value: a,
		children: [/*#__PURE__*/ (0, q.jsx)(fT, {
			store: a,
			timeout: n,
			limit: r
		}), t]
	});
};
function fT(e) {
	let { store: t, timeout: n, limit: r } = e;
	return Q(() => {
		t.syncProviderProps(n, r);
	}, [
		t,
		n,
		r
	]), null;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/toast/viewport/ToastViewportCssVars.mjs
var pT = "--toast-frontmost-height", mT = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, children: a, ...o } = e, s = rT(), c = g_(), l = p.useRef(!1), u = p.useRef(!1), d = p.useRef(!1), f = s.useState("isEmpty"), m = s.useState("toasts"), h = s.useState("focused"), g = s.useState("expanded"), _ = s.useState("prevFocusElement"), v = m[0]?.height, y = m.some((e) => e.transitionStatus === "ending"), b = m.filter((e) => e.priority === "high");
	p.useEffect(() => {
		let e = s.state.viewport;
		if (!e || f) return;
		let t = vg(e), n = zg(e);
		function r(t) {
			t.key === "F6" && z_(t) !== e && (t.preventDefault(), s.set("prevFocusElement", R_(n)), e?.focus({ preventScroll: !0 }), s.pauseTimers(), s.set("focused", !0));
		}
		function i(e) {
			z_(e) === t && (s.set("isWindowFocused", !1), s.pauseTimers());
		}
		function a(n) {
			if (n.relatedTarget) return;
			let r = z_(n), i = R_(zg(e));
			r !== t && $(e, r) && Z_(i) || s.resumeTimers(), c.start(0, () => s.set("isWindowFocused", !0));
		}
		return ev($_(t, "keydown", r), $_(t, "blur", i, !0), $_(t, "focus", a, !0), $_(n, "pointerdown", s.handleDocumentPointerDown, !0));
	}, [
		s,
		c,
		f
	]);
	function x(e) {
		l.current = !0;
		let t = e.relatedTarget === s.state.viewport ? m.find((e) => e.transitionStatus !== "ending" && !e.limited) : void 0;
		t ? t.ref?.current?.focus() : s.restoreFocusToPrevElement();
	}
	function S(e) {
		e.key === "Tab" && e.shiftKey && z_(e.nativeEvent) === s.state.viewport && (e.preventDefault(), s.restoreFocusToPrevElement());
	}
	function C() {
		s.state.toasts.some((e) => e.transitionStatus === "ending") || d.current || !u.current || (s.state.isWindowFocused && s.resumeTimers(), s.set("hovering", !1), u.current = !1);
	}
	p.useEffect(C, [y, s]);
	function w() {
		s.pauseTimers(), s.set("hovering", !0), u.current = !1;
	}
	function T() {
		s.state.isWindowFocused && s.resumeTimers();
	}
	function E() {
		u.current = !0, C();
	}
	function D(e) {
		e.pointerType === "touch" && (d.current = !0);
	}
	function O(e) {
		e.pointerType === "touch" && (d.current = !1, C());
	}
	function k() {
		l.current ? l.current = !1 : h || Z_(R_(zg(s.state.viewport))) && (s.set("focused", !0), s.pauseTimers());
	}
	function A(e) {
		h && !$(s.state.viewport, e.relatedTarget) && (s.set("focused", !1), T());
	}
	let j = {
		tabIndex: -1,
		role: "region",
		"aria-live": "polite",
		"aria-atomic": !1,
		"aria-relevant": "additions text",
		"aria-label": "Notifications",
		onMouseEnter: w,
		onMouseMove: w,
		onMouseLeave: E,
		onFocus: k,
		onBlur: A,
		onKeyDown: S,
		onClick: k,
		onPointerDown: D,
		onPointerUp: O,
		onPointerCancel: O,
		style: { [pT]: v ? `${v}px` : void 0 }
	}, M = { expanded: g }, N = !f && _ && /*#__PURE__*/ (0, q.jsx)(uv, { onFocus: x }), P = Fh("div", e, {
		ref: [t, s.setViewport],
		state: M,
		props: [
			j,
			o,
			{ children: /*#__PURE__*/ (0, q.jsxs)(p.Fragment, { children: [
				N,
				a,
				N
			] }) }
		]
	});
	return /*#__PURE__*/ (0, q.jsxs)(p.Fragment, { children: [
		N,
		P,
		!h && b.length > 0 && /*#__PURE__*/ (0, q.jsx)("div", {
			style: cv,
			children: b.map((e) => /*#__PURE__*/ (0, q.jsxs)("div", {
				role: "alert",
				"aria-atomic": !0,
				children: [/*#__PURE__*/ (0, q.jsx)("div", { children: e.title }), /*#__PURE__*/ (0, q.jsx)("div", { children: e.description })]
			}, e.id))
		})
	] });
}), hT = /*#__PURE__*/ p.createContext(void 0);
function gT() {
	let e = p.useContext(hT);
	if (!e) throw Error(_h(66));
	return e;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/utils/getElementTransform.mjs
function _T(e, t) {
	let n = (t ?? vg(e).getComputedStyle(e)).transform, r = 0, i = 0, a = 1;
	if (n && n !== "none") {
		let e = n.match(/matrix(?:3d)?\(([^)]+)\)/);
		if (e) {
			let t = e[1].split(", ").map(parseFloat);
			t.length === 6 ? (r = t[4], i = t[5], a = Math.sqrt(t[0] * t[0] + t[1] * t[1])) : t.length === 16 && (r = t[12], i = t[13], a = t[0]);
		}
	}
	return {
		x: r,
		y: i,
		scale: a
	};
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/utils/useSwipeDismiss.mjs
function vT(e, t, n) {
	switch (e) {
		case "up": return -n;
		case "down": return n;
		case "left": return -t;
		case "right": return t;
		default: return 0;
	}
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/toast/root/ToastRootCssVars.mjs
var yT = "--toast-index", bT = "--toast-offset-y", xT = "--toast-height", ST = "--toast-swipe-movement-x", CT = "--toast-swipe-movement-y", wT = "data-swipe-direction", TT = {
	...eg,
	swipeDirection(e) {
		return e ? { [wT]: e } : null;
	}
}, ET = 40, DT = 10, OT = .5, kT = 1, AT = `${cy},${ly}`, jT = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { toast: n, render: r, className: i, swipeDirection: a = ["down", "right"], style: o, ...s } = e, c = n.positionerProps?.anchor !== void 0, l = [];
	c || (l = Array.isArray(a) ? a : [a]);
	let u = l.length > 0, d = rT(), [f, m] = p.useState(void 0), [h, g] = p.useState(!1), [_, v] = p.useState(!1), [y, b] = p.useState({
		x: 0,
		y: 0
	}), [x, S] = p.useState({
		x: 0,
		y: 0,
		scale: 1
	}), [C, w] = p.useState(), [T, E] = p.useState(), [D, O] = p.useState(null), k = p.useRef(null), A = p.useRef(void 0), j = p.useRef({
		x: 0,
		y: 0
	}), M = p.useRef({
		x: 0,
		y: 0,
		scale: 1
	}), N = p.useRef(void 0), P = p.useRef(0), F = p.useRef(!1), I = p.useRef({
		x: 0,
		y: 0
	}), L = p.useRef(!1), R = p.useRef({
		x: 0,
		y: 0
	}), ee = p.useRef(null), te = p.useRef(null), ne = d.useState("toastIndex", n.id), z = d.useState("toastVisibleIndex", n.id), re = d.useState("toastOffsetY", n.id), ie = d.useState("focused"), B = d.useState("expanded");
	cb({
		open: n.transitionStatus !== "ending",
		ref: k,
		onComplete() {
			n.transitionStatus === "ending" && d.removeToast(n.id);
		}
	});
	let ae = Z((e = !1) => {
		let t = k.current;
		if (!t) return;
		let r = t.style.height;
		t.style.height = "auto";
		let i = t.offsetHeight;
		t.style.height = r;
		function a() {
			d.updateToastInternal(n.id, {
				ref: k,
				height: i,
				transitionStatus: void 0
			});
		}
		e ? dy.flushSync(a) : a();
	});
	Q(() => {
		let e = A.current;
		(n.transitionStatus === "starting" || e !== n.id) && (e !== void 0 && (m(void 0), S({
			x: 0,
			y: 0,
			scale: 1
		}), oe({
			x: 0,
			y: 0
		})), A.current = n.id, ae());
	}, [
		ae,
		n.id,
		n.transitionStatus
	]);
	function oe(e) {
		R.current = e, b(e);
	}
	Q(() => () => {
		te.current?.abort();
	}, []);
	function se(e, t) {
		let n = (e) => e > 0 ? e ** OT : -(Math.abs(e) ** OT), r = e > 0 && !l.includes("right") || e < 0 && !l.includes("left"), i = t > 0 && !l.includes("down") || t < 0 && !l.includes("up");
		return {
			x: r ? n(e) : e,
			y: i ? n(t) : t
		};
	}
	let V = Z((e) => {
		if (e.pointerId !== ee.current) return;
		ee.current = null, te.current?.abort(), te.current = null, g(!1), v(!1), O(null);
		let t = M.current;
		if (e.type === "pointercancel" || F.current) {
			oe({
				x: t.x,
				y: t.y
			}), m(void 0);
			return;
		}
		let r = R.current, i = r.x - t.x, a = r.y - t.y, o;
		for (let e of l) if (vT(e, i, a) > ET) {
			o = e;
			break;
		}
		o ? (m(o), d.closeToast(n.id)) : (oe({
			x: t.x,
			y: t.y
		}), m(void 0));
	});
	function H(e) {
		if (e.button !== 0 || (e.pointerType === "touch" && d.pauseTimers(), z_(e.nativeEvent)?.closest(`button,a,input,textarea,[role="button"],${AT}`))) return;
		F.current = !1, N.current = void 0, P.current = 0, ee.current = e.pointerId, j.current = {
			x: e.clientX,
			y: e.clientY
		}, I.current = j.current;
		let t = e.currentTarget, n = _T(t);
		M.current = n, S(n), oe({
			x: n.x,
			y: n.y
		}), d.set("hovering", !0), g(!0), v(!1), O(null), L.current = !0, te.current?.abort();
		let r = new AbortController();
		te.current = r;
		let i = zg(t);
		i.addEventListener("pointerup", V, { signal: r.signal }), i.addEventListener("pointercancel", V, { signal: r.signal }), t.setPointerCapture?.(e.pointerId);
	}
	function ce(e) {
		if (e.pointerId !== ee.current) return;
		e.preventDefault(), L.current &&= (j.current = {
			x: e.clientX,
			y: e.clientY
		}, !1);
		let { clientY: t, clientX: n, movementX: r, movementY: i } = e;
		(i < 0 && t > I.current.y || i > 0 && t < I.current.y) && (I.current = {
			x: I.current.x,
			y: t
		}), (r < 0 && n > I.current.x || r > 0 && n < I.current.x) && (I.current = {
			x: n,
			y: I.current.y
		});
		let a = n - j.current.x, o = t - j.current.y, s = t - I.current.y, c = n - I.current.x, u = D;
		if (!_ && Math.sqrt(a * a + o * o) >= kT) {
			v(!0);
			let e = l.includes("left") || l.includes("right"), t = l.includes("up") || l.includes("down");
			e && t && (u = Math.abs(a) > Math.abs(o) ? "horizontal" : "vertical", O(u));
		}
		let d;
		if (!N.current) u === "vertical" ? o > 0 ? d = "down" : o < 0 && (d = "up") : u === "horizontal" ? a > 0 ? d = "right" : a < 0 && (d = "left") : d = Math.abs(a) >= Math.abs(o) ? a > 0 ? "right" : "left" : o > 0 ? "down" : "up", d && l.includes(d) && (N.current = d, P.current = vT(d, a, o), m(d));
		else {
			let e = N.current, t = vT(e, c, s);
			t > ET ? (F.current = !1, m(e)) : !(l.includes("left") && l.includes("right")) && !(l.includes("up") && l.includes("down")) && P.current - t >= DT && (F.current = !0);
		}
		let f = se(a, o), p = M.current.x, h = M.current.y, g = l.includes("left") || l.includes("right"), y = l.includes("up") || l.includes("down");
		u !== "vertical" && g && (p += f.x), u !== "horizontal" && y && (h += f.y), oe({
			x: p,
			y: h
		});
	}
	function le(e) {
		if (e.key === "Escape") {
			if (!k.current || !$(k.current, R_(zg(k.current)))) return;
			d.closeToast(n.id);
		}
	}
	p.useEffect(() => {
		let e = k.current;
		if (!u || !e) return;
		function t(t) {
			ee.current !== null && $(e, z_(t)) && t.preventDefault();
		}
		return $_(e, "touchmove", t, { passive: !1 });
	}, [u]);
	function ue() {
		let e = y.x - x.x, t = y.y - x.y;
		return {
			transition: h ? "none" : void 0,
			transform: h ? `translateX(${y.x}px) translateY(${y.y}px) scale(${x.scale})` : void 0,
			[ST]: `${e}px`,
			[CT]: `${t}px`
		};
	}
	let de = n.priority === "high", U = {
		role: de ? "alertdialog" : "dialog",
		tabIndex: 0,
		"aria-modal": !1,
		"aria-labelledby": C,
		"aria-describedby": T,
		"aria-hidden": de && !ie ? !0 : void 0,
		onPointerDown: u ? H : void 0,
		onPointerMove: u ? ce : void 0,
		onPointerUp: u ? V : void 0,
		onPointerCancel: u ? V : void 0,
		onKeyDown: le,
		inert: Ub(n.limited),
		style: {
			...ue(),
			[yT]: n.transitionStatus === "ending" ? ne : z,
			[bT]: `${re}px`,
			[xT]: n.height ? `${n.height}px` : void 0
		}
	}, W = p.useMemo(() => ({
		toast: n,
		setTitleId: w,
		setDescriptionId: E,
		recalculateHeight: ae,
		visibleIndex: z,
		expanded: B
	}), [
		n,
		w,
		E,
		ae,
		z,
		B
	]), fe = {
		transitionStatus: n.transitionStatus,
		expanded: B,
		limited: n.limited || !1,
		type: n.type,
		swiping: h,
		swipeDirection: f
	}, pe = Fh("div", e, {
		ref: [t, k],
		state: fe,
		stateAttributesMapping: TT,
		props: [U, s]
	});
	return /*#__PURE__*/ (0, q.jsx)(hT.Provider, {
		value: W,
		children: pe
	});
}), MT = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, ...a } = e, { visibleIndex: o, expanded: s, recalculateHeight: c } = gT(), l = p.useRef(null);
	return Q(() => {
		c();
		let e = l.current;
		if (!e || typeof ResizeObserver != "function" || typeof MutationObserver != "function") return;
		let t = new ResizeObserver(() => c(!0)), n = new MutationObserver(() => c(!0));
		return t.observe(e), n.observe(e, {
			childList: !0,
			subtree: !0,
			characterData: !0
		}), () => {
			t.disconnect(), n.disconnect();
		};
	}, [c]), Fh("div", e, {
		ref: [t, l],
		state: {
			expanded: s,
			behind: o > 0
		},
		props: a
	});
});
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/toast/utils/isRenderableNode.mjs
function NT(e) {
	return e == null || typeof e == "boolean" || e === "" ? !1 : !Array.isArray(e) || e.some(NT);
}
function PT(e) {
	return /*#__PURE__*/ p.isValidElement(e) && NT(e.props.children);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/toast/utils/useToastLabelPart.mjs
function FT(e, t, n) {
	let { toast: r, setTitleId: i, setDescriptionId: a } = gT(), o = n === "title" ? i : a, s = t ?? (n === "title" ? r.title : r.description);
	return {
		id: d_(e),
		children: s,
		type: r.type,
		setId: o
	};
}
function IT(e, t, n) {
	let r = PT(e);
	return Q(() => {
		if (r) return n(t), () => {
			n((e) => e === t ? void 0 : e);
		};
	}, [
		r,
		t,
		n
	]), r ? e : null;
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/toast/description/ToastDescription.mjs
var LT = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, id: a, children: o, ...s } = e, { id: c, children: l, type: u, setId: d } = FT(a, o, "description");
	return IT(Fh("p", e, {
		ref: t,
		state: { type: u },
		props: {
			...s,
			id: c,
			children: l
		}
	}), c, d);
}), RT = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, id: a, children: o, ...s } = e, { id: c, children: l, type: u, setId: d } = FT(a, o, "title");
	return IT(Fh("h2", e, {
		ref: t,
		state: { type: u },
		props: {
			...s,
			id: c,
			children: l
		}
	}), c, d);
}), zT = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, disabled: a, nativeButton: o = !0, ...s } = e, { toast: c } = gT(), l = c.actionProps?.children ?? s.children, { getButtonProps: u, buttonRef: d } = Vg({
		disabled: a,
		native: o
	}), f = { type: c.type }, p = Fh("button", e, {
		ref: [t, d],
		state: f,
		props: [
			s,
			c.actionProps,
			u,
			{ children: l }
		]
	});
	return PT(p) ? p : null;
}), BT = /*#__PURE__*/ p.forwardRef(function(e, t) {
	let { children: n, container: r, className: i, render: a, style: o, ...s } = e, { node: c, subtree: l } = hy({
		container: r,
		ref: t,
		componentProps: e,
		elementProps: s
	});
	return !l && !c ? null : /*#__PURE__*/ (0, q.jsxs)(p.Fragment, { children: [l, c && /*#__PURE__*/ dy.createPortal(n, c)] });
}), VT = /*#__PURE__*/ p.forwardRef(function(e, t) {
	return /*#__PURE__*/ (0, q.jsx)(BT, {
		ref: t,
		...e
	});
});
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/toast/useToastManager.mjs
function HT() {
	let e = rT(), t = e.useState("toasts");
	return p.useMemo(() => ({
		toasts: t,
		add: e.addToast,
		close: e.closeToast,
		update: e.updateToast,
		promise: e.promiseToast
	}), [t, e]);
}
// node_modules/.pnpm/@base-ui+react@1.8.0_@types+react@19.3.0_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/@base-ui/react/toast/createToastManager.mjs
function UT() {
	let e = /* @__PURE__ */ new Set();
	function t(t) {
		e.forEach((e) => e(t));
	}
	return {
		" subscribe": function(t) {
			return e.add(t), () => {
				e.delete(t);
			};
		},
		add(e) {
			let n = e.id || aT("toast");
			return t({
				action: "add",
				options: {
					...e,
					id: n,
					transitionStatus: "starting"
				}
			}), n;
		},
		close(e) {
			t({
				action: "close",
				options: { id: e }
			});
		},
		update(e, n) {
			t({
				action: "update",
				options: {
					id: e,
					updates: n
				}
			});
		},
		promise(e, n) {
			let r = e;
			return t({
				action: "promise",
				options: {
					...n,
					promise: e,
					setPromise(e) {
						r = e;
					}
				}
			}), r;
		}
	};
}
// src/components/ui/button.tsx
var WT = Gh("relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-medium text-base outline-none transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 data-loading:select-none data-loading:text-transparent sm:text-sm [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0", {
	defaultVariants: {
		size: "default",
		variant: "default"
	},
	variants: {
		size: {
			default: "h-9 px-[calc(--spacing(3)-1px)] sm:h-8",
			icon: "size-9 sm:size-8",
			"icon-lg": "size-10 sm:size-9",
			"icon-sm": "size-8 sm:size-7",
			"icon-xl": "size-11 sm:size-10 [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5",
			"icon-xs": "size-7 rounded-md before:rounded-[calc(var(--radius-md)-1px)] sm:size-6 not-in-data-[slot=input-group]:[&_svg:not([class*='size-'])]:size-4 sm:not-in-data-[slot=input-group]:[&_svg:not([class*='size-'])]:size-3.5",
			lg: "h-10 px-[calc(--spacing(3.5)-1px)] sm:h-9",
			sm: "h-8 gap-1.5 px-[calc(--spacing(2.5)-1px)] sm:h-7",
			xl: "h-11 px-[calc(--spacing(4)-1px)] text-lg sm:h-10 sm:text-base [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5",
			xs: "h-7 gap-1 rounded-md px-[calc(--spacing(2)-1px)] text-sm before:rounded-[calc(var(--radius-md)-1px)] sm:h-6 sm:text-xs [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5"
		},
		variant: {
			default: "not-disabled:inset-shadow-[0_1px_--theme(--color-white/16%)] border-primary bg-primary text-primary-foreground shadow-primary/24 shadow-xs hover:bg-primary/90 data-pressed:bg-primary/90 *:data-[slot=button-loading-indicator]:text-primary-foreground [:active,[data-pressed]]:inset-shadow-[0_1px_--theme(--color-black/8%)] [:disabled,:active,[data-pressed]]:shadow-none",
			destructive: "not-disabled:inset-shadow-[0_1px_--theme(--color-white/16%)] border-destructive bg-destructive text-white shadow-destructive/24 shadow-xs hover:bg-destructive/90 data-pressed:bg-destructive/90 *:data-[slot=button-loading-indicator]:text-white [:active,[data-pressed]]:inset-shadow-[0_1px_--theme(--color-black/8%)] [:disabled,:active,[data-pressed]]:shadow-none",
			"destructive-outline": "border-input bg-popover not-dark:bg-clip-padding text-destructive-foreground shadow-xs/5 not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] hover:border-destructive/32 hover:bg-destructive/4 data-pressed:border-destructive/32 data-pressed:bg-destructive/4 *:data-[slot=button-loading-indicator]:text-foreground dark:bg-input/32 dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)] dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [:disabled,:active,[data-pressed]]:shadow-none",
			ghost: "border-transparent text-foreground hover:bg-accent data-pressed:bg-accent *:data-[slot=button-loading-indicator]:text-foreground",
			link: "border-transparent text-foreground underline-offset-4 hover:underline data-pressed:underline *:data-[slot=button-loading-indicator]:text-foreground",
			outline: "border-input bg-popover not-dark:bg-clip-padding text-foreground shadow-xs/5 not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] hover:bg-accent/50 data-pressed:bg-accent/50 *:data-[slot=button-loading-indicator]:text-foreground dark:bg-input/32 dark:data-pressed:bg-input/64 dark:hover:bg-input/64 dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)] dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [:disabled,:active,[data-pressed]]:shadow-none",
			secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 data-pressed:bg-secondary/90 *:data-[slot=button-loading-indicator]:text-secondary-foreground [:active,[data-pressed]]:bg-secondary/80"
		}
	}
}), GT = {
	error: Zp,
	info: lm,
	loading: hm,
	success: Yp,
	warning: qm
};
function KT(e) {
	let t = e.startsWith("top") ? "up" : "down";
	return e.includes("center") ? [t] : e.includes("left") ? ["left", t] : ["right", t];
}
function qT(e) {
	let t = e.updateKey ?? 0;
	if (t <= 0) return;
	let n = t % 2 == 0;
	return e.type === "error" ? n ? "animate-toast-error-even motion-reduce:animate-none" : "animate-toast-error-odd motion-reduce:animate-none" : n ? "animate-toast-success-even motion-reduce:animate-none" : "animate-toast-success-odd motion-reduce:animate-none";
}
function JT({ position: e, portalProps: t }) {
	let { toasts: n } = HT(), r = KT(e);
	return /* @__PURE__ */ (0, q.jsx)(VT, {
		"data-slot": "toast-portal",
		...t,
		children: /* @__PURE__ */ (0, q.jsx)(mT, {
			className: gp("fixed z-60 mx-auto flex w-[calc(100%-var(--toast-inset)*2)] max-w-90 [--toast-inset:--spacing(4)] sm:[--toast-inset:--spacing(8)]", "data-[position*=top]:top-(--toast-inset)", "data-[position*=bottom]:bottom-(--toast-inset)", "data-[position*=left]:left-(--toast-inset)", "data-[position*=right]:right-(--toast-inset)", "data-[position*=center]:left-1/2 data-[position*=center]:-translate-x-1/2"),
			"data-position": e,
			"data-slot": "toast-viewport",
			children: n.map((t) => {
				let n = t.type ? GT[t.type] : null, i = t.data;
				return /* @__PURE__ */ (0, q.jsx)(jT, {
					className: gp("absolute z-[calc(9999-var(--toast-index))] h-(--toast-calc-height) w-full select-none rounded-lg border bg-[color-mix(in_srgb,var(--popover),var(--color-black)_calc(1%*max(0,var(--toast-index,0))))] not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 [transition:transform_.5s_cubic-bezier(.22,1,.36,1),opacity_.5s,height_.15s,background-color_.5s] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] data-expanded:bg-popover dark:bg-[color-mix(in_srgb,var(--popover),var(--color-black)_calc(6%*max(0,var(--toast-index,0))))] dark:data-expanded:bg-popover dark:before:shadow-[0_-1px_--theme(--color-white/6%)]", "data-[position*=right]:right-0 data-[position*=right]:left-auto", "data-[position*=left]:right-auto data-[position*=left]:left-0", "data-[position*=center]:right-0 data-[position*=center]:left-0", "data-[position*=top]:top-0 data-[position*=top]:bottom-auto data-[position*=top]:origin-[50%_calc(50%-50%*min(var(--toast-index,0),1))]", "data-[position*=bottom]:top-auto data-[position*=bottom]:bottom-0 data-[position*=bottom]:origin-[50%_calc(50%+50%*min(var(--toast-index,0),1))]", "after:absolute after:left-0 after:h-[calc(var(--toast-gap)+1px)] after:w-full", "data-[position*=top]:after:top-full", "data-[position*=bottom]:after:bottom-full", "[--toast-calc-height:var(--toast-frontmost-height,var(--toast-height))] [--toast-gap:--spacing(3)] [--toast-peek:--spacing(3)] [--toast-scale:calc(max(0,1-(var(--toast-index)*.1)))] [--toast-shrink:calc(1-var(--toast-scale))]", "data-[position*=top]:[--toast-calc-offset-y:calc(var(--toast-offset-y)+var(--toast-index)*var(--toast-gap)+var(--toast-swipe-movement-y))]", "data-[position*=bottom]:[--toast-calc-offset-y:calc(var(--toast-offset-y)*-1+var(--toast-index)*var(--toast-gap)*-1+var(--toast-swipe-movement-y))]", "data-[position*=top]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--toast-peek))+(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))]", "data-[position*=bottom]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--toast-peek))-(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))]", "data-limited:opacity-0", "data-expanded:h-(--toast-height)", "data-position:data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--toast-calc-offset-y))]", "motion-safe:data-[position*=top]:data-starting-style:transform-[translateY(calc(-100%-var(--toast-inset)))]", "motion-safe:data-[position*=bottom]:data-starting-style:transform-[translateY(calc(100%+var(--toast-inset)))]", "data-ending-style:opacity-0", "motion-reduce:data-starting-style:opacity-0 motion-reduce:[transition:opacity_.5s,height_.15s,background-color_.5s]", "motion-safe:data-[position*=top]:data-ending-style:not-data-limited:not-data-swipe-direction:transform-[translateY(calc(-100%-var(--toast-inset)))]", "motion-safe:data-[position*=bottom]:data-ending-style:not-data-limited:not-data-swipe-direction:transform-[translateY(calc(100%+var(--toast-inset)))]", "data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]", "data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]", "data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))]", "data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]", "data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]", "data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]", "data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))]", "data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]", qT(t)),
					...i?.rootProps,
					"data-position": e,
					swipeDirection: r,
					toast: t,
					children: /* @__PURE__ */ (0, q.jsxs)(MT, {
						className: "pointer-events-auto flex items-center justify-between gap-1.5 overflow-hidden px-3.5 py-3 text-sm transition-opacity duration-250 data-behind:not-data-expanded:pointer-events-none data-behind:opacity-0 data-expanded:opacity-100",
						children: [/* @__PURE__ */ (0, q.jsxs)("div", {
							className: "flex gap-2",
							children: [n && /* @__PURE__ */ (0, q.jsx)("div", {
								className: "[&>svg]:h-lh [&>svg]:w-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
								"data-slot": "toast-icon",
								children: /* @__PURE__ */ (0, q.jsx)(n, { className: "in-data-[type=loading]:animate-spin in-data-[type=error]:text-destructive in-data-[type=info]:text-info in-data-[type=success]:text-success in-data-[type=warning]:text-warning in-data-[type=loading]:opacity-80" })
							}), /* @__PURE__ */ (0, q.jsxs)("div", {
								className: "flex flex-col gap-0.5",
								children: [/* @__PURE__ */ (0, q.jsx)(RT, {
									className: "font-medium",
									"data-slot": "toast-title"
								}), /* @__PURE__ */ (0, q.jsx)(LT, {
									className: "text-muted-foreground",
									"data-slot": "toast-description"
								})]
							})]
						}), t.actionProps && /* @__PURE__ */ (0, q.jsx)(zT, {
							className: WT({ size: "xs" }),
							"data-slot": "toast-action",
							children: t.actionProps.children
						})]
					})
				}, t.id);
			})
		})
	});
}
var YT = UT();
function XT({ children: e, position: t = "bottom-right", portalProps: n, ...r }) {
	return /* @__PURE__ */ (0, q.jsxs)(dT, {
		toastManager: YT,
		...r,
		children: [e, /* @__PURE__ */ (0, q.jsx)(JT, {
			portalProps: n,
			position: t
		})]
	});
}
// src/islands/CossToastIsland.tsx
function ZT(e) {
	switch (String(e || "info").toLowerCase()) {
		case "success":
		case "ok": return "success";
		case "error":
		case "danger":
		case "fail": return "error";
		case "warning":
		case "warn": return "warning";
		case "loading": return "loading";
		default: return "info";
	}
}
function QT() {
	return (0, p.useEffect)(() => {
		let e = (e, t = "info") => {
			let n = String(e ?? "").trim();
			n && YT.add({
				title: n,
				type: ZT(t),
				timeout: t === "error" ? 5e3 : 3200
			});
		};
		window.showCossToast = (t, n = "info") => e(t, n), window.showNotification = e;
		let t = document.getElementById("toast-notification-container");
		t && (t.style.display = "none");
	}, []), /* @__PURE__ */ (0, q.jsx)(XT, { position: "bottom-right" });
}
// src/main.tsx
function $T(e, t) {
	let n = document.getElementById(e);
	n && (0, Id.createRoot)(n).render(/* @__PURE__ */ (0, q.jsx)(p.StrictMode, { children: /* @__PURE__ */ (0, q.jsx)(Su, {
		reducedMotion: "user",
		children: t
	}) }));
}
function eE() {
	$T("sl-coss-cmdk-root", /* @__PURE__ */ (0, q.jsx)($w, {})), $T("sl-coss-toast-root", /* @__PURE__ */ (0, q.jsx)(QT, {})), $T("sl-coss-chat-typing-root", /* @__PURE__ */ (0, q.jsx)(xp, {})), $T("sl-coss-swarm-status-root", /* @__PURE__ */ (0, q.jsx)(tT, {})), document.documentElement.dataset.cossReady = "1";
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", eE) : eE();
