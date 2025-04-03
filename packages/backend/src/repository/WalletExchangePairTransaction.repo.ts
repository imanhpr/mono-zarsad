import fp from "fastify-plugin";
import { EntityManager, LockMode } from "@mikro-orm/core";

import WalletExchangePairTransaction, {
  WalletExchangeTransactionStatus,
} from "../models/WalletExchangePairTransaction.entity.ts";

import { monotonicFactory } from "ulid";
import { type Decimal } from "decimal.js";
import type CurrencyType from "../models/Currency-Type.entity.ts";
import type CurrencyPrice from "../models/Currency-Price.entity.ts";
import type Wallet from "../models/Wallet.entity.ts";
import type WalletAudit from "../models/Wallet-Audit.entity.ts";

export class WalletExchangePairTransactionRepo {
  #em: EntityManager;
  readonly #model = WalletExchangePairTransaction;
  constructor(em: EntityManager) {
    this.#em = em;
  }
  createInit(input: {
    id: string;
    fromCurrency: CurrencyType;
    toCurrency: CurrencyType;
    currencyPrice: CurrencyPrice;
    fromValue: Decimal;
    toValue: Decimal;
    fromWallet: Wallet;
    toWallet: Wallet;
  }): WalletExchangePairTransaction {
    return this.#em.create(this.#model, {
      id: input.id,
      increment: null,
      decrement: null,
      finalizeAt: null,
      createdAt: new Date(),
      status: WalletExchangeTransactionStatus.INIT,
      currencyPrice: input.currencyPrice,
      fromCurrency: input.fromCurrency,
      toCurrency: input.toCurrency,
      fromValue: input.fromValue.abs().toString(),
      toValue: input.toValue.abs().toString(),
      fromWallet: input.fromWallet,
      toWallet: input.toWallet,
    });
  }

  setExchangeStatusToSuccessful(
    exchange: WalletExchangePairTransaction,
    increment: WalletAudit,
    decrement: WalletAudit
  ) {
    exchange.status = WalletExchangeTransactionStatus.SUCCESSFUL;
    exchange.finalizeAt = new Date();
    exchange.increment = increment;
    exchange.decrement = decrement;
  }

  getExchangeTransactionForUpdateWithLock(id: string) {
    return this.#em.findOneOrFail(this.#model, id, {
      lockMode: LockMode.PESSIMISTIC_WRITE,
    });
  }

  find5LatestTransaction(userId: number) {
    return this.#em.find(
      WalletExchangePairTransaction,
      {
        fromWallet: { user: userId },
        toWallet: { user: userId },
      },
      {
        limit: 5,
        orderBy: { createdAt: "DESC" },
        populate: ["fromCurrency", "toCurrency"],
      }
    );
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
