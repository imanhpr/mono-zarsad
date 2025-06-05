import Modal from "../Modal";
import { useContext } from "react";
import { modalCtx } from "../../context/ctx";
import { IFinalTransactionPayload } from "../../schema/Credit.schema";
import {
  simpleTransactionTypeMapper,
  transactionTypeMapper,
} from "../../helpers/mappers";
import { TransactionTypes } from "../../types/transaction.interfaces";
type props = {
  fullName: string;
  userId: number;
  transactionType: TransactionTypes;
  transactionPayload: IFinalTransactionPayload;
  onSubmit: (payload: IFinalTransactionPayload) => void;
  onClose: () => void;
};
export default function TransactionApprovalModal({
  fullName,
  userId,
  transactionPayload,
  transactionType,
  onSubmit,
  onClose,
}: props) {
  const modalContext = useContext(modalCtx);

  return (
    <Modal className="space-y-4">
      <header>
        <h2 className="font-semibold text-lg">ثبت تراکنش جدید</h2>
        <p className="font-light text-neutral-500 text-base">
          شما در حال ثبت تراکنش جدید با مشخصات زیر هستید. در صورت اطمینان روی
          ثبت نهایی کلیک کنید.
        </p>
      </header>
      <div className="bg-neutral-100 border border-neutral-400 rounded w-full">
        <table className="divide-y divide-neutral-500 w-full text-center">
          <thead className="divide-y">
            <tr>
              <th className="py-2 font-bold dot-1">کلید</th>
              <th className="py-2 font-bold dot-1">مقدار</th>
            </tr>
          </thead>
          <tbody className="**:py-0.5 divide-y-[1px] divide-neutral-400 fa-numeric-mono">
            <tr>
              <td>نوع تراکنش</td>
              <td>{transactionTypeMapper(transactionType)}</td>
            </tr>
            <tr>
              <td>نوع عملیات تراکنش</td>
              <td className="font-semibold text-blue-500">
                {simpleTransactionTypeMapper(transactionPayload.operationType)}
              </td>
            </tr>
            <tr>
              <td>
                <p>نوع عملیات</p>
              </td>
              <td className="font-semibold">
                {transactionPayload.transactionType === "INCREMENT"
                  ? "افزایش (INCREMENT)"
                  : "کاهش (DECREMENT)"}
              </td>
            </tr>
            <tr>
              <td>
                <p>نام و نام خانوادگی</p>
              </td>
              <td className="font-semibold">{fullName}</td>
            </tr>
            <tr>
              <td>
                <p>شناسه کاربر</p>
              </td>
              <td className="font-semibold">{userId.toString()}</td>
            </tr>

            <tr>
              <td>
                <p>شناسه کیف پول</p>
              </td>
              <td className="font-semibold">{transactionPayload.walletId}</td>
            </tr>

            {transactionPayload && (
              <tr>
                <td>
                  <p>کیف پول</p>
                </td>
                <td className="font-semibold">
                  {transactionPayload.wallet.currencyType.name +
                    " - " +
                    transactionPayload.wallet.currencyType.name_farsi}
                </td>
              </tr>
            )}
            {transactionPayload &&
              typeof transactionPayload.amount === "string" && (
                <tr>
                  <td>
                    <p>مقدار</p>
                  </td>
                  <td className="font-semibold">
                    <span className="fa-numeric-mono" dir="ltr">
                      {transactionPayload.amount}
                    </span>
                  </td>
                </tr>
              )}
            {transactionPayload &&
              transactionPayload.operationType === "CARD_TO_CARD" && (
                <tr>
                  <td>شناسه واریز</td>
                  <td className="font-semibold fa-numeric-mono" dir="ltr">
                    {transactionPayload.meta.transactionIdentifier}
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
      <div className="space-x-2">
        <button
          onClick={() => onSubmit(transactionPayload)}
          className="bg-blue-500 px-2 py-1 rounded w-30 text-white cursor-pointer"
        >
          ثبت نهایی
        </button>
        <button
          onClick={() => {
            onClose();
            modalContext.toggleDisplay();
          }}
          className="px-2 py-1 border border-neutral-300 rounded w-30 cursor-pointer"
        >
          بستن
        </button>
      </div>
    </Modal>
  );
}
