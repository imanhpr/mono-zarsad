import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/about")({
  component: About,
});

function About() {
  return <h1>About</h1>;
}
