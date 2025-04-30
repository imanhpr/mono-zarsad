import { createFileRoute, redirect } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { BsFillPersonFill, BsLockFill } from "react-icons/bs";
import { Fragment } from "react/jsx-runtime";
import { LoginFormSchema } from "../../schema/Login.schema";
import { useAppDispatch } from "../../hooks/redux-hooks";
import { adminLoginThunk } from "../../store/auth.slice";
import { store } from "../../store";

export const Route = createFileRoute("/auth/login/")({
  component: RouteComponent,
  beforeLoad() {
    const authState = store.getState().auth;
    if (authState.accessToken) throw redirect({ to: "/" });
  },
});

function RouteComponent() {
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement>(null);
  const [pageError, setPageError] = useState<string>();
  const navigate = Route.useNavigate();

  function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) {
      setPageError("خطایی غیر منتظره رخ داده است. با مدیر سیستم تماس بگیرید.");
      return;
    }
    const formData = new FormData(formRef.current);
    const rawFormData = Object.fromEntries(formData.entries());
    const result = LoginFormSchema.safeParse(rawFormData);
    if (!result.success)
      return setPageError("لطفا فرم ورود را به صورت صحیح وارد کنید");

    dispatch(adminLoginThunk(result.data)).then((result) => {
      if (result.meta.requestStatus === "fulfilled")
        navigate({ to: "/", replace: true });
    });
  }

  return (
    <Fragment>
      <div className="flex flex-col justify-center items-center bg-gray-50 min-h-screen">
        <div className="flex flex-col bg-white shadow-lg p-4 rounded-xl md:min-w-88">
          <h2 className="font-black text-lg text-center">پنل مدیریت</h2>
          <span className="text-gray-400 text-sm text-center">
            لطفا مشخصات ورود اکانت خود را وارد کنید
          </span>
          {pageError && (
            <p dir="rtl" className="my-3 text-red-400">
              {pageError}
            </p>
          )}

          <form
            ref={formRef}
            onSubmit={submitHandler}
            className="flex flex-col gap-y-3 text-lg"
          >
            <div className="flex flex-col gap-y-1">
              <label dir="rtl" className="font-semibold text-sm">
                نام کاربری
              </label>
              <div className="relative w-full">
                <BsFillPersonFill className="top-2 absolute w-5 h-5 text-muted-foreground end-3" />
                <input
                  type="text"
                  name="username"
                  placeholder="Admin"
                  className="bg-gray-50 focus:bg-white px-3 py-1 border-1 border-gray-200 rounded w-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-1">
              <label dir="rtl" className="font-semibold text-sm">
                رمز عبور
              </label>
              <div className="relative">
                <BsLockFill className="top-2 absolute w-5 h-5 text-muted-foreground end-3" />
                <input
                  type="password"
                  name="password"
                  className="bg-gray-50 focus:bg-white px-3 py-1 border-1 border-gray-200 rounded w-full"
                />
              </div>
            </div>
            <div className="">
              <button className="bg-amber-300 hover:bg-amber-400 px-2 py-1 rounded w-full text-sm text-base transition-colors cursor-pointer">
                ورود به حساب کاربری
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
