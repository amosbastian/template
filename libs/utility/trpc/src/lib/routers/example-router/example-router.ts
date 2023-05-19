import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../../createRouter";

export const exampleRouter = router({
  hello: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
    return {
      greeting: `Hello ${input.text}`,
    };
  }),
  helloPrivate: protectedProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
    return {
      greeting: `Hello ${input.text} (Protected)`,
    };
  }),
});
