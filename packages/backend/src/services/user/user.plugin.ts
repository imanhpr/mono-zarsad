import fp from "fastify-plugin";
import userRoutesPlugin from "./user.routes.ts";
import userServiceP from "./user.service.ts";
export default fp<{ prefix: string }>(
  function userServicePlugin(fastify, { prefix }, done) {
    fastify.register(userServiceP).register(userRoutesPlugin, { prefix });
    done();
  },
  { name: "userServicePlugin" }
);
