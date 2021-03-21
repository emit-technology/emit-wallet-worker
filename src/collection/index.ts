import {Database, DatabaseTable} from "../repository/Types";
import {IndexedDB} from "../repository/IndexedDB";
import KeystoreCollection from "./keystoreCollection";
import {baseConfig} from './base'
import AccountCollection from "./accountCollection";
import MintCollections from "./mintCollections";

const DATABASE_NAME = "emit_wallet_service";
const DATABASE_VERSION = 5;

class Index {
    initDatabase(): IndexedDB {
        const keys = Object.keys(baseConfig);
        const tables:Array<any> = [];
        for(let key of keys){
            tables.push(baseConfig[key])
        }
        const dbProps: Database = {
            databaseName: DATABASE_NAME,
            tables: tables,
            version: DATABASE_VERSION
        }
        return new IndexedDB(dbProps);
    }
}

const _db: IndexedDB = new Index().initDatabase();

export const keyStoreCollection: KeystoreCollection = new KeystoreCollection(_db);

export const accountCollection: AccountCollection = new AccountCollection(_db);

export const mintCollections: MintCollections = new MintCollections(_db);