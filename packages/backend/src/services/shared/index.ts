import fp from "fastify-plugin";
import { WalletExchangeService } from "./WalletExchange.service.ts";
import WalletReportService from "./WalletReport.service.ts";

export default fp(function shardServicesPlugin(fastify, _, done) {
  // TODO: Check for deps
  const walletExchangeService = new WalletExchangeService(
    fastify.walletAudiRepo,
    fastify.walletRepo,
    fastify.currencyPriceRepo,
    fastify.walletExchangePairTransactionRepo,
    fastify.walletTransactionRepo
  );

  const walletReportService = new WalletReportService(
    fastify.simpleWalletTransactionRepo,
    fastify.walletExchangePairTransactionRepo
  );

  fastify.decorate("walletExchangeService", walletExchangeService);
  fastify.decorate("walletReportService", walletReportService);
  done();
});

declare module "fastify" {
  export interface FastifyInstance {
    walletExchangeService: InstanceType<typeof WalletExchangeService>;
    walletReportService: InstanceType<typeof WalletReportService>;
  }
}
