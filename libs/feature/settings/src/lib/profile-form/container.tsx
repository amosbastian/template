import { getAuthentication } from "@template/authentication";
import { ProfileFormInner, ProfileFormInnerProps } from "./form";

export async function ProfileForm(props: ProfileFormInnerProps) {
  const { user } = await getAuthentication();

  return <ProfileFormInner {...props} defaultValues={user ?? undefined} emailVerified={user?.emailVerified} />;
}

export function ProfileFormLoading(props: { className?: string }) {
  return <ProfileFormInner {...props} isDisabled />;
}
