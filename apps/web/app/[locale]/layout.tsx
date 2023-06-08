import { BASE_URL, BRAND_DESCRIPTION, BRAND_NAME } from "@template/configuration";
import { Footer } from "@template/ui/web";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClientProviders } from "../client-providers";
import "../styles.css";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
  signInModal,
  signUpModal,
  params,
}: {
  children: React.ReactNode;
  signInModal: React.ReactNode;
  signUpModal: React.ReactNode;
  params: {
    locale: string;
  };
}) {
  return (
    // Note! If you do not add suppressHydrationWarning to your <html> you will get warnings
    // because next-themes updates that element. This property only applies one level deep,
    // so it won't block hydration warnings on other elements.
    <html
      lang={params.locale}
      suppressHydrationWarning
      className={`bg-background flex h-full min-h-screen flex-col antialiased ${inter.className}`}
    >
      <body className="h-full">
        <ClientProviders>
          {children}
          {signInModal}
          {signUpModal}
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    default: BRAND_NAME,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  metadataBase: new URL(BASE_URL),
  authors: [
    {
      name: "Amos Bastian",
      url: "https://amosbastian.com",
    },
  ],
  openGraph: {
    title: BRAND_NAME,
    description: BRAND_DESCRIPTION,
    url: BASE_URL,
    siteName: BRAND_NAME,
    locale: "en-US",
    type: "website",
  },
  twitter: {
    title: BRAND_NAME,
    description: BRAND_DESCRIPTION,
    card: "summary_large_image",
    creator: "@amosbastian",
  },
};
