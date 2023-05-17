import { SignInForm, SignUpForm } from "@template/feature/authentication/server";
import { InterceptDialog } from "@template/ui";

export default async function Page() {
  return (
    <InterceptDialog>
      <SignInForm className="p-0" />
    </InterceptDialog>
  );
}
