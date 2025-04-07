import { type SystemInfoRepo } from "../../repository/System-Info.repo.ts";
import WalletReportService from "../shared/WalletReport.service.ts";

export class InvoiceService {
  #systemInfoRepo: SystemInfoRepo;
  #walletReportService: WalletReportService;
  constructor(
    systemInfoRepo: SystemInfoRepo,
    walletReportService: WalletReportService
  ) {
    this.#systemInfoRepo = systemInfoRepo;
    this.#walletReportService = walletReportService;
  }

  async getTransactionInvoiceById(transactionId: string, userId: number) {
    const [companyInfo, transactionReport] = await Promise.all([
      this.#systemInfoRepo.getCompanyInfo(),
      this.#walletReportService.findTransactionById(transactionId, userId),
    ]);
    return Object.assign({ companyInfo }, transactionReport);
  }
}
