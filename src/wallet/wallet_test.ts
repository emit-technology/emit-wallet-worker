import {IWallet} from "./wallet";
import {SeroWallet} from './seroWallet'
import EthWallet from './ethWallet'
import {Keystore} from "../types";
import Wallet from 'ethereumjs-wallet'

const bip39 = require("bip39");

// const words = bip39.generateMnemonic();
// console.log(words);
//
// // test sero wallet
// const wallet:IWallet = new SeroWallet()
//
// const mnemonic:string = wallet.generateMnemonic();
// console.log("mnemonic>> ",mnemonic);
//
// const seed = bip39.mnemonicToEntropy(mnemonic);
// console.log("seed>> ",seed);
//
// const keystore:Keystore = wallet.importMnemonic(mnemonic,"12345678",0);
// console.log("keystore>> ",JSON.stringify(keystore));
//
// const exportWords = wallet.exportMnemonic("12345678")
// console.log(exportWords);


// test ethereum wallet

const begin:number = Date.now();

let ethWallet:IWallet = new EthWallet()
// const ethMnemonic:string = ethWallet.generateMnemonic()

const ethMnemonic = "diamond owner wash title love pluck upset enjoy ancient dog build price";
console.log(ethMnemonic,"ethMnemonic")
ethWallet.importMnemonic(ethMnemonic,"12345678",0).then(keystore=>{
    console.log(keystore,"keystore promise")

    ethWallet = new EthWallet(keystore);
    ethWallet.exportMnemonic("12345678").then(rest=>{
        console.log(rest,"exportMnemonic promise")
    })

})





