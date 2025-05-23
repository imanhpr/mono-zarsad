import { createFileRoute } from "@tanstack/react-router";
import MainAreaContainer from "../../../../components/MainAreaContainer";
import { BsPersonAdd } from "react-icons/bs";
import { useCallback, useContext, useEffect, useState } from "react";

import { modalCtx } from "../../../../context/ctx";
import UserCreateFormModal from "../../../../components/UserCreateFormModal";
import MainUserList from "../../../../components/MainUserList";
import { User } from "../../../../types";
import { Pagination } from "../../../../helpers/pagination";
import { clsx } from "clsx";

export const Route = createFileRoute("/_layout/_top-layout/user/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { adminApi } = Route.useRouteContext();
  const modalContext = useContext(modalCtx);
  const [tableData, setTableData] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [pageState, setPageState] = useState<
    "idle" | "success" | "loading" | "pageChange"
  >("idle");

  useEffect(() => {
    if (pageState === "loading" || pageState === "success") return;
    const payload: Parameters<typeof adminApi.getUserList>[0] = {
      orderBy: "DESC",
      limit: 8,
      profile: true,
    };
    if (pagination) {
      payload.offset = pagination.currentOffset;
    }

    adminApi.getUserList(payload).then((result) => {
      const pagination = new Pagination(
        result.count,
        result.offset,
        result.limit,
        3
      );

      setTableData(result.users);
      setPagination(pagination);
      setPageState("success");
    });
  }, [adminApi, pagination, pageState]);

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
      <div className="flex gap-x-2" dir="ltr">
        {pagination?.hasPreviousPage && (
          <button
            onClick={() => {
              pagination.previousPage();
              setPagination(pagination.clone());
              setPageState("pageChange");
            }}
            className="px-2 py-1 border border-gray-300 rounded-md min-w-8 cursor-pointer"
          >
            قبل
          </button>
        )}
        {pagination?.renderNextPages().map((item) => {
          const key = crypto.randomUUID() + "-" + item;
          if (item === "...")
            return (
              <button
                key={key}
                className="bg-gray-200 py-1 border rounded-md min-w-8 text-gray-400 fa-numeric"
                disabled
              >
                ...
              </button>
            );
          const isActive = item === pagination.currentPage.toString();
          const style = clsx(
            "py-1 rounded-md min-w-8 cursor-pointer fa-numeric",
            {
              "bg-amber-300": isActive,
              "border-gray-300 border": !isActive,
            }
          );
          return (
            <button
              className={style}
              key={key}
              onClick={() => {
                pagination.setPage(parseInt(item));
                setPagination(pagination.clone());
                setPageState("pageChange");
              }}
            >
              {item}
            </button>
          );
        })}
        {pagination?.hasNextPage && (
          <button
            onClick={() => {
              pagination.nextPage();
              setPagination(pagination.clone());
              setPageState("pageChange");
            }}
            className="px-2 py-1 border border-gray-300 rounded-md min-w-8 cursor-pointer"
          >
            بعد
          </button>
        )}
      </div>
    </MainAreaContainer>
  );
}
