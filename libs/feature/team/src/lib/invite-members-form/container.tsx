import { getAuthentication } from "@template/authentication";
import { defineAbilityFor } from "@template/authorisation";
import { InviteMembersFormInner } from "./form";

export async function InviteMembersForm() {
  const { user } = await getAuthentication();

  const ability = await defineAbilityFor(user ? { userId: user.id, teamId: user.activeTeamId } : undefined);

  return <InviteMembersFormInner isDisabled={ability.cannot("invite", "Member")} />;
}

export function InviteMembersFormLoading() {
  return <InviteMembersFormInner isDisabled />;
}
