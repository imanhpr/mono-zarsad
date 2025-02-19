import fp from "fastify-plugin";
import { MikroORM, RequestContext } from "@mikro-orm/core";

export default fp(
  async function mikroOrmPlugin(fastify) {
    const orm = await MikroORM.init();
    fastify.decorate("orm", orm);

    fastify.addHook("onRequest", (_, __, done) => {
      RequestContext.create(fastify.orm.em, done);
    });
    fastify.log.info("Database has just connected successfully");
  },
  { name: "mikroOrmPlugin" }
);

declare module "fastify" {
  interface FastifyInstance {
    orm: Awaited<ReturnType<typeof MikroORM.init>>;
  }
}
