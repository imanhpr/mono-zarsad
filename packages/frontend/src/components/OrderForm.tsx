// @ts-nocheck
import { useRouteContext } from "@tanstack/react-router";
import clsx from "clsx";
import { Fragment, useCallback, useState } from "react";
import { Decimal } from "decimal.js";
import num2persian from "num2persian";
import { LuArrowDown } from "react-icons/lu";
const GOLD_CONST = "4.331802";

function walletpayload(
  state: "buy" | "sell",
  buyWallet: any,
  sellWallet: any
): Readonly<{ sourceId: number; targetId: number }> {
  if (state === "buy")
    return Object.freeze({
      sourceId: buyWallet.id,
      targetId: sellWallet.id,
    });

  return Object.freeze({ sourceId: sellWallet.id, targetId: buyWallet.id });
}

export default function OrderForm({
  goldPrice,
  sellToWallet,
  buyFromWallet,
}: {
  goldPrice: string;
  sellToWallet: any;
  buyFromWallet: any;
}) {
  const zarApi = useRouteContext({ from: "/_layout", select: (t) => t.zarAPI });
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [payload, setPayload] = useState({ goldAmount: "0", tomanAmount: "0" });
  const walletPayload = walletpayload(orderType, buyFromWallet, sellToWallet);

  const requestPayload = Object.freeze({
    wallets: walletPayload,
    orderType,
    ...payload,
  });

  const onSumbitHandler = useCallback(
    async function onSumbitHandler(reqPayload) {
      await zarApi.buyRequest(reqPayload);
    },
    [zarApi]
  );

  const sellActiveOrderCls = {
    "bg-amber-400": orderType === "buy",
    "bg-amber-100": orderType !== "buy",
  };
  const buyActiveOrderCls = {
    "bg-amber-400": orderType === "sell",
    "bg-amber-100": orderType !== "sell",
  };
  const sellClassNames = clsx(
    "py-2 rounded md:w-24 lg:w-64 hover:cursor-pointer",
    sellActiveOrderCls
  );
  const buyClassNames = clsx(
    "py-2 rounded md:w-24 lg:w-64 hover:cursor-pointer",
    buyActiveOrderCls
  );

  const inputCls =
    "text-2xl bg-gray-100 focus:bg-white p-2 border border-gray-400 rounded-lg focus:outline-none w-full text-center fa-numeric";

  return (
    <Fragment>
      <div className="flex md:flex-row flex-col justify-around mb-10 w-3/4">
        <button onClick={() => setOrderType("buy")} className={sellClassNames}>
          خرید
        </button>
        <button onClick={() => setOrderType("sell")} className={buyClassNames}>
          فروش
        </button>
      </div>
      <div
        className={clsx("flex flex-col items-center w-full", {
          "flex-col-reverse": orderType === "sell",
        })}
      >
        <div className="w-3/4">
          <label className="text-xl">تومانء</label>
          <input
            dir="ltr"
            onChange={(e) => {
              if (e.target.value === "")
                return setPayload({
                  goldAmount: "0",
                  tomanAmount: "0",
                });
              const calcGoldAmount = new Decimal(e.target.value)
                .div(new Decimal(goldPrice).div(GOLD_CONST))
                .toFixed(3, 3)
                .toString();
              console.log(
                new Decimal(e.target.value)
                  .div(new Decimal(goldPrice).div(GOLD_CONST))
                  .toString()
              );
              setPayload({
                goldAmount: calcGoldAmount,
                tomanAmount: e.target.value,
              });
            }}
            value={payload.tomanAmount !== "0" ? payload.tomanAmount : ""}
            type="text"
            name="toman"
            className={inputCls}
          />

          {payload.tomanAmount !== "0" && (
            <span>{num2persian(payload.tomanAmount)} تومانء</span>
          )}
        </div>
        <div className="bg-amber-400 my-2 p-2 rounded-full">
          <LuArrowDown size={32} />
        </div>
        <div className="w-3/4">
          <label className="text-xl">طلا</label>
          <input
            dir="ltr"
            onChange={(e) => {
              if (e.target.value === "")
                return setPayload({
                  goldAmount: "0",
                  tomanAmount: "0",
                });
              const calcTomanAmount = new Decimal(e.target.value)
                .mul(new Decimal(goldPrice).div(GOLD_CONST))
                .ceil()
                .toString();
              setPayload({
                goldAmount: e.target.value,
                tomanAmount: calcTomanAmount,
              });
            }}
            value={payload.goldAmount}
            type="text"
            name="gold"
            className={inputCls}
          />
          {!new Decimal(payload.goldAmount).eq(0) && (
            <span>{goldAmountText(payload.goldAmount)}</span>
          )}
        </div>
      </div>
      <button
        onClick={() => onSumbitHandler(requestPayload)}
        className="bg-blue-100 mt-8 py-1 rounded w-48 hover:cursor-pointer"
      >
        ثبت
      </button>
    </Fragment>
  );
}
function goldAmountText(amount: string) {
  const d = new Decimal(amount).toFixed(3, 3).toString();
  const [gram, soot] = d.split(".");
  const sentence: string[] = [];

  if (gram && Number.parseFloat(gram) !== 0) {
    const text = `${num2persian(gram)} گرم`;
    sentence.push(text);
  }

  if (soot && Number.parseFloat(soot) !== 0) {
    const sootText = num2persian(soot) + " " + "سوت";
    sentence.push(sootText);
  }
  return sentence.join(" و ");
}
