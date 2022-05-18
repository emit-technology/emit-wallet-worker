import {IWallet, walletEx} from "./wallet";
import {Keystore, TxParams} from "../types";
import utils, {toBuffer} from "jsuperzk/dist/utils/utils";
import {hdkey,thirdparty} from 'ethereumjs-wallet';

import Wallet from 'ethereumjs-wallet';
import Common from 'ethereumjs-common'

const EthereumTx = require('ethereumjs-tx').Transaction
const bip39 = require("bip39");

class EthWallet extends IWallet{

    protected keystore:any ;

    constructor(keystore?:Keystore) {
        super();
        this.keystore = keystore;
    }


    getWallet = async (): Promise<Wallet> => {
        const signKey = await walletEx.getSignKey();
        return new Promise(((resolve, reject) => {
            if(!signKey){
                reject("wallet was unlock!")
            }
            if(signKey && signKey.split(" ").length == 12){
                const seedBuffer = bip39.mnemonicToSeedSync(signKey)
                const walletEth = hdkey.fromMasterSeed(seedBuffer)
                const acct = walletEth.derivePath(`m/44'/60'/0'/0/0`)
                resolve(acct.getWallet())
            }else{
                resolve(Wallet.fromPrivateKey(toBuffer(signKey)))
            }
        }))
    }

    async buildSerializedTx(txParams:TxParams,password:string,chainParams?:any):Promise<any> {
        if(this.keystore){
            // @ts-ignore
            // const wallet = await Wallet.fromV3(this.keystore,password)

            const customCommon = Common.forCustomChain(
                chainParams.baseChain,
                chainParams.customer,
                chainParams.hardfork
            )
            const wallet = await this.getWallet();
            const tx = new EthereumTx(txParams,{common:customCommon})
            tx.sign(wallet.getPrivateKey())

            const serializedTx = tx.serialize()
            return serializedTx.toString("hex");
        }
        return
    }

    exportMnemonic = async (password: string): Promise<string> =>{
        if(!this.keystore){
            throw new Error("keystore undefined!")
        }else{
            const wallet = await Wallet.fromV3(this.keystore,password)
            // const walletEth = hdkey.fromMasterSeed(wallet.getPrivateKey())
            // console.log("wallet.getPrivateKey()",wallet.getPrivateKeyString())
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
            const acct = walletEth.derivePath(`m/44'/60'/0'/0/0`)
            const data:any = await acct.getWallet().toV3(password);

            this.keystore = data;
            // const address = acct.getWallet().getAddressString();
            // this.keystore.address =address;

            return this.keystore;
        }
    }

}

export default EthWallet