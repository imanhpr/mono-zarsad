import fp from "fastify-plugin";
import axios from "axios";
import { randomUUID } from "node:crypto";
import { Decimal } from "decimal.js";

export class ZarinpalPayment {
  #callback_url = "http://localhost:3000";

  async initRequest(
    tomanAmount: Decimal,
    transactionDescription: string,
    order_id: string,
    userPhoneNumber: string
  ) {
    const url = "https://sandbox.zarinpal.com/pg/v4/payment/request.json";
    const metadata = {
      order_id,
      mobile: userPhoneNumber,
    };
    const payload = {
      merchant_id: randomUUID(),
      amount: tomanAmount.toNumber(),
      callback_url: this.#callback_url,
      description: transactionDescription,
      metadata,
    };
    const response = await axios.post(url, payload);

    return response.data;
  }

  callbackProcess() {}
}

export default fp(function paymentModulePlugin(fastify, _, done) {
  // TODO: Check for deps
  const zarinpalPayment = new ZarinpalPayment();
  fastify.decorate("zarinpalPayment", zarinpalPayment);

  done();
});

declare module "fastify" {
  export interface FastifyInstance {
    zarinpalPayment: InstanceType<typeof ZarinpalPayment>;
  }
}
