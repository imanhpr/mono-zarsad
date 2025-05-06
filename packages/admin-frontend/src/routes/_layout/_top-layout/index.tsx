import { createFileRoute } from "@tanstack/react-router";
import { BsCurrencyExchange, BsFillPeopleFill } from "react-icons/bs";
import DashboardCard from "../../../components/DashboardCard";
export const Route = createFileRoute("/_layout/_top-layout/")({
  component: Index,
  async loader(ctx) {
    const api = ctx.context.adminApi;
    const result = await api.dashBoardInfo();
    return result;
  },
});

function Index() {
  const pageInfo = Route.useLoaderData();
  return (
    <div dir="rtl" className="flex justify-start gap-x-4 m-6">
      <DashboardCard
        title="مشتریان"
        Icon={BsFillPeopleFill}
        currentNumber={pageInfo.userCountInfo.currentUserCount}
        growthPercentage={pageInfo.userCountInfo.growthPercentage}
      />
      <DashboardCard
        title="تراکنش ها"
        Icon={BsCurrencyExchange}
        currentNumber={parseInt(
          pageInfo.walletTransactionInfo.filter(
            (transaction) => transaction.type === "ALL"
          )[0].count
        )}
      />
    </div>
  );
}
