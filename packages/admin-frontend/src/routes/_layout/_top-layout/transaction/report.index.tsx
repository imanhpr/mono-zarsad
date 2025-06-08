import { createFileRoute } from "@tanstack/react-router";
import MainAreaContainer from "../../../../components/MainAreaContainer";

export const Route = createFileRoute(
  "/_layout/_top-layout/transaction/report/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <MainAreaContainer>
      <header>
        <h2 className="font-extrabold text-4xl dot-1">تراکنش ها</h2>
      </header>
      <div></div>
    </MainAreaContainer>
  );
}
