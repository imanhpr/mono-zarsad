import fp from "fastify-plugin";
import { EntityManager } from "@mikro-orm/core";
import { monotonicFactory } from "ulid";
import WalletTransaction from "../models/Wallet-Transaction.entity.ts";

const ulid = monotonicFactory();

export class WalletTransactionRepo {
  #em: EntityManager;
  constructor(em: EntityManager) {
    this.#em = em;
  }

  create(
    transactionType: "EXCHANGE" | "WALLET_TO_WALLET" | "SIMPLE",
    createdAt: Date
  ) {
    return this.#em.create(WalletTransaction, {
      id: ulid(),
      type: transactionType,
      createdAt,
    });
  }

  findOneByTransactionId(transactionId: string) {
    return this.#em.findOneOrFail(WalletTransaction, {
      id: transactionId,
    });
  }
}

export default fp(
  function walletTransactionRepoPlugin(fastify, _, done) {
    const walletTransactionRepo = new WalletTransactionRepo(fastify.orm.em);
    fastify.decorate("walletTransactionRepo", walletTransactionRepo);
    done();
  },
  {
    name: "walletTransactionRepoPlugin",
    decorators: {
      fastify: ["orm"],
    },
  }
);

declare module "fastify" {
  export interface FastifyInstance {
    walletTransactionRepo: InstanceType<typeof WalletTransactionRepo>;
  }
}
