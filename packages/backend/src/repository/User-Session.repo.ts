import { EntityManager } from "@mikro-orm/core";
import fp from "fastify-plugin";
import UserSession from "../models/User-Session.entity.ts";
import { randomUUID } from "crypto";
import type User from "../models/User.entity.ts";

export class UserSessionRepo {
  #em: EntityManager;
  constructor(em: EntityManager) {
    this.#em = em;
  }

  create(user: User, device: string, isActive: boolean) {
    const sid = randomUUID();
    return this.#em.create(UserSession, {
      id: sid,
      lastOnline: new Date(),
      createdAt: new Date(),
      user: user,
      device: device,
      isActive,
      updatedAt: new Date(),
    });
  }

  deactivateSession(session: UserSession) {
    session.isActive = false;
    session.lastOnline = new Date();
    session.updatedAt = new Date();
    return this.#em.persistAndFlush(session);
  }
}

export default fp(
  function userSessionRepoPlugin(fastify, _, done) {
    const userSessionRepo = new UserSessionRepo(fastify.orm.em);
    fastify.decorate("userSessionRepo", userSessionRepo);
    done();
  },
  {
    name: "userSessionRepoPlugin",
    decorators: {
      fastify: ["orm"],
    },
  }
);

declare module "fastify" {
  interface FastifyInstance {
    userSessionRepo: InstanceType<typeof UserSessionRepo>;
  }
}
