import { createFileRoute, Navigate, redirect } from "@tanstack/react-router";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/contexts";

export const Route = createFileRoute("/auth/logout/")({
  component: RouteComponent,
  beforeLoad(ctx) {
    console.log("ACCCCCC", ctx.context.auth?.accessToken);
    if (!ctx.context.auth?.accessToken) {
      throw redirect({ to: "/", replace: true });
    }
  },
});

function RouteComponent() {
  const { zarAPI } = Route.useRouteContext();
  const { accessToken, setAccessToken } = useContext(AuthContext);
  const navigation = Route.useNavigate();
  useEffect(() => {
    if (accessToken) {
      zarAPI.logOut().then(() => {
        setAccessToken(null);
        zarAPI.setAccessToken(null);
        navigation({ to: "/", replace: true });
      });
    }
  });
  return <Navigate to="/auth/login" replace={true}></Navigate>;
}
