import { BASE_URL, BRAND_NAME } from "@template/configuration";
import { buildSendMail } from "mailing-core";
import nodemailer from "nodemailer";

function extractHostname(url: string): string {
  const parsedUrl = new URL(url);
  return parsedUrl.hostname;
}

// https://www.mailing.run/docs/sending-email
const transactionalTransport = nodemailer.createTransport({
  host: process.env["SMTP_HOST"] as string,
  port: Number.parseInt(process.env["SMTP_PORT"] as string, 10),
  auth: {
    user: process.env["SMTP_USERNAME"],
    pass: process.env["SMTP_PASSWORD"],
  },
});

export const sendEmail = buildSendMail({
  transport: transactionalTransport,
  defaultFrom: `${BRAND_NAME} <system@${extractHostname(BASE_URL)}>`,
  configPath: "./mailing.config.json",
});

export * from "./emails/team-invitation";
export * from "./emails/verify-email";

export default sendEmail;
