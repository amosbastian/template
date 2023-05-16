import "lucia-auth/polyfill/node"; // Only required for Node.js v18 and below
import { mysql2 } from "@lucia-auth/adapter-mysql";
import { poolConnection } from "@template/db";
import lucia from "lucia-auth";
import { node, web } from "lucia-auth/middleware";
// import { planetscale } from "@lucia-auth/adapter-mysql";

const env = process.env["NODE_ENV"] === "development" ? "DEV" : "PROD";

export const auth = lucia({
  adapter: mysql2(poolConnection),
  // adapter: planetscale(connection)
  env,
  middleware: env === "DEV" ? node() : web(),
});

export type Auth = typeof auth;
