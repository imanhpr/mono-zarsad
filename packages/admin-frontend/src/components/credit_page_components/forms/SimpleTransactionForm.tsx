import { Fragment, useEffect, useState } from "react";
import { IWalletSchema } from "../../../schema/User.schema";
import Select from "react-select";
import SimpleTransactionMetadataFormFactory from "./SimpleTransactionMetadataFormFactory";
import { TransactionWalletNameEnum } from "../../../constants";
import {
  SimpleTransactionOperation,
  SimpleTransactionType,
} from "../../../types/transaction.interfaces";
import { SimpleTransactionPayloadSchema } from "../../../schema/Credit.schema";

const simpleTransactionOperationOptions = [
  { value: "INCREMENT", label: "افزایش اعتبار" } as const,
  { value: "DECREMENT", label: "کاهش اعتبار" } as const,
] as const;
const simpleTransactionType = [
  { value: "CARD_TO_CARD", label: "کارت به کارت" } as const,
  { value: "GOLD_DEPOSIT", label: "واریز طلا" } as const,
  { value: "GOLD_WITHDRAW", label: "برداشت طلا فیزیکی" } as const,
] as const;

export default function SimpleTransactionForm({
  wallets,
  onSubmit,
}: {
  wallets: IWalletSchema[];
  onSubmit: (payload: Record<string, unknown>) => void;
}) {
  const defaultWalletId = wallets[0].id.toString();
  const [errorMessages, setErrorMessages] = useState<
    { message: string; id: string }[]
  >([]);
  const [isOperationSelectDisabled, setIsOperationSelectDisabled] =
    useState(false);
  const [isWalletSelectDisabled, setIsWalletSelectDisabled] = useState(false);

  const [currentWallet, setCurrentWallet] = useState<string>(defaultWalletId);

  const [transactionSource, setTransactionSource] =
    useState<SimpleTransactionType>("CARD_TO_CARD");

  const [simpleTransactionOperation, setSimpleTransactionOperation] =
    useState<SimpleTransactionOperation>("INCREMENT");

  const tomanWallet = wallets.find(
    (wallet) => wallet.currencyType.name === TransactionWalletNameEnum.TOMAN
  );
  const goldWallet = wallets.find(
    (wallet) =>
      wallet.currencyType.name === TransactionWalletNameEnum.MELTED_GOLD_18
  );

  if (!tomanWallet) throw new Error("Toman wallet not found");
  if (!goldWallet) throw new Error("Gold Wallet not found");

  let amountFormInputStyle =
    "px-4 py-2 border border-gray-300 rounded-lg fa-numeric-mono";
  if (errorMessages.some((item) => item.id === "invalid_string-amount"))
    amountFormInputStyle =
      "px-4 py-2 border border-red-300 rounded-lg fa-numeric-mono";

  const walletSelectOptions: { label: string; value: string }[] = wallets.map(
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
      setIsOperationSelectDisabled(false);
    } else if (transactionSource === "GOLD_DEPOSIT") {
      setCurrentWallet(goldWallet.id.toString());
      setSimpleTransactionOperation("INCREMENT");
      setIsOperationSelectDisabled(true);
      setIsWalletSelectDisabled(true);
    } else if (transactionSource === "GOLD_WITHDRAW") {
      setCurrentWallet(goldWallet.id.toString());
      setSimpleTransactionOperation("DECREMENT");
      setIsOperationSelectDisabled(true);
      setIsWalletSelectDisabled(true);
    } else {
      setIsOperationSelectDisabled(false);
      setIsWalletSelectDisabled(false);
    }
  }, [
    transactionSource,
    wallets,
    isWalletSelectDisabled,
    tomanWallet,
    goldWallet,
  ]);

  const onFormSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = Object.fromEntries(
      formData.entries()
    );

    payload.walletId = parseInt(currentWallet);
    payload.wallet = wallets.find(
      (wallet) => wallet.id.toString() === currentWallet
    );
    payload.transactionType = simpleTransactionOperation;
    if (payload.transactionIdentifier)
      payload.meta = { transactionIdentifier: payload.transactionIdentifier };

    console.log(payload);
    const result = SimpleTransactionPayloadSchema.safeParse(payload);
    if (result.success) return onSubmit(result.data);

    setErrorMessages(
      result.error.errors.map((zodError) => ({
        id: `${zodError.path}-${zodError.code}`,
        message: zodError.message,
      }))
    );
  };
  return (
    <form onSubmit={onFormSubmitHandler}>
      <div className="w-full lg:max-w-1/6">
        <label>نوع عملیات تراکنش</label>
        <Select
          name="transactionType"
          isRtl={true}
          value={simpleTransactionOperationOptions.find(
            (item) => item.value === simpleTransactionOperation
          )}
          onChange={(e) => {
            if (e) setSimpleTransactionOperation(e.value);
          }}
          isDisabled={isOperationSelectDisabled}
          options={simpleTransactionOperationOptions}
          isClearable={false}
        />
      </div>
      <div className="flex lg:flex-row flex-col gap-x-4 w-full">
        <div className="w-full lg:w-2/5">
          <label>کیف پول</label>
          <Select
            name="walletId"
            isDisabled={isWalletSelectDisabled}
            isClearable={false}
            isRtl
            options={walletSelectOptions}
            value={walletSelectOptions.find(
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
            name="operationType"
            options={simpleTransactionType}
            isClearable={false}
            isRtl
            value={simpleTransactionType.find(
              (item) => item.value.toString() === transactionSource
            )}
            onChange={(e) => {
              if (e) {
                setTransactionSource(e.value);
              }

              if (errorMessages.length !== 0) setErrorMessages([]);
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
          step={"0.001"}
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
