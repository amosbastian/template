import { getAuthentication } from "@template/authentication";
import { db, teams } from "@template/db";
import { DataTable } from "@template/ui/web";
import { eq } from "drizzle-orm";
import { columns } from "./columns";

export async function TeamTable() {
  const { user } = await getAuthentication();

  if (!user) {
    return null;
  }

  const team = await db.query.teams.findFirst({
    where: eq(teams.id, user.activeTeamId),
    with: {
      members: {
        columns: {
          role: true,
        },
        with: {
          user: {
            columns: {
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

  return (
    <div className="mx-auto">
      <DataTable columns={columns} data={team?.members ?? []} />
    </div>
  );
}
