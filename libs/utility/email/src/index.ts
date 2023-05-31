import { BASE_URL, BRAND_NAME } from "@template/configuration";
import { buildSendMail } from "mailing-core";
import nodemailer from "nodemailer";

function extractHostname(url: string): string {
  const parsedUrl = new URL(url);
  return parsedUrl.hostname;
}

const transactionalTransport = nodemailer.createTransport({
  host: "smtp.mailersend.net",
  port: 587,
  auth: {
    user: process.env["MAILER_SEND_USERNAME"],
    pass: process.env["MAILER_SEND_PASSWORD"],
  },
});

export const sendEmail = buildSendMail({
  transport: transactionalTransport,
  defaultFrom: `${BRAND_NAME} <system@${extractHostname(BASE_URL)}>`,
  configPath: "./mailing.config.json",
});

export * from "./VerifyEmail";

export default sendEmail;
