import {DatabaseTable, Database, RuleIndex} from "./Types";
import {Table} from './Table';
export class IndexedDB {
    openedDB!: IDBOpenDBRequest
    name: string
    version!: number
    tables: Array<DatabaseTable>

    constructor(config: Database) {
        const {databaseName, tables,version} = config
        this.name = databaseName
        this.tables = tables
        this.createTable(this.tables,version)
    }

    createDateBase(name: string, version = 1) {
        this.openedDB = indexedDB.open(name, version)
    }

    createTable(tables: Array<DatabaseTable>, version = 1) {
        const conn_request = indexedDB.open(this.name, version)
        conn_request.onupgradeneeded = (ev: any) => {
            const db = ev.target.result
            tables.forEach((table: DatabaseTable) => {
                const hadTableNames = Array.from(db.objectStoreNames)
                if (!hadTableNames.includes(table.name)) {
                    const table_info = db.createObjectStore(table.name, {
                        keyPath: table.keyPath,
                        autoIncrement: table.autoIncrement
                    })
                    table.indexes.forEach(item => {
                        this.createIndex(table_info, item)
                    })
                }
            })
        }
    }

    deleteTable(tableName: string, version: number) {
        const conn_request = indexedDB.open(this.name, version)
        conn_request.onupgradeneeded = (ev: any) => {
            const db = ev.target.result;
            if (ev.oldVersion < version) {
                db.deleteObjectStore(tableName)
            }
        }
    }

    // create index
    createIndex(table: IDBObjectStore, option: RuleIndex) {
        let optionPramas = {};
        if (option.unique){
            optionPramas["unique"] = option.unique
        }
        if (option.multiEntry){
            optionPramas["multiEntry"] = option.multiEntry
        }
        table.createIndex(option.index, option.relativeIndex, optionPramas)
    }

    connect() {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const conn_request = indexedDB.open(this.name, this.version)
            conn_request.onsuccess = (ev: any) => {
                resolve(ev.target.result)
            }
            conn_request.onerror = (ev: any) => {
                reject(ev)
            }
        })
    }

    close() {
        this.connect().then((db: IDBDatabase) => {
            db.close()
        })
    }

    insert(name: string, data: any) {
        return new Promise((resolve, reject) => {
            this.connect().then((db: IDBDatabase) => {
                const table = new Table(name, db)
                table.insert(data).then(resolve).catch(reject);
            })
        })
    }

    select(name: string, selecter: any) {
        return new Promise((resolve, reject) => {
            this.connect().then((db: IDBDatabase) => {
                const table = new Table(name, db)
                table.select(selecter).then((res: any) => {
                    resolve(res)
                }).catch((err: any) => {
                    reject(err)
                })
            })
        })
    }

    selectId(name: string, id: number) {
        return new Promise((resolve, reject) => {
            this.connect().then((db: IDBDatabase) => {
                const table = new Table(name, db)
                table.selectId(id).then((res: any) => {
                    resolve(res)
                }).catch((err: any) => {
                    reject(err)
                })
            })
        })
    }

    some(name: string, selecter: any, count: any) {
        return new Promise((resolve, reject) => {
            this.connect().then((db: IDBDatabase) => {
                const table = new Table(name, db)
                table.some(selecter, count).then((res: any) => {
                    resolve(res)
                }).catch((error: any) => {
                    reject(error)
                })
            })
        })
    }

    async update(name: string, data: any) {
        return new Promise((resolve, reject) => {
            this.connect().then((db: IDBDatabase) => {
                const table = new Table(name, db)
                table.update(data).then((res: any) => {
                    resolve(res)
                }).catch((err: any) => {
                    // reject(err)
                    console.log(name,data);
                    console.log(err);
                    resolve(true)
                })
            })
        })
    }

    async delete(name: string, data: any) {
        // console.log("delete >>>> ",name,data);
        return new Promise((resolve, reject) => {
            this.connect().then((db: IDBDatabase) => {
                const table = new Table(name, db)
                table.delete(data).then((res: any) => {
                    resolve(res)
                }).catch((err: any) => {
                    console.log(name,data);
                    console.log(err);
                    resolve(true)
                })
            })
        })
    }

    selectAll(name: string) {
        return new Promise((resolve, reject) => {
            this.connect().then((db: IDBDatabase) => {
                const table = new Table(name, db)
                table.selectAll().then((res: any) => {
                    resolve(res)
                }).catch((err: any) => {
                    reject(err)
                })
            })
        })
    }

    clearTable(name: string) {
        return new Promise((resolve, reject) => {
            this.connect().then((db: IDBDatabase) => {
                const table = new Table(name, db)
                table.clear().then((res: any) => {
                    resolve(res)
                }).catch((error: any) => {
                    reject(error)
                })
            })
        })
    }
}
