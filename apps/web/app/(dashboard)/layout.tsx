import { getAuthentication } from "@template/authentication";
import { Header } from "@template/feature/dashboard/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getAuthentication();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="h-full w-full">
      {/* @ts-expect-error RSC */}
      <Header />
      <div className="h-full w-full">{children}</div>
    </div>
  );
}
