import { Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { BsBell, BsList } from "react-icons/bs";

export const Route = createFileRoute("/_layout/_top-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full">
      <div className="">
        <div className="flex justify-between items-center px-8 py-6 border-b border-b-gray-300 h-22">
          <div className="p-2">
            <BsBell size={22} />
          </div>
          <div className="p-2">
            <BsList size={22} />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
