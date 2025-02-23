import fp from "fastify-plugin";
import { SessionRepo } from "./Session.repo.ts";
import UserSession from "../models/User-Session.entity.ts";
import User from "../models/User.entity.ts";

export default fp(
  function adminSessionRepoPlugin(fastify, _, done) {
    const hasMikro = fastify.hasDecorator("orm");
    if (!hasMikro) throw new Error("Please init mikro-orm");

    const userSessionRepo = new SessionRepo(
      fastify.orm.em.fork(),
      UserSession,
      User
    );
    fastify.decorate("userSessionRepo", userSessionRepo);
    done();
  },
  {
    name: "adminSessionRepoPlugin",
  }
);

declare module "fastify" {
  interface FastifyInstance {
    userSessionRepo: InstanceType<
      typeof SessionRepo<typeof UserSession, typeof User>
    >;
  }
}
