import {
  DecimalType,
  Entity,
  Enum,
  ManyToOne,
  Property,
  Unique,
} from "@mikro-orm/core";
import WalletTransaction from "./Wallet-Transaction.entity.ts";
import Wallet from "./Wallet.entity.ts";
import { SimpleTransactionOperationType } from "../types/transaction.ts";

export enum SimpleWalletTransactionStatus {
  SUCCESSFUL = "SUCCESSFUL",
  INIT = "INIT",
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

  @Enum({ items: () => SimpleTransactionOperationType })
  type!: SimpleTransactionOperationType;

  @ManyToOne(() => Wallet)
  wallet!: Wallet;

  @Property({ type: DecimalType, scale: 3, precision: 21 })
  amount!: string;

  @Enum({ items: () => SimpleWalletTransactionStatus })
  status!: SimpleWalletTransactionStatus;

  @Property()
  createdAt = new Date();

  @Property({ type: "jsonb", nullable: true })
  meta?: Record<string, unknown>;
}
