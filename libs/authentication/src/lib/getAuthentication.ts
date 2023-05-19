import { cookies } from "next/headers";
import { authentication } from "./authentication";

export async function getAuthentication() {
  const authenticationRequest = authentication.handleRequest({ cookies: cookies as any });
  return authenticationRequest.validateUser();
}
