import { createCache } from "cache-manager";
import fp from "fastify-plugin";

export default fp(
  function cacheManager(fastify, _, done) {
    const cache = createCache();
    fastify.decorate("cache", cache);
    done();
  },
  { name: "cacheManager" }
);

declare module "fastify" {
  interface FastifyInstance {
    cache: ReturnType<typeof createCache>;
  }
}
