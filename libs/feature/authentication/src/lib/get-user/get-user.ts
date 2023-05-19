import { authentication } from "@template/authentication";
import { cookies } from "next/headers";

export async function getUser() {
  const authenticationRequest = authentication.handleRequest({ cookies: cookies as any });
  const { user } = await authenticationRequest.validateUser();

  return user;
}
