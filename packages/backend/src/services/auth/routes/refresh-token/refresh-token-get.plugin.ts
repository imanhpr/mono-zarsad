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

  fastify.addHook("onRequest", async (req, rep) => {
    const key = "REFRESH_IDP:" + req.cookies["session-id"];
    const result = await fastify.redis.get(key);
    if (result) {
      req.log.info("refresh token cache hit return cache response");
      return rep.send(JSON.parse(result));
    }
  });

  fastify.addHook("preSerialization", async (_, rep, d) => {});

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
        const [refreshToken, accessToken] = await service.refreshToken(sid);
        if (refreshToken) {
          const key = "REFRESH_IDP:" + refreshToken.id;
          await fastify.redis.set(
            key,
            JSON.stringify(JSON.stringify(accessToken)),
            "EX",
            120
          );
        }

        rep.setCookie("session-id", refreshToken.id, {
          // path: "/auth",
          httpOnly: true,
          expires: luxon.DateTime.now().plus({ days: 4 }).toJSDate(),
        });
        return accessToken;
      }
      rep.unauthorized();
    });
  done();
}
