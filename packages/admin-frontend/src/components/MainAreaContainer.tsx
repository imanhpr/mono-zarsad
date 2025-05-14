import { PropsWithChildren } from "react";
import { clsx } from "clsx";

export default function MainAreaContainer({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const styles = clsx("flex flex-col m-6", className);
  return (
    <div dir="rtl" className={styles}>
      {children}
    </div>
  );
}
