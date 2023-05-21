import { FeatureNotifications } from "@template/feature/notifications";
import { Metadata } from "next";

export default async function NotificationsSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Notifications
      </h2>
      <FeatureNotifications />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Notifications",
  description: "Manage your notifications",
};
