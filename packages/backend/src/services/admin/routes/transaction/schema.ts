import { Static, Type } from "@sinclair/typebox";
import {
  SimpleTransactionOperationType,
  SimpleTransactionType,
} from "../../../../types/transaction.ts";

export const SimpleCardToCardTransaction = Type.Object({
  operationType: Type.Literal(SimpleTransactionOperationType.CARD_TO_CARD),
  userId: Type.Number(),
  amount: Type.String(),
  walletId: Type.Number(),
  transactionType: Type.Enum({
    DECREMENT: "DECREMENT",
    INCREMENT: "INCREMENT",
  }),
  meta: Type.Object({
    transactionIdentifier: Type.String(),
  }),
});

export const SimpleTransactionGoldDeposit = Type.Object({
  operationType: Type.Literal(SimpleTransactionOperationType.GOLD_DEPOSIT),
  userId: Type.Number(),
  amount: Type.String(),
  walletId: Type.Number(),
  transactionType: Type.Literal(SimpleTransactionType.INCREMENT),
});

export const SimpleTransactionGoldWithdraw = Type.Object({
  operationType: Type.Literal(SimpleTransactionOperationType.GOLD_WITHDRAW),
  userId: Type.Number(),
  amount: Type.String(),
  walletId: Type.Number(),
  transactionType: Type.Literal(SimpleTransactionType.DECREMENT),
});

export const SimpleTransaction = Type.Union([
  SimpleCardToCardTransaction,
  SimpleTransactionGoldDeposit,
  SimpleTransactionGoldWithdraw,
]);
export type ISimpleTransaction = Static<typeof SimpleTransaction>;

export const ExchangeTransactionInitSchema = Type.Object({
  pairSymbol: Type.String(),
  sourceAmount: Type.String(),
  userId: Type.Number(),
});

export type IExchangeTransactionInitSchema = Static<
  typeof ExchangeTransactionInitSchema
>;

export const FinalizeExchangeSchema = Type.Object({
  transactionId: Type.String(),
});

export type IFinalizeExchangeSchema = Static<typeof FinalizeExchangeSchema>;
