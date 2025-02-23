import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import CurrencyType from "./Currency-Type.entity.ts";

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
}
