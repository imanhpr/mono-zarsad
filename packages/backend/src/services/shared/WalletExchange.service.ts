import { Transactional } from "@mikro-orm/core";
import { Decimal } from "decimal.js";

import { type WalletAudiRepo } from "../../repository/Wallet-Audit.repo.ts";
import { type WalletRepo } from "../../repository/Wallet.repo.ts";
import { type CurrencyPriceRepo } from "../../repository/Currency-Price.repo.ts";
import { type WalletExchangePairTransactionRepo } from "../../repository/WalletExchangePairTransaction.repo.ts";
import { type PairRepo } from "../../repository/Pair.repo.ts";

import { WalletTransactionRepo } from "../../repository/Wallet-Transaction.repo.ts";
import { PairFactory } from "./CurrencyPair.ts";
import { IExchangeTransactionInitSchema } from "../admin/routes/transaction/schema.ts";
import WalletExchangePairTransaction, {
  WalletExchangeTransactionStatus,
} from "../../models/WalletExchangePairTransaction.entity.ts";

export class WalletExchangeService {
  #walletAuditRepo: WalletAudiRepo;
  #walletRepo: WalletRepo;
  #currencyPriceRepo: CurrencyPriceRepo;
  #walletExchangePairTransactionRepo: WalletExchangePairTransactionRepo;
  #walletTransactionRepo: WalletTransactionRepo;
  #pairRepo: PairRepo;
  #pairFactory = new PairFactory();

  constructor(
    walletAuditRepo: WalletAudiRepo,
    walletRepo: WalletRepo,
    currencyPriceRepo: CurrencyPriceRepo,
    walletExchangePairTransactionRepo: WalletExchangePairTransactionRepo,
    walletTransactionRepo: WalletTransactionRepo,
    pairRepo: PairRepo
  ) {
    this.#walletAuditRepo = walletAuditRepo;
    this.#walletRepo = walletRepo;
    this.#currencyPriceRepo = currencyPriceRepo;
    this.#walletExchangePairTransactionRepo = walletExchangePairTransactionRepo;
    this.#walletTransactionRepo = walletTransactionRepo;
    this.#pairRepo = pairRepo;
  }

  @Transactional()
  async initNewWalletPairCurrencyExchange(
    exchangePayload: IExchangeTransactionInitSchema
  ) {
    const payloadSourceAmount = new Decimal(exchangePayload.sourceAmount).abs();
    if (payloadSourceAmount.equals(0))
      throw new Error("Source amount must not be equal to zero");

    const now = new Date();
    const pair = await this.#pairRepo.findPairBySymbol(
      exchangePayload.pairSymbol
    );
    const { sourceWallet, targetWallet } =
      await this.#walletRepo.selectWalletPairForExchange(
        exchangePayload.userId,
        pair.sourceType.id,
        pair.targetType.id
      );

    if (sourceWallet.availableAmount().lt(payloadSourceAmount))
      throw new Error(
        "The current availableAmount balance of source wallet is not enough"
      );
    const [sourcePair, targetPair] = pair.symbol.split("/");
    if (!sourcePair || !targetPair) throw new Error("Invalid pair");

    const currencyPrice =
      await this.#currencyPriceRepo.findLatestCurrencyPriceByCurrencyTypeId(
        pair.basePriceType.id
      );

    const decimalSourceAmount = new Decimal(payloadSourceAmount).abs();
    const pairCalculator = this.#pairFactory.getPair(
      sourcePair,
      targetPair,
      decimalSourceAmount.toString(),
      currencyPrice.price,
      "100000"
    );

    if (!pairCalculator) throw new Error("Pair Logic not found");

    const calcResult = pairCalculator.calculate();

    const walletTransaction = this.#walletTransactionRepo.create(
      "EXCHANGE",
      now,
      true,
      true
    );

    const newSourceLockAmount = new Decimal(sourceWallet.lockAmount).plus(
      decimalSourceAmount
    );
    sourceWallet.lockAmount = newSourceLockAmount
      .toDecimalPlaces(3, 3)
      .toString();

    this.#walletAuditRepo.createLockAudit(
      "LOCK",
      decimalSourceAmount,
      newSourceLockAmount,
      sourceWallet,
      walletTransaction.id,
      now
    );

    const result = this.#walletExchangePairTransactionRepo.createInit({
      id: walletTransaction.id,
      currencyPrice: currencyPrice,
      fromCurrency: pair.sourceType,
      toCurrency: pair.targetType,
      fromValue: decimalSourceAmount,
      fromWallet: sourceWallet,
      toWallet: targetWallet,
      toValue: calcResult.roundedResult,
    });
    return result;
  }

  @Transactional()
  async finalizeWalletExchange(exchangeId: string) {
    const now = new Date();
    const [exchange, walletTransaction] = await Promise.all([
      this.#walletExchangePairTransactionRepo.getExchangeTransactionForUpdateWithLock(
        exchangeId
      ),
      this.#walletTransactionRepo.selectTransactionByIdWithLockForUpdate(
        exchangeId
      ),
    ]);

    if (exchange.isFinal())
      throw new Error("This transaction has finalized before");

    const { sourceWallet, targetWallet } =
      await this.#walletRepo.selectWalletPairForUpdateByExchangeTransactionWithLock(
        exchange
      );

    const amountToFreeOnSourceWallet = new Decimal(exchange.fromValue);

    const newSourceWalletAmount = new Decimal(sourceWallet.amount)
      .minus(exchange.fromValue)
      .toDecimalPlaces(3, 3);

    const newTargetWalletAmount = new Decimal(targetWallet.amount)
      .plus(exchange.toValue)
      .toDecimalPlaces(3, 3);

    const newSourceLockAmount = new Decimal(sourceWallet.lockAmount).minus(
      amountToFreeOnSourceWallet
    );

    sourceWallet.lockAmount = newSourceLockAmount
      .toDecimalPlaces(3, 3)
      .toString();
    this.#walletAuditRepo.createLockAudit(
      "LOCK_FREE",
      amountToFreeOnSourceWallet,
      newSourceLockAmount,
      sourceWallet,
      exchange.id,
      now
    );

    targetWallet.amount = newTargetWalletAmount
      .toDecimalPlaces(3, 3)
      .toString();
    const incrementAudit = this.#walletAuditRepo.create({
      type: "INCREMENT",
      amount: new Decimal(exchange.toValue),
      wallet: targetWallet,
      walletAmount: newTargetWalletAmount,
      walletTransactionId: exchange.id,
    });

    sourceWallet.amount = newSourceWalletAmount
      .toDecimalPlaces(3, 3)
      .toString();
    const decrementAudit = this.#walletAuditRepo.create({
      type: "DECREMENT",
      amount: new Decimal(exchange.fromValue),
      wallet: sourceWallet,
      walletAmount: newSourceWalletAmount,
      walletTransactionId: exchange.id,
    });

    exchange.increment = incrementAudit;
    exchange.decrement = decrementAudit;
    exchange.status = WalletExchangeTransactionStatus.SUCCESSFUL;
    exchange.finalizeAt = now;
    walletTransaction.isLock = false;

    return exchange as WalletExchangePairTransaction;
  }
}
