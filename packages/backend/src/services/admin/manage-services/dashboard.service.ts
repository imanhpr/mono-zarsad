import fp from "fastify-plugin";
import { type UserRepo } from "../../../repository/User.repo.ts";
import * as luxon from "luxon";

export class AdminDashboardService {
  #userRepo;
  constructor(userRepo: UserRepo) {
    this.#userRepo = userRepo;
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
  async getData() {
    const userCountInfo = await this.userCountAndGrowthInfo();
    return Object.freeze({
      userCountInfo,
    });
  }
}

export default fp(
  function adminDashboardServicePlugin(fastify, _, done) {
    const adminDashboardService = new AdminDashboardService(fastify.userRepo);
    fastify.decorate("adminDashboardService", adminDashboardService);
    done();
  },
  {
    name: "adminDashboardServicePlugin",
  }
);

declare module "fastify" {
  export interface FastifyInstance {
    adminDashboardService: InstanceType<typeof AdminDashboardService>;
  }
}
