import { z } from "zod";

export const RefreshTokenResponseSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("success"),
    message: z.string(),
    data: z.object({
      accessToken: z.string().jwt(),
      expireAt: z.string().datetime(),
    }),
  }),
  z.object({ status: z.literal("failed"), message: z.string() }),
]);

export type IRefreshTokenResponseSchema = z.infer<
  typeof RefreshTokenResponseSchema
>;
