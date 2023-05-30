"use client";

import { GithubButton } from "@template/feature/authentication";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@template/ui/web";

type AddConnectedAccountProps = {
  providers: string[];
};

export function AddConnectedAccount({ providers }: AddConnectedAccountProps) {
  const canConnectGitHub = !providers.includes("github");
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="mt-4">Add connected account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add connected account</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-y-4">
            <p>Select the provider you want to connect to your account</p>
            {canConnectGitHub ? (
              <GithubButton callbackUrl="/settings/accounts" />
            ) : (
              <p className="text-foreground">There aren't any more providers to connect</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
