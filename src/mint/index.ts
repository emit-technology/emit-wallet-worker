import {Message, Method, MinerScenes, MintData} from "../types";

abstract class Mint {

    abstract handlerMsg (message: Message, cb: Function):void;

    mintInit = (data: MintData, cb: Function) => {
        let message: any = {method: Method.powInit, data: data}
        this.handlerMsg(message, cb);
    }

    mintStop = (accountId: string, cb: Function) => {
        let message: any = {method: Method.powStop, data: accountId}
        this.handlerMsg(message, cb);
    }

    mintState = (accountId: string, cb: Function) => {
        let message: any = {method: Method.powState, data: accountId}
        this.handlerMsg(message, cb);
    }

    mintStart = (cb: Function) => {
        let message: any = {method: Method.powStart,data:{}}
        this.handlerMsg(message, cb);
    }

}
// const mint: Mint = new Mint();
export default Mint;