import { getAuthentication } from "@template/authentication";
import { defineAbilityFor } from "@template/authorisation";
import { db, teams } from "@template/db";
import { eq } from "drizzle-orm";
import { Table } from "./table";

export async function InviteTable() {
  const { user } = await getAuthentication();

  if (!user) {
    return null;
  }

  const team = await db.query.teams.findFirst({
    where: eq(teams.id, user.activeTeamId),
    columns: {
      id: true,
    },
    with: {
      invitations: {
        columns: {
          createdAt: true,
          email: true,
          expiresAt: true,
          role: true,
          token: true,
        },
      },
    },
  });

  const ability = await defineAbilityFor({ userId: user.id, teamId: user.activeTeamId });

  return (
    <div className="mx-auto">
      <Table data={team?.invitations ?? []} disabled={ability.can("revoke", "Invitation")} />
    </div>
  );
}
