import { AbilityBuilder, CreateAbility, MongoAbility, createMongoAbility } from "@casl/ability";
import { Team as DbTeam, User as DbUser, db, teamMembers } from "@template/db";
import { and, eq } from "drizzle-orm";

type User = {
  kind: "User";
} & DbUser;

type Team = {
  kind: "Team";
} & DbTeam;

type GetUserParams = { teamId: number; userId: string };

async function getUser({ teamId, userId }: GetUserParams) {
  const member = await db.query.teamMembers.findFirst({
    where: and(eq(teamMembers.userId, userId), eq(teamMembers.teamId, teamId)),
    with: {
      user: true,
    },
  });

  if (!member) {
    return undefined;
  }

  return {
    role: member.role,
    ...member.user,
  };
}

type Member = { kind: "Member" } & Awaited<ReturnType<typeof getUser>>;
type CRUD = "create" | "read" | "update" | "delete";
type AppAbilities = ["update", User | "User"] | [CRUD, Team | "Team"] | ["invite" | "remove", Member | "Member"];

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

let ANONYMOUS_ABILITY: AppAbility;

export async function defineAbilityFor(params?: GetUserParams) {
  if (!params || (params && !params.userId)) {
    ANONYMOUS_ABILITY = ANONYMOUS_ABILITY || createAppAbility(defineRulesFor());
    return ANONYMOUS_ABILITY;
  }

  const user = await getUser(params);

  if (!user) {
    ANONYMOUS_ABILITY = ANONYMOUS_ABILITY || createAppAbility(defineRulesFor());
    return ANONYMOUS_ABILITY;
  }

  return createAppAbility(defineRulesFor({ kind: "Member", ...user }));
}

export function defineRulesFor(user?: Member) {
  const builder = new AbilityBuilder<AppAbility>(createAppAbility);
  switch (user?.role) {
    case "admin":
      defineAdminRules(builder, user);
      break;
    case "member":
      defineMemberRules(builder, user);
      break;
    case "owner":
      defineOwnerRules(builder, user);
      break;
    default:
      break;
  }

  return builder.rules;
}

function defineOwnerRules({ can }: AbilityBuilder<AppAbility>, user: NonNullable<Member>) {
  can(["create", "read", "update", "delete"], "Team");
  can("update", "User", { id: { $eq: user.id } });
  can("invite", "Member");
  can("remove", "Member", { role: { $in: ["admin", "member"] } });
}

function defineAdminRules({ can }: AbilityBuilder<AppAbility>, user: NonNullable<Member>) {
  can("update", "User", { id: { $eq: user.id } });
  can("invite", "Member");
  can("remove", "Member", { role: "member" });
}

function defineMemberRules({ can }: AbilityBuilder<AppAbility>, user: NonNullable<Member>) {
  can("update", "User", { id: { $eq: user.id } });
}
