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
        return new BN(buf).toNumber();
    };
    return Test;
}());
var service = new Test();
var seed = "0x59fb2b173e04deca137312f1773e80809d5b114a08e669ccc8a5293f94056cbd";
var seedss = service.genHashSeed("0x81762263612fa5ece8a2cd81c7cf39c7795087fb37f4a6d104fae523197de578", "0x0417798196dfb3af3c0bf97db455ac80b47ff6cb", "0x4e");
var buf = new BN("2511894", 10).toArrayLike(Buffer, "be", 8);
var ne = service.calcNE(seedss, buf);
console.log("ne", ne, seedss);
// function run(){
//     let maxNe = 0 ;
//     for(let i=0;i<100000;i++){
//         const buf = new BN("932980188022976263").toArrayLike(Buffer, "be", 8);
//         const ne = service.calcNE(seed,buf)
//         if(ne > maxNe){
//             maxNe =ne;
//             console.log(maxNe)
//         }
//     }
//
// }
// run();
//
// function calcDark(dna:string):number{
//     const u256 = new BN(dna.slice(2),16).toArrayLike(Buffer, "be", 32)
//     return (new BigNumber(u256[0]&0x3).plus(1).toNumber())
// }
//
// function isDark(dna:string):boolean {
//     const u256 = new BN(dna.slice(2),16).toArrayLike(Buffer, "be", 32)
//     return (u256[0]&0xFC) == 0;
// }
//
// const dna = "0x01fc5af5f73993593dc84ae6cb53724bd5cc7e3e6a9967692ba30775b59b7f02";
//
// console.log(isDark(dna),calcDark(dna))
