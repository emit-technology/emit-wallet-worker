export default abstract class Base {
    abstract insert(data: any): void;
    abstract delete(data: any): void;
    abstract find(options: any): any;
    abstract findAll(): any;
    abstract update(data: any): void;
}
export declare const baseConfig: {
    keystore: {
        name: string;
        keyPath: string;
        autoIncrement: boolean;
        indexes: {
            index: string;
            relativeIndex: string;
            unique: boolean;
        }[];
    };
    account: {
        name: string;
        keyPath: string;
        autoIncrement: boolean;
        indexes: {
            index: string;
            relativeIndex: string;
            unique: boolean;
        }[];
    };
};
