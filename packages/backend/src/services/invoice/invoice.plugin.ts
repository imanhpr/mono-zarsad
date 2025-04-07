import fp from "fastify-plugin";
import { InvoiceService } from "./invoice.service.ts";
import invoiceRoutesPlugin from "./invoice.routes.ts";

export default fp(
  function invoiceModulePlugin(fastify, _, done) {
    const invoiceService = new InvoiceService(
      fastify.systemInfoRepo,
      fastify.walletReportService
    );
    fastify
      .decorate("invoiceService", invoiceService)
      .register(invoiceRoutesPlugin);
    done();
  },
  { name: "invoiceModulePlugin" }
);

declare module "fastify" {
  export interface FastifyInstance {
    invoiceService: InstanceType<typeof InvoiceService>;
  }
}
