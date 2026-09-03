"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export default function AdminDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Selamat datang, Admin!
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm text-foreground/60 hover:text-red-500 transition-colors"
        >
          Logout
        </button>
      </div>
      <p className="text-foreground/60 mt-2">
        Halaman ini berhasil diakses karena kamu sudah login.
      </p>
    </main>
  );
}