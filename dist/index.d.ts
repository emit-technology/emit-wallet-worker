import { ChainType, Message } from "./types";
declare class Index {
    callbackHandler: Map<number, any>;
    messageId: number;
    constructor();
    handlerMsg(message: Message, cb: any): void;
    importMnemonic(data: importMnemonicProps, cb: any): void;
    generateMnemonic(cb: any): void;
    exportMnemonic(accountId: string, password: string, cb: any): void;
    exportKeystore(accountId: string, cb: any): void;
    accounts(cb: any): void;
    signTx(accountId: string, password: string, chainType: ChainType, params: any, cb: any): void;
}
interface importMnemonicProps {
    name: string;
    password: string;
    hint: string;
    avatar: string;
    mnemonic: string;
}
declare const service: Index;
export default service;
