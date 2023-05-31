import { router } from "../createRouter";
import { billingRouter } from "./billing-router/billing-router";
import { teamRouter } from "./team-router/team-router";
import { userRouter } from "./user-router/user-router";

export const appRouter = router({
  billing: billingRouter,
  team: teamRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
