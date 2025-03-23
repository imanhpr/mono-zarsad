import { Static, Type } from "@sinclair/typebox";

export const CreateNewTransactionPostBodySchema = Type.Object({
  walletId: Type.Number(),
  amount: Type.String(),
  transactionType: Type.Enum({
    DECREMENT: "DECREMENT",
    INCREMENT: "INCREMENT",
  }),
});

export type ICreateNewTransactionPostBodySchema = Static<
  typeof CreateNewTransactionPostBodySchema
>;
