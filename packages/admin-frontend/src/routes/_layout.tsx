import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  BsHouseFill,
  BsPersonFill,
  BsPiggyBankFill,
  BsGearFill,
  BsFileEarmarkSpreadsheetFill,
} from "react-icons/bs";
import { useAppSelector } from "../hooks/redux-hooks";
export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const nav = Route.useNavigate();
  if (!accessToken) {
    return nav({ to: "/auth/login", replace: true });
  }
  return (
    <div className="flex flex-row min-h-screen">
      <Outlet />
      <aside className="top-0 sticky border-l border-l-gray-300 w-2/10 h-screen">
        <div dir="rtl" className="flex flex-col h-full">
          <header className="px-3 py-6 border-b border-b-gray-300 h-22">
            <h2 className="font-bold text-3xl text-center dot-1">پنل مدیریت</h2>
          </header>
          <nav className="flex-1">
            <ul className="space-y-2 my-2 px-4 *:transition-all *:cursor-pointer">
              <Link
                activeProps={{
                  className:
                    "block bg-amber-500 rounded-lg text-white fill-amber-100",
                }}
                inactiveProps={{
                  className:
                    "block hover:bg-amber-100 rounded-lg font-semibold text-gray-500 hover:text-amber-900 text-lg",
                }}
                from={Route.fullPath}
                to="/"
              >
                <li className="flex items-center gap-x-4 p-2 rounded-lg font-semibold text-lg">
                  <BsHouseFill />
                  داشبورد
                </li>
              </Link>
              <Link
                activeProps={{
                  className:
                    "block bg-amber-500 rounded-lg text-white fill-amber-100",
                }}
                inactiveProps={{
                  className:
                    "block hover:bg-amber-100 rounded-lg font-semibold text-gray-500 hover:text-amber-900 text-lg",
                }}
                from={Route.fullPath}
                to="/user"
              >
                <li className="flex items-center gap-x-4 p-2 rounded-lg font-semibold text-lg">
                  <BsPersonFill />
                  کاربران
                </li>
              </Link>
              <li className="flex items-center gap-x-4 hover:bg-amber-100 p-2 rounded-lg font-semibold text-gray-500 hover:text-amber-900 text-lg">
                <BsPiggyBankFill />
                <p>مدیریت مالی</p>
              </li>
              <li className="flex items-center gap-x-4 hover:bg-amber-100 p-2 rounded-lg font-semibold text-gray-500 hover:text-amber-900 text-lg">
                <BsFileEarmarkSpreadsheetFill />
                <p>گزارش گیری</p>
              </li>
              <li className="flex items-center gap-x-4 hover:bg-amber-100 p-2 rounded-lg font-semibold text-gray-500 hover:text-amber-900 text-lg">
                <BsGearFill />
                <p>تنظیمات سیستم</p>
              </li>
            </ul>
          </nav>
          <footer className="p-4 border-t border-t-gray-300">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-amber-200 rounded-full w-8 h-8 font-semibold text-amber-800">
                I
              </div>
              <div>
                <p className="font-medium text-sm">Imanhpr</p>
                <p className="text-gray-600 text-xs">
                  خوش آمدی به پنل مدیریت زرصـاد
                </p>
              </div>
            </div>
          </footer>
        </div>
      </aside>
    </div>
  );
}
