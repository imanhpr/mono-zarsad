import { createFileRoute } from "@tanstack/react-router";
import MainAreaContainer from "../../../../components/MainAreaContainer";
import { BsPersonAdd } from "react-icons/bs";
import { useCallback, useContext, useEffect, useState } from "react";

import { modalCtx } from "../../../../context/ctx";
import UserCreateFormModal from "../../../../components/UserCreateFormModal";
import MainUserList from "../../../../components/MainUserList";
import { User } from "../../../../types";

export const Route = createFileRoute("/_layout/_top-layout/user/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { adminApi } = Route.useRouteContext();
  const modalContext = useContext(modalCtx);
  const [tableData, setTableData] = useState<User[]>([]);

  useEffect(() => {
    adminApi
      .getUserList({ orderBy: "DESC", limit: 8, profile: true })
      .then((result) => setTableData(result.users));
  }, [adminApi]);

  const onNewData = useCallback(
    (data: User) => {
      setTableData((prev) => {
        const clone = structuredClone(prev);
        clone.unshift(data);
        return clone;
      });
    },
    [setTableData]
  );

  return (
    <MainAreaContainer className="gap-y-3 font-normal text-base">
      {modalContext.display && (
        <UserCreateFormModal adminApi={adminApi} onNewData={onNewData} />
      )}
      <header>
        <h2 className="font-extrabold text-4xl dot-1">مدیریت کاربران</h2>
      </header>
      <div>
        <button
          onClick={modalContext.toggleDisplay}
          className="flex justify-around items-center bg-amber-500 py-2 rounded min-w-44 font-medium text-white cursor-pointer"
        >
          <span className="">ایجاد کاربر جدید</span>
          <BsPersonAdd size={22} />
        </button>
      </div>
      <div className="border border-gray-300 rounded">
        <MainUserList tableData={tableData} />
      </div>
    </MainAreaContainer>
  );
}
