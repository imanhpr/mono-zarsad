import {
  DecimalType,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import CurrencyType from "./Currency-Type.entity.ts";

@Entity()
export default class WalletTransaction {
  @PrimaryKey()
  id!: number;

  @Property()
  type!: "INCREMENT" | "DECREMENT";

  @Property()
  amount!: DecimalType;

  @Property()
  walletAmount!: DecimalType;

  @Property()
  createdAt = new Date();

  @Property()
  source!: string;

  @ManyToMany(() => CurrencyType)
  currencyType!: CurrencyType;
}
