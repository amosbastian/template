import { router } from "../createRouter";
import { exampleRouter } from "./example-router/example-router";
import { teamRouter } from "./team-router/team-route";

export const appRouter = router({
  example: exampleRouter,
  team: teamRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
