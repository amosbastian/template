import { getAuthentication } from "@template/authentication";
import { db, teamMembers, teams } from "@template/db";
import { Header } from "@template/feature/dashboard/server";
import { eq, sql } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

type DashboardLayoutProps = { children: React.ReactNode; params: { teamSlug: string } };

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { user } = await getAuthentication();

  if (!user) {
    redirect("/sign-in");
  }

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(teams)
    .leftJoin(teamMembers, eq(teamMembers.userId, user.id))
    .where(eq(teams.slug, params.teamSlug));

  console.log({ result, teamSlug: params.teamSlug });

  const count = result[0].count;

  // User is not a member of the current team
  if (count === 0) {
    notFound();
  }

  return (
    <div className="h-full w-full">
      {/* @ts-expect-error RSC */}
      <Header />
      <div className="h-full w-full">{children}</div>
    </div>
  );
}
