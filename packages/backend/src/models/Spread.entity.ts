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

  @Property({ type: DecimalType })
  sell!: string;

  @Property({ type: DecimalType })
  buy!: string;

  @Property()
  createdAt = new Date();

  @OneToOne("CurrencyPrice", (c: CurrencyPrice) => c.spread)
  currencyPrice!: CurrencyPrice;
}
