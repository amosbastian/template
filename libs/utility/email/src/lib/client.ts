import { Resend } from "resend";

export const client = new Resend(process.env["RESEND_API_KEY"]);
