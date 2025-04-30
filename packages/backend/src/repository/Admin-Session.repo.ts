import fp from "fastify-plugin";
import AdminSession from "../models/Admin-Session.entity.ts";
import { EntityManager, LockMode } from "@mikro-orm/core";
import type Admin from "../models/Admin.entity.ts";

export class AdminSessionRepo {
  #em: EntityManager;
  constructor(em: EntityManager) {
    this.#em = em;
  }

  create(admin: Admin, createdAt: Date, expireAt: Date) {
    return this.#em.create(AdminSession, { user: admin, expireAt, createdAt });
  }

  findOneById(sid: string) {
    return this.#em.findOneOrFail(
      AdminSession,
      {
        id: sid,
      },
      {
        populate: ["user"],
      }
    );
  }

  expireRefreshToken(refreshToken: AdminSession) {
    refreshToken.expireAt = new Date();
    this.#em.persist(refreshToken);
  }
}

export default fp(
  function adminSessionRepoPlugin(fastify, _, done) {
    const adminSessionRepo = new AdminSessionRepo(fastify.orm.em);
    fastify.decorate("adminSessionRepo", adminSessionRepo);
    done();
  },
  {
    name: "adminSessionRepoPlugin",
    decorators: {
      fastify: ["orm"],
    },
  }
);

declare module "fastify" {
  interface FastifyInstance {
    adminSessionRepo: InstanceType<typeof AdminSessionRepo>;
  }
}
