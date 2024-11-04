import DataLoader from 'dataloader';
import { Prisma } from '.prisma/client';
import { PrismaClient } from '@prisma/client';

export interface IDataLoaders {
  postsByAuthorIdLoader: DataLoader<string, Prisma.PostGetPayload<null>[], string>;
  profileByUserIdLoader: DataLoader<string, Prisma.ProfileGetPayload<null> | undefined, string>;
  memberTypeByIdLoader: DataLoader<string, Prisma.MemberTypeGetPayload<null> | undefined, string>;
  subscribedToUserLoader: DataLoader<string, Prisma.UserGetPayload<null>[], string>;
  userSubscribedToLoader: DataLoader<string, Prisma.UserGetPayload<null>[], string>;
}

const batchPostsByAuthorId = async (
  prisma: PrismaClient,
  userIds: string[],
): Promise<Prisma.PostGetPayload<null>[][]> => {
  const posts = await prisma.post.findMany({
    where: {
      authorId: { in: userIds },
    },
  });
  return userIds.map(userId =>
      posts.filter((post) => post.authorId === userId)
  );
};

const batchProfileByUserId = async (
  prisma: PrismaClient,
  userIds: string[],
): Promise<(Prisma.ProfileGetPayload<null> | undefined)[]> => {
  const profiles = await prisma.profile.findMany({
    where: {
      userId: { in: userIds },
    },
  });
  return userIds.map(userId =>
      profiles.find((profile) => profile.userId === userId)
  );
};

const batchMemberTypeById = async (
  prisma: PrismaClient,
  memberTypeIds: string[],
): Promise<(Prisma.MemberTypeGetPayload<null> | undefined)[]> => {
  const memberTypes = await prisma.memberType.findMany({
    where: {
      id: { in: memberTypeIds },
    },
  });
  return memberTypeIds.map(userId =>
    memberTypes.find((memberType) => memberType.id === userId),
  );
};

const batchSubscribedToUser = async (
    prisma: PrismaClient,
    userIds: string[],
): Promise<Prisma.UserGetPayload<null>[][]> => {
  const users = await prisma.user.findMany({
    where: {
      userSubscribedTo: {
        some: {
          authorId: { in: userIds},
        },
      },
    },
    include: {
      userSubscribedTo: true
    }
  });
  return userIds.map(userId =>
      users.filter(user => user.userSubscribedTo.some(subUser => subUser.authorId === userId))
  );
};

const batchUserSubscribedTo = async (
    prisma: PrismaClient,
    userIds: string[],
): Promise<Prisma.UserGetPayload<null>[][]> => {
  const users = await prisma.user.findMany({
    where: {
      subscribedToUser: {
        some: {
          subscriberId: { in: userIds},
        },
      },
    },
    include: {
      subscribedToUser: true
    }
  });
  return userIds.map(userId =>
      users.filter(user => user.subscribedToUser.some(subUser => subUser.subscriberId === userId))
  );
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
  userSubscribedToLoader: new DataLoader((keys: readonly string[]) =>
      batchUserSubscribedTo(prisma, keys as string[]),
  ),
  subscribedToUserLoader: new DataLoader((keys: readonly string[]) =>
    batchSubscribedToUser(prisma, keys as string[]),
  ),
});
