import { useState } from "react";
import { ShowSideBarContext } from "./contexts";

export function ShowSideBarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSideBar, setShowSideBar] = useState(true);
  return (
    <ShowSideBarContext.Provider value={{ showSideBar, setShowSideBar }}>
      {children}
    </ShowSideBarContext.Provider>
  );
}
