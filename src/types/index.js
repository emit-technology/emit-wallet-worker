"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateType = exports.ChainType = exports.Method = void 0;
var Method;
(function (Method) {
    Method[Method["_"] = 0] = "_";
    Method[Method["importMnemonic"] = 1] = "importMnemonic";
    Method[Method["exportMnemonic"] = 2] = "exportMnemonic";
    Method[Method["signTx"] = 3] = "signTx";
    Method[Method["generateMnemonic"] = 4] = "generateMnemonic";
    Method[Method["getAccountInfo"] = 5] = "getAccountInfo";
    Method[Method["getAccountList"] = 6] = "getAccountList";
    Method[Method["exportKeystore"] = 7] = "exportKeystore";
    Method[Method["execute"] = 8] = "execute";
    Method[Method["exportPrivateKey"] = 9] = "exportPrivateKey";
    Method[Method["importPrivateKey"] = 10] = "importPrivateKey";
    Method[Method["genNewWallet"] = 11] = "genNewWallet";
})(Method = exports.Method || (exports.Method = {}));
var ChainType;
(function (ChainType) {
    ChainType[ChainType["_"] = 0] = "_";
    ChainType[ChainType["SERO"] = 1] = "SERO";
    ChainType[ChainType["ETH"] = 2] = "ETH";
    ChainType[ChainType["TRON"] = 3] = "TRON";
})(ChainType = exports.ChainType || (exports.ChainType = {}));
var CreateType;
(function (CreateType) {
    CreateType[CreateType["Mnemonic"] = 0] = "Mnemonic";
    CreateType[CreateType["PrivateKey"] = 1] = "PrivateKey";
    CreateType[CreateType["Generate"] = 2] = "Generate";
})(CreateType = exports.CreateType || (exports.CreateType = {}));
// export interface Transaction {
//     chain: ChainType
//     hash: string
//     from: string
//     to: string
//     value: string
//     cy: string
//     gas: string
//     gasPrice: string
//     data?: string
//     contractAddress?: string
//     timestamp: number
// }
//# sourceMappingURL=index.js.map