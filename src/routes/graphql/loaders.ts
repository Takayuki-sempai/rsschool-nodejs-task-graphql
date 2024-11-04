import DataLoader from 'dataloader';
import { Prisma } from '.prisma/client';
import { PrismaClient } from '@prisma/client';

export interface IDataLoaders {
  postsByAuthorIdLoader: DataLoader<string, Prisma.PostGetPayload<null>[], string>;
  profileByUserIdLoader: DataLoader<string, Prisma.ProfileGetPayload<null> | undefined, string>;
  memberTypeByIdLoader: DataLoader<
    string,
    Prisma.MemberTypeGetPayload<null> | undefined,
    string
  >;
}

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

const batchProfileByUserId = async (
  prisma: PrismaClient,
  userIds: readonly string[],
): Promise<(Prisma.ProfileGetPayload<null> | undefined)[]> => {
  const profiles = await prisma.profile.findMany({
    where: {
      userId: { in: userIds as string[] },
    },
  });
  return userIds.map((userId) => profiles.find((profile) => profile.userId === userId));
};

const batchMemberTypeById = async (
  prisma: PrismaClient,
  memberTypeIds: readonly string[],
): Promise<(Prisma.MemberTypeGetPayload<null> | undefined)[]> => {
  const memberTypes = await prisma.memberType.findMany({
    where: {
      id: { in: memberTypeIds as string[] },
    },
  });
  return memberTypeIds.map((userId) => memberTypes.find((memberType) => memberType.id === userId));
};

export const createLoaders = async (prisma: PrismaClient): Promise<IDataLoaders> => ({
  postsByAuthorIdLoader: new DataLoader((keys: readonly string[]) =>
    batchPostsByAuthorId(prisma, keys as string[]),
  ),
  profileByUserIdLoader: new DataLoader((keys: readonly string[]) =>
    batchProfileByUserId(prisma, keys as string[]),
  ),
  memberTypeByIdLoader: new DataLoader((keys: readonly string[]) =>
    batchMemberTypeById(prisma, keys as string[]),
  ),
});
