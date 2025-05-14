import { PropsWithChildren } from "react";
import { clsx } from "clsx";

export default function BaseCard({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const clsName = clsx(
    className,
    "flex flex-col shadow-sm border border-gray-300 rounded lg:w-86"
  );
  return (
    <div className={clsName} dir="rtl">
      {children}
    </div>
  );
}
