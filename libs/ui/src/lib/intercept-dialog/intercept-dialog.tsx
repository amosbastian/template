"use client";

import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent } from "../dialog/dialog";

interface InterceptDialogProps {
  children: React.ReactNode;
  pathname: string;
}

export function InterceptDialog({ children, pathname }: InterceptDialogProps) {
  const router = useRouter();
  const currentPathname = usePathname();

  return (
    <Dialog
      open={currentPathname === pathname}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent className="sm:max-w-[420px]">
        <div className="grid gap-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
