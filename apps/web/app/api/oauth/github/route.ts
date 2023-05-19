import { githubOauth } from "@template/feature/authentication/server";

export const GET = async (request: Request) => {
  return githubOauth(request);
};
