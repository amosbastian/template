import { router } from "../createRouter";
import { exampleRouter } from "./example-router/example-router";

export const appRouter = router({
  example: exampleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
