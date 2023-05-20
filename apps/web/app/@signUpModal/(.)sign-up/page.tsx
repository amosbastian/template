import { SignUpForm } from "@template/feature/authentication/server";
import { DialogContent, InterceptDialog } from "@template/ui";

export default async function Page() {
  return (
    <InterceptDialog pathname="/sign-up">
      <DialogContent className="sm:max-w-[420px]">
        <div className="grid gap-4">
          <SignUpForm className="p-0" />
        </div>
      </DialogContent>
    </InterceptDialog>
  );
}
