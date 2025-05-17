import { createFileRoute } from "@tanstack/react-router";
import { BsArrowDownUp, BsClockFill, BsCurrencyBitcoin } from "react-icons/bs";
import MainAreaContainer from "../../../../components/MainAreaContainer";
import BaseCard from "../../../../components/BaseContainer";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useCallback, useEffect, useState } from "react";

export const Route = createFileRoute("/_layout/_top-layout/currency/")({
  component: RouteComponent,
  async loader(ctx) {
    const api = ctx.context.adminApi;
    const [currencyList, currentSpread] = await Promise.all([
      api.getLatestCurrency(12, 1, "DESC"),
      api.getActiveSpread(),
    ]);
    return { currencyList, currentSpread };
  },
});

const intlNumber = new Intl.NumberFormat("fa-IR");
const intlDate = new Intl.DateTimeFormat("fa-IR", {
  second: "2-digit",
  minute: "2-digit",
  hour: "2-digit",
});

const intlDateLastPrice = new Intl.DateTimeFormat("fa-IR", {
  second: "2-digit",
  minute: "2-digit",
  hour: "2-digit",
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
});

function RouteComponent() {
  const { adminApi } = Route.useRouteContext();
  const data = Route.useLoaderData();
  const spread = data.currentSpread;
  const priceList = data.currencyList.data.data.toReversed();
  const currency = data.currencyList.data.currency;
  const chartDataMapper = useCallback(
    function (
      priceList: typeof data.currencyList.data.data,
      sellOffset = 0,
      buyOffset = 0
    ) {
      const d = priceList.map((d) => {
        return {
          ...d,
          sell: (parseInt(d.price) + sellOffset).toString(),
          buy: (parseInt(d.price) - buyOffset).toString(),
          rawCreatedAt: new Date(d.createdAt),
          createdAt: intlDate.format(new Date(d.createdAt)),
        };
      });
      return d;
    },
    [data]
  );

  const d = chartDataMapper(
    priceList,
    parseInt(spread.data.sell),
    parseInt(spread.data.buy)
  );

  console.log({ d });
  const [chartData, setChartData] = useState(d);
  const [lastPrice, setLastPrice] = useState(priceList[priceList.length - 1]);

  useEffect(() => {
    const interval = setInterval(() => {
      adminApi.getLatestCurrency(12, 1, "DESC").then((result) => {
        const priceList = result.data.data.toReversed();
        const res = chartDataMapper(
          priceList,
          parseInt(spread.data.sell),
          parseInt(spread.data.buy)
        );
        setChartData(res);
        setLastPrice(priceList[priceList.length - 1]);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [adminApi, chartDataMapper, spread]);
  return (
    <MainAreaContainer className="gap-y-3">
      <div className="flex lg:flex-row flex-col gap-y-3 lg:gap-x-3 lg:gap-y-0">
        <BaseCard className="justify-around gap-y-1 p-4">
          <header className="flex justify-between items-center mx-8">
            <h2 className="space-x-1 font-semibold text-base">ارز</h2>
            <BsCurrencyBitcoin className="fill-gray-500" size={20} />
          </header>
          <div
            dir="rtl"
            className="flex flex-col items-start mx-8 font-bold text-3xl fa-numeric"
          >
            <p>
              <span>{currency.name_farsi}</span>
            </p>
            <p className="font-light text-base">
              آیدی: <span dir="ltr">{currency.name}</span>
            </p>
          </div>
        </BaseCard>
        <BaseCard className="justify-around gap-y-1 p-4">
          <header className="flex justify-between items-center mx-8">
            <h2 className="space-x-1 font-semibold text-base">اِسپرد فعال</h2>
            <BsArrowDownUp className="fill-gray-500" size={20} />
          </header>
          <div
            dir="rtl"
            className="flex justify-around items-center mx-8 text-base fa-numeric"
          >
            <div>
              <h2 className="font-semibold">خرید</h2>
              <p className="text-green-600">
                {intlNumber.format(parseFloat(spread.data.buy))}
                <span> تومانءءء</span>
              </p>
            </div>
            <div>
              <h2 className="font-semibold">فروش</h2>
              <p className="text-red-600">
                {intlNumber.format(parseFloat(spread.data.sell))}
                <span> تومانءءء</span>
              </p>
            </div>
          </div>
        </BaseCard>
        <BaseCard className="justify-around gap-y-1 p-4">
          <header className="flex justify-between mx-8">
            <h2 className="space-x-1 font-semibold text-base">
              <span>آخرین قیمت</span>
            </h2>
            <div className="flex flex-col justify-center items-center space-y-1">
              <BsClockFill className="fill-gray-500" size={20} />
              <div
                dir="ltr"
                className="flex justify-center items-center gap-x-1.5"
              >
                <div className="inline-block bg-green-700 rounded-full w-1.5 h-1.5 animate-ping"></div>
                <div className="text-green-500 text-xs">Live</div>
              </div>
            </div>
          </header>
          <div
            dir="rtl"
            className="flex flex-col items-start mx-8 font-bold text-3xl fa-numeric"
          >
            <p>
              {intlNumber.format(parseFloat(lastPrice.price))}{" "}
              <sub className="font-light text-base">تومانء</sub>
            </p>
            <p className="font-light text-base">
              تاریخ : {intlDateLastPrice.format(new Date(lastPrice.createdAt))}
            </p>
          </div>
        </BaseCard>
      </div>
      <div className="flex flex-col gap-y-4 shadow-sm p-4 border border-gray-300 rounded">
        <header>
          <h2 className="font-semibold text-xl dot-1">آخرین قیمت های اخیر</h2>
        </header>
        <div dir="ltr" className="w-full fa-numeric-mono">
          <ResponsiveContainer width={"100%"} height={300}>
            <LineChart margin={{ left: 40, right: 40 }} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="createdAt" />
              <YAxis tickCount={6} domain={["auto"]} />
              <Legend />
              <Tooltip
                content={(d) => {
                  if (!d.payload) return;
                  const data = d.payload[0]?.payload;
                  if (!data) return;
                  return (
                    <div
                      dir="rtl"
                      className="bg-gray-200 p-2 border border-indigo-600 rounded min-w-44"
                    >
                      <p>{intlDateLastPrice.format(data.rawCreatedAt)}</p>
                      <div className="space-y-4">
                        <div className="text-sm">
                          <h6 className="text-green-600">قیمت خرید:</h6>
                          <span>
                            <p>
                              {intlNumber.format(data.buy)}
                              <span>تومانء</span>
                            </p>
                          </span>
                        </div>
                        <div className="text-sm">
                          <h6 className="text-indigo-600">قیمت پایه:</h6>
                          <span>
                            <p>
                              {intlNumber.format(data.price)}
                              <span>تومانء</span>
                            </p>
                          </span>
                        </div>

                        <div className="text-sm">
                          <h6 className="text-red-600">قیمت فروش</h6>
                          <span>
                            <p>
                              {intlNumber.format(data.sell)}
                              <span>تومانء</span>
                            </p>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                name="قیمت پایه"
                stroke="#8884d8"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="buy"
                name="خرید"
                stroke="green"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="sell"
                name="فروش"
                stroke="red"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MainAreaContainer>
  );
}
