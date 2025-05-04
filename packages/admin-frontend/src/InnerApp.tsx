import { createRouter, RouterProvider } from "@tanstack/react-router";
import adminZarApiInstance from "./api";
import { routeTree } from "./routeTree.gen";
import { useAppDispatch, useAppSelector } from "./hooks/redux-hooks";
import { useEffect } from "react";
import { adminRefreshTokenThunk } from "./store/auth.slice";

const router = createRouter({
  routeTree,
  context: { adminApi: adminZarApiInstance },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
export default function InnerApp() {
  const refreshTokenState = useAppSelector(
    (state) => state.auth.refreshTokenRequest.state
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (refreshTokenState === "idle") {
      dispatch(adminRefreshTokenThunk());
    }
  }, [dispatch, refreshTokenState]);
  const isFinal =
    refreshTokenState === "success" || refreshTokenState === "failed";
  return isFinal ? <RouterProvider router={router} /> : <div>loading...</div>;
}
