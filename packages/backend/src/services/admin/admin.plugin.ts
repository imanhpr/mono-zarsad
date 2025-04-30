import fp from "fastify-plugin";
import adminRoutesPlugin from "./admin.routes.ts";
import userManageService from "./manage-services/user-manage.service.ts";
import transactionManageServicePlugin from "./manage-services/transaction-manage.service.ts";
import { AdminAuthService } from "./auth.service.ts";

export default fp<{ prefix: string }>(
  async function fastifyAdminPlugin(fastify, config) {
    const adminAuthService = new AdminAuthService(
      fastify.passwordService,
      fastify.adminRepo,
      fastify.adminSessionRepo,
      fastify.jwt.sign
    );
    fastify.decorate("adminAuthService", adminAuthService);

    fastify
      .register(userManageService)
      .register(transactionManageServicePlugin)
      .register(adminRoutesPlugin, config);
  },
  {
    name: "fastifyAdminPlugin",
    decorators: {
      fastify: ["passwordService", "adminRepo", "adminSessionRepo", "jwt"],
    },
  }
);

declare module "fastify" {
  export interface FastifyInstance {
    adminAuthService: InstanceType<typeof AdminAuthService>;
  }
}
