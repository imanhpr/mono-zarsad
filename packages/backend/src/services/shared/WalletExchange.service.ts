import { Transactional } from "@mikro-orm/core";
import { Decimal } from "decimal.js";
import { GOLD_CONST } from "../../helpers/index.ts";
import { type WalletAudiRepo } from "../../repository/Wallet-Audit.repo.ts";
import { type WalletRepo } from "../../repository/Wallet.repo.ts";
import { type CurrencyPriceRepo } from "../../repository/Currency-Price.repo.ts";
import { type WalletExchangePairTransactionRepo } from "../../repository/WalletExchangePairTransaction.repo.ts";
import type Wallet from "../../models/Wallet.entity.ts";
import { WalletTransactionRepo } from "../../repository/Wallet-Transaction.repo.ts";

export class WalletExchangeService {
  #walletAuditRepo: WalletAudiRepo;
  #walletRepo: WalletRepo;
  #currencyPriceRepo: CurrencyPriceRepo;
  #walletExchangePairTransactionRepo: WalletExchangePairTransactionRepo;
  #walletTransactionRepo: WalletTransactionRepo;

  constructor(
    walletAuditRepo: WalletAudiRepo,
    walletRepo: WalletRepo,
    currencyPriceRepo: CurrencyPriceRepo,
    walletExchangePairTransactionRepo: WalletExchangePairTransactionRepo,
    walletTransactionRepo: WalletTransactionRepo
  ) {
    this.#walletAuditRepo = walletAuditRepo;
    this.#walletRepo = walletRepo;
    this.#currencyPriceRepo = currencyPriceRepo;
    this.#walletExchangePairTransactionRepo = walletExchangePairTransactionRepo;
    this.#walletTransactionRepo = walletTransactionRepo;
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

  @Transactional()
  async createNewWalletPairCurrencyExchange(payload: {
    orderType: "sell" | "buy";
    wallets: {
      sourceId: number;
      targetId: number;
    };
    tomanAmount: string;
    goldAmount: string;
  }) {
    const transactionTime = new Date();
    const { sourceWallet, targetWallet } = await this.#getAndLockPairOfWallets(
      payload.wallets
    );
    const walletTransaction = this.#walletTransactionRepo.create(
      "EXCHANGE",
      transactionTime,
      false,
      false
    );

    const exchangeCurrencyPrice = await this.#getCurrencyTypeBaseOfOrderType(
      payload.orderType,
      { sourceWallet, targetWallet }
    );

    // Input from user
    const rawTomanAmount = new Decimal(payload.tomanAmount).abs();
    const rawGoldAmount = new Decimal(payload.goldAmount).abs();

    const exchangeCurrencyPriceAmount = new Decimal(
      exchangeCurrencyPrice.price
    );

    const calcTomanAmount =
      WalletExchangeService.calcTomanAmountWithGoldGramInput(
        exchangeCurrencyPriceAmount,
        rawGoldAmount
      );
    const finalCalcTomanAmount = rawTomanAmount.gte(calcTomanAmount)
      ? rawTomanAmount
      : calcTomanAmount;

    const finalCalcGoldGram =
      WalletExchangeService.calcGoldGramWithTomanAmountInput(
        exchangeCurrencyPriceAmount,
        finalCalcTomanAmount
      );

    const exchangePairTransaction =
      this.#walletExchangePairTransactionRepo.createInit({
        id: walletTransaction.id,
        fromWallet: sourceWallet,
        toWallet: targetWallet,
        currencyPrice: exchangeCurrencyPrice,
        fromCurrency: sourceWallet.currencyType,
        toCurrency: targetWallet.currencyType,
        fromValue:
          payload.orderType === "buy"
            ? finalCalcTomanAmount.abs().negated()
            : finalCalcGoldGram.abs().negated(),
        toValue:
          payload.orderType === "buy"
            ? finalCalcGoldGram
            : finalCalcTomanAmount,
      });

    return exchangePairTransaction;
  }

  @Transactional()
  async finalizeWalletExchange(exchangeId: string) {
    const exchangeTransaction =
      await this.#walletExchangePairTransactionRepo.getExchangeTransactionForUpdateWithLock(
        exchangeId
      );

    if (exchangeTransaction.isFinal()) throw new Error("Final Transaction");

    const wallets = await this.#walletRepo.selectWalletPairForExchange(
      exchangeTransaction.fromWallet.id,
      exchangeTransaction.toWallet.id
    );

    const sourceWallet = wallets.find(
      (wallet) => wallet.id === exchangeTransaction.fromWallet.id
    );
    const targetWallet = wallets.find(
      (wallets) => wallets.id === exchangeTransaction.toWallet.id
    );

    if (!sourceWallet || !targetWallet) throw new Error("Wallet Not Founds");

    const targetWalletAmount = new Decimal(targetWallet.amount);
    const sourceWalletAmount = new Decimal(sourceWallet.amount);

    const newSourceWalletAmount = sourceWalletAmount.minus(
      exchangeTransaction.fromValue
    );
    const newTargetWalletAmount = targetWalletAmount.plus(
      exchangeTransaction.toValue
    );

    const incrementTransaction = this.#walletAuditRepo.create({
      type: "INCREMENT",
      source: "EXCHANGE",
      amount: new Decimal(exchangeTransaction.toValue),
      wallet: targetWallet,
      walletAmount: newTargetWalletAmount,
      walletTransactionId: exchangeTransaction.id,
    });

    const decrementTransaction = this.#walletAuditRepo.create({
      type: "DECREMENT",
      source: "EXCHANGE",
      amount: new Decimal(exchangeTransaction.fromValue).abs().neg(),
      wallet: sourceWallet,
      walletAmount: newSourceWalletAmount,
      walletTransactionId: exchangeTransaction.id,
    });

    sourceWallet.amount = newSourceWalletAmount.toString();
    targetWallet.amount = newTargetWalletAmount.toString();

    this.#walletExchangePairTransactionRepo.setExchangeStatusToSuccessful(
      exchangeTransaction,
      incrementTransaction,
      decrementTransaction
    );
  }

  static calcTomanAmountWithGoldGramInput(
    currencyPrice: Decimal,
    goldAmountInput: Decimal
  ) {
    const pricePerGram = WalletExchangeService.calcPricePerGram(currencyPrice);
    return goldAmountInput.mul(pricePerGram).ceil();
  }

  static calcPricePerGram(currencyPrice: Decimal): Decimal {
    return currencyPrice.div(GOLD_CONST);
  }

  static calcGoldGramWithTomanAmountInput(
    currencyPrice: Decimal,
    tomanInput: Decimal
  ) {
    const pricePerGram = WalletExchangeService.calcPricePerGram(currencyPrice);
    return tomanInput.div(pricePerGram);
  }
}
