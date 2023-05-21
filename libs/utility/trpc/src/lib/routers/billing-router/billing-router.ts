import { createCheckout } from "@template/utility/payment";
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
      return createCheckout(input.variant);
    }),
});
