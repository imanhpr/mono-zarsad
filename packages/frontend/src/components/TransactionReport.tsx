import { Link } from "@tanstack/react-router";
import { useRouteContext } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  amountAndCurrencyTypetoString,
  intlِDate,
  simpleTransactionTypeMapper,
  statusMapper,
} from "../helpers";
import Badge from "./Badge";

type Tabes = "DEPOSIT" | "WITHDRAW" | "EXCHANGE" | "WALLET_TO_WALLET";

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

            return (
              <tr
                className="bg-gray-50 py-2 border-gray-200 border-b last:border-b-0 text-center"
                key={exchangeReport.id}
              >
                <td className="py-2 font-medium text-blue-500 underline underline-offset-3 cursor-pointer">
                  <Link
                    from="/"
                    to={`/report/transaction/$id`}
                    params={{ id: exchangeReport.id }}
                  >
                    {exchangeReport.id}
                  </Link>
                </td>
                <td>
                  <Badge color={status?.color}>{status?.text}</Badge>
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
          return (
            <tr
              className="bg-gray-50 py-2 border-gray-200 border-b last:border-b-0 text-center"
              key={simpleTransaction.id}
            >
              <td className="py-2 font-medium text-blue-500 underline underline-offset-3 cursor-pointer">
                <Link
                  to="/report/transaction/$id"
                  params={{ id: simpleTransaction.id }}
                >
                  {simpleTransaction.id}
                </Link>
              </td>
              <td className="pe-4">
                <Badge color={status?.color as any}>{status?.text}</Badge>
              </td>
              <td>
                <Badge color={tType?.color as any}>{tType?.text}</Badge>
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
