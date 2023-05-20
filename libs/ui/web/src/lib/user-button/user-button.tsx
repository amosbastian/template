"use client";

import { AvatarProps } from "@radix-ui/react-avatar";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu";
import { api } from "@template/utility/trpc-next-client";

interface UserButtonProps extends AvatarProps {
  user: {
    email: string;
    name?: string;
    image?: string;
  };
}

export function UserButton({ user, ...props }: UserButtonProps) {
  const router = useRouter();
  const trpcContext = api.useContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-6 w-6" {...props}>
          {user.image ? (
            <div className="bg-gray-3 aspect-square h-full w-full">
              <AvatarImage className="bg-gray-3" alt="Profile picture" src={user.image} />
            </div>
          ) : (
            <AvatarFallback>
              <span className="sr-only">{user.name}</span>
              <UserIcon className="h-4 w-4" />
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && <p className="text-muted-foreground w-[200px] truncate text-sm">{user.email}</p>}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={async () => {
            const response = await fetch("/api/sign-out", {
              method: "POST",
            });

            trpcContext.invalidate();

            if (response.redirected) {
              return router.push(response.url);
            }
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
