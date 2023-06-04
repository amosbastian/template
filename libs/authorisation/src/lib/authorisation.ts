import { AbilityBuilder, CreateAbility, ForcedSubject, MongoAbility, createMongoAbility } from "@casl/ability";
import { db, teamMembers } from "@template/db";
import { and, eq } from "drizzle-orm";

const actions = ["manage", "read", "create", "delete", "update", "invite"] as const;
const subjects = ["User", "all"] as const;
type AppAbilities = [
  (typeof actions)[number],
  (typeof subjects)[number] | ForcedSubject<Exclude<(typeof subjects)[number], "all">>,
];

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

async function getUser({ teamId, userId }: { teamId: number; userId: string }) {
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

type User = Awaited<ReturnType<typeof getUser>>;

let ANONYMOUS_ABILITY: AppAbility;

export function defineAbilityFor(user?: User) {
  if (user) return createAppAbility(defineRulesFor(user));

  ANONYMOUS_ABILITY = ANONYMOUS_ABILITY || createAppAbility(defineRulesFor());
  return ANONYMOUS_ABILITY;
}

export function defineRulesFor(user?: User) {
  const builder = new AbilityBuilder<AppAbility>(createAppAbility);
  switch (user?.role) {
    case "admin":
      defineAdminRules(builder);
      break;
    case "member":
      defineAnonymousRules(builder);
      defineMemberRules(builder, user);
      break;
    default:
      defineAnonymousRules(builder);
      break;
  }

  return builder.rules;
}

function defineAdminRules({ can }: AbilityBuilder<AppAbility>) {
  can("manage", "all");
}

function defineMemberRules({ can }: AbilityBuilder<AppAbility>, user: NonNullable<User>) {
  can("manage", "all");
}

function defineAnonymousRules({ can }: AbilityBuilder<AppAbility>) {
  can("manage", "all");
}
