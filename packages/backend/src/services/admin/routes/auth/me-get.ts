import { FastifyInstance } from "fastify";
import { SyncDoneFn } from "../../../../types/fastify-done.ts";

export default function getMePlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: SyncDoneFn
) {
  fastify.get(
    "/me",
    {
      preHandler: [fastify.adminJwtBearerAuth],
      schema: { tags: ["auth/admin", "admin"] },
    },
    function getMeHandler(req) {
      return req.user;
    }
  );
  done();
}
