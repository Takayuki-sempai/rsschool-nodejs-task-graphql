import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql/index.js';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeId } from './memberType.js';
import { GraphQLContext } from '../type.js';
import { User } from './user.js';
import { Post } from './post.js';
import { Profile } from './profile.js';
import { IStringIdArg } from './common.js';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

export const RootQueryType = new GraphQLObjectType<never, GraphQLContext>({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_source, _args, { prisma }) => await prisma.memberType.findMany(),
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (_source, { id }: IStringIdArg, { prisma }) =>
        await prisma.memberType.findUnique({
          where: { id: id },
        }),
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (_source, _args, { prisma, loaders }, info) => {
        const parsedInfo = parseResolveInfo(info);
        const includeFields = simplifyParsedResolveInfoFragmentWithType(
          parsedInfo as ResolveTree,
          new GraphQLList(User),
        );
        const isSubscribedToUser = !!includeFields.fields['subscribedToUser'];
        const isUserSubscribedTo = !!includeFields.fields['userSubscribedTo'];
        const users = await prisma.user.findMany({
          include: {
            subscribedToUser: isSubscribedToUser,
            userSubscribedTo: isUserSubscribedTo,
          },
        });
        users.forEach((user) => {
          if (isUserSubscribedTo) {
            const authorIds = user.userSubscribedTo.map(
              (userSubscribed) => userSubscribed.authorId,
            );
            const authors = users.filter((subUser) => authorIds.includes(subUser.id));
            loaders.userSubscribedToLoader.prime(user.id, authors);
          }
          if (isSubscribedToUser) {
            const subscriberIds = user.subscribedToUser.map(
              (subscribedTo) => subscribedTo.subscriberId,
            );
            const subscribers = users.filter((subUser) =>
              subscriberIds.includes(subUser.id),
            );
            loaders.subscribedToUserLoader.prime(user.id, subscribers);
          }
        });
        return users;
      },
    },
    user: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source, { id }: IStringIdArg, { prisma }) =>
        await prisma.user.findUnique({
          where: { id: id },
        }),
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: async (_source, _args, { prisma }) => await prisma.post.findMany(),
    },
    post: {
      type: Post,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source, { id }: IStringIdArg, { prisma }) =>
        await prisma.post.findUnique({
          where: { id: id },
        }),
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile))),
      resolve: async (_source, _args, { prisma }) => await prisma.profile.findMany(),
    },
    profile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source, { id }: IStringIdArg, { prisma }) =>
        await prisma.profile.findUnique({
          where: { id: id },
        }),
    },
  },
});
