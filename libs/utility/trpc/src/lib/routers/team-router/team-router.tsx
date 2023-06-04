import { createTeam, db, insertTeamSchema, teams } from "@template/db";
// import sendEmail, { TeamInvitation } from "@template/utility/email";
import { updateTeamSchema } from "@template/utility/schema";
import { eq } from "drizzle-orm";
import slugify from "url-slug";
import { protectedProcedure, router } from "../../createRouter";

export const teamRouter = router({
  create: protectedProcedure.input(insertTeamSchema).mutation(({ input, ctx }) => {
    const userId = ctx.session.user.id;
    return createTeam({ slug: slugify(input.name), name: input.name, userId });
  }),
  update: protectedProcedure.input(updateTeamSchema).mutation(({ input, ctx }) => {
    return db.update(teams).set(input).where(eq(teams.id, input.id));
  }),
});
