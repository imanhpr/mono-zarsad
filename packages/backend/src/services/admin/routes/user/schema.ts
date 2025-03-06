import { Static, Type } from "@sinclair/typebox";

export const CreateUserPostRequestBodySchema = Type.Object({
  firstName: Type.String(),
  lastName: Type.String(),
  nationalCode: Type.String(),
  phoneNumber: Type.String(),
});
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
