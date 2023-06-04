import { ForbiddenError } from "@casl/ability";
import { defineAbilityFor } from "@template/authorisation";
import { db, invitations } from "@template/db";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure, router } from "../../createRouter";

export const invitationRouter = router({
  revoke: protectedProcedure.input(z.object({ token: z.string() })).mutation(async ({ input, ctx }) => {
    const userId = ctx.session.user.id;
    const teamId = ctx.session.user.activeTeamId;

    const ability = await defineAbilityFor({ userId, teamId });

    try {
      ForbiddenError.from(ability).throwUnlessCan("revoke", "Invitation");
    } catch {
      throw new TRPCError({ code: "FORBIDDEN", message: "You aren't allowed to revoke an invitation" });
    }

    return db.delete(invitations).where(eq(invitations.token, input.token));
  }),
});
