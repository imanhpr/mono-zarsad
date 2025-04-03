import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import WalletTransaction from "./Wallet-Transaction.entity.ts";
import Wallet from "./Wallet.entity.ts";

export enum SimpleWalletTransactionType {
  CARD_TO_CARD = "CARD_TO_CARD",
}

@Entity()
export default class WalletSimpleTransaction {
  @ManyToOne(() => WalletTransaction, {
    primary: true,
    fieldName: "transaction_id",
    type: "string",
  })
  id!: string;

  @Enum({ items: () => SimpleWalletTransactionType })
  type!: SimpleWalletTransactionType;

  @ManyToOne(() => Wallet)
  wallet!: Wallet;

  @Property({ unique: true })
  bankTransactionId!: string;
}
