import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userAuthActions } from "../../store/auth.slice";

export const Route = createFileRoute("/auth/logout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const dispatch = useDispatch();
  const navigate = Route.useNavigate();
  const authAPI = Route.useRouteContext({ select: (t) => t.authAPI });
  const accessToken = useSelector((state) => state?.userAuth?.accessToken);
  console.log("accessToken", accessToken);
  useEffect(() => {
    if (accessToken) {
      authAPI.logout().then(() => {
        dispatch(userAuthActions.setAccessToken(undefined));
        dispatch(userAuthActions.setUser(undefined));
        navigate({ to: "/", replace: true });
      });
    }
  });
  return <Navigate from={Route.fullPath} to="/" replace />;
}
