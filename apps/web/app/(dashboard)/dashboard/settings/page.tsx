import { getAuthentication } from "@template/authentication";
import { ProfileForm } from "@template/feature/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@template/ui/web";
import { Metadata } from "next";

export default async function GeneralSettings() {
  const { user } = await getAuthentication();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        General
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm className="max-w-[360px]" defaultValues={user ?? undefined} />
        </CardContent>
      </Card>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your general settings",
};
