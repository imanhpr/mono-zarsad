import { type SimpleWalletTransactionRepo } from "../../repository/Simple-Wallet-Transaction.repo.ts";
import { type WalletExchangePairTransactionRepo } from "../../repository/WalletExchangePairTransaction.repo.ts";

export default class WalletReportService {
  #simpleWalletTransactionRepo: SimpleWalletTransactionRepo;
  #walletExchangeTransactionRepo: WalletExchangePairTransactionRepo;
  constructor(
    simpleWalletTransactionRepo: SimpleWalletTransactionRepo,
    walletExchangeTransactionRepo: WalletExchangePairTransactionRepo
  ) {
    this.#simpleWalletTransactionRepo = simpleWalletTransactionRepo;
    this.#walletExchangeTransactionRepo = walletExchangeTransactionRepo;
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
}
