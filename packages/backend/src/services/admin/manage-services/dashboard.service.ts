import fp from "fastify-plugin";
import { type UserRepo } from "../../../repository/User.repo.ts";
import * as luxon from "luxon";
import { WalletTransactionRepo } from "../../../repository/Wallet-Transaction.repo.ts";

export class AdminDashboardService {
  #userRepo;
  #walletTransactionRepo: WalletTransactionRepo;
  constructor(
    userRepo: UserRepo,
    walletTransactionRepo: WalletTransactionRepo
  ) {
    this.#userRepo = userRepo;
    this.#walletTransactionRepo = walletTransactionRepo;
  }

  async userCountAndGrowthInfo() {
    const now = luxon.DateTime.now().toUTC();
    const lastWeekEnd = now.endOf("week").minus({ week: 1 });

    const result = await this.#userRepo.findUserCount(lastWeekEnd.toJSDate());

    const growthPercentage =
      ((result.currentUserCount - result.lastWeekUserCount) /
        result.lastWeekUserCount) *
      100;

    return Object.freeze({ growthPercentage, ...result });
  }

  transactionCountInfo() {
    return this.#walletTransactionRepo.countAllTransactions();
  }
  async getData() {
    const userCountInfo = await this.userCountAndGrowthInfo();
    const walletTransactionInfo = await this.transactionCountInfo();
    return Object.freeze({
      userCountInfo,
      walletTransactionInfo,
    });
  }
}

export default fp(
  function adminDashboardServicePlugin(fastify, _, done) {
    const adminDashboardService = new AdminDashboardService(
      fastify.userRepo,
      fastify.walletTransactionRepo
    );
    fastify.decorate("adminDashboardService", adminDashboardService);
    done();
  },
  {
    name: "adminDashboardServicePlugin",
    decorators: {
      fastify: ["walletTransactionRepo", "userRepo"],
    },
  }
);

declare module "fastify" {
  export interface FastifyInstance {
    adminDashboardService: InstanceType<typeof AdminDashboardService>;
  }
}
