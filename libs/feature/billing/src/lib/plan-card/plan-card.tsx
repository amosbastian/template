import { getAuthentication } from "@template/authentication";
import { BRAND_NAME } from "@template/configuration";
import { db, users } from "@template/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from "@template/ui/web";
import { getPlans } from "@template/utility/payment";
import { addDays, formatDistance } from "date-fns";
import { eq } from "drizzle-orm";
import { PlanForm, PlanFormLoading } from "../plan-form/plan-form";
import { defineAbilityFor } from "@template/authorisation";

type CardProps = React.ComponentProps<typeof Card>;

export async function PlanCard({ className, ...rest }: CardProps) {
  const { user } = await getAuthentication();

  const result = user
    ? await db.query.users.findFirst({
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
      })
    : null;

  const activeTeam = result?.activeTeam;

  if (!activeTeam) {
    return null;
  }

  const trialEnded = addDays(activeTeam.createdAt, 7) < new Date();
  const plans = await getPlans();
  const activePlan = activeTeam.subscription
    ? plans.find(
        (plan) =>
          `${plan.productId}` === `${activeTeam.subscription.productId}` &&
          `${plan.variantId}` === `${activeTeam.subscription.variantId}`,
      )
    : undefined;

  const ability = await defineAbilityFor(user ? { userId: user.id, teamId: user.activeTeamId } : undefined);

  return (
    <Card className={className} {...rest}>
      <CardHeader>
        <CardTitle>Plan</CardTitle>
        <CardDescription>
          {/* TODO: improve this */}
          {activeTeam.subscription
            ? `You are currently on the ${activeTeam.subscription.productName} (${activeTeam.subscription.variantName}) plan.`
            : trialEnded
            ? `Your free trial has ended. Upgrade to continue using ${BRAND_NAME}`
            : `You are currently on the free trial. ${formatDistance(
                addDays(activeTeam.createdAt, 7),
                new Date(),
              )} left.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PlanForm
          defaultValues={activePlan ? { plan: activePlan?.productSlug } : undefined}
          plans={plans}
          isDisabled={ability.cannot("create", "Subscription") || ability.cannot("update", "Subscription")}
        />
      </CardContent>
    </Card>
  );
}

export function PlanCardLoading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan</CardTitle>
        <CardDescription>
          <Skeleton className="mt-1.5 h-[12px] w-[256px]" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PlanFormLoading />
      </CardContent>
    </Card>
  );
}
