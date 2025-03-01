import { FastifyInstance } from "fastify";
import {
  CreateUserPostRequestBodySchema,
  ICreateUserPostRequestBodySchema,
} from "./schema.ts";

export default function createUserPostPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: (err?: Error) => void
) {
  const hasUserManageService = fastify.hasDecorator("userManageService");
  if (!hasUserManageService) {
    const err = new Error("Please Init userManageService");
    done(err);
    return;
  }
  const service = fastify.userManageService;

  fastify.post<{ Body: ICreateUserPostRequestBodySchema }>(
    "/",
    { schema: { body: CreateUserPostRequestBodySchema } },
    function createUserPostHandler(req) {
      return service.createUser(req.body);
    }
  );
  done();
}
