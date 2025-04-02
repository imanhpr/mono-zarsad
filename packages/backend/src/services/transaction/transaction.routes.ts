import { FastifyInstance } from "fastify";
import { SyncDoneFn } from "../../types/fastify-done.ts";

export default function transactionModuleRoutes(
  fastify: FastifyInstance,
  _: unknown,
  done: SyncDoneFn
) {
  const service = fastify.transactionService;

  fastify.post("/", async function newTransactionPostHandler(req, rep) {
    const transactionResult = await service.createNewExchange(req.body as any);
    return transactionResult;
  });

  fastify.get(
    "/report/latest-exchange",
    { preHandler: fastify.jwtBearerAuth },
    function latestExchangeUserReport(req) {
      return service.reportLast5Exchange(req.user.id);
    }
  );
  done();
}
