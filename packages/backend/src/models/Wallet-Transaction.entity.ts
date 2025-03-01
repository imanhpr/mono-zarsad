import {
  DecimalType,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import type CurrencyType from "./Currency-Type.entity.ts";

@Entity()
export default class WalletTransaction {
  @PrimaryKey()
  id!: number;

  @Property()
  type!: "INCREMENT" | "DECREMENT";

  @Property({ columnType: "decimal" })
  amount!: DecimalType;

  @Property({ columnType: "decimal" })
  walletAmount!: DecimalType;

  @Property()
  createdAt = new Date();

  @Property()
  source!: string;

  @ManyToOne("CurrencyType")
  currencyType!: CurrencyType;
}
