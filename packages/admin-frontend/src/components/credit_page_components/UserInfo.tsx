import React from "react";
import BaseCard from "../BaseContainer";
import { IUserWithWallet } from "../../schema/User.schema";
import Badge from "../Badge";

type props = {
  user: Pick<IUserWithWallet, "data">["data"]["users"][0];
};

const intlNumber = new Intl.NumberFormat("fa-IR");

function UserInfo({ user }: props) {
  const fullName = `${user.firstName} ${user.lastName}`;
  return (
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
                    {intlNumber.format(wallet.lockAmount as unknown as number)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </BaseCard>
    </div>
  );
}

export default React.memo(UserInfo);
