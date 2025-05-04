import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_top-layout/user/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_layout/_top-layout/user/"!</div>;
}
