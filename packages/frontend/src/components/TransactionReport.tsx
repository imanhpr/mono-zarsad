import { useRouteContext } from "@tanstack/react-router";
import clsx from "clsx";
import { useEffect, useState } from "react";

type Tabes = "DEPOSIT" | "WITHDRAW" | "EXCHANGE";
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
        color: "text-green-800",
      };
    case status === "INIT":
      return {
        text: "در حال برسی",
        color: "text-yellow-600",
      };
  }
}

export default function TransactionReport() {
  const zarApi = useRouteContext({ from: "/_layout", select: (t) => t.zarAPI });
  const [activeTab, setActiveTab] = useState<Tabes>("EXCHANGE");
  const [tData, setTData] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === "EXCHANGE")
      zarApi.get5LatestExchange().then((v) => setTData(v));
    else setTData([]);
  }, [zarApi, activeTab]);

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
        </ul>
      </div>
      <div className="relative md:mx-10 mt-4 overflow-x-auto">
        {tData.length !== 0 ? (
          <table className="mb-8 w-full text-gray-500 dark:text-gray-700 text-sm text-center rtl:text-right">
            <thead>
              <tr className="text-center">
                <th className="pb-4">شناسه تراکنش</th>
                <th className="pb-4">وضعیت</th>
                <th className="pb-4">مبدا</th>
                <th className="pb-4">مقصد</th>
                <th className="pb-4">تاریخ ایجاد</th>
              </tr>
            </thead>
            <tbody>
              {tData.length !== 0 &&
                tData.map((exchangeReport) => {
                  const status = statusMapper(exchangeReport.status);
                  const textCls = clsx("font-semibold", status?.color);
                  return (
                    <tr
                      className="bg-white py-2 border-gray-200 border-b last:border-b-0 text-center"
                      key={exchangeReport.id}
                    >
                      <td className="py-2 font-medium text-blue-500 underline underline-offset-3 cursor-pointer">
                        {exchangeReport.id}
                      </td>
                      <td className={textCls}>{status?.text}</td>
                      <td>
                        {intlNumber.format(exchangeReport.fromValue)}{" "}
                        {exchangeReport.fromCurrency.name === "GOLD_18"
                          ? "گرم"
                          : "تومان"}
                      </td>
                      <td>
                        {intlNumber.format(exchangeReport.toValue)}{" "}
                        {exchangeReport.toCurrency.name === "GOLD_18"
                          ? "گرم"
                          : "تومان"}
                      </td>
                      <td>
                        {intlِDate.format(new Date(exchangeReport.createdAt))}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : (
          <div className="text-center">
            تراکنشی برای شما برای نمایش وجود ندارد.
          </div>
        )}
      </div>
    </>
  );
}
