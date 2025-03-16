import { Factory } from "@mikro-orm/seeder";
import CurrencyPrice from "../../models/Currency-Price.entity.ts";
import { Constructor, EntityData } from "@mikro-orm/core";
import { faker } from "@faker-js/faker";
import Spread from "../../models/Spread.entity.ts";

export class CurrencyPriceFactory extends Factory<CurrencyPrice> {
  model: Constructor<CurrencyPrice> = CurrencyPrice;

  protected definition(): EntityData<CurrencyPrice> {
    const createdAt = faker.date.past();
    const spread = this.em.create(
      Spread,
      { sell: "100", buy: "500", createdAt },
      { partial: true }
    );
    return {
      price: faker.number.int({ min: 1000, max: 10000 }).toString(),
      createdAt,
      spread,
    };
  }
}
