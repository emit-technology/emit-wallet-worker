"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IWallet = void 0;
var utils_1 = require("jsuperzk/src/utils/utils");
var crypto = require("crypto");
var randomBytes = require("randombytes");
var scryptsy = require("scrypt.js");
var uuidv4 = require("uuid/v4");
var keccak256 = require("keccak256");
var bip39 = require("bip39");
var IWallet = /** @class */ (function () {
    function IWallet() {
    }
    IWallet.prototype.generateMnemonic = function () {
        return bip39.generateMnemonic();
    };
    IWallet.prototype.genKeystore = function (seed, password, version) {
        if (!this.keyExists(seed)) {
            throw new Error("This is a public key only wallet");
        }
        var scryptParams = {
            cipher: "aes-128-ctr",
            kdf: "scrypt",
            salt: randomBytes(32),
            iv: randomBytes(16),
            uuid: randomBytes(16),
            dklen: 32,
            c: 262144,
            n: 262144,
            r: 8,
            p: 1
        };
        var kdfParams = this.kdfParamsForScrypt(scryptParams);
        var derivedKey = scryptsy(Buffer.from(password), utils_1.toBuffer(kdfParams.salt), kdfParams.n, kdfParams.r, kdfParams.p, kdfParams.dklen);
        var cipher = crypto.createCipheriv(scryptParams.cipher, derivedKey.slice(0, 16), scryptParams.iv);
        if (!cipher) {
            throw new Error("Unsupported cipher");
        }
        var ciphertext = this.runCipherBuffer(cipher, seed);
        var mac = keccak256(Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext)]));
        kdfParams.salt = kdfParams.salt;
        return {
            version: version,
            id: uuidv4({ random: scryptParams.uuid }),
            address: "",
            crypto: {
                ciphertext: ciphertext.toString("hex"),
                cipherparams: { iv: scryptParams.iv.toString("hex") },
                cipher: scryptParams.cipher,
                kdf: scryptParams.kdf,
                kdfparams: kdfParams,
                mac: mac.toString("hex")
            },
        };
    };
    IWallet.prototype.kdfParamsForScrypt = function (opts) {
        return {
            dklen: opts.dklen,
            salt: opts.salt.toString("hex"),
            n: opts.n,
            r: opts.r,
            p: opts.p
        };
    };
    IWallet.prototype.keyExists = function (k) {
        return k !== undefined && k !== null;
    };
    IWallet.prototype.decryptKeystore = function (input, password) {
        var json = typeof input === "object" ? input : JSON.parse(input);
        var derivedKey;
        var kdfparams;
        if (json.crypto.kdf === "scrypt") {
            kdfparams = json.crypto.kdfparams;
            derivedKey = scryptsy(Buffer.from(password), utils_1.toBuffer(kdfparams.salt), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
        }
        else {
            throw new Error("Unsupported key derivation scheme");
        }
        var ciphertext = Buffer.from(json.crypto.ciphertext, "hex");
        var mac = keccak256(Buffer.concat([derivedKey.slice(16, 32), ciphertext]));
        if (mac.toString("hex") !== json.crypto.mac) {
            throw new Error("Key derivation failed - possibly wrong passphrase");
        }
        var decipher = crypto.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), Buffer.from(json.crypto.cipherparams.iv, "hex"));
        return this.runCipherBuffer(decipher, ciphertext);
    };
    IWallet.prototype.runCipherBuffer = function (cipher, data) {
        return Buffer.concat([cipher.update(data), cipher.final()]);
    };
    return IWallet;
}());
exports.IWallet = IWallet;
//# sourceMappingURL=wallet.js.map