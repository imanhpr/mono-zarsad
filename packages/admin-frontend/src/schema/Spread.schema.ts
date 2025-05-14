import { z } from "zod";

export const CurrentActiveSpreadResponseSchema = z.object({
  status: z.literal("success"),
  message: z.string(),
  data: z.object({
    id: z.number(),
    sell: z.string(),
    buy: z.string(),
    createdAt: z.string().datetime(),
  }),
});

export type ICurrentActiveSpreadResponseSchema = z.infer<
  typeof CurrentActiveSpreadResponseSchema
>;
