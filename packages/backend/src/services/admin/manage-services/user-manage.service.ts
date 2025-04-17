import fp from "fastify-plugin";
import { type UserRepo } from "../../../repository/User.repo.ts";
import { type ICreateNewUser } from "../../../types/user.ts";
import { mapDateToJalali } from "../../../helpers/index.ts";
import UserFactoryService from "../../shared/UserFactory.service.ts";

class UserManageService {
  #repo: UserRepo;
  #sharedUserFactoryService: UserFactoryService;
  constructor(repo: UserRepo, userFactoryService: UserFactoryService) {
    this.#repo = repo;
    this.#sharedUserFactoryService = userFactoryService;
  }

  createUser(input: ICreateNewUser) {
    return this.#sharedUserFactoryService.createNormalUser(input);
  }

  async getLatestUsers() {
    const result = await this.#repo.findLatestUserList();
    return mapDateToJalali(result);
  }

  deleteUserById(id: number) {
    return this.#repo.deleteUserById(id);
  }

  editUserById(userId: number, payload: { user: object; profile: object }) {
    return this.#repo.updateUserAndProfileById(userId, payload);
  }

  async userListByFilter(input: { userId?: number; nationalCode?: string }) {
    const result = await this.#repo.findUsersByFilter(input);
    return {
      users: mapDateToJalali(result.users),
      count: result.count,
    };
  }
}

export default fp(
  function userManageService(fastify, _, done) {
    const hasRepo = fastify.hasDecorator("userRepo");
    if (!hasRepo) throw new Error("Please Init UserRepo");
    // TODO: Add validation for walletRepo and currencyTypeRepo
    const userManageService = new UserManageService(
      fastify.userRepo,
      fastify.walletRepo,
      fastify.currencyTypeRepo
    );
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
