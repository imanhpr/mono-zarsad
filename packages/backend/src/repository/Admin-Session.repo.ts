import fp from "fastify-plugin";
import AdminSession from "../models/Admin-Session.entity.ts";
import Admin from "../models/Admin.entity.ts";

// TODO: Implement
export default fp(
  function adminSessionRepoPlugin(fastify, _, done) {
    const hasMikro = fastify.hasDecorator("orm");
    if (!hasMikro) throw new Error("Please init mikro-orm");

    fastify.decorate("adminSessionRepo", {});
    done();
  },
  {
    name: "adminSessionRepoPlugin",
  }
);

declare module "fastify" {
  interface FastifyInstance {
    adminSessionRepo: any;
  }
}
