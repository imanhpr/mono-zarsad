import {
  DecimalType,
  Entity,
  OneToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import type CurrencyPrice from "./Currency-Price.entity.ts";

@Entity()
export default class Spread {
  @PrimaryKey()
  id!: number;

  @Property({ type: DecimalType, scale: 3, precision: 21 })
  sell!: string;

  @Property({ type: DecimalType, scale: 3, precision: 21 })
  buy!: string;

  @Property()
  createdAt = new Date();

  @OneToOne("CurrencyPrice", (c: CurrencyPrice) => c.spread)
  currencyPrice!: CurrencyPrice;
}
