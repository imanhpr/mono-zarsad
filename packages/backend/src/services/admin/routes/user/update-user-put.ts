import { FastifyInstance } from "fastify";
import { SyncDoneFn } from "../../../../types/fastify-done.ts";
import { GenericIdParam, IGenericIdParam } from "../../../../schema/index.ts";
import {
  IUpdateUserPutRequestBodySchema,
  UpdateUserPutRequestBodySchema,
} from "./schema.ts";

export default function updateUserPutPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: SyncDoneFn
) {
  const service = fastify.userManageService;
  fastify.put<{
    Body: IUpdateUserPutRequestBodySchema;
    Params: IGenericIdParam;
  }>(
    "/:id",
    {
      schema: {
        params: GenericIdParam,
        body: UpdateUserPutRequestBodySchema,
      },
    },
    function updateUserPutHandler(req, res) {
      const userId = Number.parseInt(req.params.id);
      const payload = req.body;
      return service.editUserById(userId, payload);
    }
  );
  done();
}
