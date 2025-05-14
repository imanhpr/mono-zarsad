import { useContext } from "react";
import {
  BsHouseFill,
  BsPersonFill,
  BsPiggyBankFill,
  BsGearFill,
  BsFileEarmarkSpreadsheetFill,
  BsCurrencyBitcoin,
} from "react-icons/bs";
import { sidebarCtx } from "../context/ctx";
import { clsx } from "clsx";
import { createPortal } from "react-dom";
import SidebarLink from "./SidebarLink";

export default function Sidebar() {
  const sidebarContext = useContext(sidebarCtx);
  const overLayPortal = createPortal(
    <div
      onClick={sidebarContext.toggleDisplay}
      className="z-10 absolute bg-black opacity-50 w-screen h-screen"
    ></div>,
    document.getElementById("portal")!
  );
  let sidebarShowCls: string;
  if (sidebarContext.display) {
    sidebarShowCls = clsx("translate-x-0");
  } else {
    sidebarShowCls = clsx("-translate-x-0 translate-x-full");
  }

  return (
    <>
      {sidebarContext.display && overLayPortal}
      <aside
        className={clsx(
          "md:block top-0 right-0 z-20 fixed md:sticky bg-white border-l border-l-gray-300 w-66 md:w-4/10 lg:w-3/10 xl:w-2/10 h-screen transition-transform md:-translate-x-0",
          sidebarShowCls
        )}
      >
        <div dir="rtl" className="flex flex-col h-full">
          <header
            onClick={sidebarContext.toggleDisplay}
            className="px-3 py-6 border-b border-b-gray-300 h-22"
          >
            <h2 className="font-bold text-3xl text-center dot-1">پنل مدیریت</h2>
          </header>
          <nav className="flex-1">
            <ul className="space-y-2 my-2 px-4 *:transition-all *:cursor-pointer">
              <SidebarLink title="داشبورد" Icon={BsHouseFill} path="/" />
              <SidebarLink title="کاربران" Icon={BsPersonFill} path="/user" />

              <SidebarLink
                title="ارز ها"
                Icon={BsCurrencyBitcoin}
                path="/currency"
              />
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
    </>
  );
}
