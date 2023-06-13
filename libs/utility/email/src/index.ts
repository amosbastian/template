import { BASE_URL, BRAND_NAME } from "@template/configuration";
import { openPreview, render } from "mailing-core";
import { Resend } from "resend";
import type { CreateEmailOptions, CreateEmailRequestOptions } from "resend/build/src/emails/interfaces";

const resend = new Resend(process.env["RESEND_API_KEY"]);

function extractHostname(url: string): string {
  const parsedUrl = new URL(url);
  return parsedUrl.hostname;
}

type Payload = Omit<CreateEmailOptions, "from"> & {
  component: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  from?: string;
};

export function sendEmail(
  { component, from = `${BRAND_NAME} <system@${extractHostname(BASE_URL)}>`, ...rest }: Payload,
  options?: CreateEmailRequestOptions | undefined,
) {
  const { html } = render(component);

  if (process.env.NODE_ENV === "development") {
    return openPreview({ component, html, from, ...rest }, { from, html, ...rest }, "http://localhost:3883");
  }

  return resend.emails.send({ html, from, ...rest }, options);
}

export * from "./emails/team-invitation";
export * from "./emails/verify-email";

export default sendEmail;
