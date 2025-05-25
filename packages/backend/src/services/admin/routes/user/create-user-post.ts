import { FastifyInstance } from "fastify";
import {
  CreateUserPostRequestBodySchema,
  ICreateUserPostRequestBodySchema,
} from "./schema.ts";
import { ICreateNewUser } from "../../../../types/user.ts";

export default function createUserPostPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: (err?: Error) => void
) {
  const service = fastify.userManageService;
  fastify.addHook("preHandler", fastify.adminJwtBearerAuth).post<{
    Body: ICreateUserPostRequestBodySchema;
  }>("/", { schema: { body: CreateUserPostRequestBodySchema, tags: ["admin", "admin/user"] } }, async function createUserPostHandler(req, rep) {
    const result = await service.createUser(req.body);
    return rep.code(201).send(result);
  });
  done();
}
