import { ProfileForm, ProfileFormLoading } from "@template/feature/settings/server";
import { Card, CardContent, CardHeader, CardTitle } from "@template/ui/web";
import { Metadata } from "next";
import { Suspense } from "react";

export default async function ProfileSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Profile
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ProfileFormLoading />}>
            <ProfileForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your general settings",
};
