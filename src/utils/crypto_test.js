"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("./crypto");
var text = crypto_1.Encrypt({ key: "test" }, "12345678");
console.log(text, crypto_1.Decrypt(text, "1234567"));
//# sourceMappingURL=crypto_test.js.map