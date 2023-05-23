// import { connect } from "@planetscale/database";
// import { drizzle } from "drizzle-orm/planetscale-serverless";
import { eq, placeholder, sql } from "drizzle-orm";
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

export async function createTeam(data: { slug: string; name: string; userId: string }) {
  return db.transaction(async (tx) => {
    const slug = await generateTeamSlug(data.slug);
    const team = await tx.insert(schema.teams).values({ name: data.name, slug });
    const teamId = team[0].insertId;
    await tx.insert(schema.teamMembers).values({ userId: data.userId, teamId: teamId, role: "admin" });
    await tx.update(schema.users).set({ activeTeamId: teamId }).where(eq(schema.users.id, data.userId));

    return team[0];
  });
}

export async function generateTeamSlug(slug: string) {
  const prepared = db
    .select({ slug: schema.teams.slug })
    .from(schema.teams)
    .where(sql`lower(${schema.teams.slug}) like ${placeholder("slug")}`)
    .prepare();

  const teamsWithSimilarSlugs = await prepared.execute({ slug: `%${slug.toLowerCase()}%` });

  const slugs = teamsWithSimilarSlugs.map((team) => team.slug);

  if (!slugs.includes(slug)) {
    return slug;
  }

  let addition = 1;

  // Keep incrementing addition until a unique slug is found
  while (slugs.includes(slug + "-" + ++addition));

  return `${slug}-${addition}`;
}
