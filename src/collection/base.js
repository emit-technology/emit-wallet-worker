"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseConfig = void 0;
var Base = /** @class */ (function () {
    function Base() {
    }
    return Base;
}());
exports.default = Base;
exports.baseConfig = {
    keystore: {
        name: "keystore",
        keyPath: "id",
        autoIncrement: true,
        indexes: [
            {
                index: "accountId",
                relativeIndex: "accountId",
                unique: false
            },
            {
                index: "chainType",
                relativeIndex: "chainType",
                unique: false
            },
            {
                index: "address",
                relativeIndex: "address",
                unique: true
            }
        ]
    },
    account: {
        name: "account",
        keyPath: "id",
        autoIncrement: true,
        indexes: [
            {
                index: "accountId",
                relativeIndex: "accountId",
                unique: true
            },
        ]
    }
};
//# sourceMappingURL=base.js.map