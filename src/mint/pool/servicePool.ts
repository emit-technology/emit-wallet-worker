import {AccountModel, ChainType, Message, Method, MintData, MintState} from "../../types";
import {accountCollection, mintCollections} from "../../collection";
import BigNumber from "bignumber.js";
import rpc from "../../rpc";
import config from "../../config";

const BN = require("bn.js");
const keccak256 = require("keccak256");
const MAX_UINT256 = new BN(2).pow(new BN(256)).sub(new BN(1));

function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}


class Service {

    temp: MintData
    address:string

    fetchInterValId:any;

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
        if(this.temp.state == MintState.running){
            return
        }
        const _serail = new BigNumber(param.index).plus(1);
        const hashseed = this.genHashSeed(param.phash, param.address, "0x"+_serail.toString(16));
        const rest: any = await mintCollections.find({accountScenes: param.accountScenes});

        this.temp.phash = param.phash;
        this.temp.address = param.address;
        this.temp.index = param.index;
        this.temp.scenes = param.scenes;
        this.temp.accountScenes = param.accountScenes;
        this.temp.accountId = param.accountId;
        this.temp.isPool = param.isPool;
        this.temp.taskId = param.taskId;
        this.temp.period = param.period;
        this.temp.minNE = param.minNE;

        const restAcc = await accountCollection.find({accountId:this.temp.accountId})
        if (restAcc && restAcc.length > 0) {
            const account: AccountModel = restAcc[0];
            this.address = account.addresses[ChainType.SERO]
        }

        if (rest && rest.length > 0) {
            const d: MintData = rest[0];
            const seed = this.genHashSeed(d.phash, d.address, "0x"+new BigNumber(d.index).plus(1).toString(16));
            const buf = new BN(d.nonce).toArrayLike(Buffer, "be", 8);
            const ne = this.calcNE(seed,buf)
            console.log(d.phash != param.phash || d.index != param.index || d.address != param.address || ne != d.ne  || d.period != param.period, d.period != param.period,d.period,param.period)
            if (d.phash != param.phash || d.index != param.index || d.address != param.address || ne != d.ne  || d.period != param.period) {
                d.ne = "0"
                d.nonce = "0"
            }
            d.phash = param.phash;
            d.address = param.address;
            d.index = param.index;
            d.scenes = param.scenes;
            d.hashseed = hashseed;
            d.period=param.period;
            // this.temp.nonce = d.nonce;
            this.temp.ne = d.ne ? d.ne : "0";
            if(param.minNE && new BigNumber(d.ne).toNumber() >= new BigNumber(param.minNE).toNumber()){
                try{
                    await this.subWork(d.ne,d.nonce)
                }catch (e){
                    console.error(e)
                }
            }
            await mintCollections.update(d)
        } else {
            this.temp.ne = "0"
            this.temp.timestamp = Date.now();
            await mintCollections.insert(this.temp)
        }

        this.temp.hashseed = hashseed
        this.temp.nonce = random(0, 2 ** 64).toString()
        this.temp.timestamp = Date.now();
        this.temp.hashrate = {
            h:this.temp.nonce,
            t:this.temp.timestamp,
            o:0
        };
    }

    start = async (accountScenes: string) => {
        console.log("Miner started!")
        const rest: any = await mintCollections.find({accountScenes: accountScenes});
        if (rest && rest.length > 0) {
            const d: MintData = rest[0];
            this.temp.state = MintState.running;
            await mintCollections.update(d)
            this.execute();
        }
        this.fetchInterVal();
        return
    }

    stop = async (accountScenes: string) => {
        this.temp.state = MintState.stop;
        clearInterval(this.fetchInterValId);

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
        }else{
            this.temp.hashrate={
                h:this.temp.nonce,
                t:this.temp.timestamp,
                o:new BigNumber(this.temp.nonce).minus(this.temp.nonce).dividedBy((Date.now()-this.temp.timestamp)/1000).toNumber()
            }
        }
        if (rest && rest.length > 0) {
            this.temp.nonceDes = rest[0].nonce;
        }
        return this.temp
    }

    fetchInterVal = ()=>{
        if(this.fetchInterValId){
            clearInterval(this.fetchInterValId)
        }
        this.fetchInterValId = setInterval(()=>{
            this.reFetchPImage().then((mintData:MintData)=>{
                this.stop(this.temp.accountScenes).then(()=>{
                    this.init(mintData).then(()=>{
                        this.start(this.temp.accountScenes).catch(e=>{
                            console.log(e)
                        }).catch(e=>{
                            setTimeout(()=>{
                                this.start(this.temp.accountScenes).catch(e=>{
                                    console.log(e)
                                })
                            },10*1000)
                        })
                    }).catch(e=>{
                        console.log(e)
                        setTimeout(()=>{
                            this.start(this.temp.accountScenes).catch(e=>{
                                console.log(e)
                            })
                        },10*1000)
                    })
                }).catch(e=>{
                    console.log(e)
                })
            }).catch(e=>{
                // not need restart miner
            })
        },20 * 1000)
    }

    reFetchPImage = async ():Promise<MintData> =>{
        const rest:any = await rpc.jsonRpc([config.POOL_HOST,this.address].join("/"),"epoch_taskImage",[new BigNumber(this.temp.taskId).toNumber()])
        if(!rest){
            return Promise.reject("rest is null")
        }
        //owner, scenes_,serial,bytes32 phash,uint256 minNE
        if(!rest || rest.length == 0 ){
            return
        }
        if(rest[0] != this.temp.address
            || "0x"+new BigNumber(rest[2]).toString(16) != this.temp.index
            || rest[3] != this.temp.phash
            || rest[5] != this.temp.period
        ){
            const mintData:MintData = this.temp
            mintData.phash = rest[3];
            mintData.index = "0x"+new BigNumber(rest[2]).toString(16);
            mintData.address = rest[0];
            mintData.period = rest[5];
            mintData.minNE = rest[4];
            return Promise.resolve(mintData)
        }

        return Promise.reject(false)
    }

    subWork = async (ne:any,nonce:any)=>{
        if(new BigNumber(ne).toNumber()>0){
            const param = {
                ne: "0x"+new BigNumber(ne).toString(16),
                nonce:"0x"+new BigNumber(nonce).toString(16),
                phash:this.temp.phash,
                serial: new BigNumber(this.temp.index).toNumber(),
                taskId:new BigNumber(this.temp.taskId).toNumber(),
                hashRate: this.temp.hashrate && this.temp.hashrate.o ?this.temp.hashrate.o:0
            }
            return new Promise((resolve, reject)=> {
                rpc.jsonRpc([config.POOL_HOST,this.address].join("/"),"epoch_submitWork",[JSON.stringify(param)]).then(()=>{
                    this.temp.timestamp = Date.now()
                    this.temp.nonce = random(0, 2 ** 64).toString()
                    this.temp.hashrate = {
                        h:this.temp.nonce,
                        t:Date.now(),
                        o:0
                    };
                    resolve(true)
                }).catch((e:any)=>{
                    const err = typeof e == "string"?e:e.message;
                    if(err == "task has closed"){
                        this.stop(this.temp.accountScenes)
                    }
                    this.temp.timestamp = Date.now()
                    this.temp.nonce = random(0, 2 ** 64).toString()
                    this.temp.hashrate = {
                        h:this.temp.nonce,
                        t:Date.now(),
                        o:0
                    };
                    reject(e)
                })
            })
        }
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
            console.log(`execute err >>> [${err}]`)
            console.error(e)
            setTimeout(() => {
                this.stop(this.temp.accountScenes).then(()=>{
                    this.init(this.temp).then(()=>{
                        this.start(this.temp.accountScenes)
                    })
                })
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
            try{
                if(this.temp.minNE && new BigNumber(this.temp.minNE).comparedTo(new BigNumber(ne)) < 1){
                    await this.subWork(ne,nonce)
                }
            }catch (e){
                console.error(e)
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