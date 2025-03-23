import {
  DecimalType,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import type CurrencyType from "./Currency-Type.entity.ts";
import type Wallet from "./Wallet.entity.ts";

@Entity()
export default class WalletTransaction {
  @PrimaryKey()
  id!: number;

  @Property()
  type!: "INCREMENT" | "DECREMENT";

  @Property({ type: DecimalType, scale: 3, precision: 21 })
  amount!: string;

  @Property({ type: DecimalType, scale: 3, precision: 21 })
  walletAmount!: string;

  @Property()
  createdAt = new Date();

  @Property()
  source!: string;

  @ManyToOne("CurrencyType")
  currencyType!: CurrencyType;

  @ManyToOne("Wallet")
  wallet!: Wallet;
}
