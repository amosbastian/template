import { BRAND_NAME } from "@template/configuration";
import sendEmail, { TeamInvitation } from "@template/utility/email";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { invitedByEmail, teamName, userEmail, invitedByName, name, teamImage, userImage, inviteLink } = JSON.parse(
    req.body,
  );

  await sendEmail({
    subject: invitedByName
      ? `${invitedByName} invited you to ${teamName} team on ${BRAND_NAME}`
      : `You've been invited to ${teamName} team on ${BRAND_NAME}`,
    to: userEmail,
    component: (
      <TeamInvitation
        invitedByEmail={invitedByEmail}
        teamName={teamName}
        userEmail={userEmail}
        invitedByName={invitedByName}
        name={name}
        inviteLink={inviteLink}
      />
    ),
  });

  return res.status(200).json({});
}
