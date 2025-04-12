import fp from "fastify-plugin";
import process from "node:process";

type AppConfig = {
  NODE_ENV: "development" | "production";
  APP_PORT: number;
};

export default fp(
  function envConfigPlugin(fastify, _, done) {
    const portString = process.env.APP_PORT;
    if (!portString) throw new Error("Please provider port number as env");
    const appConfig: Readonly<AppConfig> = Object.freeze({
      NODE_ENV: process.env.NODE_ENV as "development" | "production",
      APP_PORT: parseInt(portString),
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
