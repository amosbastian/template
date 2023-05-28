import { db, insertSubscriptionSchema, subscriptions, teams } from "@template/db";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export interface LemonsqueezySubscription {
  id: string;
  type: string;
  attributes: Attributes;
  relationships: any;
}

export interface Attributes {
  store_id: number;
  customer_id: number;
  order_id: number;
  order_item_id: number;
  product_id: number;
  variant_id: number;
  product_name: string;
  variant_name: string;
  user_name: string;
  user_email: string;
  status: string;
  status_formatted: string;
  card_brand: string;
  card_last_four: string;
  pause: string | null;
  cancelled: boolean;
  trial_ends_at: string | null;
  billing_anchor: number;
  urls: {
    update_payment_method: string;
  };
  renews_at: string;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
  test_mode: boolean;
}

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

// Add more events here if you want
// https://docs.lemonsqueezy.com/api/webhooks#event-types
type EventName =
  | "order_created"
  | "order_refunded"
  | "subscription_created"
  | "subscription_updated"
  | "subscription_cancelled"
  | "subscription_resumed"
  | "subscription_expired"
  | "subscription_paused"
  | "subscription_unpaused"
  | "subscription_payment_failed"
  | "subscription_payment_success"
  | "subscription_payment_recovered";

type Payload = {
  meta: {
    test_mode: boolean;
    event_name: EventName;
    custom_data: {
      teamId: string;
    };
  };
  data: LemonsqueezySubscription;
};

export const POST = async (req: NextRequest) => {
  try {
    const rawBody = await req.text();
    const hmac = crypto.createHmac("sha256", process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "");
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signature = Buffer.from(req.headers.get("x-signature") as string, "utf8");

    if (!crypto.timingSafeEqual(digest, signature)) {
      return new Response("Invalid signature.", {
        status: 400,
      });
    }

    const payload = JSON.parse(rawBody);

    const {
      meta: {
        event_name: eventName,
        custom_data: { teamId },
      },
      data: subscription,
    } = payload as Payload;

    switch (eventName) {
      case "order_created":
        // Do stuff here if you are using orders
        break;
      case "order_refunded":
        // Do stuff here if you are using orders
        break;
      case "subscription_created":
      case "subscription_updated":
      case "subscription_cancelled":
      case "subscription_resumed":
      case "subscription_expired":
      case "subscription_paused":
      case "subscription_unpaused":
      case "subscription_payment_failed":
      case "subscription_payment_success":
      case "subscription_payment_recovered":
        await db.transaction(async (tx) => {
          console.log(`Updating team: ${teamId}`);
          await tx
            .update(teams)
            .set({ customerId: subscription.attributes.customer_id })
            .where(eq(teams.id, Number.parseInt(teamId, 10)));

          console.log(`Updating subscription: ${subscription.id}`);
          const parsedSubscription = insertSubscriptionSchema.parse({
            cardBrand: subscription.attributes.card_brand,
            cardLastFour: subscription.attributes.card_last_four,
            id: subscription.id,
            productId: subscription.attributes.product_id,
            productName: subscription.attributes.product_name,
            status: subscription.attributes.status,
            teamId: Number.parseInt(teamId, 10),
            updatePaymentUrl: subscription.attributes.urls.update_payment_method,
            variantId: subscription.attributes.variant_id,
            variantName: subscription.attributes.variant_name,
            endsAt: subscription.attributes.ends_at ? new Date(subscription.attributes.ends_at) : null,
            renewsAt: subscription.attributes.renews_at ? new Date(subscription.attributes.renews_at) : null,
            trialEndsAt: subscription.attributes.trial_ends_at ? new Date(subscription.attributes.trial_ends_at) : null,
          });

          await tx
            .insert(subscriptions)
            .values(parsedSubscription)
            .onDuplicateKeyUpdate({ set: { ...parsedSubscription, updatedAt: new Date() } });
        });

        break;
      default:
        throw new Error(`🤷‍♀️ Unhandled event: ${eventName}`);
    }
  } catch (error: unknown) {
    if (isError(error)) {
      console.error(error.message);
      return new Response(`Webhook error: ${error.message}`, {
        status: 400,
      });
    }

    console.error(error);

    return new Response("Webhook error", {
      status: 400,
    });
  }

  return new Response(null, {
    status: 200,
  });
};
