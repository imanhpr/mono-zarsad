import { PropsWithChildren } from "react";
import Sidebar from "./Sidebar";
import SidebarContextProvider from "../context/sidebar.provider";
import MainArea from "./MainArea";

export default function PanelContainer({ children }: PropsWithChildren) {
  return (
    <SidebarContextProvider>
      <div className="flex flex-row min-h-screen">
        <MainArea>{children}</MainArea>
        <Sidebar />
      </div>
    </SidebarContextProvider>
  );
}
