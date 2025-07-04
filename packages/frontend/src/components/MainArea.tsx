import ShowSideBarButton from "./ShowSideBarButton";

export default function MainArea({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full">
      <div className="md:hidden sticky flex justify-between items-center bg-slate-800 px-4 w-full">
        <ShowSideBarButton />
        <h1 className="mx-auto font-bold text-black text-3xl">ZarSad</h1>
      </div>
      <div dir="rtl" className="m-12">
        {children}
      </div>
    </div>
  );
}
