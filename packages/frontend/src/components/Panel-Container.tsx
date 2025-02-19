import SideBar from "./SideBar";
import MainArea from "./MainArea";
import { ShowSideBarContextProvider } from "../context/ShowSideBar-Context";

export default function PanelContainer() {
  return (
    <ShowSideBarContextProvider>
      <div className="flex bg-slate-200 min-h-screen">
        <MainArea />
        <SideBar />
      </div>
    </ShowSideBarContextProvider>
  );
}
