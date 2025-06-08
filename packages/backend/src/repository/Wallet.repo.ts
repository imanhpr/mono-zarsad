import fp from "fastify-plugin";

import { EntityManager, LockMode } from "@mikro-orm/core";
import Wallet from "../models/Wallet.entity.ts";
import { Decimal } from "decimal.js";
import { CurrencyTypeEnum } from "../types/currency-types.ts";
import type CurrencyType from "../models/Currency-Type.entity.ts";
import type User from "../models/User.entity.ts";
import type WalletExchangePairTransaction from "../models/WalletExchangePairTransaction.entity.ts";

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

  async selectWalletPairForExchange(
    userId: number,
    sourceWalletCurrencyTypeId: number,
    targetWalletCurrencyTypeId: number
  ) {
    const wallets = await this.#em.find(
      Wallet,
      {
        currencyType: {
          id: {
            $in: [sourceWalletCurrencyTypeId, targetWalletCurrencyTypeId],
          },
        },
        user: { id: userId },
      },
      {
        lockMode: LockMode.PESSIMISTIC_WRITE,
      }
    );

    const sourceWallet = wallets.find(
      (wallet) => wallet.currencyType.id == sourceWalletCurrencyTypeId
    );
    if (!sourceWallet) throw new Error("Source wallet not found");

    const targetWallet = wallets.find(
      (wallet) => wallet.currencyType.id == targetWalletCurrencyTypeId
    );
    if (!targetWallet) throw new Error("Target wallet not found");
    return Object.freeze({ targetWallet, sourceWallet });
  }

  async selectWalletPairForUpdateByExchangeTransactionWithLock(
    exchange: WalletExchangePairTransaction
  ) {
    const wallets = await this.#em.find(
      Wallet,
      {
        id: { $in: [exchange.fromWallet.id, exchange.toWallet.id] },
      },
      { lockMode: LockMode.PESSIMISTIC_WRITE }
    );

    const sourceWallet = wallets.find(
      (wallet) => wallet.id === exchange.fromWallet.id
    );
    if (!sourceWallet) throw new Error("Source wallet not found");

    const targetWallet = wallets.find(
      (wallet) => wallet.id === exchange.toWallet.id
    );
    if (!targetWallet) throw new Error("Target wallet not found");

    return { sourceWallet, targetWallet };
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
