import { getUser } from "@template/feature/authentication/server";
import { Header } from "@template/ui/server";
import { api } from "@template/utility/trpc-next-server";

export default async function Page({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  const { greeting } = await api.example.hello.fetch({
    text: "Test RSC TRPC Call",
  });

  return (
    <>
      <Header />
      <main className="mx-auto flex h-full max-w-2xl flex-col gap-4 pb-4 pt-16">
        {children}
        <pre className="bg-accent m-auto rounded p-4">{JSON.stringify(user, null, 2)}</pre>
        <div>
          <h2>Fetching data from an RSC:</h2>
          <pre>
            {`
import { api } from "@template/trpc-next-server";

export default async function ServerComponent() {
  const { greeting } = await api.example.hello.fetch({
    text: "Test RSC TRPC Call",
  });

  return <p>{greeting}</p>
}`}
          </pre>
          <p>Output:</p>
          <div className="bg-accent mt-2 flex rounded border p-4">
            <p>{greeting}</p>
          </div>
        </div>
      </main>
    </>
  );
}
