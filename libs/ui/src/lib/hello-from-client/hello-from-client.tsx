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

export function HelloFromClientProtected() {
  const { data, isLoading, error } = api.example.helloPrivate.useQuery({
    text: "Test Client tRPC Call (protected)",
  });

  if (isLoading) return <>Loading...</>;
  if (error) {
    console.log(error.message);
    return <>Error</>;
  }

  return <>{data.greeting}</>;
}
