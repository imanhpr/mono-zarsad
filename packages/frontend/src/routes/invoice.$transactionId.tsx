import { createFileRoute, Link } from "@tanstack/react-router";
import {
  intlِDate,
  amountAndCurrencyTypetoString,
  currencyPairNameToTextType,
} from "../helpers";

export const Route = createFileRoute("/invoice/$transactionId")({
  component: RouteComponent,
  loader(ctx) {
    const transactionId = ctx.params.transactionId;
    const zarApi = ctx.context.zarAPI;
    return zarApi.getTransactionInvoiceById(transactionId);
  },
});

const intlNumber = Intl.NumberFormat("fa-IR", {
  useGrouping: false,
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const [part1, part2] = data.companyInfo.nationalCode.split("/");
  const nationalCode = `${intlNumber.format(part1)}/${intlNumber.format(part2)}`;
  const reportTypeText = currencyPairNameToTextType(
    data.transactionReport.fromCurrency.name_farsi,
    data.transactionReport.toCurrency.name_farsi
  );

  return (
    <div
      dir="rtl"
      className="flex flex-col justify-center print:justify-start items-center gap-y-16 my-4 md:my-4 print:mt-0 min-h-screen"
    >
      <div className="flex lg:flex-row print:flex-row flex-col gap-y-6 lg:gap-x-12 lg:gap-y-0 print:gap-x-4 mx-1 md:mx-16 print:mx-0.5">
        <div className="bg-white shadow-sm print:shadow-none print:border rounded w-full lg:w-1/2">
          <h2 className="p-3 border-b border-b-neutral-200 font-bold text-2xl text-center">
            مشخصات فروشنده
          </h2>
          <div className="flex flex-col gap-y-6 p-4 print:p-2">
            <div className="flex print:flex-col flex-wrap justify-around md:gap-x-6 print:gap-y-1 print:text-xl print:text-center">
              <p className="flex-1 lg:basis-1/3 basis-full">
                نام : {data.companyInfo.name}
              </p>
              <p className="flex-1 lg:basis-1/3 basis-full">
                شماره اقتصادی:{" "}
                {intlNumber.format(data.companyInfo.economicNumber)}
              </p>
              <p className="flex-1 lg:basis-1/3 basis-full">
                شماره تلفن :{" "}
                {"۰" + intlNumber.format(data.companyInfo.phoneNumber)}
              </p>
              <p className="flex-1 lg:basis-1/3 basis-full">
                شماره ملی: {nationalCode}
              </p>
              <p className="flex-1 lg:basis-1/3 basis-full">
                کد پستی ده رقمی:{" "}
                {intlNumber.format(data.companyInfo.postalCode)}
              </p>
              <p className="flex-1 lg:basis-1/3 basis-full">
                استان : {data.companyInfo.province}
              </p>
              <p className="flex-1 lg:basis-1/3 basis-full">
                شهر : {data.companyInfo.city}
              </p>
              <p className="flex-1 lg:basis-1/3 basis-full">
                نشانی کامل : {data.companyInfo.address} لورم ایپسوم متن ساختگی
                با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک
                است
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm print:shadow-none print:border rounded w-full lg:w-1/2">
          <h2 className="p-3 border-b border-b-neutral-200 font-bold text-2xl text-center">
            مشخصات خریدار
          </h2>
          <div className="flex flex-col gap-y-6 p-4 print:p-2">
            <div className="flex print:flex-col flex-wrap justify-around md:gap-x-6 print:gap-y-1 print:text-xl print:text-center">
              <p className="flex-1 lg:basis-1/3 basis-full">
                نام شخص حقیقی/حقوقی :{" "}
                {data.user.firstName + " " + data.user.lastName}
              </p>
              <p className="flex-1 lg:basis-1/3 basis-full">
                شماره تلفن : {intlNumber.format(data.user.phoneNumber)}
              </p>
              <p className="flex-1 lg:basis-1/3 basis-full">
                شماره ملی: {intlNumber.format(data.user.nationalCode)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="print:max-w-full print:table-auto">
        <div className="bg-white shadow-sm print:shadow-none rounded">
          <h2 className="p-3 border-b border-b-neutral-200 font-bold text-2xl text-center">
            مشخصات تراکنش
          </h2>
          <div className="flex justify-center items-center my-2">
            <table className="print:border print:divide-y print:text-sm text-center">
              <thead>
                <tr className="">
                  <th>شناسه تراکنش</th>
                  <th>نوع تراکنش</th>
                  <th>مبدا</th>
                  <th>مقصد</th>
                  <th>تاریخ ایجاد</th>
                  <th>تاریخ ثبت نهایی</th>
                </tr>
              </thead>
              <tbody>
                <tr className="print:divide-x">
                  <td className="px-4 print:px-2 py-2">
                    {data.transactionReport.id}
                  </td>
                  <td className="px-4 print:px-2 py-2">{reportTypeText}</td>
                  <td className="px-4 print:px-2 py-2">
                    {amountAndCurrencyTypetoString(
                      data.transactionReport.fromValue,
                      data.transactionReport.fromCurrency.name
                    )}
                  </td>
                  <td className="px-4 print:px-2 py-2">
                    {amountAndCurrencyTypetoString(
                      data.transactionReport.toValue,
                      data.transactionReport.toCurrency.name
                    )}
                  </td>
                  <td className="px-4 print:px-2 py-2">
                    {intlِDate.format(
                      new Date(data.transactionReport.createdAt)
                    )}
                  </td>
                  <td className="px-4 print:px-2 py-2">
                    {intlِDate.format(
                      new Date(data.transactionReport.finalizeAt)
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex md:flex-row flex-col gap-y-4 md:gap-x-4 md:gap-y-0">
        <Link
          className="print:hidden bg-yellow-400 px-4 py-1 rounded font-medium text-black text-xl"
          from={Route.fullPath}
          to="/"
        >
          بازگشت به صفحه اصلی
        </Link>
        <button
          className="print:hidden bg-blue-600 px-4 py-1 rounded font-medium text-white hover:cursor-pointer"
          onClick={() => window.print()}
        >
          چاپ فاکتور
        </button>
      </div>
    </div>
  );
}
