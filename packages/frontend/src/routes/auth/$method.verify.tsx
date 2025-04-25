import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import BaseAuthPage from "../../components/Base-Auth";
import { useRef } from "react";
import { store } from "../../store";
import { verifyLoginRequest } from "../../store/auth.slice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";

export const Route = createFileRoute("/auth/$method/verify")({
  component: RouteComponent,
  beforeLoad(ctx) {
    if (!["register", "login"].some((v) => v === ctx.params.method)) {
      throw notFound();
    }
    const st = store.getState();
    if (st.auth.accessToken) {
      throw redirect({ to: "/", replace: true });
    }
  },
});

function RouteComponent() {
  const dispatch = useAppDispatch();
  const navigation = Route.useNavigate();
  const params = Route.useParams();
  const phoneNumber = useAppSelector((state) => state.phoneNumber.value);
  const codeRef = useRef<HTMLInputElement>(null);

  let title = "ورود به سامانه";

  if (params.method === "register") title = "فعال سازی حساب کاربری";

  function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    if (!codeRef.current) throw new Error("CodeRef NotFound");
    if (!phoneNumber) throw new Error("Phone Number not found");
    const code = codeRef.current.value;
    dispatch(verifyLoginRequest({ code, phoneNumber })).then(() => {
      navigation({ from: Route.fullPath, to: "/" });
    });
  }

  return (
    <BaseAuthPage title={title}>
      <form onSubmit={submitHandler} className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="" className="text-right">
            کد فعال سازی
          </label>
          <input
            ref={codeRef}
            type="number"
            className="py-1 border border-yellow-400 rounded-md focus:outline-none text-xl text-center"
            placeholder="- - - - -"
          />
        </div>
        <span dir="rtl" className="text-gray-500 text-xs">
          لطفا رمز یکبار مصرف پیامک شده به{" "}
          <span dir="ltr" className="font-bold">
            {phoneNumber}
          </span>{" "}
          را وارد کنید.
        </span>
        <div className="flex">
          <button
            className="bg-yellow-400 hover:bg-yellow-500 px-4 py-1 border rounded-md w-full text-md duration-150 cursor-pointer"
            type="submit"
          >
            ورود به حساب کاربری
          </button>
        </div>
      </form>
    </BaseAuthPage>
  );
}
