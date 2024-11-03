import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql/index.js';
import { GraphQLContext } from '../type.js';
import {
  ChangeUserInput,
  CreateUserInput,
  IUserChangeInputArgs,
  IUserCreateInputArgs,
  User,
} from './user.js';
import {
  ChangeProfileInput,
  CreateProfileInput,
  IProfileChangeInputArgs,
  IProfileCreateInputArgs,
  Profile,
} from './profile.js';
import {
  ChangePostInput,
  CreatePostInput,
  IPostChangeInputArgs,
  IPostCreateInputArgs,
  Post,
} from './post.js';
import { UUIDType } from './uuid.js';
import { IDeleteInputArgs } from './common.js';

export const Mutations = new GraphQLObjectType<never, GraphQLContext>({
  name: 'Mutations',
  fields: {
    createUser: {
      type: new GraphQLNonNull(User),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (_source, { dto }: IUserCreateInputArgs, { prisma }) =>
        await prisma.user.create({
          data: dto,
        }),
    },
    createProfile: {
      type: new GraphQLNonNull(Profile),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (_source, { dto }: IProfileCreateInputArgs, { prisma }) =>
        await prisma.profile.create({
          data: dto,
        }),
    },
    createPost: {
      type: new GraphQLNonNull(Post),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (_source, { dto }: IPostCreateInputArgs, { prisma }) =>
        await prisma.post.create({
          data: dto,
        }),
    },
    changePost: {
      type: new GraphQLNonNull(Post),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (_source, { id, dto }: IPostChangeInputArgs, { prisma }) =>
        await prisma.post.update({
          where: { id: id },
          data: dto,
        }),
    },
    changeProfile: {
      type: new GraphQLNonNull(Profile),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (_source, { id, dto }: IProfileChangeInputArgs, { prisma }) =>
        await prisma.profile.update({
          where: { id: id },
          data: dto,
        }),
    },
    changeUser: {
      type: new GraphQLNonNull(User),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (_source, { id, dto }: IUserChangeInputArgs, { prisma }) =>
        await prisma.user.update({
          where: { id: id },
          data: dto,
        }),
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source, { id }: IDeleteInputArgs, { prisma }) => {
        await prisma.user.delete({
          where: { id: id },
        });
        return '';
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source, { id }: IDeleteInputArgs, { prisma }) => {
        await prisma.post.delete({
          where: { id: id },
        });
        return '';
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source, { id }: IDeleteInputArgs, { prisma }) => {
        await prisma.profile.delete({
          where: { id: id },
        });
        return '';
      },
    },
  },
});
