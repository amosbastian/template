import { getUser } from "@template/feature/authentication/server";
import { Header } from "@template/ui/server";

export default async function Page({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return (
    <>
      <Header />
      <main className="mx-auto flex h-full max-w-2xl flex-col gap-4 pb-4 pt-16">
        {children}
        <pre className="bg-accent m-auto rounded p-4">{JSON.stringify(user, null, 2)}</pre>
      </main>
    </>
  );
}
