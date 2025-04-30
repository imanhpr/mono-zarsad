import fp from "fastify-plugin";
import fastifyRedis, { FastifyRedis } from "@fastify/redis";
import Keyv from "keyv";
import KeyvValkey from "@keyv/valkey";

export default fp(
  async function cacheManager(fastify, _) {
    const REDIS_HOST = fastify.appConfig.REDIS_HOST;
    const REDIS_PORT = fastify.appConfig.REDIS_PORT;

    await fastify.register(fastifyRedis, {
      host: REDIS_HOST,
      port: parseInt(REDIS_PORT),
    });
    const keyVal = new KeyvValkey(fastify.redis as any);
    const keyv = new Keyv<typeof fastify.redis>(
      { store: keyVal },
      { useKeyPrefix: false }
    );

    fastify.decorate("cache", keyv);
  },
  { name: "cacheManager", decorators: { fastify: ["appConfig"] } }
);

declare module "fastify" {
  interface FastifyInstance {
    cache: InstanceType<typeof Keyv<FastifyRedis>>;
  }
}
