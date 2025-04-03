import { useRouteContext } from "@tanstack/react-router";
import clsx from "clsx";
import { useEffect, useState } from "react";

type Tabes = "DEPOSIT" | "WITHDRAW" | "EXCHANGE" | "WALLET_TO_WALLET";
const intlِDate = new Intl.DateTimeFormat("fa-IR", {
  hour: "numeric",
  minute: "numeric",
  month: "long",
  year: "numeric",
  day: "numeric",
});
const intlNumber = new Intl.NumberFormat("fa-IR");

function statusMapper(status: string) {
  switch (true) {
    case status === "SUCCESSFUL":
      return {
        text: "موفق",
        color: "text-green-800 bg-green-50",
      };
    case status === "INIT":
      return {
        text: "در حال برسی",
        color: "text-yellow-600 bg-yellow-50",
      };
  }
}

function simpleTransactionTypeMapper(status: string) {
  switch (true) {
    case status === "CARD_TO_CARD":
      return {
        text: "کارت به کارت",
        css: "text-blue-600 bg-blue-50",
      };
  }
}

export default function TransactionReport() {
  const zarApi = useRouteContext({ from: "/_layout", select: (t) => t.zarAPI });
  const [activeTab, setActiveTab] = useState<Tabes>("EXCHANGE");
  const [tData, setTData] = useState<{
    exchangeTransactions: any[];
    simpleTransactions: any[];
  }>({ exchangeTransactions: [], simpleTransactions: [] });

  useEffect(() => {
    zarApi.get5LatestExchange().then((v) => setTData(v));
  }, [zarApi]);

  const normalCls =
    "inline-block p-4 hover:border-gray-300 border-transparent border-b-2 rounded-t-lg font-semibold hover:text-gray-600 dark:hover:text-gray-300 hover:cursor-pointer";
  const activeCls =
    "inline-block p-4 border-b-2 border-blue-600 dark:border-blue-500 rounded-t-lg font-semibold text-blue-600 dark:text-blue-500 hover:cursor-pointer active";

  return (
    <>
      <div className="md:mx-8 md:mb-4 border-gray-200 dark:border-gray-300 border-b font-medium text-gray-500 dark:text-gray-400 text-sm text-center">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <button
              onClick={() => setActiveTab("DEPOSIT")}
              className={activeTab === "DEPOSIT" ? activeCls : normalCls}
            >
              واریز
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab("WITHDRAW")}
              className={activeTab === "WITHDRAW" ? activeCls : normalCls}
            >
              برداشت
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab("EXCHANGE")}
              className={activeTab === "EXCHANGE" ? activeCls : normalCls}
            >
              تبدیل
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab("WALLET_TO_WALLET")}
              className={
                activeTab === "WALLET_TO_WALLET" ? activeCls : normalCls
              }
            >
              کیف به کیف
            </button>
          </li>
        </ul>
      </div>
      <div className="relative md:mx-10 mt-4 overflow-x-auto">
        {tableFactory(activeTab, tData)}
      </div>
    </>
  );
}

function ExchangeTable({
  exchangeTransactions,
}: {
  exchangeTransactions: any[];
}) {
  return (
    <table className="mb-8 w-full text-gray-500 dark:text-gray-700 text-sm text-center rtl:text-right">
      <thead>
        <tr className="text-center">
          <th className="me-4">شناسه تراکنش</th>
          <th className="me-4">وضعیت</th>
          <th className="me-4">مبدا</th>
          <th className="me-4">مقصد</th>
          <th className="me-4">تاریخ ایجاد</th>
        </tr>
      </thead>
      <tbody>
        {exchangeTransactions.length !== 0 &&
          exchangeTransactions.map((exchangeReport) => {
            const status = statusMapper(exchangeReport.status);
            const textCls = clsx(
              "px-2 py-1 border rounded-4xl font-medium",
              status?.color
            );
            return (
              <tr
                className="bg-gray-50 py-2 border-gray-200 border-b last:border-b-0 text-center"
                key={exchangeReport.id}
              >
                <td className="py-2 font-medium text-blue-500 underline underline-offset-3 cursor-pointer">
                  {exchangeReport.id}
                </td>
                <td>
                  <div className={textCls}>{status?.text}</div>
                </td>
                <td>
                  {amountAndCurrencyTypetoString(
                    exchangeReport.fromValue,
                    exchangeReport.fromCurrency.name
                  )}
                </td>
                <td>
                  {amountAndCurrencyTypetoString(
                    exchangeReport.toValue,
                    exchangeReport.toCurrency.name
                  )}
                </td>
                <td>{intlِDate.format(new Date(exchangeReport.createdAt))}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

function SimpleTransactionTable({
  simpleTransactions,
}: {
  simpleTransactions: any[];
}) {
  return (
    <table className="mb-8 w-full text-gray-500 dark:text-gray-700 text-sm text-center rtl:text-right">
      <thead>
        <tr className="text-center">
          <th className="me-4">شناسه تراکنش</th>
          <th className="me-4">وضعیت</th>
          <th className="me-4">نوع تراکنش</th>
          <th className="me-4">مقدار</th>
          <th className="me-4">تاریخ ایجاد</th>
        </tr>
      </thead>
      <tbody>
        {simpleTransactions.map((simpleTransaction) => {
          const status = statusMapper(simpleTransaction.status);
          const tType = simpleTransactionTypeMapper(simpleTransaction.type);
          const textCls = clsx(
            "px-2 py-1 border rounded-4xl font-medium",
            status?.color
          );

          const typeCls = clsx(
            "px-2 py-1 border rounded-4xl font-medium",
            tType?.css
          );
          return (
            <tr
              className="bg-gray-50 py-2 border-gray-200 border-b last:border-b-0 text-center"
              key={simpleTransaction.id}
            >
              <td className="py-2 font-medium text-blue-500 underline underline-offset-3 cursor-pointer">
                {simpleTransaction.id}
              </td>
              <td className="pe-4">
                <div className={textCls}>{status?.text}</div>
              </td>
              <td>
                <div className={typeCls}>{tType?.text}</div>
              </td>
              <td>
                {amountAndCurrencyTypetoString(
                  simpleTransaction.amount,
                  simpleTransaction.wallet.currencyType.name
                )}
              </td>
              <td>{intlِDate.format(new Date(simpleTransaction.createdAt))}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function tableFactory(
  tab: Tabes,
  data: {
    exchangeTransactions: any[];
    simpleTransactions: any[];
  }
) {
  switch (true) {
    case tab === "DEPOSIT":
      return (
        <SimpleTransactionTable simpleTransactions={data.simpleTransactions} />
      );
    case tab === "EXCHANGE":
      return <ExchangeTable exchangeTransactions={data.exchangeTransactions} />;
  }
  return (
    <div className="text-center">تراکنشی برای شما برای نمایش وجود ندارد.</div>
  );
}

function amountAndCurrencyTypetoString(amount: string, currencyType: string) {
  let currencyText = "تومان";
  if (currencyType === "GOLD_18") currencyText = "گرم";
  const amountText = intlNumber.format(amount as unknown as number);
  return `${amountText} ${currencyText}`;
}
