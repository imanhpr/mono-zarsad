import { EntityManager } from "@mikro-orm/postgresql";
import fp from "fastify-plugin";
import Pair from "../models/Pair.entity.ts";

export class PairRepo {
  #em: EntityManager;

  constructor(em: EntityManager) {
    this.#em = em;
  }

  findPairBySymbol(symbol: string) {
    return this.#em.findOneOrFail(Pair, { symbol });
  }
}

export default fp(
  async function pairRepoPlugin(fastify) {
    const pairRepo = new PairRepo(fastify.orm.em as EntityManager);
    fastify.decorate("pairRepo", pairRepo);
  },
  {
    name: "pairRepoPlugin",
    decorators: {
      fastify: ["orm"],
    },
  }
);

declare module "fastify" {
  export interface FastifyInstance {
    pairRepo: InstanceType<typeof PairRepo>;
  }
}
