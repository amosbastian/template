"use client";

import { classnames } from "@template/utility/shared";
import { VariantProps, cva } from "class-variance-authority";
import { X } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { Button } from "../button/button";

const toastVariants = cva(
  "group relative pointer-events-auto flex w-full items-center justify-between space-x-5 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-background border",
        destructive: "group destructive border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Toaster() {
  const { theme } = useTheme();

  return <SonnerToaster theme={theme as "light" | "dark" | undefined} />;
}

export const ToastAction = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={classnames(
      "ring-offset-background hover:bg-secondary focus:ring-ring group-[.destructive]:border-destructive/30 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));

ToastAction.displayName = Button.displayName;

export function toast({
  action,
  className,
  data,
  description,
  title,
  variant,
}: {
  action?: React.ReactNode;
  className?: string;
  data?: Parameters<typeof sonnerToast>[1];
  description?: string;
  title?: string;
} & VariantProps<typeof toastVariants>) {
  // TODO: Do some stuff with promises here
  return sonnerToast.custom((t) => (
    <div className={classnames(toastVariants({ variant }), className)}>
      <div className="grid gap-1">
        {title ? <p className="text-foreground text-sm font-semibold">{title}</p> : null}
        {description ? <p className="text-sm opacity-90">{description}</p> : null}
      </div>
      {action}
      <button
        onClick={() => sonnerToast.dismiss(t)}
        className="text-foreground/50 hover:text-foreground absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  ));
}
