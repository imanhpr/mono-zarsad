import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import CurrencyPrice from "./Currency-Price.ts";

@Entity()
export default class CurrencyType {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @OneToMany(() => CurrencyPrice, (price) => price.currency)
  prices = new Collection<CurrencyPrice>(this);
}
