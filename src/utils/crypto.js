"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decrypt = exports.Encrypt = void 0;
var CryptoJS = require("crypto-js");
function Encrypt(entry, pKey) {
    return CryptoJS.AES.encrypt(JSON.stringify(entry), pKey).toString();
}
exports.Encrypt = Encrypt;
function Decrypt(ciphertext, pkey) {
    try {
        var bytes = CryptoJS.AES.decrypt(ciphertext, pkey);
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
    }
    catch (e) {
        // console.error(e)
    }
    return { key: "" };
}
exports.Decrypt = Decrypt;
