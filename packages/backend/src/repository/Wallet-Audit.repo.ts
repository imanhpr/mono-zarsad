import fp from "fastify-plugin";
import { EntityManager } from "@mikro-orm/core";
import { Decimal } from "decimal.js";
import type Wallet from "../models/Wallet.entity.ts";
import WalletAudit from "../models/Wallet-Audit.entity.ts";

export class WalletAudiRepo {
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
    walletTransactionId: string;
  }) {
    const walletAudit = this.#em.create(WalletAudit, {
      amount: payload.amount.toString(),
      createdAt: new Date(),
      currencyType: payload.wallet.currencyType,
      type: payload.type,
      wallet: payload.wallet,
      walletAmount: payload.walletAmount.toString(),
      walletTransaction: payload.walletTransactionId,
      lockAmount: "0",
      lock: "0",
    });

    return walletAudit;
  }

  createLockAudit(
    type: "LOCK" | "LOCK_FREE",
    amountToLockOrFree: Decimal,
    newWalletLockAmount: Decimal,
    wallet: Wallet,
    walletTransactionId: string,
    createdAt: Date
  ) {
    const walletAudit = this.#em.create(WalletAudit, {
      type: type,
      amount: "0",
      walletAmount: wallet.amount,
      currencyType: wallet.currencyType,
      createdAt,
      wallet: wallet,
      walletTransaction: walletTransactionId,
      lockAmount: newWalletLockAmount.toString(),
      lock: amountToLockOrFree.toString(),
    });
    return walletAudit;
  }

  async findWalletTransactionByUserId(userId: number) {
    const [transactions, count] = await this.#em.findAndCount(
      WalletAudit,
      {
        wallet: { user: { id: userId } },
      },
      { populate: ["wallet", "currencyType"] }
    );

    return Object.freeze({ count, transactions });
  }
}

export default fp(
  function walletTransactionRepoPlugin(fastify, _, done) {
    // TODO: ORM Error Handling
    const walletAudiRepo = new WalletAudiRepo(fastify.orm.em);

    fastify.decorate("walletAudiRepo", walletAudiRepo);

    done();
  },
  { name: "walletAudiRepoPlugin" }
);

declare module "fastify" {
  interface FastifyInstance {
    walletAudiRepo: InstanceType<typeof WalletAudiRepo>;
  }
}
