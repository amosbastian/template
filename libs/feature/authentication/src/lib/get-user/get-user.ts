import { authentication } from "@template/authentication";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function getUser() {
  const requestHeaders = new Headers();
  requestHeaders.append("origin", headers().get("origin") || "");
  requestHeaders.append("cookie", headers().get("cookie") || "");

  // TODO: This implementation isn't the best, should be changed to something more sturdy
  const requestUrl = `${headers().get("x-forwarded-proto") || ""}://${headers().get("x-forwarded-host") || ""}${
    headers().get("x-invoke-path") || ""
  }`;

  const request = new NextRequest(requestUrl, { method: "GET", headers: requestHeaders });
  const response = NextResponse.next();
  const authenticationRequest = authentication.handleRequest(request, response.headers);
  const user = await authenticationRequest.validateUser();

  return user;
}
