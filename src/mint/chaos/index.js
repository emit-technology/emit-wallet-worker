"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var callbackHandler = new Map();
var worker = new Worker("./service.js", { name: "mint-worker-chaos", type: 'module' });
worker.onmessage = function (event) {
    if (event) {
        var msg = event.data;
        var cb = callbackHandler.get(msg.messageId);
        callbackHandler.delete(msg.messageId);
        if (cb && typeof cb === "function") {
            cb(msg);
        }
    }
};
var Miner = /** @class */ (function (_super) {
    __extends(Miner, _super);
    function Miner() {
        var _this = _super.call(this) || this;
        _this.handlerMsg = function (message, cb) {
            if (cb) {
                var msgId = _this.messageId++;
                message.messageId = msgId;
                worker.postMessage(message);
                callbackHandler.set(msgId, cb);
            }
        };
        _this.messageId = 0;
        return _this;
    }
    return Miner;
}(index_1.default));
var miner = new Miner();
exports.default = miner;
