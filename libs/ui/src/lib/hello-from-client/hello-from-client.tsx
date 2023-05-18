"use client";

import { api } from "@template/utility/trpc-next-client";

export function HelloFromClient() {
  const { data, isLoading } = api.example.hello.useQuery({
    text: "Test Client tRPC Call",
  });

  if (isLoading) return <>Loading...</>;
  if (!data) return <>Error</>;

  return <>{data.greeting}</>;
}
