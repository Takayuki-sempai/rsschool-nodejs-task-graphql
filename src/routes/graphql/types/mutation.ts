import { GraphQLNonNull, GraphQLObjectType } from 'graphql/index.js';
import { GraphQLContext } from '../type.js';
import { CreateUserInput, IUserCreateInputArgs, User } from './user.js';

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
  },
});
