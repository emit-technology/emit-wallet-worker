import Mint from "../index";
import {Message} from "../../types";

const callbackHandler: Map<number, Function> = new Map<number, Function>()
const worker = new Worker("./service.js", {name: `mint-worker-chaos`, type: 'module'});

worker.onmessage = function (event: any) {
    if (event) {
        const msg = event.data;
        let cb = callbackHandler.get(msg.messageId);
        callbackHandler.delete(msg.messageId);
        if (cb && typeof cb === "function") {
            cb(msg);
        }
    }
}

class Miner extends Mint {
    messageId: number;

    constructor() {
        super()
        this.messageId = 0 ;
    }

    handlerMsg = (message: Message, cb: Function) => {
        if (cb) {
            const msgId = this.messageId++;
            message.messageId = msgId;
            worker.postMessage(message);
            callbackHandler.set(msgId, cb)
        }
    }

}
const miner = new Miner()

export default miner