import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import type { UserAPI, AuthApi, TransactionAPI } from "../api";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userAuthActions } from "../store/auth.slice";

export const Route = createRootRouteWithContext<{
  userAPI: UserAPI;
  authAPI: AuthApi;
  transactionAPI: TransactionAPI;
}>()({
  component: RouteComponent,
});

function RouteComponent() {
  const dispatch = useDispatch();
  const authAPI = Route.useRouteContext({ select: (t) => t.authAPI });
  useEffect(() => {
    authAPI
      .refreshToken()
      .then((token) => {
        dispatch(userAuthActions.setAccessToken(token));
        return authAPI.me(token);
      })
      .then((me) => {
        dispatch(userAuthActions.setUser(me));
      });
  }, []);
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
