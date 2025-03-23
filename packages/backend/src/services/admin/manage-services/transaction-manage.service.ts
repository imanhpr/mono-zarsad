import fp from "fastify-plugin";
import { IsolationLevel, Transactional, wrap } from "@mikro-orm/core";
import { WalletTransactionRepo } from "../../../repository/Wallet-Transaction.repo.ts";
import { WalletRepo } from "../../../repository/Wallet.repo.ts";
import { Decimal } from "decimal.js";
import { EntityManager } from "@mikro-orm/postgresql";
import type Wallet from "../../../models/Wallet.entity.ts";
import { type ProfileRepo } from "../../../repository/Profile.repo.ts";

export class TransactionManageService {
  #walletTransactionRepo: WalletTransactionRepo;
  #walletRepo: WalletRepo;
  #profileRepo: ProfileRepo;

  constructor(
    walletTransactionRepo: WalletTransactionRepo,
    walletRepo: WalletRepo,
    profileRepo: ProfileRepo
  ) {
    this.#walletTransactionRepo = walletTransactionRepo;
    this.#walletRepo = walletRepo;
    this.#profileRepo = profileRepo;
  }

  @Transactional({ isolationLevel: IsolationLevel.SERIALIZABLE })
  async updateWalletUserAmount_P(
    walletId: number,
    amount: string,
    transactionType: "INCREMENT" | "DECREMENT"
  ) {
    const wallet = await this.#walletRepo.selectWalletForUpdate(walletId);

    let decimalAmount: Decimal | null = null;
    if (transactionType === "INCREMENT") {
      decimalAmount = new Decimal(amount);
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

    this.#walletTransactionRepo.create({
      amount: decimalAmount,
      wallet,
      source: "CARD_TO_CARD",
      type: transactionType,
      walletAmount: finalAmount,
    });

    this.#walletRepo.updateWalletAmount(wallet, finalAmount);
    const result = Object.freeze({
      wallet: {
        id: wallet.id,
        amount: finalAmount.toString(),
      },
    } as const);

    return result;
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
    fastify.walletTransactionRepo,
    fastify.walletRepo,
    fastify.profileRepo
  );
  fastify.decorate("transactionManageService", transactionManageService);
  done();
});

declare module "fastify" {
  export interface FastifyInstance {
    transactionManageService: InstanceType<typeof TransactionManageService>;
  }
}
