import {
  amountAndCurrencyTypetoString,
  currencyPairNameToTextType,
  intlNumber,
  simpleTransactionTypeMapper,
  statusMapper,
} from "../helpers";
import Badge from "./Badge";

export default function SingleTransactionReportDetail({ data }: { data: any }) {
  if (data.type === "EXCHANGE") {
    return <ExchangeTransactionDetail data={data} />;
  } else if (data.type === "SIMPLE") {
    return <SimpleTransactionDetail data={data} />;
  }
}
const dateIntl = Intl.DateTimeFormat("fa-IR", {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function ExchangeTransactionDetail({ data }: { data: any }) {
  const reportTypeText = currencyPairNameToTextType(
    data.transactionReport.fromCurrency.name_farsi,
    data.transactionReport.toCurrency.name_farsi
  );

  const status = statusMapper(data.transactionReport.status);
  return (
    <table className="divide-y divide-neutral-200 w-full text-center">
      <thead>
        <tr>
          <th className="px-4 py-2">شناسه تراکنش</th>
          <th className="px-4 py-2">نوع تراکنش</th>
          <th className="px-4 py-2">مبدا</th>
          <th className="px-4 py-2">مقصد</th>
          <th className="px-4 py-2">وضعیت</th>
          <th className="px-4 py-2">تاریخ ایجاد</th>
          <th className="px-4 py-2">تاریخ ثبت نهایی</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="px-4 py-2">{data.transactionReport.id}</td>
          <td className="px-4 py-2">
            <Badge color="dark">{reportTypeText}</Badge>
          </td>
          <td className="px-4 py-2">
            {amountAndCurrencyTypetoString(
              data.transactionReport.fromValue,
              data.transactionReport.fromCurrency.name
            )}
          </td>
          <td className="px-4 py-2">
            {amountAndCurrencyTypetoString(
              data.transactionReport.toValue,
              data.transactionReport.toCurrency.name
            )}
          </td>
          <td className="px-4 py-2">
            <Badge color={status?.color}>{status?.text}</Badge>
          </td>
          <td className="px-4 py-2">
            {dateIntl.format(new Date(data.transactionReport.createdAt))}
          </td>
          <td className="px-4 py-2">
            {dateIntl.format(new Date(data.transactionReport.finalizeAt))}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function SimpleTransactionDetail({ data }: { data: any }) {
  const transactionTypeString = simpleTransactionTypeMapper(
    data.transactionReport.type
  );
  const amountText = `${intlNumber.format(data.transactionReport.amount)} ${data.transactionReport.wallet.currencyType.name_farsi}`;
  const status = statusMapper(data.transactionReport.status);
  return (
    <table className="divide-y divide-neutral-200 w-full text-center">
      <thead>
        <tr>
          <th className="px-4 py-2">شناسه تراکنش</th>
          <th className="px-4 py-2">نوع تراکنش</th>
          <th className="px-4 py-2">مقدار</th>
          <th className="px-4 py-2">وضعیت</th>
          <th className="px-4 py-2">تاریخ ثبت نهایی</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="px-4 py-2">{data.transactionReport.id}</td>
          <td className="px-4 py-2">
            <Badge color="dark">{transactionTypeString?.text}</Badge>
          </td>
          <td className="px-4 py-2">{amountText}</td>
          <td>
            <Badge color={status?.color}>{status?.text}</Badge>
          </td>
          <td className="px-4 py-2">
            {dateIntl.format(new Date(data.transactionReport.createdAt))}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
