import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import CurrencyType from "../models/Currency-Type.entity.ts";
import { CurrencyTypeEnum } from "../types/currency-types.ts";

export class CurrencyTypeSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.create(CurrencyType, {
      name: CurrencyTypeEnum.MELTED_GOLD_LOWER_18,
      name_farsi: "طلا آب شده",
    });

    em.create(CurrencyType, {
      name: CurrencyTypeEnum.MELTED_GOLD_NAGHDI_18,
      name_farsi: "طلا آب شده",
    });

    em.create(CurrencyType, {
      name: CurrencyTypeEnum.MELTED_GOLD_BONAK_18,
      name_farsi: "طلا آب شده",
    });

    em.create(CurrencyType, {
      name: CurrencyTypeEnum.TOMAN,
      name_farsi: "تومان",
    });
  }
}
