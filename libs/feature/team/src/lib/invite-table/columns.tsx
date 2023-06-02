"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@template/ui/web";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { InviteTableRowActions } from "./row-actions";

dayjs.extend(relativeTime);

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
      const createdAt = row.getValue("createdAt") as Date;
      return <time dateTime={createdAt.toISOString()}>{dayjs().from(dayjs(createdAt))}</time>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <InviteTableRowActions row={row} />,
  },
];
