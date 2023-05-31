import { BASE_URL } from "@template/configuration";
import { createTeam, db, insertTeamSchema, invitations, teamMembers, teams } from "@template/db";
import { inviteMembersSchema } from "@template/utility/schema";
import { generateToken } from "@template/utility/shared";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import slugify from "url-slug";
import { protectedProcedure, router } from "../../createRouter";

export const teamRouter = router({
  create: protectedProcedure.input(insertTeamSchema).mutation(({ input, ctx }) => {
    const userId = ctx.session.user.id;
    return createTeam({ slug: slugify(input.name), name: input.name, userId });
  }),
  invite: protectedProcedure.input(inviteMembersSchema).mutation(async ({ input, ctx }) => {
    if (!input.teamSlug) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }

    const team = await db.query.teams.findFirst({
      where: eq(teams.slug, input.teamSlug),
    });

    if (!team) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Team not found" });
    }

    const teamMember = await db.query.teamMembers.findFirst({
      where: and(eq(teamMembers.userId, ctx.session.user.id), eq(teamMembers.teamId, team.id)),
      columns: {
        role: true,
      },
    });

    if (!teamMember) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not a member of the team" });
    }

    // TODO: use rbac
    if (teamMember.role !== "admin") {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not an admin of the team" });
    }

    for (let i = 0; i < input.invitations.length; i++) {
      const invitation = input.invitations[i];

      const token = generateToken();
      const oneDayFromNow = new Date(Date.now() + 60 * 60 * 24 * 1000);

      await db
        .insert(invitations)
        .values({
          email: invitation.email,
          expiresAt: oneDayFromNow,
          role: invitation.role,
          token,
          teamId: team.id,
        })
        .execute();

      console.log(`${BASE_URL}/api/accept-team-invitation/${token}`);
      // TODO: send email
    }
  }),
});
