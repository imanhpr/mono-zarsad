import fp from "fastify-plugin";
import AdminSession from "../models/Admin-Session.entity.ts";
import { SessionRepo } from "./Session.repo.ts";
import Admin from "../models/Admin.entity.ts";

export default fp(
  function adminSessionRepoPlugin(fastify, _, done) {
    const hasMikro = fastify.hasDecorator("orm");
    if (!hasMikro) throw new Error("Please init mikro-orm");

    const adminSessionRepo = new SessionRepo(
      fastify.orm.em.fork(),
      AdminSession,
      Admin
    );
    fastify.decorate("adminSessionRepo", adminSessionRepo);
    done();
  },
  {
    name: "adminSessionRepoPlugin",
  }
);

declare module "fastify" {
  interface FastifyInstance {
    adminSessionRepo: InstanceType<
      typeof SessionRepo<typeof AdminSession, typeof Admin>
    >;
  }
}
