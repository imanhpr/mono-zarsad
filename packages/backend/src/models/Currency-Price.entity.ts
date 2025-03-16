import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import CurrencyType from "./Currency-Type.entity.ts";
import type Spread from "./Spread.entity.ts";

@Entity()
export default class CurrencyPrice {
  @PrimaryKey()
  id!: number;

  @Property({ type: "decimal" })
  price!: string;

  @Property()
  createdAt = new Date();

  @ManyToOne(() => CurrencyType)
  currency!: CurrencyType;

  @OneToOne("Spread", (s: Spread) => s.currencyPrice, { owner: true })
  spread!: Spread;
}
