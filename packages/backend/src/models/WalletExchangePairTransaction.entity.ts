import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import type WalletTransaction from "./Wallet-Transaction.entity.ts";

@Entity()
export default class WalletExchangePairTransaction {
  @PrimaryKey({ type: "string" })
  id!: string;

  @ManyToOne("WalletTransaction")
  increment!: WalletTransaction;

  @ManyToOne("WalletTransaction")
  decrement!: WalletTransaction;

  @Property()
  createdAt = new Date();

  @OneToMany(
    "WalletTransaction",
    (e: WalletTransaction) => e.walletExchangePair
  )
  transactions = new Collection<WalletTransaction>(this);
}
