import fp from "fastify-plugin";
import { type UserRepo } from "../../../repository/User.repo.ts";

export type ICreateNewUser = Omit<
  Parameters<UserRepo["createNormal"]>[0],
  "sessions"
>;

class UserManageService {
  #repo: UserRepo;
  constructor(repo: UserRepo) {
    this.#repo = repo;
  }

  createUser(input: ICreateNewUser) {
    return this.#repo.createNormal(input);
  }
}

export default fp(
  function userManageService(fastify, _, done) {
    const hasRepo = fastify.hasDecorator("userRepo");
    if (!hasRepo) throw new Error("Please Init UserRepo");
    const userManageService = new UserManageService(fastify.userRepo);
    fastify.decorate("userManageService", userManageService);
    done();
  },
  { name: "userManageService" }
);

declare module "fastify" {
  interface FastifyInstance {
    userManageService: InstanceType<typeof UserManageService>;
  }
}
