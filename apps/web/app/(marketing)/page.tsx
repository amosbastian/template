import { getAuthentication } from "@template/authentication";
import { HelloFromClient, HelloFromClientProtected } from "@template/ui/web";
import { Header } from "@template/ui/web/server";
import { api } from "@template/utility/trpc-next-server";

export default async function Page({ children }: { children: React.ReactNode }) {
  const { user } = await getAuthentication();

  const { greeting } = await api.example.hello.fetch({
    text: "Test RSC tRPC Call",
  });

  return (
    <>
      {/* @ts-expect-error RSC */}
      <Header />
      <main className="mx-auto flex h-full max-w-2xl flex-col gap-8 pb-16 pt-16">
        {children}
        <h2 className="scroll-m-20 border-b pb-2 pt-12 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          User data
        </h2>
        <pre className="bg-accent m-auto rounded p-4">{JSON.stringify(user, null, 2)}</pre>
        <h2 className="scroll-m-20 border-b pb-2 pt-12 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Fetching data (client)
        </h2>
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
        <h2 className="scroll-m-20 border-b pb-2 pt-12 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Fetching PROTECTED data (client)
        </h2>
        <pre className="bg-accent m-auto rounded p-4">
          {`
"use client";

import { api } from "@template/utility/trpc-next-client";

export default function HelloFromClientProtected() {
  const { data, isLoading } = api.example.helloProtected.useQuery({
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
            <HelloFromClientProtected />
          </p>
        </div>
        <h2 className="scroll-m-20 border-b pb-2 pt-12 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Fetching data (RSC):
        </h2>
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
