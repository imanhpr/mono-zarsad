import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Badge from "./Badge";
import React from "react";
import { User } from "../types";
import DropdownMenu from "./DropDownMenu";

const intlDate = new Intl.DateTimeFormat("fa-IR", {
  minute: "2-digit",
  hour: "2-digit",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

type props = { tableData: User[] };
function MainUserList({ tableData }: props) {
  const table = useReactTable({
    columns: [
      { accessorKey: "id", header: "شناسه", id: "id" },
      { accessorKey: "firstName", header: "نام", id: "firstName" },
      { accessorKey: "lastName", header: "نام خانوادگی", id: "lastName" },
      {
        accessorKey: "nationalCode",
        header: "کد ملی",
        cell(props) {
          return <p className="fa-numeric-mono">{props.getValue()}</p>;
        },
      },
      {
        accessorFn: (data) => data.profile.debtPrem,
        header: "حساب اعتباری",
        cell(props) {
          const value = props.getValue();
          return value ? (
            <Badge className="inline-block min-w-20" color="green">
              فعال
            </Badge>
          ) : (
            <Badge className="inline-block min-w-20" color="red">
              غیرفعال
            </Badge>
          );
        },
      },
      {
        accessorKey: "phoneNumber",
        header: "موبایل",
        cell(props) {
          return (
            <p dir="ltr" className="fa-numeric-mono">
              {props.getValue()}
            </p>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "تاریخ ایجاد",
        cell(props) {
          return <p>{intlDate.format(new Date(props.getValue()))}</p>;
        },
      },
      {
        header: "عملیات",
        cell(props) {
          const fullName =
            props.row.getValue("firstName") +
            " " +
            props.row.getValue("lastName");

          const userId = props.row.getValue("id") as string;
          return <DropdownMenu fullName={fullName} userId={userId} />;
        },
      },
    ],
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full table-auto">
      <thead className="border-b border-b-gray-300">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr className="text-center" key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th className="p-2 font-normal text-gray-400" key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="divide-y divide-gray-300">
        {table.getRowModel().rows.map((row) => {
          return (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td className="p-4 text-center" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default React.memo(MainUserList);
