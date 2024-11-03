import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql/index.js';
import { GraphQLContext } from '../type.js';
import { IMemberTypeIdArg, MemberType, MemberTypeId } from './memberType.js';
import { UUIDType } from './uuid.js';
import { GraphQLInputObjectType } from 'graphql/type/definition.js';
import {Prisma} from '.prisma/client';

export interface IProfileCreateInputArgs {
  dto: Prisma.ProfileUncheckedCreateInput;
}

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

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
  },
});