import { Type, Static } from "@sinclair/typebox";

export const LoginRequestBodySchema = Type.Object({
  phoneNumber: Type.String(),
});

export type ILoginRequestBodySchema = Static<typeof LoginRequestBodySchema>;
