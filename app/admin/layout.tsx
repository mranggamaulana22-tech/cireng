"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";
import ThemeToggle from "../components/ThemeToggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="text-lg font-bold text-primary">
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

      {children}
    </div>
  );
}