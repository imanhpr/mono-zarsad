import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AdminZarApi } from "../api";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { useEffect } from "react";
import { adminRefreshTokenThunk } from "../store/auth.slice";

type MyContext = {
  adminApi: InstanceType<typeof AdminZarApi>;
};
export const Route = createRootRouteWithContext<MyContext>()({
  component: RouteComponenet,
});

function RouteComponenet() {
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = Route.useNavigate();
  useEffect(() => {
    dispatch(adminRefreshTokenThunk());
  }, [dispatch]);
  // if (
  //   !authState.accessToken &&
  //    ["success" , "failed"].includes(authState.refreshTokenRequest.state)
  // ) {
  //   navigate({ to: "/auth/login" });
  // }

  return (
    <>
      <Outlet />
      {/* {authState.refreshTokenRequest.state === "loading" ? (
        <div>
          <p>loading ...</p>
        </div>
      ) : (
        <Outlet />
      )} */}
      <TanStackRouterDevtools />
    </>
  );
}
