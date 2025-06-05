import { z } from "zod";
import { WalletSchema } from "./User.schema";

export const SimpleTransactionCardToCardPayloadSchema = z.object({
  operationType: z.literal("CARD_TO_CARD"),
  transactionType: z.union([z.literal("INCREMENT"), z.literal("DECREMENT")]),
  amount: z.string().regex(/^\d+$/, '"مقدار" فقط باید به صورت عدد باشد.'),
  walletId: z.number(),
  wallet: WalletSchema,
  meta: z.object({
    transactionIdentifier: z
      .string()
      .regex(/^\d+$/, '"شناسه تراکنش" فقط باید به صورت عدد باشد.'),
  }),
});

export const SimpleTransactionGoldDepositPayloadSchema = z.object({
  operationType: z.literal("GOLD_DEPOSIT"),
  transactionType: z.literal("INCREMENT"),
  amount: z
    .string()
    .regex(/^\d+(\.\d+)?$/, '"مقدار" فقط باید به صورت عدد باشد.'),
  walletId: z.number(),
  wallet: WalletSchema,
});

export const SimpleTransactionGoldWithdrawPayloadSchema = z.object({
  operationType: z.literal("GOLD_WITHDRAW"),
  transactionType: z.literal("DECREMENT"),
  amount: z
    .string()
    .regex(/^\d+(\.\d+)?$/, '"مقدار" فقط باید به صورت عدد باشد.'),
  walletId: z.number(),
  wallet: WalletSchema,
});

export const SimpleTransactionPayloadSchema = z.discriminatedUnion(
  "operationType",
  [
    SimpleTransactionGoldDepositPayloadSchema,
    SimpleTransactionCardToCardPayloadSchema,
    SimpleTransactionGoldWithdrawPayloadSchema,
  ]
);

export type ISimpleTransactionCardToCardPayloadSchema = z.infer<
  typeof SimpleTransactionCardToCardPayloadSchema
>;

export const FinalTransactionPayload = z.discriminatedUnion("operationType", [
  SimpleTransactionCardToCardPayloadSchema.extend({ userId: z.number() }),
  SimpleTransactionGoldDepositPayloadSchema.extend({ userId: z.number() }),
  SimpleTransactionGoldWithdrawPayloadSchema.extend({ userId: z.number() }),
]);

export type IFinalTransactionPayload = z.infer<typeof FinalTransactionPayload>;
