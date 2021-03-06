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
var wallet_1 = require("./wallet");
var ethereumjs_wallet_1 = require("ethereumjs-wallet");
var ethereumjs_wallet_2 = require("ethereumjs-wallet");
var ethereumjs_common_1 = require("ethereumjs-common");
var EthereumTx = require('ethereumjs-tx').Transaction;
var bip39 = require("bip39");
var EthWallet = /** @class */ (function (_super) {
    __extends(EthWallet, _super);
    function EthWallet(keystore) {
        var _this = _super.call(this) || this;
        _this.exportMnemonic = function (password) { return __awaiter(_this, void 0, void 0, function () {
            var wallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.keystore) return [3 /*break*/, 1];
                        throw new Error("keystore undefined!");
                    case 1: return [4 /*yield*/, ethereumjs_wallet_2.default.fromV3(this.keystore, password)
                        // const walletEth = hdkey.fromMasterSeed(wallet.getPrivateKey())
                        // console.log("wallet.getPrivateKey()",wallet.getPrivateKeyString())
                    ];
                    case 2:
                        wallet = _a.sent();
                        // const walletEth = hdkey.fromMasterSeed(wallet.getPrivateKey())
                        // console.log("wallet.getPrivateKey()",wallet.getPrivateKeyString())
                        return [2 /*return*/, bip39.entropyToMnemonic(wallet.getPrivateKey().slice(0, 16))];
                }
            });
        }); };
        _this.keystore = keystore;
        return _this;
    }
    EthWallet.prototype.buildSerializedTx = function (txParams, password, chainParams) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet, customCommon, tx, serializedTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.keystore) return [3 /*break*/, 2];
                        return [4 /*yield*/, ethereumjs_wallet_2.default.fromV3(this.keystore, password)];
                    case 1:
                        wallet = _a.sent();
                        customCommon = ethereumjs_common_1.default.forCustomChain(chainParams.baseChain, chainParams.customer, chainParams.hardfork);
                        tx = new EthereumTx(txParams, { common: customCommon });
                        console.debug(tx, "tx1");
                        tx.sign(wallet.getPrivateKey());
                        console.debug(tx, "tx2");
                        serializedTx = tx.serialize();
                        console.debug(serializedTx, "serializedTx");
                        return [2 /*return*/, serializedTx.toString("hex")];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    EthWallet.prototype.importMnemonic = function (mnemonic, password, blockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var mnemonicSlice, seedBuffer, walletEth, acct, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mnemonicSlice = mnemonic.split(" ");
                        if (mnemonicSlice.length != 12) {
                            throw new Error("invalid mnemonic!");
                        }
                        if (!!bip39.validateMnemonic(mnemonic)) return [3 /*break*/, 1];
                        throw new Error("invalid mnemonic!");
                    case 1:
                        seedBuffer = bip39.mnemonicToSeedSync(mnemonic);
                        walletEth = ethereumjs_wallet_1.hdkey.fromMasterSeed(seedBuffer);
                        acct = walletEth.derivePath("m/44'/60'/0'/0/0");
                        return [4 /*yield*/, acct.getWallet().toV3(password)];
                    case 2:
                        data = _a.sent();
                        this.keystore = data;
                        // const address = acct.getWallet().getAddressString();
                        // this.keystore.address =address;
                        return [2 /*return*/, this.keystore];
                }
            });
        });
    };
    return EthWallet;
}(wallet_1.IWallet));
exports.default = EthWallet;
//# sourceMappingURL=ethWallet.js.map