import {GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType} from "graphql/index.js";
import {GraphQLContext} from "../type.js";
import {IMemberTypeIdArg, MemberType} from "./memberType.js";
import {UUIDType} from "./uuid.js";

export const Profile = new GraphQLObjectType<IMemberTypeIdArg, GraphQLContext>({
  name: 'Profile',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async (source: IMemberTypeIdArg, _args, { prisma }) =>
        prisma.memberType.findUnique({
          where: { id: source.memberTypeId },
        }),
    },
  },
});