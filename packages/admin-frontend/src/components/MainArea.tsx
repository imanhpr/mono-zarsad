import { PropsWithChildren, useContext } from "react";
import { sidebarCtx } from "../context/ctx";
import BasicNotification from "./BasicNotification";

export default function MainArea({ children }: PropsWithChildren) {
  const ctx = useContext(sidebarCtx);
  if (ctx.display) {
    return (
      <main className="relative blur-xs w-full">
        {children}
        <BasicNotification />
      </main>
    );
  }
  return (
    <main className="relative w-full">
      {children}
      <BasicNotification />
    </main>
  );
}
