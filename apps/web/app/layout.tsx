import { BASE_URL, BRAND_NAME } from "@template/configuration";
import type { Metadata } from "next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

export const metadata: Metadata = {
  title: {
    default: BRAND_NAME,
    template: `%s | ${BRAND_NAME}`,
  },
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
  icons: {
    icon: "/images/favicon-196.png",
    shortcut: "/images/favicon-196.png",
    apple: "/images/apple-icon-180.png",
  },
  manifest: `${BASE_URL}/site.webmanifest`,
};
