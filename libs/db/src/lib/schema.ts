import { InferModel, relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  datetime,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";

export const ADMIN_ROLE = "admin";
export const MEMBER_ROLE = "member";
export const ROLES = [ADMIN_ROLE, MEMBER_ROLE] as const;
export type Role = (typeof ROLES)[number];

export const users = mysqlTable(
  "auth_user",
  {
    id: varchar("id", { length: 15 }).primaryKey(),
    email: varchar("email", { length: 256 }).notNull(),
    emailVerified: timestamp("email_verified", { fsp: 2 }),
    name: varchar("name", { length: 256 }),
    image: text("image"),
    activeTeamId: int("active_team_id"),
    createdAt: timestamp("created_at", { fsp: 2 }).notNull().defaultNow(),
  },
  (table) => ({
    emailIndex: uniqueIndex("email_idx").on(table.email),
  }),
);

export const verificationTokens = mysqlTable(
  "verification_tokens",
  {
    token: varchar("token", { length: 255 }).primaryKey(),
    email: varchar("email", { length: 256 }).notNull(),
    expiresAt: timestamp("expires_at", { fsp: 2 }).notNull(),
  },
  (table) => ({
    emailIndex: uniqueIndex("email_idx").on(table.email),
  }),
);

export const updateUserSchema = createInsertSchema(users, {
  id: (schema) => schema.id.optional(),
  email: (schema) => schema.email.email().optional(),
});

export type User = InferModel<typeof users, "select">;

export const usersRelations = relations(users, ({ many, one }) => ({
  teams: many(teamMembers),
  activeTeam: one(teams, {
    fields: [users.activeTeamId],
    references: [teams.id],
  }),
}));

export const teams = mysqlTable(
  "teams",
  {
    id: int("id").autoincrement().notNull().primaryKey(),
    name: text("name").notNull(),
    image: text("image"),
    // Add unique constraint when implemented in Drizzle
    slug: varchar("slug", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { fsp: 2 }).notNull().defaultNow(),
    // Used for billing
    customerId: int("customer_id"),
  },
  (table) => ({
    slugIndex: uniqueIndex("slug_idx").on(table.slug),
  }),
);

export const insertTeamSchema = createInsertSchema(teams, {
  slug: (schema) => schema.slug.optional(),
});

export type Team = InferModel<typeof teams, "select">;

export const teamsRelations = relations(teams, ({ many, one }) => ({
  members: many(teamMembers),
  activeMembers: many(users),
  invitations: many(invitations),
  subscription: one(subscriptions, {
    fields: [teams.id],
    references: [subscriptions.teamId],
  }),
}));

export const teamMembers = mysqlTable(
  "team_members",
  {
    // FIXME: https://github.com/drizzle-team/drizzle-orm/issues/258
    teamId: int("team_id")
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
  teamId: int("team_id")
    .notNull()
    .references(() => teams.id),
  email: varchar("email", { length: 256 }).notNull(),
  role: mysqlEnum("role", ROLES).notNull(),
  createdAt: timestamp("created_at", { fsp: 2 }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { fsp: 2 }).notNull(),
});

export const insertInvitationSchema = createInsertSchema(invitations);

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
}));

// Billing
export const subscriptions = mysqlTable("subscriptions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  productId: int("product_id").notNull(),
  // If we sync products, then remove this
  productName: varchar("productName", { length: 255 }).notNull(),
  variantId: int("variant_id").notNull(),
  // If we sync variants, then remove this
  variantName: varchar("variantName", { length: 255 }).notNull(),
  teamId: int("team_id").notNull(),
  status: mysqlEnum("status", ["on_trial", "active", "paused", "past_due", "unpaid", "cancelled", "expired"]).notNull(),
  trialEndsAt: datetime("trial_ends_at"),
  renewsAt: datetime("renews_at"),
  endsAt: datetime("ends_at"),
  cardBrand: mysqlEnum("card_brand", [
    "visa",
    "mastercard",
    "american_express",
    "discover",
    "jcb",
    "diners_club",
  ]).notNull(),
  cardLastFour: varchar("card_last_four", { length: 4 }).notNull(),
  updatePaymentUrl: varchar("update_payment_method", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { fsp: 2 }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { fsp: 2 }),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  team: one(teams, {
    fields: [subscriptions.teamId],
    references: [teams.customerId],
  }),
}));

// TODO: think about if we want to sync these too
// export const products = mysqlTable("products", {
//   id: varchar("id", { length: 255 }).primaryKey(),
//   slug: varchar("slug", { length: 255 }).notNull(),
//   createdAt: timestamp("created_at", { fsp: 2 }).notNull().defaultNow(),
//   updatedAt: timestamp("updated_at", { fsp: 2 }),
// });

// // If you want to change LemonSqueezy for Stripe for example, then this would be the price
// export const variants = mysqlTable("variants", {
//   id: varchar("id", { length: 255 }).primaryKey(),
//   slug: varchar("slug", { length: 255 }).notNull(),
//   interval: mysqlEnum("status", ["month", "year"]).notNull(),
//   createdAt: timestamp("created_at", { fsp: 2 }).notNull().defaultNow(),
//   updatedAt: timestamp("updated_at", { fsp: 2 }),
// });

// Lucia
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
