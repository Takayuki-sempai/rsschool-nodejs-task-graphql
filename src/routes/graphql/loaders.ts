import DataLoader from 'dataloader';
import { Prisma } from '.prisma/client';
import { PrismaClient } from '@prisma/client';

export interface IDataLoaders {
  postsByAuthorIdLoader: DataLoader<string, Prisma.PostGetPayload<null>[], string>;
  profileByUserId: DataLoader<string, Prisma.ProfileGetPayload<null> | undefined, string>;
}

const batchProfileByUserId = async (
  prisma: PrismaClient,
  userIds: readonly string[],
): Promise<(Prisma.ProfileGetPayload<null> | undefined)[]> => {
  const profiles = await prisma.profile.findMany({
    where: {
      userId: { in: userIds as string[] },
    },
  });
  return userIds.map((userId) =>
      profiles.find((profile) => profile.userId === userId)
  );
};

const batchPostsByAuthorId = async (
  prisma: PrismaClient,
  userIds: readonly string[],
): Promise<Prisma.PostGetPayload<null>[][]> => {
  const posts = await prisma.post.findMany({
    where: {
      authorId: { in: userIds as string[] },
    },
  });
  return userIds.map((userId) => posts.filter((post) => post.authorId === userId));
};

export const createLoaders = async (prisma: PrismaClient): Promise<IDataLoaders> => ({
  postsByAuthorIdLoader: new DataLoader((keys: readonly string[]) =>
    batchPostsByAuthorId(prisma, keys as string[]),
  ),
  profileByUserId: new DataLoader((keys: readonly string[]) =>
    batchProfileByUserId(prisma, keys as string[]),
  ),
});
