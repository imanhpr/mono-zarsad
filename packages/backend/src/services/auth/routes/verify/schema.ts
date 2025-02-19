import { Type, Static } from "@sinclair/typebox";

export const VerifyRequestBodySchema = Type.Object({
  phoneNumber: Type.String(),
  code: Type.String(),
});

export type IVerifyRequestBodySchema = Static<typeof VerifyRequestBodySchema>;
