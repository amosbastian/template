import { getAuthentication } from "@template/authentication";
import { redirect } from "next/navigation";
import { Header } from "@template/feature/dashboard/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getAuthentication();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="h-full">
      {/* @ts-expect-error RSC */}
      <Header />
      <div></div>
    </main>
  );
}
