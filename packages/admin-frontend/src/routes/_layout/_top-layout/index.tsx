import { createFileRoute } from "@tanstack/react-router";
import { BsFillPeopleFill } from "react-icons/bs";
export const Route = createFileRoute("/_layout/_top-layout/")({
  component: Index,
});

function Index() {
  const intlNormalNumber = new Intl.NumberFormat("fa-IR");
  return (
    <div dir="rtl" className="flex justify-start m-6">
      <div
        className="flex flex-col gap-y-2 shadow-sm p-6 border border-gray-300 rounded lg:w-86"
        dir="rtl"
      >
        <header className="flex justify-between mx-8">
          <h2 className="font-semibold text-base">مشتریان</h2>
          <BsFillPeopleFill className="fill-gray-500" size={20} />
        </header>
        <div
          dir="rtl"
          className="flex flex-col items-start mx-8 font-bold text-3xl fa-numeric"
        >
          <p>{intlNormalNumber.format(1234)}</p>
          <p className="flex items-center gap-x-1 text-muted-foreground text-sm">
            <span dir="ltr" className="flex items-center mr-1 text-green-500">
              +{intlNormalNumber.format(20.1)}%
            </span>
            <span className="font-medium text-gray-400">از ماه قبل</span>
          </p>
        </div>
      </div>
    </div>
  );
}
