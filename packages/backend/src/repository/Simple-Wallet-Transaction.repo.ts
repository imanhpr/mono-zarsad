import { EntityManager } from "@mikro-orm/core";
import fp from "fastify-plugin";
import WalletSimpleTransaction, {
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
    wallet: Wallet
  ) {
    return this.#em.create(WalletSimpleTransaction, {
      id: walletTransactionId,
      type,
      bankTransactionId: "1",
      wallet,
    });
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
