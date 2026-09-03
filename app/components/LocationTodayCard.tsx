import Link from "next/link";
import { todaysLocation } from "../data/location";

export default function LocationTodayCard() {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="font-semibold text-foreground">Lokasi Hari Ini</p>
      <p className="text-sm text-foreground mt-1">
        {todaysLocation.locationName}
      </p>
      <p className="text-sm text-foreground/70">
        {todaysLocation.startTime} - {todaysLocation.endTime}
      </p>
      {todaysLocation.note && (
        <p className="text-xs text-foreground/50 mt-1">{todaysLocation.note}</p>
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