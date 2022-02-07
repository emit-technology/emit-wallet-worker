"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintCollections = exports.accountCollection = exports.keyStoreCollection = void 0;
var IndexedDB_1 = require("../repository/IndexedDB");
var keystoreCollection_1 = require("./keystoreCollection");
var base_1 = require("./base");
var accountCollection_1 = require("./accountCollection");
var mintCollections_1 = require("./mintCollections");
var DATABASE_NAME = "emit_wallet_service";
var DATABASE_VERSION = 5;
var Index = /** @class */ (function () {
    function Index() {
    }
    Index.prototype.initDatabase = function () {
        var keys = Object.keys(base_1.baseConfig);
        var tables = [];
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            tables.push(base_1.baseConfig[key]);
        }
        var dbProps = {
            databaseName: DATABASE_NAME,
            tables: tables,
            version: DATABASE_VERSION
        };
        return new IndexedDB_1.IndexedDB(dbProps);
    };
    return Index;
}());
var _db = new Index().initDatabase();
exports.keyStoreCollection = new keystoreCollection_1.default(_db);
exports.accountCollection = new accountCollection_1.default(_db);
exports.mintCollections = new mintCollections_1.default(_db);
