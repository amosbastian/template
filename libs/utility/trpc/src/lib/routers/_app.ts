import { router } from "../createRouter";
import { billingRouter } from "./billing-router/billing-router";
import { exampleRouter } from "./example-router/example-router";
import { teamRouter } from "./team-router/team-router";

export const appRouter = router({
  billing: billingRouter,
  example: exampleRouter,
  team: teamRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
