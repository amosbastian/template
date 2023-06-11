import { Footer } from "@template/ui/web";
import { Header } from "@template/ui/web/server";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-full py-24">{children}</main>
      <Footer />
    </>
  );
}
