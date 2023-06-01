import { BASE_URL } from "@template/configuration";
import { TeamInvitation } from "../emails/team-invitation";

export function Preview() {
  return (
    <TeamInvitation
      inviteLink={`${BASE_URL}/api/accept-team-invitation/abc`}
      invitedByEmail="amosbastian@gmail.com"
      invitedByName="Amos Bastian"
      name="Jane"
      teamName="The Avengers"
      userEmail="jane@example.com"
    />
  );
}
