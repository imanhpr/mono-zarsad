import fp from "fastify-plugin";
import transactionServicePlugin from "./transaction.service.ts";
import transactionModuleRoutes from "./transaction.routes.ts";

export default fp(function transactionModulePlugin(fastify, _, done) {
  fastify
    .register(transactionServicePlugin)
    .register(transactionModuleRoutes, { prefix: "transaction" });
  done();
});
