import {
  DecimalType,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import CurrencyType from "./Currency-Type.entity.ts";

@Entity()
export default class Wallet {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => CurrencyType)
  currencyType!: CurrencyType;

  @Property()
  amount!: DecimalType;
}
