import {Message, Method, MinerScenes, MintData} from "../types";

abstract class Mint {

    abstract handlerMsg (message: Message, cb: Function):void;

    mintInit = (data: MintData, cb: Function) => {
        let message: any = {method: Method.powInit, data: data}
        this.handlerMsg(message, cb);
    }

    mintStop = (accountScenes: string, cb: Function) => {
        let message: any = {method: Method.powStop, data: accountScenes}
        this.handlerMsg(message, cb);
    }

    mintState = (accountScenes: string, cb: Function) => {
        let message: any = {method: Method.powState, data: accountScenes}
        this.handlerMsg(message, cb);
    }

    mintStart = (accountScenes: string,cb: Function) => {
        let message: any = {method: Method.powStart,data:accountScenes}
        this.handlerMsg(message, cb);
    }

    getEpochPollKeys = (cb: Function) => {
        let message: any = {method: Method.getEpochPollKeys}
        this.handlerMsg(message, cb);
    }

}
// const mint: Mint = new Mint();
export default Mint;