import {Message, Method, MintData, MintState} from "../types";
import {mintCollections} from "../collection";
import BigNumber from "bignumber.js";

const BN = require("bn.js");
const keccak256 = require("keccak256");
const MAX_UINT256 = new BN(2).pow(new BN(256)).sub(new BN(1));

class Test{
    genHashSeed(_phash: string, _addr: string, _index: string): string {
        const buf1 = Buffer.from(_phash.slice(2), "hex");
        const buf2 = Buffer.from(_addr.slice(2), 'hex')
        const buf3 = new BN(_index.slice(2), "hex").toArrayLike(Buffer, "be", 8)
        const bufA = Buffer.concat([buf1, buf2, buf3])
        return keccak256(bufA).toString('hex');
    }

    genDigest(_hashSeed: string, _nonce: Buffer): any {
        const buf1 = Buffer.from(_hashSeed, "hex");
        const bufA = Buffer.concat([buf1, _nonce])
        const a = keccak256(bufA).toString('hex');
        const te = new BN(a, "hex").toArrayLike(Buffer, "be", 64)
        return new BN(te);
    }

    calcNE(_hashSeed: string, _nonce: Buffer): number {
        const digest = this.genDigest(_hashSeed, _nonce);
        const num = MAX_UINT256.div(digest);
        const buf = num.toArrayLike(Buffer, 'be', 8)
        return new BN(buf).toNumber()
    }
}
const service = new Test();

const seed = "0x59fb2b173e04deca137312f1773e80809d5b114a08e669ccc8a5293f94056cbd";

const seedss = service.genHashSeed("0x0000000000000000000000000000000000000000000000000000000000000000","0x79ba35d3ea3b0e928e54263948b91fd3cbbf0963","0x1")


const buf = new BN("8589989205887908286",10).toArrayLike(Buffer, "be", 8);
const ne = service.calcNE(seedss,buf)
console.log("ne",ne,seedss)

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