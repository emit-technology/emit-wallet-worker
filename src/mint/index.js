"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var Mint = /** @class */ (function () {
    function Mint() {
        var _this = this;
        this.mintInit = function (data, cb) {
            var message = { method: types_1.Method.powInit, data: data };
            _this.handlerMsg(message, cb);
        };
        this.mintStop = function (accountScenes, cb) {
            var message = { method: types_1.Method.powStop, data: accountScenes };
            _this.handlerMsg(message, cb);
        };
        this.mintState = function (accountScenes, cb) {
            var message = { method: types_1.Method.powState, data: accountScenes };
            _this.handlerMsg(message, cb);
        };
        this.mintStart = function (accountScenes, cb) {
            var message = { method: types_1.Method.powStart, data: accountScenes };
            _this.handlerMsg(message, cb);
        };
        this.getEpochPollKeys = function (cb) {
            var message = { method: types_1.Method.getEpochPollKeys };
            _this.handlerMsg(message, cb);
        };
    }
    return Mint;
}());
// const mint: Mint = new Mint();
exports.default = Mint;
//# sourceMappingURL=index.js.map