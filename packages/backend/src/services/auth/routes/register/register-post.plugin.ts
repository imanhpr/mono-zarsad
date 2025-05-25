import { FastifyInstance } from "fastify";
import {
  IRegisterRequestBodySchema,
  RegisterRequestBodySchema,
} from "./schema.ts";
import phoneNumberValidationHook from "../../../../hooks/phoneNumber-validation.hook.ts";
type IRequestBody = {
  Body: IRegisterRequestBodySchema;
};

export default function registerPostPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: (err?: Error) => void
) {
  const service = fastify.authService;
  fastify
    .register(phoneNumberValidationHook)
    .post<IRequestBody>(
      "/register",
      { schema: { body: RegisterRequestBodySchema, tags: ["auth/user"] } },
      async function registerHandler(req, rep) {
        const result = await service.register(req.body);
        rep.code(201).send(result);
      }
    );
  done();
}
