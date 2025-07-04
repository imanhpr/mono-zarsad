import {
  DecimalType,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import type CurrencyType from "./Currency-Type.entity.ts";
import type Wallet from "./Wallet.entity.ts";
import type WalletTransaction from "./Wallet-Transaction.entity.ts";

@Entity()
export default class WalletAudit {
  @PrimaryKey()
  id!: number;

  @Property()
  type!: "INCREMENT" | "DECREMENT" | "LOCK" | "LOCK_FREE";

  @Property({ type: DecimalType, scale: 3, precision: 21 })
  amount!: string;

  @Property({ type: DecimalType, scale: 3, precision: 21 })
  lock!: string;

  @Property({ type: DecimalType, scale: 3, precision: 21 })
  lockAmount!: string;

  @Property({ type: DecimalType, scale: 3, precision: 21 })
  walletAmount!: string;

  @Property()
  createdAt = new Date();

  @ManyToOne("CurrencyType")
  currencyType!: CurrencyType;

  @ManyToOne("Wallet")
  wallet!: Wallet;

  @ManyToOne("WalletTransaction")
  walletTransaction!: WalletTransaction;
}
