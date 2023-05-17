import { signUp } from "@template/feature/authentication/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return signUp(request);
}
