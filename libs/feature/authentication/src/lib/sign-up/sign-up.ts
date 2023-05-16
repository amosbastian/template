import { authentication } from "@template/authentication";
import { NextRequest, NextResponse } from "next/server";
import { signUpSchema } from "./sign-up-form";

export async function signUp(request: NextRequest) {
  console.log("Here");
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/";

  const json = await request.json();
  const { username, password } = signUpSchema.parse(json);

  const response = NextResponse.redirect(redirectUrl, 302);
  console.log("2");
  const authenticationRequest = authentication.handleRequest(request, response.headers);
  console.log("3");
  try {
    const user = await authentication.createUser({
      primaryKey: {
        providerId: "username",
        providerUserId: username,
        password,
      },
      attributes: {
        username,
      },
    });
    console.log("4");
    const session = await authentication.createSession(user.id);
    console.log("5");
    authenticationRequest.setSession(session);
  } catch (error) {
    console.error(error);

    return NextResponse.json({}, { status: 400 });
  }

  return NextResponse.redirect("/", { status: 302 });
}
