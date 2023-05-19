import { authentication } from "@template/authentication";
import { LuciaError } from "lucia-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authenticationSchema } from "../authentication-form/schema";

export async function signUp(request: Request) {
  const json = await request.json();
  const { email, password } = authenticationSchema.parse(json);

  try {
    const user = await authentication.createUser({
      primaryKey: {
        providerId: "email",
        providerUserId: email,
        password,
      },
      attributes: {
        email,
      },
    });

    const session = await authentication.createSession(user.userId);
    const authenticationRequest = authentication.handleRequest({ request, cookies: cookies as any });
    authenticationRequest.setSession(session);

    return new Response(null, {
      status: 302,
      headers: {
        location: "/",
      },
    });
  } catch (error) {
    if (error instanceof LuciaError && error.message === "AUTH_DUPLICATE_KEY_ID") {
      return NextResponse.json(
        {
          error: "Email already in use",
        },
        {
          status: 400,
        },
      );
    }

    console.error(error);
    return NextResponse.json(
      {
        error: "Unknown error occurred",
      },
      {
        status: 500,
      },
    );
  }
}
