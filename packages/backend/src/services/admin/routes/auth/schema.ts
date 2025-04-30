import { Type, Static } from "@sinclair/typebox";

export const AdminAuthLoginRequestPayloadSchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
});

export type IAdminAuthLoginRequestPayloadSchema = Static<
  typeof AdminAuthLoginRequestPayloadSchema
>;
