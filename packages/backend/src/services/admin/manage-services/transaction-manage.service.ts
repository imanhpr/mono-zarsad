import fp from "fastify-plugin";
import { Transactional } from "@mikro-orm/core";
import { WalletRepo } from "../../../repository/Wallet.repo.ts";
import { Decimal } from "decimal.js";

import { type WalletAudiRepo } from "../../../repository/Wallet-Audit.repo.ts";
import { type ProfileRepo } from "../../../repository/Profile.repo.ts";
import { type WalletExchangeService } from "../../shared/WalletExchange.service.ts";
import { type WalletTransactionRepo } from "../../../repository/Wallet-Transaction.repo.ts";

import { BusinessOperationResult } from "../../../helpers/index.ts";
import { SimpleWalletTransactionRepo } from "../../../repository/Simple-Wallet-Transaction.repo.ts";
import { SimpleWalletTransactionStatus } from "../../../models/Wallet-Simple-Transaction.entity.ts";
import {
  IExchangeTransactionInitSchema,
  ISimpleTransaction,
} from "../routes/transaction/schema.ts";
import i18next from "i18next";
import { SimpleTransactionType } from "../../../types/transaction.ts";

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

  @Transactional()
  async createSimpleTransactionByAdmin(
    simpleTransactionPayload: ISimpleTransaction
  ) {
    const now = new Date();
    let meta;
    if ("meta" in simpleTransactionPayload) {
      meta = simpleTransactionPayload.meta;
    }

    const wallet = await this.#walletRepo.selectWalletForUpdateByIdAndUserId(
      simpleTransactionPayload.walletId,
      simpleTransactionPayload.userId
    );
    const walletTransaction = this.#walletTransactionRepo.create(
      "SIMPLE",
      now,
      false,
      false
    );

    let decimalAmount: Decimal | null = null;
    if (
      simpleTransactionPayload.transactionType ===
      SimpleTransactionType.INCREMENT
    ) {
      decimalAmount = new Decimal(simpleTransactionPayload.amount).abs();
    } else {
      decimalAmount = new Decimal(simpleTransactionPayload.amount)
        .abs()
        .negated();
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
      type: simpleTransactionPayload.transactionType,
      walletAmount: finalAmount,
      walletTransactionId: walletTransaction.id,
    });

    this.#simpleWalletTransactionRepo.create(
      walletTransaction.id,
      simpleTransactionPayload.operationType,
      SimpleWalletTransactionStatus.SUCCESSFUL,
      finalAmount.toString(),
      wallet,
      meta
    );

    this.#walletRepo.updateWalletAmount(wallet, finalAmount);
    const result = Object.freeze({
      transactionId: walletTransaction.id,
      userId: wallet.user.id,
      wallet: {
        id: wallet.id,
        amount: finalAmount.toString(),
      },
    } as const);

    return new BusinessOperationResult(
      "success",
      i18next.t("SUCCESS_OPERATION"),
      result
    );
  }

  finalizeWalletExchange(exchangeId: string) {
    return this.#shardWalletExchangeService.finalizeWalletExchange(exchangeId);
  }

  async transactionHistoryByUserId(userId: number) {
    const result =
      await this.#walletTransactionRepo.findWalletTransactionByUserId(userId);
    return Object.freeze({ count: result.count, transactions: result });
  }

  async transactionHistory(
    orderBt: "ASC" | "DESC",
    offset: number,
    limit: number
  ) {
    const result = await this.#walletTransactionRepo.transactionHistory(
      orderBt,
      offset,
      limit
    );

    return new BusinessOperationResult(
      "success",
      i18next.t("GET_RESULT_SUCCESS"),
      result
    );
  }

  async #checkUserDebtPrem(userId: number, amount: Decimal) {
    const profile = await this.#profileRepo.findProfileByUserIdWithLock(userId);
    if (profile.debtPrem === false && amount.isNegative()) return false;
    return true;
  }

  @Transactional()
  async createExchangeTransaction(payload: IExchangeTransactionInitSchema) {
    return this.#shardWalletExchangeService.initNewWalletPairCurrencyExchange(
      payload
    );
  }
}

export default fp(
  function transactionManageServicePlugin(fastify, _, done) {
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
  },
  {
    name: "transactionManageServicePlugin",
    decorators: {
      fastify: [
        "walletAudiRepo",
        "walletRepo",
        "profileRepo",
        "walletExchangeService",
        "walletTransactionRepo",
        "simpleWalletTransactionRepo",
      ],
    },
  }
);

declare module "fastify" {
  export interface FastifyInstance {
    transactionManageService: InstanceType<typeof TransactionManageService>;
  }
}
