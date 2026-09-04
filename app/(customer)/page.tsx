import Link from "next/link";
import StoreStatusCard from "../components/StoreStatusCard";
import AnnouncementBoard from "../components/AnnouncementBoard";
import LocationTodayCard from "../components/LocationTodayCard";
import MenuPreview from "../components/MenuPreview";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-primary">
          Lagi Mager Tapi Pengen Jajan?
        </h1>
        <p className="text-foreground/70 mt-2">
          Cireng A&R Seyegan — jajanan favorit di Seyegan.
        </p>
        <Link
          href="/menu"
          className="inline-block mt-4 py-2.5 px-6 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          Pesan Sekarang
        </Link>
      </div>

      <StoreStatusCard />
      <AnnouncementBoard />
      <LocationTodayCard />
      <MenuPreview />
    </main>
  );
}