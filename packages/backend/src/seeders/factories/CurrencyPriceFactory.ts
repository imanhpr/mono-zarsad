import { Factory } from "@mikro-orm/seeder";
import CurrencyPrice from "../../models/Currency-Price.entity.ts";
import { Constructor, EntityData } from "@mikro-orm/core";
import { faker } from "@faker-js/faker";

export class CurrencyPriceFactory extends Factory<CurrencyPrice> {
  model: Constructor<CurrencyPrice> = CurrencyPrice;

  protected definition(): EntityData<CurrencyPrice> {
    return {
      createdAt: faker.date.past(),
      price: faker.number.int({ min: 1000, max: 10000 }).toString(),
    };
  }
}
