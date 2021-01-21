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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeroWallet = void 0;
var utils_1 = require("jsuperzk/dist/utils/utils");
var wallet_1 = require("jsuperzk/dist/wallet/wallet");
var superzk = require("jsuperzk/dist/protocol/account");
var wallet_2 = require("./wallet");
var tx_1 = require("jsuperzk/dist/tx/tx");
var ethereumjs_wallet_1 = require("ethereumjs-wallet");
var bip39 = require("bip39");
var SeroWallet = /** @class */ (function (_super) {
    __extends(SeroWallet, _super);
    function SeroWallet(keystore) {
        var _this = _super.call(this) || this;
        _this.importMnemonic = function (mnemonic, password, keystore, blockNumber) { return __awaiter(_this, void 0, void 0, function () {
            var version, seedB, walletEth, acct, sk, tk, address, keystoreRet, mnemonicSlice, seed, seedBuffer, walletEth_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        version = 1;
                        seedB = bip39.mnemonicToSeedSync(mnemonic);
                        walletEth = ethereumjs_wallet_1.hdkey.fromMasterSeed(seedB);
                        acct = walletEth.derivePath("m/44'/60'/0'/0/0");
                        sk = superzk.seed2Sk(acct.getWallet().getPrivateKey(), version);
                        tk = superzk.sk2Tk(sk);
                        address = wallet_1.createPkrHash(tk, 1, version) //superzk.tk2PK(tk);
                        ;
                        keystoreRet = {};
                        if (!!keystore) return [3 /*break*/, 4];
                        mnemonicSlice = mnemonic.split(" ");
                        if (mnemonicSlice.length != 12) {
                            throw new Error("invalid mnemonic!");
                        }
                        if (!!bip39.validateMnemonic(mnemonic)) return [3 /*break*/, 1];
                        throw new Error("invalid mnemonic!");
                    case 1:
                        seed = bip39.mnemonicToEntropy(mnemonic) + "00000000000000000000000000000000";
                        seedBuffer = utils_1.toBuffer(seed);
                        walletEth_1 = ethereumjs_wallet_1.default.fromPrivateKey(seedBuffer);
                        return [4 /*yield*/, walletEth_1.toV3(password)];
                    case 2:
                        keystoreRet = _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        keystoreRet = keystore;
                        _a.label = 5;
                    case 5:
                        keystoreRet.tk = tk;
                        keystoreRet.address = address;
                        return [2 /*return*/, keystoreRet];
                }
            });
        }); };
        _this.keystore = keystore;
        return _this;
    }
    SeroWallet.prototype.buildSerializedTx = function (txParams, password) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = tx_1.signTx;
                        return [4 /*yield*/, this.getSK(password)];
                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), txParams])];
                }
            });
        });
    };
    SeroWallet.prototype.getSK = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.keystore) return [3 /*break*/, 2];
                        return [4 /*yield*/, ethereumjs_wallet_1.default.fromV3(this.keystore, password)];
                    case 1:
                        wallet = _a.sent();
                        return [2 /*return*/, superzk.seed2Sk(wallet.getPrivateKey(), 1)];
                    case 2: return [2 /*return*/, ""];
                }
            });
        });
    };
    SeroWallet.prototype.exportMnemonic = function (password) {
        if (!this.keystore) {
            throw new Error("keystore undefined!");
        }
        else {
            var seed = this.decryptKeystore(this.keystore, password);
            return bip39.entropyToMnemonic(seed.slice(0, 16));
        }
    };
    return SeroWallet;
}(wallet_2.IWallet));
exports.SeroWallet = SeroWallet;
//# sourceMappingURL=seroWallet.js.map