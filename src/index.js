"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var worker_threads_1 = require("worker_threads");
var worker;
var Index = /** @class */ (function () {
    function Index() {
        var that = this;
        this.callbackHandler = new Map();
        this.messageId = 0;
        // @ts-ignore
        // worker = new Worker(new URL("../src/service.js", import.meta.url) );
        worker = new worker_threads_1.Worker('../src/service.js', { type: 'module' });
        worker.onmessage = function (event) {
            if (event) {
                var msg = event.data;
                var cb = that.callbackHandler.get(msg.messageId);
                that.callbackHandler.delete(msg.messageId);
                if (cb && typeof cb === "function") {
                    cb(msg);
                }
            }
        };
    }
    Index.prototype.handlerMsg = function (message, cb) {
        if (cb) {
            var msgId = this.messageId++;
            message.messageId = msgId;
            console.log("message>>", message);
            worker.postMessage(message);
            this.callbackHandler.set(msgId, cb);
        }
    };
    Index.prototype.importMnemonic = function (data, cb) {
        var message = { method: types_1.Method.importMnemonic, data: data };
        this.handlerMsg(message, cb);
    };
    Index.prototype.importPrivateKey = function (data, cb) {
        var message = { method: types_1.Method.importPrivateKey, data: data };
        this.handlerMsg(message, cb);
    };
    Index.prototype.generateMnemonic = function (cb) {
        var message = { method: types_1.Method.generateMnemonic, data: null };
        this.handlerMsg(message, cb);
    };
    Index.prototype.exportMnemonic = function (accountId, password, cb) {
        var message = { method: types_1.Method.exportMnemonic, data: { password: password, accountId: accountId } };
        this.handlerMsg(message, cb);
    };
    Index.prototype.exportKeystore = function (accountId, cb) {
        var message = { method: types_1.Method.exportKeystore, data: { accountId: accountId } };
        this.handlerMsg(message, cb);
    };
    Index.prototype.exportPrivateKey = function (accountId, password, cb) {
        var message = { method: types_1.Method.exportPrivateKey, data: { password: password, accountId: accountId } };
        this.handlerMsg(message, cb);
    };
    Index.prototype.accounts = function (cb) {
        var message = { method: types_1.Method.getAccountList, data: null };
        this.handlerMsg(message, cb);
    };
    Index.prototype.accountInfo = function (accountId, cb) {
        var message = { method: types_1.Method.getAccountInfo, data: { accountId: accountId } };
        this.handlerMsg(message, cb);
    };
    Index.prototype.signTx = function (accountId, password, chainType, params, chainParams, cb) {
        var message = {
            method: types_1.Method.signTx,
            data: { accountId: accountId, password: password, chainType: chainType, params: params, chainParams: chainParams }
        };
        this.handlerMsg(message, cb);
    };
    Index.prototype.execute = function (method, data, cb) {
        var message = { method: method, data: data };
        this.handlerMsg(message, cb);
    };
    Index.prototype.genNewWallet = function (data, cb) {
        var message = { method: types_1.Method.genNewWallet, data: data };
        this.handlerMsg(message, cb);
    };
    Index.prototype.unlockWallet = function (accountId, password, cb) {
        var message = { method: types_1.Method.unlockWallet, data: { accountId: accountId, password: password } };
        this.handlerMsg(message, cb);
    };
    Index.prototype.isLocked = function (cb) {
        var message = { method: types_1.Method.isLocked, data: {} };
        this.handlerMsg(message, cb);
    };
    Index.prototype.lockWallet = function (cb) {
        var message = { method: types_1.Method.lockWallet, data: {} };
        this.handlerMsg(message, cb);
    };
    return Index;
}());
var service = new Index();
exports.default = service;
