import { authentication, githubAuthentication } from "@template/authentication";
import { db, teamMembers, teams, users } from "@template/db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function githubOauth(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("oauth_state")?.value ?? null;

  if (storedState !== state || !code || !state) {
    throw new Response(null, { status: 401 });
  }

  try {
    const { existingUser, providerUser, createUser } = await githubAuthentication.validateCallback(code);

    const user = existingUser
      ? existingUser
      : await createUser({
          email: providerUser.email,
          name: providerUser.name,
          image: providerUser.avatar_url,
          email_verified: new Date(),
        });

    if (!existingUser) {
      await db.transaction(async (tx) => {
        const team = await tx.insert(teams).values({ name: "Personal" });
        const teamId = team[0].insertId;
        await tx
          .insert(teamMembers)
          .values({ userId: user.id, teamId: team[0].insertId, role: "admin", pending: false });
        await tx.update(users).set({ activeTeamId: teamId }).where(eq(users.id, user.id));
      });
    }

    const session = await authentication.createSession(user.userId);
    const authenticationRequest = authentication.handleRequest({ request, cookies: cookies as any });
    authenticationRequest.setSession(session);

    return new Response(null, {
      status: 302,
      headers: {
        location: "/dashboard",
      },
    });
  } catch (error) {
    console.log((error as any).message);
    return new Response(null, {
      status: 500,
    });
  }
}
