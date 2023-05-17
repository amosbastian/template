import { authentication } from "@template/authentication";
import { NextRequest, NextResponse } from "next/server";
import { signUpSchema } from "./schema";

export async function signUp(request: NextRequest) {
  if (!request.url) {
    return new Response("Not found", { status: 404 });
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/";

  const json = await request.json();
  const { email, password } = signUpSchema.parse(json);

  const response = NextResponse.redirect(redirectUrl, 302);
  const authenticationRequest = authentication.handleRequest(request, response.headers);

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

    authenticationRequest.setSession(session);
    response.headers.set("location", "/");

    return new Response(null, {
      status: 302,
      headers: response.headers,
    });
  } catch (error) {
    // Email already in use
    console.error(error);

    return NextResponse.json({}, { status: 400 });
  }
}
