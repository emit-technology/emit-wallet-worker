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
        this.mintStop = function (accountId, cb) {
            var message = { method: types_1.Method.powStop, data: accountId };
            _this.handlerMsg(message, cb);
        };
        this.mintState = function (accountId, cb) {
            var message = { method: types_1.Method.powState, data: accountId };
            _this.handlerMsg(message, cb);
        };
        this.mintStart = function (cb) {
            var message = { method: types_1.Method.powStart, data: {} };
            _this.handlerMsg(message, cb);
        };
    }
    return Mint;
}());
// const mint: Mint = new Mint();
exports.default = Mint;
//# sourceMappingURL=index.js.map