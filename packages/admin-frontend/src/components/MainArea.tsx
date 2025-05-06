import { PropsWithChildren, useContext } from "react";
import { sidebarCtx } from "../context/ctx";

export default function MainArea({ children }: PropsWithChildren) {
  const ctx = useContext(sidebarCtx);
  if (ctx.display) {
    return <main className="blur-xs w-full">{children}</main>;
  }
  return <main className="w-full">{children}</main>;
}
