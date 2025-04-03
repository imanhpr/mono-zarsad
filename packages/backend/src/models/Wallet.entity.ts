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
import type User from "./User.entity.ts";
import type WalletAudit from "./Wallet-Audit.entity.ts";

@Entity()
export default class Wallet {
  @PrimaryKey()
  id!: number;

  @ManyToOne("CurrencyType")
  currencyType!: CurrencyType;

  @Property({ type: DecimalType, scale: 3, precision: 21 })
  amount!: string;

  @OneToMany("WalletAudit", (e: WalletAudit) => e.wallet, {
    cascade: [Cascade.ALL],
  })
  transactions = new Collection<WalletAudit>(this);

  @ManyToOne("User", { deleteRule: "cascade" })
  user!: User;
}
