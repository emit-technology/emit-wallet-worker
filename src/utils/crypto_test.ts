import {Decrypt, Encrypt} from "./crypto";


const text = Encrypt({key:"test"},"12345678")

console.log(text,Decrypt(text,"1234567"))