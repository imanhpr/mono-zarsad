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
  // TODO: Change name of this route to something else more meaningful
  fastify.get(
    "/report/latest-exchange",
    { preHandler: fastify.jwtBearerAuth },
    function latestExchangeUserReport(req) {
      return service.reportLast5Exchange(req.user.id);
    }
  );

  fastify.get<{ Params: { id: string } }>(
    "/:transactionId/report",
    { preHandler: fastify.jwtBearerAuth },
    async function transactionGetReportHandler(req) {
      const transactionId = req.params.transactionId;
      const user = req.user;
      // TODO: check if the user is the owner of the transaction
      const transactionReport = await service.reportTransaction(
        transactionId,
        user.id
      );
      return Object.assign({ user }, transactionReport);
    }
  );
  done();
}
