import { FeatureBilling } from "@template/feature/billing";
import { Metadata } from "next";

export default async function NotificationsSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Billing
      </h2>
      <FeatureBilling />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Billing",
  description: "Manage your payments",
};
