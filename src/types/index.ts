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
    tk?: string;
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
    messageId?: number,
    method: Method
    data: any
    error?: any
    result?: any
}

export enum Method {
    _,
    importMnemonic,
    exportMnemonic,
    signTx,
    generateMnemonic,
    getAccountInfo,
    getAccountList,
    exportKeystore,
    execute,
    exportPrivateKey,
    importPrivateKey,
    genNewWallet,
    unlockWallet,
    isLocked,

    powStart,
    powStop,
    powState,
    powClear,
    powInit
}

export enum ChainType {
    _,
    SERO,
    ETH,
    TRON
}

export interface AccountModel {
    accountId: string
    name: string
    passwordHint?: string
    avatar?: string
    addresses: any //{chainType:address}
    createType: CreateType
}

export interface KeystoreWrapModel {
    chainType: ChainType
    accountId: string
    address: string
    keystore: Keystore
}

export enum CreateType {
    Mnemonic,
    PrivateKey,
    Generate
}

// export interface Transaction {
//     chain: ChainType
//     hash: string
//     from: string
//     to: string
//     value: string
//     cy: string
//     gas: string
//     gasPrice: string
//     data?: string
//     contractAddress?: string
//     timestamp: number
// }

export interface MintData {
    accountScenes: string
    scenes: any
    phash: string
    address: string
    index: string
    accountId: string
    hashseed?: string
    ne?: string
    nonce?: string
    nonceDes?: string
    timestamp?: number
    state?: MintState
    hashrate?: {
        h:string
        t:number
        o:number
    }
}

export enum MintState {
    _,
    running,
    stop
}

export enum MinerScenes {
    _,
    altar,
    chaos
}