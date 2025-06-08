import { Decimal } from "decimal.js";
import { EntityManager, sql } from "@mikro-orm/postgresql";
import fp from "fastify-plugin";
import CurrencyPrice from "../models/Currency-Price.entity.ts";
import type CurrencyType from "../models/Currency-Type.entity.ts";

export type ICreateCurrencyPrice = {
  price: Decimal;
  currency: CurrencyType;
};

export type LatestCurrencyPriceList = {
  id: number;
  price: string;
  createdAt: string;
};
export class CurrencyPriceRepo {
  readonly #defaultOption = { partial: true } as const;
  #em: EntityManager;
  constructor(em: EntityManager) {
    this.#em = em;
  }
  insertOne({ price, currency }: ICreateCurrencyPrice) {
    const currencyPrice = this.#em.create(
      CurrencyPrice,
      {
        currency,
        price: price.toString(),
      },
      this.#defaultOption
    );

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
      { orderBy: { createdAt: "DESC" } }
    );
  }
  async findLatestCurrencyPriceListByTypeId(
    currencyTypeId: number,
    limit: number,
    orderBy: "DESC" | "ASC"
  ) {
    const subquery = this.#em
      .createQueryBuilder(CurrencyPrice, "cp", "read")
      .select([
        "*",
        sql`LAG(price , -1) OVER (ORDER BY id DESC) AS previous_price`,
      ])
      .where({ currency: { id: currencyTypeId } })
      .getKnexQuery();

    const knex = (await this.#em
      .getKnex()
      .select(["id", "price", "created_at AS createdAt"])
      .from(subquery)
      .whereRaw("previous_price != price")
      .limit(limit)
      .orderBy("createdAt", orderBy)) as LatestCurrencyPriceList[];

    return knex;
  }
}

export default fp(
  function currencyPriceRepoPlugin(fastify, _, done) {
    const hasOrm = fastify.hasDecorator("orm");
    if (!hasOrm) throw new Error("Please init orm");
    const currencyPriceRepo = new CurrencyPriceRepo(
      fastify.orm.em as EntityManager
    );
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
