import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AdminZarApi } from "../api";

type MyContext = {
  adminApi: InstanceType<typeof AdminZarApi>;
};
export const Route = createRootRouteWithContext<MyContext>()({
  component: RouteComponenet,
});

function RouteComponenet() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
