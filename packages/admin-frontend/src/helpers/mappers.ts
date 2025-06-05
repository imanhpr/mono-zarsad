import {
  SimpleTransactionType,
  TransactionTypes,
} from "../types/transaction.interfaces";

export function transactionTypeMapper(type: TransactionTypes): string {
  switch (type) {
    case "EXCHANGE_TRANSACTION":
      return "تراکنش تبدیل";
    case "SIMPLE_TRANSACTION":
      return "تراکنش ساده";
    case "WALLET_TO_WALLET_TRANSACTION":
      return "تراکنش کیف به کیف";
  }
}

export function simpleTransactionTypeMapper(
  type: SimpleTransactionType
): string {
  switch (type) {
    case "CARD_TO_CARD":
      return "کارت به کارت";
    case "GOLD_DEPOSIT":
      return "واریز طلا";
    case "GOLD_WITHDRAW":
      return "برداشت طلا";
  }
}
