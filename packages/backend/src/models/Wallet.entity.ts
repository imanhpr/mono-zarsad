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
import { Decimal } from "decimal.js";

@Entity()
export default class Wallet {
  @PrimaryKey()
  id!: number;

  @ManyToOne("CurrencyType")
  currencyType!: CurrencyType;

  @Property({ type: DecimalType, scale: 3, precision: 21 })
  amount!: string;

  @Property({ type: DecimalType, scale: 3, precision: 21 })
  lockAmount!: string;

  @OneToMany("WalletAudit", (e: WalletAudit) => e.wallet, {
    cascade: [Cascade.ALL],
  })
  transactions = new Collection<WalletAudit>(this);

  @ManyToOne("User", { deleteRule: "cascade" })
  user!: User;

  availableAmount() {
    const amountDecimal = new Decimal(this.amount);
    const lockAmountDecimal = new Decimal(this.lockAmount);
    return amountDecimal.minus(lockAmountDecimal);
  }
}
