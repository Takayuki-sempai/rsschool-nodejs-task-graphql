import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import {createGqlResponseSchema, gqlResponseSchema} from './schemas.js';
import {graphql, GraphQLSchema} from 'graphql';
import {createRootQueryType} from "./types/query.js";

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  const handlerSchema = new GraphQLSchema({
    query: await createRootQueryType(prisma)
  })

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
      return graphql({
        schema: handlerSchema,
        source: req.body.query,
        variableValues: req.body.variables
      });
    },
  });
};

export default plugin;
