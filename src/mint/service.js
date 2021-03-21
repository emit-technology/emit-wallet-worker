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
var types_1 = require("../types");
var collection_1 = require("../collection");
var bignumber_js_1 = require("bignumber.js");
var BN = require("bn.js");
var sha256 = require("sha256");
var MAX_UINT256 = new BN(2).pow(new BN(256)).sub(new BN(1));
function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
var Service = /** @class */ (function () {
    function Service() {
        var _this = this;
        this.start = function (param) { return __awaiter(_this, void 0, void 0, function () {
            var rest, d;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.temp = param;
                        this.temp.hashseed = this.genHashSeed(this.temp.phash, this.temp.address, this.temp.index);
                        this.temp.nonce = param.nonce ? param.nonce : random(0, Math.pow(2, 64)).toString();
                        this.temp.state = types_1.MintState.running;
                        return [4 /*yield*/, collection_1.mintCollections.find({ accountScenes: this.temp.accountScenes })];
                    case 1:
                        rest = _a.sent();
                        if (!(rest && rest.length > 0)) return [3 /*break*/, 3];
                        d = rest[0];
                        d.phash = param.phash;
                        d.address = param.address;
                        d.index = param.index;
                        d.scenes = param.scenes;
                        d.hashseed = this.temp.hashseed;
                        d.nonce = this.temp.nonce;
                        d.state = this.temp.state;
                        this.temp.ne = d.ne ? d.ne : "0";
                        return [4 /*yield*/, collection_1.mintCollections.update(d)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        this.temp.ne = "0";
                        this.temp.timestamp = Date.now();
                        return [4 /*yield*/, collection_1.mintCollections.insert(this.temp)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        this.temp.timestamp = Date.now();
                        console.log("Miner started!");
                        this.execute();
                        return [2 /*return*/];
                }
            });
        }); };
        this.stop = function (accountScenes) { return __awaiter(_this, void 0, void 0, function () {
            var rest, d;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.temp.state = types_1.MintState.stop;
                        return [4 /*yield*/, collection_1.mintCollections.find({ accountScenes: accountScenes })];
                    case 1:
                        rest = _a.sent();
                        if (!(rest && rest.length > 0)) return [3 /*break*/, 3];
                        d = rest[0];
                        d.timestamp = Date.now();
                        d.state = types_1.MintState.stop;
                        return [4 /*yield*/, collection_1.mintCollections.update(d)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.mintState = function (accountScenes) { return __awaiter(_this, void 0, void 0, function () {
            var rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!this.temp || !this.temp.timestamp)) return [3 /*break*/, 2];
                        return [4 /*yield*/, collection_1.mintCollections.find({ accountScenes: accountScenes })];
                    case 1:
                        rest = _a.sent();
                        if (rest && rest.length > 0) {
                            return [2 /*return*/, rest[0]];
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.temp];
                }
            });
        }); };
        this.run = function () { return __awaiter(_this, void 0, void 0, function () {
            var nonce, buf, ne, rest, d;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nonce = this.temp.nonce;
                        if (!nonce) {
                            return [2 /*return*/, Promise.reject("nonce can not be null!")];
                        }
                        buf = new BN(nonce).toArrayLike(Buffer, "be", 8);
                        ne = this.calcNE(this.temp.hashseed, buf);
                        if (!(new bignumber_js_1.default(this.temp.ne).comparedTo(new bignumber_js_1.default(ne)) == -1)) return [3 /*break*/, 6];
                        this.temp.ne = ne;
                        console.log("index=[" + this.temp.index + "], nonce=[" + this.temp.nonce + "], ne=[" + ne + "]");
                        return [4 /*yield*/, collection_1.mintCollections.find({ accountScenes: this.temp.accountScenes })];
                    case 1:
                        rest = _a.sent();
                        if (!(rest && rest.length > 0)) return [3 /*break*/, 4];
                        d = rest[0];
                        //must db ne < current ne
                        console.log("d", d, ne);
                        if (!(new bignumber_js_1.default(d.ne).comparedTo(new bignumber_js_1.default(ne)) == -1)) return [3 /*break*/, 3];
                        d.ne = ne;
                        d.timestamp = Date.now();
                        return [4 /*yield*/, collection_1.mintCollections.update(d)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        this.temp.ne = ne;
                        this.temp.timestamp = Date.now();
                        return [4 /*yield*/, collection_1.mintCollections.insert(this.temp)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, Promise.resolve()];
                }
            });
        }); };
        this.handle = function (e) {
            if (e && e.data && e.data.method) {
                var message_1 = e.data;
                switch (message_1.method) {
                    case types_1.Method.powStart:
                        _this.start(message_1.data).then(function (rest) {
                            message_1.result = rest;
                            sendMessage(message_1);
                        }).catch(function (e) {
                            console.error(e);
                            message_1.error = typeof e == "string" ? e : e.message;
                            sendMessage(message_1);
                        });
                        break;
                    case types_1.Method.powStop:
                        _this.stop(message_1.data).then(function (rest) {
                            message_1.result = rest;
                            sendMessage(message_1);
                        }).catch(function (e) {
                            console.error(e);
                            message_1.error = typeof e == "string" ? e : e.message;
                            sendMessage(message_1);
                        });
                        break;
                    case types_1.Method.powState:
                        _this.mintState(message_1.data).then(function (rest) {
                            message_1.result = rest;
                            sendMessage(message_1);
                        }).catch(function (e) {
                            console.error(e);
                            message_1.error = typeof e == "string" ? e : e.message;
                            sendMessage(message_1);
                        });
                        break;
                    default:
                        break;
                }
            }
        };
        this.temp = { ne: "0", accountId: "", accountScenes: "", scenes: "", phash: "", address: "", index: "" };
    }
    Service.prototype.genHashSeed = function (_phash, _addr, _index) {
        var buf1 = Buffer.from(_phash.slice(2), "hex");
        var buf2 = Buffer.from(_addr.slice(2), 'hex');
        var buf3 = new BN(_index.slice(2), "hex").toArrayLike(Buffer, "be", 8);
        var bufA = Buffer.concat([buf1, buf2, buf3]);
        return sha256(bufA);
    };
    Service.prototype.genDigest = function (_hashSeed, _nonce) {
        var buf1 = Buffer.from(_hashSeed, "hex");
        var bufA = Buffer.concat([buf1, _nonce]);
        var a = sha256(bufA);
        var te = new BN(a, "hex").toArrayLike(Buffer, "be", 64);
        return new BN(te);
    };
    Service.prototype.calcNE = function (_hashSeed, _nonce) {
        var digest = this.genDigest(_hashSeed, _nonce);
        var num = MAX_UINT256.div(digest);
        var buf = num.toArrayLike(Buffer, 'be', 8);
        return new BN(buf).toString(10);
    };
    Service.prototype.execute = function () {
        var _this = this;
        if (this.temp.state == types_1.MintState.stop) {
            console.log("miner stop!");
            return;
        }
        this.temp.timestamp = Date.now();
        this.temp.nonce = new bignumber_js_1.default(this.temp.nonce).plus(1).toString(10);
        this.run().then(function () {
            setImmediate(function () {
                _this.execute();
            });
        }).catch(function (e) {
            var err = typeof e == "string" ? e : e.message;
            console.log("$execute >>> [" + err + "]");
            console.error(e);
            setTimeout(function () {
                // this.execute()
            }, 10 * 1000);
        });
    };
    return Service;
}());
function sendMessage(message) {
    console.log("send msg: ", message);
    // @ts-ignore
    self.postMessage(message);
}
exports.default = Service;
//# sourceMappingURL=service.js.map