import { getAuthentication } from "@template/authentication";
import { db, teams } from "@template/db";
import { eq } from "drizzle-orm";
import { Table } from "./table";

export async function TeamTable() {
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
          teamId: true,
          role: true,
        },
        with: {
          user: {
            columns: {
              id: true,
              email: true,
              emailVerified: true,
              image: true,
              name: true,
            },
          },
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
        <Table data={team?.members ?? []} isAdmin userId={user.id} isOwner />
      </div>
    );
  }

  const isAdmin = member.role === "admin";

  return (
    <div className="mx-auto">
      <Table data={team?.members ?? []} isAdmin={isAdmin} userId={user.id} isOwner={false} />
    </div>
  );
}
