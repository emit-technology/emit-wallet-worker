import {ChainType, Message, Method} from "./types";
let worker:any;

class Index {

    callbackHandler: Map<number, any>;
    messageId: number;

    constructor() {
        const that = this;
        this.callbackHandler = new Map<number, any>();
        this.messageId = 0;
        // @ts-ignore
        // worker = new Worker(new URL("../src/service.js", import.meta.url) );
        worker = new Worker('./service.js', {type: 'module'});
        worker.onmessage = function (event: any) {
            if (event) {
                const msg = event.data;
                let cb = that.callbackHandler.get(msg.messageId);
                that.callbackHandler.delete(msg.messageId);
                if (cb && typeof cb === "function") {
                    cb(msg);
                }
            }
        }
    }

    handlerMsg(message: Message, cb: Function) {
        if (cb) {
            const msgId = this.messageId++;
            message.messageId = msgId;
            console.log("message>>", message);
            worker.postMessage(message);
            this.callbackHandler.set(msgId, cb)
        }
    }

    importMnemonic(data: importMnemonicProps, cb: Function) {
        let message: Message = {method: Method.importMnemonic, data: data}
        this.handlerMsg(message, cb);
    }

    importPrivateKey(data: importMnemonicProps, cb: Function) {
        let message: Message = {method: Method.importPrivateKey, data: data}
        this.handlerMsg(message, cb);
    }

    generateMnemonic(cb:Function) {
        let message: Message = {method: Method.generateMnemonic, data: null}
        this.handlerMsg(message, cb);
    }

    exportMnemonic(accountId: string, password: string, cb: any) {
        let message: Message = {method: Method.exportMnemonic, data: {password: password, accountId: accountId}}
        this.handlerMsg(message, cb);
    }

    exportKeystore(accountId: string, cb: Function) {
        let message: Message = {method: Method.exportKeystore, data: {accountId: accountId}}
        this.handlerMsg(message, cb);
    }

    exportPrivateKey(accountId: string,  password: string, cb: any) {
        let message: Message = {method: Method.exportPrivateKey, data: {password: password, accountId: accountId}}
        this.handlerMsg(message, cb);
    }

    accounts(cb: Function) {
        let message: Message = {method: Method.getAccountList, data: null}
        this.handlerMsg(message, cb);
    }

    accountInfo(accountId: string, cb:Function) {
        let message: Message = {method: Method.getAccountInfo, data: {accountId: accountId}}
        this.handlerMsg(message, cb);
    }

    signTx(accountId: string, password: string, chainType: ChainType, params: any,chainParams:any, cb: Function) {
        let message: Message = {
            method: Method.signTx,
            data: {accountId: accountId, password: password, chainType: chainType, params: params,chainParams:chainParams}
        }
        this.handlerMsg(message, cb);
    }

    execute(method: string, data: any, cb:Function) {
        let message: any = {method: method, data: data}
        this.handlerMsg(message, cb);
    }

    genNewWallet(data: any, cb:Function) {
        let message: any = {method: Method.genNewWallet, data: data}
        this.handlerMsg(message, cb);
    }

    unlockWallet(accountId: string, password: string, cb:Function){
        let message: any = {method: Method.unlockWallet, data: {accountId: accountId, password: password}}
        this.handlerMsg(message, cb);
    }

    isLocked(cb:Function){
        let message: any = {method: Method.isLocked, data: {}}
        this.handlerMsg(message, cb);
    }

    lockWallet(cb:Function){
        let message: any = {method: Method.lockWallet, data: {}}
        this.handlerMsg(message, cb);
    }

}

interface importMnemonicProps {
    name: string,
    password: string,
    hint: string,
    avatar: string,
    mnemonic: string
}

const service: Index = new Index();
export default service;