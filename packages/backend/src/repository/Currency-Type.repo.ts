import { EntityManager } from "@mikro-orm/core";
import fp from "fastify-plugin";
import CurrencyType from "../models/Currency-Type.entity.ts";

export class CurrencyTypeRepo {
  #em: EntityManager;

  constructor(em: EntityManager) {
    this.#em = em;
  }

  async findOneById(id: number) {
    const result = await this.#em.findOneOrFail(CurrencyType, { id });
    return result;
  }
}

export default fp(
  function currencyTypeRepoPlugin(fastify, _, done) {
    const hasOrm = fastify.hasDecorator("orm");
    if (!hasOrm) throw new Error("Please init orm");
    const currencyTypeRepo = new CurrencyTypeRepo(fastify.orm.em);
    fastify.decorate("currencyTypeRepo", currencyTypeRepo);
    done();
  },
  { name: "currencyTypeRepoPlugin" }
);

declare module "fastify" {
  interface FastifyInstance {
    currencyTypeRepo: InstanceType<typeof CurrencyTypeRepo>;
  }
}
