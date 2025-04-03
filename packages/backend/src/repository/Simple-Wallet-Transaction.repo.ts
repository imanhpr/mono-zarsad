import { EntityManager } from "@mikro-orm/core";
import fp from "fastify-plugin";
import WalletSimpleTransaction, {
  SimpleWalletTransactionStatus,
  SimpleWalletTransactionType,
} from "../models/Wallet-Simple-Transaction.entity.ts";
import type Wallet from "../models/Wallet.entity.ts";

export class SimpleWalletTransactionRepo {
  #em: EntityManager;
  constructor(em: EntityManager) {
    this.#em = em;
  }

  create(
    walletTransactionId: string,
    type: SimpleWalletTransactionType,
    status: SimpleWalletTransactionStatus,
    amount: string,
    wallet: Wallet
  ) {
    return this.#em.create(WalletSimpleTransaction, {
      id: walletTransactionId,
      type,
      bankTransactionId: "1",
      wallet,
      createdAt: new Date(),
      status,
      amount,
    });
  }

  find5LatestTransaction(userId: number) {
    return this.#em.find(
      WalletSimpleTransaction,
      {
        wallet: { user: userId },
        type: SimpleWalletTransactionType.CARD_TO_CARD,
      },
      {
        limit: 5,
        orderBy: { createdAt: "DESC" },
        populate: ["wallet.currencyType"],
      }
    );
  }
}

export default fp(
  function simpleWalletTransactionRepoPlugin(fastify, _, done) {
    // TODO: validate deps
    const simpleWalletTransactionRepo = new SimpleWalletTransactionRepo(
      fastify.orm.em
    );
    fastify.decorate(
      "simpleWalletTransactionRepo",
      simpleWalletTransactionRepo
    );
    done();
  },
  { name: "simpleWalletTransactionRepoPlugin" }
);

declare module "fastify" {
  export interface FastifyInstance {
    simpleWalletTransactionRepo: InstanceType<
      typeof SimpleWalletTransactionRepo
    >;
  }
}
