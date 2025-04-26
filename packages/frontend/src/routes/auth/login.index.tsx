import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import BaseAuthPage from "../../components/Base-Auth";
import { useRef, useState } from "react";
import { phoneNumberSliceActions } from "../../store/verify-phone-number.slice";
import { motion } from "motion/react";
import { store } from "../../store";
import { useAppDispatch } from "../../hooks/redux-hooks";
import DuolingoButton from "../../components/DuolingoButton";
import DuolingoInput from "../../components/DuolingoInput";
import { LoginRequestPayloadSchema } from "../../schema/LoginResponse.schema";

export const Route = createFileRoute("/auth/login/")({
  component: LoginPage,
  beforeLoad() {
    const st = store.getState();
    if (st.auth.accessToken) {
      throw redirect({ to: "/", replace: true });
    }
  },
});
function LoginPage() {
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const [errMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const phoneNumber = useRef<HTMLInputElement>(null);
  const { zarAPI } = Route.useRouteContext();

  function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    if (phoneNumber === null) throw Error("Something bad happened");
    const rawPhoneNumberValue = phoneNumber.current?.value;
    const parseResult = LoginRequestPayloadSchema.safeParse({
      phoneNumber: rawPhoneNumberValue,
    });

    if (!parseResult.success) {
      setErrorMessage(parseResult.error.errors.map((e) => e.message)[0]);
      return;
    }
    setErrorMessage(undefined);
    zarAPI.login(parseResult.data.phoneNumber).then((result) => {
      if (result && result.status === "failed") {
        setErrorMessage(result.message);
        return;
      }
      dispatch(phoneNumberSliceActions.insert(parseResult.data.phoneNumber));
      navigator({
        from: Route.fullPath,
        to: "/auth/$method/verify",
        params: { method: "login" },
      });
    });
  }

  return (
    <BaseAuthPage title="ورود به سامانه">
      <motion.form
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        onSubmit={submitHandler}
        className="flex flex-col space-y-4"
      >
        <DuolingoInput
          label="موبایل"
          placeholder="شماره موبایل"
          disabled={false}
          className="placeholder-shown:text-right fa-numeric-mono"
          btnDir="ltr"
          containerDir="rtl"
          ref={phoneNumber}
          error={errMessage}
        />
        <DuolingoButton>ارسال پیامک</DuolingoButton>
        <div className="flex md:flex-row-reverse flex-col justify-between items-center mt-6">
          <p>هنوز ثبت‌نام نکرده‌اید؟</p>
          <Link to="/auth/register" className="font-bold text-yellow-600">
            ساخت حساب کاربری
          </Link>
        </div>
      </motion.form>
    </BaseAuthPage>
  );
}
