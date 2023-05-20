"use client";

import { api } from "@template/utility/trpc-next-client";

export function ClientProviders({ children }: { children?: React.ReactNode }) {
  return <api.Provider>{children}</api.Provider>;
}
