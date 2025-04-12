import fp from "fastify-plugin";
import { WalletExchangeService } from "../shared/WalletExchange.service.ts";
import WalletReportService from "../shared/WalletReport.service.ts";
import { isNil } from "es-toolkit";
import type WithdrawService from "../shared/WalletSimpleTransaction.service.ts";

export class TransactionService {
  #shardWalletExchangeService: WalletExchangeService;
  #walletReportService: WalletReportService;
  #withdrawService: WithdrawService;
  constructor(
    shardWalletExchangeService: WalletExchangeService,
    walletReportService: WalletReportService,
    withdrawService: WithdrawService
  ) {
    this.#shardWalletExchangeService = shardWalletExchangeService;
    this.#walletReportService = walletReportService;
    this.#withdrawService = withdrawService;
  }
  async createNewExchange(payload: {
    orderType: "sell" | "buy";
    wallets: {
      sourceId: number;
      targetId: number;
    };
    tomanAmount: string;
    goldAmount: string;
  }) {
    return this.#shardWalletExchangeService.createNewWalletPairCurrencyExchange(
      payload
    );
  }

  async reportLast5Exchange(userId: number) {
    return this.#walletReportService.find5LatestReportByUserId(userId);
  }

  async reportTransaction(transactionId: string, userId: number) {
    const result = await this.#walletReportService.findTransactionById(
      transactionId,
      userId
    );
    if (isNil(result)) throw new Error("Transaction not found");

    return result;
  }

  async reportLast5WalletTransaction(userId: number) {}
}

export default fp(function transactionServicePlugin(fastify, _, done) {
  // TODO: Dep check guard

  const transactionService = new TransactionService(
    fastify.walletExchangeService,
    fastify.walletReportService,
    fastify.withdrawService
  );

  fastify.decorate("transactionService", transactionService);
  done();
});

declare module "fastify" {
  export interface FastifyInstance {
    transactionService: InstanceType<typeof TransactionService>;
  }
}
