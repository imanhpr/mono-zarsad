import { FastifyInstance } from "fastify";
import { SyncDoneFn } from "../../../types/fastify-done.ts";

export default function userInfoGetPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: SyncDoneFn
) {
  const service = fastify.userService;
  fastify.get(
    "/info",
    { preHandler: [fastify.jwtBearerAuth] },
    function userInfoGetPlugin({ user }) {
      return service.getUserInfoById(user.id);
    }
  );
  done();
}
