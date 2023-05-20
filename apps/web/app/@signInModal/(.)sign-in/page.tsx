import { SignInForm } from "@template/feature/authentication/server";
import { DialogContent, InterceptDialog } from "@template/ui";

export default async function Page() {
  return (
    <InterceptDialog pathname="/sign-in">
      <DialogContent className="sm:max-w-[420px]">
        <div className="grid gap-4">
          <SignInForm className="p-0" />
        </div>
      </DialogContent>
    </InterceptDialog>
  );
}
