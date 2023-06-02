import type { inferAsyncReturnType } from "@trpc/server";
import type { NextApiRequest } from "next";
import { NextRequest } from "next/server";

type CreateContextOptions = {
  session?: Awaited<ReturnType<Lucia.Auth["validateSessionUser"]>> | { session: null; user: null } | null;
  req: NextApiRequest | NextRequest | null;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async (options: CreateContextOptions) => {
  return {
    session: options.session,
    req: options.req,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
// export const createContext = async (options: CreateNextContextOptions) => {
//   const { req } = options;

//   const authenticationRequest = authentication.handleRequest({
//     request: req as unknown as Request,
//     cookies,
//   });

//   const { session } = await authenticationRequest.validateUser();

//   return await createContextInner({
//     session,
//     req,
//   });
// };

export type Context = inferAsyncReturnType<typeof createContextInner>;
