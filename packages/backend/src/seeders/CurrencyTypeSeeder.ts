import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import CurrencyType from "../models/Currency-Type.entity.ts";
import { CurrencyTypeEnum } from "../types/currency-types.ts";

export class CurrencyTypeSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const gold = em.create(CurrencyType, {
      name: CurrencyTypeEnum.GOLD_18,
      name_farsi: "طلا",
    });

    em.persist(gold);
  }
}
