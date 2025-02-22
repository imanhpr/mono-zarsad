import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/")({
  component: RouteComponent,
  loader() {
    return new Promise<{ username: string }>((resolve) => {
      setTimeout(() => resolve({ username: "ایمان حسینی پور" }), 2000);
    });
  },
});

function RouteComponent() {
  const user = Route.useLoaderData();
  return <div>username : {user.username}</div>;
}
