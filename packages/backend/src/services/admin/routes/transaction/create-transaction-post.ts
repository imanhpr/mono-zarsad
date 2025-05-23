import { FastifyInstance } from "fastify";
import { SyncDoneFn } from "../../../../types/fastify-done.ts";
import {
  CreateNewTransactionPostBodySchema,
  ICreateNewTransactionPostBodySchema,
} from "./schema.ts";

const transactionTypes = Object.freeze([
  {
    type: "INCREMENT",
    nameFa: "افزایش اعتبار",
  } as const,
  {
    type: "DECREMENT",
    nameFa: "کاهش اعتبار",
  } as const,
] as const);

export default function createTransactionPostPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: SyncDoneFn
) {
  const service = fastify.transactionManageService;
  fastify.get(
    "/transaction/setup",
    function transactionPageSetupGetHandler(req, res) {
      return { transactionTypes };
    }
  );
  fastify
    .addHook("preHandler", fastify.adminJwtBearerAuth)
    .post<{
      Body: ICreateNewTransactionPostBodySchema;
    }>("/transaction", { schema: { body: CreateNewTransactionPostBodySchema } }, async function transactionPostHandler(req) {
      const { amount, walletId, transactionType } = req.body;
      const result = await service.updateWalletUserAmount_P(
        walletId,
        amount,
        transactionType
      );
      return result;
    });
  done();
}
