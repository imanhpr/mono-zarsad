import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/user/manage')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/user/manage"!</div>
}
