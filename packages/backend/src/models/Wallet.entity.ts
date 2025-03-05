import {
  Cascade,
  Collection,
  DecimalType,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import type CurrencyType from "./Currency-Type.entity.ts";
import type WalletTransaction from "./Wallet-Transaction.entity.ts";
import type User from "./User.entity.ts";

@Entity()
export default class Wallet {
  @PrimaryKey()
  id!: number;

  @ManyToOne("CurrencyType")
  currencyType!: CurrencyType;

  @Property({ type: DecimalType })
  amount!: string;

  @OneToMany("WalletTransaction", (e: WalletTransaction) => e.wallet, {
    cascade: [Cascade.ALL],
  })
  transactions = new Collection<WalletTransaction>(this);

  @ManyToOne("User", { deleteRule: "cascade" })
  user!: User;
}
