"use client";

import { buttonVariants } from "@template/ui/web";
import { classnames } from "@template/utility/shared";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

type AsideLinkProps = {
  children: React.ReactNode;
} & LinkProps;

export function AsideLink(props: AsideLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={props.href}
      className={classnames(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "text-muted-foreground w-full justify-start",
        pathname === props.href ? "text-accent-foreground" : undefined,
      )}
    >
      {props.children}
    </Link>
  );
}
