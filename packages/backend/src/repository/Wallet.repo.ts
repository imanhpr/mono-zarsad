import fp from "fastify-plugin";

import { EntityManager, LockMode } from "@mikro-orm/core";
import Wallet from "../models/Wallet.entity.ts";
import { Decimal } from "decimal.js";

export class WalletRepo {
  #em: EntityManager;
  constructor(entityManager: EntityManager) {
    this.#em = entityManager;
  }
  updateWalletAmount(wallet: Wallet, amount: Decimal) {
    console.log("updateWalletAmount : ", this.#em._id);
    wallet.amount = amount.toString();
    this.#em.persist(wallet);
  }

  selectWalletforUpdate(id: number) {
    return this.#em.findOneOrFail(
      Wallet,
      { id },
      { lockMode: LockMode.PESSIMISTIC_WRITE }
    );
  }
}

export default fp(
  function walletRepoPlugin(fastify, _, done) {
    // TODO: ORM Error Handling
    const walletRepo = new WalletRepo(fastify.orm.em);

    fastify.decorate("walletRepo", walletRepo);

    done();
  },
  { name: "walletRepoPlugin" }
);

declare module "fastify" {
  interface FastifyInstance {
    walletRepo: InstanceType<typeof WalletRepo>;
  }
}
