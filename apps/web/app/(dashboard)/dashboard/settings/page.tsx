import { buttonVariants } from "@template/ui";
import { classnames } from "@template/utility/shared";
import { BellIcon, CreditCardIcon, UserIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

const secondaryNavigation = [
  { name: "General", href: "/dashboard/settings", icon: UserIcon, current: true },
  { name: "Notifications", href: "/dashboard/settings/notifications", icon: BellIcon, current: false },
  { name: "Billing", href: "/dashboard/settings/billing", icon: CreditCardIcon, current: false },
  { name: "Team members", href: "/dashboard/settings/team", icon: UsersIcon, current: false },
];

export default async function SettingsPage() {
  return (
    <div className="mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8">
      <aside className="flex overflow-x-auto border border-b py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
        <nav className="flex-none px-4 sm:px-6 lg:px-0">
          <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
            {secondaryNavigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={classnames(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "text-muted-foreground w-full justify-start",
                  )}
                >
                  <item.icon className="mr-4 h-6 w-6 shrink-0" aria-hidden="true" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
        <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none"></div>
      </main>
    </div>
  );
}
