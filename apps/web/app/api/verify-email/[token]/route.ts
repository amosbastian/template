import { db, teams, users, verificationTokens } from "@template/db";
import { eq } from "drizzle-orm";

async function handleError({ error, token }: { error: string; token: string }) {
  await db.delete(verificationTokens).where(eq(verificationTokens.token, token)).execute();

  return new Response(error, {
    status: 400,
  });
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { token: string };
  },
) {
  const token = params.token;

  const verificationToken = await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.token, token),
  });

  if (!verificationToken) {
    return handleError({ error: "Invalid verification token", token });
  }

  if (verificationToken.expiresAt < new Date()) {
    return handleError({ error: "Verification token has expired", token });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, verificationToken.email),
    columns: {
      activeTeamId: true,
      emailVerified: true,
      id: true,
    },
  });

  if (!user) {
    return handleError({ error: `Could not find user with email address ${verificationToken.email}`, token });
  }

  if (user.emailVerified) {
    return handleError({ error: "Email address is already verified", token });
  }

  db.transaction(async (tx) => {
    // await authentication.invalidateAllUserSessions(user.id);
    await tx.update(users).set({ emailVerified: new Date() }).where(eq(users.id, user.id));
    await tx.delete(verificationTokens).where(eq(verificationTokens.token, token));
  });

  const team = await db.query.teams
    .findFirst({
      where: eq(teams.id, user.activeTeamId),
      columns: {
        slug: true,
      },
    })
    .execute();

  return new Response(null, {
    status: 302,
    headers: {
      location: team ? `/${team.slug}/settings/profile` : "/",
    },
  });
}
