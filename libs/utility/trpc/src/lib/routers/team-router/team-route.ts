import { db, insertTeamSchema, teamMembers, teams, users } from "@template/db";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../../createRouter";

export const teamRouter = router({
  create: protectedProcedure.input(insertTeamSchema).query(({ input, ctx }) => {
    return db.transaction(async (tx) => {
      const team = await tx.insert(teams).values({ name: input.name });
      const teamId = team[0].insertId;
      await tx.insert(teamMembers).values({ userId: ctx.session.userId, teamId: team[0].insertId, role: "admin" });
      await tx.update(users).set({ activeTeamId: teamId }).where(eq(users.id, ctx.session.userId));
    });
  }),
});
