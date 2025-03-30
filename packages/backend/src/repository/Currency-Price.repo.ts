import { Decimal } from "decimal.js";
import { EntityManager } from "@mikro-orm/core";
import fp from "fastify-plugin";
import CurrencyPrice from "../models/Currency-Price.entity.ts";
import type CurrencyType from "../models/Currency-Type.entity.ts";

export type ICreateCurrencyPrice = {
  price: Decimal;
  currency: CurrencyType;
};
export class CurrencyPriceRepo {
  readonly #defaultOption = { partial: true } as const;
  #em: EntityManager;
  constructor(em: EntityManager) {
    this.#em = em;
  }
  async insertOne({ price, currency }: ICreateCurrencyPrice) {
    const currencyPrice = this.#em.create(
      CurrencyPrice,
      {
        currency,
        price: price.toString(),
      },
      this.#defaultOption
    );

    await this.#em.persistAndFlush(currencyPrice);
    return currencyPrice;
  }
  findAll() {
    return this.#em.findAll(CurrencyPrice, {
      populate: ["currency"],
      orderBy: { id: "DESC" },
    });
  }

  findManyByCurrencyId(currencyId: number[]) {
    return this.#em.find(
      CurrencyPrice,
      {
        currency: { id: { $in: currencyId } },
      },
      { populate: ["currency"], orderBy: { createdAt: "DESC" } }
    );
  }

  findLatestCurrencyPriceByCurrencyTypeId(currencyTypeId: number) {
    return this.#em.findOneOrFail(
      CurrencyPrice,
      {
        currency: { id: currencyTypeId },
      },
      { populate: ["spread"], orderBy: { createdAt: "DESC" } }
    );
  }
}

export default fp(
  function currencyPriceRepoPlugin(fastify, _, done) {
    const hasOrm = fastify.hasDecorator("orm");
    if (!hasOrm) throw new Error("Please init orm");
    const currencyPriceRepo = new CurrencyPriceRepo(fastify.orm.em);
    fastify.decorate("currencyPriceRepo", currencyPriceRepo);
    done();
  },
  { name: "currencyPriceRepoPlugin" }
);

declare module "fastify" {
  interface FastifyInstance {
    currencyPriceRepo: InstanceType<typeof CurrencyPriceRepo>;
  }
}
