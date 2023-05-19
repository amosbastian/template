import { signOut } from "@template/feature/authentication/server";

export const POST = async (request: Request) => {
  return signOut(request);
};
