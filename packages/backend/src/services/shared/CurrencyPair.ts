import { Decimal } from "decimal.js";
import { GOLD_CONST } from "../../helpers/index.ts";

export abstract class Pair {
  protected readonly sourceCurrency: string;
  protected readonly targetCurrency: string;
  protected readonly source: string;
  protected readonly currencyPricePerBase: string;
  protected readonly currencyPriceSpread: string;
  constructor(
    sourceCurrency: string,
    targetCurrency: string,
    source: string,
    currencyPricePerBase: string,
    currencyPriceSpread: string
  ) {
    this.sourceCurrency = sourceCurrency;
    this.targetCurrency = targetCurrency;
    this.source = source;
    this.currencyPricePerBase = currencyPricePerBase;
    this.currencyPriceSpread = currencyPriceSpread;
  }

  get pairSymbol() {
    return `${this.sourceCurrency} -> ${this.targetCurrency}`;
  }
  calculate(): {
    pair: string;
    mainResult: Decimal;
    roundedResult: Decimal;
    fractionPart: Decimal;
  } {
    throw new Error("Not implemented");
  }

  reverse() {
    throw new Error("Not implemented");
  }
}

class GoldToTomanPair extends Pair {
  #GOLD_CONST = GOLD_CONST;
  calculate() {
    const sourceDecimal = new Decimal(this.source).abs();
    const currencyPricePerBaseDecimal = new Decimal(
      this.currencyPricePerBase
    ).abs();

    const currencyPriceSpreadDecimal = new Decimal(
      this.currencyPriceSpread
    ).abs();

    const mainResult = currencyPricePerBaseDecimal
      .mul(sourceDecimal)
      .div(this.#GOLD_CONST);

    const fractionPart = mainResult.mod(mainResult.floor());
    return {
      pair: this.pairSymbol,
      mainResult,
      roundedResult: mainResult.ceil(),
      fractionPart,
    };
  }
  reverse() {
    return new TomanToGoldPair(
      "TOMAN",
      "GOLD",
      this.calculate().mainResult.toString(),
      this.currencyPricePerBase.toString(),
      this.currencyPriceSpread.toString()
    );
  }
}

class TomanToGoldPair extends Pair {
  #GOLD_CONST = new Decimal("4.331802");
  calculate() {
    const scale = 1000;
    const sourceDecimal = new Decimal(this.source).abs();
    const currencyPricePerBaseDecimal = new Decimal(
      this.currencyPricePerBase
    ).abs();
    const currencyPriceSpreadDecimal = new Decimal(
      this.currencyPriceSpread
    ).abs();

    const mainResult = sourceDecimal
      .mul(this.#GOLD_CONST)
      .div(currencyPricePerBaseDecimal);

    const scaledResult = mainResult.mul(scale);
    const roundedResult = scaledResult.floor().div(scale);
    const fractionPart = scaledResult.mod(scaledResult.floor());

    return {
      pair: this.pairSymbol,
      mainResult,
      roundedResult,
      fractionPart,
    };
  }

  reverse() {
    return new GoldToTomanPair(
      "GOLD",
      "TOMAN",
      this.calculate().mainResult.toString(),
      this.currencyPricePerBase,
      this.currencyPriceSpread
    );
  }
}

export class PairFactory {
  pairs = new Map(
    Object.entries({
      "TOMAN:GOLD_18": TomanToGoldPair,
      "GOLD_18:TOMAN": GoldToTomanPair,
    })
  );

  getPair(
    sourceCurrency: string,
    targetCurrency: string,
    sourceAmount: string,
    currencyPriceAmount: string,
    spreadAmount: string
  ): Pair | null {
    const key = `${sourceCurrency}:${targetCurrency}`;
    const cls = this.pairs.get(key);
    if (cls)
      return new cls(
        sourceCurrency,
        targetCurrency,
        sourceAmount,
        currencyPriceAmount,
        spreadAmount
      );
    return null;
  }
}
