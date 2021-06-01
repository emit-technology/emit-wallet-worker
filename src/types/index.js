"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinerScenes = exports.MintState = exports.CreateType = exports.ChainType = exports.Method = void 0;
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
    Method[Method["unlockWallet"] = 12] = "unlockWallet";
    Method[Method["isLocked"] = 13] = "isLocked";
    Method[Method["powStart"] = 14] = "powStart";
    Method[Method["powStop"] = 15] = "powStop";
    Method[Method["powState"] = 16] = "powState";
    Method[Method["powClear"] = 17] = "powClear";
    Method[Method["powInit"] = 18] = "powInit";
    Method[Method["lockWallet"] = 19] = "lockWallet";
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
var MintState;
(function (MintState) {
    MintState[MintState["_"] = 0] = "_";
    MintState[MintState["running"] = 1] = "running";
    MintState[MintState["stop"] = 2] = "stop";
})(MintState = exports.MintState || (exports.MintState = {}));
var MinerScenes;
(function (MinerScenes) {
    MinerScenes[MinerScenes["_"] = 0] = "_";
    MinerScenes[MinerScenes["altar"] = 1] = "altar";
    MinerScenes[MinerScenes["chaos"] = 2] = "chaos";
})(MinerScenes = exports.MinerScenes || (exports.MinerScenes = {}));
//# sourceMappingURL=index.js.map