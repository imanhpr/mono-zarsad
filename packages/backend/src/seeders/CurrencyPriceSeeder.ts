import { wrap, type EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { CurrencyPriceFactory } from "./factories/CurrencyPriceFactory.ts";
import CurrencyType from "../models/Currency-Type.entity.ts";

export class CurrencyPriceSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const currency1 = em.getReference(CurrencyType, 1);
    const currency2 = em.getReference(CurrencyType, 2);
    new CurrencyPriceFactory(em).make(50, { currency: currency1 });
    new CurrencyPriceFactory(em).make(50, { currency: currency2 });
  }
}
