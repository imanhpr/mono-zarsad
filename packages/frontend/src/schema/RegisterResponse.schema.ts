import { z } from "zod";

export const RegisterResponseSchema = z.object({
  status: z.string().includes("success"),
  message: z.string(),
  data: z.object({
    isOtpSend: z.boolean(),
  }),
});

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
