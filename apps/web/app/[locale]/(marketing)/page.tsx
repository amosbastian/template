import { Header } from "@template/ui/web/server";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

export default function Page() {
  const { t } = useTranslation("common");
  return (
    <>
      <Header />
      <main className="mx-auto flex h-full max-w-2xl flex-col gap-8 pb-16 pt-16">
        <h1>{t("title")}</h1>
        <Link href="/nl">NL</Link>
        <Link href="/en">EN</Link>
      </main>
    </>
  );
}
