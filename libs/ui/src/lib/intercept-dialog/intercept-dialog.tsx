"use client";

import { usePathname, useRouter } from "next/navigation";
import { Dialog } from "../dialog/dialog";

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
      {children}
    </Dialog>
  );
}
