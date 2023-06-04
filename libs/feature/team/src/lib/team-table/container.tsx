import { getAuthentication } from "@template/authentication";
import { defineAbilityFor } from "@template/authorisation";
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

  const ability = await defineAbilityFor({ userId: user.id, teamId: user.activeTeamId });

  const data = (team?.members ?? []).map((member) => {
    return {
      ability: {
        admin: ability.can("update", { kind: "Member", role: "admin" }),
        member: ability.can("update", { kind: "Member", role: "member" }),
        owner: ability.can("update", { kind: "Member", role: "owner" }),
        remove: ability.can("remove", { kind: "Member", ...member }),
      },
      ...member,
    };
  });

  return (
    <div className="mx-auto">
      <Table data={data} userId={user.id} />
    </div>
  );
}
