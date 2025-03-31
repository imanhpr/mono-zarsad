import fp from "fastify-plugin";
import { EntityManager } from "@mikro-orm/core";

import WalletExchangePairTransaction from "../models/WalletExchangePairTransaction.entity.ts";
import type WalletTransaction from "../models/Wallet-Transaction.entity.ts";

import { monotonicFactory } from "ulid";

const ulid = monotonicFactory();

export class WalletExchangePairTransactionRepo {
  #em: EntityManager;
  constructor(em: EntityManager) {
    this.#em = em;
  }
  create(
    increment: WalletTransaction,
    decrement: WalletTransaction
  ): WalletExchangePairTransaction {
    return this.#em.create(WalletExchangePairTransaction, {
      id: ulid(),
      increment,
      decrement,
      createdAt: new Date(),
    });
  }
}

export default fp(function walletExchangePairTransactionRepo(fastify, _, done) {
  // TODO: guard for deps
  const walletExchangePairTransactionRepo =
    new WalletExchangePairTransactionRepo(fastify.orm.em);

  fastify.decorate(
    "walletExchangePairTransactionRepo",
    walletExchangePairTransactionRepo
  );
  done();
});

declare module "fastify" {
  export interface FastifyInstance {
    walletExchangePairTransactionRepo: InstanceType<
      typeof WalletExchangePairTransactionRepo
    >;
  }
}
