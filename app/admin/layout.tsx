
"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";
import ThemeToggle from "../components/ThemeToggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const isDashboard = pathname === "/admin";

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <Link
          href="/admin"
          className="text-lg font-bold text-primary"
        >
          Cireng A&R — Admin
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            onClick={handleLogout}
            className="text-sm text-foreground/60 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {!isDashboard && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <Link
            href="/admin"
            aria-label="Kembali ke Dashboard"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-background shadow-sm text-foreground hover:bg-muted hover:text-primary transition-all"
          >
            ←
          </Link>
        </div>
      )}

      {children}
    </div>
  );
}

