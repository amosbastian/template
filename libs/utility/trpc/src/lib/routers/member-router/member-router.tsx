import { BASE_URL } from "@template/configuration";
import { db, insertTeamMemberSchema, invitations, teamMembers, teams, users } from "@template/db";
// import sendEmail, { TeamInvitation } from "@template/utility/email";
import { ForbiddenError } from "@casl/ability";
import { defineAbilityFor } from "@template/authorisation";
import { inviteMembersSchema } from "@template/utility/schema";
import { generateToken } from "@template/utility/shared";
import { TRPCError } from "@trpc/server";
import { and, eq, ne } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure, router } from "../../createRouter";

export const memberRouter = router({
  update: protectedProcedure.input(insertTeamMemberSchema).mutation(async ({ input, ctx }) => {
    const userId = ctx.session.user.id;
    const teamId = ctx.session.user.activeTeamId;
    const ability = await defineAbilityFor({ userId, teamId });

    try {
      ForbiddenError.from(ability).throwUnlessCan("update", { kind: "Member", role: input.role });
    } catch {
      throw new TRPCError({ code: "FORBIDDEN", message: `You aren't allowed to change their role to ${input.role}` });
    }

    return db
      .update(teamMembers)
      .set({ role: input.role })
      .where(and(eq(teamMembers.teamId, input.teamId), eq(teamMembers.userId, input.userId)));
  }),
  invite: protectedProcedure.input(inviteMembersSchema).mutation(async ({ input, ctx }) => {
    const userId = ctx.session.user.id;
    const teamId = ctx.session.user.activeTeamId;
    const ability = await defineAbilityFor({ userId, teamId });

    try {
      ForbiddenError.from(ability).throwUnlessCan("invite", "Member");
    } catch {
      throw new TRPCError({ code: "FORBIDDEN", message: "You aren't allowed to invite members" });
    }

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
        userId: true,
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
  remove: protectedProcedure
    .input(z.object({ userId: z.string().length(15), teamId: z.number().min(1) }))
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You can't remove yourself from a team" });
      }

      const team = await db.query.teams.findFirst({
        where: eq(teams.id, input.teamId),
        columns: {
          id: true,
        },
        with: {
          members: {
            columns: {
              userId: true,
              role: true,
            },
          },
        },
      });

      if (!team) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Team not found" });
      }

      const userId = ctx.session.user.id;
      const teamId = ctx.session.user.activeTeamId;
      const ability = await defineAbilityFor({ userId, teamId });
      const toBeRemovedMember = team.members.find((m) => m.userId === input.userId);

      if (!toBeRemovedMember) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Could not find member" });
      }

      try {
        ForbiddenError.from(ability).throwUnlessCan("remove", { kind: "Member", ...toBeRemovedMember });
      } catch {
        throw new TRPCError({ code: "FORBIDDEN", message: "You aren't allowed to remove this member" });
      }

      const user = await db.query.users.findFirst({
        where: eq(users.id, input.userId),
        columns: {
          activeTeamId: true,
        },
      });

      if (user && user.activeTeamId === team.id) {
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
