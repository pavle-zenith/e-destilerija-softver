import { Sidebar } from "@/components/sidebar";

/** Shell zaštićenog dela aplikacije (sidebar + sadržaj). */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-6 py-6 lg:px-10">{children}</main>
    </div>
  );
}
