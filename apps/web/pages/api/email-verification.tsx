import sendEmail, { VerifyEmail } from "@template/utility/email";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, name, verificationLink } = JSON.parse(req.body);

  await sendEmail({
    subject: "Verify your email",
    to: email,
    component: <VerifyEmail name={name} verificationLink={verificationLink} />,
  });

  return res.status(200).json({});
}
