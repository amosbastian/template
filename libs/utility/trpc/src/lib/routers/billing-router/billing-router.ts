import { ForbiddenError } from "@casl/ability";
import { defineAbilityFor } from "@template/authorisation";
import { createCheckout } from "@template/utility/payment";
import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { protectedProcedure, router } from "../../createRouter";

export const billingRouter = router({
  checkout: protectedProcedure
    .input(
      z.object({
        variant: z.string().or(z.number()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const teamId = ctx.session.user.activeTeamId;
      const ability = await defineAbilityFor({ userId, teamId });

      try {
        ForbiddenError.from(ability).throwUnlessCan("create", "Subscription");
        ForbiddenError.from(ability).throwUnlessCan("update", "Subscription");
      } catch {
        throw new TRPCError({ code: "FORBIDDEN", message: "You aren't allowed to update or create a subscription" });
      }

      return createCheckout({ teamId, variant: input.variant });
    }),
});
