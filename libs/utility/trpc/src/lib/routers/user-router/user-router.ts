import { db, keys, teams, updateUserSchema, users } from "@template/db";
import { eq } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure, router } from "../../createRouter";

export const userRouter = router({
  update: protectedProcedure.input(updateUserSchema).mutation(({ input, ctx }) => {
    return db.update(users).set(input).where(eq(users.id, ctx.session.user.id));
  }),
  changeTeam: protectedProcedure.input(z.object({ activeTeamId: z.number() })).mutation(async ({ input, ctx }) => {
    await db.update(users).set(input).where(eq(users.id, ctx.session.user.id));

    return db.query.teams.findFirst({
      where: eq(teams.id, input.activeTeamId),
      columns: {
        slug: true,
      },
    });
  }),
  removeConnectedAccount: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    console.log(`Deleting key: ${input.id}`);
    return db.delete(keys).where(eq(keys.id, input.id)).execute();
  }),
});
