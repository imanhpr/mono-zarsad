import fp from "fastify-plugin";
import {
  FlushMode,
  IsolationLevel,
  Transactional,
  wrap,
} from "@mikro-orm/core";
import { WalletRepo } from "../../../repository/Wallet.repo.ts";
import { Decimal } from "decimal.js";

import { type WalletAudiRepo } from "../../../repository/Wallet-Audit.repo.ts";
import { type ProfileRepo } from "../../../repository/Profile.repo.ts";
import { type WalletExchangeService } from "../../shared/WalletExchange.service.ts";
import { type WalletTransactionRepo } from "../../../repository/Wallet-Transaction.repo.ts";

import { mapDateToJalali } from "../../../helpers/index.ts";
import { SimpleWalletTransactionRepo } from "../../../repository/Simple-Wallet-Transaction.repo.ts";
import {
  SimpleWalletTransactionStatus,
  SimpleWalletTransactionType,
} from "../../../models/Wallet-Simple-Transaction.entity.ts";

export class TransactionManageService {
  #walletAudioRepo: WalletAudiRepo;
  #walletRepo: WalletRepo;
  #profileRepo: ProfileRepo;
  #shardWalletExchangeService: WalletExchangeService;
  #walletTransactionRepo: WalletTransactionRepo;
  #simpleWalletTransactionRepo: SimpleWalletTransactionRepo;

  constructor(
    walletAudioRepo: WalletAudiRepo,
    walletRepo: WalletRepo,
    profileRepo: ProfileRepo,
    sharedWalletExchangeService: WalletExchangeService,
    walletTransactionRepo: WalletTransactionRepo,
    simpleWalletTransactionRepo: SimpleWalletTransactionRepo
  ) {
    this.#walletAudioRepo = walletAudioRepo;
    this.#walletRepo = walletRepo;
    this.#profileRepo = profileRepo;
    this.#shardWalletExchangeService = sharedWalletExchangeService;
    this.#walletTransactionRepo = walletTransactionRepo;
    this.#simpleWalletTransactionRepo = simpleWalletTransactionRepo;
  }

  @Transactional({ isolationLevel: IsolationLevel.SERIALIZABLE })
  async updateWalletUserAmount_P(
    walletId: number,
    amount: string,
    transactionType: "INCREMENT" | "DECREMENT"
  ) {
    const wallet = await this.#walletRepo.selectWalletForUpdate(walletId);
    // @ts-expect-error
    const walletTransaction = this.#walletTransactionRepo.create("SIMPLE");

    let decimalAmount: Decimal | null = null;
    if (transactionType === "INCREMENT") {
      decimalAmount = new Decimal(amount).abs();
    } else {
      decimalAmount = new Decimal(amount).abs().negated();
    }

    const currentAmount = new Decimal(wallet.amount);
    const finalAmount = currentAmount.plus(decimalAmount).toDecimalPlaces(3, 3);

    const isAbleToMakeTransaction = await this.#checkUserDebtPrem(
      wallet.user.id,
      finalAmount
    );
    if (isAbleToMakeTransaction === false)
      throw new Error("The value must be a positive number");

    this.#walletAudioRepo.create({
      amount: decimalAmount,
      wallet,
      source: "CARD_TO_CARD",
      type: transactionType,
      walletAmount: finalAmount,
      walletTransactionId: walletTransaction.id,
    });

    this.#simpleWalletTransactionRepo.create(
      walletTransaction.id,
      SimpleWalletTransactionType.CARD_TO_CARD,
      SimpleWalletTransactionStatus.SUCCESSFUL,
      finalAmount.toString(),
      wallet
    );

    this.#walletRepo.updateWalletAmount(wallet, finalAmount);
    const result = Object.freeze({
      wallet: {
        id: wallet.id,
        amount: finalAmount.toString(),
      },
    } as const);

    return result;
  }

  finalizeWalletExchange(exchangeId: string) {
    return this.#shardWalletExchangeService.finalizeWalletExchange(exchangeId);
  }

  async userTransactionHistory(userId: number) {
    const result =
      // @ts-expect-error
      await this.#walletTransactionRepo.findWalletTransactionByUserId(userId);
    const mapResult = mapDateToJalali(result.transactions);
    return Object.freeze({ count: result.count, transactions: mapResult });
  }

  async #checkUserDebtPrem(userId: number, amount: Decimal) {
    const profile = await this.#profileRepo.findProfileByUserIdWithLock(userId);
    if (profile.debtPrem === false && amount.isNegative()) return false;
    return true;
  }
}

export default fp(function transactionManageServicePlugin(fastify, _, done) {
  // TODO: Validate Deps
  const transactionManageService = new TransactionManageService(
    fastify.walletAudiRepo,
    fastify.walletRepo,
    fastify.profileRepo,
    fastify.walletExchangeService,
    fastify.walletTransactionRepo,
    fastify.simpleWalletTransactionRepo
  );
  fastify.decorate("transactionManageService", transactionManageService);
  done();
});

declare module "fastify" {
  export interface FastifyInstance {
    transactionManageService: InstanceType<typeof TransactionManageService>;
  }
}
