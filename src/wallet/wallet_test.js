"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethWallet_1 = require("./ethWallet");
var ethereumjs_wallet_1 = require("ethereumjs-wallet");
var bip39 = require("bip39");
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
var begin = Date.now();
var ethWallet = new ethWallet_1.default();
// const ethMnemonic:string = ethWallet.generateMnemonic()
var ethMnemonic = "diamond owner wash title love pluck upset enjoy ancient dog build price";
console.log(ethMnemonic, "ethMnemonic");
// ethWallet.importMnemonic(ethMnemonic,"12345678",0).then(keystore=>{
//     console.log(keystore,"keystore promise")
//
//     ethWallet = new EthWallet(keystore);
//     ethWallet.exportMnemonic("12345678").then(rest=>{
//         console.log(rest,"exportMnemonic promise")
//     })
//
// })
var seedBuffer = bip39.mnemonicToSeedSync(ethMnemonic);
var walletEth = ethereumjs_wallet_1.hdkey.fromMasterSeed(seedBuffer);
var acct = walletEth.derivePath("m/44'/195'/1'/0/0");
console.log(acct.getWallet().getPrivateKeyString(), "privateKey");
//0xdcf96f66f03ed0b89ed67ac92bc9161bd94956d37c4675a8907785927d1b44b0
// TKeifc3ocx7asvJFJRfR6tNsosqJeuGLhh
// 0DCF96F66F03ED0B89ED67AC92BC9161BD94956D37C4675A8907785927D1B44B TXkrpHWrXUE9NvCy14aytpZXH4NUSe1No5 Dc+W9m8D7QuJ7WeskryRYb2UlW03xGdaiQd4WSfRtEs=
//0x55ef03585da36f54542e6ec447190b86bc90b7d113a5f34d8d55acd33ee00414
// 055EF03585DA36F54542E6EC447190B86BC90B7D113A5F34D8D55ACD33EE0041 TERi9GYDModHHXCSsk33A3hBBTcLF5ZMjm BV7wNYXaNvVFQubsRHGQuGvJC30ROl802NVazTPuAEE=
//# sourceMappingURL=wallet_test.js.map