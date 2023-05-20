import { getAuthentication } from "@template/authentication";
import { db, users } from "@template/db";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  TeamSwitcher,
  UserButton,
  buttonVariants,
} from "@template/ui/web";
import { Logo } from "@template/ui/web/server";
import { classnames } from "@template/utility/shared";
import { eq } from "drizzle-orm";
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

  const result = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    with: {
      activeTeam: {
        columns: {
          id: true,
          name: true,
        },
      },
      teams: {
        columns: {},
        with: {
          team: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  const activeTeam = result?.activeTeam;
  const teams = result?.teams.filter(({ team }) => team.id !== activeTeam?.id).map(({ team }) => team);

  return (
    <header className="absolute inset-x-0 top-0 z-50 flex h-16 border-b">
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
                  <div className="divide-muted -my-6 divide-y">
                    <div className="space-y-2 py-6">
                      {navigation.map((item, itemIdx) => (
                        <Link
                          key={itemIdx}
                          className={classnames(
                            buttonVariants({ variant: "ghost", size: "sm" }),
                            "w-full justify-start",
                          )}
                          href={item.href}
                        >
                          {item.name}
                        </Link>
                      ))}
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
          {activeTeam ? <TeamSwitcher activeTeam={activeTeam} teams={teams} /> : null}
        </div>
        <nav className="hidden lg:flex lg:gap-x-10 lg:leading-6">
          {navigation.map((item, itemIdx) => (
            <Link
              key={itemIdx}
              className="hover:text-primary text-muted-foreground text-sm font-medium transition-colors"
              href={item.href}
            >
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
