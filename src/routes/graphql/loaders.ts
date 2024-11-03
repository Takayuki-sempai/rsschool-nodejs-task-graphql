import DataLoader from "dataloader";
import { Prisma } from '.prisma/client';
import {PrismaClient} from "@prisma/client";

export interface IDataLoaders {
    postsByAuthorIdLoader: DataLoader<string, Prisma.PostGetPayload<null>[], string>;
}

const batchPostsByAuthorId = async (prisma: PrismaClient, userIds: readonly string[]): Promise<Prisma.PostGetPayload<null>[][]> => {
    const posts = await prisma.post.findMany({
        where: {
            authorId: { in: userIds as string[] }
        },
    })
    return userIds.map(userId => posts.filter((post) => post.authorId === userId))
}

export const createLoaders = async (prisma: PrismaClient): Promise<IDataLoaders> => ({
    postsByAuthorIdLoader: new DataLoader((keys: readonly string[]) => batchPostsByAuthorId(prisma, keys))
})