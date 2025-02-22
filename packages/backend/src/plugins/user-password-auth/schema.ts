import { Type, Static } from "@sinclair/typebox";

export const UserPasswordAuthRequestBodySchema = Type.Object({
  username: Type.String({ readOnly: true }),
  password: Type.String({ readOnly: true }),
});

export type IUserPasswordAuthRequestBodySchema = Static<
  typeof UserPasswordAuthRequestBodySchema
>;
