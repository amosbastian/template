import { Header } from "@template/ui/web/server";

export default async function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* @ts-expect-error RSC */}
      <Header />
      <main className="mx-auto flex h-full max-w-2xl flex-col gap-8 pb-16 pt-16">{children}</main>
    </>
  );
}
