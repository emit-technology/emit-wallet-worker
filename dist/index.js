!function o(r, a, i) {
    function s(t, e) {
        if (!a[t]) {
            if (!r[t]) {
                var n = "function" == typeof require && require;
                if (!e && n) return n(t, !0);
                if (c) return c(t, !0);
                throw(n = new Error("Cannot find module '" + t + "'")).code = "MODULE_NOT_FOUND", n
            }
            n = a[t] = {exports: {}}, r[t][0].call(n.exports, function (e) {
                return s(r[t][1][e] || e)
            }, n, n.exports, o, r, a, i)
        }
        return a[t].exports
    }

    for (var c = "function" == typeof require && require, e = 0; e < i.length; e++) s(i[e]);
    return s
}({
    1: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {value: !0});
        var o, a = e("./types");

        function r() {
            var n = this;
            this.callbackHandler = new Map, this.messageId = 0, (o = new Worker("../lib/service.js", {type: "module"})).onmessage = function (e) {
                var t;
                e && (t = e.data, e = n.callbackHandler.get(t.messageId), n.callbackHandler.delete(t.messageId), e && "function" == typeof e && e(t))
            }
        }

        e = new (r.prototype.handlerMsg = function (e, t) {
            t && (e.messageId = this.messageId++, o.postMessage(e), this.callbackHandler.set(this.messageId, t))
        }, r.prototype.importMnemonic = function (e, t) {
            e = {method: a.Method.importMnemonic, data: e};
            this.handlerMsg(e, t)
        }, r.prototype.generateMnemonic = function (e) {
            var t = {method: a.Method.generateMnemonic, data: null};
            this.handlerMsg(t, e)
        }, r.prototype.exportMnemonic = function (e, t, n) {
            e = {method: a.Method.generateMnemonic, data: {password: t, accountId: e}};
            this.handlerMsg(e, n)
        }, r.prototype.exportKeystore = function (e, t) {
            e = {method: a.Method.generateMnemonic, data: {accountId: e}};
            this.handlerMsg(e, t)
        }, r.prototype.accounts = function (e) {
            var t = {method: a.Method.generateMnemonic, data: null};
            this.handlerMsg(t, e)
        }, r.prototype.signTx = function (e, t, n, o, r) {
            o = {method: a.Method.generateMnemonic, data: {accountId: e, password: t, chainType: n, params: o}};
            this.handlerMsg(o, r)
        }, r);
        n.default = e
    }, {"./types": 2}], 2: [function (e, t, n) {
        "use strict";
        var o;
        Object.defineProperty(n, "__esModule", {value: !0}), n.ChainType = n.Method = void 0, (o = n.Method || (n.Method = {}))[o.importMnemonic = 0] = "importMnemonic", o[o.exportMnemonic = 1] = "exportMnemonic", o[o.signTx = 2] = "signTx", o[o.generateMnemonic = 3] = "generateMnemonic", (n = n.ChainType || (n.ChainType = {}))[n.SERO = 0] = "SERO", n[n.ETH = 1] = "ETH"
    }, {}]
}, {}, [1]);