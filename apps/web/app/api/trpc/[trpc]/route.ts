import { authentication } from "@template/authentication";
import { appRouter, createContextInner } from "@template/utility/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

const handler = (req: NextRequest) => {
  return fetchRequestHandler({
    req,
    endpoint: "/api/trpc",
    router: appRouter,
    async createContext() {
      const authenticationRequest = authentication.handleRequest({ request: req, cookies: cookies as any });
      const { session } = await authenticationRequest.validateUser();

      return createContextInner({
        req,
        session,
      });
    },
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
          }
        : undefined,
  });
};

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
