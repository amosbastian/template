import { authentication } from "@template/authentication";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const signInSchema = zfd.formData({
  email: zfd.text(z.string().email().min(5)),
  password: zfd.text(z.string().min(1)),
});

export async function signIn(request: NextRequest) {
  if (!request.url) {
    return new Response("Not found", { status: 404 });
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/";

  const json = await request.json();
  const { email, password } = signInSchema.parse(json);

  const response = NextResponse.redirect(redirectUrl, 302);
  const authenticationRequest = authentication.handleRequest(request, response.headers);

  const session = await authenticationRequest.validate();

  if (session) {
    response.headers.set("location", "/");
    return new Response(null, {
      status: 302,
      headers: response.headers,
    });
  }

  const requestOrigin = request.headers.get("origin");

  const isValidRequest =
    !!requestOrigin && requestOrigin === (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL);

  if (!isValidRequest) {
    return new Response(null, {
      status: 403,
      headers: response.headers,
    });
  }

  try {
    const key = await authentication.useKey("email", email, password);

    const session = await authentication.createSession(key.userId);

    authenticationRequest.setSession(session);
    // redirect on successful attempt
    response.headers.set("location", "/");

    return new Response(null, {
      status: 302,
      headers: response.headers,
    });
  } catch (error) {
    // Invalid password
    console.error(error);

    return new Response(null, {
      status: 400,
      headers: response.headers,
    });
  }
}
