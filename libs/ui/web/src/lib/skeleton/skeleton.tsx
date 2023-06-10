import { classnames } from "@template/utility/shared";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={classnames("bg-muted animate-pulse rounded-md", className)} {...props} />;
}

export { Skeleton };
