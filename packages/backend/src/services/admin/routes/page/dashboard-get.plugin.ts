import { type FastifyInstance } from "fastify";
import { type SyncDoneFn } from "../../../../types/fastify-done.ts";

export default function dashboardPageGetPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: SyncDoneFn
) {
  const service = fastify.adminDashboardService;
  fastify.get(
    "/dashboard",
    {
      preHandler: fastify.adminJwtBearerAuth,
      schema: { tags: ["admin", "admin/page"] },
    },
    () => {
      return service.getData();
    }
  );

  done();
}
