import Base from "./base";
import { IndexedDB } from "../repository/IndexedDB";
import { AccountModel } from "../types";
declare class AccountCollection extends Base {
    protected _db: IndexedDB;
    protected _name: string;
    constructor(db: IndexedDB);
    delete(data: any): Promise<void>;
    find(options: any): Promise<any>;
    findAll(): Promise<any>;
    insert(data: AccountModel): Promise<any>;
    update(data: any): Promise<any>;
}
export default AccountCollection;
