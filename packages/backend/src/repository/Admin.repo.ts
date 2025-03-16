import fp from "fastify-plugin";
import Admin from "../models/Admin.entity.ts";
import { EntityRepository, EntityManager } from "@mikro-orm/core";

export class AdminRepo {
  #repo: EntityRepository<Admin>;
  constructor(em: EntityManager) {
    this.#repo = em.getRepository(Admin);
  }
  async findOneByUserName(username: string): Promise<Admin> {
    return this.#repo.findOneOrFail({ username });
  }

  findById(id: number) {
    return this.#repo.findOneOrFail({ id }, { exclude: ["password"] });
  }
}

export default fp(
  function adminRepoPlugin(fastify, _, done) {
    const hasMikro = fastify.hasDecorator("orm");
    if (!hasMikro) throw new Error("Please init mikro-orm");
    const adminRepo = new AdminRepo(fastify.orm.em);
    fastify.decorate("adminRepo", adminRepo);
    done();
  },
  { name: "adminRepoPlugin" }
);

declare module "fastify" {
  interface FastifyInstance {
    adminRepo: InstanceType<typeof AdminRepo>;
  }
}
