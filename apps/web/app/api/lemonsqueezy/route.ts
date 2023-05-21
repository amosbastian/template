import { LemonsqueezySubscription } from "@template/utility/payment";
import crypto from "crypto";
import { NextRequest } from "next/server";

// Add more events here if you want
// https://docs.lemonsqueezy.com/api/webhooks#event-types
type EventName =
  | "order_created"
  | "order_refunded"
  | "subscription_created"
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
  };
  data: LemonsqueezySubscription;
};

// {
//   "meta": {
//     "test_mode": true,
//     "event_name": "subscription_created"
//   },
//   "data": {
//     "type": "subscriptions",
//     "id": "61133",
//     "attributes": {
//       "store_id": 19927,
//       "customer_id": 747143,
//       "order_id": 770133,
//       "order_item_id": 736019,
//       "product_id": 76954,
//       "variant_id": 79553,
//       "product_name": "Pro",
//       "variant_name": "Yearly",
//       "user_name": "Amos Bastian",
//       "user_email": "amosbastian@googlemail.com",
//       "status": "active",
//       "status_formatted": "Active",
//       "card_brand": "visa",
//       "card_last_four": "4242",
//       "pause": null,
//       "cancelled": false,
//       "trial_ends_at": null,
//       "billing_anchor": 21,
//       "urls": {
//         "update_payment_method": "https://amos.lemonsqueezy.com/subscription/61133/payment-details?expires=1684793564&signature=65ebeded069986ad1086b860ee751c57cf00e8066266aef44a8d97ee22424423"
//       },
//       "renews_at": "2023-06-21T22:12:39.000000Z",
//       "ends_at": null,
//       "created_at": "2023-05-21T22:12:41.000000Z",
//       "updated_at": "2023-05-21T22:12:43.000000Z",
//       "test_mode": true
//     },
//     "relationships": {
//       "store": {
//         "links": {
//           "related": "https://api.lemonsqueezy.com/v1/subscriptions/61133/store",
//           "self": "https://api.lemonsqueezy.com/v1/subscriptions/61133/relationships/store"
//         }
//       },
//       "customer": {
//         "links": {
//           "related": "https://api.lemonsqueezy.com/v1/subscriptions/61133/customer",
//           "self": "https://api.lemonsqueezy.com/v1/subscriptions/61133/relationships/customer"
//         }
//       },
//       "order": {
//         "links": {
//           "related": "https://api.lemonsqueezy.com/v1/subscriptions/61133/order",
//           "self": "https://api.lemonsqueezy.com/v1/subscriptions/61133/relationships/order"
//         }
//       },
//       "order-item": {
//         "links": {
//           "related": "https://api.lemonsqueezy.com/v1/subscriptions/61133/order-item",
//           "self": "https://api.lemonsqueezy.com/v1/subscriptions/61133/relationships/order-item"
//         }
//       },
//       "product": {
//         "links": {
//           "related": "https://api.lemonsqueezy.com/v1/subscriptions/61133/product",
//           "self": "https://api.lemonsqueezy.com/v1/subscriptions/61133/relationships/product"
//         }
//       },
//       "variant": {
//         "links": {
//           "related": "https://api.lemonsqueezy.com/v1/subscriptions/61133/variant",
//           "self": "https://api.lemonsqueezy.com/v1/subscriptions/61133/relationships/variant"
//         }
//       },
//       "subscription-invoices": {
//         "links": {
//           "related": "https://api.lemonsqueezy.com/v1/subscriptions/61133/subscription-invoices",
//           "self": "https://api.lemonsqueezy.com/v1/subscriptions/61133/relationships/subscription-invoices"
//         }
//       }
//     },
//     "links": {
//       "self": "https://api.lemonsqueezy.com/v1/subscriptions/61133"
//     }
//   }
// }

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
      meta: { event_name: eventName },
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
      case "subscription_cancelled":
      case "subscription_resumed":
      case "subscription_expired":
      case "subscription_paused":
      case "subscription_unpaused":
      case "subscription_payment_failed":
      case "subscription_payment_success":
      case "subscription_payment_recovered":
        console.log("Update subscription");
        break;
      default:
        throw new Error(`🤷‍♀️ Unhandled event: ${eventName}`);
    }
  } catch (error: unknown) {
    if (typeof error === "string") {
      return new Response("Webhook error", {
        status: 400,
      });
    }

    if (error instanceof Error) {
      return new Response(`Webhook error: ${error.message}`, {
        status: 400,
      });
    }

    throw error;
  }

  return new Response(null, {
    status: 200,
  });
};
