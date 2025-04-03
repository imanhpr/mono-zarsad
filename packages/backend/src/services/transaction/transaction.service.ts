import fp from "fastify-plugin";
import { WalletExchangeService } from "../shared/WalletExchange.service.ts";
import WalletReportService from "../shared/WalletReport.service.ts";

export class TransactionService {
  #shardWalletExchangeService: WalletExchangeService;
  #walletReportService: WalletReportService;
  constructor(
    shardWalletExchangeService: WalletExchangeService,
    walletReportService: WalletReportService
  ) {
    this.#shardWalletExchangeService = shardWalletExchangeService;
    this.#walletReportService = walletReportService;
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

  async reportLast5WalletTransaction(userId: number) {}
}

export default fp(function transactionServicePlugin(fastify, _, done) {
  // TODO: Dep check guard
  const transactionService = new TransactionService(
    fastify.walletExchangeService,
    fastify.walletReportService
  );

  fastify.decorate("transactionService", transactionService);
  done();
});

declare module "fastify" {
  export interface FastifyInstance {
    transactionService: InstanceType<typeof TransactionService>;
  }
}
