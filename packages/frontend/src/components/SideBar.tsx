import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { ShowSideBarContext } from "../context/contexts";
import { Link, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";

export default function SideBar() {
  const { showSideBar, setShowSideBar } = useContext(ShowSideBarContext);
  const [currentPath, setCurrentPath] = useState("/");
  const router = useRouter();

  useEffect(() => {
    const unsub = router.subscribe("onBeforeLoad", (e) => {
      setCurrentPath(e.toLocation.href);
    });
    return unsub;
  });
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
      className={`md:hidden inset-0 bg-black opacity-60 fixed ${showSideBar ? "hidden" : "block"} z-10`}
    ></div>
  );
  console.log(currentPath);
  const OverlayPortal = createPortal(Overlay, document.body);
  const clsNames = clsx(
    "bg-zinc-700 border-slate-300 border-l-1",
    "right-0",
    "md:static",
    "fixed",
    "inset-y-0",
    "w-1/2",
    "md:w-96",
    "transition-transform",
    "md:translate-x-0",
    { "translate-x-full": showSideBar },
    "md:block",
    "z-20"
  );
  const normalCls = "flex gap-x-2";
  return (
    <AnimatePresence>
      <div className={clsNames}>
        <nav
          className="flex flex-col justify-center gap-y-2 mt-44 mr-6 text-yellow-500 text-xl"
          dir="rtl"
        >
          <div className={normalCls}>
            {currentPath === "/" ? (
              <motion.div layoutId="nav-tab" className="border-2"></motion.div>
            ) : (
              <div></div>
            )}
            <Link className="" to="/">
              خانه
            </Link>
          </div>
          <div className={normalCls}>
            {currentPath === "/about" ? (
              <motion.div layoutId="nav-tab" className="border-2"></motion.div>
            ) : (
              <div></div>
            )}
            <Link to="/about">درباره ما</Link>
          </div>
        </nav>
      </div>
      {OverlayPortal}
    </AnimatePresence>
  );
}
