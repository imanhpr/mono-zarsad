import { FastifyInstance } from "fastify";
import { ILoginRequestBodySchema, LoginRequestBodySchema } from "./schema.ts";
import phoneNumberValidationHook from "../../../../hooks/phoneNumber-validation.hook.ts";
import responseNormalizerHook from "../../../../hooks/response-normalizer.hook.ts";
export default function loginPostPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: (err?: Error) => void
) {
  const service = fastify.authService;

  fastify
    .register(responseNormalizerHook)
    .register(phoneNumberValidationHook)
    .post<{
      Body: ILoginRequestBodySchema;
    }>(
      "/login",
      { schema: { body: LoginRequestBodySchema, tags: ["auth/user"] } },
      function loginHandler(req) {
        return service.login(req.body.phoneNumber);
      }
    );
  done();
}
