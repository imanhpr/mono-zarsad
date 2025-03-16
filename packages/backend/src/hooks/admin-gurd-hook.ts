import fp from "fastify-plugin";
import fastifyBearerAuth from "@fastify/bearer-auth";

export default fp(
  async function adminGuardPlugin(fastify, _) {
    await fastify.register(fastifyBearerAuth, {
      keys: [],
      addHook: false,
    });

    const hook = fastify.verifyBearerAuthFactory!({
      keys: [],
      auth(key, req) {
        const { promise, resolve, reject } = Promise.withResolvers<boolean>();
        fastify.jwt.verify(key, async (err, result) => {
          if (err) reject(err);
          if (result) {
            const user = await fastify.adminRepo.findById(
              // TODO: Add type safety
              result.id
            );
            req.user = user;
            return resolve(true);
          }
          resolve(false);
        });
        return promise;
      },
    });
    fastify.decorate("adminJwtBearerAuth", hook);
  },
  { name: "adminGuardPlugin" }
);

declare module "fastify" {
  interface FastifyInstance {
    adminJwtBearerAuth: fastifyBearerAuth.verifyBearerAuth;
  }
}
