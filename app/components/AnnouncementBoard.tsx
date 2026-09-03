import { announcements } from "../data/announcements";

const typeLabel: Record<string, string> = {
  INFO: "Info",
  LAUNCHING: "Launching",
  PROMO: "Promo",
  PENTING: "Penting",
};

export default function AnnouncementBoard() {
  if (announcements.length === 0) {
    return null;
  }

  // Tampilkan maksimal 2 pengumuman di homepage — sesuai PRD Bab 35.7
  const visibleAnnouncements = announcements.slice(0, 2);

  return (
    <div className="flex flex-col gap-3">
      {visibleAnnouncements.map((item) => (
        <div
          key={item.id}
          className="rounded-lg border border-primary/30 bg-primary/5 p-4"
        >
          <span className="text-xs font-semibold text-primary uppercase">
            {typeLabel[item.type]}
          </span>
          <p className="font-semibold text-foreground mt-1">{item.title}</p>
          <p className="text-sm text-foreground/70 mt-1">{item.content}</p>
        </div>
      ))}
    </div>
  );
}