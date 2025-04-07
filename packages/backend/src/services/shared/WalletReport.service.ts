import { type SimpleWalletTransactionRepo } from "../../repository/Simple-Wallet-Transaction.repo.ts";
import { type WalletExchangePairTransactionRepo } from "../../repository/WalletExchangePairTransaction.repo.ts";
import { WalletTransactionRepo } from "../../repository/Wallet-Transaction.repo.ts";

export default class WalletReportService {
  #simpleWalletTransactionRepo: SimpleWalletTransactionRepo;
  #walletExchangeTransactionRepo: WalletExchangePairTransactionRepo;
  #walletTransactionRepo: WalletTransactionRepo;
  constructor(
    simpleWalletTransactionRepo: SimpleWalletTransactionRepo,
    walletExchangeTransactionRepo: WalletExchangePairTransactionRepo,
    walletTransactionRepo: WalletTransactionRepo
  ) {
    this.#simpleWalletTransactionRepo = simpleWalletTransactionRepo;
    this.#walletExchangeTransactionRepo = walletExchangeTransactionRepo;
    this.#walletTransactionRepo = walletTransactionRepo;
  }

  async find5LatestReportByUserId(userId: number) {
    const exchangeTransactionPromise =
      this.#walletExchangeTransactionRepo.find5LatestTransaction(userId);
    const simpleTransactionPromise =
      this.#simpleWalletTransactionRepo.find5LatestTransaction(userId);

    const [exchangeTransactions, simpleTransactions] = await Promise.all([
      exchangeTransactionPromise,
      simpleTransactionPromise,
    ]);

    return Object.freeze({
      exchangeTransactions,
      simpleTransactions,
    });
  }

  async findTransactionById(transactionId: string, userId: number) {
    const transaction =
      await this.#walletTransactionRepo.findOneByTransactionId(transactionId);

    if (transaction.type === "SIMPLE") {
      const transactionReport =
        await this.#simpleWalletTransactionRepo.findTransactionById(
          transactionId,
          userId
        );

      return Object.freeze({
        type: transaction.type,
        transactionReport,
      });
    }
    if (transaction.type === "EXCHANGE") {
      const transactionReport =
        await this.#walletExchangeTransactionRepo.findTransactionById(
          transactionId,
          userId
        );

      return Object.freeze({
        type: transaction.type,
        transactionReport,
      });
    }
  }
}
