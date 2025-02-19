import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import BaseAuthPage from "../../components/Base-Auth";
import { useRef, useState } from "react";
import { phoneNumberSliceActions } from "../../store/verify-phone-number.slice";
import { useDispatch } from "react-redux";
import Captcha from "../../components/Captcha";

export const Route = createFileRoute("/auth/login/")({
  component: LoginPage,
  beforeLoad(ctx) {
    if (ctx.context.auth?.accessToken) {
      throw redirect({ to: "/", replace: true });
    }
  },
});
function LoginPage() {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const phoneNumber = useRef<HTMLInputElement>(null);
  const { zarAPI } = Route.useRouteContext();

  const [showError, setShowError] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    if (!captchaToken) return setShowError(true);
    const validPhoneNumber = `+${phoneNumber.current?.value}`;
    const response = zarAPI.login(validPhoneNumber, captchaToken);
    response.then(() => {
      dispatch(phoneNumberSliceActions.insert(validPhoneNumber));
      navigator({
        from: Route.fullPath,
        to: "/auth/$method/verify",
        params: { method: "login" },
        replace: true,
      });
    });
  }
  return (
    <BaseAuthPage title="ورود به سامانه">
      <form onSubmit={submitHandler} className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="" className="text-right">
            موبایل
          </label>
          <input
            ref={phoneNumber}
            type="number"
            className="py-1 border border-yellow-400 rounded-md focus:outline-none text-xl text-center"
            placeholder="0902"
            defaultValue="98"
          />
        </div>
        <div dir="rtl" className="flex flex-col justify-center items-center">
          <Captcha onSubmit={setCaptchaToken} />
          {showError && (
            <p className="text-red-500">لطفا کپچا را به درستی انجام دهید.</p>
          )}
        </div>
        <div className="flex">
          <button
            className="bg-yellow-400 hover:bg-yellow-500 px-4 py-1 border rounded-md w-full text-md duration-150 cursor-pointer"
            type="submit"
          >
            ارسال پیامک
          </button>
        </div>
        <div className="flex md:flex-row-reverse flex-col justify-between items-center mt-6">
          <p>هنوز ثبت‌نام نکرده‌اید؟</p>
          <Link to="/auth/register" className="font-bold text-yellow-600">
            ساخت حساب کاربری
          </Link>
        </div>
      </form>
    </BaseAuthPage>
  );
}
