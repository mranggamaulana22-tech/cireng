"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

type Feedback = {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function AdminFeedbackPage() {
  const supabase = createClient();

  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const { data } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });
    setFeedbackList(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function markAsRead(id: number) {
    await supabase.from("feedback").update({ is_read: true }).eq("id", id);
    loadData();
  }

  async function handleDelete(id: number) {
    const confirmDelete = confirm("Yakin ingin menghapus saran ini?");
    if (!confirmDelete) return;

    await supabase.from("feedback").delete().eq("id", id);
    loadData();
  }

  if (loading) {
    return <main className="max-w-2xl mx-auto px-4 py-8">Memuat...</main>;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-foreground mb-4">
        Saran & Masukan
      </h1>

      {feedbackList.length === 0 && (
        <p className="text-sm text-foreground/50">Belum ada saran masuk.</p>
      )}

      <div className="flex flex-col gap-3">
        {feedbackList.map((item) => (
          <div
            key={item.id}
            className={`border rounded-lg p-3 ${
              item.is_read ? "border-border" : "border-primary/30 bg-primary/5"
            }`}
          >
            <p className="text-sm text-foreground">{item.message}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-foreground/40">
                {new Date(item.created_at).toLocaleString("id-ID")}
              </p>
              <div className="flex gap-3">
                {!item.is_read && (
                  <button
                    onClick={() => markAsRead(item.id)}
                    className="text-xs text-primary hover:underline"
                  >
                    Tandai Dibaca
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
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