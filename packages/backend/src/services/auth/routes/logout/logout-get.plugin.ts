import { FastifyInstance } from "fastify";
import userGuardHook from "../../../../hooks/user-guard.hook.ts";

export default function logOutGetPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: (err?: Error) => void
) {
  const service = fastify.authService;
  fastify
    .register(userGuardHook)
    .get("/logout", async function logOutHandler(req, rep) {
      // TODO: Type safety
      const sid = req.cookies["session-id"];
      if (sid) {
        await service.logout(sid);
        return rep
          .clearCookie("session-id", { path: "/auth" })
          .code(204)
          .send();
      }
      rep.unauthorized();
    });
  done();
}
