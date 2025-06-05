import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import Pair from "../models/Pair.entity.ts";
import CurrencyType from "../models/Currency-Type.entity.ts";
import { CurrencyTypeEnum } from "../types/currency-types.ts";

export class PairSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const goldType = await em.findOneOrFail(CurrencyType, {
      name: CurrencyTypeEnum.MELTED_GOLD_18,
    });

    const tomanType = await em.findOneOrFail(CurrencyType, {
      name: CurrencyTypeEnum.TOMAN,
    });

    const lower1G = await em.findOneOrFail(CurrencyType, {
      name: CurrencyTypeEnum.MELTED_GOLD_LOWER_18,
    });
    em.create(Pair, {
      name: "TOMAN/GOLD",
      symbol: "TH/GOLD",
      basePriceType: lower1G,
      sourceType: tomanType,
      targetType: goldType,
      name_fa: "تومان به طلا به قیمت زیر یک گرم",
    });

    em.create(Pair, {
      name: "GOLD/TOMAN",
      symbol: "GOLD/TH",
      basePriceType: lower1G,
      sourceType: goldType,
      targetType: tomanType,
      name_fa: "طلا به تومان به قیمت زیر یک گرم",
    });
  }
}
