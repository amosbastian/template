import { db, insertInvitationSchema, insertTeamSchema, teamMembers, teams, users } from "@template/db";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../../createRouter";

export const teamRouter = router({
  create: protectedProcedure.input(insertTeamSchema).mutation(({ input, ctx }) => {
    const userId = ctx.session.user.id;
    return db.transaction(async (tx) => {
      const team = await tx.insert(teams).values({ name: input.name });
      const teamId = team[0].insertId;
      await tx.insert(teamMembers).values({ userId, teamId: team[0].insertId, role: "admin" });
      await tx.update(users).set({ activeTeamId: teamId }).where(eq(users.id, userId));

      return team[0];
    });
  }),
  invite: protectedProcedure.input(insertInvitationSchema).mutation(({ input, ctx }) => {
    return;
  }),
});
