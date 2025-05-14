import { Link } from "@tanstack/react-router";
import { IconType } from "react-icons";

export default function SidebarLink({
  Icon,
  title,
  path,
}: {
  Icon: IconType;
  title: string;
  path: string;
}) {
  return (
    <Link
      activeProps={{
        className: "block bg-amber-500 rounded-lg text-white fill-amber-100",
      }}
      inactiveProps={{
        className:
          "block hover:bg-amber-100 rounded-lg font-semibold text-gray-500 hover:text-amber-900 text-lg",
      }}
      to={path}
    >
      <li className="flex items-center gap-x-4 p-2 rounded-lg font-semibold text-lg">
        <Icon />
        {title}
      </li>
    </Link>
  );
}
