import { createFileRoute, Outlet } from "@tanstack/react-router";
import PanelContainer from "../components/Panel-Container";
import { useSelector } from "react-redux";
import { AuthState } from "../store/auth.slice";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const accessToken = useSelector(
    (state: { auth: AuthState }) => state.auth.accessToken
  );
  if (!accessToken) {
    return navigate({ from: Route.fullPath, to: "/auth/login" });
  }
  return (
    <PanelContainer>
      <Outlet />
    </PanelContainer>
  );
}
