"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "../dialog/dialog";

interface InterceptDialogProps {
  children: React.ReactNode;
}

export function InterceptDialog({ children }: InterceptDialogProps) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
