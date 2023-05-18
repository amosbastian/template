import { appRouter, createContextInner } from "@template/utility/trpc";
import "server-only";
import superjson from "superjson";
import { createTRPCNextLayout } from "./createTrpcNextLayout";

export const api = createTRPCNextLayout({
  router: appRouter,
  transformer: superjson,
  async createContext() {
    // TODO: wait until lucia auth has next middleware
    return createContextInner({
      session: null,
      req: null,
    });
  },
});
