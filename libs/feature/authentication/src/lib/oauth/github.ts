import { authentication, githubAuthentication } from "@template/authentication";
import { createTeam, db, teams } from "@template/db";
import { getFirstPartOfEmail } from "@template/utility/shared";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import slugify from "url-slug";

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
      await createTeam({
        slug: slugify(getFirstPartOfEmail(user.email)),
        name: `${user.name}'s team`,
        userId: user.id,
      });
    }

    const team = await db.query.teams.findFirst({
      where: eq(teams.id, user.activeTeamId),
      columns: {
        slug: true,
      },
    });

    const session = await authentication.createSession(user.userId);
    const authenticationRequest = authentication.handleRequest({ request, cookies: cookies as any });
    authenticationRequest.setSession(session);

    return new Response(null, {
      status: 302,
      headers: {
        location: team ? `/${team.slug}/dashboard` : "/",
      },
    });
  } catch (error) {
    console.error((error as any).message);
    return new Response(null, {
      status: 500,
    });
  }
}
