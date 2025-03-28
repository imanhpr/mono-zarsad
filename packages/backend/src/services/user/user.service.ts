import fp from "fastify-plugin";
import type { UserRepo } from "../../repository/User.repo.ts";
import { Decimal } from "decimal.js";

export class UserService {
  #userRepo: UserRepo;
  constructor(userRepo: UserRepo) {
    this.#userRepo = userRepo;
  }
  async getUserInfoById(id: number) {
    const userInfo = await this.#userRepo.getUserInfoForPanelById(id);
    const item = userInfo.wallets.find(
      (wallet) => wallet.currencyType.name === "TOMAN"
    );
    if (!item) throw new Error("Wallet Not Found");
    item.amount = new Decimal(item.amount).trunc().toString();
    return userInfo;
  }
}

export default fp(function userServicePlugin(fastify, _, done) {
  // TODO: validation for deps
  const userService = new UserService(fastify.userRepo);
  fastify.decorate("userService", userService);
  done();
});

declare module "fastify" {
  export interface FastifyInstance {
    userService: InstanceType<typeof UserService>;
  }
}
