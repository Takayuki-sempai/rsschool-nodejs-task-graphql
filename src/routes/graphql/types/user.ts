import { GraphQLContext } from '../type.js';
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
import { GraphQLFieldConfig, GraphQLInputObjectType } from 'graphql/type/definition.js';
import type { ObjMap } from 'graphql/jsutils/ObjMap.js';
import { Prisma } from '.prisma/client';
import { UUID } from 'node:crypto';
import { IStringIdArg } from './common.js';

export interface IUserCreateInputArgs {
  dto: Prisma.UserUncheckedCreateInput;
}

export interface IUserChangeInputArgs {
  id: UUID;
  dto: Prisma.UserUncheckedUpdateInput;
}

export interface IUserSubscribeToInputArgs {
  userId: UUID;
  authorId: UUID;
}

export const User = new GraphQLObjectType<IStringIdArg, GraphQLContext>({
  name: 'User',
  fields: (): ObjMap<GraphQLFieldConfig<IStringIdArg, GraphQLContext>> => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: Profile,
      resolve: async (source: IStringIdArg, _args, { loaders }) =>
        loaders.profileByUserIdLoader.load(source.id),
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: async (source: IStringIdArg, _args, { loaders }) =>
        loaders.postsByAuthorIdLoader.load(source.id),
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (source: IStringIdArg, _args, { loaders }) =>
          loaders.userSubscribedToLoader.load(source.id)
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (source: IStringIdArg, _args, { loaders }) =>
          loaders.subscribedToUserLoader.load(source.id)
    },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
