import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql/index.js';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeId } from './memberType.js';
import { GraphQLContext } from '../type.js';
import { User } from './user.js';
import { Post } from './post.js';
import { Profile } from './profile.js';
import {IStringIdArg} from "./common.js";

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
      resolve: async (_source, _args, { prisma }) => await prisma.user.findMany(),
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
