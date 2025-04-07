import { EntityManager } from "@mikro-orm/core";
import fp from "fastify-plugin";
import SystemInfo from "../models/System-Info.entity.ts";

export class SystemInfoRepo {
  #em: EntityManager;
  constructor(em: EntityManager) {
    this.#em = em;
  }

  async getCompanyInfo() {
    const key = "COMPANY_INFO";
    const result = await this.#em.findOneOrFail(SystemInfo, key);
    return result.value;
  }
}

export default fp(
  function systemInfoRepoPlugin(fastify, _, done) {
    // TODO: check for deps
    const systemInfoRepo = new SystemInfoRepo(fastify.orm.em);
    fastify.decorate("systemInfoRepo", systemInfoRepo);
    done();
  },
  { name: "systemInfoRepoPlugin" }
);

declare module "fastify" {
  export interface FastifyInstance {
    systemInfoRepo: InstanceType<typeof SystemInfoRepo>;
  }
}
