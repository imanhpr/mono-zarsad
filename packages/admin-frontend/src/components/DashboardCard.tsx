import { type IconType } from "react-icons";

const intlNormalNumber = new Intl.NumberFormat("fa-IR");

export default function DashboardCard({
  currentNumber,
  growthPercentage,
  title,
  Icon,
}: {
  title: string;
  Icon: IconType;
  currentNumber: number;
  growthPercentage?: number;
}) {
  return (
    <div
      className="flex flex-col gap-y-2 shadow-sm p-6 border border-gray-300 rounded lg:w-86"
      dir="rtl"
    >
      <header className="flex justify-between mx-8">
        <h2 className="font-semibold text-base">{title}</h2>
        <Icon className="fill-gray-500" size={20} />
      </header>
      <div
        dir="rtl"
        className="flex flex-col items-start mx-8 font-bold text-3xl fa-numeric"
      >
        <p>{intlNormalNumber.format(currentNumber)}</p>
        {growthPercentage != null ? (
          <p className="flex items-center gap-x-1 text-muted-foreground text-sm">
            <span
              dir="ltr"
              className="flex items-center mr-1 text-green-500 fa-numeric-mono"
            >
              +{intlNormalNumber.format(growthPercentage)}%
            </span>
            <span className="font-medium text-gray-400">از ماه قبل</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
