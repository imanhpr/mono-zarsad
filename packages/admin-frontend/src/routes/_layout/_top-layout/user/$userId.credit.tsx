import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useContext, useRef, useState } from "react";
import { modalCtx } from "../../../../context/ctx";
import { useAppDispatch } from "../../../../hooks/redux-hooks";
import TransactionApprovalModal from "../../../../components/credit_page_components/TransactionApprovalModal";
import UserInfo from "../../../../components/credit_page_components/UserInfo";
import TransactionForm from "../../../../components/credit_page_components/TransactionForm";
import {
  FinalTransactionPayload,
  IFinalTransactionPayload,
} from "../../../../schema/Credit.schema";
import { TransactionTypes } from "../../../../types/transaction.interfaces";
import { notificationSliceAction } from "../../../../store/notification.slice";

export const Route = createFileRoute(
  "/_layout/_top-layout/user/$userId/credit"
)({
  component: RouteComponent,
  async loader(ctx) {
    const api = ctx.context.adminApi;
    const { userId } = ctx.params;
    const result = await api.getUserByUserId(parseInt(userId), true);
    return result;
  },
});

function RouteComponent() {
  const api = Route.useRouteContext().adminApi;
  const dispatch = useAppDispatch();
  const data = Route.useLoaderData();
  const modalContext = useContext(modalCtx);

  const [user, setUser] = useState(data.data.users[0]);
  const [transactionPayload, setTransactionPayload] =
    useState<IFinalTransactionPayload>();
  const transactionTypeRef = useRef<TransactionTypes>("SIMPLE_TRANSACTION");

  const fullName = user.firstName + " " + user.lastName;

  const onFormSubmit = (payload: Record<string, unknown>) => {
    payload.userId = user.id;
    const transactionPayload = FinalTransactionPayload.safeParse(payload);
    if (transactionPayload.success) {
      setTransactionPayload(transactionPayload.data);
      return modalContext.toggleDisplay();
    } else {
      console.error(
        "FinalTransaction Validation has just failed!",
        transactionPayload
      );
      setTransactionPayload(undefined);
    }
  };
  const onFinalSubmit = (transactionPayload: IFinalTransactionPayload) => {
    api.createTransaction(transactionPayload).then((res) => {
      modalContext.toggleDisplay();

      const message = `تراکنش جدید با موفقیت ثبت شد "${res.data.transactionId}"`;
      setUser((prev) => {
        const clone = structuredClone(prev);
        const index = clone.wallets.findIndex(
          (wallet) => wallet.id === res.data.wallet.id
        );
        clone.wallets[index].amount = res.data.wallet.amount;
        return clone;
      });
      dispatch(
        notificationSliceAction.addNotification({
          id: res.data.transactionId,
          message,
          status: "success",
          duration: 7,
        })
      );
    });
  };
  return (
    <Fragment>
      {modalContext.display && transactionPayload && (
        <TransactionApprovalModal
          fullName={fullName}
          transactionPayload={transactionPayload}
          userId={user.id}
          transactionType={transactionTypeRef.current}
          onClose={() => setTransactionPayload(undefined)}
          onSubmit={onFinalSubmit}
        />
      )}
      <div dir="rtl" className="space-y-6 m-6">
        <UserInfo user={user} />
        <TransactionForm
          onTypeChange={(t) => (transactionTypeRef.current = t)}
          onFormSubmit={onFormSubmit}
          user={user}
        />
      </div>
    </Fragment>
  );
}
