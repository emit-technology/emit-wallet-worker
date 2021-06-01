import {IWallet} from "./wallet";
import {Keystore, TxParams} from "../types";
import {hdkey,thirdparty} from 'ethereumjs-wallet';

import Wallet from 'ethereumjs-wallet';

import {getBase58CheckAddress, genPriKey,hexStr2byteArray, getAddressFromPriKey} from "tron-lib/src/utils/crypto"
import {toBuffer} from "jsuperzk/dist/utils/utils";
import {walletEx} from "./wallet";

const EthereumTx = require('ethereumjs-tx').Transaction
const bip39 = require("bip39");

const HOST = "https://api.trongrid.io/"
const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider(HOST);
const solidityNode = new HttpProvider(HOST);
const eventServer = new HttpProvider(HOST);
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer);

class TronWallet extends IWallet{

    protected keystore:any ;

    constructor(keystore?:Keystore) {
        super();
        this.keystore = keystore;
    }

    getWallet = async (): Promise<Wallet> => {
        const signKey =await walletEx.getSignKey();
        return new Promise(((resolve, reject) => {
            if(!signKey){
                reject("wallet was unlock!")
            }
            if(signKey && signKey.split(" ").length == 12){
                const seedBuffer = bip39.mnemonicToSeedSync(signKey)
                const walletEth = hdkey.fromMasterSeed(seedBuffer)
                const acct = walletEth.derivePath(`m/44'/195'/0'/0/0`)
                resolve(acct.getWallet())
            }else{
                resolve(Wallet.fromPrivateKey(toBuffer(signKey)))
            }
        }))
    }

    async buildSerializedTx(txParams:any,password:string,chainParams?:any):Promise<any> {
        if(this.keystore){
            // @ts-ignore
            // const wallet = await Wallet.fromV3(this.keystore,password)
            let wallet = await this.getWallet();
            return new Promise((resolve, reject)=>{
                tronWeb.trx.sign(txParams, wallet.getPrivateKeyString().slice(2)).then(rest=>{
                    resolve(rest)
                    return;
                }).catch(e=>{
                    const err = typeof e == "string"?e:e.message;
                    if(err == "Private key does not match address in transaction"){
                        Wallet.fromV3(this.keystore,walletEx.getP()).then(w=>{
                            tronWeb.trx.sign(txParams, w.getPrivateKeyString().slice(2)).then(r=>{
                                resolve(r)
                                return;
                            }).catch(e=>{
                                reject(e)
                                return;
                            })
                        }).catch(ew=>{
                            reject(ew)
                            return;
                        })
                    }else{
                        reject(e)
                        return;
                    }
                })
            })
        }
        return
    }

    exportMnemonic = async (password: string): Promise<string> =>{
        if(!this.keystore){
            throw new Error("keystore undefined!")
        }else{
            const wallet = await Wallet.fromV3(this.keystore,password)
            // const walletEth = hdkey.fromMasterSeed(wallet.getPrivateKey())
            return bip39.entropyToMnemonic(wallet.getPrivateKey().slice(0,16));
        }
    }

    async importMnemonic(mnemonic: string, password: string, blockNumber?: number): Promise<any> {
        const mnemonicSlice:Array<string> = mnemonic.split(" ");
        if (mnemonicSlice.length != 12) {
            throw new Error("invalid mnemonic!");
        }
        if (!bip39.validateMnemonic(mnemonic)) {
            throw new Error("invalid mnemonic!");
        } else {
            const seedBuffer = bip39.mnemonicToSeedSync(mnemonic)
            const walletEth = hdkey.fromMasterSeed(seedBuffer)
            const acct = walletEth.derivePath(`m/44'/195'/0'/0/0`)
            const data:any = await acct.getWallet().toV3(password);

            data.address = getBase58CheckAddress(getAddressFromPriKey(acct.getWallet().getPrivateKey()));
            this.keystore = data;
            return this.keystore;
        }
    }

}

export default TronWallet