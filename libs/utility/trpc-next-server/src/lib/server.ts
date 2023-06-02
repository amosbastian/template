import { authentication } from "@template/authentication";
import { appRouter, createContextInner } from "@template/utility/trpc";
import { cookies } from "next/headers";
import "server-only";
import superjson from "superjson";
import { createTRPCNextLayout } from "./createTrpcNextLayout";

export const api = createTRPCNextLayout({
  router: appRouter,
  transformer: superjson,
  async createContext() {
    const authenticationRequest = authentication.handleRequest({ cookies });

    return createContextInner({
      session: await authenticationRequest.validateUser(),
      req: null,
    });
  },
});
