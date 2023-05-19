import { authentication } from "@template/authentication";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function signOut(request: Request) {
  const authenticationRequest = authentication.handleRequest({ request, cookies: cookies as any });
  const session = await authenticationRequest.validate();

  if (!session) {
    return NextResponse.json(
      {
        error: "Unauthorised",
      },
      {
        status: 401,
      },
    );
  }

  await authentication.invalidateSession(session.sessionId);
  authenticationRequest.setSession(null);

  return new Response(null, {
    status: 302,
    headers: {
      location: "/sign-in",
    },
  });
}
