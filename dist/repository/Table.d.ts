export declare class Table {
    name: string;
    db: IDBDatabase;
    constructor(name: string, db: IDBDatabase);
    transaction(mode?: boolean): IDBTransaction;
    request(): any;
    select(selector: any): Promise<any>;
    _iSelect(index: string, value: any): Promise<unknown>;
    selectId(id: number): Promise<unknown>;
    selectAll(): Promise<unknown>;
    some(selector: any, count: any): Promise<unknown>;
    update(data: any): Promise<unknown>;
    insert(data: any): Promise<unknown>;
    delete(selector: any): Promise<unknown>;
    clear(): Promise<unknown>;
}
