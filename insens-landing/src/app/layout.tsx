import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Insens — The Luxury Fragrance Marketplace",
  description:
    "Discover, buy, and sell rare artisan fragrances. Insens connects perfume lovers with independent houses and collectors worldwide.",
  keywords: "perfume, fragrance, luxury, artisan, marketplace, oud, niche perfume",
  openGraph: {
    title: "Insens — The Luxury Fragrance Marketplace",
    description: "Discover rare artisan fragrances from independent houses worldwide.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
