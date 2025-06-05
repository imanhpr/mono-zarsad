import { IWalletSchema } from "../../schema/User.schema";
import { TransactionTypes } from "../../types/transaction.interfaces";
import SimpleTransactionForm from "./forms/SimpleTransactionForm";

function SubTransactionFormFactory({
  transactionType,
  walletList,
  onSubmit,
}: {
  transactionType?: TransactionTypes;
  walletList: IWalletSchema[];
  onSubmit: (payload: Record<string, unknown>) => void;
}) {
  switch (transactionType) {
    case "SIMPLE_TRANSACTION":
      return <SimpleTransactionForm onSubmit={onSubmit} wallets={walletList} />;

    case "EXCHANGE_TRANSACTION":
      return <div>exchange transaction form todo</div>;

    case "WALLET_TO_WALLET_TRANSACTION":
      return <div>wallet to wallet transaction form</div>;
  }
  return <div>no no no!</div>;
}
export default SubTransactionFormFactory;
