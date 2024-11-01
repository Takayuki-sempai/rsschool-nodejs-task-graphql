import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList, GraphQLNonNull,
  GraphQLObjectType
} from 'graphql/index.js';
import {PrismaClient} from "@prisma/client";

export const createRootQueryType = async (prisma: PrismaClient) => {
  const MemberTypeId = new GraphQLEnumType({
    name: 'MemberTypeId',
    description: 'One of the films in the Star Wars Trilogy',
    values: {
      BASIC: {
        value: "BASIC",
      },
      BUSINESS: {
        value: "BUSINESS",
      }
    },
  });

  const MemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields: {
      id: {
        type: new GraphQLNonNull(MemberTypeId),
      },
      discount: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
      postsLimitPerMonth: {
        type: new GraphQLNonNull(GraphQLInt),
      }
    },
  });

  return new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      memberTypes: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
        resolve: async () => await prisma.memberType.findMany(),
      },
    },
  });
};
