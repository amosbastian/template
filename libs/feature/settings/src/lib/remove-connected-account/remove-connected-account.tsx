"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  toast,
} from "@template/ui/web";
import { api } from "@template/utility/trpc-next-client";
import { Loader2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";

type RemoveConnectedAccountProps = {
  id: string;
};

export function RemoveConnectedAccount({ id }: RemoveConnectedAccountProps) {
  const router = useRouter();

  const { mutate, isLoading } = api.user.removeConnectedAccount.useMutation({
    onSuccess: () => {
      toast({ title: "Account disconnected" });

      router.refresh();
    },
  });

  const onClick = () => {
    mutate({ id });
  };

  return (
    <div className="mt-4">
      <p className="text-foreground text-sm">Remove</p>
      <p className="text-muted-foreground text-sm">Remove this connected account from your account</p>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="mt-4">
            Remove connected account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove connected account</AlertDialogTitle>
            <AlertDialogDescription>
              You will no longer be able to use this connected account to sign in and any dependent features will no
              longer work.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onClick}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
