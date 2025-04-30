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
        fastify.jwt.verify(key, async (err, result: unknown) => {
          if (err) reject(err);
          if (
            typeof result === "object" &&
            result !== null &&
            "type" in result &&
            typeof result.type === "string" &&
            result.type === "admin" &&
            "adminId" in result &&
            typeof result.adminId === "number"
          ) {
            const user = await fastify.adminRepo.findById(
              // TODO: Add type safety
              result.adminId
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
