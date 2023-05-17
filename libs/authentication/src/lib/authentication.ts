import { mysql2 } from "@lucia-auth/adapter-mysql";
import { poolConnection } from "@template/db";
import lucia from "lucia-auth";
import { web } from "lucia-auth/middleware";
import "lucia-auth/polyfill/node"; // Only required for Node.js v18 and below
// import { planetscale } from "@lucia-auth/adapter-mysql";

const env = process.env["NODE_ENV"] === "development" ? "DEV" : "PROD";

export const authentication = lucia({
  adapter: mysql2(poolConnection),
  // adapter: planetscale(connection)
  env,
  middleware: web(),
  transformDatabaseUser: (userData) => {
    return {
      userId: userData.id,
      email: userData.email,
    };
  },
});

export type Authentication = typeof authentication;
