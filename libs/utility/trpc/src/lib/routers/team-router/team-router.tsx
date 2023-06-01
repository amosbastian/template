import { BASE_URL, BRAND_NAME } from "@template/configuration";
import { createTeam, db, insertTeamSchema, invitations, teamMembers, teams, users } from "@template/db";
import sendEmail, { TeamInvitation } from "@template/utility/email";
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

      const user = await db.query.users.findFirst({
        where: eq(users.email, invitation.email),
      });

      console.log(`${BASE_URL}/api/accept-team-invitation/${token}`);
      // FIXME: this doesn't work because: https://github.com/vercel/next.js/issues/50042

      const invitedByName = ctx.session.user.name;
      const invitedByEmail = ctx.session.user.email;
      await sendEmail({
        subject: invitedByName
          ? `${invitedByName} invited you to ${team.name} team on ${BRAND_NAME}`
          : `You've been invited to ${team.name} team on ${BRAND_NAME}`,
        to: invitation.email,
        component: (
          <TeamInvitation
            invitedByEmail={invitedByEmail}
            teamName={team.name}
            userEmail={invitation.email}
            invitedByName={invitedByName ?? invitedByEmail}
            name={user?.name ?? invitation.email}
            teamImage={team.image}
            userImage={user?.image}
            inviteLink={`${BASE_URL}/api/accept-team-invitation/${token}`}
          />
        ),
      });
    }
  }),
});
