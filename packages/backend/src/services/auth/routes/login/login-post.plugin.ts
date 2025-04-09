import { FastifyInstance } from "fastify";
import { ILoginRequestBodySchema, LoginRequestBodySchema } from "./schema.ts";
import phoneNumberValidationHook from "../../../../hooks/phoneNumber-validation.hook.ts";
import arcAptchaPlugin from "../../../../plugins/arc-aptcha.plugin.ts";
export default function loginPostPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: (err?: Error) => void
) {
  const service = fastify.authService;
  fastify.addHook("preHandler", async (req) => {
    console.log("body", req.body);
  });
  fastify
    .register(phoneNumberValidationHook)
    // .register(arcAptchaPlugin)
    .post<{
      Body: ILoginRequestBodySchema;
    }>(
      "/login",
      { schema: { body: LoginRequestBodySchema } },
      function loginHandler(req) {
        return service.login(req.body.phoneNumber);
      }
    );
  done();
}
