import {AccountModel, ChainType, Keystore, KeystoreParams, ScryptKDFParamsOut, TxParams} from '../types';
import {toBuffer} from "jsuperzk/dist/utils/utils";
import * as crypto from "crypto";
import Wallet from "ethereumjs-wallet";
import {accountCollection} from "../collection";
import {Decrypt, Encrypt} from "../utils/crypto";

const randomBytes = require("randombytes");
const scryptsy = require("scrypt.js");
const uuidv4 = require("uuid/v4");
const keccak256 = require("keccak256");
const bip39 = require("bip39");
const CryptoJS = require("crypto-js");

class WalletEx{

    private pKey:string;
    private accountId:string

    getPKey = (p:string,accountId:string)=>{
        return CryptoJS.SHA256([p,accountId].join("")).toString()
    }

    async setSignKey(signKey: string,password:string,accountId:string){
        const pKey = this.getPKey(password,accountId)
        const rest:Array<AccountModel> = await accountCollection.find({accountId:accountId})
        if(rest && rest.length>0){
            const account = rest[0];
            account.key = Encrypt({key:signKey},pKey)
                // CryptoJS.AES.encrypt(signKey, pKey).toString();
            await accountCollection.update(account)
            this.pKey = pKey;
            this.accountId = accountId
            return Promise.resolve(true)
        }
        return Promise.reject("account not find!")
    }

    lock = ()=>{
        this.pKey = ""
        this.accountId = ""
    }

    async unLock(accountId:string,password?:string){
        let pKey = this.pKey;
        if(password){
            pKey = this.getPKey(password,accountId)
        }
        const rest:Array<AccountModel> = await accountCollection.find({accountId:accountId})
        if(rest && rest.length>0){
            const account = rest[0];
            const entry  = Decrypt(account.key, pKey)
                //CryptoJS.AES.decrypt(account.key, pKey);
            if(!entry || !entry.key){
                return Promise.reject("Invalid Password!")
            }
            this.pKey = pKey;
            this.accountId = accountId
            return Promise.resolve(entry.key)
        }
        return Promise.reject("account not find!")
    }

    async getSignKey(){
        if(!this.pKey){
            return Promise.reject("wallet is unlock!")
        }
        const rest = await this.unLock(this.accountId)
        return rest;
    }

    getP(){
        return this.pKey;
    }
}

const walletEx = new WalletEx();

export {
    walletEx
}

export abstract class IWallet {

    abstract buildSerializedTx(txParams:TxParams,password:string,chainParams?:any):Promise<any>;

    abstract exportMnemonic(password: string): Promise<string>;

    abstract importMnemonic(mnemonic: string, password: string, blockNumber?: number): any;

    abstract getWallet(): Promise<Wallet>;

    generateMnemonic(): string {
        return bip39.generateMnemonic();
    }

    protected genKeystore(
        seed: Buffer,
        password: string,
        version: number
    ): Keystore {
        if (!this.keyExists(seed)) {
            throw new Error("This is a public key only wallet");
        }
        const scryptParams: KeystoreParams = {
            cipher: "aes-128-ctr",
            kdf: "scrypt",
            salt: randomBytes(32),
            iv: randomBytes(16),
            uuid: randomBytes(16),
            dklen: 32,
            c: 262144,
            n: 262144,
            r: 8,
            p: 1
        };
        const kdfParams = this.kdfParamsForScrypt(scryptParams);
        const derivedKey = scryptsy(
            Buffer.from(password),
            toBuffer(kdfParams.salt),
            kdfParams.n,
            kdfParams.r,
            kdfParams.p,
            kdfParams.dklen
        );
        const cipher = crypto.createCipheriv(
            scryptParams.cipher,
            derivedKey.slice(0, 16),
            scryptParams.iv
        );
        if (!cipher) {
            throw new Error("Unsupported cipher");
        }
        const ciphertext = this.runCipherBuffer(cipher, seed);
        const mac = keccak256(
            Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext)])
        );

        kdfParams.salt = kdfParams.salt;
        return {
            version: version,
            id: uuidv4({ random: scryptParams.uuid }),
            address: "",
            crypto: {
                ciphertext: ciphertext.toString("hex"),
                cipherparams: { iv: scryptParams.iv.toString("hex") },
                cipher: scryptParams.cipher,
                kdf: scryptParams.kdf,
                kdfparams: kdfParams,
                mac: mac.toString("hex")
            },
        };
    }

    protected kdfParamsForScrypt(opts: KeystoreParams): ScryptKDFParamsOut {
        return {
            dklen: opts.dklen,
            salt: opts.salt.toString("hex"),
            n: opts.n,
            r: opts.r,
            p: opts.p
        };
    }

    protected keyExists(k: Buffer | undefined | null): k is Buffer {
        return k !== undefined && k !== null;
    }

    protected decryptKeystore(input: string | Keystore, password: string): Buffer {
        const json = typeof input === "object" ? input : JSON.parse(input);
        let derivedKey;
        let kdfparams;
        if (json.crypto.kdf === "scrypt") {
            kdfparams = json.crypto.kdfparams;
            derivedKey = scryptsy(
                Buffer.from(password),
                toBuffer(kdfparams.salt),
                kdfparams.n,
                kdfparams.r,
                kdfparams.p,
                kdfparams.dklen
            );
        } else {
            throw new Error("Unsupported key derivation scheme");
        }
        const ciphertext = Buffer.from(json.crypto.ciphertext, "hex");
        const mac = keccak256(Buffer.concat([derivedKey.slice(16, 32), ciphertext]));
        if (mac.toString("hex") !== json.crypto.mac) {
            throw new Error("Key derivation failed - possibly wrong passphrase");
        }
        const decipher = crypto.createDecipheriv(
            json.crypto.cipher,
            derivedKey.slice(0, 16),
            Buffer.from(json.crypto.cipherparams.iv, "hex")
        );
        return this.runCipherBuffer(decipher, ciphertext);
    }

    protected runCipherBuffer(
        cipher: crypto.Cipher | crypto.Decipher,
        data: Buffer
    ): Buffer {
        return Buffer.concat([cipher.update(data), cipher.final()]);
    }
}


