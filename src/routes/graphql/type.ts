import {PrismaClient} from "@prisma/client";
import {IDataLoaders} from "./loaders.js";

export interface GraphQLContext {
    prisma: PrismaClient;
    loaders: IDataLoaders
}