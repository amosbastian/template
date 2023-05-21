import { getAuthentication } from "@template/authentication";
import { BRAND_NAME } from "@template/configuration";
import { db, users } from "@template/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@template/ui/web";
import { getPlans } from "@template/utility/payment";
import { addDays, formatDistance } from "date-fns";
import { eq } from "drizzle-orm";
import { PlanForm } from "../plan-form/plan-form";

type CardProps = React.ComponentProps<typeof Card>;

export async function PlanCard({ className, ...rest }: CardProps) {
  const { user } = await getAuthentication();

  const result = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    with: {
      activeTeam: {
        columns: {
          id: true,
          name: true,
          createdAt: true,
        },
        with: {
          subscription: true,
        },
      },
    },
  });

  const activeTeam = result?.activeTeam;

  if (!activeTeam) {
    return null;
  }

  const trialEnded = addDays(activeTeam.createdAt, 7) < new Date();

  const plans = await getPlans();

  return (
    <Card className={className} {...rest}>
      <CardHeader>
        <CardTitle>Plan</CardTitle>
        <CardDescription>
          {activeTeam.subscription
            ? "You are currently on the X plan. Free or charge"
            : trialEnded
            ? `Your free trial has ended. Upgrade to continue using ${BRAND_NAME}`
            : `You are currently on the free trial. ${formatDistance(
                addDays(activeTeam.createdAt, 7),
                new Date(),
              )} left.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PlanForm plans={plans} />
      </CardContent>
    </Card>
  );
}
