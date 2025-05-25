import { createFileRoute } from "@tanstack/react-router";
import BaseCard from "../../../../components/BaseContainer";
import Badge from "../../../../components/Badge";
import React, { Fragment, useContext, useEffect, useState } from "react";
import Select from "react-select";
import { IWalletSchema } from "../../../../schema/User.schema";
import { modalCtx } from "../../../../context/ctx";
import Modal from "../../../../components/Modal";
import {
  ISimpleTransactionPayloadSchema,
  SimpleTransactionCardToCardPayloadBaseSchema,
  SimpleTransactionPayloadSchema,
} from "../../../../schema/Credit.schema";
import { useAppDispatch } from "../../../../hooks/redux-hooks";
import { notificationSliceAction } from "../../../../store/notification.slice";

const transactionTypeList = [
  { value: "INCREMENT", label: "افزایش اعتبار" } as const,
  { value: "DECREMENT", label: "کاهش اعتبار" } as const,
];

type TransactionType = (typeof transactionTypeList)[number]["value"];

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

const intlNumber = new Intl.NumberFormat("fa-IR");

function RouteComponent() {
  const api = Route.useRouteContext().adminApi;
  const dispatch = useAppDispatch();
  const defaultSelectValue = transactionTypeList[0];
  const modalContext = useContext(modalCtx);
  const [transactionType, setTransactionType] = useState<TransactionType>(
    defaultSelectValue["value"]
  );
  const data = Route.useLoaderData();
  const user = data.data.users[0];
  const fullName = user.firstName + " " + user.lastName;
  const [transactionPayload, setTransactionPayload] =
    useState<ISimpleTransactionPayloadSchema>();
  const onFormSubmit = (payload: Record<string, unknown>) => {
    payload.transactionType = transactionType;
    payload.userId = user.id;
    const result = SimpleTransactionPayloadSchema.safeParse(payload);
    if (!result.success) {
      console.error("validation Error", result.error);
      throw new Error("Payload is invalid, talk to developer");
    }
    setTransactionPayload(result.data);

    modalContext.toggleDisplay();
  };
  const onFinalSubmit = () => {
    if (!transactionPayload) return;
    api.createTransaction(transactionPayload).then((r) => {
      dispatch(
        notificationSliceAction.addNotification({
          duration: 8,
          id: r.transactionId,
          message: `تراکنش با موفقیت  ایجاد شد - ${r.transactionId}`,
          status: "success",
        })
      );
      setTransactionPayload(undefined);
      modalContext.toggleDisplay();

      console.log("result : ", { r });
    });
  };
  return (
    <Fragment>
      {modalContext.display && transactionPayload && (
        <Modal className="space-y-4">
          <header>
            <h2 className="font-semibold text-lg">ثبت تراکنش جدید</h2>
            <p className="font-light text-neutral-500 text-base">
              شما در حال ثبت تراکنش جدید با مشخصات زیر هستید. در صورت اطمینان
              روی ثبت نهایی کلیک کنید.
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
                  <td>
                    <p>نوع تراکنش</p>
                  </td>
                  <td className="font-semibold">{transactionType}</td>
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
                  <td className="font-semibold">{user.id}</td>
                </tr>

                <tr>
                  <td>
                    <p>شناسه کیف پول</p>
                  </td>
                  <td className="font-semibold">
                    {transactionPayload.wallet.id}
                  </td>
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
                  transactionPayload.metaType === "CARD_TO_CARD" && (
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
              onClick={onFinalSubmit}
              className="bg-blue-500 px-2 py-1 rounded w-30 text-white cursor-pointer"
            >
              ثبت نهایی
            </button>
            <button
              onClick={() => {
                setTransactionPayload(undefined);
                modalContext.toggleDisplay();
              }}
              className="px-2 py-1 border border-neutral-300 rounded w-30 cursor-pointer"
            >
              بستن
            </button>
          </div>
        </Modal>
      )}
      <div dir="rtl" className="space-y-6 m-6">
        <div
          dir="rtl"
          className="flex lg:flex-row flex-col justify-start gap-y-4 lg:gap-x-4 lg:gap-y-0"
        >
          <BaseCard className="space-y-2 p-4 lg:min-w-90">
            <header>
              <h2 className="font-bold text-xl">مشخصات کاربر</h2>
            </header>

            <div className="space-y-1 fa-numeric-mono">
              <p>
                شناسه کاربری: <span className="font-semibold">{user.id}</span>
              </p>
              <p>
                نام و نام خانوادگی:{" "}
                <span className="font-semibold">{fullName}</span>
              </p>
              <p className="fa-numeric-mono">
                شماره موبایل:{" "}
                <span dir="ltr" className="font-medium">
                  {user.phoneNumber}
                </span>
              </p>
              <p className="fa-numeric-mono">
                کدملی: <span className="font-medium">{user.nationalCode}</span>
              </p>
            </div>
          </BaseCard>
          <BaseCard className="space-y-2 p-4 lg:min-w-60">
            <header>
              <h2 className="font-bold text-xl">دسترسی ها</h2>
            </header>
            <p>
              خرید اعتباری :{" "}
              {user.profile.debtPrem ? (
                <Badge color="green">فعال</Badge>
              ) : (
                <Badge color="red">غیرفعال</Badge>
              )}
            </p>
          </BaseCard>
          <BaseCard className="space-y-3 p-4 w-full">
            <header>
              <h2 className="font-bold text-xl">کیف پول ها</h2>
            </header>
            <table className="divide-y divide-neutral-200 w-full text-center">
              <thead>
                <tr>
                  <th className="font-light">شناسه کیف</th>
                  <th className="font-light">کیف پول</th>
                  <th className="font-light">اعتبار</th>
                  <th className="font-light">اعتبار قفل شده</th>
                </tr>
              </thead>
              <tbody>
                {user.wallets.map((wallet) => {
                  return (
                    <tr key={wallet.id}>
                      <td className="py-1">{wallet.id}</td>
                      <td>
                        {wallet.currencyType.name +
                          " - " +
                          wallet.currencyType.name_farsi}
                      </td>
                      <td>
                        {intlNumber.format(wallet.amount as unknown as number)}
                      </td>
                      <td>
                        {intlNumber.format(
                          wallet.lockAmount as unknown as number
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </BaseCard>
        </div>

        <BaseCard className="space-y-4 p-4">
          <header>
            <h2 className="font-bold text-xl">ایجاد تراکنش جدید</h2>
          </header>
          <div className="flex flex-col gap-y-2">
            <Select
              isRtl={true}
              options={transactionTypeList}
              className="w-full lg:max-w-1/4"
              defaultValue={defaultSelectValue}
              isClearable={false}
              onChange={(e) => {
                if (e?.value) {
                  setTransactionType(e.value);
                }
              }}
            />
            <div className="space-y-4">
              <FormFactory
                transactionType={transactionType}
                walletList={user.wallets}
                onSubmit={onFormSubmit}
              />
            </div>
          </div>
        </BaseCard>
      </div>
    </Fragment>
  );
}
function SimpleTransactionForm({
  wallets,
  onSubmit,
}: {
  wallets: IWalletSchema[];
  onSubmit: (payload: Record<string, unknown>) => void;
}) {
  const options = [
    { value: "CARD_TO_CARD", label: "کارت به کارت" },
    { value: "GOLD_DEPOSIT", label: "واریز طلا" },
  ];
  const defaultWalletId = wallets[0].id.toString();
  const [errorMessages, setErrorMessages] = useState<
    { message: string; id: string }[]
  >([]);
  const [currentWallet, setCurrentWallet] = useState<string>(defaultWalletId);
  const [isWalletSelectDisabled, setIsWalletSelectDisabled] = useState(false);
  const [transactionSource, setTransactionSource] =
    useState<string>("CARD_TO_CARD");

  const tomanWallet = wallets.find(
    (wallet) => wallet.currencyType.name === "TOMAN"
  );
  if (!tomanWallet) throw new Error("Toman wallet not found");

  let amountFormInputStyle =
    "px-4 py-2 border border-gray-300 rounded-lg fa-numeric-mono";
  if (errorMessages.some((item) => item.id === "invalid_string-amount"))
    amountFormInputStyle =
      "px-4 py-2 border border-red-300 rounded-lg fa-numeric-mono";

  const selectOptions: { label: string; value: string }[] = wallets.map(
    (wallet) => {
      return {
        label:
          `${wallet.id} - ` +
          wallet.currencyType.name_farsi +
          " - " +
          wallet.currencyType.name,

        value: wallet.id.toString(),
      };
    }
  );
  useEffect(() => {
    if (transactionSource === "CARD_TO_CARD") {
      setCurrentWallet(tomanWallet.id.toString());
      setIsWalletSelectDisabled(true);
    }

    if (transactionSource !== "CARD_TO_CARD" && isWalletSelectDisabled) {
      setIsWalletSelectDisabled(false);
    }
  }, [transactionSource, wallets, isWalletSelectDisabled, tomanWallet]);

  const onFormSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = Object.fromEntries(
      formData.entries()
    );
    payload.metaType = transactionSource;
    if (currentWallet) {
      payload.wallet = wallets.find(
        (wallet) => wallet.id.toString() === currentWallet
      )!;
    }
    payload.meta = { transactionIdentifier: payload.transactionIdentifier };
    console.log({ ppp: payload });
    const result =
      SimpleTransactionCardToCardPayloadBaseSchema.safeParse(payload);
    if (result.success) {
      setErrorMessages([]);
      return onSubmit(result.data);
    }
    console.log("ERRRPR", result.error);
    const errors = result.error.errors.map((ze) => ({
      message: ze.message,
      id: `${ze.code}-${ze.path}`,
    }));

    setErrorMessages(errors);
  };
  return (
    <form onSubmit={onFormSubmitHandler}>
      <div className="flex lg:flex-row flex-col gap-x-4 w-full">
        <div className="w-full lg:w-2/5">
          <label>کیف پول</label>
          <Select
            name="walletId"
            className=""
            isDisabled={isWalletSelectDisabled}
            isClearable={false}
            isRtl
            options={selectOptions}
            value={selectOptions.find(
              (wallet) => wallet.value.toString() === currentWallet
            )}
            onChange={(e) => {
              if (e?.value) {
                setCurrentWallet(e.value);
              }
            }}
          />
        </div>
        <div className="w-full lg:w-2/5">
          <label>نوع تراکنش</label>
          <Select
            name="transactionType"
            options={options}
            isClearable={false}
            isRtl
            value={options.find(
              (item) => item.value.toString() === transactionSource
            )}
            onChange={(e) => {
              if (e) {
                setTransactionSource(e.value);
              }
            }}
          />
        </div>
      </div>
      <div className="flex flex-col w-full lg:w-2/5">
        <label>مقدار</label>
        <input
          name="amount"
          type="number"
          className={amountFormInputStyle}
          dir="ltr"
        />
      </div>
      <Fragment>
        <SimpleTransactionMetadataFormFactory
          transactionSourceType={transactionSource}
        />
      </Fragment>
      {errorMessages.length !== 0 && (
        <ul className="mx-4 mt-2">
          {errorMessages.map((error) => (
            <li className="text-red-500 list-disc" key={error.id}>
              {error.message}
            </li>
          ))}
        </ul>
      )}
      <button className="bg-blue-500 mt-4 px-4 py-1 rounded min-w-20 text-white cursor-pointer">
        ثبت تراکنش
      </button>
    </form>
  );
}
function FormFactory({
  transactionType,
  walletList,
  onSubmit,
}: {
  transactionType?: TransactionType;
  walletList: IWalletSchema[];
  onSubmit: (payload: Record<string, unknown>) => void;
}) {
  switch (transactionType) {
    case "INCREMENT":
      return <SimpleTransactionForm onSubmit={onSubmit} wallets={walletList} />;
  }
  return <div>no no no!</div>;
}

function SimpleTransactionMetadataFormFactory(props: {
  transactionSourceType: string;
}) {
  switch (props.transactionSourceType) {
    case "CARD_TO_CARD":
      return (
        <div>
          <div className="flex flex-col w-full lg:max-w-2/5">
            <label>شناسه واریز</label>
            <input
              name="transactionIdentifier"
              className="px-4 py-2 border border-gray-300 rounded-lg fa-numeric-mono"
              type="number"
            />
          </div>
        </div>
      );
  }
  return <div>invalid type</div>;
}
