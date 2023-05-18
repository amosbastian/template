"use client";

import { type AppRouter } from "@template/utility/trpc";
import { httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";
import { createHydrateClient } from "./createHydrateClient";
import { createTRPCNextBeta } from "./createTrpcNextBeta";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 4200}`; // dev SSR should use localhost
};

export const api = createTRPCNextBeta<AppRouter>({
  transformer: superjson,
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchInterval: false,
        retry: false,
        cacheTime: Infinity,
        staleTime: Infinity,
      },
    },
  },
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" || (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});

export const HydrateClient = createHydrateClient({
  transformer: superjson,
});
