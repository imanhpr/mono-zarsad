import { FastifyInstance } from "fastify";
import responseSimpleCachePlugin from "../../../../plugins/response-simple-cache.plugin.ts";
import AdminSession from "../../../../models/Admin-Session.entity.ts";
import { BusinessOperationResult } from "../../../../helpers/index.ts";

export default async function adminRefreshTokenGetPlugin(
  fastify: FastifyInstance
) {
  const service = fastify.adminAuthService;
  fastify.decorateReply("cacheKey");

  fastify
    .register(responseSimpleCachePlugin)
    .get("/refresh", async function adminRefreshTokenHandler(req, rep) {
      const sid = req.cookies["session-id"];
      if (!sid) return rep.unauthorized();

      const unSignCookie = req.unsignCookie(sid);
      if (!unSignCookie.valid) return rep.unauthorized();
      let refreshToken: AdminSession;
      let accessToken: BusinessOperationResult<unknown>;
      try {
        [refreshToken, accessToken] = await service.refresh(unSignCookie.value);
      } catch (err) {
        throw err;
      }

      rep.cacheKey = refreshToken.id;
      rep.setCookie("session-id", refreshToken.id, {
        httpOnly: true,
        signed: true,
      });
      return accessToken;
    });
}
