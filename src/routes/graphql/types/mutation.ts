import { GraphQLNonNull, GraphQLObjectType } from 'graphql/index.js';
import { GraphQLContext } from '../type.js';
import { CreateUserInput, IUserCreateInputArgs, User } from './user.js';
import { CreateProfileInput, IProfileCreateInputArgs, Profile } from './profile.js';
import { CreatePostInput, IPostCreateInputArgs, Post } from './post.js';

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
  },
});
