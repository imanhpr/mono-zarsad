import fp from "fastify-plugin";
import process from "node:process";

type AppConfig = {
  NODE_ENV: "development" | "production";
  APP_PORT: number;
  REDIS_HOST: string;
  REDIS_PORT: string;
};

export default fp(
  function envConfigPlugin(fastify, _, done) {
    const portString = process.env.APP_PORT;
    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT;

    if (!portString) throw new Error("Please provide port number as env");
    if (!redisHost) throw new Error("Please provide redis host");
    if (!redisPort) throw new Error("Please provide redis Port");
    const appConfig: Readonly<AppConfig> = Object.freeze({
      NODE_ENV: process.env.NODE_ENV as "development" | "production",
      APP_PORT: parseInt(portString),
      REDIS_HOST: redisHost,
      REDIS_PORT: redisPort,
    });
    fastify.decorate("appConfig", appConfig);
    done();
  },
  { name: "envConfigPlugin" }
);

declare module "fastify" {
  interface FastifyInstance {
    appConfig: Readonly<AppConfig>;
  }
}
