import { ROLES } from "@template/configuration";
import { InferModel, relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";

export const users = mysqlTable(
  "auth_user",
  {
    id: varchar("id", { length: 15 }).primaryKey(),
    email: varchar("email", { length: 256 }).notNull(),
    emailVerified: timestamp("email_verified", { fsp: 2 }),
    name: varchar("name", { length: 256 }),
    image: text("image"),
    activeTeamId: serial("active_team_id"),
    createdAt: timestamp("created_at", { fsp: 2 }).notNull().defaultNow(),
  },
  (users) => ({
    emailIndex: uniqueIndex("email_idx").on(users.email),
  }),
);

export type User = InferModel<typeof users, "select">;

export const usersRelations = relations(users, ({ many, one }) => ({
  teams: many(teamMembers),
  activeTeam: one(teams, {
    fields: [users.activeTeamId],
    references: [teams.id],
  }),
}));

export const teams = mysqlTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { fsp: 2 }).notNull().defaultNow(),
});

export const insertTeamSchema = createInsertSchema(teams);

export type Team = InferModel<typeof teams, "select">;

export const teamsRelations = relations(teams, ({ many }) => ({
  members: many(teamMembers),
  activeMembers: many(users),
}));

export const teamMembers = mysqlTable(
  "team_members",
  {
    // FIXME: https://github.com/drizzle-team/drizzle-orm/issues/258
    teamId: serial("team_id")
      .notNull()
      .references(() => teams.id),
    userId: varchar("user_id", {
      length: 15,
    })
      .notNull()
      .references(() => users.id),
    role: mysqlEnum("role", ROLES),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.teamId),
  }),
);

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

export const invitations = mysqlTable("invitations", {
  token: varchar("token", { length: 255 }).primaryKey(),
  // FIXME: https://github.com/drizzle-team/drizzle-orm/issues/258
  teamId: serial("team_id")
    .notNull()
    .references(() => teams.id),
  expiresAt: timestamp("expires_at", { fsp: 2 }).notNull(),
  role: mysqlEnum("role", ROLES),
});

export const sessions = mysqlTable("auth_session", {
  id: varchar("id", {
    length: 128,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  })
    .notNull()
    .references(() => users.id),
  activeExpires: bigint("active_expires", {
    mode: "number",
  }).notNull(),
  idleExpires: bigint("idle_expires", {
    mode: "number",
  }).notNull(),
});

export const keys = mysqlTable("auth_key", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  })
    .notNull()
    .references(() => users.id),
  primaryKey: boolean("primary_key").notNull(),
  hashedPassword: varchar("hashed_password", {
    length: 255,
  }),
  expires: bigint("expires", {
    mode: "number",
  }),
});
