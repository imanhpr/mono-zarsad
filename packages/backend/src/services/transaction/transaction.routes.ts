import { FastifyInstance } from "fastify";
import { SyncDoneFn } from "../../types/fastify-done.ts";
import { CurrencyTypeEnum } from "../../types/currency-types.ts";

export default function transactionModuleRoutes(
  fastify: FastifyInstance,
  _: unknown,
  done: SyncDoneFn
) {
  const service = fastify.transactionService;

  fastify.post(
    "/",
    { schema: { tags: ["transaction"] } },
    async function newTransactionPostHandler(req, rep) {
      const transactionResult = await service.createNewExchange(
        req.body as any
      );
      return transactionResult;
    }
  );
  // TODO: Change name of this route to something else more meaningful
  fastify.get(
    "/report/latest-exchange",
    { preHandler: fastify.jwtBearerAuth, schema: { tags: ["transaction"] } },
    function latestExchangeUserReport(req) {
      return service.reportLast5Exchange(req.user.id);
    }
  );

  fastify.get<{ Params: { id: string } }>(
    "/:transactionId/report",
    { preHandler: fastify.jwtBearerAuth, schema: { tags: ["transaction"] } },
    async function transactionGetReportHandler(req) {
      // @ts-expect-error
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

  fastify.post(
    "/withdraw",
    { preHandler: [fastify.jwtBearerAuth], schema: { tags: ["transaction"] } },
    async function transactionWithdrawPostHandler(req) {
      // @ts-ignore
      const { currencyType, amount } = req.body;
      let c: CurrencyTypeEnum | null = null;

      if (currencyType === CurrencyTypeEnum.GOLD_18)
        c = CurrencyTypeEnum.GOLD_18;
      else if (currencyType === CurrencyTypeEnum.TOMAN)
        c = CurrencyTypeEnum.TOMAN;
      else throw new Error("invalid currencyType");

      const userId = req.user.id;
      const service = fastify.withdrawService;
      const result = await service.withdrawInit(c, userId, amount);
      return result;
    }
  );

  fastify.post(
    "/withdraw/finalize",
    { preHandler: fastify.jwtBearerAuth, schema: { tags: ["transaction"] } },
    function transactionWithdrawFinalizePostHandler(req) {
      const service = fastify.withdrawService;
      // @ts-ignore
      const { transactionId } = req.body;
      const userId = req.user.id;

      return service.withdrawFinalize(transactionId, userId);
    }
  );
  done();
}
