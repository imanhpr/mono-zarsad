import fp from "fastify-plugin";
import fastifyRedis, { FastifyRedis } from "@fastify/redis";
import Keyv from "keyv";
import KeyvValkey from "@keyv/valkey";

export default fp(
  async function cacheManager(fastify, _) {
    await fastify.register(fastifyRedis, { host: "localhost" });
    const keyVal = new KeyvValkey(fastify.redis as any);
    const keyv = new Keyv<typeof fastify.redis>({ store: keyVal });

    fastify.decorate("cache", keyv);
  },
  { name: "cacheManager" }
);

declare module "fastify" {
  interface FastifyInstance {
    cache: InstanceType<typeof Keyv<FastifyRedis>>;
  }
}
