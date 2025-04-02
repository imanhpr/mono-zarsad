import fp from "fastify-plugin";
import { WalletExchangeService } from "../shared/WalletExchange.service.ts";

export class TransactionService {
  #shardWalletExchangeService: WalletExchangeService;
  constructor(shardWalletExchangeService: WalletExchangeService) {
    this.#shardWalletExchangeService = shardWalletExchangeService;
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
    return this.#shardWalletExchangeService.find5ExchangeTransactionByUserId(
      userId
    );
  }
}

export default fp(function transactionServicePlugin(fastify, _, done) {
  // TODO: Dep check guard
  const transactionService = new TransactionService(
    fastify.walletExchangeService
  );

  fastify.decorate("transactionService", transactionService);
  done();
});

declare module "fastify" {
  export interface FastifyInstance {
    transactionService: InstanceType<typeof TransactionService>;
  }
}
