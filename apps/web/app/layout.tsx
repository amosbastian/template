import { BASE_URL, BRAND_DESCRIPTION, BRAND_NAME } from "@template/configuration";
import { ThemeProvider } from "@template/ui";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles.css";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Note! If you do not add suppressHydrationWarning to your <html> you will get warnings
    // because next-themes updates that element. This property only applies one level deep,
    // so it won't block hydration warnings on other elements.
    <html
      lang="en"
      suppressHydrationWarning
      className={`flex h-full min-h-screen flex-col antialiased bg-background ${inter.className}`}
    >
      <body className="h-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex h-full flex-col">
            <main className="mx-auto flex h-full max-w-2xl flex-col gap-4 pb-4 pt-16">{children}</main>
          </div>
        </ThemeProvider>
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
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Radix UI",
    "Drizzle ORM",
    "Server Actions",
    "Parallel Routes",
    "PlanetScale",
    "Lemon Squeezy",
  ],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    title: BRAND_NAME,
    description: BRAND_DESCRIPTION,
    url: BASE_URL,
    siteName: BRAND_NAME,
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  twitter: {
    title: BRAND_NAME,
    description: BRAND_DESCRIPTION,
    card: "summary_large_image",
    creator: "@amosbastian",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${BASE_URL}/site.webmanifest`,
};
