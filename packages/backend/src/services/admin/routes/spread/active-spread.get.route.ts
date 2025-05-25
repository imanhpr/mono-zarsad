import { FastifyInstance } from "fastify";
import { SyncDoneFn } from "../../../../types/fastify-done.ts";

export default function getCurrentActiveSpreadPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: SyncDoneFn
) {
  const service = fastify.currencyManageService;

  fastify
    .addHook("preHandler", fastify.adminJwtBearerAuth)
    .get(
      "/current",
      { schema: { tags: ["admin", "admin/spread"] } },
      async function getCurrentActiveSpread() {
        return service.getActiveSpreadPair();
      }
    );
  done();
}
