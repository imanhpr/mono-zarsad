import { EntityManager, LockMode } from "@mikro-orm/core";
import fp from "fastify-plugin";
import WalletSimpleTransaction, {
  SimpleWalletTransactionStatus,
  SimpleWalletTransactionType,
} from "../models/Wallet-Simple-Transaction.entity.ts";
import type Wallet from "../models/Wallet.entity.ts";
import { randomUUID } from "crypto";

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
    wallet: Wallet,
    meta: Record<string, unknown>
  ) {
    return this.#em.create(WalletSimpleTransaction, {
      id: walletTransactionId,
      type,
      bankTransactionId: randomUUID(),
      wallet,
      createdAt: new Date(),
      status,
      amount,
      meta,
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

  selectTransactionByIdWithLockForUpdate(
    transactionId: string,
    userId: number
  ) {
    return this.#em.findOneOrFail(
      WalletSimpleTransaction,
      {
        id: transactionId,
        wallet: { user: { id: userId } },
      },
      { lockMode: LockMode.PESSIMISTIC_WRITE }
    );
  }

  findTransactionById(transactionId: string, userId: number) {
    return this.#em.findOne(
      WalletSimpleTransaction,
      {
        id: transactionId,
        wallet: { user: { id: userId } },
      },
      {
        populate: ["wallet", "wallet.currencyType"],
        exclude: ["wallet.user", "wallet.amount"],
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
