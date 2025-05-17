import { createFileRoute, Outlet } from "@tanstack/react-router";

import { useAppSelector } from "../hooks/redux-hooks";
import PanelContainer from "../components/PanelContainer";
import ModalContextProvider from "../context/Modal.provider";
export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const nav = Route.useNavigate();
  if (!accessToken) {
    return nav({ to: "/auth/login", replace: true });
  }
  return (
    <ModalContextProvider>
      <PanelContainer>
        <Outlet />
      </PanelContainer>
    </ModalContextProvider>
  );
}
