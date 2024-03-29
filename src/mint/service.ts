import {HashRate, Message, Method, MintData, MintState} from "../types";
import {mintCollections} from "../collection";
import BigNumber from "bignumber.js";
import rpc from "../rpc";
import config from "../config";

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
        // if(this.temp.state == MintState.running){
        //     return
        // }
        const _serail = new BigNumber(param.index).plus(1);
        const hashseed = this.genHashSeed(param.phash, param.address, "0x"+_serail.toString(16));
        const rest: any = await mintCollections.find({accountScenes: param.accountScenes});
        this.temp = param;

        let remote:any = {}
        try{
            const remote1 = await rpc.post(`${config.NE_HOST}/hashrate/one`,{
                phash:param.phash.slice(2),
                shortAddress:param.address.slice(2),
                serial:_serail
            })
            const remote2 = await rpc.post(`${config.NE_HOST}/hashrate/one`,{
                phash:param.phash.slice(2),
                shortAddress:param.address.slice(2),
                serial:_serail,
                scenes: param.scenes
            })
            if(!remote1 || remote1.code == -1){
                if(!remote2 || remote2.code == -1){
                }else{
                    remote = remote2;
                }
            }else{
                if(!remote2 || remote2.code == -1){
                    remote = remote1;
                }else{
                    if(new BigNumber(remote1.lastNe).toNumber()<new BigNumber(remote2.lastNe).toNumber()){
                        remote = remote2;
                    }else{
                        remote = remote1;
                    }
                }
            }
            console.log(remote,"remote>>")
        }catch (e){
            console.error(e)
        }

        if (rest && rest.length > 0) {
            const d: MintData = rest[0];

            const seed = this.genHashSeed(d.phash, d.address, "0x"+new BigNumber(d.index).plus(1).toString(16));
            const buf = new BN(d.nonce).toArrayLike(Buffer, "be", 8);
            const ne = this.calcNE(seed,buf)

            if (d.phash != param.phash || d.index != param.index || d.address != param.address || ne != d.ne) {
                if(remote && remote.shortAddress){
                    d.ne = remote.lastNe;
                    d.nonce = remote.nonce;
                }else{
                    d.ne = "0"
                    d.nonce = "0"
                }
            }else{
                if(remote && remote.shortAddress && new BigNumber(d.ne).toNumber()<new BigNumber(remote.lastNe).toNumber()){
                    d.ne = remote.lastNe;
                    d.nonce = remote.nonce;
                }
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
            if(remote && remote.shortAddress){
                this.temp.ne = remote.lastNe;
                this.temp.nonce = remote.nonce;
            }
            await mintCollections.insert(this.temp)
        }

        this.temp.hashseed = hashseed
        this.temp.nonce = param.nonce ? param.nonce : random(0, 2 ** 64).toString()
        this.temp.timestamp = Date.now();
        this.temp.hashrate = {
            h:this.temp.nonce,
            t:this.temp.timestamp,
            o:0
        };
    }

    start = async (accountScenes:string) => {
        console.log("Miner started!")
        const rest: any = await mintCollections.find({accountScenes: accountScenes});
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
        const rest: any = await mintCollections.find({accountScenes: accountScenes});
        if (!this.temp || !this.temp.timestamp) {
            if (rest && rest.length > 0) {
                return rest[0]
            }
        }
        if(this.temp.hashrate){
            this.temp.hashrate.o = new BigNumber(this.temp.nonce).minus(this.temp.hashrate.h).dividedBy((Date.now()-this.temp.hashrate.t)/1000).toNumber()
        }
        if (rest && rest.length > 0) {
            this.temp.nonceDes = rest[0].nonce;
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
            //TODO
            this.temp.ne = ne;
            this.temp.timestamp = Date.now()

            console.log(`index=[${this.temp.index}], nonce=[${this.temp.nonce}], ne=[${ne}]`)
            const rest: any = await mintCollections.find({accountScenes: this.temp.accountScenes});
            if (rest && rest.length > 0) {
                this.temp.ne = ne;
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

            const hr:HashRate = {
                phase: 0,
                address: this.temp.address.slice(2),
                shortAddress: this.temp.address.slice(2),
                phash: this.temp.phash.slice(2),
                serial: new BigNumber(this.temp.index).plus(1).toNumber(),
                nonce: nonce,
                // ne: string;
                lastNe: new BigNumber(this.temp.ne).toNumber(),
                timestamp: this.temp.hashrate.t,
                hashRate: this.temp.hashrate.o,
                scenes:this.temp.scenes
            }
            await rpc.post(`${config.NE_HOST}/hashrate/save`,hr)

            this.temp.nonce = random(0, 2 ** 64).toString()
            this.temp.hashrate = {
                h:this.temp.nonce,
                t:this.temp.timestamp,
                o:0
            };
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
                    this.start(message.data).then((rest: any) => {
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
    // console.log("send msg: ", message);
    // @ts-ignore
    self.postMessage(message)
}


export default Service