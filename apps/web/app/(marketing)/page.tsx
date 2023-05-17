import { Header } from "@template/ui/server";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto flex h-full max-w-2xl flex-col gap-4 pb-4 pt-16">{children}</main>
    </>
  );
}
