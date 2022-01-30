import {IWallet} from "./wallet";
import {SeroWallet} from './seroWallet'
import EthWallet from './ethWallet'
import {Keystore} from "../types";
import Wallet, {hdkey} from 'ethereumjs-wallet'
import * as superzk from "jsuperzk/dist/protocol/account";
import {createPkrHash,createOldPkrHash} from 'jsuperzk/src/wallet/wallet'

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
// })

// const begin = Date.now();
// const seedBuffer = bip39.mnemonicToSeedSync("")
// const walletEth = hdkey.fromMasterSeed(seedBuffer)
// const acct = walletEth.derivePath(`m/44'/60'/0'/0/0`)
// const end = Date.now();
// console.log(acct.getWallet().getPrivateKeyString())

// console.log(acct.getWallet().getPrivateKeyString(),"privateKey cost:",end-begin);

//0xdcf96f66f03ed0b89ed67ac92bc9161bd94956d37c4675a8907785927d1b44b0
// TKeifc3ocx7asvJFJRfR6tNsosqJeuGLhh
// 0DCF96F66F03ED0B89ED67AC92BC9161BD94956D37C4675A8907785927D1B44B TXkrpHWrXUE9NvCy14aytpZXH4NUSe1No5 Dc+W9m8D7QuJ7WeskryRYb2UlW03xGdaiQd4WSfRtEs=


//0x55ef03585da36f54542e6ec447190b86bc90b7d113a5f34d8d55acd33ee00414

// 055EF03585DA36F54542E6EC447190B86BC90B7D113A5F34D8D55ACD33EE0041 TERi9GYDModHHXCSsk33A3hBBTcLF5ZMjm BV7wNYXaNvVFQubsRHGQuGvJC30ROl802NVazTPuAEE=
const phrase = ""
const seedBuffer = bip39.mnemonicToSeedSync(phrase)
const walletEth = hdkey.fromMasterSeed(seedBuffer)
const acct = walletEth.derivePath(`m/44'/195'/0'/0/0`)
console.log("acct.getWallet().getPrivateKeyString()::",acct.getWallet().getPrivateKeyString())


