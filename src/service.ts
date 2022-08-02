import {SeroWallet} from "./wallet/seroWallet";
import EthWallet from "./wallet/ethWallet";
import {AccountModel, ChainType, CreateType, Keystore, KeystoreWrapModel, Message, Method} from './types'
import {accountCollection, keyStoreCollection} from './collection'
import * as superzk from "jsuperzk/dist/protocol/account";
import {createPkrHash} from 'jsuperzk/dist/wallet/wallet'
import {IWallet, walletEx} from "./wallet/wallet";
import Wallet from "ethereumjs-wallet";
import {toBuffer} from "jsuperzk/dist/utils/utils";
import TronWallet from "./wallet/tronWallet";
import {getBase58CheckAddress, getAddressFromPriKey} from "tron-lib/src/utils/crypto"

const uuidv4 = require("uuid/v4");
const randomBytes = require("randombytes");

class Service {

    constructor() {

    }

    execute = async (message: any): Promise<any> => {
    }

    generateMnemonic() {
        return new SeroWallet().generateMnemonic();
    }

    async exportMnemonic(accountId: string, password: string): Promise<string> {
        const rest: Array<KeystoreWrapModel> = await keyStoreCollection.find({
            "accountId": accountId,
            chainType: ChainType.SERO
        });
        if (rest && rest.length > 0) {
            return await new EthWallet(rest[0].keystore).exportMnemonic(password);
        }
        return
    }

    async exportKeystore(accountId: string): Promise<string> {
        const rest: any = await keyStoreCollection.find({"accountId": accountId});
        if (!rest || rest.length == 0) {
            return "";
        } else {
            const keystore: KeystoreWrapModel = rest[1];
            return JSON.stringify(keystore.keystore)
        }
    }

    async exportPrivateKey(accountId: string, password: string): Promise<string> {
        const rest: Array<any> = await keyStoreCollection.find({"accountId": accountId, chainType: ChainType.ETH});
        if (rest && rest.length > 0) {
            const wallet = await Wallet.fromV3(rest[0].keystore, password)
            return wallet.getPrivateKeyString()
        }
    }

    async importPrivateKey(privateKey: string, password: string, name: string, passwordHint: string, avatar: string): Promise<string> {
        try {
            // const seroWallet = new SeroWallet()
            // const ethWallet = new EthWallet()

            const wallet = Wallet.fromPrivateKey(toBuffer(privateKey))
            const ethKeystore: any = await wallet.toV3(password);

            const seroKeystore: any = JSON.parse(JSON.stringify(ethKeystore));
            const sk = superzk.seed2Sk(wallet.getPrivateKey(), 1);
            const tk = superzk.sk2Tk(sk);
            const address = createPkrHash(tk, 1, 1)
            seroKeystore.tk = tk;
            seroKeystore.address = address;

            let accountId: string = uuidv4(randomBytes(16))

            const seroKeystoreData: any = await keyStoreCollection.find({"address": seroKeystore.address});
            const ethKeystoreData: any = await keyStoreCollection.find({"address": ethKeystore.address});

            // console.log(seroKeystore,ethWallet,accountId,"importMnemonic");
            const addressed: any = {};
            addressed[ChainType.SERO] = seroKeystore.address;
            addressed[ChainType.ETH] = "0x" + ethKeystore.address;

            const seroData: KeystoreWrapModel = {
                accountId: accountId,
                address: seroKeystore.address,
                chainType: ChainType.SERO,
                keystore: seroKeystore,
            }
            const ethData: KeystoreWrapModel = {
                accountId: accountId,
                address: ethKeystore.address,
                chainType: ChainType.ETH,
                keystore: ethKeystore,
            }
            if (seroKeystoreData && seroKeystoreData.length > 0) {
                const tmp: any = seroKeystoreData[0];
                accountId = tmp.accountId;
                tmp.keystore = seroData.keystore;
                await keyStoreCollection.update(tmp)
            } else {
                await keyStoreCollection.insert(seroData)
            }
            if (ethKeystoreData && ethKeystoreData.length > 0) {
                const tmp: any = ethKeystoreData[0];
                tmp.keystore = ethData.keystore;
                await keyStoreCollection.update(tmp)
            } else {
                await keyStoreCollection.insert(ethData)
            }

            const rest: any = await accountCollection.find({accountId: accountId})
            if (rest && rest.length > 0) {
                const tmp: any = rest[0];
                tmp.name = name;
                tmp.passwordHint = passwordHint;
                tmp.avatar = avatar;
                accountCollection.update(tmp).then().catch(e => {
                    // console.log(accountId)
                })
            } else {
                accountCollection.insert({
                    accountId: accountId,
                    createType: CreateType.PrivateKey,
                    name: name,
                    passwordHint: passwordHint,
                    avatar: avatar,
                    addresses: addressed
                }).then().catch(e => {
                    console.log(accountId)
                })
            }
            return new Promise((resolve, reject) => {
                resolve(accountId)
            })
        } catch (e) {
            console.error(e)
            return new Promise((resolve, reject) => {
                reject(e)
            })
        }
    }

    async accounts() {
        return await accountCollection.findAll()
    }

    async accountInfo(accountId: string): Promise<AccountModel | undefined> {
        const rest: any = await accountCollection.find({accountId: accountId});
        if (rest && rest.length > 0) {
            return rest[0]
        }
        return
    }

    async signTx(accountId: string, password: string, chainType: ChainType, params: any,chainParams?:any) {
        const chain = chainType == ChainType.SERO?ChainType.ETH:chainType;
        let rest: any = await keyStoreCollection.find({"accountId": accountId, "chainType": chain})
        if (!rest || rest.length == 0) {
            return Promise.reject("No keystore find.")
        }
        const account: KeystoreWrapModel = rest[0];
        switch (chainType) {
            case ChainType.ETH:
                const ethWallet: IWallet = new EthWallet(account.keystore)
                return await ethWallet.buildSerializedTx(params, password,chainParams);
            case ChainType.SERO:
                const seroWallet: IWallet = new SeroWallet(account.keystore)
                return await seroWallet.buildSerializedTx(params, password);
            case ChainType.TRON:
                const tronWallet: IWallet = new TronWallet(account.keystore)
                const rest = await tronWallet.buildSerializedTx(params, password);
                return Promise.resolve(rest);
            default:
                break;
        }
        return Promise.resolve();
    }

    async importMnemonic(mnemonic: string, password: string, name: string, passwordHint: string, avatar: string) {
        try {
            const seroWallet = new SeroWallet()
            const ethWallet = new EthWallet()
            const ethKeystore: any = await ethWallet.importMnemonic(mnemonic, password);
            const seroKeystore: Keystore = await seroWallet.importMnemonic(mnemonic, password);
            let accountId: string = uuidv4(randomBytes(16))

            const seroKeystoreData: any = await keyStoreCollection.find({"address": seroKeystore.address});
            const ethKeystoreData: any = await keyStoreCollection.find({"address": ethKeystore.address});

            const addressed: any = {};
            addressed[ChainType.SERO] = seroKeystore.address;
            addressed[ChainType.ETH] = "0x" + ethKeystore.address;

            const seroData: KeystoreWrapModel = {
                accountId: accountId,
                address: seroKeystore.address,
                chainType: ChainType.SERO,
                keystore: seroKeystore,
            }
            const ethData: KeystoreWrapModel = {
                accountId: accountId,
                address: ethKeystore.address,
                chainType: ChainType.ETH,
                keystore: ethKeystore,
            }
            if (seroKeystoreData && seroKeystoreData.length > 0) {
                const tmp: any = seroKeystoreData[0];
                accountId = tmp.accountId;
                tmp.keystore = seroData.keystore;
                await keyStoreCollection.update(tmp)
            } else {
                await keyStoreCollection.insert(seroData)
            }
            if (ethKeystoreData && ethKeystoreData.length > 0) {
                const tmp: any = ethKeystoreData[0];
                tmp.keystore = ethData.keystore;
                await keyStoreCollection.update(tmp)
            } else {
                await keyStoreCollection.insert(ethData)
            }
            const rest: any = await accountCollection.find({accountId: accountId})
            if (rest && rest.length > 0) {
                const tmp: any = rest[0];
                tmp.name = name;
                tmp.passwordHint = passwordHint;
                tmp.avatar = avatar;
                accountCollection.update(tmp).then().catch(e => {
                    console.log(accountId)
                })
            } else {
                accountCollection.insert({
                    accountId: accountId,
                    name: name,
                    createType: CreateType.Mnemonic,
                    passwordHint: passwordHint,
                    avatar: avatar,
                    addresses: addressed
                }).then().catch(e => {
                    console.log(accountId)
                })
            }
            return new Promise((resolve, reject) => {
                resolve(accountId)
            })
        } catch (e) {
            return new Promise((resolve, reject) => {
                reject(e)
            })
        }
    }

    async genNewWallet(accountId:string,password:string,chainType:ChainType){
        const rest: any = await keyStoreCollection.find({"accountId": accountId, "chainType": chainType})
        if (rest && rest.length > 0) {
            return Promise.reject(`Chain:${ChainType[chainType]} is exist!`)
        }
        const accountInfo = await this.accountInfo(accountId);
        let keystore:any = {};
        if(accountInfo.createType == CreateType.PrivateKey){
            // const privateKey = await this.exportPrivateKey(accountId,password)
            const privateKey = await walletEx.getSignKey()
            const privateKeyBytes = toBuffer(privateKey);
            const wallet = Wallet.fromPrivateKey(privateKeyBytes)
            keystore = await wallet.toV3(password);
            keystore.address = getBase58CheckAddress(getAddressFromPriKey(privateKeyBytes));
        }else if(accountInfo.createType == CreateType.Mnemonic){
            // const restSero: Array<KeystoreWrapModel> = await keyStoreCollection.find({
            //     accountId: accountId,
            //     chainType: ChainType.SERO
            // });
            // let mnemonic = "";
            // if (restSero && restSero.length > 0) {
            //     mnemonic = await new EthWallet(restSero[0].keystore).exportMnemonic(password);
            // }
            // if(!mnemonic){
            //     return Promise.reject(`No available keystore`)
            // }
            const wallet:IWallet  = new TronWallet()
            const privateKey = await walletEx.getSignKey()
            keystore = await wallet.importMnemonic(privateKey,password);
        }

        // const mnemonic = await this.exportMnemonic(accountId,password);
        if(chainType == ChainType.TRON){
            const rest: Array<AccountModel> = await accountCollection.find({
                accountId: accountId
            });
            if(!rest || rest.length ==0){
                return Promise.reject(`No available account`)
            }
            const account = rest[0];
            const addresses = account.addresses;
            addresses[chainType] = keystore.address;
            account.addresses = addresses;
            await accountCollection.update(account)

            const data: KeystoreWrapModel = {
                accountId: accountId,
                address: keystore.address,
                chainType: ChainType.TRON,
                keystore: keystore,
            }

            await keyStoreCollection.insert(data)
        }
    }

    async unlockWallet(accountId:string,password:string){
        const chainType = ChainType.ETH;
        const rest: any = await keyStoreCollection.find({"accountId": accountId, "chainType": chainType})
        if (rest && rest.length == 0) {
            return Promise.reject(`Chain:${ChainType[chainType]} is not exist!`)
        }
        const accountInfo = await this.accountInfo(accountId);
        if(accountInfo.key){
            const text = await walletEx.unLock(accountId,password)
            if(text){
                return Promise.resolve(true)
            }
            return Promise.reject(false)
        }else{
            if(accountInfo.createType == CreateType.PrivateKey){
                const privateKeyString = await this.exportPrivateKey(accountId,password)
                await walletEx.setSignKey(privateKeyString,password,accountId)
            }else if(accountInfo.createType == CreateType.Mnemonic){
                const restSero: Array<KeystoreWrapModel> = await keyStoreCollection.find({
                    accountId: accountId,
                    chainType: ChainType.SERO
                });
                let mnemonic = "";
                if (restSero && restSero.length > 0) {
                    mnemonic = await new EthWallet(restSero[0].keystore).exportMnemonic(password);
                }
                await walletEx.setSignKey(mnemonic,password,accountId)
            }
        }
        return Promise.resolve(true)
    }

    isLocked(){
        const p = walletEx.getP()
        return !p
    }

    lockAccount(){
        walletEx.lock()
        return true
    }
}

const service = new Service();

self.addEventListener('message', e => {

    if (e && e.data && e.data.method) {
        const message: Message = e.data;
        switch (message.method) {
            case Method.exportMnemonic:
                service.exportMnemonic(message.data.accountId, message.data.password).then((rest: string) => {
                    message.result = rest;
                    sendMessage(message)
                }).catch((e: any) => {
                    message.error = typeof e == "string" ? e : e.message;
                    sendMessage(message)
                })
                break;
            case Method.importMnemonic:
                service.importMnemonic(message.data.mnemonic, message.data.password, message.data.name, message.data.passwordHint, message.data.avatar).then((accountId: any) => {
                    walletEx.setSignKey(message.data.mnemonic,message.data.password,accountId).then(()=>{
                        message.result = accountId;
                        sendMessage(message)
                    }).catch((e:any)=>{
                        console.error(e)
                        message.error = typeof e == "string" ? e : e.message;
                        sendMessage(message)
                    })
                }).catch((e: any) => {
                    console.error(e)
                    message.error = typeof e == "string" ? e : e.message;
                    sendMessage(message)
                })
                break;
            case Method.signTx:
                service.signTx(message.data.accountId, message.data.password, message.data.chainType, message.data.params,message.data.chainParams).then((rest: any) => {
                    message.result = rest;
                    sendMessage(message)
                }).catch((e: any) => {
                    console.error(e)
                    message.error = typeof e == "string" ? e : e.message;
                    sendMessage(message)
                })
                break;
            case Method.generateMnemonic:
                message.result = service.generateMnemonic()
                sendMessage(message)
                break;
            case Method.getAccountInfo:
                service.accountInfo(message.data.accountId).then((rest: any) => {
                    message.result = rest
                    sendMessage(message)
                }).catch((e: any) => {
                    message.error = typeof e == "string" ? e : e.message;
                    sendMessage(message)
                })
                break;
            case Method.getAccountList:
                service.accounts().then((rest: any) => {
                    message.result = rest
                    sendMessage(message)
                }).catch((e: any) => {
                    message.error = typeof e == "string" ? e : e.message;
                    sendMessage(message)
                })
                break;
            case Method.exportKeystore:
                service.exportKeystore(message.data.accountId).then((rest: any) => {
                    message.result = rest
                    sendMessage(message)
                }).catch((e: any) => {
                    message.error = typeof e == "string" ? e : e.message;
                    sendMessage(message)
                })
                break;
            case Method.exportPrivateKey:
                service.exportPrivateKey(message.data.accountId, message.data.password).then((rest: any) => {
                    message.result = rest
                    sendMessage(message)
                }).catch((e: any) => {
                    message.error = typeof e == "string" ? e : e.message;
                    sendMessage(message)
                })
                break
            case Method.importPrivateKey:
                service.importPrivateKey(message.data.mnemonic, message.data.password, message.data.name, message.data.passwordHint, message.data.avatar).then((accountId: any) => {
                    walletEx.setSignKey(message.data.mnemonic,message.data.password,accountId).then(()=>{
                        message.result = accountId;
                        sendMessage(message)
                    }).catch((e:any)=>{
                        console.error(e)
                        message.error = typeof e == "string" ? e : e.message;
                        sendMessage(message)
                    })
                }).catch((e: any) => {
                    message.error = typeof e == "string" ? e : e.message;
                    sendMessage(message)
                })
                break
            case Method.genNewWallet:
                service.genNewWallet(message.data.accountId, message.data.password,message.data.chainType).then((rest: any) => {
                    message.result = rest
                    sendMessage(message)
                }).catch((e: any) => {
                    console.error(e)
                    message.error = typeof e == "string" ? e : e.message;
                    sendMessage(message)
                })
                break
            case Method.unlockWallet:
                service.unlockWallet(message.data.accountId, message.data.password).then((rest: any) => {
                    message.result = rest
                    sendMessage(message)
                }).catch((e: any) => {
                    console.error(e)
                    message.error = typeof e == "string" ? e : e.message;
                    sendMessage(message)
                })
                break
            case Method.isLocked:
                message.result = service.isLocked()
                sendMessage(message)
                break
            case Method.lockWallet:
                message.result = service.lockAccount()
                sendMessage(message)
                break
            default:
                service.execute(message).then((rest: any) => {
                    message.result = rest
                    sendMessage(message)
                }).catch((e: any) => {
                    message.error = typeof e == "string" ? e : e.message;
                    sendMessage(message)
                })
                break;
        }
    }
})

function sendMessage(message: Message): void {
    // console.log("send msg: ", message);
    // @ts-ignore
    self.postMessage(message)
}