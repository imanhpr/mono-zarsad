import { createFileRoute, Link } from "@tanstack/react-router";
import SingleTransactionReportDetail from "../../../components/SingleTransactionReportDetail";

export const Route = createFileRoute("/_layout/report/transaction/$id/")({
  component: RouteComponent,
  loader(ctx) {
    const zarApi = ctx.context.zarAPI;
    const transactionId = ctx.params.id;
    return zarApi.getTransactionReportById(transactionId);
  },
});

const intlSimpleNumber = Intl.NumberFormat("fa-IR", {
  useGrouping: false,
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const transactionId = Route.useParams({ select: (t) => t.id });
  return (
    <div className="flex flex-col gap-y-16 last:gap-y-8 text-lg">
      <div>
        <h2 className="font-bold text-4xl">گزارش تراکنش</h2>
      </div>
      <div className="flex flex-col gap-y-4 bg-white shadow-md p-4 rounded w-full">
        <div>
          <h2 className="mb-3 font-semibold text-xl">مشخصات کاربر</h2>
          <table className="divide-y divide-neutral-200 w-full text-center">
            <thead>
              <tr>
                <th className="px-4 py-2">شناسه کاربری</th>
                <th className="px-4 py-2">نام</th>
                <th className="px-4 py-2">نام خانوادگی</th>
                <th className="px-4 py-2">کد ملی</th>
                <th className="px-4 py-2">شماره همراه</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2">{data.user.id}</td>
                <td className="px-4 py-2">{data.user.firstName}</td>
                <td className="px-4 py-2">{data.user.lastName}</td>
                <td className="px-4 py-2">
                  {intlSimpleNumber.format(data.user.nationalCode)}
                </td>
                <td className="px-4 py-2">
                  {intlSimpleNumber.format(data.user.phoneNumber)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="mb-3 font-semibold text-xl">تراکنش</h2>
          <SingleTransactionReportDetail data={data} />
        </div>
      </div>

      <div>
        <Link
          className="bg-blue-600 px-4 py-2 rounded text-white hover:cursor-pointer"
          from={Route.fullPath}
          to="/invoice/$transactionId"
          params={{ transactionId }}
        >
          دریافت گزارش
        </Link>
      </div>
    </div>
  );
}
