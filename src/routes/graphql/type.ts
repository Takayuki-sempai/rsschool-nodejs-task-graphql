import {PrismaClient} from "@prisma/client";

export interface GraphQLContext {
    prisma: PrismaClient;
}

export interface IStringIdArg {
    id: string;
}