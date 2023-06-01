import { BASE_URL } from "@template/configuration";
import { createEmailVerificationToken, db, keys, teams, updateUserSchema, users } from "@template/db";
import { VerifyEmail, sendEmail } from "@template/utility/email";
import { eq } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure, router } from "../../createRouter";

export const userRouter = router({
  update: protectedProcedure.input(updateUserSchema).mutation(({ input, ctx }) => {
    return db.update(users).set(input).where(eq(users.id, ctx.session.user.id));
  }),
  changeTeam: protectedProcedure.input(z.object({ activeTeamId: z.number() })).mutation(async ({ input, ctx }) => {
    await db.update(users).set(input).where(eq(users.id, ctx.session.user.id));

    return db.query.teams.findFirst({
      where: eq(teams.id, input.activeTeamId),
      columns: {
        slug: true,
      },
    });
  }),
  removeConnectedAccount: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    return db.delete(keys).where(eq(keys.id, input.id)).execute();
  }),
  sendEmailVerification: protectedProcedure.mutation(async ({ ctx }) => {
    const { user, token } = await createEmailVerificationToken(ctx.session.user.id);
    console.log(`${BASE_URL}/api/verify-email/${token}`);
    // FIXME: this doesn't work because: https://github.com/vercel/next.js/issues/50042
    await sendEmail({
      subject: "Verify your email",
      to: user.email,
      component: <VerifyEmail name={user.name ?? ""} verificationLink={`${BASE_URL}/api/verify-email/${token}`} />,
    });
  }),
});
