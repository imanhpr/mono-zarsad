import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useContext } from "react";
import { AuthContext } from "../context/contexts";
import PanelContainer from "../components/Panel-Container";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { accessToken } = useContext(AuthContext);
  if (accessToken === null) {
    return <Navigate to="/auth/login" />;
  }
  return <PanelContainer />;
}
