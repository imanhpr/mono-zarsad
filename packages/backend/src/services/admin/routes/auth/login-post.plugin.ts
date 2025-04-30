import { FastifyInstance } from "fastify";
import {
  AdminAuthLoginRequestPayloadSchema,
  IAdminAuthLoginRequestPayloadSchema,
} from "./schema.ts";
export default async function adminAuthLoginPostPlugin(
  fastify: FastifyInstance
) {
  const service = fastify.adminAuthService;

  fastify.post<{ Body: IAdminAuthLoginRequestPayloadSchema }>(
    "/login",
    { schema: { body: AdminAuthLoginRequestPayloadSchema } },
    async function adminAuthLoginPostHandler(req, rep) {
      const [refreshToken, responseResult] = await service.login(
        req.body.username,
        req.body.password
      );
      rep.setCookie("session-id", refreshToken.id, {
        httpOnly: true,
        signed: true,
      });
      return responseResult;
    }
  );
}
