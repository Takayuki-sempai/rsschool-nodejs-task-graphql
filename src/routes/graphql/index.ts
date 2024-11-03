import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, parse, validate } from 'graphql';
import { RootQueryType } from './types/query.js';
import { GraphQLObjectType } from 'graphql/index.js';
import { Mutations } from './types/mutation.js';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  const handlerSchema = new GraphQLSchema({
    query: RootQueryType as GraphQLObjectType,
    mutation: Mutations as GraphQLObjectType,
  });

  const context = { prisma };

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const errors = validate(handlerSchema, parse(req.body.query), [depthLimit(5)]);

      if (errors.length !== 0) {
        return { errors, data: null };
      }
      return graphql({
        schema: handlerSchema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: context,
      });
    },
  });
};

export default plugin;
