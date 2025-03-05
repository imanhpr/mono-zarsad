import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { type UserAPI } from "../api";

export const Route = createRootRouteWithContext<{ userAPI: UserAPI }>()({
  component: RouteComponent,
});

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
