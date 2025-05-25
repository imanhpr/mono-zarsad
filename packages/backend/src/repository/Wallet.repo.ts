import fp from "fastify-plugin";

import { EntityManager, LockMode } from "@mikro-orm/core";
import Wallet from "../models/Wallet.entity.ts";
import { Decimal } from "decimal.js";
import type CurrencyType from "../models/Currency-Type.entity.ts";
import type User from "../models/User.entity.ts";
import { CurrencyTypeEnum } from "../types/currency-types.ts";

export class WalletRepo {
  #em: EntityManager;
  constructor(entityManager: EntityManager) {
    this.#em = entityManager;
  }
  updateWalletAmount(wallet: Wallet, amount: Decimal) {
    wallet.amount = amount.toString();
    this.#em.persist(wallet);
  }

  selectWalletForUpdateByIdAndUserId(id: number, userId: number) {
    return this.#em.findOneOrFail(
      Wallet,
      { id, user: { id: userId } },
      {
        lockMode: LockMode.PESSIMISTIC_WRITE,
      }
    );
  }

  selectWalletForUpdateWithLockByUserIdAndType(
    userId: number,
    type: CurrencyTypeEnum
  ) {
    return this.#em.findOneOrFail(
      Wallet,
      {
        user: { id: userId },
        currencyType: { name: type },
      },
      {
        lockMode: LockMode.PESSIMISTIC_WRITE,
      }
    );
  }

  createNew(currencyType: CurrencyType, user: User) {
    const wallet = this.#em.create(Wallet, {
      amount: "0",
      currencyType,
      user,
      lockAmount: "0",
    });
    return wallet;
  }

  selectWalletPairForExchange(sourceWalletId: number, targetWalletId: number) {
    return this.#em.find(
      Wallet,
      { id: { $in: [sourceWalletId, targetWalletId] } },
      {
        lockMode: LockMode.PESSIMISTIC_WRITE,
      }
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
