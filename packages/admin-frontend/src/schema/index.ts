import { z } from "zod";

export const adminLoginAuthPayloadSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});

export type IAdminSchemaPayload = z.infer<typeof adminLoginAuthPayloadSchema>;

export const adminLoginAuthResponse = z.object({
  token: z.string().nonempty(),
});
