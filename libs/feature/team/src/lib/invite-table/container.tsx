import { getAuthentication } from "@template/authentication";
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
      members: {
        columns: {
          userId: true,
          role: true,
        },
      },
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

  const member = team?.members.find((m) => m.userId === user.id);

  if (!member) {
    return null;
  }

  const isOwner = member.role === "owner";

  if (isOwner) {
    return (
      <div className="mx-auto">
        <Table data={team?.invitations ?? []} isAdmin={isOwner} />
      </div>
    );
  }

  const isAdmin = member.role === "admin";

  return (
    <div className="mx-auto">
      <Table data={team?.invitations ?? []} isAdmin={isAdmin} />
    </div>
  );
}
