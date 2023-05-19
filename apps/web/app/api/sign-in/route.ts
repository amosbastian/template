import { signIn } from "@template/feature/authentication/server";

export async function POST(request: Request) {
  return signIn(request);
}
