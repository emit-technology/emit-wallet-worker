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

    calcNE(_hashSeed: string, _nonce: Buffer): string {
        const digest = this.genDigest(_hashSeed, _nonce);
        const num = MAX_UINT256.div(digest);
        const buf = num.toArrayLike(Buffer, 'be', 8)
        return new BN(buf).toString(10)
    }
}
const service = new Test();

const seed = service.genHashSeed("0xc0f25fa2950a387fb84929dec740dd54cfa13d64b697941537230753a6ccc513","0xeb5b6fefee4ad2906f01386292bda1a94282aa3b","1")
const buf = new BN("10000000").toArrayLike(Buffer, "be", 8);
const ne = service.calcNE(seed,buf)

console.log(seed,ne)