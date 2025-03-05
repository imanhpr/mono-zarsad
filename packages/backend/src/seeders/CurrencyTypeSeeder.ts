import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import CurrencyType from "../models/Currency-Type.entity.ts";
import { CurrencyTypeEnum } from "../types/currency-types.ts";
import { CurrencyPriceFactory } from "./factories/CurrencyPriceFactory.ts";

export class CurrencyTypeSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const gold = em.create(CurrencyType, {
      name: CurrencyTypeEnum.GOLD_18,
      name_farsi: "طلا",
    });
    const toman = em.create(CurrencyType, {
      name: CurrencyTypeEnum.TOMAN,
      name_farsi: "تومان",
    });

    new CurrencyPriceFactory(em).make(50, { currency: gold });
    new CurrencyPriceFactory(em).make(50, { currency: toman });
  }
}
