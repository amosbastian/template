"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@template/ui/web";
import { TeamTableRowActions } from "./row-actions";

export const columns: ColumnDef<{
  role: "admin" | "member" | null;
  user: {
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  };
}>[] = [
  {
    accessorKey: "user.name",
    header: "Name",
  },
  {
    accessorKey: "user.email",
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
    id: "actions",
    cell: ({ row }) => <TeamTableRowActions row={row} />,
  },
];
