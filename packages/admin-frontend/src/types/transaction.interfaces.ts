export type TransactionTypes =
  | "SIMPLE_TRANSACTION"
  | "EXCHANGE_TRANSACTION"
  | "WALLET_TO_WALLET_TRANSACTION";

export type SimpleTransactionType =
  | "GOLD_DEPOSIT"
  | "CARD_TO_CARD"
  | "GOLD_WITHDRAW";

export type SimpleTransactionOperation = "INCREMENT" | "DECREMENT";
