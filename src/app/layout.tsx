import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { sr } from "@/i18n/sr";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${sr.app.naziv} — ${sr.app.opis}`,
  description: sr.app.opis,
  manifest: "/manifest.webmanifest",
  applicationName: sr.app.naziv,
  appleWebApp: { capable: true, title: sr.app.naziv, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr-Latn-RS" className={`h-full antialiased ${inter.variable}`}>
      <body className="min-h-full bg-neutral-100 font-sans text-neutral-900">{children}</body>
    </html>
  );
}
