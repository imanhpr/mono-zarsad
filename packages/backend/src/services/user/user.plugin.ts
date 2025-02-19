import fp from "fastify-plugin";
import userRoutesPlugin from "./user.routes.ts";

export default fp<{ prefix: string }>(
  function userServicePlugin(fastify, { prefix }, done) {
    fastify.register(userRoutesPlugin, { prefix });
    done();
  },
  { name: "userServicePlugin" }
);
