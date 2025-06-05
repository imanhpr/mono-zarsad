import {
  DecimalType,
  Entity,
  Enum,
  JsonProperty,
  ManyToOne,
  Property,
  Unique,
} from "@mikro-orm/core";
import WalletTransaction from "./Wallet-Transaction.entity.ts";
import Wallet from "./Wallet.entity.ts";

export enum SimpleWalletTransactionStatus {
  SUCCESSFUL = "SUCCESSFUL",
  INIT = "INIT",
}
export enum SimpleWalletTransactionType {
  CARD_TO_CARD = "CARD_TO_CARD",
  PHYSICAL_GOLD_WITHDRAW = "PHYSICAL_GOLD_WITHDRAW",
  TOMAN_WITHDRAW = "TOMAN_WITHDRAW",
}

@Entity()
@Unique({
  name: "card_to_card_transaction_id_unique",
  properties: "meta.transactionIdentifier",
})
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

  @Property({ type: DecimalType, scale: 3, precision: 21 })
  amount!: string;

  @Enum({ items: () => SimpleWalletTransactionStatus })
  status!: SimpleWalletTransactionStatus;

  @Property()
  createdAt = new Date();

  @Property({ type: "jsonb", nullable: true })
  meta?: Record<string, unknown>;
}
