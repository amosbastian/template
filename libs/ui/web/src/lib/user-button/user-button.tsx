"use client";

import { AvatarProps } from "@radix-ui/react-avatar";
import { api } from "@template/utility/trpc-next-client";
import { Loader2, UserIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu";
import { Label } from "../label/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select/select";

interface UserButtonProps extends AvatarProps {
  user: {
    email: string;
    name?: string;
    image?: string;
  };
}

export function UserButton({ user, ...props }: UserButtonProps) {
  const [isSigningOut, setIsSigningOut] = React.useState<boolean>(false);

  const params = useParams();
  const router = useRouter();
  const trpcContext = api.useContext();
  const { setTheme, theme } = useTheme();

  const teamSlug = params!.teamSlug as string;

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
          <Link href={`/${teamSlug}/dashboard`}>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${teamSlug}/settings`}>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="p-2 text-sm">
          <div className="flex items-center space-x-4">
            <Label htmlFor="theme">Theme</Label>
            <Select value={theme} onValueChange={setTheme} defaultValue={theme}>
              <SelectTrigger id="theme" className="h-8">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={async () => {
            setIsSigningOut(true);
            const response = await fetch("/api/sign-out", {
              method: "POST",
            });

            trpcContext.invalidate();

            setIsSigningOut(false);

            if (response.redirected) {
              return router.push(response.url);
            }
          }}
        >
          {isSigningOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
