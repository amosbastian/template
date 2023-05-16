import { authentication } from "@template/authentication";
import { NextResponse } from "next/server";
import { createAuthenticationRequest } from "../create-authentication-request/create-authentication-request";

export async function getAuthenticationRequest() {
  const request = await createAuthenticationRequest();
  const response = NextResponse.next();
  const authenticationRequest = authentication.handleRequest(request, response.headers);

  return authenticationRequest;
}
