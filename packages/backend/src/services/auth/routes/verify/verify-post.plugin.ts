import { FastifyInstance } from "fastify";
import { IVerifyRequestBodySchema, VerifyRequestBodySchema } from "./schema.ts";
import phoneNumberValidationHook from "../../../../hooks/phoneNumber-validation.hook.ts";
import { UAParser } from "ua-parser-js";
import * as luxon from "luxon";

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
    const rawUserAgent = req.headers["user-agent"];
    const agent = UAParser(rawUserAgent);
    req.log.info({ userAgent: agent, phoneNumber }, "Try to verify otp code");
    const [refreshToken, response] = await service.verify(
      phoneNumber,
      code,
      rawUserAgent || ""
    );
    rep
      .setCookie("session-id", refreshToken.id, {
        httpOnly: true,
        expires: luxon.DateTime.now().plus({ days: 13 }).toJSDate(),
      })
      .send(response);
  });
  done();
}
