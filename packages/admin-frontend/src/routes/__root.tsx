import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import type { UserAPI, AuthApi } from "../api";

export const Route = createRootRouteWithContext<{
  userAPI: UserAPI;
  authAPI: AuthApi;
}>()({
  component: RouteComponent,
});

function RouteComponent() {
  console.log("Render");
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
