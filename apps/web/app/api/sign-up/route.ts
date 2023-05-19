import { signUp } from "@template/feature/authentication/server";

export async function POST(request: Request) {
  return signUp(request);
}
