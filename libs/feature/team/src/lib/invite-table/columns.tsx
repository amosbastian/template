"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@template/ui/web";
import { InviteTableRowActions } from "./row-actions";

export const columns: ColumnDef<{
  email: string;
  role: "admin" | "member";
  createdAt: Date;
}>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role: string = row.getValue("role");

      return (
        <Badge className="capitalize" variant={role === "admin" ? "default" : "secondary"}>
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Sent at",
    cell: ({ row }) => {
      const role: string = row.getValue("role");

      return (
        <Badge className="capitalize" variant={role === "admin" ? "default" : "secondary"}>
          {role}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <InviteTableRowActions row={row} />,
  },
];
