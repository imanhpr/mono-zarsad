import { FastifyInstance } from "fastify";
import { IVerifyRequestBodySchema, VerifyRequestBodySchema } from "./schema.ts";
import phoneNumberValidationHook from "../../../../hooks/phoneNumber-validation.hook.ts";

export default function verifyPostPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: (err?: Error) => void
) {
  const service = fastify.authService;

  fastify.register(phoneNumberValidationHook).post<{
    Body: IVerifyRequestBodySchema;
  }>("/verify", { schema: { body: VerifyRequestBodySchema } }, async function verifyHandler(req, rep) {
    const { code, phoneNumber } = req.body;
    const result = await service.verify(phoneNumber, code);
    // TODO: validation for session-id
    rep
      .setCookie("session-id", result.session.id, { path: "/auth" })
      .send(result.token);
  });
  done();
}
