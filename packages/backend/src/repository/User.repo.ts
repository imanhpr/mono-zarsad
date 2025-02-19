import { EntityManager, EntityRepository } from "@mikro-orm/core";
import fp from "fastify-plugin";

import User from "../models/User.entity.ts";

export class UserRepo {
  #em: EntityManager;
  #repo: EntityRepository<User>;
  constructor(em: EntityManager) {
    this.#em = em;
    this.#repo = this.#em.getRepository(User);
  }

  async createNormal(userInput: Omit<User, "id">): Promise<User> {
    const user = this.#em.create(User, userInput);
    await this.#em.persistAndFlush(user);
    return user;
  }
  async findUserByPhoneNumber(phoneNumber: string) {
    return this.#repo.findOneOrFail({ phoneNumber });
  }
  findById(id: number) {
    return this.#repo.findOneOrFail({ id });
  }
}

export default fp(
  function userRepoPlugin(fastify, _, done) {
    const userRepo = new UserRepo(fastify.orm.em);

    fastify.decorate("userRepo", userRepo);
    done();
  },
  { name: "userRepoPlugin" }
);

declare module "fastify" {
  interface FastifyInstance {
    userRepo: InstanceType<typeof UserRepo>;
  }
}
