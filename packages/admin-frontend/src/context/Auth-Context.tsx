import { useState } from "react";
import { AuthCtx } from "./contexts";

export default function AuthContextProvider({
  children,
}: React.PropsWithChildren) {
  const [user] = useState({ username: "imanhpr" });
  return <AuthCtx.Provider value={null}>{children}</AuthCtx.Provider>;
}
