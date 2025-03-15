import { FastifyInstance } from "fastify";
import { SyncDoneFn } from "../../../../types/fastify-done.ts";
import { GetUserQueryParamSchema, IGetUserQueryParamSchema } from "./schema.ts";

export default function getUserByFilterPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: SyncDoneFn
) {
  const service = fastify.userManageService;
  fastify.get<{ Querystring: IGetUserQueryParamSchema }>(
    "/filter",
    { schema: { querystring: GetUserQueryParamSchema } },
    async function getUsersByFilterHandler(req) {
      const res = await service.userListByFilter(req.query);
      console.log("ress : ", res);

      return res;
    }
  );
  done();
}
