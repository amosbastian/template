import { buildSendMail } from "mailing-core";
import nodemailer from "nodemailer";

const transactionalTransport = nodemailer.createTransport({
  host: "smtp.mailersend.net",
  port: 587,
  auth: {
    user: process.env["MAILER_SEND_USERNAME"],
    pass: process.env["MAILER_SEND_PASSWORD"],
  },
});

export const sendTransactionalEmail = buildSendMail({
  transport: transactionalTransport,
  defaultFrom: "Template <amos@mentionfunnel.com>",
  configPath: "./mailing.config.json",
});

export * from "./VerifyEmail";

export default sendTransactionalEmail;
