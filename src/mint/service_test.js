"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BN = require("bn.js");
var keccak256 = require("keccak256");
var MAX_UINT256 = new BN(2).pow(new BN(256)).sub(new BN(1));
var Test = /** @class */ (function () {
    function Test() {
    }
    Test.prototype.genHashSeed = function (_phash, _addr, _index) {
        var buf1 = Buffer.from(_phash.slice(2), "hex");
        var buf2 = Buffer.from(_addr.slice(2), 'hex');
        var buf3 = new BN(_index.slice(2), "hex").toArrayLike(Buffer, "be", 8);
        var bufA = Buffer.concat([buf1, buf2, buf3]);
        return keccak256(bufA).toString('hex');
    };
    Test.prototype.genDigest = function (_hashSeed, _nonce) {
        var buf1 = Buffer.from(_hashSeed, "hex");
        var bufA = Buffer.concat([buf1, _nonce]);
        var a = keccak256(bufA).toString('hex');
        var te = new BN(a, "hex").toArrayLike(Buffer, "be", 64);
        return new BN(te);
    };
    Test.prototype.calcNE = function (_hashSeed, _nonce) {
        var digest = this.genDigest(_hashSeed, _nonce);
        var num = MAX_UINT256.div(digest);
        var buf = num.toArrayLike(Buffer, 'be', 8);
        return new BN(buf).toString(10);
    };
    return Test;
}());
var service = new Test();
var seed = service.genHashSeed("0xc0f25fa2950a387fb84929dec740dd54cfa13d64b697941537230753a6ccc513", "0xeb5b6fefee4ad2906f01386292bda1a94282aa3b", "1");
var buf = new BN("10000000").toArrayLike(Buffer, "be", 8);
var ne = service.calcNE(seed, buf);
console.log(seed, ne);
//# sourceMappingURL=service_test.js.map