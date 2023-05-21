"use client";

import { Tabs, TabsList, TabsTrigger } from "@template/ui/web";

export const TeamTabs = ({ children }: { children: React.ReactNode }) => {
  return (
    <Tabs defaultValue="members">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="members">Team members</TabsTrigger>
        <TabsTrigger value="invitations">Pending invitations</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};
