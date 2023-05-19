import { mysql2 } from "@lucia-auth/adapter-mysql";
import { poolConnection } from "@template/db";
import lucia from "lucia-auth";
import { nextjs } from "lucia-auth/middleware";
import "lucia-auth/polyfill/node"; // Only required for Node.js v18 and below
// import { planetscale } from "@lucia-auth/adapter-mysql";
import { github } from "@lucia-auth/oauth/providers";

const env = process.env["NODE_ENV"] === "development" ? "DEV" : "PROD";

export const authentication = lucia({
  adapter: mysql2(poolConnection),
  // adapter: planetscale(connection)
  env,
  middleware: nextjs(),
  transformDatabaseUser: (userData) => {
    return {
      userId: userData.id,
      ...userData,
    };
  },
  sessionExpiresIn: {
    // While Lucia “works” with the new App router in Next.js v13,
    // your users will be signed out after 24 hours with the default configuration.
    // Currently, you cannot set cookies/headers inside page.tsx, and as such,
    // Lucia cannot store renewed sessions when a user revisits your site.
    // This can somewhat addressed by extending the session expiration with the
    // sessionExpiresIn.activePeriod configuration.
    activePeriod: 60 * 60 * 24 * 30, // 1 month
    idlePeriod: 0, // disable session renewal
  },
});

export const githubAuthentication = github(authentication, {
  clientId: process.env["GITHUB_CLIENT_ID"] ?? "",
  clientSecret: process.env["GITHUB_CLIENT_SECRET"] ?? "",
});

export type Authentication = typeof authentication;
