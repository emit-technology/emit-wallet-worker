import { Keystore } from '../types';
import { IWallet } from "./wallet";
export declare class SeroWallet extends IWallet {
    protected keystore: Keystore | undefined;
    constructor(keystore?: Keystore);
    buildSerializedTx(txParams: any, password: string): Promise<any>;
    getSK(password: string): any;
    getTK(password: string): string;
    getPK(password: string): any;
    exportMnemonic(password: string): string;
    importMnemonic(mnemonic: string, password: string, blockNumber?: number): Keystore;
}
