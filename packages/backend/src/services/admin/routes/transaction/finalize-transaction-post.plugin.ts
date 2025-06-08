import { FastifyInstance } from "fastify";
import { SyncDoneFn } from "../../../../types/fastify-done.ts";
import { FinalizeExchangeSchema, IFinalizeExchangeSchema } from "./schema.ts";

export default function finalizeTransactionPostPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: SyncDoneFn
) {
  const service = fastify.transactionManageService;
  fastify.addHook("preHandler", fastify.adminJwtBearerAuth).post<{
    Params: IFinalizeExchangeSchema;
  }>("/transaction/finalize/:transactionId", { schema: { tags: ["admin", "admin/transaction"], params: FinalizeExchangeSchema } }, async function finalizeTransactionPostHandler(req) {
    const { transactionId } = req.params;
    return service.finalizeWalletExchange(transactionId);
  });
  done();
}
