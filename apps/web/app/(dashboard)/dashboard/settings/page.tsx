import { ProfileForm } from "@template/feature/settings";
import { Metadata } from "next";

export default async function NotificationsSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        General
      </h2>
      <ProfileForm className="max-w-[360px]" />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your general settings",
};
