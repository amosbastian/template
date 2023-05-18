import { SignInForm } from "@template/feature/authentication/server";
import { InterceptDialog } from "@template/ui";

export default async function Page() {
  return (
    <InterceptDialog pathname="/sign-in">
      <SignInForm className="p-0" />
    </InterceptDialog>
  );
}
