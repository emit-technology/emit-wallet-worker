import { DatabaseTable, Database, RuleIndex } from "./Types";
export declare class IndexedDB {
    openedDB: IDBOpenDBRequest;
    name: string;
    version: number;
    tables: Array<DatabaseTable>;
    constructor(config: Database);
    createDateBase(name: string, version?: number): void;
    createTable(tables: Array<DatabaseTable>, version?: number): void;
    deleteTable(tableName: string, version: number): void;
    createIndex(table: IDBObjectStore, option: RuleIndex): void;
    connect(): Promise<IDBDatabase>;
    close(): void;
    insert(name: string, data: any): Promise<unknown>;
    select(name: string, selecter: any): Promise<unknown>;
    selectId(name: string, id: number): Promise<unknown>;
    some(name: string, selecter: any, count: any): Promise<unknown>;
    update(name: string, data: any): Promise<unknown>;
    delete(name: string, data: any): Promise<unknown>;
    selectAll(name: string): Promise<unknown>;
    clearTable(name: string): Promise<unknown>;
}
