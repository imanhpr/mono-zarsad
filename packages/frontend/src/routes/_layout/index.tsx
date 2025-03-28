import { createFileRoute } from "@tanstack/react-router";
import { useContext } from "react";
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
import { Line } from "react-chartjs-2";

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

export const Route = createFileRoute("/_layout/")({
  component: Index,
  loader(ctx) {
    const api = ctx.context.zarAPI;
    return api.userInfo();
  },
});

function Index() {
  const intl = new Intl.NumberFormat("fa-IR");
  const user = Route.useLoaderData();
  const goldWallet = user.wallets.find(
    (wallet) => wallet.currencyType.name === "GOLD_18"
  );
  const tomanWallet = user.wallets.find(
    (wallet) => wallet.currencyType.name === "TOMAN"
  );

  const data = {
    labels: ["01/01", "01/02", "01/03", "01/04", "601/05", "01/06"],
    datasets: [
      {
        label: "طلا",
        data: [
          8_114_200, 7_994_900, 7_938_800, 8_109_400, 7_697_800, 7_379_400,
          6_871_300,
        ].reverse(),
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
      <div className="flex md:flex-row flex-col gap-x-0 gap-y-12 md:gap-x-12 md:gap-y-0 mt-12">
        <div className="bg-gradient-to-tr from-lime-500 to-green-600 shadow-2xl p-4 rounded text-white">
          <div className="flex flex-col items-start gap-4 min-w-64 min-h-32">
            <p className="font-bold text-xl">کیف پول ریال</p>
            <p className="font-black text-4xl">
              <span dir="ltr">{intl.format(tomanWallet.amount)}</span>{" "}
              <sub className="font-normal text-lg">تومان</sub>
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-tr from-yellow-400 to-amber-500 shadow-xl p-4 rounded text-white">
          <div className="flex flex-col items-start gap-4 min-w-64 min-h-32">
            <p className="font-bold text-xl">کیف پول طلا</p>
            <p className="font-black text-4xl">
              <span dir="ltr">{intl.format(goldWallet.amount)}</span>{" "}
              <sub className="font-normal text-lg">گرم</sub>
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-white shadow-lg mt-12 p-4 rounded min-w-full min-h-64">
        <div>
          <h1 className="font-extrabold text-2xl">خرید و فروش طلا</h1>
        </div>
        <div className="flex md:flex-row flex-col md:gap-x-8">
          <div className="flex flex-col w-1/2">
            <Line
              data={data}
              options={{
                locale: "fa-IR",
                plugins: {
                  legend: { display: false },
                },
              }}
            />
            <p className="mt-2 text-gray-600 text-muted text-center">
              قیمت ها در نمودار به تومان میباشند
            </p>
          </div>
          <div className="flex flex-col justify-start items-center gap-y-12 w-1/2">
            <div className="flex md:flex-row flex-col justify-around md:gap-x-4 w-3/4">
              <button className="bg-amber-400 py-2 rounded md:w-24 lg:w-64 hover:cursor-pointer">
                خرید
              </button>
              <button className="bg-amber-100 py-2 rounded md:w-24 lg:w-64 hover:cursor-pointer">
                فروش
              </button>
            </div>
            <div className="w-3/4">
              <input
                type="text"
                name="toman"
                className="p-2 border border-gray-400 rounded-lg focus:outline-none w-full text-center"
              />
            </div>
            <div className="w-3/4">
              <input
                type="text"
                name="toman"
                className="p-2 border border-gray-400 rounded-lg focus:outline-none w-full text-center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
