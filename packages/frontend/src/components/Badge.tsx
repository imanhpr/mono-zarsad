import clsx from "clsx";
import React from "react";

const typeCls = Object.freeze({
  dark: "bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-sm border border-gray-500",
  default:
    "bg-blue-100 me-2 px-2.5 py-0.5 border border-blue-400 rounded-sm text-blue-800",
  red: "bg-red-100 me-2 px-2.5 py-0.5 border border-red-400 rounded-sm text-red-800",

  green:
    "bg-green-100 me-2 px-2.5 py-0.5 border border-green-400 rounded-sm text-green-800",

  yellow:
    "bg-yellow-100 me-2 px-2.5 py-0.5 border border-yellow-300 rounded-sm text-yellow-800",

  indigo:
    "bg-indigo-100 me-2 px-2.5 py-0.5 border border-indigo-400 rounded-sm text-indigo-800",

  purple:
    "bg-purple-100 me-2 px-2.5 py-0.5 border border-purple-400 rounded-sm text-purple-800",

  pink: "bg-pink-100 me-2 px-2.5 py-0.5 border border-pink-400 rounded-sm text-pink-800",
} as const);

export type BadgeColors = keyof typeof typeCls;
export default function Badge({
  color,
  children,
  className,
}: React.PropsWithChildren<{
  color: BadgeColors;
  className?: string;
}>) {
  const result = clsx(typeCls[color], className);
  return <span className={result}>{children}</span>;
}
