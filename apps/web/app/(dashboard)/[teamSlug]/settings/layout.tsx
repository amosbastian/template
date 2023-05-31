import { getAuthentication } from "@template/authentication";
import { Avatar, AvatarFallback, AvatarImage } from "@template/ui/web";
import { CreditCardIcon, LayoutDashboardIcon, UnplugIcon, UserCircle2Icon, UsersIcon } from "lucide-react";
import { AsideLink } from "./aside-link";

function getTeamNavigation(teamSlug: string) {
  return [
    { name: "General", href: `/${teamSlug}/settings`, icon: LayoutDashboardIcon },
    { name: "Billing", href: `/${teamSlug}/settings/billing`, icon: CreditCardIcon },
    { name: "Members", href: `/${teamSlug}/settings/members`, icon: UsersIcon },
  ];
}

function getAccountNavigation(teamSlug: string) {
  return [
    { name: "Profile", href: `/${teamSlug}/settings/profile`, icon: UserCircle2Icon },
    { name: "Connected accounts", href: `/${teamSlug}/settings/accounts`, icon: UnplugIcon },
  ];
}

type SettingsLayoutProps = { children: React.ReactNode; params: { teamSlug: string } };

export default async function SettingsLayout({ children, params }: SettingsLayoutProps) {
  const teamNavigation = getTeamNavigation(params.teamSlug);
  const accountNavigation = getAccountNavigation(params.teamSlug);

  const { user } = await getAuthentication();

  return (
    <div className="mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8">
      <aside className="flex overflow-x-auto border-b py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
        <nav className="flex-none px-4 sm:px-6 lg:px-0">
          <div className="mb-4 flex flex-row gap-x-2 px-3">
            <Avatar className="h-5 w-5">
              <AvatarImage src={`https://avatar.vercel.sh/random.png`} alt={params.teamSlug} />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <p className="text-muted-foreground text-sm">Team</p>
          </div>
          <ul role="list" className="mb-6 flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
            {teamNavigation.map((item) => (
              <li key={item.name}>
                <AsideLink href={item.href}>
                  <item.icon className="mr-4 h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.name}
                </AsideLink>
              </li>
            ))}
          </ul>
        </nav>
        {user ? (
          <>
            <div className="mb-4 flex flex-row gap-x-2 px-3">
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={user.image ?? `https://avatar.vercel.sh/amosbastian.png`}
                  alt={user.name ?? user.email}
                />
                <AvatarFallback>{user.name ?? user.email}</AvatarFallback>
              </Avatar>
              <p className="text-muted-foreground text-sm">Account</p>
            </div>
            <ul role="list" className="mb-6 flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
              {accountNavigation.map((item) => (
                <li key={item.name}>
                  <AsideLink href={item.href}>
                    <item.icon className="mr-4 h-4 w-4 shrink-0" aria-hidden="true" />
                    {item.name}
                  </AsideLink>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </aside>
      <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
        <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">{children}</div>
      </main>
    </div>
  );
}
