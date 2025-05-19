import { Static, Type } from "@sinclair/typebox";

export const CreateUserPostRequestBodySchema = Type.Object(
  {
    firstName: Type.String({ readonly: true }),
    lastName: Type.String({ readOnly: true }),
    nationalCode: Type.RegExp(/^\d+$/, {
      maxLength: 10,
      minLength: 10,
      readOnly: true,
    }),
    phoneNumber: Type.RegExp(/^\+98\d+$/, {
      maxLength: 13,
      minLength: 13,
      readOnly: true,
    }),
  },
  { readOnly: true }
);
export type ICreateUserPostRequestBodySchema = Static<
  typeof CreateUserPostRequestBodySchema
>;

export const UpdateUserPutRequestBodySchema = Type.Object({
  user: Type.Object({
    firstName: Type.Optional(Type.String()),
    lastName: Type.Optional(Type.String()),
    nationalCode: Type.Optional(Type.String()),
    phoneNumber: Type.Optional(Type.String()),
  }),
  profile: Type.Object({
    debtPrem: Type.Optional(Type.Boolean()),
  }),
});

export type IUpdateUserPutRequestBodySchema = Static<
  typeof UpdateUserPutRequestBodySchema
>;

export const GetUserQueryParamSchema = Type.Object({
  userId: Type.Optional(Type.Number()),
  nationalCode: Type.Optional(Type.String()),
  wallet: Type.Optional(Type.Boolean({ default: false })),
});

export type IGetUserQueryParamSchema = Static<typeof GetUserQueryParamSchema>;

export const UserListQueryFilterSchema = Type.Object({
  limit: Type.Number({ maximum: 50, minimum: 1 }),
  orderBy: Type.Union([Type.Literal("DESC"), Type.Literal("ASC")]),
  profile: Type.Boolean(),
  offset: Type.Optional(Type.Number()),
});

export type IUserListQueryFilterSchema = Static<
  typeof UserListQueryFilterSchema
>;
