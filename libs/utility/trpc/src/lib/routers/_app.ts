import { router } from "../createRouter";
import { billingRouter } from "./billing-router/billing-router";
import { invitationRouter } from "./invitation-router/invitation-router";
import { memberRouter } from "./member-router/member-router";
import { teamRouter } from "./team-router/team-router";
import { userRouter } from "./user-router/user-router";

export const appRouter = router({
  billing: billingRouter,
  team: teamRouter,
  member: memberRouter,
  user: userRouter,
  invitation: invitationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
