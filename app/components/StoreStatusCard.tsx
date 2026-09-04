import { supabase } from "../lib/supabase";

export default async function StoreStatusCard() {
  const { data: storeStatus } = await supabase
    .from("store_status")
    .select("*")
    .limit(1)
    .single();

  if (!storeStatus) {
    return null;
  }

  const isOpen = storeStatus.status === "OPEN";

  return (
    <div
      className={`rounded-lg border p-4 ${
        isOpen
          ? "bg-success/10 border-success/30"
          : "bg-foreground/5 border-border"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isOpen ? "bg-success" : "bg-foreground/40"
          }`}
        />
        <p
          className={`font-semibold ${
            isOpen ? "text-success" : "text-foreground/70"
          }`}
        >
          {isOpen ? "Sedang Buka" : "Sedang Tutup"}
        </p>
      </div>
      <p className="text-sm text-foreground/70 mt-1">
        {isOpen
          ? storeStatus.message
          : storeStatus.message || "Pesanan online sedang tidak tersedia."}
      </p>
      <p className="text-xs text-foreground/50 mt-1">
        Jam operasional: {storeStatus.operating_open_time} -{" "}
        {storeStatus.operating_close_time}
      </p>
    </div>
  );
}