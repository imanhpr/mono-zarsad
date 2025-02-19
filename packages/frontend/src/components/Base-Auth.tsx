export default function BaseAuthPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center items-center space-y-6 bg-slate-200 min-h-screen">
      <div className="flex flex-col justify-center items-center space-y-1">
        <img src="/gold.png" className="h-16 object-contain" />
        <h1 className="font-extrabold text-2xl text-center">زرصـــــاد</h1>
      </div>
      <div className="bg-white shadow-2xl px-6 py-4 rounded-md w-xs md:min-w-md">
        <h2 className="font-bold text-md text-center">{title}</h2>
        {children}
      </div>
    </div>
  );
}
