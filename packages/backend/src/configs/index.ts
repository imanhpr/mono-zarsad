import fp from "fastify-plugin";
import process from "node:process";

type AppConfig = {
  NODE_ENV: "development" | "production";
};

export default fp(
  function envConfigPlugin(fastify, _, done) {
    const appConfig: Readonly<AppConfig> = Object.freeze({
      NODE_ENV: process.env.NODE_ENV as "development" | "production",
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
