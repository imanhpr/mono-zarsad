import fp from "fastify-plugin";
import { EntityManager, LockMode } from "@mikro-orm/postgresql";
import Profile from "../models/Profile.entity.ts";

export class ProfileRepo {
  #em: EntityManager;
  constructor(em: EntityManager) {
    this.#em = em;
  }
  findProfileByUserIdWithLock(userId: number) {
    return this.#em.findOneOrFail(
      Profile,
      { user: { id: userId } },
      { lockMode: LockMode.PESSIMISTIC_PARTIAL_READ }
    );
  }
}

export default fp(function profileRepoPlugin(fastify, _, done) {
  // TODO: Guard for deps
  const profileRepo = new ProfileRepo(fastify.orm.em as EntityManager);
  fastify.decorate("profileRepo", profileRepo);
  done();
});

declare module "fastify" {
  export interface FastifyInstance {
    profileRepo: InstanceType<typeof ProfileRepo>;
  }
}
