import { getAuthentication } from "@template/authentication";
import { db, teamMembers, teams } from "@template/db";
import { and, eq } from "drizzle-orm";
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
      ownerId: true,
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

  if (!team) {
    return null;
  }
  const isOwner = user.id === team.ownerId;

  if (isOwner) {
    return (
      <div className="mx-auto">
        <Table data={team.invitations ?? []} isAdmin={isOwner} />
      </div>
    );
  }

  const member = await db.query.teamMembers.findFirst({
    where: and(eq(teamMembers.teamId, team.id), eq(teamMembers.userId, user.id)),
    columns: {
      role: true,
    },
  });

  if (!member) {
    return null;
  }

  const isAdmin = member.role === "admin";

  return (
    <div className="mx-auto">
      <Table data={team.invitations ?? []} isAdmin={isAdmin} />
    </div>
  );
}
