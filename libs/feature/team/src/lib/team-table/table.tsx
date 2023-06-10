"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Button,
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  DataTable,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  toast,
} from "@template/ui/web";
import { api } from "@template/utility/trpc-next-client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

dayjs.extend(relativeTime);

type Ability = {
  admin: boolean;
  member: boolean;
  owner: boolean;
  remove: boolean;
};

type RolePopoverProps = {
  ability: Ability;
  role: string;
  teamId: number;
  userId: string;
};

const RolePopover = ({ ability, role, teamId, userId }: RolePopoverProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const router = useRouter();

  console.log({ ability });

  const { mutate: removeMember, isLoading: isRemoving } = api.member.remove.useMutation({
    onSuccess: () => {
      toast({ title: "Member removed" });
      router.refresh();
    },
    onError: () => {
      toast({ title: "Could not remove member", variant: "destructive" });
    },
  });

  const { mutate: updateRole, isLoading: isUpdatingRole } = api.member.update.useMutation({
    onSuccess: () => {
      toast({ title: "Role updated" });
      router.refresh();
    },
    onError: () => {
      toast({ title: "Could not update role", variant: "destructive" });
    },
  });

  const isLoading = isRemoving || isUpdatingRole;

  const handleUpdateRole = (role: "admin" | "member") => {
    updateRole({ role, teamId, userId });
    setIsOpen(false);
  };

  const handleRemoveMember = () => {
    removeMember({ teamId, userId });
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          disabled={isLoading || Object.values(ability).every((value) => value === false)}
        >
          <span className="capitalize">{role}</span> <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <Command>
          <CommandList className="max-h-full">
            <CommandGroup>
              <CommandItem
                onSelect={() => handleUpdateRole("member")}
                className="flex flex-col items-start gap-y-1 px-4 py-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
                disabled={isLoading || role === "member" || !ability.member}
              >
                <p>Member</p>
                <p className="text-muted-foreground text-sm">Can create and publish posts</p>
              </CommandItem>
              <CommandItem
                disabled={isLoading || role === "admin" || !ability.admin}
                onSelect={() => handleUpdateRole("admin")}
                className="flex flex-col items-start gap-y-1 px-4 py-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
              >
                <p>Admin</p>
                <p className="text-muted-foreground text-sm">Can create and publish posts and manage members</p>
              </CommandItem>
              <CommandItem
                disabled={isLoading || role === "owner" || !ability.owner}
                onSelect={() => handleUpdateRole("admin")}
                className="flex flex-col items-start gap-y-1 px-4 py-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
              >
                <p>Owner</p>
                <p className="text-muted-foreground text-sm">
                  Can create and publish posts, manage members, and delete the team
                </p>
              </CommandItem>
              <CommandItem
                disabled={isLoading || !ability.remove}
                onSelect={handleRemoveMember}
                className="aria-selected:text-destructive-foreground aria-selected:bg-destructive group flex flex-col items-start gap-y-1 px-4 py-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
              >
                <p>Remove</p>
                <p className="text-muted-foreground text-sm group-hover:text-white group-aria-selected:text-white">
                  Remove this member from the team
                </p>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

type TableProps = {
  data: any[];
  userId: string;
};

export function Table({ data, userId }: TableProps) {
  const columns = React.useMemo(
    () =>
      [
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

            if (row.original.user.id === userId) {
              return <span className="min-w-[164px] capitalize">{role}</span>;
            }

            return (
              <RolePopover
                ability={row.original.ability}
                role={role}
                userId={row.original.user.id}
                teamId={row.original.teamId}
              />
            );
          },
        },
      ] as ColumnDef<{
        ability: Ability;
        teamId: number;
        role: "admin" | "member" | null;
        user: {
          id: string;
          name: string | null;
          email: string;
          emailVerified: Date | null;
          image: string | null;
        };
      }>[],
    [userId],
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

export function TableLoading() {
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "user.name",
        header: "Name",
        cell: () => {
          return <Skeleton className="h-4 w-[128px]" />;
        },
      },
      {
        accessorKey: "user.email",
        header: "Email",
        cell: () => {
          return <Skeleton className="h-4 w-[128px]" />;
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: () => {
          return <Skeleton className="h-4 w-[128px]" />;
        },
      },
    ],
    [],
  );

  return <DataTable columns={columns} data={[{ user: { name: "Name", email: "Email" }, role: "Role" }]} />;
}
