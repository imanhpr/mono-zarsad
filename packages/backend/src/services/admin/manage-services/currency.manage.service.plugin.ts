import i18next from "i18next";
import fp from "fastify-plugin";

import { BusinessOperationResult } from "../../../helpers/index.ts";

import { type CurrencyPriceRepo } from "../../../repository/Currency-Price.repo.ts";
import { type SpreadRepo } from "../../../repository/Spread.repo.plugin.ts";
import { type CurrencyTypeRepo } from "../../../repository/Currency-Type.repo.ts";
import { BusinessOperationException } from "../../../exceptions/index.ts";

export class CurrencyManageService {
  #currencyPriceRepo: CurrencyPriceRepo;
  #spreadRepo: SpreadRepo;
  #currencyTypeRepo: CurrencyTypeRepo;
  constructor(
    currencyPriceRepo: CurrencyPriceRepo,
    spreadRepo: SpreadRepo,
    currencyTypeRepo: CurrencyTypeRepo
  ) {
    this.#currencyPriceRepo = currencyPriceRepo;
    this.#spreadRepo = spreadRepo;
    this.#currencyTypeRepo = currencyTypeRepo;
  }

  async getLatestPriceLimit(
    currencyTypeId: number,
    limit = 50,
    orderBy: "ASC" | "DESC"
  ) {
    let currency: Awaited<ReturnType<CurrencyTypeRepo["findOneById"]>>;
    try {
      currency = await this.#currencyTypeRepo.findOneById(currencyTypeId);
    } catch (err) {
      throw new BusinessOperationException(
        400,
        i18next.t("CURRENCY_ID_NOT_FOUND"),
        { currencyTypeId }
      );
    }
    const data =
      await this.#currencyPriceRepo.findLatestCurrencyPriceListByTypeId(
        currency.id,
        limit,
        orderBy
      );

    return new BusinessOperationResult(
      "success",
      i18next.t("PRICE_GET_SUCCESS"),
      {
        currency,
        data,
      }
    );
  }

  async getActiveSpreadPair() {
    const result = await this.#spreadRepo.getLatestSpread();
    return new BusinessOperationResult(
      "success",
      i18next.t("SUCCESS_MESSAGE"),
      result
    );
  }
}

export default fp(
  async function currencyManageServicePlugin(fastify) {
    const currencyManageService = new CurrencyManageService(
      fastify.currencyPriceRepo,
      fastify.spreadRepo,
      fastify.currencyTypeRepo
    );
    fastify.decorate("currencyManageService", currencyManageService);
  },
  {
    name: "currencyManageServicePlugin",
    decorators: {
      fastify: ["currencyPriceRepo", "spreadRepo", "currencyTypeRepo"],
    },
  }
);

declare module "fastify" {
  export interface FastifyInstance {
    currencyManageService: InstanceType<typeof CurrencyManageService>;
  }
}
