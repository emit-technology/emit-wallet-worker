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
exports.IWallet = exports.walletEx = void 0;
var utils_1 = require("jsuperzk/src/utils/utils");
var crypto = require("crypto");
var collection_1 = require("../collection");
var crypto_1 = require("../utils/crypto");
var randomBytes = require("randombytes");
var scryptsy = require("scrypt.js");
var uuidv4 = require("uuid/v4");
var keccak256 = require("keccak256");
var bip39 = require("bip39");
var CryptoJS = require("crypto-js");
var WalletEx = /** @class */ (function () {
    function WalletEx() {
        var _this = this;
        this.getPKey = function (p, accountId) {
            return CryptoJS.SHA256([p, accountId].join("")).toString();
        };
        this.lock = function () {
            _this.pKey = "";
            _this.accountId = "";
        };
    }
    WalletEx.prototype.setSignKey = function (signKey, password, accountId) {
        return __awaiter(this, void 0, void 0, function () {
            var pKey, rest, account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pKey = this.getPKey(password, accountId);
                        return [4 /*yield*/, collection_1.accountCollection.find({ accountId: accountId })];
                    case 1:
                        rest = _a.sent();
                        if (!(rest && rest.length > 0)) return [3 /*break*/, 3];
                        account = rest[0];
                        account.key = crypto_1.Encrypt({ key: signKey }, pKey);
                        // CryptoJS.AES.encrypt(signKey, pKey).toString();
                        return [4 /*yield*/, collection_1.accountCollection.update(account)];
                    case 2:
                        // CryptoJS.AES.encrypt(signKey, pKey).toString();
                        _a.sent();
                        this.pKey = pKey;
                        this.accountId = accountId;
                        return [2 /*return*/, Promise.resolve(true)];
                    case 3: return [2 /*return*/, Promise.reject("account not find!")];
                }
            });
        });
    };
    WalletEx.prototype.unLock = function (accountId, password) {
        return __awaiter(this, void 0, void 0, function () {
            var pKey, rest, account, entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pKey = this.pKey;
                        if (password) {
                            pKey = this.getPKey(password, accountId);
                        }
                        return [4 /*yield*/, collection_1.accountCollection.find({ accountId: accountId })];
                    case 1:
                        rest = _a.sent();
                        if (rest && rest.length > 0) {
                            account = rest[0];
                            entry = crypto_1.Decrypt(account.key, pKey);
                            //CryptoJS.AES.decrypt(account.key, pKey);
                            if (!entry || !entry.key) {
                                return [2 /*return*/, Promise.reject("Invalid Password!")];
                            }
                            this.pKey = pKey;
                            this.accountId = accountId;
                            return [2 /*return*/, Promise.resolve(entry.key)];
                        }
                        return [2 /*return*/, Promise.reject("account not find!")];
                }
            });
        });
    };
    WalletEx.prototype.getSignKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.pKey) {
                            return [2 /*return*/, Promise.reject("wallet is unlock!")];
                        }
                        return [4 /*yield*/, this.unLock(this.accountId)];
                    case 1:
                        rest = _a.sent();
                        return [2 /*return*/, rest];
                }
            });
        });
    };
    WalletEx.prototype.getP = function () {
        return this.pKey;
    };
    return WalletEx;
}());
var walletEx = new WalletEx();
exports.walletEx = walletEx;
var IWallet = /** @class */ (function () {
    function IWallet() {
    }
    IWallet.prototype.generateMnemonic = function () {
        return bip39.generateMnemonic();
    };
    IWallet.prototype.genKeystore = function (seed, password, version) {
        if (!this.keyExists(seed)) {
            throw new Error("This is a public key only wallet");
        }
        var scryptParams = {
            cipher: "aes-128-ctr",
            kdf: "scrypt",
            salt: randomBytes(32),
            iv: randomBytes(16),
            uuid: randomBytes(16),
            dklen: 32,
            c: 262144,
            n: 262144,
            r: 8,
            p: 1
        };
        var kdfParams = this.kdfParamsForScrypt(scryptParams);
        var derivedKey = scryptsy(Buffer.from(password), utils_1.toBuffer(kdfParams.salt), kdfParams.n, kdfParams.r, kdfParams.p, kdfParams.dklen);
        var cipher = crypto.createCipheriv(scryptParams.cipher, derivedKey.slice(0, 16), scryptParams.iv);
        if (!cipher) {
            throw new Error("Unsupported cipher");
        }
        var ciphertext = this.runCipherBuffer(cipher, seed);
        var mac = keccak256(Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext)]));
        kdfParams.salt = kdfParams.salt;
        return {
            version: version,
            id: uuidv4({ random: scryptParams.uuid }),
            address: "",
            crypto: {
                ciphertext: ciphertext.toString("hex"),
                cipherparams: { iv: scryptParams.iv.toString("hex") },
                cipher: scryptParams.cipher,
                kdf: scryptParams.kdf,
                kdfparams: kdfParams,
                mac: mac.toString("hex")
            },
        };
    };
    IWallet.prototype.kdfParamsForScrypt = function (opts) {
        return {
            dklen: opts.dklen,
            salt: opts.salt.toString("hex"),
            n: opts.n,
            r: opts.r,
            p: opts.p
        };
    };
    IWallet.prototype.keyExists = function (k) {
        return k !== undefined && k !== null;
    };
    IWallet.prototype.decryptKeystore = function (input, password) {
        var json = typeof input === "object" ? input : JSON.parse(input);
        var derivedKey;
        var kdfparams;
        if (json.crypto.kdf === "scrypt") {
            kdfparams = json.crypto.kdfparams;
            derivedKey = scryptsy(Buffer.from(password), utils_1.toBuffer(kdfparams.salt), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
        }
        else {
            throw new Error("Unsupported key derivation scheme");
        }
        var ciphertext = Buffer.from(json.crypto.ciphertext, "hex");
        var mac = keccak256(Buffer.concat([derivedKey.slice(16, 32), ciphertext]));
        if (mac.toString("hex") !== json.crypto.mac) {
            throw new Error("Key derivation failed - possibly wrong passphrase");
        }
        var decipher = crypto.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), Buffer.from(json.crypto.cipherparams.iv, "hex"));
        return this.runCipherBuffer(decipher, ciphertext);
    };
    IWallet.prototype.runCipherBuffer = function (cipher, data) {
        return Buffer.concat([cipher.update(data), cipher.final()]);
    };
    return IWallet;
}());
exports.IWallet = IWallet;
