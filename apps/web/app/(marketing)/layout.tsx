import { Footer } from "@template/ui/web";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="h-full">{children}</main>
      <Footer />
    </>
  );
}
