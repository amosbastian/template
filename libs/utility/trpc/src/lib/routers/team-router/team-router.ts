import {
  createTeam,
  db,
  insertInvitationSchema,
  insertTeamSchema,
  invitations,
  teamMembers,
  users,
} from "@template/db";
import slugify from "url-slug";
import { protectedProcedure, router } from "../../createRouter";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateToken } from "@template/utility/shared";

export const teamRouter = router({
  create: protectedProcedure.input(insertTeamSchema).mutation(({ input, ctx }) => {
    const userId = ctx.session.user.id;
    return createTeam({ slug: slugify(input.name), name: input.name, userId });
  }),
  invite: protectedProcedure.input(insertInvitationSchema).mutation(async ({ input, ctx }) => {
    const teamMember = await db.query.teamMembers.findFirst({
      where: and(eq(teamMembers.userId, ctx.session.user.id), eq(teamMembers.teamId, input.teamId)),
      columns: {
        role: true,
      },
    });

    if (!teamMember) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // TODO: use rbac
    if (teamMember.role !== "admin") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return db
      .insert(invitations)
      .values({
        email: input.email,
        expiresAt: new Date(),
        role: input.role,
        token: generateToken(),
      })
      .execute();
  }),
});
