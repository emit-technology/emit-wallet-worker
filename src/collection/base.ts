import {ChainType} from "../types";

export default abstract class Base {

    abstract insert(data: any): void;

    abstract delete(data: any): void;

    abstract find(options: any): any;

    abstract findAll(): any;

    abstract update(data: any): void
}

export const baseConfig = {
    keystore: {
        name: "keystore",
        keyPath: "id",
        autoIncrement: true,
        indexes: [
            {
                index: "accountId",
                relativeIndex: "accountId",
                unique: false
            },
            {
                index: "chainType",
                relativeIndex: "chainType",
                unique: false
            },
            {
                index: "address",
                relativeIndex: "address",
                unique: true
            }
        ]
    },
    account: {
        name: "account",
        keyPath: "id",
        autoIncrement: true,
        indexes: [
            {
                index: "accountId",
                relativeIndex: "accountId",
                unique: true
            },
        ]
    }
}