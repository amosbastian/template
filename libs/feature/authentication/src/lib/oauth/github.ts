import { authentication, githubAuthentication } from "@template/authentication";
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
    console.log((error as any).message);
    return new Response(null, {
      status: 500,
    });
  }
}
