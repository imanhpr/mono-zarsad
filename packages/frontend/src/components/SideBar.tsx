import { Fragment, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { ShowSideBarContext } from "../context/contexts";
import { Link } from "@tanstack/react-router";

export default function SideBar() {
  const { showSideBar, setShowSideBar } = useContext(ShowSideBarContext);

  const f = document.createDocumentFragment();
  useEffect(() => {
    document.body.insertBefore(f, document.body.firstChild);
  });

  function closeHandler() {
    setShowSideBar((v) => !v);
  }
  const Overlay = (
    <div
      onClick={closeHandler}
      className={`md:hidden absolute inset-0 bg-black opacity-60 ${showSideBar ? "hidden" : "block"} z-10`}
    ></div>
  );

  const OverlayPortal = createPortal(Overlay, document.body);
  const clsNames = clsx(
    "right-0",
    "md:static",
    "fixed",
    "inset-y-0",
    "bg-zinc-600",
    "w-1/2",
    "md:w-96",
    "transition-transform ",
    "md:translate-x-0",
    { "translate-x-full": showSideBar },
    "md:block",
    "z-20"
  );
  return (
    <Fragment>
      <div className={clsNames}>
        <nav className="flex flex-col m-6 text-white text-2xl" dir="rtl">
          <Link to="/">خانه</Link>
          <Link to="/about">درباره ما</Link>
        </nav>
      </div>
      {OverlayPortal}
    </Fragment>
  );
}
