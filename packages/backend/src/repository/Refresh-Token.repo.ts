import { randomUUID } from "node:crypto";
import { EntityManager, LockMode } from "@mikro-orm/core";
import fp from "fastify-plugin";
import RefreshToken from "../models/Refresh-Token.entity.ts";
import UserSession from "../models/User-Session.entity.ts";

export class RefreshTokenRepo {
  #em: EntityManager;
  constructor(em: EntityManager) {
    this.#em = em;
  }

  create(userSession: UserSession, createdAt: Date, expireAt: Date) {
    const id = randomUUID();
    return this.#em.create(RefreshToken, {
      id: id,
      session: userSession,
      createdAt,
      expireAt,
    });
  }

  expireRefreshToken(refreshToken: RefreshToken) {
    refreshToken.expireAt = new Date();
    this.#em.persist(refreshToken);
  }
  findRefreshTokenByIdAndActiveSession(refreshToken: string) {
    return this.#em.findOneOrFail(
      RefreshToken,
      {
        id: refreshToken,
        session: { isActive: true },
      },
      { populate: ["session"] }
    );
  }
}

export default fp(
  async function refreshTokenRepoPlugin(fastify) {
    const refreshTokenRepo = new RefreshTokenRepo(fastify.orm.em);
    fastify.decorate("refreshTokenRepo", refreshTokenRepo);
  },
  {
    name: "refreshTokenRepoPlugin",
    decorators: {
      fastify: ["orm"],
    },
  }
);

declare module "fastify" {
  export interface FastifyInstance {
    refreshTokenRepo: InstanceType<typeof RefreshTokenRepo>;
  }
}
