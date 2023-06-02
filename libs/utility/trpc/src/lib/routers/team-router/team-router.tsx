import { BASE_URL } from "@template/configuration";
import { createTeam, db, insertTeamSchema, invitations, teamMembers, teams, users } from "@template/db";
// import sendEmail, { TeamInvitation } from "@template/utility/email";
import { inviteMembersSchema } from "@template/utility/schema";
import { generateToken } from "@template/utility/shared";
import { TRPCError } from "@trpc/server";
import { and, eq, ne } from "drizzle-orm";
import slugify from "url-slug";
import * as z from "zod";
import { protectedProcedure, router } from "../../createRouter";

export const teamRouter = router({
  create: protectedProcedure.input(insertTeamSchema).mutation(({ input, ctx }) => {
    const userId = ctx.session.user.id;
    return createTeam({ slug: slugify(input.name), name: input.name, userId });
  }),
  inviteMember: protectedProcedure.input(inviteMembersSchema).mutation(async ({ input, ctx }) => {
    if (!input.teamSlug) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }

    const team = await db.query.teams.findFirst({
      where: eq(teams.slug, input.teamSlug),
    });

    if (!team) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Team not found" });
    }

    const members = await db.query.teamMembers.findMany({
      where: eq(teamMembers.teamId, team.id),
      columns: {
        role: true,
      },
      with: {
        user: {
          columns: {
            email: true,
          },
        },
      },
    });

    const userAsMember = members.find((member) => member.id === ctx.session.user.id);

    if (!userAsMember) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not a member of the team" });
    }

    // TODO: use rbac
    if (userAsMember.role !== "admin") {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not an admin of the team" });
    }

    const existingInvitations = await db.query.invitations.findMany({ where: eq(invitations.teamId, team.id) });

    const memberEmails = members.map((member) => member.user.email);

    for (let i = 0; i < input.invitations.length; i++) {
      const invitation = input.invitations[i];

      // Skip if member already part of team
      if (memberEmails.includes(invitation.email)) {
        continue;
      }

      const existingInvitation = existingInvitations.find((existing) => existing.email === invitation.email);

      // Skip if user has already been invited
      if (existingInvitation) {
        continue;
      }

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

      const invitedByName = ctx.session.user.name;
      const invitedByEmail = ctx.session.user.email;

      await fetch(`${BASE_URL}/api/team-invitation-email`, {
        method: "POST",
        body: JSON.stringify({
          invitedByEmail,
          teamName: team.name,
          userEmail: invitation.email,
          invitedByName: invitedByName ?? invitedByEmail,
          name: user?.name ?? invitation.email,
          teamImage: team.image,
          userImage: user?.image,
          inviteLink: `${BASE_URL}/api/accept-team-invitation/${token}`,
        }),
      });
      // FIXME: this doesn't work because: https://github.com/vercel/next.js/issues/50042
      // await sendEmail({
      //   subject: invitedByName
      //     ? `${invitedByName} invited you to ${team.name} team on ${BRAND_NAME}`
      //     : `You've been invited to ${team.name} team on ${BRAND_NAME}`,
      //   to: invitation.email,
      //   component: (
      //     <TeamInvitation
      //       invitedByEmail={invitedByEmail}
      //       teamName={team.name}
      //       userEmail={invitation.email}
      //       invitedByName={invitedByName ?? invitedByEmail}
      //       name={user?.name ?? invitation.email}
      //       teamImage={team.image}
      //       userImage={user?.image}
      //       inviteLink={`${BASE_URL}/api/accept-team-invitation/${token}`}
      //     />
      //   ),
      // });
    }
  }),
  removeMember: protectedProcedure
    .input(z.object({ userId: z.string().length(15), teamId: z.number().min(1) }))
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You can't remove yourself from a team" });
      }

      const team = await db.query.teams.findFirst({
        where: eq(teams.id, input.teamId),
        columns: {
          id: true,
          ownerId: true,
        },
      });

      if (!team) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Team not found" });
      }

      const currentUserMember = await db.query.teamMembers.findFirst({
        where: and(eq(teamMembers.userId, ctx.session.user.id), eq(teamMembers.teamId, input.teamId)),
        columns: {
          role: true,
        },
      });

      if (!currentUserMember) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You are not a member of the team" });
      }

      // TODO: use rbac
      if (currentUserMember.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "You are not an admin of the team" });
      }

      const toBeRemovedMember = await db.query.teamMembers.findFirst({
        where: and(eq(teamMembers.userId, input.userId), eq(teamMembers.teamId, input.teamId)),
        columns: {
          role: true,
          userId: true,
        },
        with: {
          user: {
            columns: {
              activeTeamId: true,
            },
          },
        },
      });

      if (!toBeRemovedMember) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Could not find member" });
      }

      if (team.ownerId === toBeRemovedMember.userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Can't remove owner" });
      }

      if (toBeRemovedMember.user.activeTeamId === team.id) {
        const otherTeams = await db.query.teamMembers.findMany({
          where: and(eq(teamMembers.userId, toBeRemovedMember.userId), ne(teamMembers.teamId, team.id)),
          columns: {
            teamId: true,
          },
        });

        await db
          .update(users)
          .set({ activeTeamId: otherTeams.length > 0 ? otherTeams[0].teamId : null })
          .where(eq(users.id, toBeRemovedMember.userId));
      }

      // TODO: send email about removing user?

      return db
        .delete(teamMembers)
        .where(and(eq(teamMembers.userId, input.userId), eq(teamMembers.teamId, input.teamId)));
    }),
});
