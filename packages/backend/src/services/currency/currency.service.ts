import fp from "fastify-plugin";
import { CurrencyPriceRepo } from "../../repository/Currency-Price.repo.ts";
import { type CurrencyTypeRepo } from "../../repository/Currency-Type.repo.ts";
import { Decimal } from "decimal.js";
import { format } from "date-fns-jalali";
import type CurrencyPrice from "../../models/Currency-Price.entity.ts";

export type CreateNewPrice = {
  price: string;
  currencyId: number;
};

export class CurrencyService {
  #priceRepo: CurrencyPriceRepo;
  #typeRepo: CurrencyTypeRepo;

  constructor(
    currencyPriceRepo: CurrencyPriceRepo,
    currencyTypeRepo: CurrencyTypeRepo
  ) {
    this.#priceRepo = currencyPriceRepo;
    this.#typeRepo = currencyTypeRepo;
  }

  async insertNewCurrencyPrice({ price, currencyId }: CreateNewPrice) {
    const currency = await this.#typeRepo.findOneById(currencyId);
    const decimalPrice = new Decimal(price);
    const currencyPrice = await this.#priceRepo.insertOne({
      price: decimalPrice,
      currency,
    });
    return currencyPrice;
  }

  async findAllCurrencyPrice(): Promise<CurrencyPrice[]> {
    const result = await this.#priceRepo.findAll();
    return this.#mapDateToJalali(result);
  }

  async findCurrencyPriceByCurrencyTypeId(id: number, isJalali = true) {
    console.log(isJalali);
    const result = await this.#priceRepo.findManyByCurrencyId([id]);
    if (!isJalali) return result;
    return this.#mapDateToJalali(result);
  }

  #mapDateToJalali<T extends { createdAt: Date }>(input: T[]): T[] {
    return input.map((data) => {
      return Object.assign(data, {
        createdAt: format(new Date(data.createdAt), "yyyy-MM-dd EEEE HH:mm:ss"),
      });
    });
  }
}

export default fp(
  function currencyPriceServicePlugin(fastify, _, done) {
    const hasCurrencyPriceRepo = fastify.hasDecorator("currencyPriceRepo");
    const hasCurrencyTypeRepo = fastify.hasDecorator("currencyTypeRepo");
    if (!hasCurrencyPriceRepo) throw new Error("Please init currencyPriceRepo");
    if (!hasCurrencyTypeRepo) throw new Error("Please init currencyTypeRepo");
    const currencyService = new CurrencyService(
      fastify.currencyPriceRepo,
      fastify.currencyTypeRepo
    );
    fastify.decorate("currencyService", currencyService);
    done();
  },
  { name: "currencyPriceServicePlugin" }
);

declare module "fastify" {
  interface FastifyInstance {
    currencyService: InstanceType<typeof CurrencyService>;
  }
}
