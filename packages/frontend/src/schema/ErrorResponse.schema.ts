import { z } from "zod";

export const ErrorResponseSchema = z.object({
  status: z.string().includes("failed"),
  message: z.string(),
  data: z.any(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
