import { TeamForm, TeamFormLoading } from "@template/feature/team/server";
import { Card, CardContent, CardHeader, CardTitle } from "@template/ui/web";
import { Metadata } from "next";
import { Suspense } from "react";

export default async function GeneralSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        General
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TeamFormLoading className="max-w-[360px]" />}>
            <TeamForm className="max-w-[360px]" />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your team",
};
