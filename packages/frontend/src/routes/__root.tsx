import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import type ZarAPI from "../api";
import { type AuthContextType } from "../context/contexts";

export const Route = createRootRouteWithContext<{
  zarAPI: ZarAPI;
  auth?: AuthContextType;
}>()({
  component: Root,
});

function Root() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
