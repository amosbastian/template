import { authentication, githubAuthentication } from "@template/authentication";
import { User, createTeam, db, teams, users } from "@template/db";
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
    const { existingUser, providerUser, createUser, createPersistentKey } = await githubAuthentication.validateCallback(
      code,
    );

    let currentUser: User | undefined;

    // Create persistent key if a user with the current email already exists
    if (!existingUser) {
      currentUser = await db.query.users
        .findFirst({
          where: eq(users.email, providerUser.email),
        })
        .execute();

      if (currentUser) {
        await createPersistentKey(currentUser.id);
      }
    }

    const user = existingUser
      ? existingUser
      : currentUser
      ? currentUser
      : await createUser({
          email: providerUser.email,
          name: providerUser.name,
          image: providerUser.avatar_url,
          email_verified: new Date(),
        });

    if (!existingUser && !currentUser) {
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

    const session = await authentication.createSession(user.id);
    const authenticationRequest = authentication.handleRequest({ request, cookies });
    authenticationRequest.setSession(session);

    let location = "/";

    if (team) {
      location += team.slug;

      if (currentUser) {
        location += "/settings/accounts";
      } else {
        location += "/dashboard";
      }
    }

    return new Response(null, {
      status: 302,
      headers: {
        location,
      },
    });
  } catch (error) {
    console.error((error as any).message);
    return new Response(null, {
      status: 500,
    });
  }
}
