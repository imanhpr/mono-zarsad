import { z } from "zod";

export const AccessTokenSchema = z.object({
  accessToken: z.string(),
  expireAt: z.string().datetime(),
});

export type AccessToken = z.infer<typeof AccessTokenSchema>;
