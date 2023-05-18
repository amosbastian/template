import { authentication } from "@template/authentication";
import { appRouter, createContextInner } from "@template/utility/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextResponse, type NextRequest } from "next/server";

export default function handler(req: NextRequest) {
  return fetchRequestHandler({
    req,
    endpoint: "/api/trpc",
    router: appRouter,
    async createContext() {
      const response = NextResponse.next();
      const authenticationRequest = authentication.handleRequest(req as unknown as NextRequest, response.headers);
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
}

export const runtime = "edge";
