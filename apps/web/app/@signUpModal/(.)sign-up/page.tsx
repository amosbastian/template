import { SignUpForm } from "@template/feature/authentication/server";
import { InterceptDialog } from "@template/ui";

export default async function Page() {
  return (
    <InterceptDialog pathname="/sign-up">
      <SignUpForm className="p-0" />
    </InterceptDialog>
  );
}
