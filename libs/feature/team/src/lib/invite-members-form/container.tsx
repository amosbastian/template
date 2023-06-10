import { getAuthentication } from "@template/authentication";
import { defineAbilityFor } from "@template/authorisation";
import { InviteMembersFormInner, InviteMembersFormInnerProps } from "./form";

export async function InviteMembersForm(props: InviteMembersFormInnerProps) {
  const { user } = await getAuthentication();

  const ability = await defineAbilityFor(user ? { userId: user.id, teamId: user.activeTeamId } : undefined);

  return <InviteMembersFormInner {...props} isDisabled={ability.cannot("invite", "Member")} />;
}

export function InviteMembersFormLoading() {
  return <InviteMembersFormInner isDisabled />;
}
