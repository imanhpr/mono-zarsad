import fp from "fastify-plugin";
import adminRoutesPlugin from "./admin.routes.ts";
import userManageService from "./manage-services/user-manage.service.ts";
import transactionManageServicePlugin from "./manage-services/transaction-manage.service.ts";

export default fp<{ prefix: string }>(
  function fastifyAdminPlugin(fastify, config, done) {
    fastify
      .register(userManageService)
      .register(transactionManageServicePlugin)
      .register(adminRoutesPlugin, config);
    done();
  },
  { name: "fastifyAdminPlugin" }
);
