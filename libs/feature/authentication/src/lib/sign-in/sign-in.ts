import { authentication } from "@template/authentication";
import { NextRequest, NextResponse } from "next/server";
import { signInSchema } from "./sign-in-form";

export async function signIn(request: NextRequest) {
  if (!request.url) return new Response("Not found", { status: 404 });

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/";

  const json = await request.json();
  const { email, password } = signInSchema.parse(json);

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
    const session = await authentication.createSession(user.id);
    authenticationRequest.setSession(session);
    response.headers.set("location", "/");
  } catch (error) {
    console.error(error);

    return NextResponse.json({}, { status: 400 });
  }

  return response;
}
