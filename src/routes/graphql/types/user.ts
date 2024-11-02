import { GraphQLContext, IStringIdArg } from '../type.js';
import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/index.js';
import { UUIDType } from './uuid.js';
import { Profile } from './profile.js';
import { Post } from './post.js';
import {GraphQLFieldConfig, GraphQLInputObjectType} from 'graphql/type/definition.js';
import type { ObjMap } from 'graphql/jsutils/ObjMap.js';
import {Prisma} from ".prisma/client";

export interface IUserCreateInputArgs {
  dto: Prisma.UserCreateInput
}

export const User = new GraphQLObjectType<IStringIdArg, GraphQLContext>({
  name: 'User',
  fields: (): ObjMap<GraphQLFieldConfig<IStringIdArg, GraphQLContext>> => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: Profile,
      resolve: async (source: IStringIdArg, _args, { prisma }) =>
        prisma.profile.findUnique({
          where: { userId: source.id },
        }),
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: async (source: IStringIdArg, _args, { prisma }) =>
        prisma.post.findMany({
          where: { authorId: source.id },
        }),
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (source: IStringIdArg, _args, { prisma }) =>
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
      resolve: async (source: IStringIdArg, _args, { prisma }) =>
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

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }
});