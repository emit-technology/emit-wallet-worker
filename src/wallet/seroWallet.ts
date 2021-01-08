import {Keystore,TxParams} from '../types';
import {toBuffer} from "jsuperzk/dist/utils/utils";
import {createPkrHash} from 'jsuperzk/dist/wallet/wallet'
import * as superzk from "jsuperzk/dist/protocol/account";
import {IWallet} from "./wallet";
import {signTx} from "jsuperzk/dist/tx/tx";
import EthWallet from "./ethWallet";
import Wallet, {hdkey} from "ethereumjs-wallet";

const bip39 = require("bip39");

export class SeroWallet extends IWallet{

    protected keystore:any | undefined;

    constructor(keystore?:Keystore) {
        super();
        this.keystore = keystore;
    }

    async buildSerializedTx(txParams: any, password: string): Promise<any> {
        return signTx(await this.getSK(password), txParams)
    }

    async getSK(password:string){
        if (this.keystore) {
            const wallet = await Wallet.fromV3(this.keystore,password)
            return superzk.seed2Sk(wallet.getPrivateKey(), 1);
        } else {
            return "";
        }
    }

    exportMnemonic(password: string): Promise<string> {
        if(!this.keystore){
            throw new Error("keystore undefined!")
        }else{
            const seed = this.decryptKeystore(this.keystore, password);
            return bip39.entropyToMnemonic(seed.slice(0,16));
        }
    }

    importMnemonic = async (mnemonic: string, password: string, keystore?:any,blockNumber?: number): Promise<Keystore> => {
        const version = 1;

        const seedB = bip39.mnemonicToSeedSync(mnemonic)
        const walletEth = hdkey.fromMasterSeed(seedB)
        const acct = walletEth.derivePath(`m/44'/60'/0'/0/0`)
        const sk = superzk.seed2Sk(acct.getWallet().getPrivateKey(), version);
        const tk = superzk.sk2Tk(sk);
        const address = createPkrHash(tk, 1, version)//superzk.tk2PK(tk);
        let keystoreRet:any = {};
        if(!keystore) {
            const mnemonicSlice: Array<string> = mnemonic.split(" ");
            if (mnemonicSlice.length != 12) {
                throw new Error("invalid mnemonic!");
            }
            if (!bip39.validateMnemonic(mnemonic)) {
                throw new Error("invalid mnemonic!");
            } else {
                const seed: string = bip39.mnemonicToEntropy(mnemonic) + "00000000000000000000000000000000";
                const seedBuffer:Buffer = toBuffer(seed);
                const walletEth = Wallet.fromPrivateKey(seedBuffer);
                keystoreRet = await walletEth.toV3(password);
            }
        }else {
            keystoreRet = keystore;
        }

        keystoreRet.tk = tk;
        keystoreRet.address = address;

        return keystoreRet;
    }
}