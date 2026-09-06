export const dynamic = "force-dynamic";

import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default async function LokasiHariIniPage() {
  const { data: location } = await supabase
    .from("locations")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!location) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Lokasi Hari Ini
        </h1>
        <p className="text-foreground/60">
          Informasi lokasi belum tersedia untuk hari ini.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Lokasi Hari Ini
      </h1>

      <div className="border border-border rounded-lg p-5">
        <p className="text-lg font-semibold text-foreground">
          {location.location_name}
        </p>
        <p className="text-foreground/70 mt-1">
          {location.start_time} - {location.end_time}
        </p>
        {location.description && (
          <p className="text-sm text-foreground/50 mt-2">
            {location.description}
          </p>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-foreground/70 mb-3">Tidak bisa datang?</p>
        <Link
          href="/menu"
          className="inline-block py-2.5 px-6 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          Pesan Online, Kami Antar
        </Link>
      </div>
    </main>
  );
}