import { createContext } from "react";

export const ShowSideBarContext = createContext<{
  showSideBar: boolean;
  setShowSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  showSideBar: false,
  setShowSideBar() {
    throw new Error("Not implemented");
  },
});
