"use strict";
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
var seroWallet_1 = require("./wallet/seroWallet");
var ethWallet_1 = require("./wallet/ethWallet");
var types_1 = require("./types");
var collection_1 = require("./collection");
var superzk = require("jsuperzk/dist/protocol/account");
var wallet_1 = require("jsuperzk/dist/wallet/wallet");
var wallet_2 = require("./wallet/wallet");
var ethereumjs_wallet_1 = require("ethereumjs-wallet");
var utils_1 = require("jsuperzk/src/utils/utils");
var tronWallet_1 = require("./wallet/tronWallet");
var crypto_1 = require("tron-lib/src/utils/crypto");
var uuidv4 = require("uuid/v4");
var randomBytes = require("randombytes");
var Service = /** @class */ (function () {
    function Service() {
        var _this = this;
        this.execute = function (message) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); };
    }
    Service.prototype.generateMnemonic = function () {
        return new seroWallet_1.SeroWallet().generateMnemonic();
    };
    Service.prototype.exportMnemonic = function (accountId, password) {
        return __awaiter(this, void 0, void 0, function () {
            var rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, collection_1.keyStoreCollection.find({
                            "accountId": accountId,
                            chainType: types_1.ChainType.SERO
                        })];
                    case 1:
                        rest = _a.sent();
                        if (!(rest && rest.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, new ethWallet_1.default(rest[0].keystore).exportMnemonic(password)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Service.prototype.exportKeystore = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            var rest, keystore;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, collection_1.keyStoreCollection.find({ "accountId": accountId })];
                    case 1:
                        rest = _a.sent();
                        if (!rest || rest.length == 0) {
                            return [2 /*return*/, ""];
                        }
                        else {
                            keystore = rest[1];
                            return [2 /*return*/, JSON.stringify(keystore.keystore)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Service.prototype.exportPrivateKey = function (accountId, password) {
        return __awaiter(this, void 0, void 0, function () {
            var rest, wallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, collection_1.keyStoreCollection.find({ "accountId": accountId, chainType: types_1.ChainType.ETH })];
                    case 1:
                        rest = _a.sent();
                        if (!(rest && rest.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, ethereumjs_wallet_1.default.fromV3(rest[0].keystore, password)];
                    case 2:
                        wallet = _a.sent();
                        return [2 /*return*/, wallet.getPrivateKeyString()];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Service.prototype.importPrivateKey = function (privateKey, password, name, passwordHint, avatar) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet, ethKeystore, seroKeystore, sk, tk, address, accountId_1, seroKeystoreData, ethKeystoreData, addressed, seroData, ethData, tmp, tmp, rest, tmp, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 13, , 14]);
                        wallet = ethereumjs_wallet_1.default.fromPrivateKey(utils_1.toBuffer(privateKey));
                        return [4 /*yield*/, wallet.toV3(password)];
                    case 1:
                        ethKeystore = _a.sent();
                        seroKeystore = JSON.parse(JSON.stringify(ethKeystore));
                        sk = superzk.seed2Sk(wallet.getPrivateKey(), 1);
                        tk = superzk.sk2Tk(sk);
                        address = wallet_1.createPkrHash(tk, 1, 1);
                        seroKeystore.tk = tk;
                        seroKeystore.address = address;
                        accountId_1 = uuidv4(randomBytes(16));
                        return [4 /*yield*/, collection_1.keyStoreCollection.find({ "address": seroKeystore.address })];
                    case 2:
                        seroKeystoreData = _a.sent();
                        return [4 /*yield*/, collection_1.keyStoreCollection.find({ "address": ethKeystore.address })];
                    case 3:
                        ethKeystoreData = _a.sent();
                        addressed = {};
                        addressed[types_1.ChainType.SERO] = seroKeystore.address;
                        addressed[types_1.ChainType.ETH] = "0x" + ethKeystore.address;
                        seroData = {
                            accountId: accountId_1,
                            address: seroKeystore.address,
                            chainType: types_1.ChainType.SERO,
                            keystore: seroKeystore,
                        };
                        ethData = {
                            accountId: accountId_1,
                            address: ethKeystore.address,
                            chainType: types_1.ChainType.ETH,
                            keystore: ethKeystore,
                        };
                        if (!(seroKeystoreData && seroKeystoreData.length > 0)) return [3 /*break*/, 5];
                        tmp = seroKeystoreData[0];
                        accountId_1 = tmp.accountId;
                        tmp.keystore = seroData.keystore;
                        return [4 /*yield*/, collection_1.keyStoreCollection.update(tmp)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, collection_1.keyStoreCollection.insert(seroData)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        if (!(ethKeystoreData && ethKeystoreData.length > 0)) return [3 /*break*/, 9];
                        tmp = ethKeystoreData[0];
                        tmp.keystore = ethData.keystore;
                        return [4 /*yield*/, collection_1.keyStoreCollection.update(tmp)];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, collection_1.keyStoreCollection.insert(ethData)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [4 /*yield*/, collection_1.accountCollection.find({ accountId: accountId_1 })];
                    case 12:
                        rest = _a.sent();
                        if (rest && rest.length > 0) {
                            tmp = rest[0];
                            tmp.name = name;
                            tmp.passwordHint = passwordHint;
                            tmp.avatar = avatar;
                            collection_1.accountCollection.update(tmp).then().catch(function (e) {
                                // console.log(accountId)
                            });
                        }
                        else {
                            collection_1.accountCollection.insert({
                                accountId: accountId_1,
                                createType: types_1.CreateType.PrivateKey,
                                name: name,
                                passwordHint: passwordHint,
                                avatar: avatar,
                                addresses: addressed
                            }).then().catch(function (e) {
                                console.log(accountId_1);
                            });
                        }
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                resolve(accountId_1);
                            })];
                    case 13:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                reject(e_1);
                            })];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    Service.prototype.accounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, collection_1.accountCollection.findAll()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Service.prototype.accountInfo = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            var rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, collection_1.accountCollection.find({ accountId: accountId })];
                    case 1:
                        rest = _a.sent();
                        if (rest && rest.length > 0) {
                            return [2 /*return*/, rest[0]];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Service.prototype.signTx = function (accountId, password, chainType, params, chainParams) {
        return __awaiter(this, void 0, void 0, function () {
            var chain, rest, account, _a, ethWallet, seroWallet, tronWallet, rest_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        chain = chainType == types_1.ChainType.SERO ? types_1.ChainType.ETH : chainType;
                        return [4 /*yield*/, collection_1.keyStoreCollection.find({ "accountId": accountId, "chainType": chain })];
                    case 1:
                        rest = _b.sent();
                        if (!rest || rest.length == 0) {
                            return [2 /*return*/, Promise.reject("No keystore find.")];
                        }
                        account = rest[0];
                        _a = chainType;
                        switch (_a) {
                            case types_1.ChainType.ETH: return [3 /*break*/, 2];
                            case types_1.ChainType.SERO: return [3 /*break*/, 4];
                            case types_1.ChainType.TRON: return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 8];
                    case 2:
                        ethWallet = new ethWallet_1.default(account.keystore);
                        return [4 /*yield*/, ethWallet.buildSerializedTx(params, password, chainParams)];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4:
                        seroWallet = new seroWallet_1.SeroWallet(account.keystore);
                        return [4 /*yield*/, seroWallet.buildSerializedTx(params, password)];
                    case 5: return [2 /*return*/, _b.sent()];
                    case 6:
                        tronWallet = new tronWallet_1.default(account.keystore);
                        return [4 /*yield*/, tronWallet.buildSerializedTx(params, password)];
                    case 7:
                        rest_1 = _b.sent();
                        return [2 /*return*/, Promise.resolve(rest_1)];
                    case 8: return [3 /*break*/, 9];
                    case 9: return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    Service.prototype.importMnemonic = function (mnemonic, password, name, passwordHint, avatar) {
        return __awaiter(this, void 0, void 0, function () {
            var seroWallet, ethWallet, ethKeystore, seroKeystore, accountId_2, seroKeystoreData, ethKeystoreData, addressed, seroData, ethData, tmp, tmp, rest, tmp, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 14, , 15]);
                        seroWallet = new seroWallet_1.SeroWallet();
                        ethWallet = new ethWallet_1.default();
                        return [4 /*yield*/, ethWallet.importMnemonic(mnemonic, password)];
                    case 1:
                        ethKeystore = _a.sent();
                        return [4 /*yield*/, seroWallet.importMnemonic(mnemonic, password)];
                    case 2:
                        seroKeystore = _a.sent();
                        accountId_2 = uuidv4(randomBytes(16));
                        return [4 /*yield*/, collection_1.keyStoreCollection.find({ "address": seroKeystore.address })];
                    case 3:
                        seroKeystoreData = _a.sent();
                        return [4 /*yield*/, collection_1.keyStoreCollection.find({ "address": ethKeystore.address })];
                    case 4:
                        ethKeystoreData = _a.sent();
                        addressed = {};
                        addressed[types_1.ChainType.SERO] = seroKeystore.address;
                        addressed[types_1.ChainType.ETH] = "0x" + ethKeystore.address;
                        seroData = {
                            accountId: accountId_2,
                            address: seroKeystore.address,
                            chainType: types_1.ChainType.SERO,
                            keystore: seroKeystore,
                        };
                        ethData = {
                            accountId: accountId_2,
                            address: ethKeystore.address,
                            chainType: types_1.ChainType.ETH,
                            keystore: ethKeystore,
                        };
                        if (!(seroKeystoreData && seroKeystoreData.length > 0)) return [3 /*break*/, 6];
                        tmp = seroKeystoreData[0];
                        accountId_2 = tmp.accountId;
                        tmp.keystore = seroData.keystore;
                        return [4 /*yield*/, collection_1.keyStoreCollection.update(tmp)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, collection_1.keyStoreCollection.insert(seroData)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        if (!(ethKeystoreData && ethKeystoreData.length > 0)) return [3 /*break*/, 10];
                        tmp = ethKeystoreData[0];
                        tmp.keystore = ethData.keystore;
                        return [4 /*yield*/, collection_1.keyStoreCollection.update(tmp)];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, collection_1.keyStoreCollection.insert(ethData)];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [4 /*yield*/, collection_1.accountCollection.find({ accountId: accountId_2 })];
                    case 13:
                        rest = _a.sent();
                        if (rest && rest.length > 0) {
                            tmp = rest[0];
                            tmp.name = name;
                            tmp.passwordHint = passwordHint;
                            tmp.avatar = avatar;
                            collection_1.accountCollection.update(tmp).then().catch(function (e) {
                                console.log(accountId_2);
                            });
                        }
                        else {
                            collection_1.accountCollection.insert({
                                accountId: accountId_2,
                                name: name,
                                createType: types_1.CreateType.Mnemonic,
                                passwordHint: passwordHint,
                                avatar: avatar,
                                addresses: addressed
                            }).then().catch(function (e) {
                                console.log(accountId_2);
                            });
                        }
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                resolve(accountId_2);
                            })];
                    case 14:
                        e_2 = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                reject(e_2);
                            })];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    Service.prototype.genNewWallet = function (accountId, password, chainType) {
        return __awaiter(this, void 0, void 0, function () {
            var rest, accountInfo, keystore, privateKeyBytes, wallet, wallet, rest_2, account, addresses, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, collection_1.keyStoreCollection.find({ "accountId": accountId, "chainType": chainType })];
                    case 1:
                        rest = _a.sent();
                        if (rest && rest.length > 0) {
                            return [2 /*return*/, Promise.reject("Chain:" + types_1.ChainType[chainType] + " is exist!")];
                        }
                        return [4 /*yield*/, this.accountInfo(accountId)];
                    case 2:
                        accountInfo = _a.sent();
                        keystore = {};
                        if (!(accountInfo.createType == types_1.CreateType.PrivateKey)) return [3 /*break*/, 4];
                        privateKeyBytes = utils_1.toBuffer(wallet_2.walletEx.getSignKey());
                        wallet = ethereumjs_wallet_1.default.fromPrivateKey(privateKeyBytes);
                        return [4 /*yield*/, wallet.toV3(password)];
                    case 3:
                        keystore = _a.sent();
                        keystore.address = crypto_1.getBase58CheckAddress(crypto_1.getAddressFromPriKey(privateKeyBytes));
                        return [3 /*break*/, 6];
                    case 4:
                        if (!(accountInfo.createType == types_1.CreateType.Mnemonic)) return [3 /*break*/, 6];
                        wallet = new tronWallet_1.default();
                        return [4 /*yield*/, wallet.importMnemonic(wallet_2.walletEx.getSignKey(), password)];
                    case 5:
                        keystore = _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!(chainType == types_1.ChainType.TRON)) return [3 /*break*/, 10];
                        return [4 /*yield*/, collection_1.accountCollection.find({
                                accountId: accountId
                            })];
                    case 7:
                        rest_2 = _a.sent();
                        if (!rest_2 || rest_2.length == 0) {
                            return [2 /*return*/, Promise.reject("No available account")];
                        }
                        account = rest_2[0];
                        addresses = account.addresses;
                        addresses[chainType] = keystore.address;
                        account.addresses = addresses;
                        return [4 /*yield*/, collection_1.accountCollection.update(account)];
                    case 8:
                        _a.sent();
                        data = {
                            accountId: accountId,
                            address: keystore.address,
                            chainType: types_1.ChainType.TRON,
                            keystore: keystore,
                        };
                        return [4 /*yield*/, collection_1.keyStoreCollection.insert(data)];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Service.prototype.unlockWallet = function (accountId, password) {
        return __awaiter(this, void 0, void 0, function () {
            var chainType, rest, accountInfo, privateKeyString, restSero, mnemonic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainType = types_1.ChainType.ETH;
                        return [4 /*yield*/, collection_1.keyStoreCollection.find({ "accountId": accountId, "chainType": chainType })];
                    case 1:
                        rest = _a.sent();
                        if (rest && rest.length == 0) {
                            return [2 /*return*/, Promise.reject("Chain:" + types_1.ChainType[chainType] + " is not exist!")];
                        }
                        return [4 /*yield*/, this.accountInfo(accountId)];
                    case 2:
                        accountInfo = _a.sent();
                        if (!(accountInfo.createType == types_1.CreateType.PrivateKey)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.exportPrivateKey(accountId, password)];
                    case 3:
                        privateKeyString = _a.sent();
                        wallet_2.walletEx.setSignKey(privateKeyString, password);
                        return [3 /*break*/, 8];
                    case 4:
                        if (!(accountInfo.createType == types_1.CreateType.Mnemonic)) return [3 /*break*/, 8];
                        return [4 /*yield*/, collection_1.keyStoreCollection.find({
                                accountId: accountId,
                                chainType: types_1.ChainType.SERO
                            })];
                    case 5:
                        restSero = _a.sent();
                        mnemonic = "";
                        if (!(restSero && restSero.length > 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, new ethWallet_1.default(restSero[0].keystore).exportMnemonic(password)];
                    case 6:
                        mnemonic = _a.sent();
                        _a.label = 7;
                    case 7:
                        wallet_2.walletEx.setSignKey(mnemonic, password);
                        _a.label = 8;
                    case 8: return [2 /*return*/, Promise.resolve(true)];
                }
            });
        });
    };
    Service.prototype.isLocked = function () {
        var signKey = wallet_2.walletEx.getSignKey();
        return !signKey;
    };
    return Service;
}());
var service = new Service();
self.addEventListener('message', function (e) {
    if (e && e.data && e.data.method) {
        var message_1 = e.data;
        switch (message_1.method) {
            case types_1.Method.exportMnemonic:
                service.exportMnemonic(message_1.data.accountId, message_1.data.password).then(function (rest) {
                    message_1.result = rest;
                    sendMessage(message_1);
                }).catch(function (e) {
                    message_1.error = typeof e == "string" ? e : e.message;
                    sendMessage(message_1);
                });
                break;
            case types_1.Method.importMnemonic:
                service.importMnemonic(message_1.data.mnemonic, message_1.data.password, message_1.data.name, message_1.data.passwordHint, message_1.data.avatar).then(function (rest) {
                    wallet_2.walletEx.setSignKey(message_1.data.mnemonic, message_1.data.password);
                    message_1.result = rest;
                    sendMessage(message_1);
                }).catch(function (e) {
                    console.error(e);
                    message_1.error = typeof e == "string" ? e : e.message;
                    sendMessage(message_1);
                });
                break;
            case types_1.Method.signTx:
                service.signTx(message_1.data.accountId, message_1.data.password, message_1.data.chainType, message_1.data.params, message_1.data.chainParams).then(function (rest) {
                    message_1.result = rest;
                    sendMessage(message_1);
                }).catch(function (e) {
                    console.error(e);
                    message_1.error = typeof e == "string" ? e : e.message;
                    sendMessage(message_1);
                });
                break;
            case types_1.Method.generateMnemonic:
                message_1.result = service.generateMnemonic();
                sendMessage(message_1);
                break;
            case types_1.Method.getAccountInfo:
                service.accountInfo(message_1.data.accountId).then(function (rest) {
                    message_1.result = rest;
                    sendMessage(message_1);
                }).catch(function (e) {
                    message_1.error = typeof e == "string" ? e : e.message;
                    sendMessage(message_1);
                });
                break;
            case types_1.Method.getAccountList:
                service.accounts().then(function (rest) {
                    message_1.result = rest;
                    sendMessage(message_1);
                }).catch(function (e) {
                    message_1.error = typeof e == "string" ? e : e.message;
                    sendMessage(message_1);
                });
                break;
            case types_1.Method.exportKeystore:
                service.exportKeystore(message_1.data.accountId).then(function (rest) {
                    message_1.result = rest;
                    sendMessage(message_1);
                }).catch(function (e) {
                    message_1.error = typeof e == "string" ? e : e.message;
                    sendMessage(message_1);
                });
                break;
            case types_1.Method.exportPrivateKey:
                service.exportPrivateKey(message_1.data.accountId, message_1.data.password).then(function (rest) {
                    message_1.result = rest;
                    sendMessage(message_1);
                }).catch(function (e) {
                    message_1.error = typeof e == "string" ? e : e.message;
                    sendMessage(message_1);
                });
                break;
            case types_1.Method.importPrivateKey:
                service.importPrivateKey(message_1.data.mnemonic, message_1.data.password, message_1.data.name, message_1.data.passwordHint, message_1.data.avatar).then(function (rest) {
                    wallet_2.walletEx.setSignKey(message_1.data.mnemonic, message_1.data.password);
                    message_1.result = rest;
                    sendMessage(message_1);
                }).catch(function (e) {
                    message_1.error = typeof e == "string" ? e : e.message;
                    sendMessage(message_1);
                });
                break;
            case types_1.Method.genNewWallet:
                service.genNewWallet(message_1.data.accountId, message_1.data.password, message_1.data.chainType).then(function (rest) {
                    message_1.result = rest;
                    sendMessage(message_1);
                }).catch(function (e) {
                    console.error(e);
                    message_1.error = typeof e == "string" ? e : e.message;
                    sendMessage(message_1);
                });
                break;
            case types_1.Method.unlockWallet:
                service.unlockWallet(message_1.data.accountId, message_1.data.password).then(function (rest) {
                    message_1.result = rest;
                    sendMessage(message_1);
                }).catch(function (e) {
                    console.error(e);
                    message_1.error = typeof e == "string" ? e : e.message;
                    sendMessage(message_1);
                });
                break;
            case types_1.Method.isLocked:
                message_1.result = service.isLocked();
                sendMessage(message_1);
                break;
            default:
                service.execute(message_1).then(function (rest) {
                    message_1.result = rest;
                    sendMessage(message_1);
                }).catch(function (e) {
                    message_1.error = typeof e == "string" ? e : e.message;
                    sendMessage(message_1);
                });
                break;
        }
    }
});
function sendMessage(message) {
    console.log("send msg: ", message);
    // @ts-ignore
    self.postMessage(message);
}
//# sourceMappingURL=service.js.map