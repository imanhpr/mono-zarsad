import fp from "fastify-plugin";
import { type UserRepo } from "../../../repository/User.repo.ts";
import { type ICreateNewUser } from "../../../types/user.ts";
import { type WalletRepo } from "../../../repository/Wallet.repo.ts";
import { type CurrencyTypeRepo } from "../../../repository/Currency-Type.repo.ts";
import { Transactional } from "@mikro-orm/core";
import { mapDateToJalali } from "../../../helpers/index.ts";

class UserManageService {
  #repo: UserRepo;
  #walletRepo: WalletRepo;
  #currencyTypeRepo: CurrencyTypeRepo;
  constructor(
    repo: UserRepo,
    walletRepo: WalletRepo,
    currencyTypeRepo: CurrencyTypeRepo
  ) {
    this.#repo = repo;
    this.#walletRepo = walletRepo;
    this.#currencyTypeRepo = currencyTypeRepo;
  }

  @Transactional()
  async createUser(input: ICreateNewUser) {
    const currencyTypes = await this.#currencyTypeRepo.findAll();

    const user = this.#repo.createNormal(input);
    currencyTypes.map((currencyType) =>
      this.#walletRepo.createNew(currencyType, user)
    );

    return Object.freeze({
      firstName: user.firstName,
      lastName: user.lastName,
      nationalCode: user.nationalCode,
      phoneNumber: user.phoneNumber,
    });
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
