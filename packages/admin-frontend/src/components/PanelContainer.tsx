import { PropsWithChildren, useContext } from "react";
import Sidebar from "./Sidebar";
import SidebarContextProvider from "../context/sidebar.provider";
import MainArea from "./MainArea";
import { modalCtx } from "../context/ctx";
import { clsx } from "clsx";

export default function PanelContainer({ children }: PropsWithChildren) {
  const modalContext = useContext(modalCtx);

  const style = clsx("relative flex flex-row min-h-screen", {
    "blur-xs": modalContext.display,
    "cursor-pointer": modalContext.display,
  });

  return (
    <SidebarContextProvider>
      <div className={style}>
        <MainArea>{children}</MainArea>
        <Sidebar />
      </div>
    </SidebarContextProvider>
  );
}
