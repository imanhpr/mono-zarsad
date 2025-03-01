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
