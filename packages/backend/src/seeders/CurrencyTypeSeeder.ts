import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import CurrencyType from "../models/Currency-Type.entity.ts";
import { CurrencyTypeEnum } from "../types/currency-types.ts";

export class CurrencyTypeSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.create(CurrencyType, {
      name: CurrencyTypeEnum.MELTED_GOLD_LOWER_18,
      hasWallet: false,
      name_farsi: "آب شده زیر یک گرم",
    });

    em.create(CurrencyType, {
      name: CurrencyTypeEnum.MELTED_GOLD_NAGHDI_18,
      hasWallet: false,
      name_farsi: "آب شده نقدی",
    });

    em.create(CurrencyType, {
      name: CurrencyTypeEnum.MELTED_GOLD_BONAK_18,
      hasWallet: false,
      name_farsi: "آب شده بنکداری",
    });

    em.create(CurrencyType, {
      name: CurrencyTypeEnum.TOMAN,
      hasWallet: true,
      name_farsi: "تومان",
    });
    em.create(CurrencyType, {
      name: CurrencyTypeEnum.MELTED_GOLD_18,
      hasWallet: true,
      name_farsi: "طلا آب شده",
    });
  }
}
