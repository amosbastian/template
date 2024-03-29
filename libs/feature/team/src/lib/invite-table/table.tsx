"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge, DataTable } from "@template/ui/web";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import * as React from "react";
import { InviteTableRowActions } from "./row-actions";

dayjs.extend(relativeTime);

type TableProps = {
  data: any[];
  disabled: boolean;
};

export function Table({ data, disabled }: TableProps) {
  const columns = React.useMemo(
    () =>
      [
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
            return <time dateTime={createdAt.toISOString()}>{dayjs(createdAt).fromNow()}</time>;
          },
        },
        {
          id: "actions",
          cell: ({ row }) => {
            return <InviteTableRowActions disabled={disabled} token={row.original.token} />;
          },
        },
      ] as ColumnDef<{
        email: string;
        role: "admin" | "member";
        createdAt: Date;
        token: string;
      }>[],
    [disabled],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyState={
        <>
          <p className="text-foreground">No pending invitations found</p>
          <p className="text-muted-foreground">Use the form above to invite team members</p>
        </>
      }
    />
  );
}
