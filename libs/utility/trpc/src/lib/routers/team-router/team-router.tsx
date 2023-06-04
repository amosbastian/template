import { ForbiddenError } from "@casl/ability";
import { defineAbilityFor } from "@template/authorisation";
import { createTeam, db, insertTeamSchema, teams } from "@template/db";
import { updateTeamSchema } from "@template/utility/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import slugify from "url-slug";
import { protectedProcedure, router } from "../../createRouter";

export const teamRouter = router({
  create: protectedProcedure.input(insertTeamSchema).mutation(async ({ input, ctx }) => {
    const userId = ctx.session.user.id;
    const teamId = ctx.session.user.activeTeamId;
    const ability = await defineAbilityFor({ userId, teamId });

    try {
      ForbiddenError.from(ability).throwUnlessCan("create", "Team");
    } catch {
      throw new TRPCError({ code: "FORBIDDEN", message: "You aren't allowed to create a team" });
    }

    return createTeam({ slug: slugify(input.name), name: input.name, userId });
  }),
  update: protectedProcedure.input(updateTeamSchema).mutation(async ({ input, ctx }) => {
    const userId = ctx.session.user.id;
    const teamId = ctx.session.user.activeTeamId;
    const ability = await defineAbilityFor({ userId, teamId });

    try {
      ForbiddenError.from(ability).throwUnlessCan("update", "Team");
    } catch {
      throw new TRPCError({ code: "FORBIDDEN", message: "You aren't allowed to update this team" });
    }

    return db.update(teams).set(input).where(eq(teams.id, input.id));
  }),
});
