import { authentication } from "@template/authentication";
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

type CreateContextOptions = {
  session?: Awaited<ReturnType<Lucia.Authentication["getSession"]>> | null;
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
export const createContext = async (options: CreateNextContextOptions) => {
  const { req } = options;

  const response = NextResponse.next();
  const authenticationRequest = authentication.handleRequest(req as unknown as NextRequest, response.headers);

  const { session } = await authenticationRequest.validateUser();

  return await createContextInner({
    session,
    req,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
