import { client } from "../client";

export async function createCheckout({
  teamId,
  variant,
}: {
  teamId: number;
  variant: string | number;
}): ReturnType<typeof client.createCheckout> {
  const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: {
              teamId: `${teamId}`,
            },
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env["LEMON_SQUEEZY_STORE_ID"],
            },
          },
          variant: {
            data: {
              type: "variants",
              id: variant,
            },
          },
        },
      },
    }),
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${process.env["LEMON_SQUEEZY_API_KEY"]}`,
      "Content-Type": "application/vnd.api+json",
    },
    method: "POST",
  });

  return response.json();
}
