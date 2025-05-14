import { Type, Static } from "@sinclair/typebox";

export const GetLatestPriceListQuerySchema = Type.Object({
  limit: Type.String({
    pattern: "^[0-9]+$",
  }),
  currencyTypeId: Type.String({
    pattern: "^[0-9]+$",
  }),
  orderBy: Type.Union([Type.Literal("ASC"), Type.Literal("DESC")]),
});

export type GetLatestPriceListQuery = Static<
  typeof GetLatestPriceListQuerySchema
>;
