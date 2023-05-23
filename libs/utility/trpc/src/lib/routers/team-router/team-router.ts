import { createTeam, insertInvitationSchema, insertTeamSchema } from "@template/db";
import slugify from "url-slug";
import { protectedProcedure, router } from "../../createRouter";

export const teamRouter = router({
  create: protectedProcedure.input(insertTeamSchema).mutation(({ input, ctx }) => {
    const userId = ctx.session.user.id;
    return createTeam({ slug: slugify(input.name), name: input.name, userId });
  }),
  invite: protectedProcedure.input(insertInvitationSchema).mutation(({ input, ctx }) => {
    return;
  }),
});
