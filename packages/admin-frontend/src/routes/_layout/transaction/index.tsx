import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/transaction/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_layout/transaction/"!</div>;
}
