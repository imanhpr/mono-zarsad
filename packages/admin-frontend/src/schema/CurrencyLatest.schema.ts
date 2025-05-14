import { z } from "zod";

const PriceDataSchema = z.object({
  id: z.number(),
  price: z.string(),
  createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});

const CurrencySchema = z.object({
  id: z.number(),
  name: z.string(),
  name_farsi: z.string(),
});

export const GetLatestCurrencyPriceListSchema = z.object({
  status: z.enum(["success"]),
  message: z.string(),
  data: z.object({
    currency: CurrencySchema,
    data: z.array(PriceDataSchema),
  }),
});

export type IGetLatestCurrencyPriceListSchema = z.infer<
  typeof GetLatestCurrencyPriceListSchema
>;
