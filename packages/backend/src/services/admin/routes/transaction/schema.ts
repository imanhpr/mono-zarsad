import { Static, Type } from "@sinclair/typebox";

export const SimpleCardToCardTransaction = Type.Object({
  metaType: Type.Literal("CARD_TO_CARD"),
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

export const SimpleTransaction = Type.Union([SimpleCardToCardTransaction]);
export type ISimpleTransaction = Static<typeof SimpleTransaction>;
