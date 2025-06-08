import { FastifyInstance } from "fastify";

export default async function transactionHistoryGetPlugin(
  fastify: FastifyInstance
) {
  const service = fastify.transactionManageService;

  fastify
    .addHook("preHandler", fastify.adminJwtBearerAuth)
    // TODO: Add swagger metadata
    .get("/transaction/history", async function transactionHistoryGetHandler() {
      return service.transactionHistory("DESC", 0, 10);
    });
}
