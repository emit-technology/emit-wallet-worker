import Base,{baseConfig} from "./base";
import {IndexedDB} from "../repository/IndexedDB";
import {AccountModel} from "../types";

class AccountCollection extends Base {

    protected _db: IndexedDB;
    protected _name:string;

    constructor(db: IndexedDB) {
        super();
        this._name = baseConfig.account.name;
        this._db = db;
    }

    async delete(data: any) {
        await this._db.delete(this._name,data)
    }

    async find(options: any): Promise<any> {
        return await this._db.select(this._name,options)
    }

    async findAll(): Promise<any> {
        return await this._db.selectAll(this._name)
    }

    async insert(data: AccountModel): Promise<any> {
        return await this._db.insert(this._name,data)
    }

    async update(data: any): Promise<any> {
        return await this._db.update(this._name,data)
    }

}

export default AccountCollection;