import fp from "fastify-plugin";
import { WalletExchangeService } from "./WalletExchange.service.ts";

export default fp(function shardServicesPlugin(fastify, _, done) {
  // TODO: Check for deps
  const walletExchangeService = new WalletExchangeService(
    fastify.walletAudiRepo,
    fastify.walletRepo,
    fastify.currencyPriceRepo,
    fastify.walletExchangePairTransactionRepo,
    fastify.walletTransactionRepo
  );
  fastify.decorate("walletExchangeService", walletExchangeService);
  done();
});

declare module "fastify" {
  export interface FastifyInstance {
    walletExchangeService: InstanceType<typeof WalletExchangeService>;
  }
}
