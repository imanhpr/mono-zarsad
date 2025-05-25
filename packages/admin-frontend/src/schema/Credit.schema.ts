import { z } from "zod";
import { WalletSchema } from "./User.schema";

export const SimpleTransactionBasePayloadSchema = z.object({
  transactionType: z.union([z.literal("INCREMENT"), z.literal("DECREMENT")]),
  userId: z.number(),
});

export type ISimpleTransactionBasePayloadSchema = z.infer<
  typeof SimpleTransactionBasePayloadSchema
>;

const baseCardToCardObj = {
  amount: z.string().regex(/^\d+$/, '"مقدار" فقط باید به صورت عدد باشد.'),
  metaType: z.literal("CARD_TO_CARD"),
  wallet: WalletSchema,
  meta: z.object({
    transactionIdentifier: z
      .string()
      .regex(/^\d+$/, '"شناسه تراکنش" فقط باید به صورت عدد باشد.'),
  }),
};

export const SimpleTransactionCardToCardPayloadBaseSchema =
  z.object(baseCardToCardObj);

export type ISimpleTransactionCardToCardPayloadBaseSchema = z.infer<
  typeof SimpleTransactionCardToCardPayloadBaseSchema
>;

export const SimpleTransactionCardToCardPayloadSchema =
  SimpleTransactionBasePayloadSchema.extend(baseCardToCardObj);

export const SimpleTransactionPayloadSchema = z.discriminatedUnion("metaType", [
  SimpleTransactionCardToCardPayloadSchema,
]);

export type ISimpleTransactionPayloadSchema = z.infer<
  typeof SimpleTransactionPayloadSchema
>;

export type ISimpleTransactionCardToCardPayloadSchema = z.infer<
  typeof SimpleTransactionCardToCardPayloadSchema
>;
