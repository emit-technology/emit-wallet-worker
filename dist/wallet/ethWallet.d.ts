import { IWallet } from "./wallet";
import { Keystore, TxParams } from "../types";
declare class EthWallet extends IWallet {
    protected keystore: Keystore | undefined;
    constructor(keystore?: Keystore);
    buildSerializedTx(txParams: TxParams, password: string): Promise<any>;
    exportMnemonic(password: string): string;
    importMnemonic(mnemonic: string, password: string, blockNumber?: number): Keystore;
}
export default EthWallet;
