import { createFileRoute, Outlet } from "@tanstack/react-router";
import PanelContainer from "../components/Panel-Container";
import { useContext } from "react";
import { AuthContext } from "../context/contexts";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { accessToken } = useContext(AuthContext);
  if (accessToken === null) {
    return navigate({ from: Route.fullPath, to: "/auth/login" });
  }
  return (
    <PanelContainer>
      <Outlet />
    </PanelContainer>
  );
}
