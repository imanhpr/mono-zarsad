import fp from "fastify-plugin";
import authService from "./auth.service.ts";
import authRoutesPlugin from "./auth.routes.ts";

export default fp<{ prefix: string }>(
  function authPlugin(fastify, { prefix }, done) {
    fastify.register(authService).register(authRoutesPlugin, { prefix });
    done();
  },
  {
    name: "authPlugin",
  }
);
