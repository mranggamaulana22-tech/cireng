"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

type Location = {
  id: number;
  date: string;
  location_name: string;
  description: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
};

const emptyForm = {
  location_name: "",
  start_time: "",
  end_time: "",
  description: "",
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminLocationPage() {
  const supabase = createClient();

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function loadData() {
    setLoading(true);
    const { data } = await supabase
      .from("locations")
      .select("*")
      .order("id");
    setLocations(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(loc: Location) {
    setEditingId(loc.id);
    setForm({
      location_name: loc.location_name,
      start_time: loc.start_time,
      end_time: loc.end_time,
      description: loc.description ?? "",
    });
    setShowForm(true);
  }

  async function handleSubmit() {
    if (!form.location_name.trim() || !form.start_time || !form.end_time) {
      alert("Nama lokasi, jam mulai, dan jam selesai wajib diisi.");
      return;
    }

    setSaving(true);

    if (editingId) {
      await supabase
        .from("locations")
        .update({ ...form })
        .eq("id", editingId);
    } else {
      await supabase.from("locations").insert({
        ...form,
        date: today(),
        is_active: false,
      });
    }

    setSaving(false);
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    loadData();
  }

  async function handleActivate(id: number) {
    setSaving(true);

    // Matikan semua lokasi lain, aktifkan cuma yang dipilih
    await supabase.from("locations").update({ is_active: false }).neq("id", 0);
    await supabase
      .from("locations")
      .update({ is_active: true, date: today() })
      .eq("id", id);

    setSaving(false);
    loadData();
  }

  async function handleDelete(id: number) {
    const confirmDelete = confirm("Yakin ingin menghapus lokasi ini?");
    if (!confirmDelete) return;

    await supabase.from("locations").delete().eq("id", id);
    loadData();
  }

  if (loading) {
    return <main className="max-w-2xl mx-auto px-4 py-8">Memuat...</main>;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-foreground">
          Daftar Lokasi Jualan
        </h1>
        <button
          onClick={openAddForm}
          className="text-sm text-primary font-medium border border-primary/30 rounded-md px-3 py-1.5 hover:bg-primary/10 transition-colors"
        >
          + Tambah
        </button>
      </div>

      {showForm && (
        <div className="border border-border rounded-lg p-4 mb-4 flex flex-col gap-3">
          <p className="font-semibold text-foreground">
            {editingId ? "Edit Lokasi" : "Lokasi Baru"}
          </p>

          <div>
            <p className="text-sm text-foreground/70 mb-1">Nama Lokasi</p>
            <input
              type="text"
              value={form.location_name}
              onChange={(e) =>
                setForm({ ...form, location_name: e.target.value })
              }
              placeholder="Contoh: SD Susukan"
              className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-sm text-foreground/70 mb-1">Jam Mulai</p>
              <input
                type="text"
                value={form.start_time}
                onChange={(e) =>
                  setForm({ ...form, start_time: e.target.value })
                }
                placeholder="10.00"
                className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground/70 mb-1">Jam Selesai</p>
              <input
                type="text"
                value={form.end_time}
                onChange={(e) =>
                  setForm({ ...form, end_time: e.target.value })
                }
                placeholder="13.00"
                className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
              />
            </div>
          </div>

          <div>
            <p className="text-sm text-foreground/70 mb-1">
              Catatan (opsional)
            </p>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Contoh: Setelah itu lokasi mangkal"
              className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-2 rounded-md border border-border text-foreground text-sm"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 py-2 rounded-md bg-primary text-primary-foreground font-medium text-sm disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {locations.length === 0 && (
          <p className="text-sm text-foreground/50">Belum ada lokasi.</p>
        )}
        {locations.map((loc) => (
          <div
            key={loc.id}
            className={`border rounded-lg p-3 ${
              loc.is_active
                ? "border-primary/30 bg-primary/5"
                : "border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  {loc.location_name}{" "}
                  {loc.is_active && (
                    <span className="text-xs text-primary font-semibold ml-1">
                      (Aktif)
                    </span>
                  )}
                </p>
                <p className="text-sm text-foreground/60">
                  {loc.start_time} - {loc.end_time}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1">
                {!loc.is_active && (
                  <button
                    onClick={() => handleActivate(loc.id)}
                    className="text-xs text-primary hover:underline"
                  >
                    Aktifkan
                  </button>
                )}
                <button
                  onClick={() => openEditForm(loc)}
                  className="text-xs text-foreground/60 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(loc.id)}
                  className="text-xs text-foreground/40 hover:text-red-500 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}