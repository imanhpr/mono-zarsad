import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import BaseAuthPage from "../../components/Base-Auth";
import { useRef } from "react";

export const Route = createFileRoute("/auth/register/")({
  component: RouteComponent,
  beforeLoad(ctx) {
    if (ctx.context.auth?.accessToken) {
      throw redirect({ to: "/", replace: true });
    }
  },
});

function RouteComponent() {
  const navigator = useNavigate();
  const formRef = useRef(null);
  function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    navigator({
      to: "/auth/$method/verify",
      params: { method: "register" },
    });
  }
  return (
    <BaseAuthPage title="ثبت نام کاربر جدید">
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
            className="py-1 border border-yellow-400 rounded-md focus:outline-none text-xl text-center"
            placeholder="0902"
          />
        </div>
        {["نام", "نام خانوادگی", "کد ملی"].map((name) => (
          <div key={name} className="flex flex-col space-y-2">
            <label htmlFor="" className="text-right">
              {name}
            </label>
            <input
              type="text"
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
    </BaseAuthPage>
  );
}
