import fp from "fastify-plugin";
import { WalletExchangeService } from "./WalletExchange.service.ts";
import WalletReportService from "./WalletReport.service.ts";
import WithdrawService from "./WalletSimpleTransaction.service.ts";
import UserFactoryService from "./UserFactory.service.ts";

export default fp(
  function shardServicesPlugin(fastify, _, done) {
    // TODO: Check for deps
    const walletExchangeService = new WalletExchangeService(
      fastify.walletAudiRepo,
      fastify.walletRepo,
      fastify.currencyPriceRepo,
      fastify.walletExchangePairTransactionRepo,
      fastify.walletTransactionRepo,
      fastify.pairRepo
    );

    const walletReportService = new WalletReportService(
      fastify.simpleWalletTransactionRepo,
      fastify.walletExchangePairTransactionRepo,
      fastify.walletTransactionRepo
    );

    const withdrawService = new WithdrawService(
      fastify.walletRepo,
      fastify.walletAudiRepo,
      fastify.simpleWalletTransactionRepo,
      fastify.walletTransactionRepo
    );

    const userFactoryService = new UserFactoryService(
      fastify.userRepo,
      fastify.walletRepo,
      fastify.currencyTypeRepo
    );

    fastify.decorate("walletExchangeService", walletExchangeService);
    fastify.decorate("walletReportService", walletReportService);
    fastify.decorate("withdrawService", withdrawService);
    fastify.decorate("userFactoryService", userFactoryService);

    done();
  },
  {
    decorators: {
      fastify: [
        "pairRepo",
        "walletAudiRepo",
        "walletRepo",
        "currencyPriceRepo",
        "walletExchangePairTransactionRepo",
        "walletTransactionRepo",
      ],
    },
  }
);

declare module "fastify" {
  export interface FastifyInstance {
    walletExchangeService: InstanceType<typeof WalletExchangeService>;
    walletReportService: InstanceType<typeof WalletReportService>;
    withdrawService: InstanceType<typeof WithdrawService>;
    userFactoryService: InstanceType<typeof UserFactoryService>;
  }
}
