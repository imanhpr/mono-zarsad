import { createFileRoute } from "@tanstack/react-router";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
} from "chart.js";
import clsx from "clsx";
import { Fragment, useReducer, useState } from "react";
import { Line } from "react-chartjs-2";
import { Decimal } from "decimal.js";
import num2persian from "num2persian";
import { LuArrowDownUp } from "react-icons/lu";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
ChartJS.defaults.font = { family: "IRANYekanX", size: 18, weight: "normal" };

const numberIntl = new Intl.NumberFormat("fa-IR");
const timeIntl = new Intl.DateTimeFormat("fa-IR", {
  hour: "2-digit",
  minute: "2-digit",
  day: "numeric",
  month: "numeric",
  year: "numeric",
});
const dateIntlForChart = new Intl.DateTimeFormat("fa-IR", {
  day: "numeric",
  month: "numeric",
  year: "2-digit",
});

const dateIntlForToolTipTitle = new Intl.DateTimeFormat("fa-IR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const GOLD_CONST = "4.331802";
export const Route = createFileRoute("/_layout/")({
  component: Index,
  loader(ctx) {
    const api = ctx.context.zarAPI;
    // TODO: Get Gold By Name or get list of ids first

    return Promise.all([
      api.userInfo(),
      api.getCurrencyPriceByCurrencyTypeId(1),
    ]);
  },
});

function walletReducer<
  T extends { tomanWalletAmount: string; goldWalletAmount: string },
>(state: T, action: { action: string; amount: string }): T {
  const stateClone = structuredClone(state);

  switch (action.action) {
    case "SET_TOMAN":
      stateClone.tomanWalletAmount = action.amount;
      return stateClone;

    case "SET_GOLD":
      stateClone.goldWalletAmount = action.amount;
      return stateClone;
  }
  return state;
}

function Index() {
  const [user, priceList] = Route.useLoaderData();
  const goldWallet = user.wallets.find(
    (wallet) => wallet.currencyType.name === "GOLD_18"
  );
  const tomanWallet = user.wallets.find(
    (wallet) => wallet.currencyType.name === "TOMAN"
  );

  const [walletState, walletDispatch] = useReducer(walletReducer, {
    tomanWalletAmount: tomanWallet.amount as string,
    goldWalletAmount: goldWallet.amount as string,
  });

  const dataSet: any[] = priceList.slice(0, 8).map((item) => {
    const date = new Date(item.createdAt);
    const dateString = dateIntlForChart.format(date);
    return { y: item.price, x: dateString, createdAt: date };
  });
  const lastPrice = dataSet[dataSet.length - 1];

  const data = {
    datasets: [
      {
        label: "طلا",
        data: dataSet,
        fill: true,

        backgroundColor: "rgba(253, 224, 71 , 0.4)",
        borderColor: "rgb(253, 224, 71)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="flex flex-col">
      <div>
        <h2 className="font-bold text-3xl">خوش آمدی {user?.firstName} جان</h2>
      </div>
      {/* Card */}
      <div className="flex md:flex-row flex-col w-full">
        <div className="w-1/2">
          <div className="flex md:flex-row flex-col gap-x-0 gap-y-12 md:gap-x-12 md:gap-y-0 mt-12">
            <GradientCard
              title="کیف پول ﷼"
              amount={tomanWallet.amount}
              sub="تومانء"
              gradient="bg-gradient-to-tr from-lime-500 to-green-600"
            />

            <GradientCard
              title="کیف پول طلا"
              amount={goldWallet.amount}
              sub="گرم"
              gradient="bg-gradient-to-tr from-yellow-400 to-amber-500"
            />
          </div>
        </div>
        <div className="w-1/2">
          <div className="flex md:flex-row flex-col md:justify-end gap-x-0 gap-y-12 md:gap-x-12 md:gap-y-0 mt-12">
            <GradientCard
              title="آخرین قیمت"
              amount={lastPrice.y}
              sub="تومانء"
              gradient="bg-gradient-to-tr from-slate-500 to-slate-800"
              footer={`آخرین بروزرسانی : ${timeIntl.format(lastPrice.createdAt)}`}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-white shadow-lg mt-12 p-4 rounded min-w-full min-h-64">
        <div>
          <h1 className="font-extrabold text-2xl">خرید و فروش سریع</h1>
        </div>
        <div className="flex md:flex-row flex-col md:gap-x-8">
          <div className="flex flex-col w-1/2">
            <Line
              data={data}
              options={{
                locale: "fa-IR",
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    displayColors: false,
                    callbacks: {
                      title: (items) => {
                        const item = items[0];
                        return dateIntlForToolTipTitle.format(
                          item.raw.createdAt
                        );
                      },
                      label: (item) => `${item.formattedValue} تومانء`,
                    },
                  },
                },
              }}
            />
            <p className="mt-2 text-gray-600 text-muted text-center">
              قیمت ها در نمودار به تومان میباشند
            </p>
          </div>
          <div className="flex flex-col justify-start items-center w-1/2">
            <OrderForm goldPrice={lastPrice.y} />
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderForm({ goldPrice }: { goldPrice: string }) {
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [pair, setPair] = useState<"gold" | "toman">("gold");
  const [payload, setPayload] = useState({ goldAmount: "0", tomanAmount: "0" });

  const sellActiveOrderCls = {
    "bg-amber-400": orderType === "buy",
    "bg-amber-100": orderType !== "buy",
  };
  const buyActiveOrderCls = {
    "bg-amber-400": orderType === "sell",
    "bg-amber-100": orderType !== "sell",
  };
  const sellClassNames = clsx(
    "py-2 rounded md:w-24 lg:w-64 hover:cursor-pointer",
    sellActiveOrderCls
  );
  const buyClassNames = clsx(
    "py-2 rounded md:w-24 lg:w-64 hover:cursor-pointer",
    buyActiveOrderCls
  );

  const inputCls =
    "text-2xl bg-gray-100 focus:bg-white p-2 border border-gray-400 rounded-lg focus:outline-none w-full text-center fa-numeric";

  return (
    <Fragment>
      <div className="flex md:flex-row flex-col justify-around mb-10 w-3/4">
        <button onClick={() => setOrderType("buy")} className={sellClassNames}>
          خرید
        </button>
        <button onClick={() => setOrderType("sell")} className={buyClassNames}>
          فروش
        </button>
      </div>
      <div className="w-3/4">
        <label className="text-xl">تومانء</label>
        <input
          dir="ltr"
          onChange={(e) => {
            if (e.target.value === "")
              return setPayload({
                goldAmount: "0",
                tomanAmount: "0",
              });
            const calcGoldAmount = new Decimal(e.target.value)
              .div(new Decimal(goldPrice).div(GOLD_CONST))
              .toFixed(3, 3)
              .toString();
            setPayload({
              goldAmount: calcGoldAmount,
              tomanAmount: e.target.value,
            });
          }}
          onFocus={() => {
            setPair("toman");
          }}
          value={payload.tomanAmount !== "0" ? payload.tomanAmount : ""}
          type="text"
          name="toman"
          className={inputCls}
        />

        {payload.tomanAmount !== "0" && (
          <span>{num2persian(payload.tomanAmount)} تومانء</span>
        )}
      </div>
      <div className="bg-amber-400 my-2 p-2 rounded-full">
        <LuArrowDownUp size={32} />
      </div>
      <div className="w-3/4">
        <label className="text-xl">طلا</label>
        <input
          dir="ltr"
          onChange={(e) => {
            if (e.target.value === "")
              return setPayload({
                goldAmount: "0",
                tomanAmount: "0",
              });
            const calcTomanAmount = new Decimal(e.target.value)
              .mul(new Decimal(goldPrice).div(GOLD_CONST))
              .ceil()
              .toString();
            setPayload({
              goldAmount: e.target.value,
              tomanAmount: calcTomanAmount,
            });
          }}
          onFocus={() => setPair("gold")}
          value={payload.goldAmount !== "0" ? payload.goldAmount : ""}
          type="text"
          name="gold"
          className={inputCls}
        />
        {!new Decimal(payload.goldAmount).eq(0) && (
          <span>{goldAmountText(payload.goldAmount)}</span>
        )}
      </div>
    </Fragment>
  );
}

function goldAmountText(amount: string) {
  const d = new Decimal(amount).toFixed(3, 3).toString();
  const [gram, soot] = d.split(".");
  const sentence: string[] = [];

  if (gram && gram !== "0") {
    const text = `${num2persian(gram)} گرم`;
    sentence.push(text);
  }

  if (soot) {
    const sootText = num2persian(soot) + " " + "سوت";
    sentence.push(sootText);
  }
  return sentence.join(" و ");
}
function GradientCard(props: {
  title: string;
  amount: string;
  sub: string;
  gradient: string;
  footer?: string;
}) {
  const cls = clsx("shadow-2xl p-4 rounded text-white", props.gradient);
  return (
    <div className={cls}>
      <div className="flex flex-col items-start gap-4 min-w-64 min-h-32">
        <p className="font-bold text-xl">{props.title}</p>
        <p className="font-black text-4xl">
          <span dir="ltr">
            {numberIntl.format(props.amount as unknown as number)}
          </span>{" "}
          <sub className="font-normal text-lg">{props.sub}</sub>
        </p>
        {props.footer && (
          <p className="text-gray-200 text-sm">{props.footer}</p>
        )}
      </div>
    </div>
  );
}
