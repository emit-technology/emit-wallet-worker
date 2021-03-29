import {Message, Method, MintData, MintState} from "../types";
import {mintCollections} from "../collection";
import BigNumber from "bignumber.js";

const BN = require("bn.js");
const keccak256 = require("keccak256");
const MAX_UINT256 = new BN(2).pow(new BN(256)).sub(new BN(1));

function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}


class Service {

    temp: MintData

    constructor() {
        this.temp = {ne: "0", accountId: "", accountScenes: "", scenes: "", phash: "", address: "", index: ""}
    }

    private genHashSeed(_phash: string, _addr: string, _index: string): string {
        const buf1 = Buffer.from(_phash.slice(2), "hex");
        const buf2 = Buffer.from(_addr.slice(2), 'hex')
        const buf3 = new BN(_index.slice(2), "hex").toArrayLike(Buffer, "be", 8)
        const bufA = Buffer.concat([buf1, buf2, buf3])
        return keccak256(bufA).toString('hex');
    }

    private genDigest(_hashSeed: string, _nonce: Buffer): any {
        const buf1 = Buffer.from(_hashSeed, "hex");
        const bufA = Buffer.concat([buf1, _nonce])
        const a = keccak256(bufA).toString('hex');
        const te = new BN(a, "hex").toArrayLike(Buffer, "be", 64)
        return new BN(te);
    }

    private calcNE(_hashSeed: string, _nonce: Buffer): string {
        const digest = this.genDigest(_hashSeed, _nonce);
        const num = MAX_UINT256.div(digest);
        const buf = num.toArrayLike(Buffer, 'be', 8)
        return new BN(buf).toString(10)
    }

    init = async (param: MintData) => {
        const hashseed = this.genHashSeed(param.phash, param.address, param.index);
        const rest: any = await mintCollections.find({accountScenes: param.accountScenes});
        this.temp = param;
        if (rest && rest.length > 0) {
            const d: MintData = rest[0];
            if (d.phash != param.phash || d.index != param.index || d.address != param.address) {
                d.ne = "0"
                d.nonce = "0"
            }
            d.phash = param.phash;
            d.address = param.address;
            d.index = param.index;
            d.scenes = param.scenes;
            d.hashseed = hashseed;
            this.temp.ne = d.ne ? d.ne : "0";
            await mintCollections.update(d)
        } else {
            this.temp.ne = "0"
            this.temp.timestamp = Date.now();
            await mintCollections.insert(this.temp)
        }
        this.temp.hashseed = hashseed
        this.temp.nonce = param.nonce ? param.nonce : random(0, 2 ** 64).toString()
        this.temp.timestamp = Date.now();
    }

    start = async () => {
        console.log("Miner started!")
        const rest: any = await mintCollections.find({accountScenes: this.temp.accountScenes});
        if (rest && rest.length > 0) {
            const d: MintData = rest[0];
            this.temp.state = MintState.running;
            await mintCollections.update(d)
            this.execute();
        }
        return
    }

    stop = async (accountScenes: string) => {
        this.temp.state = MintState.stop;
        const rest: any = await mintCollections.find({accountScenes: accountScenes});
        if (rest && rest.length > 0) {
            const d: MintData = rest[0];
            d.timestamp = Date.now();
            d.state = MintState.stop
            await mintCollections.update(d)
        }
    }

    mintState = async (accountScenes: string) => {
        if (!this.temp || !this.temp.timestamp) {
            const rest: any = await mintCollections.find({accountScenes: accountScenes});
            if (rest && rest.length > 0) {
                return rest[0]
            }
        }
        return this.temp
    }

    execute() {
        if (this.temp.state == MintState.stop) {
            console.log("miner stop!")
            return;
        }
        this.temp.timestamp = Date.now();
        this.temp.nonce = new BigNumber(this.temp.nonce).plus(1).toString(10)
        this.run().then(() => {
            setImmediate(() => {
                this.execute()
            })
        }).catch((e: any) => {
            const err = typeof e == "string" ? e : e.message;
            console.log(`$execute >>> [${err}]`)
            console.error(e)
            setTimeout(() => {
                // this.execute()
            }, 10 * 1000)
        })
    }

    run = async () => {
        const nonce = this.temp.nonce;
        if (!nonce) {
            return Promise.reject("nonce can not be null!")
        }
        const buf = new BN(nonce).toArrayLike(Buffer, "be", 8);
        const ne: any = this.calcNE(this.temp.hashseed, buf);
        if (new BigNumber(this.temp.ne).comparedTo(new BigNumber(ne)) == -1) {
            this.temp.ne = ne;
            console.log(`index=[${this.temp.index}], nonce=[${this.temp.nonce}], ne=[${ne}]`)
            const rest: any = await mintCollections.find({accountScenes: this.temp.accountScenes});
            if (rest && rest.length > 0) {
                const d: MintData = rest[0];
                //must db ne < current ne
                if (new BigNumber(d.ne).comparedTo(new BigNumber(ne)) == -1) {
                    d.ne = ne;
                    d.nonce = nonce;
                    d.timestamp = Date.now();
                    await mintCollections.update(d)
                }
            } else {
                this.temp.ne = ne;
                this.temp.timestamp = Date.now();
                await mintCollections.insert(this.temp)
            }
        }
        return Promise.resolve();
    }

    handle = (e: any) => {
        if (e && e.data && e.data.method) {
            const message: Message = e.data;
            switch (message.method) {
                case Method.powInit:
                    this.init(message.data).then((rest: any) => {
                        message.result = rest
                        sendMessage(message)
                    }).catch((e: any) => {
                        console.error(e)
                        message.error = typeof e == "string" ? e : e.message;
                        sendMessage(message)
                    })
                    break;
                case Method.powStart:
                    this.start().then((rest: any) => {
                        message.result = rest
                        sendMessage(message)
                    }).catch((e: any) => {
                        console.error(e)
                        message.error = typeof e == "string" ? e : e.message;
                        sendMessage(message)
                    })
                    break;
                case Method.powStop:
                    this.stop(message.data).then((rest: any) => {
                        message.result = rest
                        sendMessage(message)
                    }).catch((e: any) => {
                        console.error(e)
                        message.error = typeof e == "string" ? e : e.message;
                        sendMessage(message)
                    })
                    break;
                case Method.powState:
                    this.mintState(message.data).then((rest: any) => {
                        message.result = rest
                        sendMessage(message)
                    }).catch((e: any) => {
                        console.error(e)
                        message.error = typeof e == "string" ? e : e.message;
                        sendMessage(message)
                    })
                    break;
                default:
                    break;
            }
        }
    }
}

function sendMessage(message: Message): void {
    console.log("send msg: ", message);
    // @ts-ignore
    self.postMessage(message)
}


export default Service