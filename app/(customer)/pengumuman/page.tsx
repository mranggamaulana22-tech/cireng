export const dynamic = "force-dynamic";

import { supabase } from "../../lib/supabase";

const typeLabel: Record<string, string> = {
  INFO: "Info",
  LAUNCHING: "Launching",
  PROMO: "Promo",
  PENTING: "Penting",
};

export default async function PengumumanPage() {
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_published", true)
    .order("id", { ascending: false });

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Pengumuman</h1>

      {(!announcements || announcements.length === 0) && (
        <p className="text-foreground/60">Belum ada pengumuman.</p>
      )}

      <div className="flex flex-col gap-3">
        {announcements?.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-primary/30 bg-primary/5 p-4"
          >
            <span className="text-xs font-semibold text-primary uppercase">
              {typeLabel[item.type] ?? item.type}
            </span>
            <p className="font-semibold text-foreground mt-1">{item.title}</p>
            <p className="text-sm text-foreground/70 mt-1">{item.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
}