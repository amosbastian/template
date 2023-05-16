// import { connect } from "@planetscale/database";
// import { drizzle } from "drizzle-orm/planetscale-serverless";
import { drizzle } from "drizzle-orm/mysql2";
import * as mysql from "mysql2/promise";

// PlanetScale
// const connection = connect({
//   host: process.env["DATABASE_HOST"],
//   username: process.env["DATABASE_USERNAME"],
//   password: process.env["DATABASE_PASSWORD"],
// });
//
// export const db = drizzle(connection);

// Local
const poolConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "template",
});

export const db = drizzle(poolConnection);
