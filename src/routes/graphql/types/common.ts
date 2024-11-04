import {UUID} from "node:crypto";

export interface IStringIdArg {
    id: string;
}

export interface IDeleteInputArgs {
    id: UUID;
}