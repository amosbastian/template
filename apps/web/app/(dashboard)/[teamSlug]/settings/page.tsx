import { getAuthentication } from "@template/authentication";
import { db, teams } from "@template/db";
import { TeamForm } from "@template/feature/team";
import { Card, CardContent, CardHeader, CardTitle } from "@template/ui/web";
import { eq } from "drizzle-orm";
import { Metadata } from "next";

export default async function GeneralSettings() {
  const { user } = await getAuthentication();

  if (!user) {
    return null;
  }

  const team = await db.query.teams.findFirst({
    where: eq(teams.id, user.activeTeamId),
    columns: {
      id: true,
      name: true,
      image: true,
    },
  });

  if (!team) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        General
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamForm className="max-w-[360px]" defaultValues={team} />
        </CardContent>
      </Card>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your team",
};
