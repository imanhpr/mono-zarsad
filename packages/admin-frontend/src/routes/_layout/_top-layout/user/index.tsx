import { createFileRoute } from "@tanstack/react-router";
import MainAreaContainer from "../../../../components/MainAreaContainer";
import { BsPlusCircle } from "react-icons/bs";
import Modal from "../../../../components/Modal";
import { useCallback, useContext, useState } from "react";
import { modalCtx } from "../../../../context/ctx";
import {
  CreateNewUserRequestPayloadSchema,
  ICreateNewUserRequestPayloadSchema,
} from "../../../../schema/User.schema";
import { ZodError, ZodIssue } from "zod";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { useAppDispatch } from "../../../../hooks/redux-hooks";
import { notificationSliceAction } from "../../../../store/notification.slice";

type ServerErrorMessage = { code: string; path: string; message: string };
type ErrorMessages = ZodIssue | ServerErrorMessage;

export const Route = createFileRoute("/_layout/_top-layout/user/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { adminApi } = Route.useRouteContext();
  const modalContext = useContext(modalCtx);
  const [formErrorMessage, setFormErrorMessage] = useState<ErrorMessages[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const dispatch = useAppDispatch();

  const formSubmitHandler = useCallback(
    async (payload: ICreateNewUserRequestPayloadSchema) => {
      setStatus("loading");
      const data = await adminApi.createNewUser(payload);

      if (data.status === "failed") {
        setFormErrorMessage([
          {
            code: "ServerError",
            path: "CREATE_USER",
            message: data.message,
          },
        ]);
      } else {
        const fullName = data.data.firstName + " " + data.data.lastName;
        dispatch(
          notificationSliceAction.addNotification({
            id: data.data.id.toString(),
            message: `کاربر جدید "${fullName}" با موفقیت ایجاد شد.`,
            status: "success",
            duration: 8,
          })
        );
        modalContext.setDisplay(false);
      }

      setStatus("success");
    },
    [adminApi, modalContext, dispatch]
  );

  return (
    <MainAreaContainer className="gap-y-3 font-normal text-base">
      {modalContext.display && (
        <Modal className="space-y-4 mx-4 lg:mx-0 lg:w-100">
          <header className="">
            <h2 className="font-semibold text-lg">ایجاد کاربر جدید</h2>
            <span className="text-gray-500 text-sm">
              بعد از وارد کردن مشخصات کاربر دکمه ذخیره سازی را بزنید.
            </span>
          </header>

          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const payload = Object.fromEntries(fd.entries());
                let userPayload: ICreateNewUserRequestPayloadSchema;
                try {
                  userPayload =
                    CreateNewUserRequestPayloadSchema.parse(payload);
                } catch (err) {
                  if (err instanceof ZodError) {
                    setFormErrorMessage(err.errors);
                    return;
                  }
                  return;
                }
                setFormErrorMessage([]);
                formSubmitHandler(userPayload);
              }}
            >
              <div className="flex flex-col">
                <label>نام</label>
                <input
                  className="px-3 py-2 border border-gray-300 rounded"
                  type="text"
                  name="firstName"
                />
              </div>
              <div className="flex flex-col">
                <label>نام خانوادگی</label>
                <input
                  className="px-3 py-2 border border-gray-300 rounded"
                  type="text"
                  name="lastName"
                />
              </div>

              <div className="flex flex-col">
                <label>کد ملی</label>
                <input
                  className="px-3 py-2 border border-gray-300 rounded fa-numeric-mono"
                  type="text"
                  name="nationalCode"
                  dir="ltr"
                />
              </div>

              <div className="flex flex-col">
                <label>شماره موبایل</label>
                <input
                  className="px-3 py-2 border border-gray-300 rounded fa-numeric-mono"
                  type="text"
                  name="phoneNumber"
                  dir="ltr"
                  defaultValue={"09"}
                />
              </div>
              {formErrorMessage.length !== 0 && (
                <ul className="mt-2 px-8 text-red-400 list-disc">
                  {formErrorMessage.map((item) => {
                    return (
                      <li key={`${item.code}-${item.path}`}>{item.message}</li>
                    );
                  })}
                </ul>
              )}
              <div className="space-x-1 mt-4">
                {status === "loading" ? (
                  <button
                    disabled
                    className="bg-amber-500 hover:bg-amber-400 px-3 py-2 rounded-lg min-w-32 text-white transition-colors cursor-pointer"
                  >
                    <LoadingSpinner className="w-6 h-6" />
                  </button>
                ) : (
                  <button className="bg-amber-500 hover:bg-amber-400 px-3 py-2 rounded-lg min-w-32 text-white transition-colors cursor-pointer">
                    ذخیره سازی
                  </button>
                )}
                <button
                  onClick={() => modalContext.setDisplay(false)}
                  className="px-3 py-2 border border-gray-300 rounded-lg cursor-pointer"
                >
                  بستن
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
      <header>
        <h2 className="font-extrabold text-4xl dot-1">مدیریت کاربران</h2>
      </header>
      <div>
        <button
          onClick={() => {
            modalContext.toggleDisplay();
          }}
          className="flex justify-around items-center bg-amber-500 py-2 rounded min-w-44 font-medium text-white cursor-pointer"
        >
          <span className="">ایجاد کاربر جدید </span>
          <BsPlusCircle style={{ strokeWidth: "0.5px" }} size={16} />
        </button>
      </div>
      <div className="border border-gray-300 rounded">
        <table>
          <thead>
            <tr className="">
              <th className="px-4 py-4 font-normal text-gray-700">کاربر</th>
              <th className="px-4 py-4 font-normal text-gray-700">وضعیت</th>
              <th className="px-4 py-4 font-normal text-gray-700">
                شماره موبایل
              </th>
              <th className="px-4 py-4 font-normal text-gray-700">کد ملی</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </MainAreaContainer>
  );
}
