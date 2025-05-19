import React, { useCallback, useContext, useState } from "react";
import {
  CreateNewUserRequestPayloadSchema,
  ICreateNewUserRequestPayloadSchema,
} from "../schema/User.schema";
import Modal from "./Modal";
import { ZodError, ZodIssue } from "zod";
import { notificationSliceAction } from "../store/notification.slice";
import { useAppDispatch } from "../hooks/redux-hooks";
import { modalCtx } from "../context/ctx";
import LoadingSpinner from "./LoadingSpinner";
import { User } from "../types";

type ServerErrorMessage = { code: string; path: string; message: string };
type ErrorMessages = ZodIssue | ServerErrorMessage;
type props = {
  adminApi: import("../api/index").AdminZarApi;
  onNewData: (data: User) => void;
};

function UserCreateFormModal({ adminApi, onNewData }: props) {
  const [formErrorMessage, setFormErrorMessage] = useState<ErrorMessages[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const dispatch = useAppDispatch();
  const modalContext = useContext(modalCtx);

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
      return data;
    },
    [adminApi, modalContext, dispatch]
  );
  return (
    <Modal className="space-y-4 mx-4 lg:mx-0 lg:w-100">
      <header className="">
        <h2 className="font-semibold text-lg">ایجاد کاربر جدید</h2>
        <span className="text-gray-500 text-sm">
          بعد از وارد کردن مشخصات کاربر دکمه ذخیره سازی را بزنید.
        </span>
      </header>

      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const payload = Object.fromEntries(fd.entries());
            let userPayload: ICreateNewUserRequestPayloadSchema;
            try {
              userPayload = CreateNewUserRequestPayloadSchema.parse(payload);
            } catch (err) {
              if (err instanceof ZodError) {
                setFormErrorMessage(err.errors);
                return;
              }
              return;
            }
            setFormErrorMessage([]);
            const result = await formSubmitHandler(userPayload);
            if (result.status === "success") {
              const newUser: User = {
                firstName: result.data.firstName,
                id: result.data.id,
                createdAt: new Date().toString(),
                lastName: result.data.lastName,
                nationalCode: result.data.nationalCode,
                phoneNumber: result.data.phoneNumber,
                profile: {
                  id: -1,
                  debtPrem: false,
                },
              };
              onNewData(newUser);
            }
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
  );
}

export default React.memo(UserCreateFormModal);
