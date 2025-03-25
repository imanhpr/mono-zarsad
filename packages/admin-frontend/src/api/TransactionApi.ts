import { AxiosInstance } from "axios";

export default class TransactionAPI {
  #axios: AxiosInstance;

  constructor(ax: AxiosInstance) {
    this.#axios = ax;
  }

  async setupTransactionPage() {
    const response = await this.#axios.get("admin/transaction/setup");
    return response.data;
  }

  async createTransaction(
    walletId: number,
    amount: string,
    transactionType: string
  ) {
    const response = await this.#axios.post("admin/transaction", {
      walletId,
      amount,
      transactionType,
    });
    return response.data;
  }
  async getWalletTransactionsByUserId(userid: number) {
    const response = await this.#axios.get(`admin/transaction/${userid}`);
    return response.data;
  }
}
