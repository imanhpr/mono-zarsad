import BaseCard from "../BaseContainer";
import Select from "react-select";
import SubTransactionFormFactory from "./SubTransactionFormFactory";
import { useState } from "react";
import { IUserWithWallet } from "../../schema/User.schema";
import { TransactionTypes } from "../../types/transaction.interfaces";

const transactionTypeOptions = [
  {
    value: "SIMPLE_TRANSACTION",
    label: "تراکنش ساده",
  } as const,
  {
    value: "EXCHANGE_TRANSACTION",
    label: "تراکنش تبدیل",
  } as const,
  {
    value: "WALLET_TO_WALLET_TRANSACTION",
    label: "کیف به کیف",
  } as const,
];

const defaultTransactionType = transactionTypeOptions[0];

type props = {
  user: IUserWithWallet["data"]["users"][0];
  onFormSubmit: (payload: Record<string, unknown>) => void;
  onTypeChange: (type: TransactionTypes) => void;
};

export default function TransactionForm({
  user,
  onFormSubmit,
  onTypeChange,
}: props) {
  const [transactionType, setTransactionType] = useState<TransactionTypes>(
    defaultTransactionType.value
  );
  return (
    <BaseCard className="space-y-4 p-4">
      <header>
        <h2 className="font-bold text-xl">ایجاد تراکنش جدید</h2>
      </header>
      <div className="flex flex-col gap-y-2">
        <div className="flex lg:flex-row flex-col gap-x-0 gap-y-4 lg:gap-x-4 lg:gap-y-0">
          <Select
            isRtl={true}
            options={transactionTypeOptions}
            value={
              transactionTypeOptions.find(
                (item) => item.value === transactionType
              )!
            }
            onChange={(e) => {
              if (e) {
                setTransactionType(e.value);
                onTypeChange(e.value);
              }
            }}
            isClearable={false}
            className="w-full lg:max-w-1/6"
          />
        </div>
        <div className="space-y-4">
          <SubTransactionFormFactory
            transactionType={transactionType}
            walletList={user.wallets}
            onSubmit={onFormSubmit}
          />
        </div>
      </div>
    </BaseCard>
  );
}
