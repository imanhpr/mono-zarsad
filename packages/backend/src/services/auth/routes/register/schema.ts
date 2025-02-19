import { Type, Static } from "@sinclair/typebox";

export const RegisterRequestBodySchema = Type.Object({
  firstName: Type.String(),
  lastName: Type.String(),
  phoneNumber: Type.String(),
  nationalCode: Type.String(),
});

export type IRegisterRequestBodySchema = Static<
  typeof RegisterRequestBodySchema
>;
