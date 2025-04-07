import { BadgeColors } from "../components/Badge";

export const intlNumber = new Intl.NumberFormat("fa-IR");
export const intlِDate = new Intl.DateTimeFormat("fa-IR", {
  hour: "numeric",
  minute: "numeric",
  month: "long",
  year: "numeric",
  day: "numeric",
});
export function statusMapper(status: string): {
  text: string;
  color: BadgeColors;
} {
  switch (true) {
    case status === "SUCCESSFUL":
      return {
        text: "موفق",
        color: "green",
      };
    case status === "INIT":
      return {
        text: "در حال برسی",
        color: "yellow",
      };
  }
  return {
    text: "نامشخص",
    color: "default",
  };
}

export function amountAndCurrencyTypetoString(
  amount: string,
  currencyType: string
) {
  let currencyText = "تومان";
  if (currencyType === "GOLD_18") currencyText = "گرم";
  const amountText = intlNumber.format(amount as unknown as number);
  return `${amountText} ${currencyText}`;
}

export function simpleTransactionTypeMapper(status: string): {
  text: string;
  color: BadgeColors;
} {
  switch (true) {
    case status === "CARD_TO_CARD":
      return {
        text: "کارت به کارت",
        color: "indigo",
      };
  }
  return {
    text: "نامشخص",
    color: "default",
  };
}

export function currencyPairNameToTextType(
  fromCurrencyName: string,
  toCurrencyName: string
) {
  const reportTypeText = `تبدیل ${fromCurrencyName} به ${toCurrencyName}`;
  return reportTypeText;
}
