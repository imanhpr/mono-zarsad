import { Fragment, PropsWithChildren, useCallback, useContext } from "react";
import { createPortal } from "react-dom";
import { modalCtx } from "../context/ctx";
import { clsx } from "clsx";

export default function Modal({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const ctx = useContext(modalCtx);

  const closeModalHandler = useCallback(() => {
    ctx.toggleDisplay();
  }, [ctx]);
  const style = clsx(
    "z-40 fixed bg-white p-4 border border-gray-400 rounded",
    className
  );
  const portal = createPortal(
    <div
      onClick={closeModalHandler}
      className="z-30 fixed flex flex-col justify-center items-center bg-black/70 min-w-screen min-h-screen"
    >
      <div className={style} dir="rtl" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById("portal")!
  );
  return <Fragment>{portal}</Fragment>;
}
