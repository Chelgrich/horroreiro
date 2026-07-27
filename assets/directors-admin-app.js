//#region node_modules/preact/dist/preact.module.js
var e, t, n, r, i, a, o, s, c, l, u, d, f, p, m = {}, h = [], g = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, _ = Array.isArray;
function v(e, t) {
	for (var n in t) e[n] = t[n];
	return e;
}
function y(e) {
	e && e.parentNode && e.parentNode.removeChild(e);
}
function b(t, n, r) {
	var i, a, o, s = {};
	for (o in n) o == "key" ? i = n[o] : o == "ref" ? a = n[o] : s[o] = n[o];
	if (arguments.length > 2 && (s.children = arguments.length > 3 ? e.call(arguments, 2) : r), typeof t == "function" && t.defaultProps != null) for (o in t.defaultProps) s[o] === void 0 && (s[o] = t.defaultProps[o]);
	return x(t, s, i, a, null);
}
function x(e, r, i, a, o) {
	var s = {
		type: e,
		props: r,
		key: i,
		ref: a,
		__k: null,
		__: null,
		__b: 0,
		__e: null,
		__c: null,
		constructor: void 0,
		__v: o ?? ++n,
		__i: -1,
		__u: 0
	};
	return o == null && t.vnode != null && t.vnode(s), s;
}
function S(e) {
	return e.children;
}
function C(e, t) {
	this.props = e, this.context = t;
}
function w(e, t) {
	if (t == null) return e.__ ? w(e.__, e.__i + 1) : null;
	for (var n; t < e.__k.length; t++) if ((n = e.__k[t]) != null && n.__e != null) return n.__e;
	return typeof e.type == "function" ? w(e) : null;
}
function T(e) {
	if (e.__P && e.__d) {
		var n = e.__v, r = n.__e, i = [], a = [], o = v({}, n);
		o.__v = n.__v + 1, t.vnode && t.vnode(o), F(e.__P, o, n, e.__n, e.__P.namespaceURI, 32 & n.__u ? [r] : null, i, r ?? w(n), !!(32 & n.__u), a), o.__v = n.__v, o.__.__k[o.__i] = o, ne(i, o, a), n.__e = n.__ = null, o.__e != r && E(o);
	}
}
function E(e) {
	if ((e = e.__) != null && e.__c != null) return e.__e = e.__c.base = null, e.__k.some(function(t) {
		if (t != null && t.__e != null) return e.__e = e.__c.base = t.__e;
	}), E(e);
}
function D(e) {
	(!e.__d && (e.__d = !0) && r.push(e) && !O.__r++ || i != t.debounceRendering) && ((i = t.debounceRendering) || a)(O);
}
function O() {
	try {
		for (var e, t = 1; r.length;) r.length > t && r.sort(o), e = r.shift(), t = r.length, T(e);
	} finally {
		r.length = O.__r = 0;
	}
}
function ee(e, t, n, r, i, a, o, s, c, l, u) {
	var d, f, p, g, _, v, y, b = r && r.__k || h, x = t.length;
	for (c = k(n, t, b, c, x), d = 0; d < x; d++) (p = n.__k[d]) != null && (f = p.__i != -1 && b[p.__i] || m, p.__i = d, v = F(e, p, f, i, a, o, s, c, l, u), g = p.__e, p.ref && f.ref != p.ref && (f.ref && L(f.ref, null, p), u.push(p.ref, p.__c || g, p)), _ == null && g != null && (_ = g), (y = !!(4 & p.__u)) || f.__k === p.__k ? (c = A(p, c, e, y), y && f.__e && (f.__e = null)) : typeof p.type == "function" && v !== void 0 ? c = v : g && (c = g.nextSibling), p.__u &= -7);
	return n.__e = _, c;
}
function k(e, t, n, r, i) {
	var a, o, s, c, l, u = n.length, d = u, f = 0;
	for (e.__k = Array(i), a = 0; a < i; a++) (o = t[a]) != null && typeof o != "boolean" && typeof o != "function" ? (typeof o == "string" || typeof o == "number" || typeof o == "bigint" || o.constructor == String ? o = e.__k[a] = x(null, o, null, null, null) : _(o) ? o = e.__k[a] = x(S, { children: o }, null, null, null) : o.constructor === void 0 && o.__b > 0 ? o = e.__k[a] = x(o.type, o.props, o.key, o.ref ? o.ref : null, o.__v) : e.__k[a] = o, c = a + f, o.__ = e, o.__b = e.__b + 1, s = null, (l = o.__i = j(o, n, c, d)) != -1 && (d--, (s = n[l]) && (s.__u |= 2)), s == null || s.__v == null ? (l == -1 && (i > u ? f-- : i < u && f++), typeof o.type != "function" && (o.__u |= 4)) : l != c && (l == c - 1 ? f-- : l == c + 1 ? f++ : (l > c ? f-- : f++, o.__u |= 4))) : e.__k[a] = null;
	if (d) for (a = 0; a < u; a++) (s = n[a]) != null && !(2 & s.__u) && (s.__e == r && (r = w(s)), ie(s, s));
	return r;
}
function A(e, t, n, r) {
	var i, a;
	if (typeof e.type == "function") {
		for (i = e.__k, a = 0; i && a < i.length; a++) i[a] && (i[a].__ = e, t = A(i[a], t, n, r));
		return t;
	}
	e.__e != t && (r && (t && e.type && !t.parentNode && (t = w(e)), n.insertBefore(e.__e, t || null)), t = e.__e);
	do
		t &&= t.nextSibling;
	while (t != null && t.nodeType == 8);
	return t;
}
function j(e, t, n, r) {
	var i, a, o, s = e.key, c = e.type, l = t[n], u = l != null && (2 & l.__u) == 0;
	if (l === null && s == null || u && s == l.key && c == l.type) return n;
	if (r > +!!u) {
		for (i = n - 1, a = n + 1; i >= 0 || a < t.length;) if ((l = t[o = i >= 0 ? i-- : a++]) != null && !(2 & l.__u) && s == l.key && c == l.type) return o;
	}
	return -1;
}
function M(e, t, n) {
	t[0] == "-" ? e.setProperty(t, n ?? "") : e[t] = n == null ? "" : typeof n != "number" || g.test(t) ? n : n + "px";
}
function N(e, t, n, r, i) {
	var a, o;
	n: if (t == "style") if (typeof n == "string") e.style.cssText = n;
	else {
		if (typeof r == "string" && (e.style.cssText = r = ""), r) for (t in r) n && t in n || M(e.style, t, "");
		if (n) for (t in n) r && n[t] == r[t] || M(e.style, t, n[t]);
	}
	else if (t[0] == "o" && t[1] == "n") a = t != (t = t.replace(u, "$1")), o = t.toLowerCase(), t = o in e || t == "onFocusOut" || t == "onFocusIn" ? o.slice(2) : t.slice(2), e.l ||= {}, e.l[t + a] = n, n ? r ? n[l] = r[l] : (n[l] = d, e.addEventListener(t, a ? p : f, a)) : e.removeEventListener(t, a ? p : f, a);
	else {
		if (i == "http://www.w3.org/2000/svg") t = t.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
		else if (t != "width" && t != "height" && t != "href" && t != "list" && t != "form" && t != "tabIndex" && t != "download" && t != "rowSpan" && t != "colSpan" && t != "role" && t != "popover" && t in e) try {
			e[t] = n ?? "";
			break n;
		} catch {}
		typeof n == "function" || (n == null || !1 === n && t[4] != "-" ? e.removeAttribute(t) : e.setAttribute(t, t == "popover" && n == 1 ? "" : n));
	}
}
function P(e) {
	return function(n) {
		if (this.l) {
			var r = this.l[n.type + e];
			if (n[c] == null) n[c] = d++;
			else if (n[c] < r[l]) return;
			return r(t.event ? t.event(n) : n);
		}
	};
}
function F(e, n, r, i, a, o, s, c, l, u) {
	var d, f, p, m, g, b, x, w, T, E, D, O, k, A, j, M, N = n.type;
	if (n.constructor !== void 0) return null;
	128 & r.__u && (l = !!(32 & r.__u), o = [c = n.__e = r.__e]), (d = t.__b) && d(n);
	n: if (typeof N == "function") {
		f = s.length;
		try {
			if (T = n.props, E = N.prototype && N.prototype.render, D = (d = N.contextType) && i[d.__c], O = d ? D ? D.props.value : d.__ : i, r.__c ? w = (p = n.__c = r.__c).__ = p.__E : (E ? n.__c = p = new N(T, O) : (n.__c = p = new C(T, O), p.constructor = N, p.render = ae), D && D.sub(p), p.state ||= {}, p.__n = i, m = p.__d = !0, p.__h = [], p._sb = []), E && p.__s == null && (p.__s = p.state), E && N.getDerivedStateFromProps != null && (p.__s == p.state && (p.__s = v({}, p.__s)), v(p.__s, N.getDerivedStateFromProps(T, p.__s))), g = p.props, b = p.state, p.__v = n, m) E && N.getDerivedStateFromProps == null && p.componentWillMount != null && p.componentWillMount(), E && p.componentDidMount != null && p.__h.push(p.componentDidMount);
			else {
				if (E && N.getDerivedStateFromProps == null && T !== g && p.componentWillReceiveProps != null && p.componentWillReceiveProps(T, O), n.__v == r.__v || !p.__e && p.shouldComponentUpdate != null && !1 === p.shouldComponentUpdate(T, p.__s, O)) {
					n.__v != r.__v && (p.props = T, p.state = p.__s, p.__d = !1), n.__e = r.__e, n.__k = r.__k, n.__k.some(function(e) {
						e && (e.__ = n);
					}), h.push.apply(p.__h, p._sb), p._sb = [], p.__h.length && s.push(p);
					break n;
				}
				p.componentWillUpdate != null && p.componentWillUpdate(T, p.__s, O), E && p.componentDidUpdate != null && p.__h.push(function() {
					p.componentDidUpdate(g, b, x);
				});
			}
			if (p.context = O, p.props = T, p.__P = e, p.__e = !1, k = t.__r, A = 0, E) p.state = p.__s, p.__d = !1, k && k(n), d = p.render(p.props, p.state, p.context), h.push.apply(p.__h, p._sb), p._sb = [];
			else do
				p.__d = !1, k && k(n), d = p.render(p.props, p.state, p.context), p.state = p.__s;
			while (p.__d && ++A < 25);
			p.state = p.__s, p.getChildContext != null && (i = v(v({}, i), p.getChildContext())), E && !m && p.getSnapshotBeforeUpdate != null && (x = p.getSnapshotBeforeUpdate(g, b)), j = d != null && d.type === S && d.key == null ? I(d.props.children) : d, c = ee(e, _(j) ? j : [j], n, r, i, a, o, s, c, l, u), p.base = n.__e, n.__u &= -161, p.__h.length && s.push(p), w && (p.__E = p.__ = null);
		} catch (e) {
			if (s.length = f, n.__v = null, l || o != null) {
				if (e.then) {
					for (n.__u |= l ? 160 : 128; c && c.nodeType == 8 && c.nextSibling;) c = c.nextSibling;
					o != null && (o[o.indexOf(c)] = null), n.__e = c;
				} else if (o != null) for (M = o.length; M--;) y(o[M]);
			} else n.__e = r.__e;
			n.__k ??= r.__k || [], e.then || te(n), t.__e(e, n, r);
		}
	} else o == null && n.__v == r.__v ? (n.__k = r.__k, n.__e = r.__e) : c = n.__e = re(r.__e, n, r, i, a, o, s, l, u);
	return (d = t.diffed) && d(n), 128 & n.__u ? void 0 : c;
}
function te(e) {
	e && (e.__c && (e.__c.__e = !0), e.__k && e.__k.some(te));
}
function ne(e, n, r) {
	for (var i = 0; i < r.length; i++) L(r[i], r[++i], r[++i]);
	t.__c && t.__c(n, e), e.some(function(n) {
		try {
			e = n.__h, n.__h = [], e.some(function(e) {
				e.call(n);
			});
		} catch (e) {
			t.__e(e, n.__v);
		}
	});
}
function I(e) {
	return typeof e != "object" || !e || e.__b > 0 ? e : _(e) ? e.map(I) : e.constructor === void 0 ? v({}, e) : null;
}
function re(n, r, i, a, o, s, c, l, u) {
	var d, f, p, h, g, v, b, x = i.props || m, S = r.props, C = r.type;
	if (C == "svg" ? o = "http://www.w3.org/2000/svg" : C == "math" ? o = "http://www.w3.org/1998/Math/MathML" : o ||= "http://www.w3.org/1999/xhtml", s != null) {
		for (d = 0; d < s.length; d++) if ((g = s[d]) && "setAttribute" in g == !!C && (C ? g.localName == C : g.nodeType == 3)) {
			n = g, s[d] = null;
			break;
		}
	}
	if (n == null) {
		if (C == null) return document.createTextNode(S);
		n = document.createElementNS(o, C, S.is && S), l &&= (t.__m && t.__m(r, s), !1), s = null;
	}
	if (C == null) x === S || l && n.data == S || (n.data = S);
	else {
		if (s = C == "textarea" && S.defaultValue != null ? null : s && e.call(n.childNodes), !l && s != null) for (x = {}, d = 0; d < n.attributes.length; d++) x[(g = n.attributes[d]).name] = g.value;
		for (d in x) g = x[d], d == "dangerouslySetInnerHTML" ? p = g : d == "children" || d in S || d == "value" && "defaultValue" in S || d == "checked" && "defaultChecked" in S || N(n, d, null, g, o);
		for (d in S) g = S[d], d == "children" ? h = g : d == "dangerouslySetInnerHTML" ? f = g : d == "value" ? v = g : d == "checked" ? b = g : l && typeof g != "function" || x[d] === g || N(n, d, g, x[d], o);
		if (f) l || p && (f.__html == p.__html || f.__html == n.innerHTML) || (n.innerHTML = f.__html), r.__k = [];
		else if (p && (n.innerHTML = ""), ee(r.type == "template" ? n.content : n, _(h) ? h : [h], r, i, a, C == "foreignObject" ? "http://www.w3.org/1999/xhtml" : o, s, c, s ? s[0] : i.__k && w(i, 0), l, u), s != null) for (d = s.length; d--;) y(s[d]);
		l && C != "textarea" || (d = "value", C == "progress" && v == null ? n.removeAttribute("value") : v != null && (v !== n[d] || C == "progress" && !v || C == "option" && v != x[d]) && N(n, d, v, x[d], o), d = "checked", b != null && b != n[d] && N(n, d, b, x[d], o));
	}
	return n;
}
function L(e, n, r) {
	try {
		if (typeof e == "function") {
			var i = typeof e.__u == "function";
			i && e.__u(), i && n == null || (e.__u = e(n));
		} else e.current = n;
	} catch (e) {
		t.__e(e, r);
	}
}
function ie(e, n, r) {
	var i, a;
	if (t.unmount && t.unmount(e), (i = e.ref) && (i.current && i.current != e.__e || L(i, null, n)), (i = e.__c) != null) {
		if (i.componentWillUnmount) try {
			i.componentWillUnmount();
		} catch (e) {
			t.__e(e, n);
		}
		i.base = i.__P = i.__n = null;
	}
	if (i = e.__k) for (a = 0; a < i.length; a++) i[a] && ie(i[a], n, r || typeof e.type != "function");
	r || y(e.__e), e.__c = e.__ = e.__e = void 0;
}
function ae(e, t, n) {
	return this.constructor(e, n);
}
function oe(n, r, i) {
	var a, o, s, c;
	r == document && (r = document.documentElement), t.__ && t.__(n, r), o = (a = typeof i == "function") ? null : i && i.__k || r.__k, s = [], c = [], F(r, n = (!a && i || r).__k = b(S, null, [n]), o || m, m, r.namespaceURI, !a && i ? [i] : o ? null : r.firstChild ? e.call(r.childNodes) : null, s, !a && i ? i : o ? o.__e : r.firstChild, a, c), ne(s, n, c), n.props.children = null;
}
e = h.slice, t = { __e: function(e, t, n, r) {
	for (var i, a, o; t = t.__;) if ((i = t.__c) && !i.__) try {
		if ((a = i.constructor) && a.getDerivedStateFromError != null && (i.setState(a.getDerivedStateFromError(e)), o = i.__d), i.componentDidCatch != null && (i.componentDidCatch(e, r || {}), o = i.__d), o) return i.__E = i;
	} catch (t) {
		e = t;
	}
	throw e;
} }, n = 0, C.prototype.setState = function(e, t) {
	var n = this.__s != null && this.__s != this.state ? this.__s : this.__s = v({}, this.state);
	typeof e == "function" && (e = e(v({}, n), this.props)), e && v(n, e), e != null && this.__v && (t && this._sb.push(t), D(this));
}, C.prototype.forceUpdate = function(e) {
	this.__v && (this.__e = !0, e && this.__h.push(e), D(this));
}, C.prototype.render = S, r = [], a = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, o = function(e, t) {
	return e.__v.__b - t.__v.__b;
}, O.__r = 0, s = Math.random().toString(8), c = "__d" + s, l = "__a" + s, u = /(PointerCapture)$|Capture$/i, d = 0, f = P(!1), p = P(!0);
//#endregion
//#region node_modules/preact/hooks/dist/hooks.module.js
var R, z, B, se, V = 0, H = [], U = t, W = U.__b, G = U.__r, K = U.diffed, q = U.__c, ce = U.unmount, le = U.__;
function ue(e, t) {
	U.__h && U.__h(z, e, V || t), V = 0;
	var n = z.__H ||= {
		__: [],
		__h: []
	};
	return e >= n.__.length && n.__.push({}), n.__[e];
}
function de(e) {
	return V = 1, fe(_e, e);
}
function fe(e, t, n) {
	var r = ue(R++, 2);
	if (r.t = e, !r.__c && (r.__ = [n ? n(t) : _e(void 0, t), function(e) {
		var t = r.__N ? r.__N[0] : r.__[0], n = r.t(t, e);
		t !== n && (r.__N = [n, r.__[1]], r.__c.setState({}));
	}], r.__c = z, !z.__f)) {
		var i = function(e, t, n) {
			if (!r.__c.__H) return !0;
			var i = !1, o = r.__c.props !== e;
			if (r.__c.__H.__.some(function(e) {
				if (e.__N) {
					i = !0;
					var t = e.__[0];
					e.__ = e.__N, e.__N = void 0, t !== e.__[0] && (o = !0);
				}
			}), a) {
				var s = a.call(this, e, t, n);
				return i ? s || o : s;
			}
			return !i || o;
		};
		z.__f = !0;
		var a = z.shouldComponentUpdate, o = z.componentWillUpdate;
		z.componentWillUpdate = function(e, t, n) {
			if (this.__e) {
				var r = a;
				a = void 0, i(e, t, n), a = r;
			}
			o && o.call(this, e, t, n);
		}, z.shouldComponentUpdate = i;
	}
	return r.__N || r.__;
}
function J(e, t) {
	var n = ue(R++, 7);
	return ge(n.__H, t) && (n.__ = e(), n.__H = t, n.__h = e), n.__;
}
function pe() {
	for (var e; e = H.shift();) {
		var t = e.__H;
		if (e.__P && t) try {
			t.__h.some(Y), t.__h.some(X), t.__h = [];
		} catch (n) {
			t.__h = [], U.__e(n, e.__v);
		}
	}
}
U.__b = function(e) {
	z = null, W && W(e);
}, U.__ = function(e, t) {
	e && t.__k && t.__k.__m && (e.__m = t.__k.__m), le && le(e, t);
}, U.__r = function(e) {
	G && G(e), R = 0;
	var t = (z = e.__c).__H;
	t && (B === z ? (t.__h = [], z.__h = [], t.__.some(function(e) {
		e.__N && (e.__ = e.__N), e.u = e.__N = void 0;
	})) : (t.__h.some(Y), t.__h.some(X), t.__h = [], R = 0)), B = z;
}, U.diffed = function(e) {
	K && K(e);
	var t = e.__c;
	t && t.__H && (t.__H.__h.length && (H.push(t) !== 1 && se === U.requestAnimationFrame || ((se = U.requestAnimationFrame) || he)(pe)), t.__H.__.some(function(e) {
		e.u &&= (e.__H = e.u, void 0);
	})), B = z = null;
}, U.__c = function(e, t) {
	t.some(function(e) {
		try {
			e.__h.some(Y), e.__h = e.__h.filter(function(e) {
				return !e.__ || X(e);
			});
		} catch (n) {
			t.some(function(e) {
				e.__h &&= [];
			}), t = [], U.__e(n, e.__v);
		}
	}), q && q(e, t);
}, U.unmount = function(e) {
	ce && ce(e);
	var t, n = e.__c;
	n && n.__H && (n.__H.__.some(function(e) {
		try {
			Y(e);
		} catch (e) {
			t = e;
		}
	}), n.__H = void 0, t && U.__e(t, n.__v));
};
var me = typeof requestAnimationFrame == "function";
function he(e) {
	var t, n = function() {
		clearTimeout(r), me && cancelAnimationFrame(t), setTimeout(e);
	}, r = setTimeout(n, 35);
	me && (t = requestAnimationFrame(n));
}
function Y(e) {
	var t = z, n = e.__c;
	typeof n == "function" && (e.__c = void 0, n()), z = t;
}
function X(e) {
	var t = z;
	e.__c = e.__(), z = t;
}
function ge(e, t) {
	return !e || e.length !== t.length || t.some(function(t, n) {
		return t !== e[n];
	});
}
function _e(e, t) {
	return typeof t == "function" ? t(e) : t;
}
//#endregion
//#region node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var ve = 0;
Array.isArray;
function Z(e, n, r, i, a, o) {
	n ||= {};
	var s, c, l = n;
	if ("ref" in l) for (c in l = {}, n) c == "ref" ? s = n[c] : l[c] = n[c];
	var u = {
		type: e,
		props: l,
		key: r,
		ref: s,
		__k: null,
		__: null,
		__b: 0,
		__e: null,
		__c: null,
		constructor: void 0,
		__v: --ve,
		__i: -1,
		__u: 0,
		__source: a,
		__self: o
	};
	if (typeof e == "function" && (s = e.defaultProps)) for (c in s) l[c] === void 0 && (l[c] = s[c]);
	return t.vnode && t.vnode(u), u;
}
//#endregion
//#region src/directors-admin-app.jsx
var ye = Object.freeze({
	missingBirthDate: !1,
	missingBirthPlace: !1
}), be = "people", xe = `/storage/v1/object/public/${be}/`, Se = `/storage/v1/render/image/public/${be}/`, Q = Object.freeze({
	widths: [
		96,
		144,
		192
	],
	quality: 90,
	sizes: "48px"
});
function Ce(e) {
	return String(e || "").toLocaleLowerCase("ru-RU").trim().replace(/\s+/g, " ");
}
function we(e) {
	return !!String(e?.birth_date || "").trim();
}
function Te(e) {
	return !!String(e?.birth_place || "").trim();
}
function Ee(e = []) {
	return (Array.isArray(e) ? e : []).reduce((e, t) => {
		let n = String(t?.person_id || "").trim();
		return n && e.set(n, (e.get(n) || 0) + 1), e;
	}, /* @__PURE__ */ new Map());
}
function De(e = []) {
	let t = /* @__PURE__ */ new Map();
	return e.forEach((e) => {
		let n = Ce(e?.name_ru);
		n && t.set(n, (t.get(n) || 0) + 1);
	}), new Set(Array.from(t.entries()).filter(([, e]) => e > 1).map(([e]) => e));
}
function Oe(e = []) {
	return (Array.isArray(e) ? e : []).reduce((e, t) => (we(t) || (e.missingBirthDate += 1), Te(t) || (e.missingBirthPlace += 1), e), {
		missingBirthDate: 0,
		missingBirthPlace: 0
	});
}
function ke(e, t) {
	let n = Array.isArray(e) ? e : [], r = !!t.missingBirthDate, i = !!t.missingBirthPlace;
	return !r && !i ? n : n.filter((e) => (!r || !we(e)) && (!i || !Te(e)));
}
function Ae(e) {
	return !!(e.missingBirthDate || e.missingBirthPlace);
}
function je(e) {
	let t = Math.abs(Number(e) || 0), n = t % 100, r = t % 10;
	return n >= 11 && n <= 14 ? "фильмов" : r === 1 ? "фильм" : r >= 2 && r <= 4 ? "фильма" : "фильмов";
}
function Me(e) {
	let t = Math.abs(Number(e) || 0), n = t % 100, r = t % 10;
	return n >= 11 && n <= 14 ? "режиссёров" : r === 1 ? "режиссёр" : r >= 2 && r <= 4 ? "режиссёра" : "режиссёров";
}
function Ne({ filterKey: e, label: t, count: n, active: r, onToggle: i }) {
	return /* @__PURE__ */ Z("button", {
		type: "button",
		className: `directors-admin-filter-chip${r ? " is-active" : ""}`,
		"aria-pressed": r ? "true" : "false",
		onClick: () => i(e),
		children: [/* @__PURE__ */ Z("span", { children: t }), /* @__PURE__ */ Z("span", {
			className: "directors-admin-filter-chip-count",
			children: n
		})]
	});
}
function Pe({ directors: e, filters: t, onToggle: n, onReset: r }) {
	let i = J(() => Oe(e), [e]);
	return /* @__PURE__ */ Z("div", {
		className: "directors-admin-page-filters",
		"aria-label": "Фильтры заполненности",
		children: [
			/* @__PURE__ */ Z("span", {
				className: "directors-admin-page-filters-label",
				children: "Показать:"
			}),
			/* @__PURE__ */ Z(Ne, {
				filterKey: "missingBirthDate",
				label: "Без даты рождения",
				count: i.missingBirthDate,
				active: t.missingBirthDate,
				onToggle: n
			}),
			/* @__PURE__ */ Z(Ne, {
				filterKey: "missingBirthPlace",
				label: "Без места рождения",
				count: i.missingBirthPlace,
				active: t.missingBirthPlace,
				onToggle: n
			}),
			Ae(t) ? /* @__PURE__ */ Z("button", {
				type: "button",
				className: "directors-admin-filter-reset",
				onClick: r,
				children: "Сбросить"
			}) : null
		]
	});
}
function Fe(e) {
	let t = e.currentTarget, n = t?.dataset?.posterFallbackSrc;
	!t || !n || t.dataset.posterFallbackApplied === "true" || (t.dataset.posterFallbackApplied = "true", t.removeAttribute("srcset"), t.removeAttribute("sizes"), t.src = n);
}
function Ie(e) {
	let t = null;
	try {
		t = new URL(String(e || ""));
	} catch {
		return "";
	}
	let n = decodeURIComponent(t.pathname || ""), r = n.includes(xe) ? xe : Se, i = n.indexOf(r);
	return i >= 0 ? n.slice(i + r.length).replace(/^\/+/, "") : "";
}
function Le(e, t) {
	let n = Ie(e);
	if (!n || !t) return "";
	let r = null;
	try {
		r = new URL(e);
	} catch {
		return "";
	}
	let i = new URL(`${r.origin}${Se}${n}`);
	return i.searchParams.set("width", String(t)), i.searchParams.set("resize", "contain"), i.searchParams.set("quality", String(Q.quality)), i.toString();
}
function Re(e) {
	let t = String(e || "").trim();
	if (!t) return null;
	let n = Q.widths.map((e) => ({
		width: e,
		url: Le(t, e)
	})).filter((e) => e.url);
	return n.length === 0 ? {
		src: t,
		srcset: "",
		sizes: "",
		fallbackSrc: t
	} : {
		src: n[0].url,
		srcset: n.map((e) => `${e.url} ${e.width}w`).join(", "),
		sizes: Q.sizes,
		fallbackSrc: t
	};
}
function ze({ director: e, displayName: t, getPlaceholderSvgHtml: n }) {
	if (e.photo_url) {
		let t = Re(e.photo_url);
		return /* @__PURE__ */ Z("img", {
			src: t?.src || e.photo_url,
			srcSet: t?.srcset || void 0,
			sizes: t?.sizes || void 0,
			"data-poster-fallback-src": t?.fallbackSrc || void 0,
			alt: "",
			loading: "lazy",
			decoding: "async",
			onError: Fe
		});
	}
	return /* @__PURE__ */ Z("span", {
		className: "directors-admin-card-avatar-placeholder",
		"aria-hidden": "true",
		dangerouslySetInnerHTML: { __html: n(e, "directors-admin-card-avatar-placeholder-icon", t) }
	});
}
function Be({ director: e, movieCount: t, isDuplicateName: n, actions: r, utils: i }) {
	let a = i.getDirectorDisplayName(e), o = i.getDirectorSecondaryName(e), s = i.getDirectorLifeLabel(e), c = !!String(e?.tmdb_url || "").trim();
	return /* @__PURE__ */ Z("article", {
		className: `directors-admin-card${c ? "" : " is-missing-tmdb"}`,
		children: [/* @__PURE__ */ Z("a", {
			className: "directors-admin-card-main",
			href: i.buildDirectorPageUrl(e),
			children: [/* @__PURE__ */ Z("div", {
				className: "directors-admin-card-avatar",
				children: /* @__PURE__ */ Z(ze, {
					director: e,
					displayName: a,
					getPlaceholderSvgHtml: i.getDirectorPlaceholderSvgHtml
				})
			}), /* @__PURE__ */ Z("div", {
				className: "directors-admin-card-body",
				children: [
					/* @__PURE__ */ Z("div", {
						className: "directors-admin-card-name",
						children: a
					}),
					o ? /* @__PURE__ */ Z("div", {
						className: "directors-admin-card-original",
						children: o
					}) : null,
					s ? /* @__PURE__ */ Z("div", {
						className: "directors-admin-card-meta",
						children: s
					}) : null,
					/* @__PURE__ */ Z("div", {
						className: "directors-admin-card-meta",
						children: [
							t,
							" ",
							je(t)
						]
					})
				]
			})]
		}), /* @__PURE__ */ Z("div", {
			className: "directors-admin-card-actions",
			children: [
				n ? /* @__PURE__ */ Z("span", {
					className: "directors-admin-duplicate-badge",
					title: "Есть режиссёры с таким же именем",
					children: "Тёзка"
				}) : null,
				c ? null : /* @__PURE__ */ Z("span", {
					className: "directors-admin-missing-tmdb-badge",
					title: "Не заполнена ссылка TMDB",
					children: "Нет TMDB"
				}),
				/* @__PURE__ */ Z("button", {
					type: "button",
					className: "secondary-button secondary-button-compact",
					onClick: () => r.edit(e.id),
					children: "Редактировать"
				})
			]
		})]
	});
}
function $({ children: e, large: t = !1 }) {
	return /* @__PURE__ */ Z("div", {
		className: `directors-admin-page-empty-state${t ? " directors-admin-page-empty-state-large" : ""}`,
		children: e
	});
}
function Ve({ directors: e, movieDirectorRows: t, actions: n, utils: r }) {
	let [i, a] = de(ye), o = Array.isArray(e) ? e : [], s = J(() => ke(o, i), [o, i]), c = J(() => Ee(t), [t]), l = J(() => De(o), [o]);
	return /* @__PURE__ */ Z(S, { children: [
		/* @__PURE__ */ Z("section", {
			className: "directors-admin-page-toolbar",
			children: [/* @__PURE__ */ Z("div", { children: [/* @__PURE__ */ Z("p", {
				className: "directors-admin-page-kicker",
				children: Ae(i) ? `${s.length} из ${o.length} ${Me(o.length)}` : `${o.length} ${Me(o.length)}`
			}), /* @__PURE__ */ Z("p", {
				className: "directors-admin-page-note",
				children: "Технический список для быстрого редактирования страниц режиссёров."
			})] }), /* @__PURE__ */ Z("button", {
				type: "button",
				className: "secondary-button",
				onClick: n.create,
				children: "Добавить режиссёра"
			})]
		}),
		o.length ? /* @__PURE__ */ Z(Pe, {
			directors: o,
			filters: i,
			onToggle: (e) => {
				a((t) => ({
					...t,
					[e]: !t[e]
				}));
			},
			onReset: () => a(ye)
		}) : null,
		s.length ? /* @__PURE__ */ Z("div", {
			className: "directors-admin-grid",
			children: s.map((e) => /* @__PURE__ */ Z(Be, {
				director: e,
				movieCount: c.get(String(e.id)) || 0,
				isDuplicateName: l.has(Ce(e?.name_ru)),
				actions: n,
				utils: r
			}, e.id))
		}) : /* @__PURE__ */ Z($, { children: o.length ? "По выбранным фильтрам режиссёров нет." : "Режиссёры пока не созданы." })
	] });
}
function He(e) {
	let { status: t = "loading", directors: n = [], movieDirectorRows: r = [], actions: i = {}, utils: a = {} } = e, o = {
		login: i.login || (() => {}),
		refresh: i.refresh || (() => {}),
		create: i.create || (() => {}),
		edit: i.edit || (() => {})
	}, s = {
		buildDirectorPageUrl: a.buildDirectorPageUrl || (() => "#"),
		getDirectorDisplayName: a.getDirectorDisplayName || ((e) => e?.name_ru || e?.name || "Без имени"),
		getDirectorSecondaryName: a.getDirectorSecondaryName || ((e) => e?.name || ""),
		getDirectorLifeLabel: a.getDirectorLifeLabel || (() => ""),
		getDirectorPlaceholderSvgHtml: a.getDirectorPlaceholderSvgHtml || (() => "")
	};
	return t === "loading" ? /* @__PURE__ */ Z("div", {
		className: "directors-admin-page-loading-state",
		children: "Загрузка режиссёров..."
	}) : t === "auth" ? /* @__PURE__ */ Z($, {
		large: !0,
		children: [/* @__PURE__ */ Z("p", { children: "Войди под администратором, чтобы открыть список режиссёров." }), /* @__PURE__ */ Z("button", {
			type: "button",
			className: "secondary-button directors-admin-page-login-button",
			onClick: o.login,
			children: "Войти"
		})]
	}) : t === "forbidden" ? /* @__PURE__ */ Z($, {
		large: !0,
		children: /* @__PURE__ */ Z("p", { children: "Список режиссёров доступен только администратору." })
	}) : t === "unavailable" ? /* @__PURE__ */ Z($, {
		large: !0,
		children: /* @__PURE__ */ Z("p", { children: "Таблицы персон пока недоступны: серверный контур персон не подключён." })
	}) : t === "error" ? /* @__PURE__ */ Z($, {
		large: !0,
		children: [/* @__PURE__ */ Z("p", { children: "Не удалось загрузить режиссёров. Попробуй обновить страницу." }), /* @__PURE__ */ Z("button", {
			type: "button",
			className: "secondary-button directors-admin-page-login-button",
			onClick: o.refresh,
			children: "Повторить"
		})]
	}) : /* @__PURE__ */ Z(Ve, {
		directors: n,
		movieDirectorRows: r,
		actions: o,
		utils: s
	});
}
function Ue(e, t = {}) {
	let n = t, r = (t) => {
		n = {
			...n,
			...t
		}, oe(/* @__PURE__ */ Z(He, { ...n }), e);
	};
	return r(t), {
		update: r,
		unmount: () => oe(null, e)
	};
}
//#endregion
export { Ue as mountDirectorsAdminApp };
