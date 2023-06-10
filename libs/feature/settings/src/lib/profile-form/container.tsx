import { getAuthentication } from "@template/authentication";
import { ProfileFormInner } from "./form";

export async function ProfileForm() {
  const { user } = await getAuthentication();

  return (
    <ProfileFormInner className="max-w-[360px]" defaultValues={user ?? undefined} emailVerified={user?.emailVerified} />
  );
}

export function ProfileFormLoading() {
  return <ProfileFormInner className="max-w-[360px]" isDisabled />;
}
