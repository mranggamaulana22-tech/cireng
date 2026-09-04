"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

type StoreStatus = {
  id: number;
  status: string;
  message: string;
  operating_open_time: string;
  operating_close_time: string;
};

type Announcement = {
  id: number;
  type: string;
  title: string;
  content: string;
  is_published: boolean;
};

export default function AdminStatusPage() {
  const supabase = createClient();

  const [storeStatus, setStoreStatus] = useState<StoreStatus | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    setLoading(true);

    const { data: statusData } = await supabase
      .from("store_status")
      .select("*")
      .limit(1)
      .single();

    const { data: announcementData } = await supabase
      .from("announcements")
      .select("*")
      .order("id", { ascending: false });

    setStoreStatus(statusData);
    setAnnouncements(announcementData ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSaveStatus() {
    if (!storeStatus) return;
    setSaving(true);

    await supabase
      .from("store_status")
      .update({
        status: storeStatus.status,
        message: storeStatus.message,
      })
      .eq("id", storeStatus.id);

    setSaving(false);
    alert("Status berhasil disimpan.");
  }

  if (loading) {
    return <main className="max-w-2xl mx-auto px-4 py-8">Memuat...</main>;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-foreground mb-4">Status Toko</h1>

      <div className="border border-border rounded-lg p-4 flex flex-col gap-3">
        <div>
          <p className="text-sm text-foreground/70 mb-1">Status</p>
          <div className="flex gap-3">
            {["OPEN", "CLOSED"].map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <input
                  type="radio"
                  name="storeStatusRadio"
                  checked={storeStatus?.status === option}
                  onChange={() =>
                    setStoreStatus((prev) =>
                      prev ? { ...prev, status: option } : prev
                    )
                  }
                />
                {option === "OPEN" ? "Buka" : "Tutup"}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-foreground/70 mb-1">
            Pesan (opsional)
          </p>
          <input
            type="text"
            value={storeStatus?.message ?? ""}
            onChange={(e) =>
              setStoreStatus((prev) =>
                prev ? { ...prev, message: e.target.value } : prev
              )
            }
            placeholder="Contoh: Cireng sudah habis untuk hari ini"
            className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
          />
        </div>

        <button
          onClick={handleSaveStatus}
          disabled={saving}
          className="w-full py-2 rounded-md bg-primary text-primary-foreground font-medium text-sm disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Status"}
        </button>
      </div>

      <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
        Pengumuman
      </h2>

      <div className="flex flex-col gap-3">
        {announcements.length === 0 && (
          <p className="text-sm text-foreground/50">Belum ada pengumuman.</p>
        )}
        {announcements.map((item) => (
          <div
            key={item.id}
            className="border border-border rounded-lg p-3 flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-primary font-semibold uppercase">
                {item.type}
              </p>
              <p className="text-sm font-medium text-foreground">
                {item.title}
              </p>
              <p
                className={`text-xs mt-1 ${
                  item.is_published ? "text-success" : "text-foreground/50"
                }`}
              >
                {item.is_published ? "Published" : "Draft"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}