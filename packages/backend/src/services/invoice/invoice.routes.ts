import { FastifyInstance } from "fastify";
import { SyncDoneFn } from "../../types/fastify-done.ts";

export default function invoiceRoutesPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: SyncDoneFn
) {
  const service = fastify.invoiceService;
  fastify.addHook("preHandler", fastify.jwtBearerAuth);
  fastify.get(
    "/invoice/:transactionId",
    async function getTransactionInvoiceByIdHandler(req) {
      // @ts-expect-error
      const { transactionId } = req.params;
      const userId = req.user.id;
      const result: Record<string, unknown> =
        await service.getTransactionInvoiceById(transactionId, userId);
      result.user = req.user;
      return result;
    }
  );
  done();
}
