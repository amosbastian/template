"use client";

import { ThemeProvider, Toaster } from "@template/ui/web";
import { api } from "@template/utility/trpc-next-client";

export function ClientProviders({ children }: { children?: React.ReactNode }) {
  return (
    <api.Provider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster />
        {children}
      </ThemeProvider>
    </api.Provider>
  );
}
