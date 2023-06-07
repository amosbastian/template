import { Header } from "@template/ui/web/server";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Index");

  return (
    <>
      <Header />
      <main className="mx-auto flex h-full max-w-2xl flex-col gap-8 pb-16 pt-16">
        <h1>{t("title")}</h1>
      </main>
    </>
  );
}
