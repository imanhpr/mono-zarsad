import { wrap, type EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import CurrencyType from "../models/Currency-Type.entity.ts";
import * as datefns from "date-fns-jalali";
import * as csv from "csv";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { finished } from "node:stream/promises";
import CurrencyPrice from "../models/Currency-Price.entity.ts";
import Spread from "../models/Spread.entity.ts";
import { Decimal } from "decimal.js";
const path = join(
  dirname(fileURLToPath(import.meta.url)),
  "data",
  "GOLD-Price.csv"
);
export class CurrencyPriceSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const currency1 = em.getReference(CurrencyType, 1);
    const buffer = readFileSync(path, "utf-8");

    const stream = csv.parse(buffer).on("data", (data: [string, string]) => {
      const [rialPrice, dateString] = data;
      const date = new Date(dateString);
      const price = Decimal(rialPrice.replaceAll(",", "")).div(10);
      const spread = em.create(
        Spread,
        {
          sell: price.mul("1.01").toString(),
          buy: price.mul("0.99").toString(),
          createdAt: date,
        },
        { partial: true }
      );

      const currencyPrice = em.create(CurrencyPrice, {
        currency: currency1,
        price: price.toString(),
        createdAt: date,
        spread: spread,
      });

      em.persist(currencyPrice);
    });

    await finished(stream);
  }
}
