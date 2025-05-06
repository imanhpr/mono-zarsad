import { PropsWithChildren, useState } from "react";
import { sidebarCtx } from "./ctx";

export default function SidebarContextProvider({
  children,
}: PropsWithChildren) {
  const [display, setDisplay] = useState<boolean>(false);
  const toggleDisplay = () => setDisplay((prev) => !prev);

  return (
    <sidebarCtx.Provider value={{ display, toggleDisplay }}>
      {children}
    </sidebarCtx.Provider>
  );
}
