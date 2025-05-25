import { FastifyInstance } from "fastify";
import {
  IUserListQueryFilterSchema,
  UserListQueryFilterSchema,
} from "./schema.ts";

export default function getUserListByFilterRoutePlugin(
  fastify: FastifyInstance,
  _: Record<string, unknown>,
  done: (err?: Error) => void
) {
  fastify.addHook("preHandler", fastify.adminJwtBearerAuth).get<{
    Querystring: IUserListQueryFilterSchema;
  }>("/", { schema: { querystring: UserListQueryFilterSchema, tags: ["admin", "admin/user"] } }, async function getUserListByFilterHandler(req) {
    const result = await fastify.userManageService.getUserListByFilter(
      req.query
    );
    return result;
  });
  done();
}
