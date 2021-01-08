import {Database, DatabaseTable} from "../repository/Types";
import {IndexedDB} from "../repository/IndexedDB";
import KeystoreCollection from "./keystoreCollection";
import {baseConfig} from './base'
import AccountCollection from "./accountCollection";

const DATABASE_NAME = "emit_wallet_service";
const DATABASE_VERSION = 1;

class Index {
    initDatabase(): IndexedDB {
        const dbProps: Database = {
            databaseName: DATABASE_NAME,
            tables: [baseConfig.keystore, baseConfig.account],
            version: DATABASE_VERSION
        }
        return new IndexedDB(dbProps);
    }
}

const _db: IndexedDB = new Index().initDatabase();

export const keyStoreCollection: KeystoreCollection = new KeystoreCollection(_db);

export const accountCollection: AccountCollection = new AccountCollection(_db);