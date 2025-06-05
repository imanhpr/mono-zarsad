import {
  Check,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import type CurrencyType from "./Currency-Type.entity.ts";

@Entity()
@Check({
  name: "sourceType_and_targetType_should_not_be_equal",
  expression: "target_type_id != source_type_id",
})
export default class Pair {
  @PrimaryKey()
  id!: number;

  @Property()
  symbol!: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  name_fa?: string;

  @ManyToOne("CurrencyType")
  sourceType!: CurrencyType;

  @ManyToOne("CurrencyType")
  targetType!: CurrencyType;

  @ManyToOne("CurrencyType")
  basePriceType!: CurrencyType;
}
