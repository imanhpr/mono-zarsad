import { Transactional } from "@mikro-orm/core";
import { CurrencyTypeEnum } from "../../types/currency-types.ts";

import { type WalletRepo } from "../../repository/Wallet.repo.ts";
import { type WalletAudiRepo } from "../../repository/Wallet-Audit.repo.ts";
import { type SimpleWalletTransactionRepo } from "../../repository/Simple-Wallet-Transaction.repo.ts";
import { type WalletTransactionRepo } from "../../repository/Wallet-Transaction.repo.ts";
import {
  SimpleWalletTransactionStatus,
  SimpleWalletTransactionType,
} from "../../models/Wallet-Simple-Transaction.entity.ts";
import { Decimal } from "decimal.js";

export default class WithdrawService {
  #walletRepo: WalletRepo;
  #walletAuditRepo: WalletAudiRepo;
  #simpleTransactionRepo: SimpleWalletTransactionRepo;
  #walletTransactionRepo: WalletTransactionRepo;
  constructor(
    walletRepo: WalletRepo,
    walletAuditRepo: WalletAudiRepo,
    simpleWalletTransactionRepo: SimpleWalletTransactionRepo,
    walletTransactionRepo: WalletTransactionRepo
  ) {
    this.#walletRepo = walletRepo;
    this.#walletAuditRepo = walletAuditRepo;
    this.#simpleTransactionRepo = simpleWalletTransactionRepo;
    this.#walletTransactionRepo = walletTransactionRepo;
  }

  @Transactional()
  async withdrawInit(type: CurrencyTypeEnum, userId: number, amount: string) {
    const transactionTime = new Date();
    const amountDecimal = new Decimal(amount).abs();
    const wallet =
      await this.#walletRepo.selectWalletForUpdateWithLockByUserIdAndType(
        userId,
        type
      );
    if (wallet.user.id !== userId) throw new Error("Invalid Wallet");

    const walletTransaction = await this.#walletTransactionRepo.create(
      "SIMPLE",
      transactionTime,
      false,
      false
    );

    let transactionType:
      | SimpleWalletTransactionType.PHYSICAL_GOLD_WITHDRAW
      | SimpleWalletTransactionType.TOMAN_WITHDRAW
      | null = null;

    if (type === CurrencyTypeEnum.GOLD_18)
      transactionType = SimpleWalletTransactionType.PHYSICAL_GOLD_WITHDRAW;
    else if (type === CurrencyTypeEnum.TOMAN)
      transactionType = SimpleWalletTransactionType.TOMAN_WITHDRAW;
    else throw new Error("Unknown withdraw transaction");

    const simpleWalletTransaction = this.#simpleTransactionRepo.create(
      walletTransaction.id,
      transactionType,
      SimpleWalletTransactionStatus.INIT,
      amount,
      wallet
    );

    const walletLockAmount = new Decimal(wallet.lockAmount);
    const newWalletLockAmount = walletLockAmount.plus(amountDecimal);
    wallet.lockAmount = newWalletLockAmount.toString();

    this.#walletAuditRepo.createLockAudit(
      "LOCK",
      amountDecimal,
      newWalletLockAmount,
      wallet,
      walletTransaction.id,
      transactionTime
    );
    return simpleWalletTransaction;
  }

  @Transactional()
  async withdrawFinalize(transactionId: string, userId: number) {
    const transactionTime = new Date();
    const walletTransaction =
      await this.#simpleTransactionRepo.selectTransactionByIdWithLockForUpdate(
        transactionId,
        userId
      );

    const wallet = await this.#walletRepo.selectWalletForUpdate(
      walletTransaction.wallet.id
    );
    const lockedAmount = new Decimal(walletTransaction.amount);
    const walletLockAmount = new Decimal(wallet.lockAmount);
    const walletAmount = new Decimal(wallet.amount);

    const newWalletLockAmount = walletLockAmount.minus(lockedAmount);
    const newWalletAmount = walletAmount.minus(lockedAmount);
    wallet.amount = newWalletAmount.toString();
    wallet.lockAmount = newWalletLockAmount.toString();

    this.#walletAuditRepo.createLockAudit(
      "LOCK_FREE",
      lockedAmount,
      newWalletLockAmount,
      wallet,
      walletTransaction.id,
      transactionTime
    );

    walletTransaction.status = SimpleWalletTransactionStatus.SUCCESSFUL;
    return walletTransaction;
  }
}
