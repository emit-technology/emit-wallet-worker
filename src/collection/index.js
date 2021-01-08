"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountCollection = exports.keyStoreCollection = void 0;
var IndexedDB_1 = require("../repository/IndexedDB");
var keystoreCollection_1 = require("./keystoreCollection");
var base_1 = require("./base");
var accountCollection_1 = require("./accountCollection");
var DATABASE_NAME = "emit_wallet_service";
var DATABASE_VERSION = 1;
var Index = /** @class */ (function () {
    function Index() {
    }
    Index.prototype.initDatabase = function () {
        var dbProps = {
            databaseName: DATABASE_NAME,
            tables: [base_1.baseConfig.keystore, base_1.baseConfig.account],
            version: DATABASE_VERSION
        };
        return new IndexedDB_1.IndexedDB(dbProps);
    };
    return Index;
}());
var _db = new Index().initDatabase();
exports.keyStoreCollection = new keystoreCollection_1.default(_db);
exports.accountCollection = new accountCollection_1.default(_db);
//# sourceMappingURL=index.js.map