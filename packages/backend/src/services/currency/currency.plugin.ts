import fp from "fastify-plugin";
import CurrencyServiceP from "./currency.service.ts";
import currencyRoutesPlugin from "./currency.routes.ts";

export default fp(
  function currencyServicePlugin(fastify, config, done) {
    fastify.register(CurrencyServiceP).register(currencyRoutesPlugin, config);
    done();
  },
  { name: "currencyServicePlugin" }
);
