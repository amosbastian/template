import { InviteMembersForm, TeamTabs } from "@template/feature/team";
import { InviteTable, TeamTable } from "@template/feature/team/server";
import { TabsContent } from "@template/ui/web";
import { Metadata } from "next";

export default async function TeamSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Members
      </h2>
      <InviteMembersForm />
      <TeamTabs>
        <TabsContent value="members">
          {/* @ts-expect-error RSC */}
          <TeamTable />
        </TabsContent>
        <TabsContent value="invitations">
          {/* @ts-expect-error RSC */}
          <InviteTable />
        </TabsContent>
      </TeamTabs>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Members",
  description: "Manage your team members",
};
