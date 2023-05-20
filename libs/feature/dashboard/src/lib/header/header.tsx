import { getAuthentication } from "@template/authentication";
import { Button, Dialog, DialogContent, DialogTrigger, TeamSwitcher, UserButton, buttonVariants } from "@template/ui";
import { Logo } from "@template/ui/server";
import { classnames } from "@template/utility/shared";
import { Menu } from "lucide-react";
import Link from "next/link";

const navigation = [
  { name: "Home", href: "#" },
  { name: "Invoices", href: "#" },
  { name: "Clients", href: "#" },
  { name: "Expenses", href: "#" },
];

export async function Header() {
  const { user } = await getAuthentication();

  return (
    <header className="absolute inset-x-0 top-0 z-50 flex h-16 border-b border-gray-900/10">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-x-6">
          <div className="flex lg:hidden">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-secondary-foreground inline-flex items-center justify-center rounded-md p-1"
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
                        className="text-secondary-foreground hover:bg-primary/90 -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7"
                      >
                        About
                      </Link>
                      <Link
                        href="/blog"
                        className="text-secondary-foreground hover:bg-primary/90 -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7"
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
                        <Link
                          href="/sign-up"
                          className={classnames(buttonVariants({ variant: "default", size: "sm" }))}
                        >
                          Sign up
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <TeamSwitcher />
        </div>
        <nav className="hidden md:flex md:gap-x-11 md:leading-6">
          {navigation.map((item, itemIdx) => (
            <Link key={itemIdx} className="hover:text-primary text-sm font-medium transition-colors" href={item.href}>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-x-8">
          {/* <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button> */}
          {user ? <UserButton user={user} /> : null}
        </div>
      </div>
    </header>
  );
}
