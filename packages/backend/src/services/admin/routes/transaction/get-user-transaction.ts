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
    { schema: { tags: ["admin", "admin/transaction"] } },
    function getTransactionsByUserId(req, rep) {
      // TODO: fixme
      return "implement me";
    }
  );
  done();
}
