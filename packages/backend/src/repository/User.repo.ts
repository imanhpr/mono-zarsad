import { EntityManager, EntityRepository, wrap } from "@mikro-orm/core";
import fp from "fastify-plugin";

import User from "../models/User.entity.ts";
import Profile from "../models/Profile.entity.ts";
import { ICreateNewUser } from "../types/user.ts";

export class UserRepo {
  #em: EntityManager;
  #repo: EntityRepository<User>;
  constructor(em: EntityManager) {
    this.#em = em;
    this.#repo = this.#em.getRepository(User);
  }

  createNormal(userInput: ICreateNewUser): User {
    const profile = new Profile();
    const user = this.#em.create(
      User,
      { ...userInput, profile: profile },
      { partial: true }
    );
    return user;
  }
  async findUserByPhoneNumber(phoneNumber: string) {
    return this.#repo.findOneOrFail({ phoneNumber });
  }
  findById(id: number) {
    return this.#repo.findOneOrFail({ id });
  }

  findLatestUserList() {
    return this.#repo.find(
      {},
      {
        limit: 10,
        orderBy: { createdAt: "DESC" },
        populate: ["profile"],
      }
    );
  }

  async deleteUserById(id: number) {
    const user = this.#repo.getReference(id);
    await this.#em.removeAndFlush(user);
  }

  async updateUserAndProfileById(
    userId: number,
    payload: {
      profile: object;
      user: object;
    }
  ) {
    const user = await this.#em.findOneOrFail(
      User,
      { id: userId },
      { populate: ["profile"] }
    );
    const profile = this.#em.getReference(Profile, user.profile.id);

    const wUser = wrap(user).assign(payload.user);
    const wProfile = wrap(profile).assign(payload.profile);

    await this.#em.persistAndFlush([wUser, wProfile]);
    return { result: "success", user: wUser };
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
