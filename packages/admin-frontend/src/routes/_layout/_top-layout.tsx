import { Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useContext } from "react";
import { BsBell, BsList } from "react-icons/bs";
import { sidebarCtx } from "../../context/ctx";

export const Route = createFileRoute("/_layout/_top-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const ctx = useContext(sidebarCtx);

  function onSidebarToggle() {
    ctx.toggleDisplay();
  }

  return (
    <div className="w-full">
      <div className="">
        <div className="flex justify-between items-center px-8 py-6 border-b border-b-gray-300 h-22">
          <div className="p-2">
            <BsBell size={22} />
          </div>
          <div
            onClick={onSidebarToggle}
            className="md:hidden p-2 cursor-pointer"
          >
            <BsList size={22} />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
