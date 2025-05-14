import { EnsureRequestContext, Transactional } from "@mikro-orm/core";
import { type CurrencyPriceRepo } from "../../repository/Currency-Price.repo.ts";
import { type CurrencyTypeRepo } from "../../repository/Currency-Type.repo.ts";
import { CurrencyTypeEnum } from "../../types/currency-types.ts";
import { EntityManager } from "@mikro-orm/postgresql";
import type CurrencyType from "../../models/Currency-Type.entity.ts";
import { IMeltedGoldGetResponseSchema } from "../../plugins/persian-api/schema.ts";
import { Decimal } from "decimal.js";

const RESULT_KEYS = Object.freeze({
  NAGHDI: "آبشده نقدی".trim(),
  BONAK: "آبشده بنکداری ".trim(),
  LOWER: "آبشده کمتر از کیلو ".trim(),
} as const);

export class CronService {
  #currencyTypeRepo: CurrencyTypeRepo;
  #currencyPriceRepo: CurrencyPriceRepo;
  private readonly em: EntityManager;

  #MeltedGoldBonak?: CurrencyType;
  #MeltedGoldNaghdi?: CurrencyType;
  #MeltedGoldLower?: CurrencyType;

  constructor(
    priceRepo: CurrencyPriceRepo,
    typeRepo: CurrencyTypeRepo,
    em: EntityManager
  ) {
    this.#currencyPriceRepo = priceRepo;
    this.#currencyTypeRepo = typeRepo;
    this.em = em;
  }

  @EnsureRequestContext()
  async init() {
    const query: Readonly<CurrencyTypeEnum[]> = Object.freeze([
      CurrencyTypeEnum.MELTED_GOLD_BONAK_18,
      CurrencyTypeEnum.MELTED_GOLD_LOWER_18,
      CurrencyTypeEnum.MELTED_GOLD_NAGHDI_18,
    ] as const);
    const result =
      await this.#currencyTypeRepo.findCurrencyPriceByEnumName(query);

    if (result.length !== 3)
      throw Error("CurrencyType for updates must be 3 items");

    this.#MeltedGoldBonak = this.#findAndCheck(
      result,
      CurrencyTypeEnum.MELTED_GOLD_BONAK_18
    );

    this.#MeltedGoldLower = this.#findAndCheck(
      result,
      CurrencyTypeEnum.MELTED_GOLD_LOWER_18
    );

    this.#MeltedGoldNaghdi = this.#findAndCheck(
      result,
      CurrencyTypeEnum.MELTED_GOLD_NAGHDI_18
    );
  }

  #currencyTypeGuard() {
    if (
      !this.#MeltedGoldBonak ||
      !this.#MeltedGoldLower ||
      !this.#MeltedGoldNaghdi
    )
      throw new Error("Please use init method");
  }

  #findAndCheck(resultArray: CurrencyType[], key: CurrencyTypeEnum) {
    const item = resultArray.find((item) => item.name === key);
    if (!item) throw new Error(`${key} not found!`);
    return item;
  }
  @EnsureRequestContext()
  @Transactional()
  async insertNewMeltedGoldPrice(input: IMeltedGoldGetResponseSchema) {
    this.#currencyTypeGuard();
    const bonakPrice = input.result.data.find(
      (item) => item["عنوان"].trim() === RESULT_KEYS.BONAK
    );
    if (!bonakPrice)
      throw Error(`Insert new Price has just faild key : ${RESULT_KEYS.BONAK}`);

    const naghdiPrice = input.result.data.find(
      (item) => item["عنوان"].trim() === RESULT_KEYS.NAGHDI
    );
    if (!naghdiPrice)
      throw Error(
        `Insert new Price has just faild key : ${RESULT_KEYS.NAGHDI}`
      );

    const lowerPrice = input.result.data.find(
      (item) => item["عنوان"].trim() === RESULT_KEYS.LOWER
    );
    if (!lowerPrice)
      throw Error(`Insert new Price has just faild key : ${RESULT_KEYS.LOWER}`);

    this.#currencyPriceRepo.insertOne({
      price: new Decimal(lowerPrice["قیمت"]).div(10),
      currency: this.#MeltedGoldLower!,
    });

    this.#currencyPriceRepo.insertOne({
      price: new Decimal(naghdiPrice["قیمت"]).div(10),
      currency: this.#MeltedGoldNaghdi!,
    });

    this.#currencyPriceRepo.insertOne({
      price: new Decimal(bonakPrice["قیمت"]).div(10),
      currency: this.#MeltedGoldBonak!,
    });
  }
}
