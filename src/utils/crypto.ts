const CryptoJS = require("crypto-js");

interface CryptoEntry{
    key:string
}

function Encrypt(entry:CryptoEntry,pKey:string){
    return CryptoJS.AES.encrypt(JSON.stringify(entry), pKey).toString();
}

function Decrypt(ciphertext:string,pkey:string):CryptoEntry{
    try{
        const bytes  = CryptoJS.AES.decrypt(ciphertext, pkey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData
    }catch (e){
        // console.error(e)
    }
    return {key:""}
}

export {
    CryptoEntry,Encrypt,Decrypt
}