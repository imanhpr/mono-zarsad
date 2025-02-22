import fp from "fastify-plugin";
import adminRoutesPlugin from "./admin.routes.ts";

export default fp<{ prefix: string }>(
  function fastifyAdminPlugin(fastify, config, done) {
    fastify.register(adminRoutesPlugin, config);
    done();
  },
  { name: "fastifyAdminPlugin" }
);
