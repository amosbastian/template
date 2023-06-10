import { TeamTabs } from "@template/feature/team";
import {
  InviteMembersForm,
  InviteMembersFormLoading,
  InviteTable,
  InviteTableLoading,
  TeamTable,
  TeamTableLoading,
} from "@template/feature/team/server";
import { TabsContent } from "@template/ui/web";
import { Metadata } from "next";
import { Suspense } from "react";

export default async function TeamSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Members
      </h2>
      <Suspense fallback={<InviteMembersFormLoading />}>
        <InviteMembersForm />
      </Suspense>
      <TeamTabs>
        <TabsContent value="members">
          <Suspense fallback={<TeamTableLoading />}>
            <TeamTable />
          </Suspense>
        </TabsContent>
        <TabsContent value="invitations">
          <Suspense fallback={<InviteTableLoading />}>
            <InviteTable />
          </Suspense>
        </TabsContent>
      </TeamTabs>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Members",
  description: "Manage your team members",
};
