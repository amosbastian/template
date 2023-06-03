"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  toast,
} from "@template/ui/web";
import { api } from "@template/utility/trpc-next-client";
import { MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

interface InviteTableRowActionsProps {
  disabled: boolean;
  token: string;
}

export function InviteTableRowActions({ disabled, token }: InviteTableRowActionsProps) {
  const router = useRouter();

  const { mutate, isLoading } = api.team.revokeInvite.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: () => {
      toast({ title: "Could not revoke invitation", variant: "destructive" });
    },
  });

  const onClick = () => {
    mutate({ token });
  };

  console.log({ isLoading });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled || isLoading}>
        <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={onClick} disabled={isLoading}>
          <Trash className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
          Revoke
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
