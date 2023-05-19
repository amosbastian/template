import { githubAuthentication } from "@template/authentication";
import { cookies } from "next/headers";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");

  if (provider === "github") {
    const [url, state] = await githubAuthentication.getAuthorizationUrl();

    // @ts-expect-error FIXME: cookies are read only
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
