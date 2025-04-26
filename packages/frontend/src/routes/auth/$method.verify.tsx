import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import BaseAuthPage from "../../components/Base-Auth";
import { useRef } from "react";
import { store } from "../../store";
import { verifyLoginRequest } from "../../store/auth.slice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import DuolingoInput from "../../components/DuolingoInput";
import DuolingoButton from "../../components/DuolingoButton";

export const Route = createFileRoute("/auth/$method/verify")({
  component: RouteComponent,
  beforeLoad(ctx) {
    if (!["register", "login"].some((v) => v === ctx.params.method)) {
      throw notFound();
    }
    const st = store.getState();
    if (st.auth.accessToken || st.phoneNumber.value === undefined) {
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
        <DuolingoInput
          placeholder="-- -- -- -- --"
          ref={codeRef}
          type="number"
          label="کد فعال سازی"
          className="text-center fa-numeric-mono"
          btnDir="ltr"
          containerDir="rtl"
        />

        <span dir="rtl" className="text-gray-500 text-xs">
          لطفا رمز یکبار مصرف پیامک شده به{" "}
          <span dir="ltr" className="font-bold">
            {phoneNumber}
          </span>{" "}
          را وارد کنید.
        </span>
        <DuolingoButton>ورود به حساب کاربری</DuolingoButton>
      </form>
    </BaseAuthPage>
  );
}
