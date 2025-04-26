// @ts-nocheck
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
  ChartData,
} from "chart.js";
import clsx from "clsx";
import { Line } from "react-chartjs-2";
import { Point } from "chart.js/auto";
import OrderForm from "../../components/OrderForm";
import TransactionReport from "../../components/TransactionReport";
import { motion } from "motion/react";

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

function Index() {
  const [user, priceList] = Route.useLoaderData();
  const goldWallet = user.wallets.find(
    (wallet) => wallet.currencyType.name === "GOLD_18"
  );
  const tomanWallet = user.wallets.find(
    (wallet) => wallet.currencyType.name === "TOMAN"
  );

  const dataSet: any[] = priceList.slice(0, 8).map((item) => {
    const date = new Date(item.createdAt);
    const dateString = dateIntlForChart.format(date);
    return { y: item.price, x: dateString, createdAt: date };
  });
  const lastPrice = dataSet[0];

  const data: ChartData<"line", (number | Point | null)[], unknown> = {
    datasets: [
      {
        label: "طلا",
        data: dataSet.toReversed(),
        fill: true,

        backgroundColor: "rgba(253, 224, 71 , 0.4)",
        borderColor: "rgb(253, 224, 71)",
        pointStyle: "circle",
        pointBorderColor: "black",
        pointBackgroundColor: "rgb(253, 224, 71)",
        pointHitRadius: 256,
        pointRadius: 8,
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
              footer={
                tomanWallet.amount < 0 ? "شما بدهکار می باشید" : undefined
              }
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
            <OrderForm
              goldPrice={lastPrice.y}
              buyFromWallet={tomanWallet}
              sellToWallet={goldWallet}
            />
          </div>
        </div>
      </div>
      <div className="flex md:flex-row flex-col md:gap-x-4 mt-8">
        <div className="bg-white shadow-lg rounded w-4/6 min-h-82">
          <h2 className="p-4 font-extrabold text-2xl">آخرین تراکنش ها</h2>
          <TransactionReport />
        </div>
        <div className="bg-white shadow-lg rounded w-2/6 min-h-82">
          <h2 className="p-4 font-extrabold text-2xl">اطلاعیه ها</h2>
        </div>
      </div>
    </div>
  );
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
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cls}
    >
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
    </motion.div>
  );
}
