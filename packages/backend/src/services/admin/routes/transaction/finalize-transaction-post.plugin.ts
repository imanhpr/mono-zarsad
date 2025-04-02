import { FastifyInstance } from "fastify";
import { SyncDoneFn } from "../../../../types/fastify-done.ts";

export default function finalizeTransactionPostPlugin(
  fastify: FastifyInstance,
  _,
  done: SyncDoneFn
) {
  const service = fastify.transactionManageService;
  fastify.post(
    "/transaction/finalize/:transactionId",
    async function finalizeTransactionPostHandler(req, rep) {
      const { transactionId } = req.params;
      return service.finalizeWalletExchange(transactionId);
    }
  );
  done();
}
