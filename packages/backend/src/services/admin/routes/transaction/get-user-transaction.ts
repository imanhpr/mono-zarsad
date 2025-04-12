import { FastifyInstance } from "fastify";
import { SyncDoneFn } from "../../../../types/fastify-done.ts";

export default function getUserTransactionsPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: SyncDoneFn
) {
  const service = fastify.transactionManageService;
  fastify.get(
    "/transaction/:userId",
    function getTransactionsByUserId(req, rep) {
      // @ts-expect-error
      const { userId } = req.params;
      return service.userTransactionHistory(parseInt(userId));
    }
  );
  done();
}
