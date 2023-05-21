import { TeamInvite, type TeamInviteProps } from "@template/ui/email";
import { type SendEmailData } from "resend";
import { client } from "../client";

export const sendTeamInvite = (data: SendEmailData, props: TeamInviteProps) => {
  client.sendEmail({
    ...data,
    react: <TeamInvite {...props} />,
  });
};
