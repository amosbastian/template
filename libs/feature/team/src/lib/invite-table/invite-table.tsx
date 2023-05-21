import { getAuthentication } from "@template/authentication";
import { db, teams } from "@template/db";
import { DataTable } from "@template/ui/web";
import { eq } from "drizzle-orm";
import { columns } from "./columns";

export async function InviteTable() {
  const { user } = await getAuthentication();

  if (!user) {
    return null;
  }

  const team = await db.query.teams.findFirst({
    where: eq(teams.id, user.activeTeamId),
    with: {
      invitations: {
        columns: {
          createdAt: true,
          email: true,
          expiresAt: true,
          role: true,
        },
      },
    },
  });

  return (
    <div className="mx-auto">
      <DataTable
        columns={columns}
        data={team?.invitations ?? []}
        emptyState={
          <>
            <p className="text-foreground">No pending invitations found</p>
            <p className="text-muted-foreground">Use the form above to invite team members</p>
          </>
        }
      />
    </div>
  );
}
