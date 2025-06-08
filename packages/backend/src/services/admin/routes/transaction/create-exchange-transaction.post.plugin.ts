import { FastifyInstance } from "fastify";
import {
  ExchangeTransactionInitSchema,
  IExchangeTransactionInitSchema,
} from "./schema.ts";

export default async function createExchangeTransactionPostPlugin(
  fastify: FastifyInstance
) {
  const service = fastify.transactionManageService;
  fastify
    .addHook("preHandler", fastify.adminJwtBearerAuth)
    .post<{
      Body: IExchangeTransactionInitSchema;
    }>("/transaction/exchange", { schema: { body: ExchangeTransactionInitSchema } }, async function createExchangeTransactionByAdminHandler(req) {
      return service.createExchangeTransaction(req.body);
    });
}
