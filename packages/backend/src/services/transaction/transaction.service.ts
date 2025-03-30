import fp from "fastify-plugin";
import { Transactional } from "@mikro-orm/core";
import { WalletTransactionRepo } from "../../repository/Wallet-Transaction.repo.ts";
import { WalletRepo } from "../../repository/Wallet.repo.ts";
import { Decimal } from "decimal.js";
import { CurrencyPriceRepo } from "../../repository/Currency-Price.repo.ts";

const GOLD_CONST = new Decimal("4.331802");

export class TransactionService {
  #transactionRepo: WalletTransactionRepo;
  #walletRepo: WalletRepo;
  #currencyPriceRepo: CurrencyPriceRepo;

  constructor(
    transactionRepo: WalletTransactionRepo,
    walletRepo: WalletRepo,
    currencyPriceRepo: CurrencyPriceRepo
  ) {
    this.#transactionRepo = transactionRepo;
    this.#walletRepo = walletRepo;
    this.#currencyPriceRepo = currencyPriceRepo;
  }
  // TODO: Make this function idempotent
  @Transactional()
  async buyTransaction(payload: {
    wallets: {
      sourceId: number;
      targetId: number;
    };
    tomanAmount: string;
    goldAmount: string;
  }) {
    const wallets = await this.#walletRepo.selectWalletPairForExchange(
      payload.wallets.sourceId,
      payload.wallets.targetId
    );

    const sourceWallet = wallets.find(
      (wallet) => wallet.id === payload.wallets.sourceId
    );
    const targetWallet = wallets.find(
      (wallet) => wallet.id === payload.wallets.targetId
    );

    if (!sourceWallet || !targetWallet) {
      throw new Error("Wallet not found");
    }

    const targetCurrencyPrice =
      await this.#currencyPriceRepo.findLatestCurrencyPriceByCurrencyTypeId(
        targetWallet.currencyType.id
      );

    const targetCurrencyPriceAmount = new Decimal(targetCurrencyPrice.price);
    const sourceWalletAmount = new Decimal(sourceWallet.amount);
    const targetWalletAmount = new Decimal(targetWallet.amount);

    const rawTomanAmount = new Decimal(payload.tomanAmount).abs();
    const rawGoldAmount = new Decimal(payload.goldAmount).abs();

    const calcTomanAmount = TransactionService.calcTomanAmountWithGoldGramInput(
      targetCurrencyPriceAmount,
      rawGoldAmount
    );

    const finalBuyTomanAmount = rawTomanAmount.gte(calcTomanAmount)
      ? rawTomanAmount
      : calcTomanAmount;

    const finalBuyCalcGoldGram =
      TransactionService.calcGoldGramWithTomanAmountInput(
        targetCurrencyPriceAmount,
        finalBuyTomanAmount
      );
    // TODO: Check for negative number
    // TODO: Check for debtPrem

    const newSourceWalletAmount = sourceWalletAmount.minus(finalBuyTomanAmount);
    const newTargetWalletAmount = targetWalletAmount.plus(finalBuyCalcGoldGram);

    this.#walletRepo.updateWalletAmount(sourceWallet, newSourceWalletAmount);
    this.#walletRepo.updateWalletAmount(
      targetWallet,
      newTargetWalletAmount.toDecimalPlaces(3, 3)
    );

    this.#transactionRepo.create({
      type: "INCREMENT",
      source: "EXCHANGE",
      amount: finalBuyCalcGoldGram,
      wallet: targetWallet,
      walletAmount: newTargetWalletAmount,
    });

    this.#transactionRepo.create({
      type: "DECREMENT",
      source: "EXCHANGE",
      amount: finalBuyTomanAmount.abs().negated(),
      wallet: sourceWallet,
      walletAmount: newSourceWalletAmount,
    });
  }

  sellTransaction() {}

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
    fastify.currencyPriceRepo
  );

  fastify.decorate("transactionService", transactionService);
  done();
});

declare module "fastify" {
  export interface FastifyInstance {
    transactionService: InstanceType<typeof TransactionService>;
  }
}
