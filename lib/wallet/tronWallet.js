"use strict";var __extends=this&&this.__extends||function(){var n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)};return function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}}(),__awaiter=this&&this.__awaiter||function(e,a,l,s){return new(l=l||Promise)(function(r,t){function n(e){try{o(s.next(e))}catch(e){t(e)}}function i(e){try{o(s.throw(e))}catch(e){t(e)}}function o(e){var t;e.done?r(e.value):((t=e.value)instanceof l?t:new l(function(e){e(t)})).then(n,i)}o((s=s.apply(e,a||[])).next())})},__generator=this&&this.__generator||function(r,n){var i,o,a,l={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]},e={next:t(0),throw:t(1),return:t(2)};return"function"==typeof Symbol&&(e[Symbol.iterator]=function(){return this}),e;function t(t){return function(e){return function(t){if(i)throw new TypeError("Generator is already executing.");for(;l;)try{if(i=1,o&&(a=2&t[0]?o.return:t[0]?o.throw||((a=o.return)&&a.call(o),0):o.next)&&!(a=a.call(o,t[1])).done)return a;switch(o=0,a&&(t=[2&t[0],a.value]),t[0]){case 0:case 1:a=t;break;case 4:return l.label++,{value:t[1],done:!1};case 5:l.label++,o=t[1],t=[0];continue;case 7:t=l.ops.pop(),l.trys.pop();continue;default:if(!(a=0<(a=l.trys).length&&a[a.length-1])&&(6===t[0]||2===t[0])){l=0;continue}if(3===t[0]&&(!a||t[1]>a[0]&&t[1]<a[3])){l.label=t[1];break}if(6===t[0]&&l.label<a[1]){l.label=a[1],a=t;break}if(a&&l.label<a[2]){l.label=a[2],l.ops.push(t);break}a[2]&&l.ops.pop(),l.trys.pop();continue}t=n.call(r,l)}catch(e){t=[6,e],o=0}finally{i=a=0}if(5&t[0])throw t[1];return{value:t[0]?t[1]:void 0,done:!0}}([t,e])}}};Object.defineProperty(exports,"__esModule",{value:!0});var wallet_1=require("./wallet"),ethereumjs_wallet_1=require("ethereumjs-wallet"),ethereumjs_wallet_2=require("ethereumjs-wallet"),crypto_1=require("tron-lib/src/utils/crypto"),utils_1=require("jsuperzk/dist/utils/utils"),wallet_2=require("./wallet"),EthereumTx=require("ethereumjs-tx").Transaction,bip39=require("bip39"),HOST="https://api.trongrid.io/",TronWeb=require("tronweb"),HttpProvider=TronWeb.providers.HttpProvider,fullNode=new HttpProvider(HOST),solidityNode=new HttpProvider(HOST),eventServer=new HttpProvider(HOST),tronWeb=new TronWeb(fullNode,solidityNode,eventServer),TronWallet=function(r){function e(e){var t=r.call(this)||this;return t.getWallet=function(){return __awaiter(t,void 0,void 0,function(){var r;return __generator(this,function(e){switch(e.label){case 0:return[4,wallet_2.walletEx.getSignKey()];case 1:return r=e.sent(),[2,new Promise(function(e,t){r||t("wallet was unlock!"),r&&12==r.split(" ").length?(t=bip39.mnemonicToSeedSync(r),e(ethereumjs_wallet_1.hdkey.fromMasterSeed(t).derivePath("m/44'/195'/0'/0/0").getWallet())):e(ethereumjs_wallet_2.default.fromPrivateKey(utils_1.toBuffer(r)))})]}})})},t.exportMnemonic=function(r){return __awaiter(t,void 0,void 0,function(){var t;return __generator(this,function(e){switch(e.label){case 0:if(this.keystore)return[3,1];throw new Error("keystore undefined!");case 1:return[4,ethereumjs_wallet_2.default.fromV3(this.keystore,r)];case 2:return t=e.sent(),[2,bip39.entropyToMnemonic(t.getPrivateKey().slice(0,16))]}})})},t.keystore=e,t}return __extends(e,r),e.prototype.buildSerializedTx=function(o,e,t){return __awaiter(this,void 0,void 0,function(){var n,i=this;return __generator(this,function(e){switch(e.label){case 0:return this.keystore?[4,this.getWallet()]:[3,2];case 1:return n=e.sent(),[2,new Promise(function(t,r){tronWeb.trx.sign(o,n.getPrivateKeyString().slice(2)).then(function(e){t(e)}).catch(function(e){"Private key does not match address in transaction"==("string"==typeof e?e:e.message)?ethereumjs_wallet_2.default.fromV3(i.keystore,wallet_2.walletEx.getP()).then(function(e){tronWeb.trx.sign(o,e.getPrivateKeyString().slice(2)).then(function(e){t(e)}).catch(function(e){r(e)})}).catch(function(e){r(e)}):r(e)})})];case 2:return[2]}})})},e.prototype.importMnemonic=function(n,i,e){return __awaiter(this,void 0,void 0,function(){var t,r;return __generator(this,function(e){switch(e.label){case 0:if(12!=n.split(" ").length)throw new Error("invalid mnemonic!");if(bip39.validateMnemonic(n))return[3,1];throw new Error("invalid mnemonic!");case 1:return t=bip39.mnemonicToSeedSync(n),r=ethereumjs_wallet_1.hdkey.fromMasterSeed(t),[4,(t=r.derivePath("m/44'/195'/0'/0/0")).getWallet().toV3(i)];case 2:return(r=e.sent()).address=crypto_1.getBase58CheckAddress(crypto_1.getAddressFromPriKey(t.getWallet().getPrivateKey())),this.keystore=r,[2,this.keystore]}})})},e}(wallet_1.IWallet);exports.default=TronWallet;