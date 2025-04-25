import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import BaseAuthPage from "../../components/Base-Auth";
import { useRef } from "react";
import { phoneNumberSliceActions } from "../../store/verify-phone-number.slice";
import { motion } from "motion/react";
import { store } from "../../store";
import { useAppDispatch } from "../../hooks/redux-hooks";

export const Route = createFileRoute("/auth/register/")({
  component: RouteComponent,
  beforeLoad() {
    const reduxStore = store.getState();

    if (reduxStore.auth.accessToken) {
      throw redirect({ to: "/", replace: true });
    }
  },
});

function RouteComponent() {
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const { zarAPI } = Route.useRouteContext();
  function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    if (formRef.current == null) throw new Error("Shit form");
    const formData = new FormData(formRef.current);
    const payload = Object.fromEntries(formData.entries());
    payload.phoneNumber = "+" + payload.phoneNumber;
    dispatch(phoneNumberSliceActions.insert(payload.phoneNumber));
    zarAPI.register(payload as any).then(() => {
      navigator({
        to: "/auth/$method/verify",
        params: { method: "register" },
      });
    });
  }
  return (
    <BaseAuthPage title="ثبت نام کاربر جدید">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
      >
        <form
          ref={formRef}
          onSubmit={submitHandler}
          className="flex flex-col space-y-4"
        >
          <div className="flex flex-col space-y-2">
            <label htmlFor="" className="text-right">
              موبایل
            </label>
            <input
              type="number"
              name="phoneNumber"
              className="py-1 border border-yellow-400 rounded-md focus:outline-none text-xl text-center"
              placeholder="0902"
            />
          </div>
          {[
            { label: "نام", name: "firstName" },
            { label: "نام خانوادگی", name: "lastName" },
            { label: "کد ملی", name: "nationalCode" },
          ].map((e) => (
            <div key={e.label} className="flex flex-col space-y-2">
              <label htmlFor="" className="text-right">
                {e.label}
              </label>
              <input
                type="text"
                name={e.name}
                className="py-1 border border-yellow-400 rounded-md focus:outline-none text-xl text-center"
              />
            </div>
          ))}
          <span dir="rtl" className="text-gray-500 text-xs">
            لطفا رمز یکبار مصرف پیامک شده به موبایل خود را وارد کنید.
          </span>
          <div className="flex">
            <button
              className="bg-yellow-400 hover:bg-yellow-500 px-4 py-1 border rounded-md w-full text-md duration-150 cursor-pointer"
              type="submit"
            >
              ثبت نام
            </button>
          </div>
        </form>
      </motion.div>
    </BaseAuthPage>
  );
}
