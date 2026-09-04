import Link from "next/link";
import { todaysLocation } from "../../data/location";

export default function LokasiHariIniPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Lokasi Hari Ini
      </h1>

      <div className="border border-border rounded-lg p-5">
        <p className="text-lg font-semibold text-foreground">
          {todaysLocation.locationName}
        </p>
        <p className="text-foreground/70 mt-1">
          {todaysLocation.startTime} - {todaysLocation.endTime}
        </p>
        {todaysLocation.note && (
          <p className="text-sm text-foreground/50 mt-2">
            {todaysLocation.note}
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