import fp from "fastify-plugin";

import Session from "../models/Session.entity.ts";
import {
  wrap,
  type EntityManager,
  type EntityRepository,
} from "@mikro-orm/core";
import type User from "../models/User.entity.ts";

export class SessionRepo {
  #em: EntityManager;
  #repo: EntityRepository<Session>;
  constructor(em: EntityManager) {
    this.#em = em;
    this.#repo = this.#em.getRepository(Session);
    console.log(this.#repo);
  }
  async createNew(user: User) {
    const d = new Date();
    d.setHours(d.getHours() + 100);
    const session = this.#repo.create({
      user,
      expireAt: d,
      createdAt: new Date(),
    });
    await this.#repo.insert(session);
    return session;
  }
  findOne(sid: string) {
    return this.#repo.findOneOrFail({ id: sid }, { populate: ["user"] });
  }

  async expireById(sid: string) {
    const session = this.#repo.assign(this.#repo.getReference(sid), {
      expireAt: new Date(),
    });
    await this.#em.persistAndFlush(session);
    return session;
  }
}

export default fp(
  function sessionRepoPlugin(fastify, _, done) {
    const hasMikro = fastify.hasDecorator("orm");
    if (!hasMikro) throw new Error("Please Init Mikro-Orm");

    const sessionRepo = new SessionRepo(fastify.orm.em);

    fastify.decorate("sessionRepo", sessionRepo);
    done();
  },
  { name: "sessionRepoPlugin" }
);

declare module "fastify" {
  interface FastifyInstance {
    sessionRepo: InstanceType<typeof SessionRepo>;
  }
}
