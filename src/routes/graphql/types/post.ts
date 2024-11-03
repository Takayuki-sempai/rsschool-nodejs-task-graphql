import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql/index.js';
import { UUIDType } from './uuid.js';
import { GraphQLInputObjectType } from 'graphql/type/definition.js';
import { Prisma } from '.prisma/client';

export interface IPostCreateInputArgs {
  dto: Prisma.PostUncheckedCreateInput;
}

export const Post = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});