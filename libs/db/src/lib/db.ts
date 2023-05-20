// import { connect } from "@planetscale/database";
// import { drizzle } from "drizzle-orm/planetscale-serverless";
import { drizzle } from "drizzle-orm/mysql2";
import * as mysql from "mysql2/promise";
import * as schema from "./schema";

// PlanetScale
// const connection = connect({
//   host: process.env["DATABASE_HOST"],
//   username: process.env["DATABASE_USERNAME"],
//   password: process.env["DATABASE_PASSWORD"],
// });
//
// export const db = drizzle(connection);

// Local
export const poolConnection = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  database: "template",
  port: 3306,
});

export const db = drizzle(poolConnection, { schema });
