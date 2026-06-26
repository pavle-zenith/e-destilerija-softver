import type { Metadata, Viewport } from "next";
import "./globals.css";
import { sr } from "@/i18n/sr";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: `${sr.app.naziv} — ${sr.app.opis}`,
  description: sr.app.opis,
  manifest: "/manifest.webmanifest",
  applicationName: sr.app.naziv,
  appleWebApp: { capable: true, title: sr.app.naziv, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#7c2d12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr-Latn-RS" className="h-full antialiased">
      <body className="min-h-full bg-neutral-50 text-neutral-900">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 px-6 py-6 lg:px-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
