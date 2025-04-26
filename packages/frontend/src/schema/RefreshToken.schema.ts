import { z } from "zod";

export const AccessTokenSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("success"),
    message: z.string(),
    data: z.object({
      accessToken: z.string(),
      expireAt: z.string().datetime(),
    }),
  }),
  z.object({
    status: z.literal("failed"),
    message: z.string(),
    data: z.object({
      phoneNumber: z.string(),
      code: z.string(),
    }),
  }),
]);

export type AccessToken = z.infer<typeof AccessTokenSchema>;
