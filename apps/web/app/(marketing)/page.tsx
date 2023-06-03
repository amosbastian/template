import { Header } from "@template/ui/web/server";

export default async function Page() {
  return (
    <>
      <Header />
      <main className="mx-auto flex h-full max-w-2xl flex-col gap-8 pb-16 pt-16"></main>
    </>
  );
}
