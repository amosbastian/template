import { getAuthentication } from "@template/authentication";
import { db, teams } from "@template/db";
import { eq } from "drizzle-orm";
import { TeamFormInner, TeamFormInnerProps } from "./form";

export async function TeamForm(props: TeamFormInnerProps) {
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

  return <TeamFormInner {...props} defaultValues={team} />;
}

export function TeamFormLoading(props: { className?: string }) {
  return <TeamFormInner {...props} isDisabled />;
}
