import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useContext } from "react";
import { AuthCtx } from "../context";

export const Route = createRootRoute({ component: RouteComponent });

function RouteComponent() {
  // const user = useContext(AuthCtx);
  // const navigate = Route.useNavigate();
  // if (user === null) navigate({ from: Route.fullPath, to: "/auth/login" });
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
