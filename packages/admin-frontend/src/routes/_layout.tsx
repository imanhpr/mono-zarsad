import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BsHouseFill, BsPersonFill, BsPiggyBankFill } from "react-icons/bs";
export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
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
              <li className="flex items-center gap-x-4 bg-amber-500 p-2 rounded-lg font-semibold text-xl">
                <BsHouseFill className="fill-amber-100" />
                <p className="text-white">داشبورد</p>
              </li>
              <li className="flex items-center gap-x-4 hover:bg-amber-100 p-2 rounded-lg font-semibold text-gray-500 hover:text-amber-900 text-xl">
                <BsPersonFill />
                <p>مدیریت کاربران</p>
              </li>
              <li className="flex items-center gap-x-4 hover:bg-amber-100 p-2 rounded-lg font-semibold text-gray-500 hover:text-amber-900 text-xl">
                <BsPiggyBankFill />
                <p>مدیریت مالی</p>
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
