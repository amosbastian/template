import { getUser } from "@template/feature/authentication/server";
import { Header } from "@template/ui/server";
import { api } from "@template/utility/trpc-next-server";
import { HelloFromClient } from "@template/ui";

export default async function Page({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  const { greeting } = await api.example.hello.fetch({
    text: "Test RSC tRPC Call",
  });

  return (
    <>
      <Header />
      <main className="mx-auto flex h-full max-w-2xl flex-col gap-4 pb-4 pt-16">
        {children}
        <pre className="bg-accent m-auto rounded p-4">{JSON.stringify(user, null, 2)}</pre>
        <h2>Fetching data from a client component</h2>
        <pre className="bg-accent m-auto rounded p-4">
          {`
"use client";

import { api } from "@template/utility/trpc-next-client";

export default function HelloFromClient() {
  const { data, isLoading } = api.example.hello.useQuery({
    text: "Test Client tRPC Call",
  });

  if (isLoading) return <>Loading...</>;
  if (!data) return <>Error</>;

  return <>{data.greeting}</>;
}`}
        </pre>
        <p>Output:</p>
        <div className="bg-accent m-auto rounded p-4">
          <p>
            <HelloFromClient />
          </p>
        </div>
        <h2>Fetching data from a server component with tRPC:</h2>
        <pre className="bg-accent m-auto rounded p-4">
          {`
import { api } from "@template/utility/trpc-next-server";

export default async function ServerComponent() {
  const { greeting } = await api.example.hello.fetch({
    text: "Test RSC tRPC Call",
  });

  return <p>{greeting}</p>
}`}
        </pre>
        <p>Output:</p>
        <div className="bg-accent m-auto rounded p-4">
          <p>{greeting}</p>
        </div>
      </main>
    </>
  );
}
