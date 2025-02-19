import { FastifyInstance } from "fastify";
import vine from "@vinejs/vine";

export default function refreshTokenGetPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: (err?: Error) => void
) {
  const sessionIdVineValidationSchema = vine.string().uuid({ version: [4] });

  const service = fastify.authService;
  fastify
    .addHook("onRequest", async (req, rep) => {
      await fastify.vineValidator(
        sessionIdVineValidationSchema,
        req.cookies["session-id"]
      );
    })
    .get("/refresh", async function refreshTokenHandler(req, rep) {
      // TODO: validation for session-id
      const sid = req.cookies["session-id"]!;
      const result = await service.refreshToken(sid);
      rep.setCookie("session-id", result.session.id, { path: "/auth" });
      return result.token;
    });
  done();
}
