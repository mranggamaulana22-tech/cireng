"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { computeIsOpen } from "../../lib/storeStatusHelper";

type StoreStatus = {
  id: number;
  status: string;
  message: string;
  operating_open_time: string;
  operating_close_time: string;
  delivery_fee_regular: number;
  delivery_fee_express: number;
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

  const [showForm, setShowForm] = useState(false);
  const [newType, setNewType] = useState("INFO");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
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
        operating_open_time: storeStatus.operating_open_time,
        operating_close_time: storeStatus.operating_close_time,
        delivery_fee_regular: storeStatus.delivery_fee_regular,
        delivery_fee_express: storeStatus.delivery_fee_express,
      })
      .eq("id", storeStatus.id);

    setSaving(false);
    alert("Status berhasil disimpan.");
  }

  async function handleAddAnnouncement() {
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Judul dan isi wajib diisi.");
      return;
    }

    setSaving(true);

    await supabase.from("announcements").insert({
      type: newType,
      title: newTitle,
      content: newContent,
      is_published: true,
    });

    setNewTitle("");
    setNewContent("");
    setNewType("INFO");
    setShowForm(false);
    setSaving(false);

    loadData(); // ambil ulang data terbaru, termasuk pengumuman yang baru ditambahkan
  }

  async function handleDeleteAnnouncement(id: number) {
    const confirmDelete = confirm("Yakin ingin menghapus pengumuman ini?");
    if (!confirmDelete) return;

    await supabase.from("announcements").delete().eq("id", id);
    loadData();
  }

  if (loading) {
    return <main className="max-w-2xl mx-auto px-4 py-8">Memuat...</main>;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-foreground mb-4">Status Toko</h1>

      <div className="border border-border rounded-lg p-4 flex flex-col gap-3">
        <div>
          <p className="text-sm text-foreground/70 mb-1">Mode Status</p>
          <div className="flex gap-3 flex-wrap">
            {[
              { value: "AUTO", label: "Otomatis" },
              { value: "OPEN", label: "Paksa Buka" },
              { value: "CLOSED", label: "Paksa Tutup" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <input
                  type="radio"
                  name="storeStatusRadio"
                  checked={storeStatus?.status === option.value}
                  onChange={() =>
                    setStoreStatus((prev) =>
                      prev ? { ...prev, status: option.value } : prev
                    )
                  }
                />
                {option.label}
              </label>
            ))}
          </div>
          {storeStatus?.status === "AUTO" && (
            <p className="text-xs text-foreground/50 mt-2">
              Status akan otomatis mengikuti Jam Buka dan Jam Tutup di bawah.
            </p>
          )}
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

        <div className="flex gap-3">
          <div className="flex-1">
            <p className="text-sm text-foreground/70 mb-1">Jam Buka</p>
            <input
              type="text"
              value={storeStatus?.operating_open_time ?? ""}
              onChange={(e) =>
                setStoreStatus((prev) =>
                  prev ? { ...prev, operating_open_time: e.target.value } : prev
                )
              }
              placeholder="10.00"
              className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-foreground/70 mb-1">Jam Tutup</p>
            <input
              type="text"
              value={storeStatus?.operating_close_time ?? ""}
              onChange={(e) =>
                setStoreStatus((prev) =>
                  prev ? { ...prev, operating_close_time: e.target.value } : prev
                )
              }
              placeholder="18.00"
              className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <p className="text-sm text-foreground/70 mb-1">
              Ongkir Reguler
            </p>
            <input
              type="number"
              value={storeStatus?.delivery_fee_regular ?? 0}
              onChange={(e) =>
                setStoreStatus((prev) =>
                  prev
                    ? { ...prev, delivery_fee_regular: Number(e.target.value) }
                    : prev
                )
              }
              className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-foreground/70 mb-1">
              Ongkir Express
            </p>
            <input
              type="number"
              value={storeStatus?.delivery_fee_express ?? 0}
              onChange={(e) =>
                setStoreStatus((prev) =>
                  prev
                    ? { ...prev, delivery_fee_express: Number(e.target.value) }
                    : prev
                )
              }
              className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
            />
          </div>
        </div>

        {storeStatus && (
          <p className="text-sm text-foreground/70">
            Status saat ini akan tampil sebagai:{" "}
            <span
              className={
                computeIsOpen(storeStatus)
                  ? "text-success font-semibold"
                  : "text-foreground/50 font-semibold"
              }
            >
              {computeIsOpen(storeStatus) ? "Buka" : "Tutup"}
            </span>
          </p>
        )}

        <button
          onClick={handleSaveStatus}
          disabled={saving}
          className="w-full py-2 rounded-md bg-primary text-primary-foreground font-medium text-sm disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Status"}
        </button>
      </div>

      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-xl font-bold text-foreground">Pengumuman</h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="text-sm text-primary font-medium border border-primary/30 rounded-md px-3 py-1.5 hover:bg-primary/10 transition-colors"
        >
          {showForm ? "Batal" : "+ Tambah"}
        </button>
      </div>

      {showForm && (
        <div className="border border-border rounded-lg p-4 mb-4 flex flex-col gap-3">
          <div>
            <p className="text-sm text-foreground/70 mb-1">Tipe</p>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
            >
              <option value="INFO">Info</option>
              <option value="LAUNCHING">Launching</option>
              <option value="PROMO">Promo</option>
              <option value="PENTING">Penting</option>
            </select>
          </div>

          <div>
            <p className="text-sm text-foreground/70 mb-1">Judul</p>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Contoh: Gratis Ongkir Area Seyegan"
              className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
            />
          </div>

          <div>
            <p className="text-sm text-foreground/70 mb-1">Isi</p>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={2}
              placeholder="Isi pengumuman..."
              className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
            />
          </div>

          <button
            onClick={handleAddAnnouncement}
            disabled={saving}
            className="w-full py-2 rounded-md bg-primary text-primary-foreground font-medium text-sm disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Pengumuman"}
          </button>
        </div>
      )}

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
            <button
              onClick={() => handleDeleteAnnouncement(item.id)}
              className="text-xs text-foreground/40 hover:text-red-500 transition-colors"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}