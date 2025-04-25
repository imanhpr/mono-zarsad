import { FastifyInstance } from "fastify";
import vine from "@vinejs/vine";
import * as luxon from "luxon";

export default function refreshTokenGetPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: (err?: Error) => void
) {
  const sessionIdVineValidationSchema = vine.string().uuid({ version: [4] });

  const service = fastify.authService;
  fastify
    .addHook("onRequest", async (req) => {
      await fastify.vineValidator(
        sessionIdVineValidationSchema,
        req.cookies["session-id"]
      );
    })
    .get("/refresh", async function refreshTokenHandler(req, rep) {
      const sid = req.cookies["session-id"];
      if (sid) {
        const result = await service.refreshToken(sid);
        rep.setCookie("session-id", result.refreshToken.id, {
          // path: "/auth",
          httpOnly: true,
          expires: luxon.DateTime.now().plus({ days: 4 }).toJSDate(),
        });
        return result.accessToken;
      }
      rep.unauthorized();
    });
  done();
}
