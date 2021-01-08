/// <reference types="node" />
export interface Keystore {
    crypto?: {
        cipher: string;
        cipherparams: {
            iv: string;
        };
        ciphertext: string;
        kdf: string;
        kdfparams: ScryptKDFParamsOut;
        mac: string;
    };
    address: string;
    id: string;
    version: number;
}
export interface ScryptKDFParamsOut {
    dklen: number;
    n: number;
    p: number;
    r: number;
    salt: string;
}
export interface KeystoreParams {
    kdf: string;
    cipher: string;
    salt: Buffer;
    iv: Buffer;
    uuid: Buffer;
    dklen: number;
    c: number;
    n: number;
    r: number;
    p: number;
}
export interface TxParams {
    nonce?: string;
    gasPrice: string;
    gasLimit: string;
    to: string;
    value: string;
    data?: string;
}
export interface Message {
    messageId?: number;
    method: Method;
    data: any;
    error?: any;
    result?: any;
}
export declare enum Method {
    importMnemonic = 0,
    exportMnemonic = 1,
    signTx = 2,
    generateMnemonic = 3
}
export declare enum ChainType {
    SERO = 0,
    ETH = 1
}
export interface AccountModel {
    accountId: string;
    name: string;
    passwordHint?: string;
    avatar?: string;
}
export interface KeystoreWrapModel {
    chainType: ChainType;
    accountId: string;
    address: string;
    keystore: Keystore;
}
