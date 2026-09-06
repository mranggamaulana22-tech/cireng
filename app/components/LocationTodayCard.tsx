import Link from "next/link";
import { supabase } from "../lib/supabase";

export default async function LocationTodayCard() {
  const { data: location } = await supabase
    .from("locations")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!location) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border p-4">
      <p className="font-semibold text-foreground">Lokasi Hari Ini</p>
      <p className="text-sm text-foreground mt-1">{location.location_name}</p>
      <p className="text-sm text-foreground/70">
        {location.start_time} - {location.end_time}
      </p>
      {location.description && (
        <p className="text-xs text-foreground/50 mt-1">
          {location.description}
        </p>
      )}
      <Link
        href="/lokasi-hari-ini"
        className="text-xs text-primary font-medium mt-2 inline-block hover:underline"
      >
        Lihat Lokasi →
      </Link>
    </div>
  );
}