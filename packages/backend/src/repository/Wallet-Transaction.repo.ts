import fp from "fastify-plugin";
import { EntityManager } from "@mikro-orm/core";
import WalletTransaction from "../models/Wallet-Transaction.entity.ts";
import { Decimal } from "decimal.js";
import type Wallet from "../models/Wallet.entity.ts";

export class WalletTransactionRepo {
  #em: EntityManager;
  constructor(entityManager: EntityManager) {
    this.#em = entityManager;
  }
  create(payload: {
    type: "INCREMENT" | "DECREMENT";
    amount: Decimal;
    walletAmount: Decimal;
    source: string;
    wallet: Wallet;
  }) {
    const walletTransaction = this.#em.create(WalletTransaction, {
      amount: payload.amount.toString(),
      createdAt: new Date(),
      currencyType: payload.wallet.currencyType,
      source: payload.source,
      type: payload.type,
      wallet: payload.wallet,
      walletAmount: payload.walletAmount.toString(),
    });

    this.#em.persist(walletTransaction);
  }
}

export default fp(
  function walletTransactionRepoPlugin(fastify, _, done) {
    // TODO: ORM Error Handling
    const walletTransactionRepo = new WalletTransactionRepo(fastify.orm.em);

    fastify.decorate("walletTransactionRepo", walletTransactionRepo);

    done();
  },
  { name: "walletTransactionRepoPlugin" }
);

declare module "fastify" {
  interface FastifyInstance {
    walletTransactionRepo: InstanceType<typeof WalletTransactionRepo>;
  }
}
