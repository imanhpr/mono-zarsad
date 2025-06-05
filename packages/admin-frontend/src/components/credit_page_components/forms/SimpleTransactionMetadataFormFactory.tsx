export default function SimpleTransactionMetadataFormFactory(props: {
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
  return <></>;
}
