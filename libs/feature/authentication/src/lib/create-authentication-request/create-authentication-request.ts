import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function createAuthenticationRequest() {
  const requestHeaders = new Headers();
  requestHeaders.append("origin", headers().get("origin") || "");
  requestHeaders.append("cookie", headers().get("cookie") || "");

  // TODO: This implementation isn't the best, should be changed to something more sturdy
  const requestUrl = `${headers().get("x-forwarded-proto") || ""}://${headers().get("x-forwarded-host") || ""}${
    headers().get("x-invoke-path") || ""
  }`;

  return new NextRequest(requestUrl, { method: "GET", headers: requestHeaders });
}
