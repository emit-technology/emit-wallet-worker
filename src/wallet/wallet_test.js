"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethWallet_1 = require("./ethWallet");
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
ethWallet.importMnemonic(ethMnemonic, "12345678", 0).then(function (keystore) {
    console.log(keystore, "keystore promise");
    ethWallet = new ethWallet_1.default(keystore);
    ethWallet.exportMnemonic("12345678").then(function (rest) {
        console.log(rest, "exportMnemonic promise");
    });
});
//# sourceMappingURL=wallet_test.js.map