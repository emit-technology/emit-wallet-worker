import Base from "./base";
import { IndexedDB } from "../repository/IndexedDB";
import { KeystoreWrapModel } from '../types/index';
declare class KeystoreCollection extends Base {
    _db: IndexedDB;
    _name: string;
    constructor(db: IndexedDB);
    delete(data: any): Promise<void>;
    find(options: any): Promise<any>;
    findAll(): Promise<any>;
    insert(data: KeystoreWrapModel): Promise<any>;
    update(data: any): Promise<any>;
}
export default KeystoreCollection;
