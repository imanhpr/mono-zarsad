import authImage from "../assets/auth-image.png";
export default function BaseAuthPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center md:items-center space-y-6 bg-slate-200 mx-4 md:mx-0 min-h-screen">
      <div className="flex flex-col justify-center items-center space-y-1">
        <h1 className="font-extrabold text-2xl text-center">زرصـــــاد</h1>
      </div>
      <div className="flex md:flex-row flex-col md:gap-x-3 bg-white shadow-2xl md:mx-4 rounded-md md:w-4/6">
        <div className="hidden md:block md:w-1/2">
          <img
            className="rounded-l-md w-4xl object-cover"
            src={authImage}
          ></img>
        </div>
        <div className="flex flex-col justify-center px-4 py-6 md:w-1/2 md:max-w-1/2">
          <h2 className="font-bold text-md text-center">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
