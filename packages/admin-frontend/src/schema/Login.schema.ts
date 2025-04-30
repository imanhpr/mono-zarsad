import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type ILoginFormSchema = z.infer<typeof LoginFormSchema>;

export const LoginResponseSchema = z.discriminatedUnion("status", [
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

export type ILoginResponseSchema = z.infer<typeof LoginResponseSchema>;
