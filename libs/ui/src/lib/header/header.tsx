import { getAuthentication } from "@template/authentication";
import { classnames } from "@template/utility/shared";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "../button/button";
import { Dialog, DialogContent, DialogTrigger } from "../dialog/dialog";
import { Logo } from "../logo/logo";
import { UserButton } from "../user-button/user-button";

export async function Header() {
  const { user } = await getAuthentication();

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <Logo className="h-8 w-auto" />
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <Link href="/about" className="text-secondary-foreground text-sm font-medium">
            About
          </Link>
          <Link href="/blog" className="text-secondary-foreground text-sm font-medium">
            Blog
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-6">
          {user ? (
            <UserButton user={user} />
          ) : (
            <>
              <Link href="/sign-in" className={classnames(buttonVariants({ variant: "secondary", size: "sm" }))}>
                Sign in
              </Link>
              <Link href="/sign-up" className={classnames(buttonVariants({ variant: "default", size: "sm" }))}>
                Sign up
              </Link>
            </>
          )}
        </div>
        <div className="flex lg:hidden">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-secondary-foreground -m-1 inline-flex items-center justify-center rounded-md p-1"
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="flex items-center gap-x-6">
                <Link href="/" className="-m-1.5 p-1.5">
                  <Logo className="h-8 w-auto" />
                </Link>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-slate-500/10">
                  <div className="space-y-2 py-6">
                    <Link
                      href="/about"
                      className={classnames(buttonVariants({ variant: "ghost", size: "sm" }), "w-full justify-start")}
                    >
                      About
                    </Link>
                    <Link
                      href="/blog"
                      className={classnames(buttonVariants({ variant: "ghost", size: "sm" }), "w-full justify-start")}
                    >
                      Blog
                    </Link>
                  </div>
                  {user ? null : (
                    <div className="py-6">
                      <Link
                        href="/sign-in"
                        className={classnames(buttonVariants({ variant: "secondary", size: "sm" }))}
                      >
                        Sign in
                      </Link>
                      <Link href="/sign-up" className={classnames(buttonVariants({ variant: "default", size: "sm" }))}>
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
    </header>
  );
}
