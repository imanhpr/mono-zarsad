import { FastifyInstance } from "fastify";
import { SyncDoneFn } from "../../types/fastify-done.ts";

export default function transactionModuleRoutes(
  fastify: FastifyInstance,
  _: unknown,
  done: SyncDoneFn
) {
  const service = fastify.transactionService;

  fastify.post("/", async function newTransactionPostHandler(req, rep) {
    await service.buyTransaction(req.body as any);
    return "yes";
  });
  done();
}
