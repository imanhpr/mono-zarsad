import fp from "fastify-plugin";
import { Transactional } from "@mikro-orm/core";
import { Decimal } from "decimal.js";

import { type WalletTransactionRepo } from "../../repository/Wallet-Transaction.repo.ts";
import { type WalletRepo } from "../../repository/Wallet.repo.ts";
import { type CurrencyPriceRepo } from "../../repository/Currency-Price.repo.ts";
import { type WalletExchangePairTransactionRepo } from "../../repository/WalletExchangePairTransaction.repo.ts";
import type Wallet from "../../models/Wallet.entity.ts";

const GOLD_CONST = new Decimal("4.331802");

export class TransactionService {
  #transactionRepo: WalletTransactionRepo;
  #walletRepo: WalletRepo;
  #currencyPriceRepo: CurrencyPriceRepo;
  #walletExchangePairTransactionRepo: WalletExchangePairTransactionRepo;

  constructor(
    transactionRepo: WalletTransactionRepo,
    walletRepo: WalletRepo,
    currencyPriceRepo: CurrencyPriceRepo,
    walletExchangePairTransactionRepo: WalletExchangePairTransactionRepo
  ) {
    this.#transactionRepo = transactionRepo;
    this.#walletRepo = walletRepo;
    this.#currencyPriceRepo = currencyPriceRepo;
    this.#walletExchangePairTransactionRepo = walletExchangePairTransactionRepo;
  }

  async #getAndLockPairOfWallets(rawWallets: {
    sourceId: number;
    targetId: number;
  }) {
    const wallets = await this.#walletRepo.selectWalletPairForExchange(
      rawWallets.sourceId,
      rawWallets.targetId
    );

    const sourceWallet = wallets.find(
      (wallet) => wallet.id === rawWallets.sourceId
    );
    const targetWallet = wallets.find(
      (wallet) => wallet.id === rawWallets.targetId
    );

    if (!sourceWallet || !targetWallet) {
      throw new Error("Wallet not found");
    }

    return Object.freeze({ sourceWallet, targetWallet });
  }

  async #getCurrencyTypeBaseOfOrderType(
    orderType: "sell" | "buy",
    wallets: { sourceWallet: Wallet; targetWallet: Wallet }
  ) {
    // When it's buy source wallet is gold
    if (orderType === "sell")
      return this.#currencyPriceRepo.findLatestCurrencyPriceByCurrencyTypeId(
        wallets.sourceWallet.currencyType.id
      );

    // When it's "sell" target wallet is gold
    const res =
      await this.#currencyPriceRepo.findLatestCurrencyPriceByCurrencyTypeId(
        wallets.targetWallet.currencyType.id
      );
    return res;
  }

  #calcNewWalletAmountsBaseOfOrderType(
    orderType: "sell" | "buy",
    finalCalcTomanAmount: Decimal,
    finalCalcGoldGram: Decimal,
    sourceWalletAmount: Decimal,
    targetWalletAmount: Decimal
  ): Readonly<{
    newSourceWalletAmount: Decimal;
    newTargetWalletAmount: Decimal;
  }> {
    if (orderType === "sell") {
      const newSourceWalletAmount = sourceWalletAmount.minus(finalCalcGoldGram);
      const newTargetWalletAmount =
        targetWalletAmount.plus(finalCalcTomanAmount);

      return Object.freeze({ newSourceWalletAmount, newTargetWalletAmount });
    }
    const newSourceWalletAmount =
      sourceWalletAmount.minus(finalCalcTomanAmount);
    const newTargetWalletAmount = targetWalletAmount.plus(finalCalcGoldGram);

    return Object.freeze({ newSourceWalletAmount, newTargetWalletAmount });
  }

  // TODO: Make this function idempotent
  @Transactional()
  async exchangeTransaction(payload: {
    orderType: "sell" | "buy";
    wallets: {
      sourceId: number;
      targetId: number;
    };
    tomanAmount: string;
    goldAmount: string;
  }) {
    console.log("payload:", payload);
    const { sourceWallet, targetWallet } = await this.#getAndLockPairOfWallets(
      payload.wallets
    );

    const exchangeCurrencyPrice = await this.#getCurrencyTypeBaseOfOrderType(
      payload.orderType,
      { sourceWallet, targetWallet }
    );

    const exchangeCurrencyPriceAmount = new Decimal(
      exchangeCurrencyPrice.price
    );
    const sourceWalletAmount = new Decimal(sourceWallet.amount);
    const targetWalletAmount = new Decimal(targetWallet.amount);

    // Input from user
    const rawTomanAmount = new Decimal(payload.tomanAmount).abs();
    const rawGoldAmount = new Decimal(payload.goldAmount).abs();

    const calcTomanAmount = TransactionService.calcTomanAmountWithGoldGramInput(
      exchangeCurrencyPriceAmount,
      rawGoldAmount
    );

    const finalCalcTomanAmount = rawTomanAmount.gte(calcTomanAmount)
      ? rawTomanAmount
      : calcTomanAmount;

    const finalCalcGoldGram =
      TransactionService.calcGoldGramWithTomanAmountInput(
        exchangeCurrencyPriceAmount,
        finalCalcTomanAmount
      );
    // TODO: Check for negative number
    // TODO: Check for debtPrem

    const { newSourceWalletAmount, newTargetWalletAmount } =
      this.#calcNewWalletAmountsBaseOfOrderType(
        payload.orderType,
        finalCalcTomanAmount,
        finalCalcGoldGram.toDecimalPlaces(3, 3),
        sourceWalletAmount,
        targetWalletAmount
      );

    this.#walletRepo.updateWalletAmount(
      sourceWallet,
      newSourceWalletAmount.toDecimalPlaces(3, 3)
    );
    this.#walletRepo.updateWalletAmount(
      targetWallet,
      newTargetWalletAmount.toDecimalPlaces(3, 3)
    );

    // TODO: Wallet Exchange Audit and Wallet Exchange table
    const incrementTransaction = this.#transactionRepo.create({
      type: "INCREMENT",
      source: "EXCHANGE",
      amount:
        payload.orderType === "buy" ? finalCalcGoldGram : finalCalcTomanAmount,
      wallet: targetWallet,
      walletAmount: newTargetWalletAmount,
    });

    const decrementTransaction = this.#transactionRepo.create({
      type: "DECREMENT",
      source: "EXCHANGE",
      amount:
        payload.orderType === "buy"
          ? finalCalcTomanAmount.abs().negated()
          : finalCalcGoldGram.abs().negated(),
      wallet: sourceWallet,
      walletAmount: newSourceWalletAmount,
    });

    const exchangePairTransaction =
      this.#walletExchangePairTransactionRepo.create(
        incrementTransaction,
        decrementTransaction
      );

    decrementTransaction.walletExchangePair = exchangePairTransaction;
    incrementTransaction.walletExchangePair = exchangePairTransaction;

    return Object.freeze({
      id: exchangePairTransaction.id,
      wallets: {
        sourceWallet: {
          id: sourceWallet.id,
          amount: sourceWallet.amount,
        },
        targetWallet: {
          id: targetWallet.id,
          amount: targetWallet.amount,
        },
      },
    });
  }

  static calcTomanAmountWithGoldGramInput(
    currencyPrice: Decimal,
    goldAmountInput: Decimal
  ) {
    const pricePerGram = TransactionService.calcPricePerGram(currencyPrice);
    return goldAmountInput.mul(pricePerGram).ceil();
  }

  static calcPricePerGram(currencyPrice: Decimal): Decimal {
    return currencyPrice.div(GOLD_CONST);
  }

  static calcGoldGramWithTomanAmountInput(
    currencyPrice: Decimal,
    tomanInput: Decimal
  ) {
    const pricePerGram = TransactionService.calcPricePerGram(currencyPrice);
    return tomanInput.div(pricePerGram);
  }
}

export default fp(function transactionServicePlugin(fastify, _, done) {
  // TODO: Dep check guard
  const transactionService = new TransactionService(
    fastify.walletTransactionRepo,
    fastify.walletRepo,
    fastify.currencyPriceRepo,
    fastify.walletExchangePairTransactionRepo
  );

  fastify.decorate("transactionService", transactionService);
  done();
});

declare module "fastify" {
  export interface FastifyInstance {
    transactionService: InstanceType<typeof TransactionService>;
  }
}
