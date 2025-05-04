import { type FastifyInstance } from "fastify";
import { type SyncDoneFn } from "../../../../types/fastify-done.ts";

export default function dashboardPageGetPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: SyncDoneFn
) {
  const service = fastify.adminDashboardService;
  console.log("Service ", { service });

  fastify.get("/dashboard", { preHandler: fastify.adminJwtBearerAuth }, () => {
    return service.getData();
  });

  done();
}
