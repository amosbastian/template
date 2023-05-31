import { BASE_URL } from "@template/configuration";
import { db, invitations, teamMembers, teams, users } from "@template/db";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { token: string };
  },
) {
  const token = params.token;

  const invitation = await db.query.invitations.findFirst({
    where: eq(invitations.token, token),
  });

  if (!invitation) {
    return new Response("Invalid invitation", { status: 400 });
  }

  if (invitation.expiresAt < new Date()) {
    return new Response("Invitation has expired", { status: 404 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, invitation.email),
    columns: {
      id: true,
      emailVerified: true,
    },
  });

  if (!user) {
    // Redirect to sign up page
    const url = new URL(`${BASE_URL}/sign-up`);
    url.searchParams.set("token", token);
    url.searchParams.set("email", invitation.email);

    return new Response(null, {
      status: 302,
      headers: {
        location: url.toString(),
      },
    });
  }

  const team = await db.query.teams.findFirst({
    where: eq(teams.id, invitation.teamId),
    columns: {
      id: true,
      slug: true,
    },
  });

  if (!team) {
    return new Response("Team not found", { status: 404 });
  }

  // You can do a check here to see if the team has too many members for their current plan, for example
  db.transaction(async (tx) => {
    await tx.insert(teamMembers).values({ userId: user.id, role: invitation.role, teamId: team.id }).execute();
    await tx.update(users).set({ activeTeamId: team.id }).where(eq(users.id, user.id));
    await tx.delete(invitations).where(eq(invitations.token, token));
  });

  return new Response(null, {
    status: 302,
    headers: {
      location: `/${team.slug}/settings/members`,
    },
  });
}
