import { createFileRoute } from "@tanstack/react-router";
import PanelContainer from "../components/Panel-Container";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <PanelContainer>
      <h1>About</h1>
    </PanelContainer>
  );
}
