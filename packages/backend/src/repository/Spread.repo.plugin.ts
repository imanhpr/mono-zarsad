import { EntityManager } from "@mikro-orm/postgresql";
import fp from "fastify-plugin";
import Spread from "../models/Spread.entity.ts";

export class SpreadRepo {
  #em: EntityManager;
  constructor(em: EntityManager) {
    this.#em = em;
  }
  async getLatestSpread() {
    const result = await this.#em
      .getRepository(Spread)
      .findAll({ limit: 1, orderBy: { createdAt: "DESC" } });
    return result[0];
  }
}

export default fp(
  async function spreadRepoPlugin(fastify) {
    const spreadRepo = new SpreadRepo(fastify.orm.em as EntityManager);
    fastify.decorate("spreadRepo", spreadRepo);
  },
  {
    name: "spreadRepoPlugin",
    decorators: { fastify: ["orm"] },
  }
);

declare module "fastify" {
  export interface FastifyInstance {
    spreadRepo: InstanceType<typeof SpreadRepo>;
  }
}
