/// <reference types="node" />
import { Keystore, KeystoreParams, ScryptKDFParamsOut, TxParams } from '../types';
import * as crypto from "crypto";
export declare abstract class IWallet {
    abstract buildSerializedTx(txParams: TxParams, password: string): Promise<any>;
    abstract exportMnemonic(password: string): string;
    abstract importMnemonic(mnemonic: string, password: string, blockNumber?: number): any;
    generateMnemonic(): string;
    protected genKeystore(seed: Buffer, password: string, version: number): Keystore;
    protected kdfParamsForScrypt(opts: KeystoreParams): ScryptKDFParamsOut;
    protected keyExists(k: Buffer | undefined | null): k is Buffer;
    protected decryptKeystore(input: string | Keystore, password: string): Buffer;
    protected runCipherBuffer(cipher: crypto.Cipher | crypto.Decipher, data: Buffer): Buffer;
}
