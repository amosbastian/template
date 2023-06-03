import { githubAuthentication } from "@template/authentication";
import { cookies } from "next/headers";

export const GET = async (request: Request) => {
  const requestUrl = new URL(request.url);
  const provider = requestUrl.searchParams.get("provider");

  if (provider === "github") {
    const [url, state] = await githubAuthentication.getAuthorizationUrl();

    cookies().set("oauth_state", state, {
      path: "/",
      maxAge: 60 * 60,
    });

    return new Response(null, {
      status: 302,
      headers: {
        location: url.toString(),
      },
    });
  }
  return new Response(null, {
    status: 400,
  });
};
