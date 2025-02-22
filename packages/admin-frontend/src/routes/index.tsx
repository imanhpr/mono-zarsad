import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  loader() {
    return { username: "imanhpr" };
  },
});

function Index() {
  const user = Route.useLoaderData();
  return <h3 className="">خوش آمدی {user.username} جان.</h3>;
}
