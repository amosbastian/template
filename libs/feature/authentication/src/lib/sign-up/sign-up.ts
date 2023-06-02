import { authentication } from "@template/authentication";
import { createTeam, db, teams, users } from "@template/db";
import { getFirstPartOfEmail } from "@template/utility/shared";
import { eq } from "drizzle-orm";
import { LuciaError } from "lucia-auth";
import { cookies } from "next/headers";
import slugify from "url-slug";
import { authenticationSchema } from "../authentication-form/schema";

export async function signUp(request: Request) {
  const json = await request.json();
  const { email, password, token } = authenticationSchema.parse(json);

  try {
    const user = await authentication.createUser({
      primaryKey: {
        providerId: "email",
        providerUserId: email,
        password,
      },
      attributes: {
        email,
        // If a token exists, it means they accepted a team invite. Change this if you add
        // something like a notification center where a logged in user can accept invitations
        email_verified: token ? new Date() : undefined,
      },
    });

    const session = await authentication.createSession(user.userId);
    const authenticationRequest = authentication.handleRequest({ request, cookies });
    authenticationRequest.setSession(session);

    if (token) {
      return new Response(null, {
        status: 302,
        headers: {
          location: `/api/accept-team-invitation/${token}`,
        },
      });
    }

    const firstPartOfEmail = getFirstPartOfEmail(user.email);

    const result = await createTeam({
      slug: slugify(firstPartOfEmail),
      name: `${user.name ?? firstPartOfEmail}'s team`,
      userId: user.id,
    });

    const team = await db.query.teams.findFirst({
      where: eq(teams.id, result.insertId),
      columns: {
        id: true,
        slug: true,
      },
    });

    if (!team) {
      return new Response("Unknown error occurred", { status: 500 });
    }

    await db.update(users).set({ activeTeamId: team.id }).where(eq(users.id, user.id));

    return new Response(null, {
      status: 302,
      headers: {
        location: team ? `/${team.slug}/dashboard` : "/",
      },
    });
  } catch (error) {
    if (error instanceof LuciaError && error.message === "AUTH_DUPLICATE_KEY_ID") {
      return new Response("Email already in use", { status: 400 });
    }

    console.error(error);
    return new Response("Unknown error occurred", { status: 500 });
  }
}
