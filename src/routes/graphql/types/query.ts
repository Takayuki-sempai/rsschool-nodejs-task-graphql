import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/index.js';
import { PrismaClient } from '@prisma/client';
import { UUIDType } from './uuid.js';

interface IStringIdArg {
  id: string;
}

interface IMemberTypeIdArg {
  memberTypeId: string;
}

export const createRootQueryType = async (prisma: PrismaClient) => {
  const MemberTypeId = new GraphQLEnumType({
    name: 'MemberTypeId',
    description: 'One of the films in the Star Wars Trilogy',
    values: {
      BASIC: { value: 'BASIC' },
      BUSINESS: { value: 'BUSINESS' },
    },
  });

  const MemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields: {
      id: {
        type: new GraphQLNonNull(MemberTypeId),
      },
      discount: { type: new GraphQLNonNull(GraphQLFloat) },
      postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    },
  });

  const Post = new GraphQLObjectType({
    name: 'Post',
    fields: {
      id: { type: new GraphQLNonNull(UUIDType) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
    },
  });

  const Profile = new GraphQLObjectType({
    name: 'Profile',
    fields: {
      id: { type: new GraphQLNonNull(UUIDType) },
      isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
      yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
      memberType: {
        type: new GraphQLNonNull(MemberType),
        resolve: async (source: IMemberTypeIdArg) =>
          prisma.memberType.findUnique({
            where: { id: source.memberTypeId },
          }),
      },
    },
  });

  const User: GraphQLObjectType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: new GraphQLNonNull(UUIDType) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      balance: { type: new GraphQLNonNull(GraphQLFloat) },
      profile: {
        type: Profile,
        resolve: async (source: IStringIdArg) =>
          prisma.profile.findUnique({
            where: { userId: source.id },
          }),
      },
      posts: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
        resolve: async (source: IStringIdArg) =>
          prisma.post.findMany({
            where: { authorId: source.id },
          }),
      },
      userSubscribedTo: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
        resolve: async (source: IStringIdArg) =>
          await prisma.user.findMany({
            where: {
              subscribedToUser: {
                some: {
                  subscriberId: source.id,
                },
              },
            },
          }),
      },
      subscribedToUser: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
        resolve: async (source: IStringIdArg) =>
          await prisma.user.findMany({
            where: {
              userSubscribedTo: {
                some: {
                  authorId: source.id,
                },
              },
            },
          }),
      },
    }),
  });

  return new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      memberTypes: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
        resolve: async () => await prisma.memberType.findMany(),
      },
      memberType: {
        type: MemberType,
        args: {
          id: { type: new GraphQLNonNull(MemberTypeId) },
        },
        resolve: async (_source, { id }: IStringIdArg) =>
          await prisma.memberType.findUnique({
            where: { id: id },
          }),
      },
      users: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
        resolve: async () => await prisma.user.findMany(),
      },
      user: {
        type: User,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, { id }: IStringIdArg) =>
          await prisma.user.findUnique({
            where: { id: id },
          }),
      },
      posts: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
        resolve: async () => await prisma.post.findMany(),
      },
      post: {
        type: Post,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, { id }: IStringIdArg) =>
          await prisma.post.findUnique({
            where: { id: id },
          }),
      },
      profiles: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile))),
        resolve: async () => await prisma.profile.findMany(),
      },
      profile: {
        type: Profile,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, { id }: IStringIdArg) =>
          await prisma.profile.findUnique({
            where: { id: id },
          }),
      },
    },
  });
};
