import { PairFactory } from "./CurrencyPair.ts";
import { isNil } from "es-toolkit";

export default class CalculationService {
  #pairFactory = new PairFactory();
  constructor() {}

  calcExchangeTransactionChanges(
    sourceAmount: string,
    targetAmount: string,
    exchangeCurrencyPriceAmount: string,
    sourceCurrencyName: string,
    targetCurrencyName: string
  ) {
    const pair = this.#pairFactory.getPair(
      sourceCurrencyName,
      targetCurrencyName,
      sourceAmount.toString(),
      exchangeCurrencyPriceAmount.toString(),
      "10"
    );
    if (isNil(pair)) throw new Error("Pair not found");

    const result = pair.calculate();
    return result;
  }
}
