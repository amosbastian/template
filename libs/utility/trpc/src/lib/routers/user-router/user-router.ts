import { db, updateUserSchema, users } from "@template/db";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../../createRouter";

export const userRouter = router({
  update: protectedProcedure.input(updateUserSchema).mutation(({ input, ctx }) => {
    return db.update(users).set(input).where(eq(users.id, ctx.session.user.id));
  }),
});
